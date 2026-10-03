import React, { useState } from 'react';
import { Scale, RefreshCw, Plus, Check, AlertCircle } from 'lucide-react';
import {
  DecisionModel,
  OptionScoreSummary,
  DevilsAdvocateResponse,
  ProConItem,
  SwotItem,
} from '../types/decision';
import { normalizeToFiveScale } from '../utils/scoring';
import { UIStrings, Language } from '../i18n/translations';

interface SensitivityVerdictViewProps {
  decision: DecisionModel;
  scores: OptionScoreSummary[];
  t: UIStrings;
  language: Language;
  frameworkWeights: { prosCons: number; matrix: number; swot: number };
  onUpdateFrameworkWeights: (weights: {
    prosCons: number;
    matrix: number;
    swot: number;
  }) => void;
  onAddProCon: (item: Omit<ProConItem, 'id'>) => void;
  onAddSwot: (item: Omit<SwotItem, 'id'>) => void;
}

export const SensitivityVerdictView: React.FC<SensitivityVerdictViewProps> = ({
  decision,
  scores,
  t,
  language,
  frameworkWeights,
  onUpdateFrameworkWeights,
  onAddProCon,
  onAddSwot,
}) => {
  const [challengeLoading, setChallengeLoading] = useState(false);
  const [challengeError, setChallengeError] = useState<string | null>(null);
  const [challengeResult, setChallengeResult] = useState<DevilsAdvocateResponse | null>(
    null
  );
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const leader = scores[0];
  const runnerUp = scores[1] || scores[0];
  const margin =
    leader && runnerUp ? leader.compositeScore - runnerUp.compositeScore : 0;

  const topDrivers = [
    ...decision.criteria
      .filter((c) => normalizeToFiveScale(c.weight) >= 4)
      .map(
        (c) => `Matrix Factor: ${c.name} (Weight ${normalizeToFiveScale(c.weight)}/5)`
      ),
    ...decision.prosCons
      .filter((p) => normalizeToFiveScale(p.weight) >= 4)
      .map(
        (p) =>
          `${p.type.toUpperCase()}: ${p.title} (Weight ${normalizeToFiveScale(p.weight)}/5)`
      ),
    ...decision.swot
      .filter((s) => normalizeToFiveScale(s.weight) >= 4)
      .map(
        (s) =>
          `SWOT ${s.quadrant.toUpperCase()}: ${s.title} (Weight ${normalizeToFiveScale(
            s.weight
          )}/5)`
      ),
  ].slice(0, 6);

  const handleRunDevilsAdvocate = async () => {
    setChallengeLoading(true);
    setChallengeError(null);
    try {
      const response = await fetch('/api/decision/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: decision.title,
          summary: decision.summary,
          options: decision.options.map((o) => ({ id: o.id, name: o.name })),
          leadingOptionName: leader?.option.name || 'Option 1',
          runnerUpOptionName: runnerUp?.option.name || 'Option 2',
          scoreMargin: margin,
          topWeightedFactors: topDrivers,
          language,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to run Devil’s Advocate stress-test.');
      }
      setChallengeResult(data);
    } catch (err: unknown) {
      setChallengeError(
        err instanceof Error ? err.message : 'Unable to reach the stress-test service.'
      );
    } finally {
      setChallengeLoading(false);
    }
  };

  return (
    <div className="space-y-8">

      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {t.crossFrameworkHeading}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              {t.crossFrameworkSub}
            </p>
          </div>
          <span className="text-xs font-mono text-slate-600 dark:text-slate-400 tabular-nums">
            {t.leadMarginLabel} +{margin.toFixed(1)} {t.ptsSuffix}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-50/30 dark:bg-slate-950/30">
                <th className="py-3 px-6">{t.colRankOption}</th>
                <th className="py-3 px-5 text-right border-l border-slate-200 dark:border-slate-800">
                  {t.colProsConsScore}
                </th>
                <th className="py-3 px-5 text-right border-l border-slate-200 dark:border-slate-800">
                  {t.colMatrixScore}
                </th>
                <th className="py-3 px-5 text-right border-l border-slate-200 dark:border-slate-800">
                  {t.colScenarioExpected}
                </th>
                <th className="py-3 px-5 text-right border-l border-slate-200 dark:border-slate-800">
                  {t.colSwotReadiness}
                </th>
                <th className="py-3 px-6 text-right border-l border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  {t.colCompositeIndex}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
              {scores.map((row, index) => {
                const isWinner = index === 0;
                return (
                  <tr
                    key={row.option.id}
                    className={
                      isWinner
                        ? 'bg-blue-50/20 dark:bg-blue-950/20'
                        : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/30'
                    }
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-baseline gap-2.5">
                        <span className="text-xs font-mono font-semibold text-slate-400 tabular-nums">
                          0{index + 1}.
                        </span>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <span>{row.option.name}</span>
                            {isWinner && (
                              <span className="text-xs font-normal text-emerald-700 dark:text-emerald-400">
                                · {t.leadingChoice}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {row.option.tagline}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-right font-mono tabular-nums border-l border-slate-200 dark:border-slate-800">
                      <div className="text-slate-900 dark:text-slate-100 font-medium">
                        {row.prosConsScore.toFixed(1)}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        +{row.prosWeightedSum} / -{row.consWeightedSum}
                      </div>
                    </td>
                    <td className="py-4 px-5 text-right font-mono tabular-nums border-l border-slate-200 dark:border-slate-800">
                      <div className="text-slate-900 dark:text-slate-100 font-medium">
                        {row.matrixScore.toFixed(1)}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {row.rawMatrixPoints}/{row.maxMatrixPoints} {t.ptsSuffix}
                      </div>
                    </td>
                    <td className="py-4 px-5 text-right font-mono tabular-nums border-l border-slate-200 dark:border-slate-800">
                      <div className="text-slate-900 dark:text-slate-100 font-medium">
                        {row.scenarioExpectedScore.toFixed(1)}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {row.worstCaseScore.toFixed(0)}–{row.bestCaseScore.toFixed(0)}{' '}
                        {t.rangeSuffix}
                      </div>
                    </td>
                    <td className="py-4 px-5 text-right font-mono tabular-nums border-l border-slate-200 dark:border-slate-800">
                      <div className="text-slate-900 dark:text-slate-100 font-medium">
                        {row.swotScore.toFixed(1)}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        +{row.positiveSwotSum} / -{row.negativeSwotSum}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right font-mono tabular-nums border-l border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60">
                      <span
                        className={`text-base font-semibold ${
                          isWinner
                            ? 'text-blue-700 dark:text-blue-400'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {row.compositeScore.toFixed(1)} / 100
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {t.methodologyMixerHeading}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {t.methodologyMixerSub}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {t.mixerProsConsWeight}
                </span>
                <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                  {frameworkWeights.prosCons}x
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={5}
                step={1}
                value={frameworkWeights.prosCons}
                onChange={(e) =>
                  onUpdateFrameworkWeights({
                    ...frameworkWeights,
                    prosCons: Number(e.target.value),
                  })
                }
                className="w-full bg-slate-200 dark:bg-slate-800 rounded-lg"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {t.mixerMatrixWeight}
                </span>
                <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                  {frameworkWeights.matrix}x
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={5}
                step={1}
                value={frameworkWeights.matrix}
                onChange={(e) =>
                  onUpdateFrameworkWeights({
                    ...frameworkWeights,
                    matrix: Number(e.target.value),
                  })
                }
                className="w-full bg-slate-200 dark:bg-slate-800 rounded-lg"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {t.mixerSwotWeight}
                </span>
                <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                  {frameworkWeights.swot}x
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={5}
                step={1}
                value={frameworkWeights.swot}
                onChange={(e) =>
                  onUpdateFrameworkWeights({
                    ...frameworkWeights,
                    swot: Number(e.target.value),
                  })
                }
                className="w-full bg-slate-200 dark:bg-slate-800 rounded-lg"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {t.resetBalanceHint}
            </span>
            <button
              type="button"
              onClick={() =>
                onUpdateFrameworkWeights({ prosCons: 1, matrix: 1, swot: 1 })
              }
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              {t.resetBalanceBtn}
            </button>
          </div>
        </section>

        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {t.blindSpotsHeading}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {t.blindSpotsSub(leader?.option.name || '')}
            </p>
          </div>

          <ul className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800">
            {decision.blindSpots.map((spot, i) => (
              <li key={i} className="pt-3 first:pt-0 flex items-start gap-3">
                <span className="text-xs font-mono font-semibold text-slate-400 tabular-nums mt-0.5">
                  0{i + 1}.
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {spot}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <Scale className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{t.stressTestBadge}</span>
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {t.stressTestWinnerHeading(leader?.option.name || '')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 max-w-2xl">
              {t.stressTestWinnerSub(runnerUp?.option.name || '')}
            </p>
          </div>

          <button
            type="button"
            onClick={handleRunDevilsAdvocate}
            disabled={challengeLoading}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${challengeLoading ? 'animate-spin' : ''}`}
            />
            {challengeLoading ? t.runningStressTestBtn : t.runDevilsAdvocateBtn}
          </button>
        </div>

        {challengeError && (
          <div className="p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-md flex items-start gap-2.5 text-xs text-red-800 dark:text-red-300">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{challengeError}</span>
          </div>
        )}

        {challengeResult && (
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md space-y-1.5">
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {t.counterThesisHeading}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {challengeResult.counterThesis}
                </p>
              </div>

              <div className="p-4 bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-md space-y-1.5">
                <div className="text-xs font-semibold text-amber-900 dark:text-amber-300">
                  {t.reversalTriggerHeading}
                </div>
                <p className="text-xs text-amber-900/90 dark:text-amber-200/80 leading-relaxed">
                  {challengeResult.reversalTrigger}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                {t.suggestedCounterFactorsHeading}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {challengeResult.suggestedProsCons.map((item, idx) => {
                  const key = `pc-${idx}`;
                  const isAdded = addedItems[key];
                  const optName =
                    decision.options.find((o) => o.id === item.optionId)?.name ||
                    decision.options[0]?.name;
                  const normW = normalizeToFiveScale(item.weight);

                  return (
                    <div
                      key={key}
                      className="p-3.5 border border-slate-200 dark:border-slate-800 rounded-md flex items-start justify-between gap-3 bg-white dark:bg-slate-950"
                    >
                      <div className="space-y-1">
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          <span
                            className={
                              item.type === 'pro'
                                ? 'text-emerald-700 dark:text-emerald-400 font-medium'
                                : 'text-red-700 dark:text-red-400 font-medium'
                            }
                          >
                            {item.type === 'pro' ? t.proLabel : t.conLabel}
                          </span>
                          <span>
                            {' '}
                            · {optName} · {normW}/5
                          </span>
                        </div>
                        <div className="text-xs font-medium text-slate-900 dark:text-slate-100">
                          {item.title}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {item.impactNote}
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={isAdded}
                        onClick={() => {
                          onAddProCon({
                            ...item,
                            weight: normW,
                            optionId: decision.options.some((o) => o.id === item.optionId)
                              ? item.optionId
                              : decision.options[0].id,
                            type: item.type === 'pro' ? 'pro' : 'con',
                          });
                          setAddedItems((prev) => ({ ...prev, [key]: true }));
                        }}
                        className="px-2.5 py-1.5 text-xs font-medium border border-slate-200 dark:border-slate-800 rounded hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200 disabled:opacity-50 shrink-0 inline-flex items-center gap-1"
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            {t.addedBtn}
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" />
                            {t.addBtn}
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}

                {challengeResult.suggestedSwot.map((item, idx) => {
                  const key = `swot-${idx}`;
                  const isAdded = addedItems[key];
                  const optName =
                    decision.options.find((o) => o.id === item.optionId)?.name ||
                    decision.options[0]?.name;
                  const normW = normalizeToFiveScale(item.weight);

                  return (
                    <div
                      key={key}
                      className="p-3.5 border border-slate-200 dark:border-slate-800 rounded-md flex items-start justify-between gap-3 bg-white dark:bg-slate-950"
                    >
                      <div className="space-y-1">
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-medium text-slate-800 dark:text-slate-200 capitalize">
                            SWOT {item.quadrant}
                          </span>
                          <span>
                            {' '}
                            · {optName} · {normW}/5
                          </span>
                        </div>
                        <div className="text-xs font-medium text-slate-900 dark:text-slate-100">
                          {item.title}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {item.detail}
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={isAdded}
                        onClick={() => {
                          onAddSwot({
                            ...item,
                            weight: normW,
                            optionId: decision.options.some((o) => o.id === item.optionId)
                              ? item.optionId
                              : decision.options[0].id,
                          });
                          setAddedItems((prev) => ({ ...prev, [key]: true }));
                        }}
                        className="px-2.5 py-1.5 text-xs font-medium border border-slate-200 dark:border-slate-800 rounded hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200 disabled:opacity-50 shrink-0 inline-flex items-center gap-1"
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            {t.addedBtn}
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" />
                            {t.addBtn}
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
