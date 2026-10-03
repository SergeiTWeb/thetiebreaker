import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Download,
  RotateCcw,
  Loader2,
  Trash2,
  CheckCircle2,
  Scale,
  AlertCircle,
  Sun,
  Moon,
  Globe,
  Award,
} from 'lucide-react';
import {
  DecisionModel,
  FrameworkTab,
  ProConItem,
  ComparisonCriterion,
  SwotItem,
  OptionScenarioProjection,
} from './types/decision';
import { computeOptionScores, normalizeToFiveScale } from './utils/scoring';
import {
  Language,
  LANGUAGE_LABELS,
  TRANSLATIONS,
  getLocalizedSampleDecisions,
} from './i18n/translations';
import { ProsConsView } from './components/ProsConsView';
import { ComparisonMatrixView } from './components/ComparisonMatrixView';
import { ScenarioExplorerView } from './components/ScenarioExplorerView';
import { SwotAnalysisView } from './components/SwotAnalysisView';
import { SensitivityVerdictView } from './components/SensitivityVerdictView';
import { NewDecisionModal } from './components/NewDecisionModal';
import { apiUrl } from './utils/api';

const STORAGE_KEY = 'the_tiebreaker_decisions_v3';
const THEME_STORAGE_KEY = 'the_tiebreaker_theme';
const LANG_STORAGE_KEY = 'the_tiebreaker_language';
const WELCOME_STORAGE_KEY = 'the_tiebreaker_welcome_seen_v2';
const TRANSLATION_CACHE_KEY = 'the_tiebreaker_translation_cache_v2';
const SAMPLE_IDS = new Set(['dec-product-arch', 'dec-career-pivot']);

function isDecisionList(value: unknown): value is DecisionModel[] {
  if (!Array.isArray(value) || value.length === 0) return false;

  return value.every(
    (decision) =>
      !!decision &&
      typeof decision === 'object' &&
      typeof (decision as DecisionModel).id === 'string' &&
      typeof (decision as DecisionModel).title === 'string' &&
      Array.isArray((decision as DecisionModel).options) &&
      Array.isArray((decision as DecisionModel).prosCons) &&
      Array.isArray((decision as DecisionModel).criteria) &&
      Array.isArray((decision as DecisionModel).swot)
  );
}

function mergeTranslatedText<T>(source: T, translated: unknown, key = ''): T {
  if (['id', 'optionId', 'type', 'quadrant', 'createdAt'].includes(key)) return source;
  if (typeof source === 'string') {
    return (typeof translated === 'string' ? translated : source) as T;
  }
  if (Array.isArray(source)) {
    return source.map((item, index) =>
      mergeTranslatedText(item, Array.isArray(translated) ? translated[index] : undefined)
    ) as T;
  }
  if (source && typeof source === 'object') {
    const translatedObject =
      translated && typeof translated === 'object'
        ? (translated as Record<string, unknown>)
        : {};
    return Object.fromEntries(
      Object.entries(source).map(([childKey, value]) => [
        childKey,
        mergeTranslatedText(value, translatedObject[childKey], childKey),
      ])
    ) as T;
  }
  return source;
}

function getTranslationSnapshot(value: unknown, key = ''): unknown {
  if (typeof value === 'string') return key === 'createdAt' ? null : value;
  if (Array.isArray(value)) return value.map((item) => getTranslationSnapshot(item));
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([childKey, childValue]) => [
        childKey,
        getTranslationSnapshot(childValue, childKey),
      ])
    );
  }
  return null;
}

function matchesTranslationSnapshot(left: unknown, right: unknown): boolean {
  return JSON.stringify(getTranslationSnapshot(left)) ===
    JSON.stringify(getTranslationSnapshot(right));
}

function readCachedTranslation(
  decision: DecisionModel,
  sourceLanguage: Language,
  targetLanguage: Language
): DecisionModel | null {
  try {
    const saved = localStorage.getItem(TRANSLATION_CACHE_KEY);
    if (!saved) return null;
    const cache = JSON.parse(saved) as Record<
      string,
      Partial<Record<Language, DecisionModel>>
    >;
    const versions = cache[decision.id];
    if (!matchesTranslationSnapshot(versions?.[sourceLanguage], decision)) {
      return null;
    }
    return versions?.[targetLanguage] || null;
  } catch {
    return null;
  }
}

function cacheTranslation(
  decision: DecisionModel,
  sourceLanguage: Language,
  targetLanguage: Language,
  translated: unknown
) {
  try {
    const saved = localStorage.getItem(TRANSLATION_CACHE_KEY);
    const cache = saved
      ? (JSON.parse(saved) as Record<
          string,
          Partial<Record<Language, DecisionModel>>
        >)
      : {};
    const currentVersions = cache[decision.id];
    const versions =
      matchesTranslationSnapshot(currentVersions?.[sourceLanguage], decision)
        ? currentVersions
        : { [sourceLanguage]: decision };
    cache[decision.id] = {
      ...versions,
      [targetLanguage]: translated as DecisionModel,
    };
    localStorage.setItem(TRANSLATION_CACHE_KEY, JSON.stringify(cache));
  } catch {
    return;
  }
}

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {

    }
    return 'light';
  });

  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === 'en' || saved === 'ru' || saved === 'fi') return saved;
    } catch {

    }
    return 'en';
  });

  const t = TRANSLATIONS[language];

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {

    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, language);
    } catch {

    }
  }, [language]);

  const [decisions, setDecisions] = useState<DecisionModel[]>(() => {
    const localizedDefaults = getLocalizedSampleDecisions(language);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (isDecisionList(parsed)) {
          return parsed;
        }
      }
    } catch {

    }
    return localizedDefaults;
  });

  const [isTranslatingDecisions, setIsTranslatingDecisions] = useState(false);
  const [languageChangeError, setLanguageChangeError] = useState<string | null>(null);

  const handleSelectLanguage = async (newLang: Language) => {
    if (newLang === language || isTranslatingDecisions) return;
    setLanguageChangeError(null);
    setIsTranslatingDecisions(true);

    try {
      const customDecisions = decisions.filter((decision) => !SAMPLE_IDS.has(decision.id));
      const translatedEntries = await Promise.all(
        customDecisions.map(async (decision) => {
          const cached = readCachedTranslation(decision, language, newLang);
          if (cached) return [decision.id, cached] as const;

          const response = await fetch(apiUrl('/api/decision/translate'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ decision, language: newLang }),
          });
          const translated = await response.json();
          if (!response.ok) throw new Error(translated.error || 'Translation failed.');
          cacheTranslation(decision, language, newLang, translated);
          return [decision.id, translated] as const;
        })
      );
      const translatedMap = new Map(translatedEntries);
      const localizedSamples = getLocalizedSampleDecisions(newLang);
      const sampleMap = new Map(localizedSamples.map((decision) => [decision.id, decision]));

      setDecisions((current) =>
        current.map((decision) => {
          if (SAMPLE_IDS.has(decision.id)) return sampleMap.get(decision.id) || decision;
          const translated = translatedMap.get(decision.id);
          return translated ? mergeTranslatedText(decision, translated) : decision;
        })
      );
      setLanguage(newLang);
    } catch {
      setLanguageChangeError(
        language === 'ru'
          ? 'Не удалось перевести сохранённые решения. Проверьте подключение и настройки сервиса.'
          : language === 'fi'
            ? 'Tallennettujen päätösten kääntäminen epäonnistui. Tarkista yhteys ja palvelun asetukset.'
            : 'Saved decisions could not be translated. Check the connection and service configuration.'
      );
    } finally {
      setIsTranslatingDecisions(false);
    }
  };

  const [activeDecisionId, setActiveDecisionId] = useState<string>(
    () => decisions[0]?.id || 'dec-product-arch'
  );
  const [activeTab, setActiveTab] = useState<FrameworkTab>('pros-cons');
  const [frameworkWeights, setFrameworkWeights] = useState<{
    prosCons: number;
    matrix: number;
    swot: number;
  }>({
    prosCons: 1,
    matrix: 1,
    swot: 1,
  });

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState<boolean>(() => {
    try {
      return localStorage.getItem(WELCOME_STORAGE_KEY) !== 'true';
    } catch {
      return true;
    }
  });

  const dismissWelcome = () => {
    setShowWelcome(false);
    try {
      localStorage.setItem(WELCOME_STORAGE_KEY, 'true');
    } catch {

    }
  };

  const getLocalizedDefaultOptionName = (index: number) => {
    if (language === 'ru') return `Вариант ${index + 1}`;
    if (language === 'fi') return `Vaihtoehto ${index + 1}`;
    return `Option ${index + 1}`;
  };

  const getLocalizedTimestamp = () => {
    if (language === 'ru') return 'Только что';
    if (language === 'fi') return 'Juuri nyt';
    return 'Just now';
  };

  const getLocalizedDecisionCategory = () => {
    if (language === 'ru') return 'Стратегическая модель решения';
    if (language === 'fi') return 'Strateginen päätösmalli';
    return 'Strategic Decision';
  };

  const [quickPrompt, setQuickPrompt] = useState('');
  const [quickLoading, setQuickLoading] = useState(false);
  const [quickError, setQuickError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(decisions));
    } catch {

    }
  }, [decisions]);

  const activeDecision = useMemo(() => {
    return decisions.find((d) => d.id === activeDecisionId) || decisions[0];
  }, [decisions, activeDecisionId]);

  const optionScores = useMemo(() => {
    if (!activeDecision) return [];
    return computeOptionScores(activeDecision, frameworkWeights);
  }, [activeDecision, frameworkWeights]);

  const updateActiveDecision = (updater: (prev: DecisionModel) => DecisionModel) => {
    setDecisions((prev) =>
      prev.map((d) => (d.id === activeDecision.id ? updater(d) : d))
    );
  };

  const handleUpdateProConWeight = (id: string, weight: number) => {
    updateActiveDecision((prev) => ({
      ...prev,
      prosCons: prev.prosCons.map((p) => (p.id === id ? { ...p, weight } : p)),
    }));
  };

  const handleDeleteProCon = (id: string) => {
    updateActiveDecision((prev) => ({
      ...prev,
      prosCons: prev.prosCons.filter((p) => p.id !== id),
    }));
  };

  const handleAddProCon = (newItem: Omit<ProConItem, 'id'>) => {
    const id = `pc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    updateActiveDecision((prev) => ({
      ...prev,
      prosCons: [...prev.prosCons, { ...newItem, id }],
    }));
  };

  const handleUpdateCriterionWeight = (criterionId: string, weight: number) => {
    updateActiveDecision((prev) => ({
      ...prev,
      criteria: prev.criteria.map((c) =>
        c.id === criterionId ? { ...c, weight } : c
      ),
    }));
  };

  const handleUpdateOptionScore = (
    criterionId: string,
    optionId: string,
    score: number
  ) => {
    updateActiveDecision((prev) => ({
      ...prev,
      criteria: prev.criteria.map((c) => {
        if (c.id !== criterionId) return c;
        const existing = c.scores.find((s) => s.optionId === optionId);
        if (existing) {
          return {
            ...c,
            scores: c.scores.map((s) =>
              s.optionId === optionId ? { ...s, score } : s
            ),
          };
        }
        return {
          ...c,
          scores: [...c.scores, { optionId, score, rationale: 'Updated rating' }],
        };
      }),
    }));
  };

  const handleDeleteCriterion = (criterionId: string) => {
    updateActiveDecision((prev) => ({
      ...prev,
      criteria: prev.criteria.filter((c) => c.id !== criterionId),
    }));
  };

  const handleAddCriterion = (newCrit: Omit<ComparisonCriterion, 'id'>) => {
    const id = `crit-${Date.now()}`;
    updateActiveDecision((prev) => ({
      ...prev,
      criteria: [...prev.criteria, { ...newCrit, id }],
    }));
  };

  const handleUpdateScenarios = (scenarios: OptionScenarioProjection[]) => {
    updateActiveDecision((prev) => ({
      ...prev,
      scenarios,
    }));
  };

  const handleUpdateSwotWeight = (id: string, weight: number) => {
    updateActiveDecision((prev) => ({
      ...prev,
      swot: prev.swot.map((s) => (s.id === id ? { ...s, weight } : s)),
    }));
  };

  const handleDeleteSwot = (id: string) => {
    updateActiveDecision((prev) => ({
      ...prev,
      swot: prev.swot.filter((s) => s.id !== id),
    }));
  };

  const handleAddSwot = (newItem: Omit<SwotItem, 'id'>) => {
    const id = `sw-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    updateActiveDecision((prev) => ({
      ...prev,
      swot: [...prev.swot, { ...newItem, id }],
    }));
  };

  const handleCreatedDecision = (newDecision: DecisionModel) => {
    setDecisions((prev) => [newDecision, ...prev]);
    setActiveDecisionId(newDecision.id);
    setActiveTab('pros-cons');
    dismissWelcome();
  };

  const handleDeleteDecision = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (decisions.length <= 1) return;
    const filtered = decisions.filter((d) => d.id !== id);
    setDecisions(filtered);
    if (activeDecisionId === id) {
      setActiveDecisionId(filtered[0].id);
    }
  };

  const handleResetSamples = () => {
    const localized = getLocalizedSampleDecisions(language);
    setDecisions(localized);
    setActiveDecisionId(localized[0].id);
    setFrameworkWeights({ prosCons: 1, matrix: 1, swot: 1 });
  };

  const handleQuickAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPrompt.trim() || quickLoading) return;

    setQuickLoading(true);
    setQuickError(null);

    try {
      const response = await fetch(apiUrl('/api/decision/analyze'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dilemma: quickPrompt.trim(), language }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze decision.');
      }

      const newModel: DecisionModel = {
        id: `dec-${Date.now()}`,
        createdAt: getLocalizedTimestamp(),
        title: data.title || quickPrompt.trim(),
        category: data.category || getLocalizedDecisionCategory(),
        summary: data.summary || quickPrompt.trim(),
        options:
          Array.isArray(data.options) && data.options.length >= 2
            ? data.options
            : [
                {
                  id: 'opt-1',
                  name: getLocalizedDefaultOptionName(0),
                  tagline:
                    language === 'ru'
                      ? 'Основной путь'
                      : language === 'fi'
                        ? 'Ensisijainen vaihtoehto'
                        : 'Primary path',
                  description:
                    language === 'ru'
                      ? 'Первый вариант решения.'
                      : language === 'fi'
                        ? 'Ensimmäinen vaihtoehto.'
                        : 'First path',
                },
                {
                  id: 'opt-2',
                  name: getLocalizedDefaultOptionName(1),
                  tagline:
                    language === 'ru'
                      ? 'Альтернативный путь'
                      : language === 'fi'
                        ? 'Vaihtoehtoinen reitti'
                        : 'Alternative path',
                  description:
                    language === 'ru'
                      ? 'Второй вариант решения.'
                      : language === 'fi'
                        ? 'Toinen vaihtoehto.'
                        : 'Second path',
                },
              ],
        prosCons: Array.isArray(data.prosCons) ? data.prosCons : [],
        criteria: Array.isArray(data.criteria) ? data.criteria : [],
        swot: Array.isArray(data.swot) ? data.swot : [],
        scenarios: Array.isArray(data.scenarios) ? data.scenarios : undefined,
        blindSpots: Array.isArray(data.blindSpots) ? data.blindSpots : [],
      };

      setDecisions((prev) => [newModel, ...prev]);
      setActiveDecisionId(newModel.id);
      setQuickPrompt('');
    } catch (err: unknown) {
      setQuickError(
        err instanceof Error
          ? err.message
          : language === 'ru'
            ? 'Не удалось сформировать анализ решения.'
            : language === 'fi'
              ? 'Päätöksen analyysia ei voitu luoda.'
              : 'Unable to generate decision analysis.'
      );
    } finally {
      setQuickLoading(false);
    }
  };

  const handleExportMarkdown = () => {
    if (!activeDecision) return;
    const leader = optionScores[0];
    const runnerUp = optionScores[1] || optionScores[0];
    const lines: string[] = [
      `# ${activeDecision.title}`,
      `**Category:** ${activeDecision.category} | **Created:** ${activeDecision.createdAt}`,
      '',
      `> ${activeDecision.summary}`,
      '',
      `## Brief Conclusion`,
      leader
        ? `**${t.theDecisionShouldBe} ${leader.option.name}** (${leader.compositeScore.toFixed(1)} / 100 vs ${runnerUp.option.name} ${runnerUp.compositeScore.toFixed(1)} / 100)`
        : '',
      '',
      `## Composite Tiebreaker Ranking`,
      ...optionScores.map(
        (s, idx) =>
          `${idx + 1}. **${s.option.name}** — Composite Score: **${s.compositeScore.toFixed(1)}/100** (Pros/Cons: ${s.prosConsScore.toFixed(0)} | Matrix: ${s.matrixScore.toFixed(0)} | Scenario Expected: ${s.scenarioExpectedScore.toFixed(0)} | SWOT: ${s.swotScore.toFixed(0)})`
      ),
      '',
      `## 1. Weighted Pros & Cons (1-5 Scale)`,
      ...activeDecision.prosCons.map((p) => {
        const opt = activeDecision.options.find((o) => o.id === p.optionId);
        return `- **[${p.type.toUpperCase()} | Weight ${normalizeToFiveScale(p.weight)}/5 | ${opt?.name || p.optionId}]** ${p.title} — _${p.impactNote}_`;
      }),
      '',
      `## 2. Weighted Decision Matrix (1-5 Scale)`,
      ...activeDecision.criteria.map((c) => {
        const ratings = c.scores
          .map((sc) => {
            const opt = activeDecision.options.find((o) => o.id === sc.optionId);
            return `${opt?.name}: ${normalizeToFiveScale(sc.score)}/5`;
          })
          .join(' | ');
        return `- **${c.name}** (Weight ${normalizeToFiveScale(c.weight)}/5): ${ratings}`;
      }),
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeDecision.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-brief.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const leader = optionScores[0];
  const runnerUp = optionScores[1] || optionScores[0];
  const leadMargin =
    leader && runnerUp ? leader.compositeScore - runnerUp.compositeScore : 0;
  const isTie = leadMargin < 1.5;

  const topWinningFactor = useMemo(() => {
    if (!activeDecision || !leader) return 'Weighted evaluation';
    const winnerPros = activeDecision.prosCons
      .filter((p) => p.optionId === leader.option.id && p.type === 'pro')
      .sort((a, b) => normalizeToFiveScale(b.weight) - normalizeToFiveScale(a.weight));
    if (winnerPros.length > 0) {
      return `${winnerPros[0].title} (${normalizeToFiveScale(winnerPros[0].weight)}/5)`;
    }
    const topCriterion = [...activeDecision.criteria].sort(
      (a, b) => normalizeToFiveScale(b.weight) - normalizeToFiveScale(a.weight)
    )[0];
    if (topCriterion) {
      return `${topCriterion.name} (${normalizeToFiveScale(topCriterion.weight)}/5)`;
    }
    return leader.option.name;
  }, [activeDecision, leader]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-slate-950 text-[#0F172A] dark:text-slate-100 transition-colors">

      <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30">

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-slate-900 dark:bg-blue-600 text-white flex items-center justify-center">
            <Scale className="w-4 h-4" />
          </div>
          <span className="font-display font-semibold text-base tracking-tight text-slate-900 dark:text-slate-100">
            The Tiebreaker
          </span>
        </div>

        <nav className="hidden xl:flex items-center gap-1">
          {[
            { id: 'pros-cons', label: t.navProsCons },
            { id: 'matrix', label: t.navMatrix },
            { id: 'scenarios', label: t.navScenarios },
            { id: 'swot', label: t.navSwot },
            { id: 'sensitivity', label: t.navSensitivity },
          ].map((nav) => (
            <button
              key={nav.id}
              type="button"
              onClick={() => setActiveTab(nav.id as FrameworkTab)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === nav.id
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              {nav.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">

          <div
            className="inline-flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md border border-slate-200 dark:border-slate-700"
            role="group"
            aria-label={
              language === 'ru'
                ? 'Выбор языка'
                : language === 'fi'
                  ? 'Kielen valinta'
                  : 'Language switcher'
            }
          >
            <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 ml-1.5 mr-1 hidden sm:inline" />
            {(['en', 'ru', 'fi'] as Language[]).map((langCode) => {
              const active = language === langCode;
              return (
                <button
                  key={langCode}
                  type="button"
                  onClick={() => handleSelectLanguage(langCode)}
                  disabled={isTranslatingDecisions}
                  title={LANGUAGE_LABELS[langCode].native}
                  className={`px-2 py-1 text-xs font-mono font-semibold rounded transition-colors disabled:opacity-50 disabled:cursor-wait ${
                    active
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {LANGUAGE_LABELS[langCode].short}
                  <span className="hidden md:inline font-sans font-normal ml-1 text-[11px]">
                    {LANGUAGE_LABELS[langCode].native}
                  </span>
                </button>
              );
            })}
            {isTranslatingDecisions && (
              <Loader2
                className="w-3.5 h-3.5 mx-1 text-blue-600 animate-spin"
                aria-label={
                  language === 'ru'
                    ? 'Перевод сохранённых решений'
                    : language === 'fi'
                      ? 'Tallennettujen päätösten kääntäminen'
                      : 'Translating saved decisions'
                }
              />
            )}
          </div>
          {languageChangeError && (
            <span role="alert" className="max-w-52 text-[11px] leading-tight text-red-600 dark:text-red-400">
              {languageChangeError}
            </span>
          )}

          <button
            type="button"
            onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700 rounded-md transition-colors"
            title={theme === 'light' ? t.themeDark : t.themeLight}
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-700" />
                <span className="hidden sm:inline">{t.themeDark}</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">{t.themeLight}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleExportMarkdown}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            {t.exportBrief}
          </button>

          <button
            type="button"
            onClick={() => setIsNewModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 rounded-md transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            {t.newDecision}
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row">

        <aside className="w-full lg:w-72 xl:w-80 bg-white dark:bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between shrink-0">
          <div className="p-4 space-y-5">

            <form onSubmit={handleQuickAnalyze} className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t.quickPromptLabel}
              </label>
              <div className="space-y-2">
                <textarea
                  rows={2}
                  value={quickPrompt}
                  onChange={(e) => setQuickPrompt(e.target.value)}
                  placeholder={t.quickPromptPlaceholder}
                  disabled={quickLoading}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 resize-none"
                />
                <button
                  type="submit"
                  disabled={quickLoading || !quickPrompt.trim()}
                  className="w-full py-2 px-3 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-md transition-colors flex items-center justify-center gap-1.5"
                >
                  {quickLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      {t.generatingModel}
                    </>
                  ) : (
                    t.generateMatrixScenarios
                  )}
                </button>
              </div>
              {quickError && (
                <div className="p-2 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded text-[11px] text-red-700 dark:text-red-300 flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                  <span>{quickError}</span>
                </div>
              )}
            </form>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {t.decisionDossiers} ({decisions.length})
                </span>
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(true)}
                  className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {t.guidedBuilder}
                </button>
              </div>

              <div className="space-y-1.5 max-h-[380px] lg:max-h-[calc(100vh-310px)] overflow-y-auto pr-0.5">
                {decisions.map((item) => {
                  const isSelected = item.id === activeDecision?.id;
                  const itemScores = computeOptionScores(item, frameworkWeights);
                  const topOpt = itemScores[0];

                  return (
                    <div
                      key={item.id}
                      onClick={() => setActiveDecisionId(item.id)}
                      className={`group p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-slate-900 dark:bg-slate-800 text-white border-slate-900 dark:border-blue-500'
                          : 'bg-slate-50/70 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`text-[11px] font-medium uppercase tracking-wider ${
                            isSelected
                              ? 'text-slate-300'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {item.category}
                        </span>
                        {decisions.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteDecision(item.id, e)}
                            className={`opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded ${
                              isSelected
                                ? 'text-slate-400 hover:text-red-300'
                                : 'text-slate-400 hover:text-red-600'
                            }`}
                            aria-label="Delete decision"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <h4
                        className={`text-xs font-semibold mt-1 line-clamp-2 leading-snug ${
                          isSelected
                            ? 'text-white'
                            : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {item.title}
                      </h4>

                      {topOpt && (
                        <div className="mt-2.5 pt-2 border-t border-slate-200/20 flex items-center justify-between text-[11px]">
                          <span
                            className={`truncate max-w-[165px] ${
                              isSelected
                                ? 'text-emerald-300 font-medium'
                                : 'text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {t.leadPrefix} {topOpt.option.name}
                          </span>
                          <span
                            className={`font-mono font-semibold tabular-nums ${
                              isSelected
                                ? 'text-white'
                                : 'text-slate-900 dark:text-slate-200'
                            }`}
                          >
                            {topOpt.compositeScore.toFixed(1)} {t.ptsSuffix}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/50 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{t.scaleActiveNote}</span>
            <button
              type="button"
              onClick={handleResetSamples}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              title={t.resetSamples}
            >
              <RotateCcw className="w-3 h-3" />
              {t.resetSamples}
            </button>
          </div>
        </aside>

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {showWelcome && (
            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="space-y-3 max-w-3xl">
                  <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    <Scale className="w-3.5 h-3.5" />
                    {t.welcomeHeading}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-display font-semibold tracking-tight text-slate-900 dark:text-white">
                    {t.welcomeHeading}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {t.welcomeIntro}
                  </p>
                  <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                    {t.welcomeFeatures.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:items-end">
                  <button
                    type="button"
                    onClick={() => setIsNewModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 rounded-md transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {t.newDecision}
                  </button>
                  <button
                    type="button"
                    onClick={dismissWelcome}
                    className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
                  >
                    {t.welcomeDismiss}
                  </button>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {t.terminologyHeading}
                  </h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {t.terminologyDescription}
                </p>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {Object.entries(t.terminology).map(([key, term]) => (
                    <div
                      key={key}
                      className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3"
                    >
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {term.label}
                      </div>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {term.description}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                  {t.welcomeStart}
                </div>
              </div>
            </section>
          )}

          {activeDecision && (
            <>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    {activeDecision.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {t.updatedPrefix} {activeDecision.createdAt} ·{' '}
                    {activeDecision.options.length} {t.optionsCompared} ·{' '}
                    {activeDecision.prosCons.length +
                      activeDecision.criteria.length +
                      activeDecision.swot.length}{' '}
                    {t.weightedFactorsScale}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-display font-semibold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                  {activeDecision.title}
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-4xl leading-relaxed">
                  {activeDecision.summary}
                </p>

                {leader && runnerUp && (
                  <section
                    aria-label={t.briefConclusionHeading}
                    className="mt-5 p-4 sm:p-5 rounded-lg border-2 border-emerald-500/80 dark:border-emerald-500/70 bg-emerald-50/70 dark:bg-emerald-950/30"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                          <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>{t.briefConclusionHeading}</span>
                        </div>
                        <h2 className="text-lg sm:text-xl font-display font-semibold text-slate-900 dark:text-white tracking-tight">
                          {isTie ? (
                            <>
                              {t.tieDecisionShouldBe}{' '}
                              <span className="underline decoration-amber-500 decoration-2 underline-offset-4">
                                {leader.option.name} / {runnerUp.option.name}
                              </span>
                            </>
                          ) : (
                            <>
                              {t.theDecisionShouldBe}{' '}
                              <span className="text-emerald-700 dark:text-emerald-300 underline decoration-emerald-500 decoration-2 underline-offset-4">
                                {leader.option.name}
                              </span>
                            </>
                          )}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
                          {isTie
                            ? t.conclusionTieTemplate(
                                leader.option.name,
                                runnerUp.option.name,
                                leader.compositeScore.toFixed(1),
                                runnerUp.compositeScore.toFixed(1)
                              )
                            : t.conclusionSummaryTemplate(
                                leader.option.name,
                                leader.compositeScore.toFixed(1),
                                runnerUp.option.name,
                                runnerUp.compositeScore.toFixed(1),
                                leadMargin.toFixed(1),
                                topWinningFactor
                              )}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2 shrink-0">
                        <div className="px-3 py-2 rounded bg-white/90 dark:bg-slate-900/90 border border-emerald-200 dark:border-emerald-800/80">
                          <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            {t.conclusionProsConsMetric}
                          </span>
                          <span className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                            {leader.prosConsScore.toFixed(0)} / 100
                          </span>
                        </div>
                        <div className="px-3 py-2 rounded bg-white/90 dark:bg-slate-900/90 border border-emerald-200 dark:border-emerald-800/80">
                          <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            {t.conclusionMatrixMetric}
                          </span>
                          <span className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                            {leader.matrixScore.toFixed(0)} / 100
                          </span>
                        </div>
                        <div className="px-3 py-2 rounded bg-white/90 dark:bg-slate-900/90 border border-emerald-200 dark:border-emerald-800/80">
                          <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            {t.conclusionScenarioMetric}
                          </span>
                          <span className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                            {leader.scenarioExpectedScore.toFixed(0)} / 100
                          </span>
                        </div>
                        <div className="px-3 py-2 rounded bg-white/90 dark:bg-slate-900/90 border border-emerald-200 dark:border-emerald-800/80">
                          <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            {t.conclusionSwotMetric}
                          </span>
                          <span className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                            {leader.swotScore.toFixed(0)} / 100
                          </span>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                <div className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        {t.currentRecommendation}{' '}
                        <strong className="text-slate-900 dark:text-white">
                          {leader?.option.name}
                        </strong>
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-600 dark:text-slate-400 tabular-nums">
                      {leadMargin < 3
                        ? t.statisticalDeadHeat(leadMargin.toFixed(1))
                        : t.clearLead(leadMargin.toFixed(1))}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {optionScores.map((score, idx) => {
                      const opt = score.option;
                      const isWinner = idx === 0;
                      return (
                        <div
                          key={opt.id}
                          className={`p-4 rounded-lg border transition-colors ${
                            isWinner
                              ? 'bg-slate-50 dark:bg-slate-800/90 border-slate-900 dark:border-blue-500'
                              : 'bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-[11px] font-mono uppercase font-semibold px-2 py-0.5 rounded ${
                                    isWinner
                                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                  }`}
                                >
                                  {t.rankPrefix} #{idx + 1}
                                </span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                  {isWinner
                                    ? t.leadingChoice
                                    : t.trailsBy(
                                        (
                                          leader.compositeScore - score.compositeScore
                                        ).toFixed(1)
                                      )}
                                </span>
                              </div>
                              <h3 className="text-base font-display font-semibold text-slate-900 dark:text-slate-100 mt-1">
                                {opt.name}
                              </h3>
                              {opt.tagline && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                  {opt.tagline}
                                </p>
                              )}
                            </div>

                            <div className="text-right shrink-0">
                              <span className="block text-[11px] font-medium uppercase tracking-wider text-slate-400">
                                {t.weightedScoreLabel}
                              </span>
                              <span
                                className={`text-2xl font-mono font-bold tabular-nums ${
                                  isWinner
                                    ? 'text-emerald-700 dark:text-emerald-400'
                                    : 'text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                {score.compositeScore.toFixed(1)}
                              </span>
                            </div>
                          </div>

                          <div className="mt-3 w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                isWinner
                                  ? 'bg-emerald-600 dark:bg-emerald-500'
                                  : 'bg-slate-500 dark:bg-slate-600'
                              }`}
                              style={{
                                width: `${Math.min(100, Math.max(5, score.compositeScore))}%`,
                              }}
                            />
                          </div>

                          <div className="mt-2.5 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 tabular-nums gap-2">
                            <span>
                              {t.tabProsConsShort}: {score.prosConsScore.toFixed(0)}
                            </span>
                            <span>
                              {t.tabMatrixShort}: {score.matrixScore.toFixed(0)} ({score.rawMatrixPoints}/{score.maxMatrixPoints})
                            </span>
                            <span>
                              {t.tabScenariosShort}: {score.scenarioExpectedScore.toFixed(0)}
                            </span>
                            <span>
                              {t.tabSwotShort}: {score.swotScore.toFixed(0)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1 overflow-x-auto">
                  {[
                    {
                      id: 'pros-cons',
                      label: t.tabProsConsFull(activeDecision.prosCons.length),
                    },
                    {
                      id: 'matrix',
                      label: t.tabMatrixFull(activeDecision.criteria.length),
                    },
                    {
                      id: 'scenarios',
                      label: t.tabScenariosFull,
                    },
                    {
                      id: 'swot',
                      label: t.tabSwotFull(activeDecision.swot.length),
                    },
                    {
                      id: 'sensitivity',
                      label: t.tabSensitivityFull,
                    },
                  ].map((tab) => {
                    const active = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id as FrameworkTab)}
                        className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                          active
                            ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 bg-white dark:bg-slate-900 rounded-t-md'
                            : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline pb-1">
                  {t.realtimeRecalcHint}
                </span>
              </div>

              <div>
                {activeTab === 'pros-cons' && (
                  <ProsConsView
                    decision={activeDecision}
                    scores={optionScores}
                    t={t}
                    onUpdateWeight={handleUpdateProConWeight}
                    onDeleteProCon={handleDeleteProCon}
                    onAddProCon={handleAddProCon}
                  />
                )}

                {activeTab === 'matrix' && (
                  <ComparisonMatrixView
                    decision={activeDecision}
                    scores={optionScores}
                    t={t}
                    onUpdateCriterionWeight={handleUpdateCriterionWeight}
                    onUpdateOptionScore={handleUpdateOptionScore}
                    onDeleteCriterion={handleDeleteCriterion}
                    onAddCriterion={handleAddCriterion}
                  />
                )}

                {activeTab === 'scenarios' && (
                  <ScenarioExplorerView
                    decision={activeDecision}
                    scores={optionScores}
                    t={t}
                    language={language}
                    onUpdateScenarios={handleUpdateScenarios}
                  />
                )}

                {activeTab === 'swot' && (
                  <SwotAnalysisView
                    decision={activeDecision}
                    scores={optionScores}
                    t={t}
                    onUpdateSwotWeight={handleUpdateSwotWeight}
                    onDeleteSwot={handleDeleteSwot}
                    onAddSwot={handleAddSwot}
                  />
                )}

                {activeTab === 'sensitivity' && (
                  <SensitivityVerdictView
                    decision={activeDecision}
                    scores={optionScores}
                    t={t}
                    language={language}
                    frameworkWeights={frameworkWeights}
                    onUpdateFrameworkWeights={setFrameworkWeights}
                    onAddProCon={handleAddProCon}
                    onAddSwot={handleAddSwot}
                  />
                )}
              </div>
            </>
          )}
        </main>
      </div>

      <footer className="border-t border-slate-200 dark:border-slate-800 px-4 py-4 text-center text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-center gap-x-2">
        <span>© 2026 Sergei Tumanov</span>
        <span aria-hidden="true">|</span>
        <a href="https://web.sergeitumanov.com" className="underline underline-offset-2 hover:text-slate-800 dark:hover:text-slate-200">
          web.sergeitumanov.com
        </a>
        <span aria-hidden="true">|</span>
        <a href="https://web.sergeitumanov.com" className="underline underline-offset-2 hover:text-slate-800 dark:hover:text-slate-200">
          web.sergeitumanov.com
        </a>
      </footer>

      <NewDecisionModal
        isOpen={isNewModalOpen}
        t={t}
        language={language}
        onClose={() => setIsNewModalOpen(false)}
        onCreated={handleCreatedDecision}
      />
    </div>
  );
}
