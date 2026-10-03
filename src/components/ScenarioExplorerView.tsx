import React, { useState } from 'react';
import {
  TrendingUp,
  Activity,
  AlertOctagon,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  DecisionModel,
  OptionScoreSummary,
  OptionScenarioProjection,
} from '../types/decision';
import { normalizeToFiveScale } from '../utils/scoring';
import { UIStrings, Language } from '../i18n/translations';
import { apiUrl } from '../utils/api';

interface ScenarioExplorerViewProps {
  decision: DecisionModel;
  scores: OptionScoreSummary[];
  t: UIStrings;
  language: Language;
  onUpdateScenarios: (scenarios: OptionScenarioProjection[]) => void;
}

export const ScenarioExplorerView: React.FC<ScenarioExplorerViewProps> = ({
  decision,
  scores,
  t,
  language,
  onUpdateScenarios,
}) => {
  const [regenerating, setRegenerating] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string>('all');

  const handleRegenerateScenarios = async () => {
    setRegenerating(true);
    try {
      const response = await fetch(apiUrl('/api/decision/scenarios'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: decision.title,
          summary: decision.summary,
          options: decision.options,
          prosCons: decision.prosCons.map((p) => ({
            ...p,
            weight: normalizeToFiveScale(p.weight),
          })),
          language,
        }),
      });
      const data = await response.json();
      if (data && Array.isArray(data.scenarios)) {
        onUpdateScenarios(data.scenarios);
      }
    } catch {

    } finally {
      setRegenerating(false);
    }
  };

  const visibleOptions =
    selectedOptionId === 'all'
      ? decision.options
      : decision.options.filter((o) => o.id === selectedOptionId);

  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {t.scenariosHeading}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {t.scenariosSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setSelectedOptionId('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                selectedOptionId === 'all'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {t.allChoices(decision.options.length)}
            </button>
            {decision.options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedOptionId(opt.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap truncate max-w-[180px] ${
                  selectedOptionId === opt.id
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {opt.name}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleRegenerateScenarios}
            disabled={regenerating}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${regenerating ? 'animate-spin' : ''}`} />
            {regenerating ? t.updatingScenariosBtn : t.recalcScenariosBtn}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {visibleOptions.map((option) => {
          const scoreSummary = scores.find((s) => s.option.id === option.id);
          const scenarioProj = decision.scenarios?.find((s) => s.optionId === option.id);

          const optionPros = decision.prosCons
            .filter((p) => p.optionId === option.id && p.type === 'pro')
            .sort((a, b) => normalizeToFiveScale(b.weight) - normalizeToFiveScale(a.weight));
          const optionCons = decision.prosCons
            .filter((p) => p.optionId === option.id && p.type === 'con')
            .sort((a, b) => normalizeToFiveScale(b.weight) - normalizeToFiveScale(a.weight));

          const topPro = optionPros[0];
          const topCon = optionCons[0];

          const bestCase = scenarioProj?.bestCase || {
            headline: `${option.name} — ${t.bestCaseTitle}`,
            narrative: option.description,
            weightedImpactAnalysis: topPro ? topPro.impactNote : '',
            keyDriverOrContingency: topPro ? topPro.title : '',
            probabilityPercent: 25,
          };

          const mostLikelyCase = scenarioProj?.mostLikelyCase || {
            headline: `${option.name} — ${t.mostLikelyTitle}`,
            narrative: option.description,
            weightedImpactAnalysis: `+${scoreSummary?.prosWeightedSum ?? 0} / -${scoreSummary?.consWeightedSum ?? 0}`,
            keyDriverOrContingency: option.tagline,
            probabilityPercent: 55,
          };

          const worstCase = scenarioProj?.worstCase || {
            headline: `${option.name} — ${t.worstCaseTitle}`,
            narrative: option.description,
            weightedImpactAnalysis: topCon ? topCon.impactNote : '',
            keyDriverOrContingency: topCon ? topCon.title : '',
            probabilityPercent: 20,
          };

          return (
            <section
              key={option.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden"
            >

              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {option.tagline}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">
                      {t.proPts(scoreSummary?.prosWeightedSum ?? 0)} /{' '}
                      {t.conPts(scoreSummary?.consWeightedSum ?? 0)}
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                    {option.name}
                  </h4>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right">
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {t.scenarioExpectedScoreLabel}
                    </div>
                    <div className="text-lg font-mono font-semibold text-blue-700 dark:text-blue-400 tabular-nums">
                      {scoreSummary?.scenarioExpectedScore.toFixed(1)} / 100
                    </div>
                  </div>
                  <div className="text-right border-l border-slate-200 dark:border-slate-800 pl-5">
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {t.outcomeSpreadLabel}
                    </div>
                    <div className="text-sm font-mono font-medium text-slate-800 dark:text-slate-200 tabular-nums mt-0.5">
                      {scoreSummary?.worstCaseScore.toFixed(0)} {t.ptsSuffix} →{' '}
                      {scoreSummary?.bestCaseScore.toFixed(0)} {t.ptsSuffix}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800">

                <div className="p-6 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        <TrendingUp className="w-4 h-4" />
                        <span>{t.bestCaseTitle}</span>
                      </div>
                      <span className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                        ~{bestCase.probabilityPercent}% {t.probLabel} ·{' '}
                        <strong className="text-emerald-700 dark:text-emerald-400">
                          {scoreSummary?.bestCaseScore.toFixed(0)}/100
                        </strong>
                      </span>
                    </div>

                    <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                      {bestCase.headline}
                    </h5>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {bestCase.narrative}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="p-3 rounded bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/50 space-y-1.5">
                      <div className="text-[11px] font-semibold text-emerald-900 dark:text-emerald-300 flex items-center gap-1">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>{t.impactOfWeightedProsCons}</span>
                      </div>
                      <p className="text-xs text-emerald-950/80 dark:text-emerald-200/80 leading-relaxed">
                        {bestCase.weightedImpactAnalysis}
                      </p>
                      {topPro && (
                        <div className="pt-1 text-[11px] font-mono text-emerald-800 dark:text-emerald-300 tabular-nums">
                          {t.primaryCatalyst} &ldquo;{topPro.title}&rdquo; ({normalizeToFiveScale(topPro.weight)}/5)
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {t.unlockingCondition}{' '}
                      </span>
                      {bestCase.keyDriverOrContingency}
                    </div>
                  </div>
                </div>

                <div className="p-6 flex flex-col justify-between space-y-5 bg-slate-50/30 dark:bg-slate-900/40">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400">
                        <Activity className="w-4 h-4" />
                        <span>{t.mostLikelyTitle}</span>
                      </div>
                      <span className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                        ~{mostLikelyCase.probabilityPercent}% {t.probLabel} ·{' '}
                        <strong className="text-blue-700 dark:text-blue-400">
                          {scoreSummary?.mostLikelyScore.toFixed(0)}/100
                        </strong>
                      </span>
                    </div>

                    <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                      {mostLikelyCase.headline}
                    </h5>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {mostLikelyCase.narrative}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="p-3 rounded bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/50 space-y-1.5">
                      <div className="text-[11px] font-semibold text-blue-900 dark:text-blue-300">
                        {t.impactOfWeightedProsCons}
                      </div>
                      <p className="text-xs text-blue-950/80 dark:text-blue-200/80 leading-relaxed">
                        {mostLikelyCase.weightedImpactAnalysis}
                      </p>
                      <div className="pt-1 text-[11px] font-mono text-blue-800 dark:text-blue-300 tabular-nums">
                        {t.netLedgerBalance} +{scoreSummary?.prosWeightedSum ?? 0} / -
                        {scoreSummary?.consWeightedSum ?? 0}
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {t.operationalFocus}{' '}
                      </span>
                      {mostLikelyCase.keyDriverOrContingency}
                    </div>
                  </div>
                </div>

                <div className="p-6 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-red-700 dark:text-red-400">
                        <AlertOctagon className="w-4 h-4" />
                        <span>{t.worstCaseTitle}</span>
                      </div>
                      <span className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                        ~{worstCase.probabilityPercent}% {t.probLabel} ·{' '}
                        <strong className="text-red-700 dark:text-red-400">
                          {scoreSummary?.worstCaseScore.toFixed(0)}/100
                        </strong>
                      </span>
                    </div>

                    <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                      {worstCase.headline}
                    </h5>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {worstCase.narrative}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="p-3 rounded bg-red-50/60 dark:bg-red-950/30 border border-red-200/60 dark:border-red-900/50 space-y-1.5">
                      <div className="text-[11px] font-semibold text-red-900 dark:text-red-300 flex items-center gap-1">
                        <ArrowDownRight className="w-3.5 h-3.5" />
                        <span>{t.impactOfWeightedProsCons}</span>
                      </div>
                      <p className="text-xs text-red-950/80 dark:text-red-200/80 leading-relaxed">
                        {worstCase.weightedImpactAnalysis}
                      </p>
                      {topCon && (
                        <div className="pt-1 text-[11px] font-mono text-red-800 dark:text-red-300 tabular-nums">
                          {t.primaryRiskDriver} &ldquo;{topCon.title}&rdquo; ({normalizeToFiveScale(topCon.weight)}/5)
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {t.contingencySafeguard}{' '}
                      </span>
                      {worstCase.keyDriverOrContingency}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
