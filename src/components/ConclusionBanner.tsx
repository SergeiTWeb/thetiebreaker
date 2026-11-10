import React from 'react';
import { OptionScoreSummary } from '../types/decision';
import { UIStrings } from '../i18n/translations';

interface ConclusionBannerProps {
  scores: OptionScoreSummary[];
  topFactor: string;
  t: UIStrings;
}

export const ConclusionBanner: React.FC<ConclusionBannerProps> = ({
  scores,
  topFactor,
  t,
}) => (
  <div className="px-4 md:px-6 py-4 bg-blue-50/50 dark:bg-blue-950/20 border-b border-blue-100 dark:border-blue-900/50">
    {scores.length > 0 ? (
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
          <strong className="text-sm text-slate-900 dark:text-slate-100">
            {t.theDecisionShouldBe} {scores[0].option.name}
          </strong>
          <span className="text-xs font-mono text-slate-600 dark:text-slate-400">
            Score: {scores[0].compositeScore.toFixed(1)}/100
          </span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Leading primarily due to strength in {topFactor}.
        </p>
        <div className="space-y-2" aria-label="Score comparison">
          {scores.slice(0, 2).map((score, index) => (
            <div key={score.option.id} className="flex items-center gap-3 text-xs">
              <span
                className={`w-32 truncate ${
                  index === 0
                    ? 'text-sm font-semibold text-slate-900 dark:text-slate-100'
                    : 'text-xs text-slate-600 dark:text-slate-400'
                }`}
                title={score.option.name}
              >
                {index === 0 ? 'Winner' : 'Runner-up'}: {score.option.name}
              </span>
              <div
                className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
                role="progressbar"
                aria-label={`${score.option.name} score`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={score.compositeScore}
              >
                <div
                  className={`h-full rounded-full ${
                    index === 0
                      ? 'bg-emerald-600 dark:bg-emerald-500'
                      : 'bg-slate-400 dark:bg-slate-500'
                  }`}
                  style={{
                    width: `${Math.max(0, Math.min(100, score.compositeScore))}%`,
                  }}
                />
              </div>
              <span
                className={`w-14 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300 ${
                  index === 0 ? 'text-sm font-semibold' : 'text-xs'
                }`}
              >
                {score.compositeScore.toFixed(1)}/100
              </span>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <div className="text-sm text-slate-600 dark:text-slate-400">
        {t.buildingDecisionModelBtn}
      </div>
    )}
  </div>
);
