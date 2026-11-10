import React, { useState } from 'react';
import { X, Plus, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { DecisionModel } from '../types/decision';
import { apiPost } from '../utils/api';
import { UIStrings, Language } from '../i18n/translations';

interface NewDecisionModalProps {
  isOpen: boolean;
  t: UIStrings;
  language: Language;
  initialValues?: {
    dilemma: string;
    options: string[];
    context: string;
  };
  onClose: () => void;
  onCreated: (newDecision: DecisionModel) => void;
}

interface DraftFactor {
  optionIndex: number;
  type: 'pro' | 'con';
  title: string;
  weight: number;
}

const QUICK_TEMPLATES = [
  {
    label: 'Career Path',
    dilemma:
      'Should I continue as an individual contributor or explore a team leadership role?',
    context:
      'I enjoy hands-on problem solving and mentoring teammates, and want to choose a direction for the next stage of my career.',
    options: ['Continue as a specialist', 'Explore team leadership'],
    factors: [
      {
        optionIndex: 0,
        type: 'pro' as const,
        title: 'More time for focused, hands-on work',
        weight: 5,
      },
      {
        optionIndex: 0,
        type: 'con' as const,
        title: 'Fewer opportunities to mentor the wider team',
        weight: 3,
      },
      {
        optionIndex: 1,
        type: 'pro' as const,
        title: 'More opportunities to coach and support teammates',
        weight: 4,
      },
    ],
  },
  {
    label: 'Product Strategy',
    dilemma:
      'Should our team launch a focused first version now or run a limited pilot first?',
    context:
      'The product team has a working prototype and wants to learn from users while keeping the rollout manageable.',
    options: ['Launch the focused version', 'Run a limited pilot'],
    factors: [
      {
        optionIndex: 0,
        type: 'pro' as const,
        title: 'Reach more users and collect broad feedback sooner',
        weight: 4,
      },
      {
        optionIndex: 0,
        type: 'con' as const,
        title: 'Learn less from a small, closely observed group',
        weight: 3,
      },
      {
        optionIndex: 1,
        type: 'pro' as const,
        title: 'Get detailed feedback from a smaller group first',
        weight: 5,
      },
    ],
  },
  {
    label: 'Creative Decision',
    dilemma:
      'Should I develop my story as a short film or as a serialized podcast?',
    context:
      'I have a story concept and a small group of collaborators interested in helping bring it to life.',
    options: ['Create a short film', 'Create a serialized podcast'],
    factors: [
      {
        optionIndex: 0,
        type: 'pro' as const,
        title: 'Tell the story through visual scenes and performance',
        weight: 4,
      },
      {
        optionIndex: 0,
        type: 'con' as const,
        title: 'Coordinate filming locations and schedules',
        weight: 4,
      },
      {
        optionIndex: 1,
        type: 'pro' as const,
        title: 'Build the story in episodes with a flexible format',
        weight: 5,
      },
    ],
  },
];

export const NewDecisionModal: React.FC<NewDecisionModalProps> = ({
  isOpen,
  t,
  language,
  initialValues,
  onClose,
  onCreated,
}) => {
  const locale: string = language;

  const getDefaultOptionName = (index: number) => {
    if (locale === 'ru') return `Вариант ${index + 1}`;
    if (locale === 'fi') return `Vaihtoehto ${index + 1}`;
    return `Option ${index + 1}`;
  };

  const getLocalizedDecisionCategory = () => {
    if (locale === 'ru') return 'Стратегическая модель решения';
    if (locale === 'fi') return 'Strateginen päätösmalli';
    return 'Strategic Decision';
  };

  const getLocalizedNow = () => {
    if (locale === 'ru') return 'Только что';
    if (locale === 'fi') return 'Juuri nyt';
    return 'Just now';
  };

  const getLocalizedPrimaryPath = () =>
    locale === 'ru'
      ? 'Основной путь'
      : locale === 'fi'
        ? 'Ensisijainen vaihtoehto'
        : 'Primary path';

  const getLocalizedAlternativePath = () =>
    locale === 'ru'
      ? 'Альтернативный путь'
      : locale === 'fi'
        ? 'Vaihtoehtoinen reitti'
        : 'Alternative path';

  const [dilemma, setDilemma] = useState(initialValues?.dilemma ?? '');
  const [context, setContext] = useState(initialValues?.context ?? '');
  const [optionsInput, setOptionsInput] = useState<string[]>([
    ...(initialValues?.options ?? [getDefaultOptionName(0), getDefaultOptionName(1)]),
  ]);
  const [userProsCons, setUserProsCons] = useState<DraftFactor[]>([]);
  const [showManualFactors, setShowManualFactors] = useState(false);

  React.useEffect(() => {
    setOptionsInput((prev) =>
      prev.length === 0
        ? [getDefaultOptionName(0), getDefaultOptionName(1)]
        : prev.map((value, index) => {
            const normalized = value.trim();
            if (!normalized) return getDefaultOptionName(index);
            if (
              [
                'Option 1',
                'Option 2',
                'Option A',
                'Option B',
                'Вариант 1',
                'Вариант 2',
                'Vaihtoehto 1',
                'Vaihtoehto 2',
              ].includes(normalized)
            ) {
              return getDefaultOptionName(index);
            }
            return value;
          })
    );
  }, [language, isOpen]);
  const [draftFactorTitle, setDraftFactorTitle] = useState('');
  const [draftFactorType, setDraftFactorType] = useState<'pro' | 'con'>('pro');
  const [draftFactorOptionIdx, setDraftFactorOptionIdx] = useState<number>(0);
  const [draftFactorWeight, setDraftFactorWeight] = useState<number>(4);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleOptionChange = (idx: number, value: string) => {
    setOptionsInput((prev) => prev.map((item, i) => (i === idx ? value : item)));
  };

  const handleAddOptionField = () => {
    if (optionsInput.length < 4) {
      setOptionsInput((prev) => [...prev, getDefaultOptionName(prev.length)]);
    }
  };

  const handleRemoveOptionField = (idx: number) => {
    if (optionsInput.length > 2) {
      setOptionsInput((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  const handleAddDraftFactor = () => {
    if (!draftFactorTitle.trim()) return;
    setUserProsCons((prev) => [
      ...prev,
      {
        optionIndex: draftFactorOptionIdx,
        type: draftFactorType,
        title: draftFactorTitle.trim(),
        weight: draftFactorWeight,
      },
    ]);
    setDraftFactorTitle('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dilemma.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await apiPost<Partial<DecisionModel> & { error?: string }>(
        '/api/decision/analyze',
        {
          dilemma,
          context,
          optionsInput: optionsInput.filter((o) => o.trim().length > 0),
          userProsCons,
          language,
        }
      );

      const newModel: DecisionModel = {
        id: `dec-${Date.now()}`,
        createdAt: getLocalizedNow(),
        title: data.title || dilemma.trim(),
        category: data.category || getLocalizedDecisionCategory(),
        summary: data.summary || dilemma.trim(),
        analysisNotice: typeof data.analysisNotice === 'string' ? data.analysisNotice : undefined,
        options:
          Array.isArray(data.options) && data.options.length >= 2
            ? data.options
            : [
                {
                  id: 'opt-1',
                  name: optionsInput[0] || getDefaultOptionName(0),
                  tagline: getLocalizedPrimaryPath(),
                  description:
                    locale === 'ru'
                      ? 'Первый вариант решения.'
                      : locale === 'fi'
                        ? 'Ensimmäinen päätösvaihtoehto.'
                        : 'First decision path',
                },
                {
                  id: 'opt-2',
                  name: optionsInput[1] || getDefaultOptionName(1),
                  tagline: getLocalizedAlternativePath(),
                  description:
                    locale === 'ru'
                      ? 'Второй вариант решения.'
                      : locale === 'fi'
                        ? 'Toinen päätösvaihtoehto.'
                        : 'Second decision path',
                },
              ],
        prosCons: Array.isArray(data.prosCons) ? data.prosCons : [],
        criteria: Array.isArray(data.criteria) ? data.criteria : [],
        swot: Array.isArray(data.swot) ? data.swot : [],
        scenarios: Array.isArray(data.scenarios) ? data.scenarios : undefined,
        blindSpots: Array.isArray(data.blindSpots) ? data.blindSpots : [],
      };

      onCreated(newModel);
      setDilemma('');
      setContext('');
      setOptionsInput([getDefaultOptionName(0), getDefaultOptionName(1)]);
      setUserProsCons([]);
      onClose();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : locale === 'ru'
            ? 'При анализе решения произошла непредвиденная ошибка.'
            : locale === 'fi'
              ? 'Päätöksen analysoinnissa tapahtui odottamaton virhe.'
              : 'An unexpected error occurred while analyzing your decision.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg max-w-3xl w-full overflow-hidden shadow-xl my-8">

        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div>
            <h2 className="text-lg font-display font-semibold text-slate-900 dark:text-slate-100">
              {t.modalHeading}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              {t.modalSubtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5 max-h-[82vh] overflow-y-auto"
        >

          <div>
            <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
              {t.loadSampleTemplateLabel}
            </span>
            <div className="flex flex-wrap gap-2">
              {QUICK_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.label}
                  type="button"
                  onClick={() => {
                    setDilemma(tpl.dilemma);
                    setContext(tpl.context);
                    setOptionsInput(tpl.options);
                    setUserProsCons(tpl.factors);
                    setShowManualFactors(true);
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 rounded-md transition-colors"
                >
                  {tpl.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
              {t.step1DecisionLabel}
            </label>
            <textarea
              required
              autoFocus={true}
              rows={2}
              value={dilemma}
              onChange={(e) => setDilemma(e.target.value)}
              placeholder={t.step1DecisionPlaceholder}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {t.step2OptionsLabel}
              </label>
              {optionsInput.length < 4 && (
                <button
                  type="button"
                  onClick={handleAddOptionField}
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <Plus className="w-3 h-3" />
                  {t.addOptionBtn}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {optionsInput.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`${t.optionLabel} ${idx + 1}`}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                  />
                  {optionsInput.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOptionField(idx)}
                      className="text-slate-400 hover:text-red-600 p-1.5"
                      aria-label="Remove option"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowManualFactors((visible) => !visible)}
            aria-expanded={showManualFactors}
            className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {showManualFactors ? '− Hide manual factors' : '+ Add manual factors before generating (Optional)'}
          </button>

          {showManualFactors && (
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {t.step3ProsConsLabel}
              </label>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {t.step3ProsConsSub}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
              <div className="sm:col-span-3">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                  {t.optionLabel}
                </label>
                <select
                  value={draftFactorOptionIdx}
                  onChange={(e) => setDraftFactorOptionIdx(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100"
                >
                  {optionsInput.map((o, i) => (
                    <option key={i} value={i}>
                      {o.trim() || `${t.optionLabel} ${i + 1}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                  {t.typeLabel}
                </label>
                <select
                  value={draftFactorType}
                  onChange={(e) => setDraftFactorType(e.target.value as 'pro' | 'con')}
                  className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100"
                >
                  <option value="pro">{t.proLabel} (+)</option>
                  <option value="con">{t.conLabel} (-)</option>
                </select>
              </div>

              <div className="sm:col-span-4">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                  {t.factorDescriptionLabel}
                </label>
                <input
                  type="text"
                  value={draftFactorTitle}
                  onChange={(e) => setDraftFactorTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddDraftFactor();
                    }
                  }}
                  placeholder={t.factorDescriptionPlaceholder}
                  className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                  {t.weightShortLabel}
                </label>
                <select
                  value={draftFactorWeight}
                  onChange={(e) => setDraftFactorWeight(Number(e.target.value))}
                  className="w-full px-2 py-1.5 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100"
                >
                  {[1, 2, 3, 4, 5].map((w) => (
                    <option key={w} value={w}>
                      {t.weightLevels[w]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-1">
                <button
                  type="button"
                  onClick={handleAddDraftFactor}
                  className="w-full py-1.5 px-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors flex items-center justify-center"
                  title={t.addBtn}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {userProsCons.length > 0 && (
              <div className="pt-2 space-y-1.5">
                {userProsCons.map((f, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono font-semibold ${
                          f.type === 'pro'
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : 'text-red-700 dark:text-red-400'
                        }`}
                      >
                        {f.type === 'pro' ? `+${t.proLabel}` : `-${t.conLabel}`} ({f.weight}/5)
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {optionsInput[f.optionIndex] || `${t.optionLabel} ${f.optionIndex + 1}`}:
                      </span>
                      <span className="text-slate-900 dark:text-slate-100">{f.title}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setUserProsCons((prev) => prev.filter((_, i) => i !== idx))
                      }
                      className="text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
              {t.step4ContextLabel}
            </label>
            <input
              type="text"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder={t.step4ContextPlaceholder}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
            />
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-md flex items-start gap-2.5 text-xs text-red-800 dark:text-red-300">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {t.modalFooterNote}
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={loading}
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              >
                {t.cancelBtn}
              </button>
              <button
                type="submit"
                disabled={loading || !dilemma.trim()}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-medium text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 disabled:opacity-50 rounded-lg transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    {t.buildingDecisionModelBtn}
                  </>
                ) : (
                  t.generateWeightedModelBtn
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
