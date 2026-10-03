import { DecisionModel } from '../types/decision';
import { SAMPLE_DECISIONS } from '../data/sampleDecisions';

export type Language = 'en' | 'ru' | 'fi';

export const LANGUAGE_LABELS: Record<Language, { short: string; native: string }> = {
  en: { short: 'EN', native: 'English' },
  ru: { short: 'RU', native: 'Русский' },
  fi: { short: 'FI', native: 'Suomi' },
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
  welcomeDismiss: string;
  terminologyHeading: string;
  terminologyDescription: string;
  terminology: Record<
    string,
    {
      label: string;
      description: string;
    }
  >;

  quickPromptLabel: string;
  quickPromptPlaceholder: string;
  generatingModel: string;
  generateMatrixScenarios: string;
  decisionDossiers: string;
  guidedBuilder: string;
  leadPrefix: string;
  ptsSuffix: string;
  scaleActiveNote: string;
  resetSamples: string;

  updatedPrefix: string;
  optionsCompared: string;
  weightedFactorsScale: string;

  briefConclusionHeading: string;
  theDecisionShouldBe: string;
  tieDecisionShouldBe: string;
  conclusionSummaryTemplate: (
    winnerName: string,
    winnerScore: string,
    runnerUpName: string,
    runnerUpScore: string,
    margin: string,
    topFactor: string
  ) => string;
  conclusionTieTemplate: (
    optA: string,
    optB: string,
    scoreA: string,
    scoreB: string
  ) => string;
  conclusionProsConsMetric: string;
  conclusionMatrixMetric: string;
  conclusionScenarioMetric: string;
  conclusionSwotMetric: string;

  currentRecommendation: string;
  statisticalDeadHeat: (margin: string) => string;
  clearLead: (margin: string) => string;
  weightedScoreLabel: string;
  rankPrefix: string;
  leadingChoice: string;
  trailsBy: (pts: string) => string;
  tabProsConsShort: string;
  tabMatrixShort: string;
  tabScenariosShort: string;
  tabSwotShort: string;
  tabProsConsFull: (count: number) => string;
  tabMatrixFull: (count: number) => string;
  tabScenariosFull: string;
  tabSwotFull: (count: number) => string;
  tabSensitivityFull: string;
  realtimeRecalcHint: string;

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

  matrixHeading: string;
  matrixSubtitle: string;
  addMatrixFactorBtn: string;
  addMatrixFactorModalHeading: string;
  addMatrixFactorModalSub: string;
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
  shareSuffix: string;
  priorityLevels: Record<number, string>;
  weightedMatrixTotalScore: string;
  maxPossiblePrefix: string;
  normalizedScoreLabel: string;

  scenariosHeading: string;
  scenariosSubtitle: string;
  allChoices: (count: number) => string;
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
  addSwotModalHeading: string;
  addSwotModalSub: string;
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
  loadSampleTemplateLabel: string;
  step1DecisionLabel: string;
  step1DecisionPlaceholder: string;
  step2OptionsLabel: string;
  addOptionBtn: string;
  step3ProsConsLabel: string;
  step3ProsConsSub: string;
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
}

export const TRANSLATIONS: Record<Language, UIStrings> = {
  en: {
    navProsCons: 'Pros & Cons',
    navMatrix: 'Decision Matrix',
    navScenarios: 'Scenarios',
    navSwot: 'SWOT Analysis',
    navSensitivity: 'Sensitivity',
    themeDark: 'Dark',
    themeLight: 'Light',
    exportBrief: 'Export Brief',
    newDecision: 'New Decision',
    welcomeHeading: 'Welcome to The Tiebreaker',
    welcomeIntro:
      'Compare options, weight trade-offs, and surface the decision that still wins when conditions change.',
    welcomeFeatures: [
      'Score each option with weighted Pros & Cons',
      'Rate choices across a Decision Matrix',
      'Explore Best / Likely / Worst-case Scenarios',
      'Use SWOT Analysis and Sensitivity checks before committing',
    ],
    welcomeStart: 'Start by choosing a sample decision or create a fresh one from the New Decision button.',
    welcomeDismiss: 'Continue',
    terminologyHeading: 'What these terms mean',
    terminologyDescription:
      'Each analytical lens helps you evaluate a different angle of the same problem before you choose.',
    terminology: {
      prosCons: {
        label: 'Pros & Cons',
        description: 'Lists the strongest arguments for and against each option and gives them importance weights.',
      },
      decision: {
        label: 'Decision',
        description: 'The actual choice you are trying to make, with the trade-offs and constraints in view.',
      },
      matrix: {
        label: 'Decision Matrix',
        description: 'A weighted comparison of criteria so you can score each option on what matters most.',
      },
      scenarios: {
        label: 'Scenarios',
        description: 'Models Best, Most Likely, and Worst-case outcomes so you see the path under uncertainty.',
      },
      swot: {
        label: 'SWOT Analysis',
        description: 'Highlights internal strengths, weaknesses, and external opportunities or threats.',
      },
      sensitivity: {
        label: 'Sensitivity',
        description: 'Tests how changes in weighting affect the final recommendation and the lead margin.',
      },
    },

    quickPromptLabel: 'Quick Decision & Scenario Prompt',
    quickPromptPlaceholder:
      "Enter any decision (e.g., 'Should I lease an EV or buy a used hybrid?')...",
    generatingModel: 'Generating Model...',
    generateMatrixScenarios: 'Generate Matrix & Scenarios',
    decisionDossiers: 'Decision Dossiers',
    guidedBuilder: '+ Guided Builder',
    leadPrefix: 'Lead:',
    ptsSuffix: 'pts',
    scaleActiveNote: '1–5 Scale Active',
    resetSamples: 'Reset Samples',

    updatedPrefix: 'Updated',
    optionsCompared: 'Options Compared',
    weightedFactorsScale: 'Weighted Factors (1–5 Scale)',

    briefConclusionHeading: 'Brief Decision Conclusion',
    theDecisionShouldBe: 'The decision should be:',
    tieDecisionShouldBe: 'Current tie — slight edge to:',
    conclusionSummaryTemplate: (
      winnerName,
      winnerScore,
      runnerUpName,
      runnerUpScore,
      margin,
      topFactor
    ) =>
      `Based on your weighted criteria, ${winnerName} leads with a composite score of ${winnerScore}/100 versus ${runnerUpName} at ${runnerUpScore}/100 (+${margin} pt advantage). The primary tiebreaking driver is "${topFactor}".`,
    conclusionTieTemplate: (optA, optB, scoreA, scoreB) =>
      `${optA} (${scoreA}/100) and ${optB} (${scoreB}/100) are in a statistical dead heat. Adjust the 1–5 importance weights below to break the tie.`,
    conclusionProsConsMetric: 'Pros & Cons Balance',
    conclusionMatrixMetric: 'Decision Matrix',
    conclusionScenarioMetric: 'Scenario Expected Value',
    conclusionSwotMetric: 'SWOT Readiness',

    currentRecommendation: 'Current Tiebreaker Recommendation',
    statisticalDeadHeat: (margin) => `Statistical Dead Heat (+${margin} pt margin)`,
    clearLead: (margin) => `Clear Lead (+${margin} pt margin)`,
    weightedScoreLabel: 'Weighted Score',
    rankPrefix: 'Rank',
    leadingChoice: 'Leading Choice',
    trailsBy: (pts) => `Trails by ${pts} pts`,
    tabProsConsShort: 'Pros/Cons',
    tabMatrixShort: 'Matrix',
    tabScenariosShort: 'Scenarios',
    tabSwotShort: 'SWOT',
    tabProsConsFull: (count) => `01. Weighted Pros & Cons (${count})`,
    tabMatrixFull: (count) => `02. Weighted Decision Matrix (${count})`,
    tabScenariosFull: '03. Scenario Explorer (Best / Likely / Worst)',
    tabSwotFull: (count) => `04. Strategic SWOT (${count})`,
    tabSensitivityFull: '05. Sensitivity & Devil’s Advocate',
    realtimeRecalcHint:
      'Assign weights (1–5) to recalculate scores & scenarios in real time',

    allOptions: (count) => `All Options (${count})`,
    filterProsConsPlaceholder: 'Filter pros & cons...',
    hideFactorForm: 'Hide Factor Form',
    addProConBtn: 'Add Pro / Con',
    listProConHeading: 'List a Pro or Con & Assign Importance Weight (1–5)',
    scaleExplanation: '1 = Low Importance · 3 = Moderate · 5 = Critical Decision Driver',
    choiceOptionLabel: 'Choice / Option',
    factorTypeLabel: 'Factor Type',
    proPlusWeight: 'Pro (+ Weight)',
    conMinusWeight: 'Con (- Weight)',
    categoryAspectLabel: 'Category / Aspect',
    categoryAspectPlaceholder: 'e.g., Financial, Lifestyle, Risk',
    importanceWeightLabel: 'Importance Weight (1–5)',
    proOrConStatementLabel: 'Pro or Con Factor Statement *',
    proOrConStatementPlaceholder: 'Enter a specific pro or con...',
    impactNoteLabel: 'Impact Note (Optional)',
    impactNotePlaceholder: 'How does this affect the outcome or scenarios?',
    addToScoreBtn: '+ Add to Score',
    prosCountConsCount: (pros, cons) => `${pros} Pros / ${cons} Cons`,
    proPts: (pts) => `+${pts} Pro pts`,
    conPts: (pts) => `-${pts} Con pts`,
    netLabel: 'Net:',
    weightedProsHeader: 'Weighted Pros (1–5 Importance Scale)',
    weightedConsHeader: 'Weighted Cons (1–5 Importance Scale)',
    totalPrefix: 'Total:',
    noProsEmpty: 'No matching pro factors for this option. Use the form above to add one.',
    noConsEmpty: 'No matching con factors for this option. Use the form above to add one.',
    proLabel: 'Pro',
    conLabel: 'Con',
    importanceScaleLabel: 'Importance (1–5):',
    weightLevels: {
      1: '1 · Low',
      2: '2 · Minor',
      3: '3 · Moderate',
      4: '4 · High',
      5: '5 · Critical',
    },

    matrixHeading: 'Weighted Decision Matrix (1–5 Scale)',
    matrixSubtitle:
      'Assign an importance weight (1–5) to each factor and rate each option (1–5). Weighted Score = Σ (Weight × Rating).',
    addMatrixFactorBtn: 'Add Matrix Factor',
    addMatrixFactorModalHeading: 'Add Weighted Decision Factor',
    addMatrixFactorModalSub: 'Assign importance weight (1–5) and score each option (1–5)',
    factorCriterionNameLabel: 'Factor / Criterion Name',
    factorCriterionPlaceholder: 'e.g., Total Cost, Flexibility, Career Upside',
    descriptionLabel: 'Description',
    descriptionPlaceholder: 'What does a 5/5 rating mean?',
    ratingLabel: 'Rating:',
    rationalePlaceholder: (optName) => `Rationale for ${optName}...`,
    cancelBtn: 'Cancel',
    saveFactorRowBtn: 'Save Factor Row',
    colDecisionFactor: 'Decision Factor',
    colImportanceWeight: 'Importance Weight (1–5)',
    shareSuffix: 'share',
    priorityLevels: {
      1: '1 · Low Priority',
      2: '2 · Minor Priority',
      3: '3 · Moderate Priority',
      4: '4 · High Priority',
      5: '5 · Critical Priority',
    },
    weightedMatrixTotalScore: 'Weighted Matrix Total Score',
    maxPossiblePrefix: 'Max Possible:',
    normalizedScoreLabel: 'Normalized Score:',

    scenariosHeading: 'Multi-Scenario Explorer (Best-Case, Most Likely & Worst-Case)',
    scenariosSubtitle:
      'Evaluates how your 1–5 weighted Pros and Cons amplify or dampen outcomes across three probability-weighted futures for each choice.',
    allChoices: (count) => `All Choices (${count})`,
    updatingScenariosBtn: 'Updating Scenarios...',
    recalcScenariosBtn: 'Recalculate Scenarios from Weights',
    scenarioExpectedScoreLabel: 'Scenario-Expected Score',
    outcomeSpreadLabel: 'Outcome Spread (Worst → Best)',
    bestCaseTitle: 'Best-Case Scenario',
    mostLikelyTitle: 'Most Likely Scenario',
    worstCaseTitle: 'Worst-Case Scenario',
    probLabel: 'Prob',
    impactOfWeightedProsCons: 'Impact of Weighted Pros & Cons',
    primaryCatalyst: 'Primary Catalyst:',
    unlockingCondition: 'Unlocking Condition:',
    netLedgerBalance: 'Net Ledger Balance:',
    operationalFocus: 'Operational Focus:',
    primaryRiskDriver: 'Primary Risk Driver:',
    contingencySafeguard: 'Contingency Safeguard:',

    combinedView: (count) => `Combined View (${count})`,
    swotReadinessLabel: 'SWOT Readiness:',
    addSwotFactorBtn: 'Add SWOT Factor',
    addSwotModalHeading: 'Add Weighted SWOT Factor (1–5 Scale)',
    addSwotModalSub:
      'Strengths & Opportunities add positive weight; Weaknesses & Threats subtract weight',
    targetOptionLabel: 'Target Option',
    swotQuadrantLabel: 'SWOT Quadrant',
    factorHeadlineLabel: 'Factor Headline',
    factorHeadlinePlaceholder: 'Concise statement of strength, risk, or opportunity...',
    strategicDetailLabel: 'Strategic Detail',
    strategicDetailPlaceholder: 'Context and operational impact...',
    tacticalLeverageLabel: 'Tactical Leverage / Mitigation',
    tacticalLeveragePlaceholder: 'How will you capitalize on or defend against this?',
    addToSwotMatrixBtn: 'Add to SWOT Matrix',
    noFactorsInQuadrant: 'No factors recorded in this quadrant yet.',
    howToLeverage: 'How to Leverage: ',
    mitigationPlan: 'Mitigation Plan: ',
    quadrants: {
      strength: {
        title: 'Strengths (Internal Positive)',
        subtitle:
          'Core capabilities, assets, and structural advantages already under control.',
        polarity: '+ Internal Asset',
      },
      weakness: {
        title: 'Weaknesses (Internal Negative)',
        subtitle:
          'Resource gaps, technical debt, or operational constraints to overcome.',
        polarity: '- Internal Constraint',
      },
      opportunity: {
        title: 'Opportunities (External Positive)',
        subtitle:
          'Market tailwinds, second-order upsides, and strategic expansion paths.',
        polarity: '+ External Tailwinds',
      },
      threat: {
        title: 'Threats (External Negative)',
        subtitle: 'Competitive responses, macro risks, or execution failure modes.',
        polarity: '- External Exposure',
      },
    },

    crossFrameworkHeading: 'Cross-Framework Tiebreaker Breakdown',
    crossFrameworkSub:
      'Comparing how each option performs across Pros & Cons, Decision Matrix, Scenarios, and SWOT Analysis.',
    leadMarginLabel: 'Lead Margin:',
    colRankOption: 'Rank & Option',
    colProsConsScore: 'Pros & Cons Score',
    colMatrixScore: 'Matrix Score',
    colScenarioExpected: 'Scenario Expected',
    colSwotReadiness: 'SWOT Readiness',
    colCompositeIndex: 'Composite Tiebreaker Index',
    rangeSuffix: 'range',
    methodologyMixerHeading: 'Methodology Weighting Mixer',
    methodologyMixerSub:
      'Test sensitivity by adjusting how much each analytical framework contributes to the Composite Tiebreaker Index.',
    mixerProsConsWeight: '1. Pros & Cons Ledger Weight',
    mixerMatrixWeight: '2. Weighted Decision Matrix Weight',
    mixerSwotWeight: '3. Strategic SWOT Readiness Weight',
    resetBalanceHint: 'Reset to equal 1:1:1 methodology balance',
    resetBalanceBtn: 'Reset Balance',
    blindSpotsHeading: 'Pre-Commitment Blind Spots & Verification Checklist',
    blindSpotsSub: (leaderName) =>
      `Critical second-order questions to validate before locking in ${leaderName}.`,
    stressTestBadge: 'Sensitivity & Counter-Thesis Review',
    stressTestWinnerHeading: (leaderName) =>
      `Stress-Test Current Winner (${leaderName})`,
    stressTestWinnerSub: (runnerUpName) =>
      `Challenge your current weighting, identify the threshold that would flip the outcome to ${runnerUpName}, and surface overlooked factors.`,
    runningStressTestBtn: 'Running Stress-Test...',
    runDevilsAdvocateBtn: 'Run Devil’s Advocate Analysis',
    counterThesisHeading: 'Devil’s Advocate Counter-Thesis',
    reversalTriggerHeading: 'Decision Reversal Trigger',
    suggestedCounterFactorsHeading:
      'Suggested Counter-Factors (Click to add directly to your weighted model)',
    addBtn: 'Add',
    addedBtn: 'Added',

    modalHeading: 'Create Weighted Decision Matrix & Scenario Model',
    modalSubtitle:
      'Enter your decision, list your own Pros & Cons with 1–5 importance weights, then build the full matrix and scenarios.',
    loadSampleTemplateLabel: 'Load a sample decision with pre-weighted Pros & Cons:',
    step1DecisionLabel: '1. What decision do you need to make? *',
    step1DecisionPlaceholder:
      'e.g., Should I accept a Head of Product offer at a Series A startup or stay in my current role?',
    step2OptionsLabel: '2. Potential Choices / Options to Compare',
    addOptionBtn: 'Add Option',
    step3ProsConsLabel:
      '3. List Your Key Pros & Cons and Assign Importance Weight (1–5)',
    step3ProsConsSub:
      'Your weighted factors will be included and the rest of the matrix completed',
    optionLabel: 'Option',
    typeLabel: 'Type',
    factorDescriptionLabel: 'Factor Description',
    factorDescriptionPlaceholder: 'e.g., Higher base salary',
    weightShortLabel: 'Weight (1–5)',
    step4ContextLabel: '4. Additional Context & Constraints (Optional)',
    step4ContextPlaceholder: 'e.g., Timeline, risk tolerance, financial runway...',
    modalFooterNote:
      'Calculates weighted scores, Best/Likely/Worst scenarios & SWOT',
    buildingDecisionModelBtn: 'Building Decision Model...',
    generateWeightedModelBtn: 'Generate Weighted Model & Scenarios',
  },

  ru: {
    navProsCons: 'За и Против',
    navMatrix: 'Матрица решений',
    navScenarios: 'Сценарии',
    navSwot: 'SWOT-анализ',
    navSensitivity: 'Чувствительность',
    themeDark: 'Тёмная',
    themeLight: 'Светлая',
    exportBrief: 'Экспорт отчёта',
    newDecision: 'Новое решение',
    welcomeHeading: 'Добро пожаловать в The Tiebreaker',
    welcomeIntro:
      'Сравнивайте варианты, взвешивайте компромиссы и находите решение, которое сохраняет силу даже при изменении условий.',
    welcomeFeatures: [
      'Оценивайте варианты с помощью взвешенных За и Против',
      'Сравнивайте выборы в матрице решений',
      'Изучайте сценарии Лучший / Вероятный / Худший',
      'Проверяйте SWOT-анализ и чувствительность перед принятием решения',
    ],
    welcomeStart: 'Начните с готового примера или создайте новый вариант через кнопку «Новое решение».',
    welcomeDismiss: 'Продолжить',
    terminologyHeading: 'Что означают эти термины',
    terminologyDescription:
      'Каждый аналитический блок помогает увидеть решение с другой стороны до окончательного выбора.',
    terminology: {
      prosCons: {
        label: 'За и Против',
        description: 'Показывает сильные аргументы за и против каждого варианта и задаёт их важность.',
      },
      decision: {
        label: 'Решение',
        description: 'Это сам выбор, который вы пытаетесь сделать с учётом ограничений и компромиссов.',
      },
      matrix: {
        label: 'Матрица решений',
        description: 'Сравнивает критерии по весам, чтобы оценить каждый вариант по важнейшим показателям.',
      },
      scenarios: {
        label: 'Сценарии',
        description: 'Моделирует лучшие, наиболее вероятные и худшие варианты развития событий.',
      },
      swot: {
        label: 'SWOT-анализ',
        description: 'Показывает внутренние сильные и слабые стороны, а также внешние возможности и угрозы.',
      },
      sensitivity: {
        label: 'Чувствительность',
        description: 'Проверяет, как изменения в весах меняют итоговую рекомендацию и отрыв лидера.',
      },
    },

    quickPromptLabel: 'Быстрый анализ решения и сценариев',
    quickPromptPlaceholder:
      'Введите любое решение (например: «Арендовать электромобиль или купить гибрид?»)...',
    generatingModel: 'Создание модели...',
    generateMatrixScenarios: 'Создать матрицу и сценарии',
    decisionDossiers: 'Досье решений',
    guidedBuilder: '+ Конструктор',
    leadPrefix: 'Лидер:',
    ptsSuffix: 'б.',
    scaleActiveNote: 'Шкала весов 1–5',
    resetSamples: 'Сбросить примеры',

    updatedPrefix: 'Обновлено:',
    optionsCompared: 'варианта сравниваются',
    weightedFactorsScale: 'взвешенных факторов (шкала 1–5)',

    briefConclusionHeading: 'Краткий вывод по решению',
    theDecisionShouldBe: 'Решение должно быть:',
    tieDecisionShouldBe: 'Почти ничья — минимальный перевес у:',
    conclusionSummaryTemplate: (
      winnerName,
      winnerScore,
      runnerUpName,
      runnerUpScore,
      margin,
      topFactor
    ) =>
      `На основе заданных весов вариант «${winnerName}» лидирует с итоговым баллом ${winnerScore}/100 против «${runnerUpName}» (${runnerUpScore}/100, преимущество +${margin} б.). Главный решающий фактор: «${topFactor}».`,
    conclusionTieTemplate: (optA, optB, scoreA, scoreB) =>
      `Варианты «${optA}» (${scoreA}/100) и «${optB}» (${scoreB}/100) идут практически вровень. Измените веса важности (1–5) ниже, чтобы выявить победителя.`,
    conclusionProsConsMetric: 'Баланс За и Против',
    conclusionMatrixMetric: 'Матрица решений',
    conclusionScenarioMetric: 'Оценка сценариев',
    conclusionSwotMetric: 'Готовность SWOT',

    currentRecommendation: 'Текущая рекомендация Tiebreaker',
    statisticalDeadHeat: (margin) => `Статистическое равенство (перевес +${margin} б.)`,
    clearLead: (margin) => `Уверенное лидерство (перевес +${margin} б.)`,
    weightedScoreLabel: 'Взвешенный балл',
    rankPrefix: 'Место',
    leadingChoice: 'Лидирующий выбор',
    trailsBy: (pts) => `Отстаёт на ${pts} б.`,
    tabProsConsShort: 'За/Против',
    tabMatrixShort: 'Матрица',
    tabScenariosShort: 'Сценарии',
    tabSwotShort: 'SWOT',
    tabProsConsFull: (count) => `01. Взвешенные За и Против (${count})`,
    tabMatrixFull: (count) => `02. Взвешенная матрица решений (${count})`,
    tabScenariosFull: '03. Сценарии (Лучший / Вероятный / Худший)',
    tabSwotFull: (count) => `04. Стратегический SWOT (${count})`,
    tabSensitivityFull: '05. Чувствительность и Критик',
    realtimeRecalcHint:
      'Меняйте веса (1–5) для мгновенного пересчёта баллов и сценариев',

    allOptions: (count) => `Все варианты (${count})`,
    filterProsConsPlaceholder: 'Поиск факторов...',
    hideFactorForm: 'Скрыть форму',
    addProConBtn: 'Добавить За / Против',
    listProConHeading: 'Добавьте аргумент «За» или «Против» и укажите вес (1–5)',
    scaleExplanation: '1 = Низкая важность · 3 = Средняя · 5 = Критический фактор',
    choiceOptionLabel: 'Вариант выбора',
    factorTypeLabel: 'Тип фактора',
    proPlusWeight: 'За (+ Плюс)',
    conMinusWeight: 'Против (- Минус)',
    categoryAspectLabel: 'Категория / Аспект',
    categoryAspectPlaceholder: 'напр., Финансы, Риски, Карьера',
    importanceWeightLabel: 'Вес важности (1–5)',
    proOrConStatementLabel: 'Формулировка фактора *',
    proOrConStatementPlaceholder: 'Опишите конкретный плюс или минус...',
    impactNoteLabel: 'Пояснение влияния (необязательно)',
    impactNotePlaceholder: 'Как это влияет на результат и сценарии?',
    addToScoreBtn: '+ Добавить в расчёт',
    prosCountConsCount: (pros, cons) => `${pros} За / ${cons} Против`,
    proPts: (pts) => `+${pts} б. За`,
    conPts: (pts) => `-${pts} б. Против`,
    netLabel: 'Итог:',
    weightedProsHeader: 'Взвешенные плюсы «За» (шкала 1–5)',
    weightedConsHeader: 'Взвешенные минусы «Против» (шкала 1–5)',
    totalPrefix: 'Сумма:',
    noProsEmpty: 'Нет подходящих аргументов «За». Добавьте фактор через форму выше.',
    noConsEmpty: 'Нет подходящих аргументов «Против». Добавьте фактор через форму выше.',
    proLabel: 'Плюс',
    conLabel: 'Минус',
    importanceScaleLabel: 'Важность (1–5):',
    weightLevels: {
      1: '1 · Низкая',
      2: '2 · Малая',
      3: '3 · Средняя',
      4: '4 · Высокая',
      5: '5 · Критич.',
    },

    matrixHeading: 'Взвешенная матрица решений (шкала 1–5)',
    matrixSubtitle:
      'Назначьте вес важности (1–5) каждому критерию и оцените каждый вариант (1–5). Взвешенный балл = Σ (Вес × Оценка).',
    addMatrixFactorBtn: 'Добавить критерий',
    addMatrixFactorModalHeading: 'Новый критерий матрицы решений',
    addMatrixFactorModalSub: 'Укажите вес важности (1–5) и оценку каждого варианта (1–5)',
    factorCriterionNameLabel: 'Название критерия / фактора',
    factorCriterionPlaceholder: 'напр., Стоимость владения, Гибкость, Сроки',
    descriptionLabel: 'Описание',
    descriptionPlaceholder: 'Что означает оценка 5 из 5?',
    ratingLabel: 'Оценка:',
    rationalePlaceholder: (optName) => `Обоснование для «${optName}»...`,
    cancelBtn: 'Отмена',
    saveFactorRowBtn: 'Сохранить критерий',
    colDecisionFactor: 'Критерий решения',
    colImportanceWeight: 'Вес важности (1–5)',
    shareSuffix: 'доля',
    priorityLevels: {
      1: '1 · Низкий приоритет',
      2: '2 · Малый приоритет',
      3: '3 · Средний приоритет',
      4: '4 · Высокий приоритет',
      5: '5 · Критический приоритет',
    },
    weightedMatrixTotalScore: 'Итоговый взвешенный балл матрицы',
    maxPossiblePrefix: 'Максимум:',
    normalizedScoreLabel: 'Нормализованный балл:',

    scenariosHeading: 'Анализ сценариев (Лучший, Наиболее вероятный и Худший)',
    scenariosSubtitle:
      'Показывает, как взвешенные плюсы и минусы (1–5) проявляются в трёх вероятностных сценариях для каждого варианта.',
    allChoices: (count) => `Все варианты (${count})`,
    updatingScenariosBtn: 'Обновление сценариев...',
    recalcScenariosBtn: 'Пересчитать сценарии по весам',
    scenarioExpectedScoreLabel: 'Ожидаемый балл сценариев',
    outcomeSpreadLabel: 'Разброс (Худший → Лучший)',
    bestCaseTitle: 'Лучший сценарий (Best-Case)',
    mostLikelyTitle: 'Наиболее вероятный сценарий',
    worstCaseTitle: 'Худший сценарий (Worst-Case)',
    probLabel: 'Вероятн.',
    impactOfWeightedProsCons: 'Влияние взвешенных За и Против',
    primaryCatalyst: 'Главный драйвер:',
    unlockingCondition: 'Условие успеха:',
    netLedgerBalance: 'Чистый баланс:',
    operationalFocus: 'Фокус внимания:',
    primaryRiskDriver: 'Главный фактор риска:',
    contingencySafeguard: 'План защиты:',

    combinedView: (count) => `Общий вид (${count})`,
    swotReadinessLabel: 'Индекс SWOT:',
    addSwotFactorBtn: 'Добавить SWOT-фактор',
    addSwotModalHeading: 'Добавить взвешенный фактор SWOT (шкала 1–5)',
    addSwotModalSub:
      'Сильные стороны и Возможности прибавляют вес; Слабости и Угрозы вычитают вес',
    targetOptionLabel: 'Целевой вариант',
    swotQuadrantLabel: 'Квадрант SWOT',
    factorHeadlineLabel: 'Заголовок фактора',
    factorHeadlinePlaceholder: 'Краткое описание сильной стороны, риска или возможности...',
    strategicDetailLabel: 'Стратегические детали',
    strategicDetailPlaceholder: 'Контекст и влияние на решение...',
    tacticalLeverageLabel: 'План действий / Снижение риска',
    tacticalLeveragePlaceholder: 'Как использовать преимущество или защититься от риска?',
    addToSwotMatrixBtn: 'Добавить в SWOT',
    noFactorsInQuadrant: 'В этом квадранте пока нет факторов.',
    howToLeverage: 'Как использовать: ',
    mitigationPlan: 'План снижения риска: ',
    quadrants: {
      strength: {
        title: 'Сильные стороны (Strengths)',
        subtitle: 'Внутренние преимущества, ресурсы и ключевые компетенции.',
        polarity: '+ Внутренний актив',
      },
      weakness: {
        title: 'Слабые стороны (Weaknesses)',
        subtitle: 'Внутренние ограничения, нехватка ресурсов или технический долг.',
        polarity: '- Внутреннее ограничение',
      },
      opportunity: {
        title: 'Возможности (Opportunities)',
        subtitle: 'Внешние точки роста, рыночные тренды и стратегические перспективы.',
        polarity: '+ Внешний потенциал',
      },
      threat: {
        title: 'Угрозы (Threats)',
        subtitle: 'Внешние риски, действия конкурентов или макроэкономические факторы.',
        polarity: '- Внешний риск',
      },
    },

    crossFrameworkHeading: 'Сводное сравнение по всем методологиям',
    crossFrameworkSub:
      'Сравнение показателей каждого варианта по балансу За/Против, Матрице решений, Сценариям и SWOT-анализу.',
    leadMarginLabel: 'Отрыв лидера:',
    colRankOption: 'Место и Вариант',
    colProsConsScore: 'Балл За и Против',
    colMatrixScore: 'Балл Матрицы',
    colScenarioExpected: 'Ожидание Сценариев',
    colSwotReadiness: 'Индекс SWOT',
    colCompositeIndex: 'Итоговый индекс Tiebreaker',
    rangeSuffix: 'диапазон',
    methodologyMixerHeading: 'Настройка веса методологий',
    methodologyMixerSub:
      'Проверьте чувствительность решения, меняя вклад каждой методологии в итоговый индекс.',
    mixerProsConsWeight: '1. Вес баланса «За и Против»',
    mixerMatrixWeight: '2. Вес матрицы критериев',
    mixerSwotWeight: '3. Вес SWOT-анализа',
    resetBalanceHint: 'Вернуть равное соотношение методологий 1:1:1',
    resetBalanceBtn: 'Сбросить пропорции',
    blindSpotsHeading: 'Слепые зоны и контрольный список перед решением',
    blindSpotsSub: (leaderName) =>
      `Ключевые вопросы для проверки перед окончательным выбором «${leaderName}».`,
    stressTestBadge: 'Проверка устойчивости и контртезис',
    stressTestWinnerHeading: (leaderName) =>
      `Стресс-тест текущего лидера (${leaderName})`,
    stressTestWinnerSub: (runnerUpName) =>
      `Проверьте текущие веса, найдите порог, при котором преимущество перейдёт к «${runnerUpName}», и выявите упущенные факторы.`,
    runningStressTestBtn: 'Выполняется стресс-тест...',
    runDevilsAdvocateBtn: 'Запустить анализ «Адвокат дьявола»',
    counterThesisHeading: 'Контртезис «Адвоката дьявола»',
    reversalTriggerHeading: 'Триггер пересмотра решения',
    suggestedCounterFactorsHeading:
      'Предложенные контрфакторы (нажмите, чтобы добавить в модель)',
    addBtn: 'Добавить',
    addedBtn: 'Добавлено',

    modalHeading: 'Создание взвешенной матрицы решений и сценариев',
    modalSubtitle:
      'Опишите решение, перечислите аргументы «За» и «Против» с весом 1–5, затем постройте матрицу и сценарии.',
    loadSampleTemplateLabel: 'Загрузить готовый шаблон решения с весами:',
    step1DecisionLabel: '1. Какое решение вам нужно принять? *',
    step1DecisionPlaceholder:
      'напр., Принять ли оффер руководителя продукта в стартапе или остаться на текущей должности?',
    step2OptionsLabel: '2. Варианты выбора для сравнения',
    addOptionBtn: 'Добавить вариант',
    step3ProsConsLabel: '3. Укажите ваши плюсы «За» и минусы «Против» и назначьте вес (1–5)',
    step3ProsConsSub: 'Ваши взвешенные факторы будут учтены в матрице',
    optionLabel: 'Вариант',
    typeLabel: 'Тип',
    factorDescriptionLabel: 'Описание фактора',
    factorDescriptionPlaceholder: 'напр., Выше базовый оклад',
    weightShortLabel: 'Вес (1–5)',
    step4ContextLabel: '4. Дополнительный контекст и ограничения (необязательно)',
    step4ContextPlaceholder: 'напр., Сроки, отношение к риску, финансовый запас...',
    modalFooterNote: 'Рассчитывает взвешенные баллы, 3 сценария и SWOT-анализ',
    buildingDecisionModelBtn: 'Построение модели...',
    generateWeightedModelBtn: 'Создать взвешенную модель и сценарии',
  },

  fi: {
    navProsCons: 'Plussat & Miinukset',
    navMatrix: 'Päätösmatriisi',
    navScenarios: 'Skenaariot',
    navSwot: 'SWOT-analyysi',
    navSensitivity: 'Herkkyysanalyysi',
    themeDark: 'Tumma',
    themeLight: 'Vaalea',
    exportBrief: 'Vie muistio',
    newDecision: 'Uusi päätös',
    welcomeHeading: 'Tervetuloa The Tiebreaker -työkaluun',
    welcomeIntro:
      'Vertaile vaihtoehtoja, punnitse kompromisseja ja löydä päätös, joka kestää muutokset ja epävarmuuden.',
    welcomeFeatures: [
      'Arvioi vaihtoehtoja painotetuilla Plussa & Miinuksilla',
      'Vertaa vaihtoehtoja päätösmatriisissa',
      'Tutki Paras / Todennäköisin / Huonoin -skenaarioita',
      'Tarkista SWOT-analyysi ja herkkyysanalyysi ennen päätöstä',
    ],
    welcomeStart: 'Aloita valitsemalla esimerkkipäätös tai luomalla uuden päätöksen “Uusi päätös” -painikkeesta.',
    welcomeDismiss: 'Jatka',
    terminologyHeading: 'Mitä nämä termit tarkoittavat',
    terminologyDescription:
      'Jokainen analyysitapa auttaa sinua näkemään päätöksen eri kulmasta ennen sitoutumista.',
    terminology: {
      prosCons: {
        label: 'Plussat & Miinukset',
        description: 'Listaa vahvimmat argumentit jokaisen vaihtoehdon puolesta ja vastaan sekä antaa niille tärkeyspainot.',
      },
      decision: {
        label: 'Päätös',
        description: 'Tämä on itse valinta, jonka teet huomioiden rajoitteet ja kompromissit.',
      },
      matrix: {
        label: 'Päätösmatriisi',
        description: 'Vertaa kriteerejä painotettuna, jotta jokainen vaihtoehto voidaan pisteyttää tärkeimpien tekijöiden mukaan.',
      },
      scenarios: {
        label: 'Skenaariot',
        description: 'Malli Paras-, Todennäköisin- ja Huonoin-tapahtumaketjulle, jotta näet tulevaisuuden epävarmuuden.',
      },
      swot: {
        label: 'SWOT-analyysi',
        description: 'Korostaa sisäiset vahvuudet, heikkoudet sekä ulkoiset mahdollisuudet ja uhat.',
      },
      sensitivity: {
        label: 'Herkkyysanalyysi',
        description: 'Testaa, miten painojen muutokset vaikuttavat lopulliseen suositukseen ja johtomarginaaliin.',
      },
    },

    quickPromptLabel: 'Nopea päätös- ja skenaariokysely',
    quickPromptPlaceholder:
      'Kirjoita päätös (esim. "Pitäisikö liisata sähköauto vai ostaa käytetty hybridi?")...',
    generatingModel: 'Luodaan mallia...',
    generateMatrixScenarios: 'Luo matriisi & skenaariot',
    decisionDossiers: 'Päätösasiakirjat',
    guidedBuilder: '+ Ohjattu luonti',
    leadPrefix: 'Johtaa:',
    ptsSuffix: 'p.',
    scaleActiveNote: 'Asteikko 1–5 käytössä',
    resetSamples: 'Palauta esimerkit',

    updatedPrefix: 'Päivitetty',
    optionsCompared: 'vaihtoehtoa vertailussa',
    weightedFactorsScale: 'painotettua tekijää (asteikko 1–5)',

    briefConclusionHeading: 'Lyhyt johtopäätös päätöksestä',
    theDecisionShouldBe: 'Päätöksen tulisi olla:',
    tieDecisionShouldBe: 'Tasapeli — niukka etu vaihtoehdolla:',
    conclusionSummaryTemplate: (
      winnerName,
      winnerScore,
      runnerUpName,
      runnerUpScore,
      margin,
      topFactor
    ) =>
      `Painotettujen tekijöiden perusteella ${winnerName} johtaa kokonaispistein ${winnerScore}/100 verrattuna vaihtoehtoon ${runnerUpName} (${runnerUpScore}/100, ero +${margin} pistettä). Ratkaisevin tekijä on "${topFactor}".`,
    conclusionTieTemplate: (optA, optB, scoreA, scoreB) =>
      `${optA} (${scoreA}/100) ja ${optB} (${scoreB}/100) ovat tilastollisesti tasoissa. Säädä alla olevia tärkeyspainoja (1–5) ratkaistaksesi voittajan.`,
    conclusionProsConsMetric: 'Plussat & Miinukset',
    conclusionMatrixMetric: 'Päätösmatriisi',
    conclusionScenarioMetric: 'Skenaarioiden odotusarvo',
    conclusionSwotMetric: 'SWOT-valmius',

    currentRecommendation: 'Nykyinen Tiebreaker-suositus',
    statisticalDeadHeat: (margin) => `Tilastollinen tasapeli (+${margin} p. ero)`,
    clearLead: (margin) => `Selvä johtoasema (+${margin} p. ero)`,
    weightedScoreLabel: 'Painotettu pistemäärä',
    rankPrefix: 'Sija',
    leadingChoice: 'Johtava vaihtoehto',
    trailsBy: (pts) => `Jäljessä ${pts} p.`,
    tabProsConsShort: 'Plussat/Miin.',
    tabMatrixShort: 'Matriisi',
    tabScenariosShort: 'Skenaariot',
    tabSwotShort: 'SWOT',
    tabProsConsFull: (count) => `01. Painotetut Plussat & Miinukset (${count})`,
    tabMatrixFull: (count) => `02. Painotettu päätösmatriisi (${count})`,
    tabScenariosFull: '03. Skenaariot (Paras / Todennäköisin / Huonoin)',
    tabSwotFull: (count) => `04. Strateginen SWOT (${count})`,
    tabSensitivityFull: '05. Herkkyys & Haastaja',
    realtimeRecalcHint:
      'Aseta painot (1–5) laskeaksesi pisteet ja skenaariot reaaliajassa',

    allOptions: (count) => `Kaikki vaihtoehdot (${count})`,
    filterProsConsPlaceholder: 'Suodata tekijöitä...',
    hideFactorForm: 'Piilota lomake',
    addProConBtn: 'Lisää Plussa / Miinus',
    listProConHeading: 'Listaa Plussa tai Miinus ja anna tärkeyspaino (1–5)',
    scaleExplanation: '1 = Pieni merkitys · 3 = Kohtalainen · 5 = Ratkaiseva tekijä',
    choiceOptionLabel: 'Vaihtoehto',
    factorTypeLabel: 'Tekijän tyyppi',
    proPlusWeight: 'Plussa (+ Hyöty)',
    conMinusWeight: 'Miinus (- Haitta)',
    categoryAspectLabel: 'Kategoria / Osa-alue',
    categoryAspectPlaceholder: 'esim. Talous, Elämäntapa, Riski',
    importanceWeightLabel: 'Tärkeyspaino (1–5)',
    proOrConStatementLabel: 'Plussa- tai miinustekijän kuvaus *',
    proOrConStatementPlaceholder: 'Kirjoita konkreettinen hyöty tai haitta...',
    impactNoteLabel: 'Vaikutuksen lisätieto (valinnainen)',
    impactNotePlaceholder: 'Miten tämä vaikuttaa lopputulokseen tai skenaarioihin?',
    addToScoreBtn: '+ Lisää laskelmaan',
    prosCountConsCount: (pros, cons) => `${pros} Plussaa / ${cons} Miinusta`,
    proPts: (pts) => `+${pts} p. Plussat`,
    conPts: (pts) => `-${pts} p. Miinukset`,
    netLabel: 'Netto:',
    weightedProsHeader: 'Painotetut Plussat (tärkeysasteikko 1–5)',
    weightedConsHeader: 'Painotetut Miinukset (tärkeysasteikko 1–5)',
    totalPrefix: 'Yhteensä:',
    noProsEmpty: 'Ei plussatekijöitä tälle vaihtoehdolle. Lisää tekijä yllä olevalla lomakkeella.',
    noConsEmpty: 'Ei miinustekijöitä tälle vaihtoehdolle. Lisää tekijä yllä olevalla lomakkeella.',
    proLabel: 'Plussa',
    conLabel: 'Miinus',
    importanceScaleLabel: 'Tärkeys (1–5):',
    weightLevels: {
      1: '1 · Pieni',
      2: '2 · Vähäinen',
      3: '3 · Kohtal.',
      4: '4 · Suuri',
      5: '5 · Kriittinen',
    },

    matrixHeading: 'Painotettu päätösmatriisi (asteikko 1–5)',
    matrixSubtitle:
      'Anna jokaiselle kriteerille tärkeyspaino (1–5) ja arvioi vaihtoehdot (1–5). Painotettu pistemäärä = Σ (Paino × Arvosana).',
    addMatrixFactorBtn: 'Lisää matriisikriteeri',
    addMatrixFactorModalHeading: 'Lisää painotettu päätöskriteeri',
    addMatrixFactorModalSub: 'Valitse tärkeyspaino (1–5) ja pisteytä vaihtoehdot (1–5)',
    factorCriterionNameLabel: 'Kriteerin / tekijän nimi',
    factorCriterionPlaceholder: 'esim. Kokonaiskustannus, Joustavuus, Aikataulu',
    descriptionLabel: 'Kuvaus',
    descriptionPlaceholder: 'Mitä arvosana 5/5 tarkoittaa?',
    ratingLabel: 'Arvosana:',
    rationalePlaceholder: (optName) => `Perustelu vaihtoehdolle ${optName}...`,
    cancelBtn: 'Peruuta',
    saveFactorRowBtn: 'Tallenna kriteeririvi',
    colDecisionFactor: 'Päätöskriteeri',
    colImportanceWeight: 'Tärkeyspaino (1–5)',
    shareSuffix: 'osuus',
    priorityLevels: {
      1: '1 · Matala prioriteetti',
      2: '2 · Pieni prioriteetti',
      3: '3 · Kohtalainen prioriteetti',
      4: '4 · Korkea prioriteetti',
      5: '5 · Kriittinen prioriteetti',
    },
    weightedMatrixTotalScore: 'Matriisin painotettu kokonaispistemäärä',
    maxPossiblePrefix: 'Maksimi:',
    normalizedScoreLabel: 'Normalisoitu pistemäärä:',

    scenariosHeading: 'Skenaarioiden tarkastelu (Paras, Todennäköisin & Huonoin)',
    scenariosSubtitle:
      'Arvioi, miten painotetut plussat ja miinukset (1–5) vaikuttavat kolmessa eri tulevaisuuden skenaariossa jokaiselle vaihtoehdolle.',
    allChoices: (count) => `Kaikki vaihtoehdot (${count})`,
    updatingScenariosBtn: 'Päivitetään skenaarioita...',
    recalcScenariosBtn: 'Päivitä skenaariot painojen mukaan',
    scenarioExpectedScoreLabel: 'Skenaarioiden odotusarvo',
    outcomeSpreadLabel: 'Vaihteluväli (Huonoin → Paras)',
    bestCaseTitle: 'Paras skenaario (Best-Case)',
    mostLikelyTitle: 'Todennäköisin skenaario',
    worstCaseTitle: 'Huonoin skenaario (Worst-Case)',
    probLabel: 'Tod.näk.',
    impactOfWeightedProsCons: 'Painotettujen plussien ja miinusten vaikutus',
    primaryCatalyst: 'Keskeinen ajuri:',
    unlockingCondition: 'Onnistumisen edellytys:',
    netLedgerBalance: 'Nettotasapaino:',
    operationalFocus: 'Operatiivinen painopiste:',
    primaryRiskDriver: 'Suurin riskitekijä:',
    contingencySafeguard: 'Varautumissuunnitelma:',

    combinedView: (count) => `Yhdistetty näkymä (${count})`,
    swotReadinessLabel: 'SWOT-valmius:',
    addSwotFactorBtn: 'Lisää SWOT-tekijä',
    addSwotModalHeading: 'Lisää painotettu SWOT-tekijä (asteikko 1–5)',
    addSwotModalSub:
      'Vahvuudet ja Mahdollisuudet lisäävät pisteitä; Heikkoudet ja Uhat vähentävät pisteitä',
    targetOptionLabel: 'Kohdevaihtoehto',
    swotQuadrantLabel: 'SWOT-neljännes',
    factorHeadlineLabel: 'Tekijän otsikko',
    factorHeadlinePlaceholder: 'Tiivis kuvaus vahvuudesta, riskistä tai mahdollisuudesta...',
    strategicDetailLabel: 'Strateginen lisätieto',
    strategicDetailPlaceholder: 'Tausta ja operatiivinen vaikutus...',
    tacticalLeverageLabel: 'Hyödyntäminen / Riskienhallinta',
    tacticalLeveragePlaceholder: 'Miten hyödynnät tätä tai suojaudut riskiltä?',
    addToSwotMatrixBtn: 'Lisää SWOT-matriisiin',
    noFactorsInQuadrant: 'Tässä neljänneksessä ei ole vielä tekijöitä.',
    howToLeverage: 'Hyödyntäminen: ',
    mitigationPlan: 'Riskienhallinta: ',
    quadrants: {
      strength: {
        title: 'Vahvuudet (Strengths)',
        subtitle: 'Sisäiset kyvykkyydet, resurssit ja rakenteelliset edut.',
        polarity: '+ Sisäinen vahvuus',
      },
      weakness: {
        title: 'Heikkoudet (Weaknesses)',
        subtitle: 'Resurssivajeet, tekninen velka tai sisäiset rajoitteet.',
        polarity: '- Sisäinen rajoite',
      },
      opportunity: {
        title: 'Mahdollisuudet (Opportunities)',
        subtitle: 'Ulkoiset markkinatrendit, kasvupolut ja uudet hyödyt.',
        polarity: '+ Ulkoinen mahdollisuus',
      },
      threat: {
        title: 'Uhat (Threats)',
        subtitle: 'Kilpailijoiden toimet, makroriskit tai toteutuksen sudenkuopat.',
        polarity: '- Ulkoinen uhka',
      },
    },

    crossFrameworkHeading: 'Menetelmien välinen yhteenveto',
    crossFrameworkSub:
      'Vertaa vaihtoehtojen suoriutumista Plussat & Miinukset -laskelmassa, Päätösmatriisissa, Skenaarioissa ja SWOT-analyysissa.',
    leadMarginLabel: 'Johtomarginaali:',
    colRankOption: 'Sija & Vaihtoehto',
    colProsConsScore: 'Plussat & Miinukset',
    colMatrixScore: 'Matriisipisteet',
    colScenarioExpected: 'Skenaario-odotus',
    colSwotReadiness: 'SWOT-valmius',
    colCompositeIndex: 'Yhdistetty Tiebreaker-indeksi',
    rangeSuffix: 'väli',
    methodologyMixerHeading: 'Menetelmien painotussäädin',
    methodologyMixerSub:
      'Testaa päätöksen herkkyyttä säätämällä, kuinka paljon kukin analyysimenetelmä vaikuttaa kokonaispistemäärään.',
    mixerProsConsWeight: '1. Plussat & Miinukset -paino',
    mixerMatrixWeight: '2. Päätösmatriisin paino',
    mixerSwotWeight: '3. SWOT-analyysin paino',
    resetBalanceHint: 'Palauta tasainen 1:1:1 menetelmäpainotus',
    resetBalanceBtn: 'Palauta tasapaino',
    blindSpotsHeading: 'Sokeat pisteet & tarkistuslista ennen päätöstä',
    blindSpotsSub: (leaderName) =>
      `Kriittiset kysymykset, jotka kannattaa varmistaa ennen kuin lukitset valinnan ${leaderName}.`,
    stressTestBadge: 'Herkkyystarkistus ja vasta-argumentit',
    stressTestWinnerHeading: (leaderName) =>
      `Haasta nykyinen voittaja (${leaderName})`,
    stressTestWinnerSub: (runnerUpName) =>
      `Testaa nykyiset painotuksesi, etsi raja-arvo, joka siirtäisi johdon vaihtoehdolle ${runnerUpName}, ja tuo esiin unohtuneita tekijöitä.`,
    runningStressTestBtn: 'Suoritetaan stressitestiä...',
    runDevilsAdvocateBtn: 'Suorita Paholaisen asianajaja -analyysi',
    counterThesisHeading: 'Vastaväite (Counter-Thesis)',
    reversalTriggerHeading: 'Päätöksen kääntävä raja-arvo',
    suggestedCounterFactorsHeading:
      'Ehdotetut vastatekijät (klikkaa lisätäksesi suoraan malliisi)',
    addBtn: 'Lisää',
    addedBtn: 'Lisätty',

    modalHeading: 'Luo painotettu päätösmatriisi & skenaariomalli',
    modalSubtitle:
      'Syötä päätöksesi ja listaa plussat sekä miinukset painoilla (1–5), minkä jälkeen voit muodostaa matriisin ja skenaariot.',
    loadSampleTemplateLabel: 'Lataa valmis esimerkkipäätös painotuksineen:',
    step1DecisionLabel: '1. Mikä päätös sinun täytyy tehdä? *',
    step1DecisionPlaceholder:
      'esim. Pitäisikö minun ottaa vastaan tuotejohtajan paikka kasvuyrityksessä vai jäädä nykyiseen rooliini?',
    step2OptionsLabel: '2. Vertailtavat vaihtoehdot',
    addOptionBtn: 'Lisää vaihtoehto',
    step3ProsConsLabel:
      '3. Listaa keskeiset Plussat & Miinukset ja anna tärkeyspaino (1–5)',
    step3ProsConsSub:
      'Painotetut tekijäsi sisällytetään matriisiin',
    optionLabel: 'Vaihtoehto',
    typeLabel: 'Tyyppi',
    factorDescriptionLabel: 'Tekijän kuvaus',
    factorDescriptionPlaceholder: 'esim. Korkeampi peruspalkka',
    weightShortLabel: 'Paino (1–5)',
    step4ContextLabel: '4. Lisäkonteksti ja rajoitteet (valinnainen)',
    step4ContextPlaceholder: 'esim. Aikataulu, riskinsietokyky, budjetti...',
    modalFooterNote:
      'Laskee painotetut pisteet, Paras/Todennäköisin/Huonoin -skenaariot & SWOTin',
    buildingDecisionModelBtn: 'Rakennetaan päätösmallia...',
    generateWeightedModelBtn: 'Luo painotettu malli & skenaariot',
  },
};

export function getLocalizedSampleDecisions(lang: Language): DecisionModel[] {
  if (lang === 'en') return SAMPLE_DECISIONS;

  if (lang === 'ru') {
    return [
      {
        id: 'dec-product-arch',
        title: 'Разработка собственного движка vs. Покупка специализированной студии',
        category: 'Корпоративная и продуктовая стратегия',
        createdAt: 'Окт 2026',
        summary:
          'Выбор между выделением $4.2M и 14 месяцев работы ключевых инженеров на создание собственной платформы оркестрации с нуля или покупкой специализированной студии из 12 человек с готовым продуктом.',
        options: [
          {
            id: 'opt-1',
            name: 'Разработка внутри компании (In-House)',
            tagline: 'Полный архитектурный контроль, но долгий выход на рынок',
            description:
              'Нанять 8 системных инженеров и создать нативный движок оркестрации, тесно интегрированный с нашей платформой данных.',
          },
          {
            id: 'opt-2',
            name: 'Покупка профильной студии (M&A)',
            tagline: 'Выход на рынок за 90 дней, риски интеграции и удержания',
            description:
              'Приобрести FluxGraph Labs ($3.8M деньгами + пул акций на удержание) и интегрировать их решение за 90 дней.',
          },
        ],
        prosCons: [
          {
            id: 'pc-1',
            optionId: 'opt-1',
            type: 'pro',
            title: 'Отсутствие чужого техдолга и единая схема данных',
            impactNote:
              'Единый стек Rust/TypeScript идеально совпадает с нашей моделью безопасности и мультиарендности.',
            weight: 5,
            domain: 'Архитектура',
          },
          {
            id: 'pc-2',
            optionId: 'opt-1',
            type: 'pro',
            title: 'Сохранение акционерного капитала и экономия на юристах M&A',
            impactNote: 'Экономит ~4.5% размытия долей и $280K на аудите сделки.',
            weight: 3,
            domain: 'Финансы',
          },
          {
            id: 'pc-3',
            optionId: 'opt-1',
            type: 'con',
            title: 'Ожидание 14 месяцев ставит под удар продление контрактов во 2 квартале',
            impactNote:
              '19 крупных корпоративных клиентов требуют функции автоматизации уже при продлении в Q2.',
            weight: 5,
            domain: 'Сроки рынка',
          },
          {
            id: 'pc-4',
            optionId: 'opt-1',
            type: 'con',
            title: 'Отвлечение ведущих инженеров от основной выручки',
            impactNote:
              'Перевод 3 главных инженеров задержит наш флагманский аналитический релиз минимум на 8 недель.',
            weight: 4,
            domain: 'Риск исполнения',
          },
          {
            id: 'pc-5',
            optionId: 'opt-2',
            type: 'pro',
            title: 'Запуск готового продукта для клиентов уже через 90 дней',
            impactNote:
              'Открывает $2.9M дополнительной годовой выручки (ARR) до конца финансового года.',
            weight: 5,
            domain: 'Сроки рынка',
          },
          {
            id: 'pc-6',
            optionId: 'opt-2',
            type: 'pro',
            title: 'Приобретение сработанной команды из 9 старших инженеров',
            impactNote: 'Позволяет избежать 7 месяцев сложного найма дефицитных специалистов.',
            weight: 4,
            domain: 'Таланты',
          },
          {
            id: 'pc-7',
            optionId: 'opt-2',
            type: 'con',
            title: 'Миграция авторизации и биллинга потребует 4 месяца рефакторинга',
            impactNote:
              'Их однорегиональная архитектура Go/PostgreSQL требует адаптации под наш стандарт SOC2.',
            weight: 3,
            domain: 'Архитектура',
          },
          {
            id: 'pc-8',
            optionId: 'opt-2',
            type: 'con',
            title: 'Риск ухода основателей после завершения 18-месячного периода удержания',
            impactNote: 'Ключевая экспертиза сосредоточена у двух сооснователей студии.',
            weight: 4,
            domain: 'Удержание',
          },
        ],
        criteria: [
          {
            id: 'crit-1',
            name: 'Скорость выхода на рынок и защита контрактов Q2',
            description: 'Способность предоставить готовый продукт к циклу продления сделок.',
            weight: 5,
            scores: [
              {
                optionId: 'opt-1',
                score: 2,
                rationale: 'Бета через 9 мес., полный релиз через 14 мес. — пропускаем цикл Q2.',
              },
              {
                optionId: 'opt-2',
                score: 5,
                rationale: 'Интеграция готова за 90 дней; закрывает все запросы клиентов в Q2.',
              },
            ],
          },
          {
            id: 'crit-2',
            name: 'Долгосрочная архитектурная целостность',
            description: 'Удобство поддержки, единое управление данными и отсутствие прослоек.',
            weight: 4,
            scores: [
              {
                optionId: 'opt-1',
                score: 5,
                rationale: 'Проектируется с первого дня на нашей шине событий и графе прав.',
              },
              {
                optionId: 'opt-2',
                score: 3,
                rationale: 'Потребуется слой адаптеров на 12 месяцев до полной унификации.',
              },
            ],
          },
          {
            id: 'crit-3',
            name: 'Эффективность капитала на горизонте 24 месяцев',
            description: 'Соотношение полных затрат и прироста валовой прибыли за 2 года.',
            weight: 4,
            scores: [
              {
                optionId: 'opt-1',
                score: 3,
                rationale: 'Меньше разовый платёж, но упускаем 11 месяцев выручки от апсейла.',
              },
              {
                optionId: 'opt-2',
                score: 4,
                rationale:
                  'Выше авансовые затраты ($3.8M), но окупается за счёт +$2.9M ARR в первый же год.',
              },
            ],
          },
          {
            id: 'crit-4',
            name: 'Сохранение фокуса основной команды',
            description: 'Минимизация отвлечения текущих продуктовых команд от планов Q1.',
            weight: 4,
            scores: [
              {
                optionId: 'opt-1',
                score: 2,
                rationale: 'Требует забрать 3 ведущих архитекторов из текущих проектов.',
              },
              {
                optionId: 'opt-2',
                score: 4,
                rationale:
                  'Команда из 12 человек продолжает работу; от нас нужно лишь 2 инженера для API-моста.',
              },
            ],
          },
        ],
        swot: [
          {
            id: 'sw-1',
            optionId: 'opt-1',
            quadrant: 'strength',
            title: 'Единый контур безопасности и соответствия стандартам ISO/HIPAA',
            detail: 'Не требуется аудит сторонних субпроцессоров.',
            weight: 4,
            mitigationOrLeverage:
              'Использовать нативную безопасность как аргумент для банковского сектора.',
          },
          {
            id: 'sw-4',
            optionId: 'opt-1',
            quadrant: 'threat',
            title: 'Переход топ-20 клиентов к конкурентам за время разработки',
            detail: 'После внедрения конкурирующего движка стоимость переключения превышает 1.5 года.',
            weight: 5,
            mitigationOrLeverage:
              'Выпустить временный webhook-мост и закрепить дорожную карту в договорах.',
          },
          {
            id: 'sw-5',
            optionId: 'opt-2',
            quadrant: 'strength',
            title: 'Проверенный в бою движок (40 млн транзакций в сутки)',
            detail: 'FluxGraph уже работает в продакшене у 3 компаний из списка Fortune 500.',
            weight: 5,
            mitigationOrLeverage:
              'Сразу использовать кейсы Fortune 500 в продажах во 2 квартале.',
          },
          {
            id: 'sw-8',
            optionId: 'opt-2',
            quadrant: 'threat',
            title: 'Риск ухода ключевых разработчиков при жёстких KPI выплат (earn-out)',
            detail: 'Трение при интеграции может демотивировать команду студии.',
            weight: 4,
            mitigationOrLeverage:
              'Привязать бонусы удержания к технической интеграции и числу активных внедрений.',
          },
        ],
        scenarios: [
          {
            optionId: 'opt-1',
            bestCase: {
              headline: 'Быстрый найм и запуск высокомаржинальной платформы за 11 месяцев',
              narrative:
                'Нанимаем 6 системных инженеров за 60 дней, показываем альфа-версию ключевым клиентам Q2 (удерживая 90% базы) и выпускаем нативный продукт без техдолга.',
              weightedImpactAnalysis:
                'Полностью реализует ваш главный Плюс (вес 5 — отсутствие техдолга) и нейтрализует Минус потери времени (вес 5).',
              keyDriverOrContingency:
                'Нанять главного архитектора рантайма в первые 30 дней.',
              probabilityPercent: 20,
            },
            mostLikelyCase: {
              headline: 'Качественная платформа через 15 месяцев при умеренном оттоке в Q2',
              narrative:
                'Найм занимает 4.5 месяца, релиз сдвигается на 15-й месяц. Архитектура отличная, но мы теряем 5–7 нетерпеливых клиентов ($1.2M ARR).',
              weightedImpactAnalysis:
                'Архитектурный плюс (вес 5) достигается, но минус упущенного времени (вес 5) снижает выручку первого года.',
              keyDriverOrContingency:
                'Создать временный коннектор к партнёрским системам на время разработки.',
              probabilityPercent: 55,
            },
            worstCase: {
              headline: 'Задержка до 18+ месяцев, выгорание лидеров и потеря рынка',
              narrative:
                'Сложности распределённого состояния затягивают релиз до 18 месяцев. Отвлечение штатных инженеров срывает план Q1, а конкуренты занимают нишу.',
              weightedImpactAnalysis:
                'Минусы сроков (вес 5) и риска исполнения (вес 4) складываются, обесценивая экономию акций.',
              keyDriverOrContingency:
                'Установить жёсткий контрольный рубеж на 6-м месяце для перехода к лицензированию OEM.',
              probabilityPercent: 25,
            },
          },
          {
            optionId: 'opt-2',
            bestCase: {
              headline: 'Коммерческий запуск за 90 дней приносит +$3.4M ARR и сохраняет команду',
              narrative:
                'API-мост выходит за 75 дней, защищая 100% продлений Q2 и открывая кросс-продажи на $1.1M. Основатели студии возглавляют новое направление автоматизации.',
              weightedImpactAnalysis:
                'Максимизирует Плюс скорости выхода на рынок (вес 5) и Плюс команды (вес 4) при минимальных издержках рефакторинга.',
              keyDriverOrContingency:
                'Предоставить основателям студии автономию в развитии движка.',
              probabilityPercent: 30,
            },
            mostLikelyCase: {
              headline: 'Сильный рост выручки в 1-й год и 6 месяцев планового рефакторинга',
              narrative:
                'Запуск проходит за 100 дней и защищает контракты Q2, но миграция под мультирегиональный SOC2 занимает на 2 квартала дольше.',
              weightedImpactAnalysis:
                'Плюс тайминга рынка (вес 5) уверенно перевешивает архитектурные шероховатости (вес 3).',
              keyDriverOrContingency:
                'Выделить 3 инженеров платформы для бесшовной миграции БД в фоновом режиме.',
              probabilityPercent: 50,
            },
            worstCase: {
              headline: 'Конфликт культур, уход основателей через год и переписывание кода',
              narrative:
                'Скрытые ограничения архитектуры вызывают сбои под нагрузкой. Разногласия по продукту приводят к уходу основателей студии.',
              weightedImpactAnalysis:
                'Риски удержания (вес 4) и архитектуры (вес 3) перерастают в серьёзные потери.',
              keyDriverOrContingency:
                'Провести 14-дневный нагрузочный аудит кода до подписания обязывающих документов.',
              probabilityPercent: 20,
            },
          },
        ],
        blindSpots: [
          'Проверили ли мы договоры крупнейших клиентов FluxGraph на наличие пункта о расторжении при смене собственника?',
          'Какова точная стоимость оттока клиентов, если при внутренней разработке 30% контрактов Q2 уйдут к конкурентам?',
          'Можем ли мы заключить 60-дневное OEM-соглашение с правом выкупа перед полной сделкой M&A?',
        ],
      },
      {
        id: 'dec-career-offer',
        title: 'Принять оффер VP Engineering в биотех-стартапе (Series B) vs. Остаться Главным Архитектором',
        category: 'Карьера и вознаграждение',
        createdAt: 'Окт 2026',
        summary:
          'Выбор между стабильной позицией Главного Архитектора ($460K ликвидного дохода в год) и ролью вице-президента по разработке (управление 28 инженерами) в биотех-компании раунда B ($295K база + 1.15% акций).',
        options: [
          {
            id: 'opt-1',
            name: 'Перейти на роль VP Engineering (Series B)',
            tagline: 'Высокий потенциал акций, масштаб топ-менеджера, выше нагрузка',
            description:
              'Возглавить департамент из 28 инженеров с окладом $295K и пакетом 1.15% акций после привлечения $65M инвестиций.',
          },
          {
            id: 'opt-2',
            name: 'Остаться Главным Архитектором (Principal)',
            tagline: 'Гарантированные $460K деньгами и акциями, спокойный график',
            description:
              'Продолжить отвечать за техническую стратегию без кадровой рутины при 35-часовой рабочей неделе.',
          },
        ],
        prosCons: [
          {
            id: 'pc-101',
            optionId: 'opt-1',
            type: 'pro',
            title: 'Квантовый скачок в карьере до уровня C-level топ-менеджмента',
            impactNote: 'Опыт масштабирования организации с 28 до 75+ инженеров.',
            weight: 5,
            domain: 'Карьерный рост',
          },
          {
            id: 'pc-102',
            optionId: 'opt-1',
            type: 'pro',
            title: 'Пакет 1.15% акций с потенциалом $9.5M+ при успешном выходе',
            impactNote: 'При оценке компании в $1.2B стоимость доли превысит $9.5M.',
            weight: 4,
            domain: 'Финансы',
          },
          {
            id: 'pc-103',
            optionId: 'opt-1',
            type: 'con',
            title: 'Снижение гарантированного годового дохода на $165K',
            impactNote: 'Ежемесячные сбережения сократятся примерно на $8,500 до момента ликвидности акций.',
            weight: 4,
            domain: 'Финансы',
          },
          {
            id: 'pc-105',
            optionId: 'opt-2',
            type: 'pro',
            title: 'Гарантированные $460K ликвидного дохода с квартальной продажей RSU',
            impactNote: 'Нулевой риск неликвидности; капитал сразу работает в инвестиционном портфеле.',
            weight: 5,
            domain: 'Финансы',
          },
          {
            id: 'pc-106',
            optionId: 'opt-2',
            type: 'pro',
            title: 'Высокая автономия и свободные вечера с семьёй',
            impactNote: 'Глубокая инженерная работа без бюрократии и кадровых эскалаций.',
            weight: 4,
            domain: 'Баланс жизни',
          },
          {
            id: 'pc-107',
            optionId: 'opt-2',
            type: 'con',
            title: 'Плато в развитии и потолок компенсации на ближайшие 2–3 года',
            impactNote: 'Следующий грейд Distinguished политически заблокирован.',
            weight: 4,
            domain: 'Карьерный рост',
          },
        ],
        criteria: [
          {
            id: 'crit-101',
            name: 'Ожидаемый капитал через 4 года с учётом риска',
            description: 'Чистое накопление капитала с учётом вероятности экзита стартапа.',
            weight: 5,
            scores: [
              {
                optionId: 'opt-1',
                score: 4,
                rationale: '$1.18M гарантированно + математическое ожидание пакета акций ~$2.8M.',
              },
              {
                optionId: 'opt-2',
                score: 4,
                rationale: '$1.84M гарантированными ликвидными выплатами с минимальным риском.',
              },
            ],
          },
          {
            id: 'crit-102',
            name: 'Масштаб задач и интеллектуальный драйв',
            description: 'Работа над прорывными задачами в области вычислительной биологии.',
            weight: 5,
            scores: [
              {
                optionId: 'opt-1',
                score: 5,
                rationale: 'Ускорение разработки новых терапевтических белков.',
              },
              {
                optionId: 'opt-2',
                score: 3,
                rationale: 'Постепенная оптимизация зрелой облачной инфраструктуры.',
              },
            ],
          },
          {
            id: 'crit-103',
            name: 'Баланс работы и жизни',
            description: 'Предсказуемость графика, качество сна и время для семьи.',
            weight: 4,
            scores: [
              {
                optionId: 'opt-1',
                score: 2,
                rationale: 'Интенсивный темп стартапа (55+ часов в неделю, 4 дня в офисе).',
              },
              {
                optionId: 'opt-2',
                score: 5,
                rationale: 'Полная удалённая гибкость и контроль своего календаря.',
              },
            ],
          },
        ],
        swot: [
          {
            id: 'sw-101',
            optionId: 'opt-1',
            quadrant: 'strength',
            title: 'Запас прочности стартапа на 36 месяцев ($65M на счетах)',
            detail: 'Нет риска внезапного кассового разрыва в ближайшие 3 года.',
            weight: 5,
            mitigationOrLeverage: 'Зафиксировать двухлетний бюджет R&D до подписания оффера.',
          },
          {
            id: 'sw-102',
            optionId: 'opt-1',
            quadrant: 'weakness',
            title: 'CEO-учёный без опыта управления крупной разработкой',
            detail: 'Склонность к частому пересмотру приоритетов.',
            weight: 4,
            mitigationOrLeverage: 'Согласовать чёткое разделение зон ответственности на берегу.',
          },
          {
            id: 'sw-103',
            optionId: 'opt-2',
            quadrant: 'strength',
            title: 'Огромный авторитет внутри компании и психологический комфорт',
            detail: '6 лет контекста позволяют решать задачи с минимальными усилиями.',
            weight: 4,
            mitigationOrLeverage: 'Использовать свободное время для платного консультирования стартапов.',
          },
          {
            id: 'sw-104',
            optionId: 'opt-2',
            quadrant: 'threat',
            title: 'Риск стагнации и сожаления об упущенных возможностях в биотехнологиях',
            detail: 'Такие предложения уровня VP в хорошо профинансированных компаниях редки.',
            weight: 4,
            mitigationOrLeverage: 'Назначить чёткую дату пересмотра карьерного трека через 6 месяцев.',
          },
        ],
        scenarios: [
          {
            optionId: 'opt-1',
            bestCase: {
              headline: 'Утроение оценки на раунде C через 24 месяца и вторичная продажа акций',
              narrative:
                'Партнёрство с фармгигантом позволяет поднять раунд C по оценке $450M. Вы продаёте 15% вестинга ($650K наличными) и управляете организацией из 65 человек.',
              weightedImpactAnalysis:
                'Полностью раскрывает Плюс карьерного роста (вес 5) и Плюс капитала (вес 4), перекрывая просадку по зарплате.',
              keyDriverOrContingency:
                'Включить в контракт право продажи до 20% акций на вторичном рынке в раунде C.',
              probabilityPercent: 25,
            },
            mostLikelyCase: {
              headline: 'Напряжённые 3 года роста и увеличение стоимости доли в 2.5 раза',
              narrative:
                'Вы работаете по 52 часа в неделю, выстраиваете процессы и выводите компанию к стратегической продаже за $400M на 4-й год.',
              weightedImpactAnalysis:
                'Плюс топ-менеджерского опыта (вес 5) уравновешивает высокую нагрузку (вес 4).',
              keyDriverOrContingency:
                'Нанять сильного операционного директора разработки в первом квартале.',
              probabilityPercent: 50,
            },
            worstCase: {
              headline: 'Разногласия с основателем и уход через 18 месяцев без ликвидности',
              narrative:
                'Задержки лабораторных испытаний приводят к микроменеджменту со стороны CEO. Вы уходите через 1.5 года, потеряв $245K разницы в окладе.',
              weightedImpactAnalysis:
                'Минусы потери ликвидного дохода (вес 4) и переработок реализуются одновременно.',
              keyDriverOrContingency:
                'Прописать в трудовом договоре 6 окладов выходного пособия и ускоренный вестинг.',
              probabilityPercent: 25,
            },
          },
          {
            optionId: 'opt-2',
            bestCase: {
              headline: 'Повышение до Distinguished Architect + портфель венчурного эдвайзера',
              narrative:
                'Вы сохраняете $460K+ дохода, получаете повышение до $580K через 18 месяцев и параллельно консультируете 2 стартапа за долю 0.25% в каждом.',
              weightedImpactAnalysis:
                'Сохраняет максимальный финансовый Плюс (вес 5) и снимает проблему карьерного плато.',
              keyDriverOrContingency:
                'Заручиться письменной поддержкой CTO на ближайшем цикле ревью.',
              probabilityPercent: 30,
            },
            mostLikelyCase: {
              headline: 'Комфортное накопление капитала при постепенной рутинизации задач',
              narrative:
                'Вы спокойно откладываете по $180K+ в год и проводите вечера с семьёй, хотя инженерные вызовы становятся предсказуемыми.',
              weightedImpactAnalysis:
                'Даёт 100% от финансовых и семейных плюсов при умеренной скуке на работе.',
              keyDriverOrContingency:
                'Инициировать внутренний R&D-проект для поддержания технического тонуса.',
              probabilityPercent: 55,
            },
            worstCase: {
              headline: 'Реорганизация компании лишает вас автономии',
              narrative:
                'Новое руководство объединяет архитекторов с линейным менеджментом, убирая свободу действий.',
              weightedImpactAnalysis:
                'Теряется преимущество автономии (вес 4) при сохранении потолка по карьере.',
              keyDriverOrContingency:
                'Поддерживать тёплые контакты с профильными венчурными фондами.',
              probabilityPercent: 15,
            },
          },
        ],
        blindSpots: [
          'Можно ли договориться о подписном бонусе $45K для компенсации разницы в базовом окладе?',
          'Общались ли вы неформально с предыдущим директором по разработке о причинах его ухода?',
          'Сможете ли вы вернуться в текущую компанию с повышением через 18 месяцев?',
        ],
      },
    ];
  }

  return [
    {
      id: 'dec-product-arch',
      title: 'Oman ohjelmistomoottorin rakentaminen vs. Erikoistuneen ohjelmistostudion yritysosto',
      category: 'Yritys- ja tuotestrategia',
      createdAt: 'Loka 2026',
      summary:
        'Päätös siitä, investoidaanko 4,2 miljoonaa dollaria ja 14 kuukautta omaan tuotekehitykseen orkestrointimoottorin rakentamiseksi alusta alkaen, vai ostetaanko 12 hengen erikoisstudio, jolla on valmis tuotantojärjestelmä.',
      options: [
        {
          id: 'opt-1',
          name: 'Rakenna oma moottori (In-House)',
          tagline: 'Täysi arkkitehtuurinen hallinta, hitaampi markkinoilletulo',
          description:
            'Rekrytoi 8 järjestelmäasiantuntijaa ja rakenna natiivi orkestrointimoottori suoraan nykyisen data-alustan päälle.',
        },
        {
          id: 'opt-2',
          name: 'Osta erikoistunut studio (Yritysosto)',
          tagline: 'Markkinoille 90 päivässä, integrointi- ja sitouttamisriski',
          description:
            'Osta FluxGraph Labs (3,8 M$ käteinen + sitouttamisoptiot) ja integroi heidän järjestelmänsä 90 päivässä.',
        },
      ],
      prosCons: [
        {
          id: 'pc-1',
          optionId: 'opt-1',
          type: 'pro',
          title: 'Ei vanhaa teknistä velkaa tai vieraita tietomalleja',
          impactNote:
            'Natiivi Rust/TypeScript-arkkitehtuuri sopii suoraan nykyiseen tietoturva- ja hallintamalliimme.',
          weight: 5,
          domain: 'Arkkitehtuuri',
        },
        {
          id: 'pc-2',
          optionId: 'opt-1',
          type: 'pro',
          title: 'Säästää osakepääomaa ja yrityskaupan lakikuluja',
          impactNote: 'Säästää ~4,5 % laimentumisen ja 280 000 $ transaktiokuluja.',
          weight: 3,
          domain: 'Talous',
        },
        {
          id: 'pc-3',
          optionId: 'opt-1',
          type: 'con',
          title: '14 kuukauden viive altistaa Q2-suurasiakkaat kilpailijoille',
          impactNote:
            'Myyntiputkessa on 19 suuryrityksen sopimusuusintaa Q2:lla, jotka vaativat automaatiota heti.',
          weight: 5,
          domain: 'Aikataulu',
        },
        {
          id: 'pc-4',
          optionId: 'opt-1',
          type: 'con',
          title: 'Sitoo avainkehittäjät pois ydinliiketoiminnasta',
          impactNote:
            '3 pääarkkitehdin siirto viivästyttää Q1-analytiikkajulkaisua vähintään 8 viikolla.',
          weight: 4,
          domain: 'Toteutusriski',
        },
        {
          id: 'pc-5',
          optionId: 'opt-2',
          type: 'pro',
          title: 'Valmis tuotantokyvykkyys asiakkaille 90 päivässä',
          impactNote:
            'Vapauttaa 2,9 M$ lisämyyntiä (ARR) ennen tilikauden päättymistä.',
          weight: 5,
          domain: 'Aikataulu',
        },
        {
          id: 'pc-6',
          optionId: 'opt-2',
          type: 'pro',
          title: 'Tuo taloon 9 kokenutta huippukehittäjää valmiina tiiminä',
          impactNote: 'Ohittaa 7 kuukauden haastavan rekrytointijakson.',
          weight: 4,
          domain: 'Osaaminen',
        },
        {
          id: 'pc-7',
          optionId: 'opt-2',
          type: 'con',
          title: 'Tunnistautumisen ja laskutuksen yhtenäistäminen vaatii 4 kk työn',
          impactNote:
            'Yhden alueen Go/PostgreSQL-rakenne on päivitettävä monialueiseen SOC2-standardiin.',
          weight: 3,
          domain: 'Arkkitehtuuri',
        },
        {
          id: 'pc-8',
          optionId: 'opt-2',
          type: 'con',
          title: 'Perustajien lähtöriski 18 kuukauden sitouttamisjakson jälkeen',
          impactNote: 'Kriittinen arkkitehtuuriosaaminen on keskittynyt kahdelle perustajalle.',
          weight: 4,
          domain: 'Sitouttaminen',
        },
      ],
      criteria: [
        {
          id: 'crit-1',
          name: 'Markkinoilletulon nopeus & Q2-sopimusten turvaaminen',
          description: 'Kuinka nopeasti ratkaisu on asiakkaiden tuotantokäytössä.',
          weight: 5,
          scores: [
            {
              optionId: 'opt-1',
              score: 2,
              rationale: 'Beta 9 kk, tuotantovalmis 14 kk — myöhästyy Q2-uusinnoista.',
            },
            {
              optionId: 'opt-2',
              score: 5,
              rationale: 'Integraatio valmis 90 päivässä; täyttää Q2-tarjouspyynnöt heti.',
            },
          ],
        },
        {
          id: 'crit-2',
          name: 'Pitkän aikavälin arkkitehtuurinen yhtenäisyys',
          description: 'Ylläpidettävyys, yhtenäinen tietoturva ja alhainen viive.',
          weight: 4,
          scores: [
            {
              optionId: 'opt-1',
              score: 5,
              rationale: 'Suunniteltu alusta asti yhteiselle tapahtumaväylälle.',
            },
            {
              optionId: 'opt-2',
              score: 3,
              rationale: 'Vaatii sovitinkerroksen 12 kuukaudeksi ennen täyttä yhdistämistä.',
            },
          ],
        },
        {
          id: 'crit-3',
          name: 'Pääoman tuotto 24 kuukauden jaksolla',
          description: 'Kokonaiskustannus suhteessa saavutettuun lisämyyntiin 2 vuodessa.',
          weight: 4,
          scores: [
            {
              optionId: 'opt-1',
              score: 3,
              rationale: 'Matalampi alkukulu, mutta menetetään 11 kk lisämyynti.',
            },
            {
              optionId: 'opt-2',
              score: 4,
              rationale: 'Korkeampi hankintahinta, mutta tuo heti +2,9 M$ vuosilaskutusta.',
            },
          ],
        },
        {
          id: 'crit-4',
          name: 'Ydintiimin työrauha ja fokus',
          description: 'Nykyisten tuotekehitystiimien häiriöttömyys Q1-tavoitteissa.',
          weight: 4,
          scores: [
            {
              optionId: 'opt-1',
              score: 2,
              rationale: 'Vaatii 3 sisäisen pääarkkitehdin irrottamista nykyisistä tiimeistä.',
            },
            {
              optionId: 'opt-2',
              score: 4,
              rationale: 'Ostettu 12 hengen tiimi jatkaa kehitystä; vain 2 sisäistä kehittäjää tarvitaan rajapintoihin.',
            },
          ],
        },
      ],
      swot: [
        {
          id: 'sw-1',
          optionId: 'opt-1',
          quadrant: 'strength',
          title: 'Yhtenäinen ISO-27001- ja HIPAA-tietoturva alusta alkaen',
          detail: 'Ei vaadi ulkopuolisten alihankkijoiden tietoturva-auditointeja.',
          weight: 4,
          mitigationOrLeverage: 'Korosta natiivia tietoturvaa suuryritysten auditoinneissa.',
        },
        {
          id: 'sw-4',
          optionId: 'opt-1',
          quadrant: 'threat',
          title: 'Kilpailijoiden leviäminen top-20 asiakkuuksiin rakennusvaiheen aikana',
          detail: 'Kun asiakas ottaa käyttöön kilpailijan alustan, vaihtokustannus on yli 18 kk.',
          weight: 5,
          mitigationOrLeverage: 'Julkaise väliaikainen webhook-rajapinta ja sitova tiekartta.',
        },
        {
          id: 'sw-5',
          optionId: 'opt-2',
          quadrant: 'strength',
          title: 'Tuotannossa testattu moottori (40 miljoonaa tilasiirtymää päivässä)',
          detail: 'FluxGraph palvelee jo 3 Fortune 500 -asiakasta tuotannossa.',
          weight: 5,
          mitigationOrLeverage: 'Hyödynnä referenssejä välittömästi Q2-myyntikampanjoissa.',
        },
        {
          id: 'sw-8',
          optionId: 'opt-2',
          quadrant: 'threat',
          title: 'Avainhenkilöiden vaihtuvuus, jos lisäkauppahinnan tavoitteet karkaavat',
          detail: 'Integraatiokitka voi heikentää ostetun tiimin motivaatiota.',
          weight: 4,
          mitigationOrLeverage: 'Sido sitouttamispalkkiot tekniseen integraatioon ja alustan käyttöönottoon.',
        },
      ],
      scenarios: [
        {
          optionId: 'opt-1',
          bestCase: {
            headline: 'Sujuva rekrytointi ja korkean katteen natiivialusta 11 kuukaudessa',
            narrative:
              'Rekrytoimme 6 huippuosaajaa 60 päivässä, julkaisemme alfa-esikatselun, joka pitää 90 % Q2-asiakkaista, ja tuomme markkinoille puhtaan alustan.',
            weightedImpactAnalysis:
              'Maksimoi painon 5 arkkitehtuurihyödyn ja neutraloi painon 5 aikatauluriskin.',
            keyDriverOrContingency: 'Palkkaa pääarkkitehti ensimmäisen 30 päivän aikana.',
            probabilityPercent: 20,
          },
          mostLikelyCase: {
            headline: 'Laadukas alusta 15 kuukaudessa, mutta kohtalainen asiakaspoistuma Q2:lla',
            narrative:
              'Rekrytointi vie 4,5 kk ja julkaisu siirtyy kuukauteen 15. Arkkitehtuuri on erinomainen, mutta menetämme 5–7 kiireistä asiakasta (1,2 M$ ARR).',
            weightedImpactAnalysis:
              'Painon 5 arkkitehtuurietu toteutuu, mutta painon 5 aikatauluhaitta leikkaa ensimmäisen vuoden tuottoa.',
            keyDriverOrContingency: 'Rakenna kevyt kumppani-integraatio siirtymäajaksi.',
            probabilityPercent: 55,
          },
          worstCase: {
            headline: '18 kuukauden viivästys, avainhenkilöiden kuormitus ja markkinan menetys',
            narrative:
              'Hajautetun tilanhallinnan haasteet venyttävät julkaisun 18 kuukauteen. Sisäiset siirrot viivästyttävät Q1-päätuotetta ja kilpailijat valtaavat asiakkaat.',
            weightedImpactAnalysis:
              'Painon 5 aikatauluriski ja painon 4 toteutusriski realisoituvat täysimääräisesti.',
            keyDriverOrContingency: 'Aseta 6 kuukauden tarkistuspiste OEM-lisensointiin siirtymiseksi.',
            probabilityPercent: 25,
          },
        },
        {
          optionId: 'opt-2',
          bestCase: {
            headline: '90 päivän julkaisu tuo +3,4 M$ ARR:ää ja koko tiimi sitoutuu',
            narrative:
              'API-silta valmistuu 75 päivässä, turvaa 100 % Q2-uusinnoista ja avaa 1,1 M$ ristiinmyynnin. Perustajat nousevat uuden liiketoimintayksikön vetäjiksi.',
            weightedImpactAnalysis:
              'Realisoi täysin painon 5 aikatauluhyödyn ja painon 4 osaamishyödyn.',
            keyDriverOrContingency: 'Anna perustajille selkeä vastuu automaatioalustan kehityksestä.',
            probabilityPercent: 30,
          },
          mostLikelyCase: {
            headline: 'Vahva ensimmäisen vuoden kasvu ja 6 kuukauden tietokantamuutos',
            narrative:
              'Kaupallinen julkaisu onnistuu 100 päivässä ja suojaa Q2-sopimukset, mutta monialueinen SOC2-yhtenäistäminen vie 2 neljännestä odotettua pidempään.',
            weightedImpactAnalysis:
              'Painon 5 markkina-ajoitus voittaa selvästi painon 3 refaktorointihaitan.',
            keyDriverOrContingency: 'Eristä tietokantamigraatio erilliselle 3 hengen alustatiimille.',
            probabilityPercent: 50,
          },
          worstCase: {
            headline: 'Kulttuuritörmäys, perustajien lähtö 12 kk kohdalla ja koodin uudelleenkirjoitus',
            narrative:
              'Piilevät skaalautuvuusongelmat aiheuttavat häiriöitä suurasiakkailla. Näkemyserot johtavat perustajien lähtöön.',
            weightedImpactAnalysis:
              'Painon 4 sitoutumisriski ja painon 3 arkkitehtuuririski kääntävät edun tappioksi.',
            keyDriverOrContingency: 'Suorita 14 päivän kuormitustestaus ja koodiauditointi ennen kauppakirjaa.',
            probabilityPercent: 20,
          },
        },
      ],
      blindSpots: [
        'Sisältävätkö FluxGraphin suurimmat asiakassopimukset irtisanomislausekkeen omistajanvaihdoksen yhteydessä?',
        'Mikä on asiakaspoistuman todellinen hinta, jos 30 % Q2-uusinnoista siirtyy kilpailijalle rakennusvaiheen aikana?',
        'Voimmeko neuvotella 60 päivän OEM-lähdekoodilisenssin ennen lopullista yrityskauppaa?',
      ],
    },
    {
      id: 'dec-career-offer',
      title: 'Ota vastaan VP Engineering -rooli Series B -biotekniikkayhtiössä vs. Jää Principal Architect -rooliin',
      category: 'Ura & Palkitseminen',
      createdAt: 'Loka 2026',
      summary:
        'Arvioidaanko siirtymistä korkean käteispalkan ja vapauden Principal Architect -tehtävästä (460 000 $ likvidi kokonaispalkka) johtamaan 28 hengen tuotekehitysorganisaatiota Series B -vaiheen biotekniikkayhtiössä (295 000 $ peruspalkka + 1,15 % optiot).',
      options: [
        {
          id: 'opt-1',
          name: 'Siirry Series B VP Engineering -rooliin',
          tagline: 'Suuri optiopotentiaali, johtoryhmävastuu, korkeampi kuormitus',
          description:
            'Ota kokonaisvastuu 28 kehittäjästä 295 000 $ peruspalkalla ja 1,15 % osakeomistuksella 65 M$ rahoituskierroksen jälkeen.',
        },
        {
          id: 'opt-2',
          name: 'Jää Principal Architect -rooliin',
          tagline: 'Varma 460 000 $ likvidi ansio, syvä tekninen asiantuntijuus',
          description:
            'Jatka konsernitason arkkitehtuurin johtamista ennustettavilla RSU-osakkeilla ja 35 tunnin työviikolla.',
        },
      ],
      prosCons: [
        {
          id: 'pc-101',
          optionId: 'opt-1',
          type: 'pro',
          title: 'Merkittävä urahyppy C-tason teknologiajohtajaksi',
          impactNote: 'Todistettu näyttö organisaation kasvattamisesta 28 hengestä yli 75 henkeen.',
          weight: 5,
          domain: 'Urakehitys',
        },
        {
          id: 'pc-102',
          optionId: 'opt-1',
          type: 'pro',
          title: 'Epäsymmetrinen 1,15 % osakepotti merkittävällä arvonnousulla',
          impactNote: '1,2 miljardin dollarin irtautumisessa osakepotin nettoarvo ylittää 9,5 M$.',
          weight: 4,
          domain: 'Talous',
        },
        {
          id: 'pc-103',
          optionId: 'opt-1',
          type: 'con',
          title: '165 000 $ vuotuinen pudotus varmassa käteisvirrassa',
          impactNote: 'Kuukausittainen nettosäästöaste laskee ~8 500 $ ennen mahdollista exitiä.',
          weight: 4,
          domain: 'Talous',
        },
        {
          id: 'pc-105',
          optionId: 'opt-2',
          type: 'pro',
          title: '460 000 $ likvidi kokonaispalkka ja neljännesvuosittaiset RSU-tuotot',
          impactNote: 'Ei epälikviditeettiriskiä; varallisuus kasvaa suoraan hajautetussa salkussa.',
          weight: 5,
          domain: 'Talous',
        },
        {
          id: 'pc-106',
          optionId: 'opt-2',
          type: 'pro',
          title: 'Korkea autonomia ja rauhalliset illat perheen kanssa',
          impactNote: 'Vahva luottamus mahdollistaa syvän teknisen työn ilman henkilöstöpolitiikkaa.',
          weight: 4,
          domain: 'Elämäntapa',
        },
        {
          id: 'pc-107',
          optionId: 'opt-2',
          type: 'con',
          title: 'Oppimiskäyrän tasaantuminen ja palkkakatto',
          impactNote: 'Distinguished Engineer -ylennysputki on tukossa seuraavat 24–36 kk.',
          weight: 4,
          domain: 'Urakehitys',
        },
      ],
      criteria: [
        {
          id: 'crit-101',
          name: 'Riskikorjattu 4 vuoden nettovarallisuus',
          description: 'Odotettu varallisuuden kasvu huomioiden startup-exitin todennäköisyys.',
          weight: 5,
          scores: [
            {
              optionId: 'opt-1',
              score: 4,
              rationale: '1,18 M$ varmaa palkkaa + ~2,8 M$ todennäköisyyspainotettu optioarvo.',
            },
            {
              optionId: 'opt-2',
              score: 4,
              rationale: '1,84 M$ likvidiä tuloa matalalla riskillä ja välittömällä korkoa korolle -kasvulla.',
            },
          ],
        },
        {
          id: 'crit-102',
          name: 'Työn merkityksellisyys ja älyllinen haaste',
          description: 'Työskentely huipputeknologian parissa seuraavan vuosikymmenen ajan.',
          weight: 5,
          scores: [
            {
              optionId: 'opt-1',
              score: 5,
              rationale: 'Lääkeproteiinien kehityksen nopeuttaminen laskennallisin menetelmin.',
            },
            {
              optionId: 'opt-2',
              score: 3,
              rationale: 'Kypsän pilvi-infrastruktuurin asteittainen optimointi.',
            },
          ],
        },
        {
          id: 'crit-103',
          name: 'Työn ja vapaa-ajan tasapaino',
          description: 'Ennustettava aikataulu, palautuminen ja perheaika.',
          weight: 4,
          scores: [
            {
              optionId: 'opt-1',
              score: 2,
              rationale: 'Korkean intensiteetin kasvuvaihe, hallitusvastuu ja läsnäolovelvoite.',
            },
            {
              optionId: 'opt-2',
              score: 5,
              rationale: 'Täysi etätyöjousto ja oman kalenterin hallinta.',
            },
          ],
        },
      ],
      swot: [
        {
          id: 'sw-101',
          optionId: 'opt-1',
          quadrant: 'strength',
          title: '36 kuukauden kassavarat jo turvattu Series B -kierroksella',
          detail: '65 M$ kassassa suojaa tuotekehitystä lähivuosien rahoitusmarkkinoiden heilahteluilta.',
          weight: 5,
          mitigationOrLeverage: 'Lukitse 2 vuoden tuotekehitysbudjetti kirjallisesti ennen sopimusta.',
        },
        {
          id: 'sw-102',
          optionId: 'opt-1',
          quadrant: 'weakness',
          title: 'Akateeminen ensikertalais-toimitusjohtaja ja mikromanageerausriski',
          detail: 'Aiemmat kehitysjohtajat ovat maininneet nopeasti vaihtuvat prioriteetit.',
          weight: 4,
          mitigationOrLeverage: 'Määrittele selkeä päätöksentekoraja CEO:n ja VP Engineeringin välille.',
        },
        {
          id: 'sw-103',
          optionId: 'opt-2',
          quadrant: 'strength',
          title: 'Vahva sisäinen asema ja psykologinen turvallisuus',
          detail: 'Kuuden vuoden kokemus tekee tuloksenteosta vaivatonta.',
          weight: 4,
          mitigationOrLeverage: 'Hyödynnä vapaa-aikaa toimimalla neuvonantajana 1–2 alkuvaiheen startupissa.',
        },
        {
          id: 'sw-104',
          optionId: 'opt-2',
          quadrant: 'threat',
          title: 'Paikalleen jähmettyminen ja biotekniikka-aallon ohittaminen',
          detail: 'Hyvin rahoitetut VP-tason roolit osuvat harvoin näin hyvin omaan profiiliin.',
          weight: 4,
          mitigationOrLeverage: 'Aseta 6 kuukauden takaraja sisäisen ylennyspolun arvioinnille.',
        },
      ],
      scenarios: [
        {
          optionId: 'opt-1',
          bestCase: {
            headline: 'Series C -arvostus kolminkertaistuu 24 kk:ssa ja tuo osittaisen likviditeetin',
            narrative:
              'Lääkekumppanuudet etenevät etuajassa ja yhtiö nostaa 450 M$ Series C -kierroksen, jossa myyt 15 % optioista (650 000 $ käteistä) ja johdat 65 hengen organisaatiota.',
            weightedImpactAnalysis:
              'Toteuttaa täysin painon 5 urahypyn ja painon 4 optiotuoton, kuitaten palkanalennuksen.',
            keyDriverOrContingency: 'Neuvottele oikeus myydä 20 % ansaituista optioista Series C -kierroksella.',
            probabilityPercent: 25,
          },
          mostLikelyCase: {
            headline: 'Intensiivinen 3 vuoden rakennusvaihe ja 2,5-kertainen optioiden arvonnousu',
            narrative:
              'Teet 52-tuntista työviikkoa, rakennat vahvan johtaja-aseman ja yhtiö etenee kohti 350–500 M$ yritysostoa neljäntenä vuonna.',
            weightedImpactAnalysis:
              'Painon 5 urakasvu tasapainottaa painon 4 vapaa-ajan supistumista.',
            keyDriverOrContingency: 'Palkkaa vahva kehitysjohtaja ensimmäisellä neljänneksellä jakamaan kuormaa.',
            probabilityPercent: 50,
          },
          worstCase: {
            headline: 'Ristiriidat perustajan kanssa ja lähtö 18 kk kohdalla ilman optiotuottoa',
            narrative:
              'Laboratoriotulokset viivästyvät ja toimitusjohtaja mikromanageeraa kehitystä. Lähdet 18 kk jälkeen menetettyäsi 245 000 $ nettopalkkaa.',
            weightedImpactAnalysis:
              'Painon 4 käteistulon menetys ja kuormitus toteutuvat ilman optiohyötyä.',
            keyDriverOrContingency: 'Varmista työsopimukseen 6 kuukauden irtisanomiskorvaus ja nopeutettu vesting.',
            probabilityPercent: 25,
          },
        },
        {
          optionId: 'opt-2',
          bestCase: {
            headline: 'Distinguished-ylennys + tuottava startup-neuvonantajasalkku',
            narrative:
              'Jatkat korkean palkan roolissa, saat ylennyksen 18 kuukaudessa (580 000 $ kokonaispalkka) ja toimit neuvonantajana kahdessa alkuvaiheen teknologiayrityksessä.',
            weightedImpactAnalysis:
              'Maksimoi painon 5 likvidin tulon ja ratkaisee painon 4 urakehityshaasteen.',
            keyDriverOrContingency: 'Hanki teknologiajohtajan kirjallinen tuki Q4-arviointikierrokselle.',
            probabilityPercent: 30,
          },
          mostLikelyCase: {
            headline: 'Huoleton vaurastuminen ja asteittainen työn rutiininomaisuus',
            narrative:
              'Säästät yli 180 000 $ vuodessa ja nautit vapaista illoista, mutta tekniset haasteet muuttuvat ennustettaviksi.',
            weightedImpactAnalysis:
              'Tuottaa 100 % painon 5 taloushyödystä ja painon 4 elämänlaadusta.',
            keyDriverOrContingency: 'Käynnistä sisäinen uuden teknologian hanke mielenkiinnon ylläpitämiseksi.',
            probabilityPercent: 55,
          },
          worstCase: {
            headline: 'Organisaatiomuutos poistaa itsenäisen arkkitehtiroolin',
            narrative:
              'Uusi johto siirtää pääarkkitehdit linjaesimiehiksi, jolloin menetät autonomian.',
            weightedImpactAnalysis:
              'Heikentää painon 4 autonomiahyötyä samalla kun urakehitys pysyy paikallaan.',
            keyDriverOrContingency: 'Pidä ulkoiset johtajaverkostot aktiivisina.',
            probabilityPercent: 15,
          },
        },
      ],
      blindSpots: [
        'Voitko neuvotella 45 000 $ allekirjoitusbonuksen kuromaan umpeen peruspalkan eroa?',
        'Oletko keskustellut luottamuksellisesti edellisen kehitysjohtajan kanssa hänen lähtönsä syistä?',
        'Toivottaisiko nykyinen työnantajasi sinut tervetulleeksi takaisin 18 kuukauden sisällä?',
      ],
    },
  ];
}
