export type FrameworkTab = 'pros-cons' | 'matrix' | 'scenarios' | 'swot' | 'sensitivity';

export interface DecisionOption {
  id: string;
  name: string;
  tagline: string;
  description: string;
}

export interface ProConItem {
  id: string;
  optionId: string;
  type: 'pro' | 'con';
  title: string;
  impactNote: string;
  weight: number;
  domain: string;
}

export interface CriterionOptionScore {
  optionId: string;
  score: number;
  rationale: string;
}

export interface ComparisonCriterion {
  id: string;
  name: string;
  description: string;
  weight: number;
  scores: CriterionOptionScore[];
}

export type SwotQuadrant = 'strength' | 'weakness' | 'opportunity' | 'threat';

export interface SwotItem {
  id: string;
  optionId: string;
  quadrant: SwotQuadrant;
  title: string;
  detail: string;
  weight: number;
  mitigationOrLeverage: string;
}

export interface ScenarioDetail {
  headline: string;
  narrative: string;
  weightedImpactAnalysis: string;
  keyDriverOrContingency: string;
  probabilityPercent: number;
}

export interface OptionScenarioProjection {
  optionId: string;
  bestCase: ScenarioDetail;
  mostLikelyCase: ScenarioDetail;
  worstCase: ScenarioDetail;
}

export interface DecisionModel {
  id: string;
  title: string;
  category: string;
  createdAt: string;
  summary: string;
  analysisNotice?: string;
  options: DecisionOption[];
  prosCons: ProConItem[];
  criteria: ComparisonCriterion[];
  swot: SwotItem[];
  scenarios?: OptionScenarioProjection[];
  blindSpots: string[];
}

export interface OptionScoreSummary {
  option: DecisionOption;

  netProsConsPoints: number;

  prosConsScore: number;
  prosWeightedSum: number;
  consWeightedSum: number;

  rawMatrixPoints: number;
  maxMatrixPoints: number;

  matrixScore: number;

  swotScore: number;
  positiveSwotSum: number;
  negativeSwotSum: number;

  scenarioExpectedScore: number;
  bestCaseScore: number;
  mostLikelyScore: number;
  worstCaseScore: number;

  compositeScore: number;
}

export interface DevilsAdvocateResponse {
  counterThesis: string;
  reversalTrigger: string;
  suggestedProsCons: Omit<ProConItem, 'id'>[];
  suggestedSwot: Omit<SwotItem, 'id'>[];
}
