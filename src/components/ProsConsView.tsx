import React, { useState } from 'react';
import { Plus, Trash2, ArrowUpRight, ArrowDownRight, Search } from 'lucide-react';
import { DecisionModel, ProConItem, OptionScoreSummary } from '../types/decision';
import { normalizeToFiveScale } from '../utils/scoring';
import { UIStrings } from '../i18n/translations';

interface ProsConsViewProps {
  decision: DecisionModel;
  scores: OptionScoreSummary[];
  t: UIStrings;
  onUpdateWeight: (id: string, weight: number) => void;
  onAddProCon: (item: Omit<ProConItem, 'id'>) => void;
  onDeleteProCon: (id: string) => void;
}

export const ProsConsView: React.FC<ProsConsViewProps> = ({
  decision,
  scores,
  t,
  onUpdateWeight,
  onAddProCon,
  onDeleteProCon,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(true);

  const [newOptionId, setNewOptionId] = useState<string>(
    decision.options[0]?.id || 'opt-1'
  );
  const [newType, setNewType] = useState<'pro' | 'con'>('pro');
  const [newTitle, setNewTitle] = useState<string>('');
  const [newImpactNote, setNewImpactNote] = useState<string>('');
  const [newDomain, setNewDomain] = useState<string>('');
  const [newWeight, setNewWeight] = useState<number>(4);

  const visibleOptions =
    selectedOptionId === 'all'
      ? decision.options
      : decision.options.filter((o) => o.id === selectedOptionId);

  const handleCreateFactor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddProCon({
      optionId: newOptionId || decision.options[0]?.id || 'opt-1',
      type: newType,
      title: newTitle.trim(),
      impactNote: newImpactNote.trim() || newTitle.trim(),
      domain: newDomain.trim() || 'Core',
      weight: newWeight,
    });
    setNewTitle('');
    setNewImpactNote('');
  };

  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 flex-wrap">
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
              {t.allOptions(decision.prosCons.length)}
            </button>
            {decision.options.map((opt) => {
              const count = decision.prosCons.filter((p) => p.optionId === opt.id).length;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedOptionId(opt.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap truncate max-w-[200px] ${
                    selectedOptionId === opt.id
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {opt.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.filterProsConsPlaceholder}
              className="pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 w-44 sm:w-56"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setNewOptionId(
                selectedOptionId !== 'all'
                  ? selectedOptionId
                  : decision.options[0]?.id || 'opt-1'
              );
              setIsAdding(!isAdding);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            {isAdding ? t.hideFactorForm : t.addProConBtn}
          </button>
        </div>
      </div>

      {isAdding && (
        <form
          onSubmit={handleCreateFactor}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {t.listProConHeading}
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {t.scaleExplanation}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t.choiceOptionLabel}
              </label>
              <select
                value={newOptionId}
                onChange={(e) => setNewOptionId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
              >
                {decision.options.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t.factorTypeLabel}
              </label>
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-950 rounded-md border border-slate-200/60 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setNewType('pro')}
                  className={`py-1.5 text-xs font-medium rounded transition-colors ${
                    newType === 'pro'
                      ? 'bg-emerald-700 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {t.proPlusWeight}
                </button>
                <button
                  type="button"
                  onClick={() => setNewType('con')}
                  className={`py-1.5 text-xs font-medium rounded transition-colors ${
                    newType === 'con'
                      ? 'bg-red-700 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {t.conMinusWeight}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t.categoryAspectLabel}
              </label>
              <input
                type="text"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder={t.categoryAspectPlaceholder}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {t.importanceWeightLabel}
                </label>
                <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 tabular-nums">
                  {t.weightLevels[newWeight]}
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
                        : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t.proOrConStatementLabel}
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder={t.proOrConStatementPlaceholder}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
              />
            </div>
            <div className="md:col-span-5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t.impactNoteLabel}
              </label>
              <input
                type="text"
                value={newImpactNote}
                onChange={(e) => setNewImpactNote(e.target.value)}
                placeholder={t.impactNotePlaceholder}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="w-full px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors whitespace-nowrap"
              >
                {t.addToScoreBtn}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-8">
        {visibleOptions.map((option) => {
          const optScore = scores.find((s) => s.option.id === option.id);
          const allOptionItems = decision.prosCons.filter((item) => {
            if (item.optionId !== option.id) return false;
            if (!searchQuery.trim()) return true;
            const q = searchQuery.toLowerCase();
            return (
              item.title.toLowerCase().includes(q) ||
              item.impactNote.toLowerCase().includes(q) ||
              item.domain.toLowerCase().includes(q)
            );
          });

          const pros = allOptionItems.filter((i) => i.type === 'pro');
          const cons = allOptionItems.filter((i) => i.type === 'con');

          const prosSum = optScore?.prosWeightedSum || 0;
          const consSum = optScore?.consWeightedSum || 0;
          const netPts = optScore?.netProsConsPoints || 0;
          const totalWeight = prosSum + consSum || 1;
          const prosRatio = Math.round((prosSum / totalWeight) * 100);

          return (
            <section
              key={option.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden"
            >

              <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/70">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {option.tagline}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        {t.prosCountConsCount(pros.length, cons.length)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {option.name}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 max-w-3xl">
                      {option.description}
                    </p>
                  </div>

                  <div className="flex flex-col sm:items-end shrink-0 min-w-[290px]">
                    <div className="flex items-baseline justify-between sm:justify-end gap-3 w-full text-xs mb-1.5">
                      <span className="text-emerald-700 dark:text-emerald-400 font-mono tabular-nums font-medium">
                        {t.proPts(prosSum)}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">
                        /
                      </span>
                      <span className="text-red-700 dark:text-red-400 font-mono tabular-nums font-medium">
                        {t.conPts(consSum)}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">
                        ·
                      </span>
                      <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                        {t.netLabel} {netPts >= 0 ? `+${netPts}` : netPts}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">
                        ·
                      </span>
                      <span className="text-sm font-mono font-semibold text-slate-900 dark:text-white tabular-nums">
                        {optScore?.prosConsScore.toFixed(1)} / 100
                      </span>
                    </div>
                    <div className="w-full h-2 bg-red-100 dark:bg-red-950/60 rounded-xs overflow-hidden flex">
                      <div
                        className="bg-emerald-600 dark:bg-emerald-500 h-full transition-all duration-150"
                        style={{ width: `${prosRatio}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800">

                <div className="divide-y divide-slate-100 dark:divide-slate-800/70">
                  <div className="px-6 py-3 bg-slate-50/40 dark:bg-slate-950/40 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-400">
                      <ArrowUpRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>{t.weightedProsHeader}</span>
                    </div>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                      {t.totalPrefix} +{prosSum}
                    </span>
                  </div>

                  {pros.length === 0 ? (
                    <div className="px-6 py-8 text-center text-xs text-slate-500 dark:text-slate-400">
                      {t.noProsEmpty}
                    </div>
                  ) : (
                    pros.map((item) => {
                      const w = normalizeToFiveScale(item.weight);
                      return (
                        <div
                          key={item.id}
                          className="px-6 py-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <span className="font-medium text-emerald-700 dark:text-emerald-400">
                                  {t.proLabel}
                                </span>
                                <span aria-hidden="true">·</span>
                                <span>{item.domain}</span>
                              </div>
                              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-snug">
                                {item.title}
                              </p>
                              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                {item.impactNote}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => onDeleteProCon(item.id)}
                              aria-label="Remove factor"
                              className="text-slate-300 dark:text-slate-600 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1 shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {t.importanceScaleLabel}{' '}
                              <strong className="text-slate-700 dark:text-slate-300 font-mono">
                                {t.weightLevels[w]}
                              </strong>
                            </span>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((level) => (
                                <button
                                  key={level}
                                  type="button"
                                  onClick={() => onUpdateWeight(item.id, level)}
                                  className={`w-7 h-6 text-xs font-mono font-semibold rounded transition-colors tabular-nums ${
                                    w === level
                                      ? 'bg-emerald-700 text-white'
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-slate-700'
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

                <div className="divide-y divide-slate-100 dark:divide-slate-800/70">
                  <div className="px-6 py-3 bg-slate-50/40 dark:bg-slate-950/40 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-red-800 dark:text-red-400">
                      <ArrowDownRight className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span>{t.weightedConsHeader}</span>
                    </div>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                      {t.totalPrefix} -{consSum}
                    </span>
                  </div>

                  {cons.length === 0 ? (
                    <div className="px-6 py-8 text-center text-xs text-slate-500 dark:text-slate-400">
                      {t.noConsEmpty}
                    </div>
                  ) : (
                    cons.map((item) => {
                      const w = normalizeToFiveScale(item.weight);
                      return (
                        <div
                          key={item.id}
                          className="px-6 py-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <span className="font-medium text-red-700 dark:text-red-400">
                                  {t.conLabel}
                                </span>
                                <span aria-hidden="true">·</span>
                                <span>{item.domain}</span>
                              </div>
                              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-snug">
                                {item.title}
                              </p>
                              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                {item.impactNote}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => onDeleteProCon(item.id)}
                              aria-label="Remove factor"
                              className="text-slate-300 dark:text-slate-600 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1 shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {t.importanceScaleLabel}{' '}
                              <strong className="text-slate-700 dark:text-slate-300 font-mono">
                                {t.weightLevels[w]}
                              </strong>
                            </span>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((level) => (
                                <button
                                  key={level}
                                  type="button"
                                  onClick={() => onUpdateWeight(item.id, level)}
                                  className={`w-7 h-6 text-xs font-mono font-semibold rounded transition-colors tabular-nums ${
                                    w === level
                                      ? 'bg-red-700 text-white'
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-slate-700'
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
            </section>
          );
        })}
      </div>
    </div>
  );
};
