import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import type { DecisionModel, OptionScenarioProjection } from '../src/types/decision.js';
import { sanitizeDecisionModel } from '../src/utils/decision-validation.js';

export interface ServiceResult {
  status: number;
  body: unknown;
}

export type DecisionPayload = Record<string, unknown>;

const languages = { en: 'English', ru: 'Russian', fi: 'Finnish' } as const;
type Language = keyof typeof languages;

function parseLanguage(value: unknown): Language {
  return value === 'ru' || value === 'fi' ? value : 'en';
}

function getClient(): GoogleGenAI | null {
  const apiKey =
    process.env.DECISION_SERVICE_KEY?.trim() || process.env.GEMINI_API_KEY?.trim();
  return apiKey && apiKey !== 'MY_GEMINI_API_KEY' ? new GoogleGenAI({ apiKey }) : null;
}

type GenerationFailure = 'missing-credential' | 'quota' | 'provider';

interface GenerationResult<T> {
  data: T;
  generated: boolean;
  failure?: GenerationFailure;
}

const MODEL_TIMEOUT_MS = Number(process.env.ANALYSIS_MODEL_TIMEOUT_MS) || 40_000;
const ANALYSIS_MODELS = (process.env.ANALYSIS_MODELS ??
  'gemini-3.1-flash-lite,gemini-flash-latest,gemini-3.8-flash')
  .split(',')
  .map((model) => model.trim())
  .filter(Boolean);

function errorStatus(error: unknown): number | undefined {
  if (!error || typeof error !== 'object' || !('status' in error)) return undefined;
  const status = Number((error as { status?: unknown }).status);
  return Number.isFinite(status) ? status : undefined;
}

type AttemptResult<T> = { ok: true; data: T } | { ok: false; status?: number };

async function attemptModel<T>(
  client: GoogleGenAI,
  model: string,
  prompt: string,
  systemInstruction: string,
  controller: AbortController
): Promise<AttemptResult<T>> {
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, MODEL_TIMEOUT_MS);
  try {
    const result = await client.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        abortSignal: controller.signal,
        thinkingConfig: { thinkingBudget: Number(process.env.ANALYSIS_THINKING_BUDGET) || 0 },
      },
    });
    const text = result.text?.trim();
    if (!text) return { ok: false };
    return { ok: true, data: JSON.parse(text) as T };
  } catch (error) {
    const status = errorStatus(error);
    const message = timedOut
      ? `timed out after ${MODEL_TIMEOUT_MS}ms`
      : controller.signal.aborted
        ? 'cancelled because another model answered first'
        : status ?? error;
    console.error(`Generation with ${model} failed:`, message);
    return { ok: false, status };
  } finally {
    clearTimeout(timer);
  }
}

async function generateJson<T>(
  prompt: string,
  language: Language,
  fallback: T
): Promise<GenerationResult<T>> {
  const client = getClient();
  if (!client) return { data: fallback, generated: false, failure: 'missing-credential' };

  const systemInstruction = `Return valid JSON only. Write all user-facing text in ${languages[language]}. Preserve JSON keys, IDs, enum values, and numeric values exactly. Follow every requested field and minimum item count.`;
  const controllers = ANALYSIS_MODELS.map(() => new AbortController());
  let quotaHit = false;

  // Race the models: the first valid JSON wins, so a slow or overloaded model
  // never blocks the whole request. Worst case is one MODEL_TIMEOUT_MS.
  const attempts = ANALYSIS_MODELS.map((model, index) =>
    attemptModel<T>(client, model, prompt, systemInstruction, controllers[index])
  );

  const winner = await new Promise<T | undefined>((resolve) => {
    let pending = attempts.length;
    if (pending === 0) return resolve(undefined);
    for (const attempt of attempts) {
      attempt.then((result) => {
        if (result.ok) return resolve(result.data);
        if (result.status === 429) quotaHit = true;
        pending -= 1;
        if (pending === 0) resolve(undefined);
      });
    }
  });

  controllers.forEach((controller) => controller.abort());

  if (winner !== undefined) return { data: winner, generated: true };
  return { data: fallback, generated: false, failure: quotaHit ? 'quota' : 'provider' };
}

function hasCompleteAnalysis(value: unknown, optionCount: number): boolean {
  if (!value || typeof value !== 'object') return false;
  const analysis = value as Record<string, unknown>;
  const options = Array.isArray(analysis.options) ? analysis.options : [];
  const prosCons = Array.isArray(analysis.prosCons) ? analysis.prosCons : [];
  const criteria = Array.isArray(analysis.criteria) ? analysis.criteria : [];
  const swot = Array.isArray(analysis.swot) ? analysis.swot : [];
  const scenarios = Array.isArray(analysis.scenarios) ? analysis.scenarios : [];
  const blindSpots = Array.isArray(analysis.blindSpots) ? analysis.blindSpots : [];

  if (options.length !== optionCount || criteria.length < 4 || swot.length < optionCount || scenarios.length < optionCount || blindSpots.length < 3) {
    return false;
  }

  const optionIds = new Set<string>();
  const optionsAreComplete = options.every((option) => {
    if (!option || typeof option !== 'object' || !('id' in option)) return false;
    const optionId = String(option.id);
    optionIds.add(optionId);
    const factors = prosCons.filter((factor) =>
      !!factor && typeof factor === 'object' && 'optionId' in factor && factor.optionId === optionId
    );
    return factors.some((factor) => 'type' in factor && factor.type === 'pro') &&
      factors.some((factor) => 'type' in factor && factor.type === 'con');
  });
  if (!optionsAreComplete) return false;

  const criteriaAreComplete = criteria.every((criterion) => {
    if (!criterion || typeof criterion !== 'object' || !('scores' in criterion) || !Array.isArray(criterion.scores)) return false;
    const scores: unknown[] = criterion.scores;
    const ratedOptions = new Set(
      scores.filter((score) =>
        !!score && typeof score === 'object' && 'optionId' in score && optionIds.has(String(score.optionId)) &&
        'rationale' in score && typeof score.rationale === 'string' && score.rationale.trim().length > 12
      ).map((score) => String((score as Record<string, unknown>).optionId))
    );
    return optionIds.size === ratedOptions.size;
  });
  const allOptionsHaveSwot = [...optionIds].every((optionId) =>
    swot.some((item) => !!item && typeof item === 'object' && 'optionId' in item && item.optionId === optionId)
  );
  const allOptionsHaveScenarios = [...optionIds].every((optionId) => {
    const scenario = scenarios.find((item) =>
      !!item && typeof item === 'object' && 'optionId' in item && item.optionId === optionId
    );
    if (!scenario || typeof scenario !== 'object') return false;
    const cases = ['bestCase', 'mostLikelyCase', 'worstCase'] as const;
    const probabilities = cases.map((caseName) => {
      const detail = scenario[caseName];
      if (!detail || typeof detail !== 'object') return Number.NaN;
      if (!('headline' in detail) || typeof detail.headline !== 'string' || !detail.headline.trim()) return Number.NaN;
      if (!('narrative' in detail) || typeof detail.narrative !== 'string' || !detail.narrative.trim()) return Number.NaN;
      if (!('probabilityPercent' in detail)) return Number.NaN;
      const probability = Number(detail.probabilityPercent);
      return Number.isFinite(probability) && probability >= 0 && probability <= 100 ? probability : Number.NaN;
    });
    return probabilities.every(Number.isFinite) && Math.abs(probabilities.reduce((sum, probability) => sum + probability, 0) - 100) <= 2;
  });

  return criteriaAreComplete && allOptionsHaveSwot && allOptionsHaveScenarios;
}

function getAnalysisNotice(language: Language, failure?: GenerationFailure, incomplete = false): string | undefined {
  if (!failure && !incomplete) return undefined;
  if (language === 'ru') {
    if (failure === 'quota') return 'Сервис анализа достиг лимита запросов. Показаны общие шаблонные значения; не воспринимайте текущий рейтинг как персональную рекомендацию.';
    if (failure === 'missing-credential') return 'Сервис анализа не настроен. Показаны общие шаблонные значения; добавьте факторы и оценки перед использованием результата.';
    if (failure) return 'Сервис анализа временно недоступен. Показаны общие шаблонные значения; проверьте факторы и оценки.';
    return 'Ответ анализа неполный; недостающие разделы заполнены шаблонными значениями. Проверьте их перед использованием рейтинга.';
  }
  if (language === 'fi') {
    if (failure === 'quota') return 'Analyysipalvelun pyyntökiintiö on täynnä. Näytetään yleisiä malliarvoja; älä pidä pisteytystä henkilökohtaisena suosituksena.';
    if (failure === 'missing-credential') return 'Analyysipalvelua ei ole määritetty. Näytetään yleisiä malliarvoja; lisää tekijät ja arviot ennen tuloksen käyttöä.';
    if (failure) return 'Analyysipalvelu ei ole tilapäisesti käytettävissä. Näytetään yleisiä malliarvoja; tarkista tekijät ja arviot.';
    return 'Analyysivastaus oli puutteellinen; puuttuvat osat täytettiin malliarvoilla. Tarkista ne ennen pisteytykseen luottamista.';
  }
  if (failure === 'quota') return 'The analysis service has reached its request quota. Generic template values are shown; do not treat this score as a personalized recommendation.';
  if (failure === 'missing-credential') return 'The analysis service is not configured. Generic template values are shown; add factors and ratings before relying on the result.';
  if (failure) return 'The analysis service is temporarily unavailable. Generic template values are shown; review the factors and scores.';
  return 'The analysis response was incomplete; missing sections use template values. Review them before relying on the score.';
}

function makeFallbackDecision(
  dilemma: string,
  optionsInput: string[] | undefined,
  language: Language,
  context?: string,
  userProsCons?: Array<{ optionIndex: number; type: 'pro' | 'con'; title: string; weight: number }>
): DecisionModel {
  const copy = {
    en: {
      options: ['Option 1', 'Option 2'], category: 'Strategic Decision Model',
      summary: context ? `A structured comparison for ${dilemma}. Context: ${context}` : `A structured comparison of the available paths for: ${dilemma}`,
      tagline: ['Higher potential, with more effort', 'Lower transition cost, with more stability'],
      description: ['Prioritize this path to pursue the main objective.', 'Choose this path to preserve flexibility and limit risk.'],
      pros: ['Potential to make meaningful progress', 'Builds useful experience and momentum'],
      cons: ['Requires time and focused effort', 'Results may take longer than expected'],
      domain: ['Potential', 'Growth', 'Effort', 'Timeline'],
      impact: ['Directly supports the main objective.', 'Can create useful benefits over time.', 'Requires a clear plan and sustained attention.', 'Benefits may arrive later than expected.'],
      criteria: ['Alignment with the main goal', 'Cost and effort', 'Flexibility', 'Time to results'],
      blindSpots: ['What is the smallest test you can run before committing?', 'What would it cost to reverse this choice?', 'Which assumption would change your decision if it proved false?'],
    },
    ru: {
      options: ['Вариант 1', 'Вариант 2'], category: 'Стратегическая модель решения',
      summary: context ? `Структурированное сравнение вариантов для решения «${dilemma}». Контекст: ${context}` : `Структурированное сравнение доступных вариантов для решения: ${dilemma}`,
      tagline: ['Выше потенциал, но потребуется больше усилий', 'Ниже затраты на переход и выше стабильность'],
      description: ['Сделайте этот путь приоритетным, чтобы достичь главной цели.', 'Выберите этот путь, чтобы сохранить гибкость и ограничить риски.'],
      pros: ['Возможность добиться значимого прогресса', 'Помогает получить опыт и набрать темп'],
      cons: ['Потребуются время и сосредоточенные усилия', 'Результат может проявиться позже ожидаемого'],
      domain: ['Потенциал', 'Рост', 'Усилия', 'Сроки'],
      impact: ['Напрямую помогает достичь главной цели.', 'Со временем может принести дополнительные преимущества.', 'Потребуются чёткий план и постоянное внимание.', 'Результат может проявиться позже ожидаемого.'],
      criteria: ['Соответствие главной цели', 'Затраты и усилия', 'Гибкость', 'Срок получения результата'],
      blindSpots: ['Какой небольшой тест можно провести до принятия решения?', 'Сколько будет стоить отменить этот выбор?', 'Какое допущение изменит решение, если окажется неверным?'],
    },
    fi: {
      options: ['Vaihtoehto 1', 'Vaihtoehto 2'], category: 'Strateginen päätösmalli',
      summary: context ? `Jäsennelty vaihtoehtojen vertailu päätökseen ${dilemma}. Tausta: ${context}` : `Jäsennelty vertailu vaihtoehdoista päätökseen: ${dilemma}`,
      tagline: ['Enemmän potentiaalia, mutta enemmän työtä', 'Pienemmät siirtymäkulut ja vakaampi tilanne'],
      description: ['Aseta tämä polku etusijalle päätavoitteen saavuttamiseksi.', 'Valitse tämä polku joustavuuden säilyttämiseksi ja riskien rajaamiseksi.'],
      pros: ['Mahdollisuus saavuttaa merkittävää edistystä', 'Kerryttää hyödyllistä kokemusta ja vauhtia'],
      cons: ['Vaatii aikaa ja keskittynyttä työtä', 'Tulokset voivat näkyä odotettua myöhemmin'],
      domain: ['Potentiaali', 'Kasvu', 'Työmäärä', 'Aikataulu'],
      impact: ['Tukee suoraan päätavoitteen saavuttamista.', 'Voi tuoda ajan myötä lisähyötyjä.', 'Vaatii selkeän suunnitelman ja jatkuvaa huomiota.', 'Hyödyt voivat toteutua odotettua myöhemmin.'],
      criteria: ['Yhteys päätavoitteeseen', 'Kustannukset ja työmäärä', 'Joustavuus', 'Tulosten aikataulu'],
      blindSpots: ['Minkä pienen kokeen voit tehdä ennen sitoutumista?', 'Paljonko tämän valinnan peruuttaminen maksaisi?', 'Mikä oletus muuttaisi päätöksesi, jos se osoittautuisi vääräksi?'],
    },
  }[language];

  const suppliedOptions = optionsInput?.filter((option) => option.trim()).slice(0, 3);
  const optionNames = suppliedOptions && suppliedOptions.length >= 2 ? suppliedOptions : copy.options;
  const options = optionNames.map((name, index) => ({
    id: `opt-${index + 1}`,
    name,
    tagline: copy.tagline[index === 0 ? 0 : 1],
    description: copy.description[index === 0 ? 0 : 1],
  }));
  const generatedProsCons = options.flatMap((option, index) => {
    const first = index === 0;
    return [
      { id: `pc-${index}-pro`, optionId: option.id, type: 'pro' as const, title: copy.pros[first ? 0 : 1], impactNote: copy.impact[first ? 0 : 1], weight: first ? 4 : 3, domain: copy.domain[first ? 0 : 1] },
      { id: `pc-${index}-con`, optionId: option.id, type: 'con' as const, title: copy.cons[first ? 0 : 1], impactNote: copy.impact[first ? 2 : 3], weight: 3, domain: copy.domain[first ? 2 : 3] },
    ];
  });
  const customProsCons = (userProsCons || []).map((factor, index) => ({
    id: `pc-user-${index + 1}`,
    optionId: options[factor.optionIndex]?.id || options[0].id,
    type: factor.type,
    title: factor.title,
    impactNote: language === 'ru'
      ? 'Пользовательский фактор, учитываемый при сравнении вариантов.'
      : language === 'fi'
        ? 'Käyttäjän määrittämä tekijä, joka huomioidaan vaihtoehtojen vertailussa.'
        : 'User-provided factor included in the option comparison.',
    weight: Math.max(1, Math.min(5, Number(factor.weight) || 3)),
    domain: language === 'ru' ? 'Приоритет' : language === 'fi' ? 'Prioriteetti' : 'Priority',
  }));
  const prosCons = [...customProsCons, ...generatedProsCons];
  const criteria = copy.criteria.map((name, index) => ({
    id: `crit-${index + 1}`, name, description: `${name}: ${dilemma}`, weight: index === 0 ? 5 : 3,
    scores: options.map((option, optionIndex) => ({ optionId: option.id, score: optionIndex === 0 ? 4 : 3, rationale: option.description })),
  }));
  const swot = options.flatMap((option) => [
    { id: `sw-${option.id}-strength`, optionId: option.id, quadrant: 'strength' as const, title: copy.pros[0], detail: option.description, weight: 3, mitigationOrLeverage: option.tagline },
    { id: `sw-${option.id}-threat`, optionId: option.id, quadrant: 'threat' as const, title: copy.cons[0], detail: copy.impact[2], weight: 3, mitigationOrLeverage: copy.blindSpots[0] },
  ]);
  const scenarios: OptionScenarioProjection[] = options.map((option) => ({
    optionId: option.id,
    bestCase: { headline: language === 'ru' ? `Лучший исход: ${option.name}` : language === 'fi' ? `Paras lopputulos: ${option.name}` : `Best case: ${option.name}`, narrative: option.description, weightedImpactAnalysis: copy.impact[0], keyDriverOrContingency: copy.blindSpots[0], probabilityPercent: 25 },
    mostLikelyCase: { headline: language === 'ru' ? `Наиболее вероятный исход: ${option.name}` : language === 'fi' ? `Todennäköisin lopputulos: ${option.name}` : `Most likely: ${option.name}`, narrative: option.tagline, weightedImpactAnalysis: copy.impact[1], keyDriverOrContingency: copy.blindSpots[1], probabilityPercent: 55 },
    worstCase: { headline: language === 'ru' ? `Неблагоприятный исход: ${option.name}` : language === 'fi' ? `Huonoin lopputulos: ${option.name}` : `Worst case: ${option.name}`, narrative: copy.impact[2], weightedImpactAnalysis: copy.impact[3], keyDriverOrContingency: copy.blindSpots[2], probabilityPercent: 20 },
  }));

  return {
    id: 'generated-decision', title: dilemma, category: copy.category, createdAt: new Date().toISOString(),
    summary: copy.summary, options, prosCons, criteria, swot, scenarios, blindSpots: copy.blindSpots,
  };
}

function mergeTranslatedStrings(source: unknown, translated: unknown, key = ''): unknown {
  if (['id', 'optionId', 'type', 'quadrant', 'createdAt'].includes(key)) return source;
  if (typeof source === 'string') return typeof translated === 'string' ? translated : source;
  if (Array.isArray(source)) {
    return source.map((item, index) => mergeTranslatedStrings(item, Array.isArray(translated) ? translated[index] : undefined));
  }
  if (source && typeof source === 'object') {
    const translatedObject = translated && typeof translated === 'object' ? translated as Record<string, unknown> : {};
    return Object.fromEntries(Object.entries(source).map(([childKey, value]) => [
      childKey,
      mergeTranslatedStrings(value, translatedObject[childKey], childKey),
    ]));
  }
  return source;
}

export function isAnalysisConfigured(): boolean {
  return getClient() !== null;
}

function asPayload(input: unknown): DecisionPayload {
  return input && typeof input === 'object' ? (input as DecisionPayload) : {};
}

export async function analyzeDecision(input: unknown): Promise<ServiceResult> {
  const payload = asPayload(input);
  const language = parseLanguage(payload.language);
  const dilemma = typeof payload.dilemma === 'string' ? payload.dilemma.trim() : '';
  if (!dilemma) return { status: 400, body: { error: 'A decision question is required.' } };

  const requestedOptions = (Array.isArray(payload.optionsInput)
    ? payload.optionsInput
    : Array.isArray(payload.options)
      ? payload.options
      : undefined) as string[] | undefined;
  const context = typeof payload.context === 'string' ? payload.context : undefined;
  const userProsCons = (Array.isArray(payload.userProsCons)
    ? payload.userProsCons
    : undefined) as
    | Array<{ optionIndex: number; type: 'pro' | 'con'; title: string; weight: number }>
    | undefined;

  const fallback = makeFallbackDecision(dilemma, requestedOptions, language, context, userProsCons);
  const prompt = `Analyze the user's decision rather than filling a generic template.
Decision: ${dilemma}
Context and constraints: ${context && context.trim() ? context.trim() : 'Not provided; state important assumptions.'}
Exact options and required IDs: ${JSON.stringify(fallback.options.map(({ id, name }) => ({ id, name })))}
User-specified factors and importance weights: ${JSON.stringify(userProsCons || [])}

Return a complete JSON decision model. The response MUST use exactly this structure (one example item per array; expand it to the required counts, do not add or rename keys):

{
  "title": "string",
  "category": "string",
  "summary": "string",
  "options": [{ "id": "opt-1", "name": "string", "tagline": "string", "description": "string" }],
  "prosCons": [{ "id": "pc-1", "optionId": "opt-1", "type": "pro", "title": "string", "impactNote": "string", "weight": 4, "domain": "string" }],
  "criteria": [{ "id": "crit-1", "name": "string", "description": "string", "weight": 5, "scores": [{ "optionId": "opt-1", "score": 4, "rationale": "string" }] }],
  "swot": [{ "id": "sw-1", "optionId": "opt-1", "quadrant": "strength", "title": "string", "detail": "string", "weight": 3, "mitigationOrLeverage": "string" }],
  "scenarios": [{ "optionId": "opt-1", "bestCase": { "headline": "string", "narrative": "string", "weightedImpactAnalysis": "string", "keyDriverOrContingency": "string", "probabilityPercent": 25 }, "mostLikelyCase": { "headline": "string", "narrative": "string", "weightedImpactAnalysis": "string", "keyDriverOrContingency": "string", "probabilityPercent": 55 }, "worstCase": { "headline": "string", "narrative": "string", "weightedImpactAnalysis": "string", "keyDriverOrContingency": "string", "probabilityPercent": 20 } }],
  "blindSpots": ["string"]
}

Rules: criteria are arrays of scored objects in a "scores" array keyed by optionId - never nest options as keys like {"opt-1": {...}}. scenarios contain ONE object per option, keyed by optionId, with bestCase/mostLikelyCase/worstCase sub-objects - never a flat list of {type, probability, description}. Keep the supplied options' meaning and order. For EACH option include a distinct, decision-specific tagline and description, at least two concrete pros and two concrete cons with impact notes and 1-5 weights, at least four weighted comparison criteria with a score and specific rationale for every option, AT LEAST TWO SWOT ITEMS PER OPTION (e.g. one strength and one threat for each option, plus optional weakness/opportunity items), and best/most-likely/worst scenarios with probabilities totaling 100. Include at least three decision-specific blind spots. Do not reuse generic factors across options. Avoid assigning equal scores merely for symmetry: distinguish options where evidence supports it, but do not invent the user's personal preferences or facts. State uncertainty and scoring assumptions in the summary; only call it a tie when the evidence and supplied weights genuinely support a tie.

For decisions involving alcohol or another health risk, do not describe either option as safe; distinguish beverage choice from amount consumed, avoid inventing serving sizes or personal preferences, and mention abstaining as the lower-risk baseline when relevant.

Use these option IDs consistently in every section: ${fallback.options.map((option) => option.id).join(', ')}. Enum values must be pros/cons = pro or con and SWOT quadrant = strength, weakness, opportunity, or threat. Return JSON only.`;

  const result = await generateJson<unknown>(prompt, language, fallback);
  const complete = result.generated && hasCompleteAnalysis(result.data, fallback.options.length);
  if (!complete && result.generated && process.env.DEBUG_ANALYSIS === 'true') {
    console.error('Incomplete analysis payload:', JSON.stringify(result.data));
  }
  const model: DecisionModel = complete ? sanitizeDecisionModel(result.data, fallback) : fallback;
  const analysisNotice = getAnalysisNotice(language, result.failure, !result.failure && !complete);
  return { status: 200, body: { ...model, analysisNotice } };
}

export async function translateDecision(input: unknown): Promise<ServiceResult> {
  const payload = asPayload(input);
  const language = parseLanguage(payload.language);
  const decision = payload.decision;
  if (!decision || typeof decision !== 'object') {
    return { status: 400, body: { error: 'A decision model is required.' } };
  }
  if (!getClient()) {
    return {
      status: 503,
      body: {
        error:
          'Translation is unavailable. Configure the server credential to translate saved decisions.',
      },
    };
  }
  const translation = await generateJson<unknown>(
    `Translate all user-facing text in this decision model into ${languages[language]}. Preserve every JSON key, ID, enum value, number, probability, and array order. Do not summarize, omit, or alter user-entered meaning. Return the same JSON structure.\n${JSON.stringify(decision)}`,
    language,
    null
  );
  if (!translation.generated || !translation.data) {
    return { status: 502, body: { error: 'The decision could not be translated.' } };
  }
  return { status: 200, body: mergeTranslatedStrings(decision, translation.data) };
}

export async function generateScenarios(input: unknown): Promise<ServiceResult> {
  const payload = asPayload(input);
  const language = parseLanguage(payload.language);
  const options = Array.isArray(payload.options) ? payload.options : [];
  const fallback = {
    scenarios: options.map((option: { id: string; name: string; tagline?: string; description?: string }) => ({
      optionId: option.id,
      bestCase: { headline: option.name, narrative: option.description || option.name, weightedImpactAnalysis: '', keyDriverOrContingency: '', probabilityPercent: 25 },
      mostLikelyCase: { headline: option.name, narrative: option.tagline || option.name, weightedImpactAnalysis: '', keyDriverOrContingency: '', probabilityPercent: 55 },
      worstCase: { headline: option.name, narrative: option.description || option.name, weightedImpactAnalysis: '', keyDriverOrContingency: '', probabilityPercent: 20 },
    })),
  };
  const result = await generateJson(
    `Create best, most likely, and worst case projections in ${languages[language]} for this decision. Ground them in the supplied factors and return JSON {"scenarios":[...]}. Preserve optionId values. Input: ${JSON.stringify(payload)}`,
    language,
    fallback
  );
  return { status: 200, body: result.data };
}

export async function challengeDecision(input: unknown): Promise<ServiceResult> {
  const payload = asPayload(input);
  const language = parseLanguage(payload.language);
  const fallback = {
    counterThesis: language === 'ru' ? 'Проверьте ключевые допущения: задержки и дополнительные затраты могут изменить преимущество.' : language === 'fi' ? 'Tarkista keskeiset oletukset: viiveet ja lisäkustannukset voivat muuttaa etua.' : 'Test the key assumptions: delays and added costs could change the current lead.',
    reversalTrigger: language === 'ru' ? 'Пересмотрите решение, если затраты превысят план более чем на 20%.' : language === 'fi' ? 'Arvioi päätös uudelleen, jos kustannukset ylittävät arvion yli 20 %.' : 'Revisit the decision if costs exceed the estimate by more than 20%.',
    suggestedProsCons: [],
    suggestedSwot: [],
  };
  const result = await generateJson(
    `Challenge this decision in ${languages[language]}. Return JSON with counterThesis, reversalTrigger, suggestedProsCons, and suggestedSwot. Preserve option IDs. Input: ${JSON.stringify(payload)}`,
    language,
    fallback
  );
  return { status: 200, body: result.data };
}
