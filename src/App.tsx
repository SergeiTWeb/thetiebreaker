// src/App.tsx
import { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Download,
  Compass,
  Sun,
  Moon,
  CheckCircle2,
  ArrowRight,
  Trash2,
  ChevronDown,
  ChevronUp,
  Github,
  Globe,
} from 'lucide-react';
import {
  ComparisonCriterion,
  DecisionModel,
  FrameworkTab,
  OptionScenarioProjection,
  ProConItem,
  SwotItem,
} from './types/decision';
import { computeOptionScores, normalizeToFiveScale } from './utils/scoring';
import { TRANSLATIONS, Language } from './i18n/translations';
import { ProsConsView } from './components/ProsConsView';
import { ComparisonMatrixView } from './components/ComparisonMatrixView';
import { ScenarioExplorerView } from './components/ScenarioExplorerView';
import { SwotAnalysisView } from './components/SwotAnalysisView';
import { SensitivityVerdictView } from './components/SensitivityVerdictView';
import { NewDecisionModal } from './components/NewDecisionModal';
import { ConclusionBanner } from './components/ConclusionBanner';
import { StarterCards, type StarterTemplate } from './components/StarterCards';

const STORAGE_KEY = 'the_tiebreaker_decisions_v4';
const THEME_STORAGE_KEY = 'the_tiebreaker_theme';

export default function App() {
  const [decisions, setDecisions] = useState<DecisionModel[]>([]);
  const [activeDecisionId, setActiveDecisionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FrameworkTab>('pros-cons');
  const [activeDeepDiveTab, setActiveDeepDiveTab] = useState<
    'scenarios' | 'swot' | 'sensitivity'
  >('scenarios');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [frameworkWeights, setFrameworkWeights] = useState({
    prosCons: 1,
    matrix: 1,
    swot: 1,
  });
  const [modalInitialValues, setModalInitialValues] = useState<
    Pick<StarterTemplate, 'dilemma' | 'options' | 'context'> | undefined
  >();
  
  const currentLang: Language = 'en';
  const t = TRANSLATIONS[currentLang];

  // Theme initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    setDarkMode(isDark);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_STORAGE_KEY, 'light');
    }
  }, [darkMode]);

  // Load decisions from local storage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setDecisions(parsed);
        if (parsed.length > 0 && !activeDecisionId) {
          setActiveDecisionId(parsed[0].id);
        }
      } catch (e) {
        console.error('Failed to parse decisions', e);
      }
    }
  }, []);

  // Save decisions to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decisions));
  }, [decisions]);

  const activeDecision = useMemo(
    () => decisions.find((d) => d.id === activeDecisionId) || null,
    [decisions, activeDecisionId]
  );

  const scores = useMemo(() => {
    if (!activeDecision) return [];
    return computeOptionScores(activeDecision, frameworkWeights);
  }, [activeDecision, frameworkWeights]);

  const topFactor = useMemo(() => {
    const winner = scores[0];
    if (!activeDecision || !winner) return 'the overall balance of available factors';

    const runnerUp = scores[1];
    const criterionFactors = activeDecision.criteria
      .filter((criterion) => {
        if (!runnerUp) return true;
        const winnerRating =
          criterion.scores.find((entry) => entry.optionId === winner.option.id)?.score ?? 3;
        const runnerUpRating =
          criterion.scores.find((entry) => entry.optionId === runnerUp.option.id)?.score ?? 3;
        return winnerRating > runnerUpRating;
      })
      .map((criterion) => ({
        name: criterion.name,
        weight: normalizeToFiveScale(criterion.weight),
      }));
    const winnerPros = activeDecision.prosCons
      .filter((item) => item.optionId === winner.option.id && item.type === 'pro')
      .map((item) => ({
        name: item.domain.trim() ? `${item.title} (${item.domain})` : item.title,
        weight: normalizeToFiveScale(item.weight),
      }));

    return (
      [...criterionFactors, ...winnerPros].sort((a, b) => b.weight - a.weight)[0]?.name ??
      'the overall balance of available factors'
    );
  }, [activeDecision, scores]);

  const handleCreateDecision = (newDecision: DecisionModel) => {
    setDecisions((prev) => [newDecision, ...prev]);
    setActiveDecisionId(newDecision.id);
    setIsModalOpen(false);
  };

  const handleUpdateWeight = (id: string, weight: number) => {
    setDecisions((prev) =>
      prev.map((d) =>
        d.id === activeDecisionId
          ? { ...d, prosCons: d.prosCons.map((pc) => (pc.id === id ? { ...pc, weight } : pc)) }
          : d
      )
    );
  };

  const handleAddProCon = (item: Omit<ProConItem, 'id'>) => {
    const newItem: ProConItem = { ...item, id: `pc-${Date.now()}-${Math.random().toString(36).slice(2)}` };
    setDecisions((prev) =>
      prev.map((d) =>
        d.id === activeDecisionId ? { ...d, prosCons: [...d.prosCons, newItem] } : d
      )
    );
  };

  const handleDeleteProCon = (id: string) => {
    setDecisions((prev) =>
      prev.map((d) =>
        d.id === activeDecisionId ? { ...d, prosCons: d.prosCons.filter((pc) => pc.id !== id) } : d
      )
    );
  };

  const handleUpdateCriterionWeight = (criterionId: string, weight: number) => {
    setDecisions((prev) =>
      prev.map((decision) =>
        decision.id === activeDecisionId
          ? {
              ...decision,
              criteria: decision.criteria.map((criterion) =>
                criterion.id === criterionId ? { ...criterion, weight } : criterion
              ),
            }
          : decision
      )
    );
  };

  const handleUpdateOptionScore = (
    criterionId: string,
    optionId: string,
    score: number
  ) => {
    setDecisions((prev) =>
      prev.map((decision) =>
        decision.id === activeDecisionId
          ? {
              ...decision,
              criteria: decision.criteria.map((criterion) =>
                criterion.id === criterionId
                  ? {
                      ...criterion,
                      scores: criterion.scores.map((entry) =>
                        entry.optionId === optionId ? { ...entry, score } : entry
                      ),
                    }
                  : criterion
              ),
            }
          : decision
      )
    );
  };

  const handleAddCriterion = (criterion: Omit<ComparisonCriterion, 'id'>) => {
    const newCriterion: ComparisonCriterion = {
      ...criterion,
      id: `criterion-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    };
    setDecisions((prev) =>
      prev.map((decision) =>
        decision.id === activeDecisionId
          ? { ...decision, criteria: [...decision.criteria, newCriterion] }
          : decision
      )
    );
  };

  const handleDeleteCriterion = (criterionId: string) => {
    setDecisions((prev) =>
      prev.map((decision) =>
        decision.id === activeDecisionId
          ? {
              ...decision,
              criteria: decision.criteria.filter((criterion) => criterion.id !== criterionId),
            }
          : decision
      )
    );
  };

  const handleUpdateSwotWeight = (id: string, weight: number) => {
    setDecisions((prev) =>
      prev.map((decision) =>
        decision.id === activeDecisionId
          ? {
              ...decision,
              swot: decision.swot.map((item) =>
                item.id === id ? { ...item, weight } : item
              ),
            }
          : decision
      )
    );
  };

  const handleAddSwot = (item: Omit<SwotItem, 'id'>) => {
    const newItem: SwotItem = {
      ...item,
      id: `swot-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    };
    setDecisions((prev) =>
      prev.map((decision) =>
        decision.id === activeDecisionId
          ? { ...decision, swot: [...decision.swot, newItem] }
          : decision
      )
    );
  };

  const handleDeleteSwot = (id: string) => {
    setDecisions((prev) =>
      prev.map((decision) =>
        decision.id === activeDecisionId
          ? { ...decision, swot: decision.swot.filter((item) => item.id !== id) }
          : decision
      )
    );
  };

  const handleUpdateScenarios = (scenarios: OptionScenarioProjection[]) => {
    setDecisions((prev) =>
      prev.map((decision) =>
        decision.id === activeDecisionId ? { ...decision, scenarios } : decision
      )
    );
  };

  const handleExportBrief = () => {
    if (!activeDecision) return;
    const report = [
      activeDecision.title,
      activeDecision.summary,
      '',
      `Recommendation: ${scores[0]?.option.name ?? 'No leading option'} (${scores[0]?.compositeScore.toFixed(1) ?? 'N/A'}/100)`,
      scores[1]
        ? `Runner-up: ${scores[1].option.name} (${scores[1].compositeScore.toFixed(1)}/100)`
        : '',
      scores[0] ? `Why: Leading primarily due to strength in ${topFactor}.` : '',
      '',
      'Option scores:',
      ...scores.map((score) => `- ${score.option.name}: ${score.compositeScore.toFixed(1)}/100`),
      '',
      'Decision factors:',
      ...activeDecision.criteria.map(
        (criterion) => `- ${criterion.name} (weight ${criterion.weight}/5)`
      ),
      ...activeDecision.prosCons.map(
        (factor) =>
          `- ${factor.type === 'pro' ? 'Pro' : 'Con'} for ${
            activeDecision.options.find((option) => option.id === factor.optionId)?.name ??
            'an option'
          }: ${factor.title} (weight ${factor.weight}/5)`
      ),
    ].join('\n');
    const url = URL.createObjectURL(new Blob([report], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeDecision.title.trim().replace(/[^\w-]+/g, '-') || 'decision'}-brief.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  const openBlankDecisionModal = () => {
    setModalInitialValues(undefined);
    setIsModalOpen(true);
  };

  const handleStartFromTemplate = (template: StarterTemplate) => {
    setModalInitialValues({
      dilemma: template.dilemma,
      options: [...template.options],
      context: template.context,
    });
    setIsModalOpen(true);
  };
  
  const handleDeleteDecision = (id: string) => {
    setDecisions((prev) => prev.filter((d) => d.id !== id));
    if (activeDecisionId === id) {
      const remaining = decisions.filter((d) => d.id !== id);
      setActiveDecisionId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  // --- EMPTY STATE UI ---
  if (!activeDecision) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col">
        <header className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-blue-600 dark:bg-blue-500 rounded-lg">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">TieBreaker</span>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label={darkMode ? t.themeLight : t.themeDark}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-4xl mx-auto text-center w-full">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-6">
            <Compass className="w-8 h-8" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            {t.emptyStateHeading}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed">
            {t.emptyStateSubheading}
          </p>

          {/* Accordion Instructions */}
          <div className="w-full max-w-2xl mb-10 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                How to use TieBreaker
              </span>
              {showInstructions ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </button>
            
            {showInstructions && (
              <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-1 md:col-start-1 md:row-start-1">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      1. Pick a template or start blank
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Choose a starter card below or begin with your own decision.
                    </p>
                  </div>
                  <div className="space-y-1 md:col-start-1 md:row-start-2">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      2. Generate your baseline
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      AI drafts factors and scores. Wt means importance: 1 = Low, 3 = Medium,
                      and 5 = Critical; higher weights count more.
                    </p>
                  </div>
                  <div className="space-y-1 md:col-start-2 md:row-start-1">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      3. Refine your factors
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Edit Pros &amp; Cons and their weights. In Decision Matrix, add shared criteria,
                      set their weights, and rate each option from 1 to 5.
                    </p>
                  </div>
                  <div className="space-y-1 md:col-start-2 md:row-start-2">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      4. Explore and export
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Deep Dive Analysis contains Scenarios, SWOT, and Sensitivity, including
                      framework weights and the AI Devil&apos;s Advocate. Export Brief downloads a
                      text summary of your comparison.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={openBlankDecisionModal}
            className="group inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-200 hover:scale-[1.02]"
          >
            <Plus className="w-5 h-5" />
            {t.newDecision}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <StarterCards onSelect={handleStartFromTemplate} />
        </main>

        {/* Footer */}
        <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm py-6 mt-auto">
          <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <span>Vibecoded by</span>
              <a href="https://web.sergeitumanov.com" target="_blank" rel="noopener noreferrer" className="font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
                <Globe className="w-3 h-3" />
                Sergei Tumanov
              </a>
              <span>in 2026</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>Open source:</span>
              <a 
                href="https://github.com/SergeiTWeb/thetiebreaker" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
              >
                <Github className="w-3.5 h-3.5" />
                github.com/SergeiTWeb/thetiebreaker
              </a>
            </div>
          </div>
        </footer>

        {isModalOpen && (
          <NewDecisionModal
            isOpen={isModalOpen}
            t={t}
            language={currentLang}
            initialValues={modalInitialValues}
            onClose={() => setIsModalOpen(false)}
            onCreated={handleCreateDecision}
          />
        )}
      </div>
    );
  }

  // --- ACTIVE DECISION UI ---
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col">
      <header className="w-full px-4 md:px-6 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-blue-600 dark:bg-blue-500 rounded-lg">
            <Compass className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">{activeDecision.title}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">{activeDecision.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => handleDeleteDecision(activeDecision.id)}
            className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            title="Delete Decision"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleExportBrief}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            {t.exportBrief}
          </button>
          <button
            onClick={openBlankDecisionModal}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            {t.newDecision}
          </button>
        </div>
      </header>

      <ConclusionBanner scores={scores} topFactor={topFactor} t={t} />

      <div className="px-4 md:px-6 mt-4">
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
          {(['pros-cons', 'matrix', 'deep-dive'] as FrameworkTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab === 'pros-cons' && t.navProsCons}
              {tab === 'matrix' && t.navMatrix}
              {tab === 'deep-dive' && 'Deep Dive Analysis'}
            </button>
          ))}
        </div>
      </div>

      <main className="px-4 md:px-6 py-6 max-w-7xl mx-auto flex-1">
        {activeTab === 'pros-cons' && (
          <ProsConsView
            decision={activeDecision}
            scores={scores}
            t={t}
            onUpdateWeight={handleUpdateWeight}
            onAddProCon={handleAddProCon}
            onDeleteProCon={handleDeleteProCon}
          />
        )}
        {activeTab === 'matrix' && (
          <ComparisonMatrixView
            decision={activeDecision}
            scores={scores}
            t={t}
            onUpdateCriterionWeight={handleUpdateCriterionWeight}
            onUpdateOptionScore={handleUpdateOptionScore}
            onAddCriterion={handleAddCriterion}
            onDeleteCriterion={handleDeleteCriterion}
          />
        )}
        {activeTab === 'deep-dive' && (
          <>
            <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Deep Dive Analysis">
              {(['scenarios', 'swot', 'sensitivity'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  id={`deep-dive-tab-${tab}`}
                  role="tab"
                  aria-controls="deep-dive-panel"
                  aria-selected={activeDeepDiveTab === tab}
                  onClick={() => setActiveDeepDiveTab(tab)}
                  className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors ${
                    activeDeepDiveTab === tab
                      ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'bg-transparent border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  {tab === 'scenarios' && t.navScenarios}
                  {tab === 'swot' && t.navSwot}
                  {tab === 'sensitivity' && t.navSensitivity}
                </button>
              ))}
            </div>
            <div
              id="deep-dive-panel"
              role="tabpanel"
              aria-labelledby={`deep-dive-tab-${activeDeepDiveTab}`}
            >
              {activeDeepDiveTab === 'scenarios' && (
                <ScenarioExplorerView
                  decision={activeDecision}
                  scores={scores}
                  t={t}
                  language={currentLang}
                  onUpdateScenarios={handleUpdateScenarios}
                />
              )}
              {activeDeepDiveTab === 'swot' && (
                <SwotAnalysisView
                  decision={activeDecision}
                  scores={scores}
                  t={t}
                  onUpdateSwotWeight={handleUpdateSwotWeight}
                  onAddSwot={handleAddSwot}
                  onDeleteSwot={handleDeleteSwot}
                />
              )}
              {activeDeepDiveTab === 'sensitivity' && (
                <SensitivityVerdictView
                  decision={activeDecision}
                  scores={scores}
                  t={t}
                  language={currentLang}
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

      {/* Footer for Active State */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span>Vibecoded by</span>
            <a href="https://web.sergeitumanov.com" target="_blank" rel="noopener noreferrer" className="font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
              <Globe className="w-3 h-3" />
              Sergei Tumanov
            </a>
            <span>in 2026</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>Open source:</span>
            <a 
              href="https://github.com/SergeiTWeb/thetiebreaker" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
            >
              <Github className="w-3.5 h-3.5" />
              github.com/SergeiTWeb/thetiebreaker
            </a>
          </div>
        </div>
      </footer>

      {isModalOpen && (
        <NewDecisionModal
          isOpen={isModalOpen}
          t={t}
          language={currentLang}
          initialValues={modalInitialValues}
          onClose={() => setIsModalOpen(false)}
          onCreated={handleCreateDecision}
        />
      )}
    </div>
  );
}