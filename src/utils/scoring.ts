import { DecisionModel, OptionScoreSummary } from '../types/decision';

export function normalizeToFiveScale(val: number): number {
  if (!Number.isFinite(val)) return 1;
  return Math.max(1, Math.min(5, Math.round(val)));
}

export function computeOptionScores(
  decision: DecisionModel,
  frameworkWeights: { prosCons: number; matrix: number; swot: number } = {
    prosCons: 1,
    matrix: 1,
    swot: 1,
  }
): OptionScoreSummary[] {
  const summaries: OptionScoreSummary[] = decision.options.map((option) => {

    const optionPros = decision.prosCons.filter(
      (item) => item.optionId === option.id && item.type === 'pro'
    );
    const optionCons = decision.prosCons.filter(
      (item) => item.optionId === option.id && item.type === 'con'
    );

    const prosWeightedSum = optionPros.reduce(
      (acc, item) => acc + normalizeToFiveScale(item.weight),
      0
    );
    const consWeightedSum = optionCons.reduce(
      (acc, item) => acc + normalizeToFiveScale(item.weight),
      0
    );
    const netProsConsPoints = prosWeightedSum - consWeightedSum;
    const totalProsConsWeight = prosWeightedSum + consWeightedSum;

    const prosConsScore =
      totalProsConsWeight > 0
        ? Math.round((prosWeightedSum / totalProsConsWeight) * 1000) / 10
        : 50;

    let rawMatrixPoints = 0;
    let maxMatrixPoints = 0;

    for (const criterion of decision.criteria) {
      const cWeight = normalizeToFiveScale(criterion.weight);
      const scoreEntry = criterion.scores.find((s) => s.optionId === option.id);
      const rawScore = scoreEntry ? normalizeToFiveScale(scoreEntry.score) : 3;
      rawMatrixPoints += rawScore * cWeight;
      maxMatrixPoints += 5 * cWeight;
    }

    const matrixScore =
      maxMatrixPoints > 0
        ? Math.round((rawMatrixPoints / maxMatrixPoints) * 1000) / 10
        : 50;

    const optionSwot = decision.swot.filter((item) => item.optionId === option.id);
    const positiveSwotSum = optionSwot
      .filter((item) => item.quadrant === 'strength' || item.quadrant === 'opportunity')
      .reduce((acc, item) => acc + normalizeToFiveScale(item.weight), 0);
    const negativeSwotSum = optionSwot
      .filter((item) => item.quadrant === 'weakness' || item.quadrant === 'threat')
      .reduce((acc, item) => acc + normalizeToFiveScale(item.weight), 0);

    const totalSwotWeight = positiveSwotSum + negativeSwotSum;
    const swotScore =
      totalSwotWeight > 0
        ? Math.round((positiveSwotSum / totalSwotWeight) * 1000) / 10
        : 50;

    const bestDenom = prosWeightedSum * 1.45 + consWeightedSum * 0.35;
    const bestRaw =
      bestDenom > 0 ? (prosWeightedSum * 1.45 / bestDenom) * 100 : 78;
    const bestCaseScore =
      Math.round(Math.min(98, Math.max(55, bestRaw * 0.7 + matrixScore * 0.3)) * 10) / 10;

    const mostLikelyScore =
      Math.round(((prosConsScore * 0.55 + matrixScore * 0.45) * 10)) / 10;

    const worstDenom = prosWeightedSum * 0.45 + consWeightedSum * 1.55;
    const worstRaw =
      worstDenom > 0 ? (prosWeightedSum * 0.45 / worstDenom) * 100 : 28;
    const worstCaseScore =
      Math.round(Math.min(65, Math.max(8, worstRaw * 0.75 + matrixScore * 0.25)) * 10) / 10;

    const scenarioProj = decision.scenarios?.find((s) => s.optionId === option.id);
    const pBest = (scenarioProj?.bestCase.probabilityPercent ?? 25) / 100;
    const pLikely = (scenarioProj?.mostLikelyCase.probabilityPercent ?? 55) / 100;
    const pWorst = (scenarioProj?.worstCase.probabilityPercent ?? 20) / 100;
    const pSum = pBest + pLikely + pWorst || 1;

    const scenarioExpectedScore =
      Math.round(
        ((bestCaseScore * pBest +
          mostLikelyScore * pLikely +
          worstCaseScore * pWorst) /
          pSum) *
          10
      ) / 10;

    const totalFwWeight =
      frameworkWeights.prosCons + frameworkWeights.matrix + frameworkWeights.swot || 1;
    const compositeScore =
      Math.round(
        ((prosConsScore * frameworkWeights.prosCons +
          matrixScore * frameworkWeights.matrix +
          swotScore * frameworkWeights.swot) /
          totalFwWeight) *
          10
      ) / 10;

    return {
      option,
      netProsConsPoints,
      prosConsScore,
      prosWeightedSum,
      consWeightedSum,
      rawMatrixPoints,
      maxMatrixPoints,
      matrixScore,
      swotScore,
      positiveSwotSum,
      negativeSwotSum,
      scenarioExpectedScore,
      bestCaseScore,
      mostLikelyScore,
      worstCaseScore,
      compositeScore,
    };
  });

  return summaries.sort((a, b) => b.compositeScore - a.compositeScore);
}
