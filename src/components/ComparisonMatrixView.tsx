import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { DecisionModel, ComparisonCriterion, OptionScoreSummary } from '../types/decision';
import { normalizeToFiveScale } from '../utils/scoring';
import { UIStrings } from '../i18n/translations';

interface ComparisonMatrixViewProps {
  decision: DecisionModel;
  scores: OptionScoreSummary[];
  t: UIStrings;
  onUpdateCriterionWeight: (criterionId: string, weight: number) => void;
  onUpdateOptionScore: (criterionId: string, optionId: string, score: number) => void;
  onAddCriterion: (criterion: Omit<ComparisonCriterion, 'id'>) => void;
  onDeleteCriterion: (criterionId: string) => void;
}

export const ComparisonMatrixView: React.FC<ComparisonMatrixViewProps> = ({
  decision,
  scores,
  t,
  onUpdateCriterionWeight,
  onUpdateOptionScore,
  onAddCriterion,
  onDeleteCriterion,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newWeight, setNewWeight] = useState(4);
  const [optionScores, setOptionScores] = useState<
    Record<string, { score: number; rationale: string }>
  >(() => {
    const init: Record<string, { score: number; rationale: string }> = {};
    decision.options.forEach((opt) => {
      init[opt.id] = { score: 4, rationale: '' };
    });
    return init;
  });

  const totalCriteriaWeight =
    decision.criteria.reduce((acc, c) => acc + normalizeToFiveScale(c.weight), 0) || 1;

  const handleCreateCriterion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onAddCriterion({
      name: newName.trim(),
      description: newDesc.trim() || newName.trim(),
      weight: newWeight,
      scores: decision.options.map((opt) => ({
        optionId: opt.id,
        score: optionScores[opt.id]?.score ?? 3,
        rationale: optionScores[opt.id]?.rationale?.trim() || '',
      })),
    });

    setNewName('');
    setNewDesc('');
    setIsAdding(false);
  };

  const highestMatrixScore = Math.max(...scores.map((s) => s.matrixScore), 0);

  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {t.matrixHeading}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            {t.matrixSubtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 rounded-lg transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          {t.addMatrixFactorBtn}
        </button>
      </div>

      {isAdding && (
        <form
          onSubmit={handleCreateCriterion}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {t.addMatrixFactorModalHeading}
            </h4>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {t.addMatrixFactorModalSub}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t.factorCriterionNameLabel}
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={t.factorCriterionPlaceholder}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t.descriptionLabel}
              </label>
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder={t.descriptionPlaceholder}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {t.importanceWeightLabel}
                </label>
                <span className="text-xs font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                  {newWeight} / 5
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1">
                {[1, 2, 3, 4, 5].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setNewWeight(w)}
                    className={`py-1.5 text-xs font-mono font-semibold rounded border transition-colors tabular-nums ${
                      newWeight === w
                        ? 'bg-slate-900 dark:bg-blue-600 text-white border-slate-900 dark:border-blue-500'
                        : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {decision.options.map((opt) => {
              const current = optionScores[opt.id] || { score: 4, rationale: '' };
              return (
                <div
                  key={opt.id}
                  className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-md space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {opt.name}
                    </span>
                    <span className="text-xs font-mono font-semibold text-blue-700 dark:text-blue-400 tabular-nums">
                      {t.ratingLabel} {current.score}/5
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-1">
                    {[1, 2, 3, 4, 5].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() =>
                          setOptionScores((prev) => ({
                            ...prev,
                            [opt.id]: { ...current, score: r },
                          }))
                        }
                        className={`py-1 text-xs font-mono font-semibold rounded border transition-colors tabular-nums ${
                          current.score === r
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={current.rationale}
                    onChange={(e) =>
                      setOptionScores((prev) => ({
                        ...prev,
                        [opt.id]: { ...current, rationale: e.target.value },
                      }))
                    }
                    placeholder={t.rationalePlaceholder(opt.name)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-600"
                  />
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            >
              {t.cancelBtn}
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              {t.saveFactorRowBtn}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <th className="py-3.5 px-5 min-w-[240px] w-[28%]">
                  {t.colDecisionFactor}
                </th>
                <th className="py-3.5 px-4 min-w-[190px] w-[20%] border-l border-slate-200 dark:border-slate-800">
                  {t.colImportanceWeight}
                </th>
                {decision.options.map((opt) => {
                  const optScore = scores.find((s) => s.option.id === opt.id);
                  const isLeader =
                    optScore &&
                    Math.abs(optScore.matrixScore - highestMatrixScore) < 0.05;
                  return (
                    <th
                      key={opt.id}
                      className={`py-3.5 px-5 min-w-[230px] border-l border-slate-200 dark:border-slate-800 ${
                        isLeader ? 'bg-blue-50/30 dark:bg-blue-950/20' : ''
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-slate-900 dark:text-slate-100 font-semibold truncate">
                          {opt.name}
                        </span>
                        <span className="font-mono text-xs tabular-nums text-blue-700 dark:text-blue-400 shrink-0">
                          {optScore?.rawMatrixPoints} {t.ptsSuffix} ({optScore?.matrixScore.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="text-xs font-normal text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {opt.tagline}
                      </div>
                    </th>
                  );
                })}
                <th className="py-3.5 px-3 w-10 border-l border-slate-200 dark:border-slate-800 text-center">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
              {decision.criteria.map((criterion, idx) => {
                const cWeight = normalizeToFiveScale(criterion.weight);
                const weightShare = Math.round((cWeight / totalCriteriaWeight) * 100);

                return (
                  <tr
                    key={criterion.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors align-top"
                  >
                    <td className="py-4 px-5">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-mono text-slate-400 tabular-nums">
                          {String(idx + 1).padStart(2, '0')}.
                        </span>
                        <div>
                          <div className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                            {criterion.name}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                            {criterion.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 border-l border-slate-200 dark:border-slate-800">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                          {cWeight} / 5
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                          {weightShare}% {t.shareSuffix}
                        </span>
                      </div>
                      <div className="grid grid-cols-5 gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => onUpdateCriterionWeight(criterion.id, level)}
                            className={`py-1 text-xs font-mono font-semibold rounded transition-colors tabular-nums ${
                              cWeight === level
                                ? 'bg-slate-900 dark:bg-blue-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                      <div className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                        {t.priorityLevels[cWeight]}
                      </div>
                    </td>

                    {decision.options.map((opt) => {
                      const entry = criterion.scores.find((s) => s.optionId === opt.id) || {
                        optionId: opt.id,
                        score: 3,
                        rationale: '',
                      };
                      const rScore = normalizeToFiveScale(entry.score);
                      const weightedPoints = rScore * cWeight;

                      return (
                        <td
                          key={opt.id}
                          className="py-4 px-5 border-l border-slate-200 dark:border-slate-800"
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {t.ratingLabel}
                              </span>
                              <span className="text-xs font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                                {rScore}/5
                              </span>
                            </div>
                            <span className="text-xs font-mono font-semibold text-blue-700 dark:text-blue-400 tabular-nums">
                              +{weightedPoints} {t.ptsSuffix} ({cWeight}×{rScore})
                            </span>
                          </div>

                          <div className="grid grid-cols-5 gap-1 mb-2.5">
                            {[1, 2, 3, 4, 5].map((val) => (
                              <button
                                key={val}
                                type="button"
                                onClick={() =>
                                  onUpdateOptionScore(criterion.id, opt.id, val)
                                }
                                className={`py-1 text-xs font-mono font-semibold rounded transition-colors tabular-nums ${
                                  rScore === val
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-700'
                                }`}
                              >
                                {val}
                              </button>
                            ))}
                          </div>

                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            {entry.rationale}
                          </p>
                        </td>
                      );
                    })}

                    <td className="py-4 px-3 border-l border-slate-200 dark:border-slate-800 text-center">
                      <button
                        type="button"
                        onClick={() => onDeleteCriterion(criterion.id)}
                        disabled={decision.criteria.length <= 1}
                        aria-label={`Delete criterion ${criterion.name}`}
                        className="text-slate-300 dark:text-slate-600 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-30 transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            <tfoot>
              <tr className="border-t-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-semibold text-sm">
                <td className="py-4 px-5 text-slate-900 dark:text-slate-100">
                  {t.weightedMatrixTotalScore}
                </td>
                <td className="py-4 px-4 border-l border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-600 dark:text-slate-400 tabular-nums">
                  {t.maxPossiblePrefix} {totalCriteriaWeight * 5} {t.ptsSuffix}
                </td>
                {decision.options.map((opt) => {
                  const optScore = scores.find((s) => s.option.id === opt.id);
                  const isLeader =
                    optScore &&
                    Math.abs(optScore.matrixScore - highestMatrixScore) < 0.05;

                  return (
                    <td
                      key={opt.id}
                      className={`py-4 px-5 border-l border-slate-200 dark:border-slate-800 ${
                        isLeader ? 'bg-blue-50/50 dark:bg-blue-950/30' : ''
                      }`}
                    >
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                          {t.weightedScoreLabel}:
                        </span>
                        <span className="text-base font-mono font-semibold text-slate-900 dark:text-white tabular-nums">
                          {optScore?.rawMatrixPoints} / {optScore?.maxMatrixPoints} {t.ptsSuffix}
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between mt-1 text-xs font-mono text-blue-700 dark:text-blue-400 tabular-nums">
                        <span>{t.normalizedScoreLabel}</span>
                        <span>{optScore?.matrixScore.toFixed(1)} / 100</span>
                      </div>
                    </td>
                  );
                })}
                <td className="border-l border-slate-200 dark:border-slate-800" />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
