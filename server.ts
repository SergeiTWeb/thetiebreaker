import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import type { DecisionModel, OptionScenarioProjection } from './src/types/decision';
import { sanitizeDecisionModel } from './src/utils/decision-validation';

const app = express();
const port = Number(process.env.PORT) || 3000;
const directory = path.dirname(fileURLToPath(import.meta.url));
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

async function generateJson<T>(prompt: string, language: Language, fallback: T): Promise<T> {
  const client = getClient();
  if (!client) return fallback;

  const systemInstruction = `Return valid JSON only. Write all user-facing text in ${languages[language]}. Preserve JSON keys, IDs, enum values, and numeric values exactly.`;
  for (const model of ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite']) {
    try {
      const result = await client.models.generateContent({
        model,
        contents: prompt,
        config: { systemInstruction, responseMimeType: 'application/json' },
      });
      const text = result.text?.trim();
      if (text) return JSON.parse(text) as T;
    } catch (error) {
      console.error(`Generation with ${model} failed:`, error);
    }
  }
  return fallback;
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

app.use(express.json({ limit: '1mb' }));

app.post('/api/decision/analyze', async (req, res) => {
  const language = parseLanguage(req.body?.language);
  const dilemma = typeof req.body?.dilemma === 'string' ? req.body.dilemma.trim() : '';
  if (!dilemma) return res.status(400).json({ error: 'A decision question is required.' });
  const fallback = makeFallbackDecision(
    dilemma,
    req.body?.options,
    language,
    req.body?.context,
    req.body?.userProsCons
  );
  const result = await generateJson<unknown>(
    `Create a balanced decision analysis for this question: ${dilemma}\nContext: ${req.body?.context || 'None provided'}\nOptions: ${JSON.stringify(req.body?.options || fallback.options.map((option) => option.name))}\nUser factors: ${JSON.stringify(req.body?.userProsCons || [])}\nReturn JSON with title, category, summary, options, prosCons, criteria, swot, scenarios, and blindSpots. Keep IDs and enum values valid.`,
    language,
    fallback
  );
  res.json(sanitizeDecisionModel(result, fallback));
});

app.post('/api/decision/translate', async (req, res) => {
  const language = parseLanguage(req.body?.language);
  const decision = req.body?.decision;
  if (!decision || typeof decision !== 'object') return res.status(400).json({ error: 'A decision model is required.' });
  if (!getClient()) return res.status(503).json({ error: 'Translation is unavailable. Configure the server credential to translate saved decisions.' });
  const translated = await generateJson<unknown>(
    `Translate all user-facing text in this decision model into ${languages[language]}. Preserve every JSON key, ID, enum value, number, probability, and array order. Do not summarize, omit, or alter user-entered meaning. Return the same JSON structure.\n${JSON.stringify(decision)}`,
    language,
    null
  );
  if (!translated) return res.status(502).json({ error: 'The decision could not be translated.' });
  res.json(mergeTranslatedStrings(decision, translated));
});

app.post('/api/decision/scenarios', async (req, res) => {
  const language = parseLanguage(req.body?.language);
  const options = Array.isArray(req.body?.options) ? req.body.options : [];
  const fallback = {
    scenarios: options.map((option: { id: string; name: string; tagline?: string; description?: string }) => ({
      optionId: option.id,
      bestCase: { headline: option.name, narrative: option.description || option.name, weightedImpactAnalysis: '', keyDriverOrContingency: '', probabilityPercent: 25 },
      mostLikelyCase: { headline: option.name, narrative: option.tagline || option.name, weightedImpactAnalysis: '', keyDriverOrContingency: '', probabilityPercent: 55 },
      worstCase: { headline: option.name, narrative: option.description || option.name, weightedImpactAnalysis: '', keyDriverOrContingency: '', probabilityPercent: 20 },
    })),
  };
  const result = await generateJson(
    `Create best, most likely, and worst case projections in ${languages[language]} for this decision. Ground them in the supplied factors and return JSON {"scenarios":[...]}. Preserve optionId values. Input: ${JSON.stringify(req.body)}`,
    language,
    fallback
  );
  res.json(result);
});

app.post('/api/decision/challenge', async (req, res) => {
  const language = parseLanguage(req.body?.language);
  const fallback = {
    counterThesis: language === 'ru' ? 'Проверьте ключевые допущения: задержки и дополнительные затраты могут изменить преимущество.' : language === 'fi' ? 'Tarkista keskeiset oletukset: viiveet ja lisäkustannukset voivat muuttaa etua.' : 'Test the key assumptions: delays and added costs could change the current lead.',
    reversalTrigger: language === 'ru' ? 'Пересмотрите решение, если затраты превысят план более чем на 20%.' : language === 'fi' ? 'Arvioi päätös uudelleen, jos kustannukset ylittävät arvion yli 20 %.' : 'Revisit the decision if costs exceed the estimate by more than 20%.',
    suggestedProsCons: [],
    suggestedSwot: [],
  };
  const result = await generateJson(
    `Challenge this decision in ${languages[language]}. Return JSON with counterThesis, reversalTrigger, suggestedProsCons, and suggestedSwot. Preserve option IDs. Input: ${JSON.stringify(req.body)}`,
    language,
    fallback
  );
  res.json(result);
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(directory, 'dist')));
    app.get('*', (_req, res) => res.sendFile(path.join(directory, 'dist', 'index.html')));
  }
  app.listen(port, '0.0.0.0', () => console.log(`The Tiebreaker is running on http://localhost:${port}`));
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exitCode = 1;
});