import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  Compass,
  Flame,
} from 'lucide-react';
import {
  DecisionModel,
  SwotItem,
  SwotQuadrant,
  OptionScoreSummary,
} from '../types/decision';
import { normalizeToFiveScale } from '../utils/scoring';
import { UIStrings } from '../i18n/translations';

interface SwotAnalysisViewProps {
  decision: DecisionModel;
  scores: OptionScoreSummary[];
  t: UIStrings;
  onUpdateSwotWeight: (id: string, weight: number) => void;
  onAddSwot: (item: Omit<SwotItem, 'id'>) => void;
  onDeleteSwot: (id: string) => void;
}

const QUADRANT_STYLE: Record<
  SwotQuadrant,
  {
    accentText: string;
    headerBg: string;
    activeBtn: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  strength: {
    accentText: 'text-emerald-800 dark:text-emerald-400',
    headerBg: 'bg-emerald-50/50 dark:bg-emerald-950/30',
    activeBtn: 'bg-emerald-700 text-white',
    icon: ShieldCheck,
  },
  weakness: {
    accentText: 'text-amber-800 dark:text-amber-400',
    headerBg: 'bg-amber-50/50 dark:bg-amber-950/30',
    activeBtn: 'bg-amber-700 text-white',
    icon: AlertTriangle,
  },
  opportunity: {
    accentText: 'text-blue-800 dark:text-blue-400',
    headerBg: 'bg-blue-50/50 dark:bg-blue-950/30',
    activeBtn: 'bg-blue-700 text-white',
    icon: Compass,
  },
  threat: {
    accentText: 'text-red-800 dark:text-red-400',
    headerBg: 'bg-red-50/50 dark:bg-red-950/30',
    activeBtn: 'bg-red-700 text-white',
    icon: Flame,
  },
};

export const SwotAnalysisView: React.FC<SwotAnalysisViewProps> = ({
  decision,
  scores,
  t,
  onUpdateSwotWeight,
  onAddSwot,
  onDeleteSwot,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    decision.options[0]?.id || 'all'
  );
  const [isAdding, setIsAdding] = useState(false);

  const [newOptionId, setNewOptionId] = useState<string>(
    decision.options[0]?.id || 'opt-1'
  );
  const [newQuadrant, setNewQuadrant] = useState<SwotQuadrant>('strength');
  const [newTitle, setNewTitle] = useState('');
  const [newDetail, setNewDetail] = useState('');
  const [newMitigation, setNewMitigation] = useState('');
  const [newWeight, setNewWeight] = useState(4);

  const filteredItems = decision.swot.filter((item) =>
    selectedOptionId === 'all' ? true : item.optionId === selectedOptionId
  );

  const handleCreateSwot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddSwot({
      optionId:
        selectedOptionId !== 'all'
          ? selectedOptionId
          : newOptionId || decision.options[0]?.id || 'opt-1',
      quadrant: newQuadrant,
      title: newTitle.trim(),
      detail: newDetail.trim() || newTitle.trim(),
      mitigationOrLeverage: newMitigation.trim() || newTitle.trim(),
      weight: newWeight,
    });
    setNewTitle('');
    setNewDetail('');
    setNewMitigation('');
    setIsAdding(false);
  };

  const activeOptionScore = scores.find((s) => s.option.id === selectedOptionId);

  return (
    <div className="space-y-6">

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-800">
            {decision.options.map((opt) => {
              const optSwotScore = scores.find((s) => s.option.id === opt.id)?.swotScore;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedOptionId(opt.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-2 ${
                    selectedOptionId === opt.id
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <span>{opt.name}</span>
                  <span className="font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                    {optSwotScore?.toFixed(0)}%
                  </span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setSelectedOptionId('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                selectedOptionId === 'all'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {t.combinedView(decision.swot.length)}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {activeOptionScore && (
            <div className="flex items-center gap-3 text-xs">
              <span className="text-emerald-700 dark:text-emerald-400 font-mono tabular-nums font-medium">
                +{activeOptionScore.positiveSwotSum} S+O
              </span>
              <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">
                /
              </span>
              <span className="text-red-700 dark:text-red-400 font-mono tabular-nums font-medium">
                -{activeOptionScore.negativeSwotSum} W+T
              </span>
              <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">
                ·
              </span>
              <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                {t.swotReadinessLabel} {activeOptionScore.swotScore.toFixed(1)} / 100
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            {t.addSwotFactorBtn}
          </button>
        </div>
      </div>

      {isAdding && (
        <form
          onSubmit={handleCreateSwot}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {t.addSwotModalHeading}
            </h4>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {t.addSwotModalSub}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedOptionId === 'all' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t.targetOptionLabel}
                </label>
                <select
                  value={newOptionId}
                  onChange={(e) => setNewOptionId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100"
                >
                  {decision.options.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t.swotQuadrantLabel}
              </label>
              <select
                value={newQuadrant}
                onChange={(e) => setNewQuadrant(e.target.value as SwotQuadrant)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100"
              >
                <option value="strength">{t.quadrants.strength.title}</option>
                <option value="weakness">{t.quadrants.weakness.title}</option>
                <option value="opportunity">{t.quadrants.opportunity.title}</option>
                <option value="threat">{t.quadrants.threat.title}</option>
              </select>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t.factorHeadlineLabel}
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder={t.factorHeadlinePlaceholder}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t.strategicDetailLabel}
              </label>
              <input
                type="text"
                value={newDetail}
                onChange={(e) => setNewDetail(e.target.value)}
                placeholder={t.strategicDetailPlaceholder}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t.tacticalLeverageLabel}
              </label>
              <input
                type="text"
                value={newMitigation}
                onChange={(e) => setNewMitigation(e.target.value)}
                placeholder={t.tacticalLeveragePlaceholder}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100"
              />
            </div>
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
              {t.addToSwotMatrixBtn}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(['strength', 'weakness', 'opportunity', 'threat'] as SwotQuadrant[]).map(
          (quadrant) => {
            const style = QUADRANT_STYLE[quadrant];
            const meta = t.quadrants[quadrant];
            const Icon = style.icon;
            const quadrantItems = filteredItems.filter((i) => i.quadrant === quadrant);
            const quadrantWeightSum = quadrantItems.reduce(
              (acc, i) => acc + normalizeToFiveScale(i.weight),
              0
            );
            const isPositive = quadrant === 'strength' || quadrant === 'opportunity';

            return (
              <div
                key={quadrant}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden flex flex-col"
              >

                <div
                  className={`px-5 py-4 border-b border-slate-200 dark:border-slate-800 ${style.headerBg}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${style.accentText}`} />
                      <h3 className={`text-sm font-semibold ${style.accentText}`}>
                        {meta.title}
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                      {isPositive ? '+' : '-'}
                      {quadrantWeightSum} {t.ptsSuffix} ({quadrantItems.length})
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {meta.subtitle}
                  </p>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800/70 flex-1">
                  {quadrantItems.length === 0 ? (
                    <div className="px-5 py-8 text-center text-xs text-slate-500 dark:text-slate-400">
                      {t.noFactorsInQuadrant}
                    </div>
                  ) : (
                    quadrantItems.map((item) => {
                      const optName =
                        decision.options.find((o) => o.id === item.optionId)?.name ||
                        item.optionId;
                      const w = normalizeToFiveScale(item.weight);

                      return (
                        <div
                          key={item.id}
                          className="p-5 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors space-y-2.5"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <span className={`font-medium ${style.accentText}`}>
                                  {meta.polarity}
                                </span>
                                {selectedOptionId === 'all' && (
                                  <>
                                    <span aria-hidden="true">·</span>
                                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                                      {optName}
                                    </span>
                                  </>
                                )}
                              </div>
                              <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-snug">
                                {item.title}
                              </h4>
                              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                {item.detail}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => onDeleteSwot(item.id)}
                              aria-label="Delete SWOT item"
                              className="text-slate-300 dark:text-slate-600 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1 shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 px-3 py-2 rounded border border-slate-200/60 dark:border-slate-800">
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                              {isPositive ? t.howToLeverage : t.mitigationPlan}
                            </span>
                            {item.mitigationOrLeverage}
                          </div>

                          <div className="pt-2 flex items-center justify-between gap-4">
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {t.importanceScaleLabel}{' '}
                              <strong className="font-mono text-slate-800 dark:text-slate-200">
                                {isPositive ? '+' : '-'}
                                {w}/5
                              </strong>
                            </span>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((level) => (
                                <button
                                  key={level}
                                  type="button"
                                  onClick={() => onUpdateSwotWeight(item.id, level)}
                                  className={`w-7 h-6 text-xs font-mono font-semibold rounded transition-colors tabular-nums ${
                                    w === level
                                      ? style.activeBtn
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                  }`}
                                >
                                  {level}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};
