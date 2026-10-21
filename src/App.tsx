// src/App.tsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Download,
  Compass,
  Sun,
  Moon,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  ShieldCheck,
  Trash2,
  ChevronDown,
  ChevronUp,
  Github,
  Globe,
} from 'lucide-react';
import { DecisionModel, FrameworkTab, OptionScoreSummary, ProConItem } from './types/decision';
import { computeOptionScores } from './utils/scoring';
import { LANGUAGE_LABELS, TRANSLATIONS, Language } from './i18n/translations';
import { ProsConsView } from './components/ProsConsView';
import { ComparisonMatrixView } from './components/ComparisonMatrixView';
import { ScenarioExplorerView } from './components/ScenarioExplorerView';
import { SwotAnalysisView } from './components/SwotAnalysisView';
import { SensitivityVerdictView } from './components/SensitivityVerdictView';
import { NewDecisionModal } from './components/NewDecisionModal';

const STORAGE_KEY = 'the_tiebreaker_decisions_v4';
const THEME_STORAGE_KEY = 'the_tiebreaker_theme';

export default function App() {
  const [decisions, setDecisions] = useState<DecisionModel[]>([]);
  const [activeDecisionId, setActiveDecisionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FrameworkTab>('pros-cons');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  
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
    return computeOptionScores(activeDecision);
  }, [activeDecision]);

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
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">1. Define the Dilemma</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Click "New Decision" and clearly state your choice and the 2-4 options you are weighing.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">2. Weight the Factors</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Add Pros and Cons, assigning each an importance weight from 1 (Low) to 5 (Critical).</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">3. Explore Frameworks</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Use the tabs to build a Decision Matrix, project Scenarios, and map a SWOT analysis.</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">4. Stress-Test the Verdict</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Visit the Sensitivity tab to adjust framework weights and ensure your choice holds up.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="group inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-200 hover:scale-[1.02]"
          >
            <Plus className="w-5 h-5" />
            {t.newDecision}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
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
            onClick={() => {/* Add export logic here later */}}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            {t.exportBrief}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            {t.newDecision}
          </button>
        </div>
      </header>

      <div className="px-4 md:px-6 py-4 bg-blue-50/50 dark:bg-blue-950/20 border-b border-blue-100 dark:border-blue-900/50">
        <div className="text-sm text-slate-600 dark:text-slate-400">
          {scores.length > 0 ? (
            <span>
              <strong className="text-slate-900 dark:text-slate-100">{t.theDecisionShouldBe} {scores[0].option.name}</strong> 
              {' '}(Score: {scores[0].compositeScore}/100)
            </span>
          ) : (
            <span>{t.buildingDecisionModelBtn}</span>
          )}
        </div>
      </div>

      <div className="px-4 md:px-6 mt-4">
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
          {(['pros-cons', 'matrix', 'scenarios', 'swot', 'sensitivity'] as FrameworkTab[]).map((tab) => (
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
              {tab === 'scenarios' && t.navScenarios}
              {tab === 'swot' && t.navSwot}
              {tab === 'sensitivity' && t.navSensitivity}
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
        {activeTab === 'matrix' && <ComparisonMatrixView decision={activeDecision} scores={scores} t={t} />}
        {activeTab === 'scenarios' && <ScenarioExplorerView decision={activeDecision} scores={scores} t={t} />}
        {activeTab === 'swot' && <SwotAnalysisView decision={activeDecision} scores={scores} t={t} />}
        {activeTab === 'sensitivity' && <SensitivityVerdictView decision={activeDecision} scores={scores} t={t} />}
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
          onClose={() => setIsModalOpen(false)}
          onCreated={handleCreateDecision}
        />
      )}
    </div>
  );
}