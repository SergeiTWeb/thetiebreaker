// src/i18n/translations.ts
import { DecisionModel } from '../types/decision';

export type Language = 'en';

export const LANGUAGE_LABELS: Record<Language, { short: string; native: string }> = {
  en: { short: 'EN', native: 'English' },
};

export interface UIStrings {
  navProsCons: string;
  navMatrix: string;
  navScenarios: string;
  navSwot: string;
  navSensitivity: string;
  themeDark: string;
  themeLight: string;
  exportBrief: string;
  newDecision: string;
  welcomeHeading: string;
  welcomeIntro: string;
  welcomeFeatures: string[];
  welcomeStart: string;
  terminologyHeading: string;
  terminologyDescription: string;
  terminology: Record<string, { label: string; description: string }>;
  
  briefConclusionHeading: string;
  theDecisionShouldBe: string;
  tieDecisionShouldBe: string;
  conclusionSummaryTemplate: (winnerName: string, winnerScore: string, runnerUpName: string, runnerUpScore: string, margin: string, topFactor: string) => string;
  conclusionTieTemplate: (optA: string, optB: string, scoreA: string, scoreB: string) => string;
  conclusionProsConsMetric: string;
  conclusionMatrixMetric: string;
  conclusionScenarioMetric: string;
  conclusionSwotMetric: string;
  
  leadPrefix: string;
  ptsSuffix: string;
  weightedScoreLabel: string;
  rankPrefix: string;
  leadingChoice: string;
  trailsBy: (pts: string) => string;
  
  allOptions: (count: number) => string;
  filterProsConsPlaceholder: string;
  hideFactorForm: string;
  addProConBtn: string;
  listProConHeading: string;
  scaleExplanation: string;
  choiceOptionLabel: string;
  factorTypeLabel: string;
  proPlusWeight: string;
  conMinusWeight: string;
  categoryAspectLabel: string;
  categoryAspectPlaceholder: string;
  importanceWeightLabel: string;
  proOrConStatementLabel: string;
  proOrConStatementPlaceholder: string;
  impactNoteLabel: string;
  impactNotePlaceholder: string;
  addToScoreBtn: string;
  prosCountConsCount: (pros: number, cons: number) => string;
  proPts: (pts: number) => string;
  conPts: (pts: number) => string;
  netLabel: string;
  weightedProsHeader: string;
  weightedConsHeader: string;
  totalPrefix: string;
  noProsEmpty: string;
  noConsEmpty: string;
  proLabel: string;
  conLabel: string;
  importanceScaleLabel: string;
  weightLevels: Record<number, string>;

  loadSampleTemplateLabel: string;
  step3ProsConsLabel: string;
  step3ProsConsSub: string;

  matrixHeading: string;
  matrixSubtitle: string;
  addMatrixFactorBtn: string;
  factorCriterionNameLabel: string;
  factorCriterionPlaceholder: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  ratingLabel: string;
  rationalePlaceholder: (optName: string) => string;
  cancelBtn: string;
  saveFactorRowBtn: string;
  colDecisionFactor: string;
  colImportanceWeight: string;
  priorityLevels: Record<number, string>;
  weightedMatrixTotalScore: string;
  maxPossiblePrefix: string;
  normalizedScoreLabel: string;

  scenariosHeading: string;
  scenariosSubtitle: string;
  updatingScenariosBtn: string;
  recalcScenariosBtn: string;
  scenarioExpectedScoreLabel: string;
  outcomeSpreadLabel: string;
  bestCaseTitle: string;
  mostLikelyTitle: string;
  worstCaseTitle: string;
  probLabel: string;
  impactOfWeightedProsCons: string;
  primaryCatalyst: string;
  unlockingCondition: string;
  netLedgerBalance: string;
  operationalFocus: string;
  primaryRiskDriver: string;
  contingencySafeguard: string;

  combinedView: (count: number) => string;
  swotReadinessLabel: string;
  addSwotFactorBtn: string;
  targetOptionLabel: string;
  swotQuadrantLabel: string;
  factorHeadlineLabel: string;
  factorHeadlinePlaceholder: string;
  strategicDetailLabel: string;
  strategicDetailPlaceholder: string;
  tacticalLeverageLabel: string;
  tacticalLeveragePlaceholder: string;
  addToSwotMatrixBtn: string;
  noFactorsInQuadrant: string;
  howToLeverage: string;
  mitigationPlan: string;
  quadrants: {
    strength: { title: string; subtitle: string; polarity: string };
    weakness: { title: string; subtitle: string; polarity: string };
    opportunity: { title: string; subtitle: string; polarity: string };
    threat: { title: string; subtitle: string; polarity: string };
  };

  crossFrameworkHeading: string;
  crossFrameworkSub: string;
  leadMarginLabel: string;
  colRankOption: string;
  colProsConsScore: string;
  colMatrixScore: string;
  colScenarioExpected: string;
  colSwotReadiness: string;
  colCompositeIndex: string;
  rangeSuffix: string;
  methodologyMixerHeading: string;
  methodologyMixerSub: string;
  mixerProsConsWeight: string;
  mixerMatrixWeight: string;
  mixerSwotWeight: string;
  resetBalanceHint: string;
  resetBalanceBtn: string;
  blindSpotsHeading: string;
  blindSpotsSub: (leaderName: string) => string;
  stressTestBadge: string;
  stressTestWinnerHeading: (leaderName: string) => string;
  stressTestWinnerSub: (runnerUpName: string) => string;
  runningStressTestBtn: string;
  runDevilsAdvocateBtn: string;
  counterThesisHeading: string;
  reversalTriggerHeading: string;
  suggestedCounterFactorsHeading: string;
  addBtn: string;
  addedBtn: string;

  modalHeading: string;
  modalSubtitle: string;
  step1DecisionLabel: string;
  step1DecisionPlaceholder: string;
  step2OptionsLabel: string;
  addOptionBtn: string;
  optionLabel: string;
  typeLabel: string;
  factorDescriptionLabel: string;
  factorDescriptionPlaceholder: string;
  weightShortLabel: string;
  step4ContextLabel: string;
  step4ContextPlaceholder: string;
  modalFooterNote: string;
  buildingDecisionModelBtn: string;
  generateWeightedModelBtn: string;
  
  emptyStateHeading: string;
  emptyStateSubheading: string;
  emptyStateFeature1: string;
  emptyStateFeature2: string;
  emptyStateFeature3: string;
}

export const TRANSLATIONS: Record<Language, UIStrings> = {
  en: {
    navProsCons: 'Pros & Cons',
    navMatrix: 'Decision Matrix',
    navScenarios: 'Scenarios',
    navSwot: 'SWOT Analysis',
    navSensitivity: 'Sensitivity',
    themeDark: 'Dark Mode',
    themeLight: 'Light Mode',
    exportBrief: 'Export Brief',
    newDecision: '+ New Decision',
    welcomeHeading: 'Make your next big decision with confidence.',
    welcomeIntro: 'Transform complex personal, career, and business choices into structured, mathematically-backed comparisons.',
    welcomeFeatures: [
      'Weighted Pros & Cons with net ledger balances',
      'Side-by-side Decision Matrix scoring',
      'Scenario Explorer & Strategic SWOT Analysis',
    ],
    welcomeStart: 'Create Your First Decision',
    terminologyHeading: 'How it works',
    terminologyDescription: 'A quick guide to the analytical frameworks.',
    terminology: {
      prosCons: { label: 'Pros & Cons', description: 'Identify and weight positive and negative factors for each option.' },
      matrix: { label: 'Decision Matrix', description: 'Score options against shared criteria multiplied by importance weight.' },
      scenarios: { label: 'Scenarios', description: 'Project best-case, most likely, and worst-case future outcomes.' },
      swot: { label: 'SWOT', description: 'Map internal strengths/weaknesses and external opportunities/threats.' },
      sensitivity: { label: 'Sensitivity', description: 'Stress-test the decision by adjusting framework weights.' },
    },
    briefConclusionHeading: 'Brief Conclusion',
    theDecisionShouldBe: 'The decision should be:',
    tieDecisionShouldBe: 'Statistical Dead Heat:',
    conclusionSummaryTemplate: (w, ws, r, rs, m, f) => `${w} leads ${r} by ${m} pts, driven primarily by: ${f}.`,
    conclusionTieTemplate: (a, b, sa, sb) => `${a} (${sa}) and ${b} (${sb}) are within the 1.5 pt tie threshold.`,
    conclusionProsConsMetric: 'Pros/Cons',
    conclusionMatrixMetric: 'Matrix',
    conclusionScenarioMetric: 'Scenario Exp.',
    conclusionSwotMetric: 'SWOT',
    leadPrefix: 'Lead:',
    ptsSuffix: 'pts',
    weightedScoreLabel: 'Weighted Score',
    rankPrefix: 'Rank',
    leadingChoice: 'Leading Choice',
    trailsBy: (pts) => `Trails by ${pts} pts`,
    allOptions: (count) => `All Options (${count})`,
    filterProsConsPlaceholder: 'Filter factors...',
    hideFactorForm: 'Hide Form',
    addProConBtn: 'Add Factor',
    listProConHeading: 'Add New Factor',
    scaleExplanation: 'Scale: 1 = Low, 5 = Critical',
    choiceOptionLabel: 'Target Option',
    factorTypeLabel: 'Factor Type',
    proPlusWeight: '+ Pro',
    conMinusWeight: '- Con',
    categoryAspectLabel: 'Category / Domain',
    categoryAspectPlaceholder: 'e.g., Financial, Technical',
    importanceWeightLabel: 'Importance Weight',
    proOrConStatementLabel: 'Factor Headline',
    proOrConStatementPlaceholder: 'e.g., High initial capital requirement',
    impactNoteLabel: 'Impact Note',
    impactNotePlaceholder: 'Briefly explain the real-world impact...',
    addToScoreBtn: 'Add to Ledger',
    prosCountConsCount: (p, c) => `${p} Pros · ${c} Cons`,
    proPts: (pts) => `+${pts} pts`,
    conPts: (pts) => `-${pts} pts`,
    netLabel: 'Net:',
    weightedProsHeader: 'Weighted Pros',
    weightedConsHeader: 'Weighted Cons',
    totalPrefix: 'Total:',
    noProsEmpty: 'No pros added yet.',
    noConsEmpty: 'No cons added yet.',
    proLabel: 'PRO',
    conLabel: 'CON',
    importanceScaleLabel: 'Weight:',
    weightLevels: { 1: '1 (Low)', 2: '2', 3: '3 (Medium)', 4: '4', 5: '5 (Critical)' },
    matrixHeading: 'Decision Matrix',
    matrixSubtitle: 'Compare options side-by-side on shared criteria.',
    addMatrixFactorBtn: '+ Add Criterion',
    factorCriterionNameLabel: 'Criterion Name',
    factorCriterionPlaceholder: 'e.g., Time-to-Market',
    descriptionLabel: 'Description',
    descriptionPlaceholder: 'What does this measure?',
    ratingLabel: 'Performance (1-5)',
    rationalePlaceholder: (opt) => `Why this score for ${opt}?`,
    cancelBtn: 'Cancel',
    saveFactorRowBtn: 'Save Criterion',
    colDecisionFactor: 'Decision Factor',
    colImportanceWeight: 'Weight',
    priorityLevels: { 1: '1 (Low)', 2: '2', 3: '3 (Medium)', 4: '4', 5: '5 (Critical)' },
    weightedMatrixTotalScore: 'Matrix Score',
    maxPossiblePrefix: 'Max:',
    normalizedScoreLabel: 'Normalized',
    scenariosHeading: 'Scenario Explorer',
    scenariosSubtitle: 'Project future outcomes based on current weighted factors.',
    updatingScenariosBtn: 'Updating...',
    recalcScenariosBtn: 'Recalculate Scenarios',
    scenarioExpectedScoreLabel: 'Expected Score',
    outcomeSpreadLabel: 'Outcome Spread',
    bestCaseTitle: 'Best Case',
    mostLikelyTitle: 'Most Likely',
    worstCaseTitle: 'Worst Case',
    probLabel: 'Prob:',
    impactOfWeightedProsCons: 'Impact of Weighted Factors',
    primaryCatalyst: 'Primary Catalyst',
    unlockingCondition: 'Unlocking Condition',
    netLedgerBalance: 'Net Ledger Balance',
    operationalFocus: 'Operational Focus',
    primaryRiskDriver: 'Primary Risk Driver',
    contingencySafeguard: 'Contingency Safeguard',
    combinedView: (count) => `Combined View (${count})`,
    swotReadinessLabel: 'SWOT Readiness',
    addSwotFactorBtn: '+ Add SWOT Factor',
    targetOptionLabel: 'Target Option',
    swotQuadrantLabel: 'Quadrant',
    factorHeadlineLabel: 'Factor Headline',
    factorHeadlinePlaceholder: 'e.g., Strong brand recognition',
    strategicDetailLabel: 'Strategic Detail',
    strategicDetailPlaceholder: 'Elaborate on this factor...',
    tacticalLeverageLabel: 'Leverage / Mitigation',
    tacticalLeveragePlaceholder: 'Actionable next step...',
    addToSwotMatrixBtn: 'Add to SWOT',
    noFactorsInQuadrant: 'No factors in this quadrant yet.',
    howToLeverage: 'How to Leverage',
    mitigationPlan: 'Mitigation Plan',
    quadrants: {
      strength: { title: 'Strengths', subtitle: 'Internal', polarity: 'positive' },
      weakness: { title: 'Weaknesses', subtitle: 'Internal', polarity: 'negative' },
      opportunity: { title: 'Opportunities', subtitle: 'External', polarity: 'positive' },
      threat: { title: 'Threats', subtitle: 'External', polarity: 'negative' },
    },
    crossFrameworkHeading: 'Sensitivity & Devil\'s Advocate',
    crossFrameworkSub: 'Stress-test the mathematical verdict.',
    leadMarginLabel: 'Lead Margin',
    colRankOption: 'Rank & Option',
    colProsConsScore: 'Pros/Cons',
    colMatrixScore: 'Matrix',
    colScenarioExpected: 'Scenario Exp.',
    colSwotReadiness: 'SWOT',
    colCompositeIndex: 'Composite',
    rangeSuffix: '/ 100',
    methodologyMixerHeading: 'Methodology Mixer',
    methodologyMixerSub: 'Adjust framework weights to see if the verdict flips.',
    mixerProsConsWeight: 'Pros & Cons Weight',
    mixerMatrixWeight: 'Matrix Weight',
    mixerSwotWeight: 'SWOT Weight',
    resetBalanceHint: 'Reset to equal 1.0 weights',
    resetBalanceBtn: 'Reset Balance',
    blindSpotsHeading: 'Pre-commitment Blind Spots',
    blindSpotsSub: (leader) => `Critical questions to ask before committing to ${leader}.`,
    stressTestBadge: 'AI Stress Test',
    stressTestWinnerHeading: (leader) => `Stress-testing: ${leader}`,
    stressTestWinnerSub: (runner) => `What would it take for ${runner} to win?`,
    runningStressTestBtn: 'Running Analysis...',
    runDevilsAdvocateBtn: 'Run Devil\'s Advocate',
    counterThesisHeading: 'Counter-Thesis',
    reversalTriggerHeading: 'Reversal Trigger',
    suggestedCounterFactorsHeading: 'Suggested Counter-Factors',
    addBtn: 'Add',
    addedBtn: 'Added',
    modalHeading: 'New Decision',
    modalSubtitle: 'Define the core parameters of your choice.',
    step1DecisionLabel: 'Decision Title',
    step1DecisionPlaceholder: 'e.g., Accept Job Offer A vs. Stay at Current Role',
    step2OptionsLabel: 'Options',
    addOptionBtn: '+ Add Option',
    optionLabel: 'Option Name',
    typeLabel: 'Type',
    factorDescriptionLabel: 'Description',
    factorDescriptionPlaceholder: 'Brief context...',
    weightShortLabel: 'Wt',
    step4ContextLabel: 'Context / Summary',
    step4ContextPlaceholder: 'Any additional background information...',
    modalFooterNote: 'You can refine all weights and details after creation.',
    buildingDecisionModelBtn: 'Building Model...',
    generateWeightedModelBtn: 'Generate Weighted Model',
    loadSampleTemplateLabel: 'Load Sample Template',
    step3ProsConsLabel: 'Initial Factors',
    step3ProsConsSub: 'You can add more later.',
    
    emptyStateHeading: 'Make your next big decision with confidence.',
    emptyStateSubheading: 'Transform complex personal, career, and business choices into structured, mathematically-backed comparisons.',
    emptyStateFeature1: 'Weighted Pros & Cons with net ledger balances',
    emptyStateFeature2: 'Side-by-side Decision Matrix scoring',
    emptyStateFeature3: 'Scenario Explorer & Strategic SWOT Analysis',
  }
};

export function getLocalizedSampleDecisions(lang: Language): DecisionModel[] {
  return []; 
}