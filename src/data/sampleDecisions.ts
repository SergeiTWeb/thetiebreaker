import { DecisionModel } from '../types/decision';

export const SAMPLE_DECISIONS: DecisionModel[] = [
  {
    id: 'dec-product-arch',
    title: 'Build Proprietary Workflow Engine vs. Acquire Boutique Automation Studio',
    category: 'Corporate & Product Strategy',
    createdAt: 'Oct 2026',
    summary:
      'Deciding whether to allocate $4.2M and 14 months of core engineering bandwidth to build an internal orchestration engine from scratch, or acquire a 12-person specialist studio with an existing production runtime.',
    options: [
      {
        id: 'opt-1',
        name: 'Build In-House Engine',
        tagline: 'Full architectural control, slower time-to-market',
        description:
          'Recruit 8 distributed systems engineers and build a native orchestration engine tightly coupled to our existing data plane.',
      },
      {
        id: 'opt-2',
        name: 'Acquire Specialist Studio',
        tagline: 'Immediate market entry, integration & retention risk',
        description:
          'Acquire FluxGraph Labs ($3.8M cash + equity retention pool) and integrate their runtime within 90 days.',
      },
    ],
    prosCons: [
      {
        id: 'pc-1',
        optionId: 'opt-1',
        type: 'pro',
        title: 'Zero legacy tech debt or foreign schema translation',
        impactNote:
          'Native Rust/TypeScript stack matches our exact observability, IAM permissions, and multi-tenant isolation model.',
        weight: 5,
        domain: 'Architecture',
      },
      {
        id: 'pc-2',
        optionId: 'opt-1',
        type: 'pro',
        title: 'Preserves equity pool and avoids M&A legal overhead',
        impactNote: 'Saves ~4.5% dilution and $280K in transaction legal/audit expenses.',
        weight: 3,
        domain: 'Financial',
      },
      {
        id: 'pc-3',
        optionId: 'opt-1',
        type: 'con',
        title: '14-month window leaves enterprise accounts exposed to competitors',
        impactNote:
          'Sales pipeline shows 19 enterprise renewals in Q2 requiring orchestration capabilities now.',
        weight: 5,
        domain: 'Market Timing',
      },
      {
        id: 'pc-4',
        optionId: 'opt-1',
        type: 'con',
        title: 'Diverts principal engineers from core revenue platform',
        impactNote:
          'Pulling 3 staff engineers delays our core Q1 analytics release by at least 8 weeks.',
        weight: 4,
        domain: 'Execution Risk',
      },
      {
        id: 'pc-5',
        optionId: 'opt-2',
        type: 'pro',
        title: 'Ships production capability to enterprise customers in 90 days',
        impactNote:
          'Unlocks $2.9M in expansion ARR gated on workflow automation before fiscal year-end.',
        weight: 5,
        domain: 'Market Timing',
      },
      {
        id: 'pc-6',
        optionId: 'opt-2',
        type: 'pro',
        title: 'Acquires 9 senior domain engineers with proven orchestration IP',
        impactNote:
          'Bypasses a 7-month recruiting cycle in a tight specialist talent market.',
        weight: 4,
        domain: 'Talent',
      },
      {
        id: 'pc-7',
        optionId: 'opt-2',
        type: 'con',
        title: 'Auth and billing stack migration requires 4 months of refactoring',
        impactNote:
          'Their Go/PostgreSQL single-region architecture must be adapted for our SOC2 multi-region SLA.',
        weight: 3,
        domain: 'Architecture',
      },
      {
        id: 'pc-8',
        optionId: 'opt-2',
        type: 'con',
        title: 'Post-acquisition founder departure risk after 18-month cliff',
        impactNote: 'Key architectural knowledge is concentrated in two co-founders.',
        weight: 4,
        domain: 'Retention',
      },
    ],
    criteria: [
      {
        id: 'crit-1',
        name: 'Time-to-Market & Q2 Renewal Protection',
        description: 'Speed of delivering general availability to defend enterprise renewals.',
        weight: 5,
        scores: [
          {
            optionId: 'opt-1',
            score: 2,
            rationale:
              'Beta takes 9 months; full GA takes 14 months—misses Q2 enterprise renewal cycle.',
          },
          {
            optionId: 'opt-2',
            score: 5,
            rationale:
              'Co-branded integration live in 90 days; immediately satisfies Q2 renewal RFPs.',
          },
        ],
      },
      {
        id: 'crit-2',
        name: 'Long-Term Architectural Cohesion',
        description: 'Maintainability, unified data governance, and absence of glue-code latency.',
        weight: 4,
        scores: [
          {
            optionId: 'opt-1',
            score: 5,
            rationale: 'Designed from day one on our shared event bus and permission graph.',
          },
          {
            optionId: 'opt-2',
            score: 3,
            rationale:
              'Requires an adapter layer for 12 months while we unify identity and tenant state.',
          },
        ],
      },
      {
        id: 'crit-3',
        name: 'Net 24-Month Capital Efficiency',
        description:
          'Total fully loaded cost vs. incremental gross margin generated over 24 months.',
        weight: 4,
        scores: [
          {
            optionId: 'opt-1',
            score: 3,
            rationale:
              'Lower upfront cash outlay ($4.2M spread over 14m), but forfeits ~11 months of expansion ARR.',
          },
          {
            optionId: 'opt-2',
            score: 4,
            rationale:
              'Higher upfront cash/equity ($3.8M + retention), offset by $2.9M Year-1 expansion ARR.',
          },
        ],
      },
      {
        id: 'crit-4',
        name: 'Core Roadmap Focus & Bandwidth',
        description: 'Minimizing distraction to existing product squads and Q1 commitments.',
        weight: 4,
        scores: [
          {
            optionId: 'opt-1',
            score: 2,
            rationale: 'Requires cannibalizing 3 internal staff engineers to seed the new squad.',
          },
          {
            optionId: 'opt-2',
            score: 4,
            rationale:
              'Intact 12-person team continues building; only 2 internal engineers needed for bridge APIs.',
          },
        ],
      },
      {
        id: 'crit-5',
        name: 'Cultural & Organizational Integration',
        description:
          'Ease of aligning compensation bands, engineering rituals, and leadership reporting.',
        weight: 3,
        scores: [
          {
            optionId: 'opt-1',
            score: 5,
            rationale:
              'Every new hire goes through standard leveling, onboarding, and culture loops.',
          },
          {
            optionId: 'opt-2',
            score: 3,
            rationale:
              'Startup team operates with autonomous release cadence and different leveling expectations.',
          },
        ],
      },
    ],
    swot: [
      {
        id: 'sw-1',
        optionId: 'opt-1',
        quadrant: 'strength',
        title: 'Unified multi-region security & compliance posture',
        detail:
          'Inherits our existing ISO-27001 and HIPAA controls without third-party sub-processor audits.',
        weight: 4,
        mitigationOrLeverage:
          'Highlight zero-trust native architecture in enterprise security reviews.',
      },
      {
        id: 'sw-2',
        optionId: 'opt-1',
        quadrant: 'weakness',
        title: 'Cold-start recruiting bottleneck for distributed runtime specialists',
        detail:
          'Average time-to-close for Staff Rust/Systems engineers is currently 110 days.',
        weight: 4,
        mitigationOrLeverage:
          'Engage specialist systems engineering recruiting partners on day one.',
      },
      {
        id: 'sw-3',
        optionId: 'opt-1',
        quadrant: 'opportunity',
        title: 'Purpose-built API ergonomics tailored for next-gen agentic workflows',
        detail:
          'Avoids 2023-era DAG assumptions by designing directly for stateful multi-agent loops.',
        weight: 4,
        mitigationOrLeverage:
          'Co-design schema with 5 design-partner customers during month 1.',
      },
      {
        id: 'sw-4',
        optionId: 'opt-1',
        quadrant: 'threat',
        title: 'Competitor lock-in at top 20 enterprise accounts during build window',
        detail:
          'Once customers adopt a rival workflow engine, switching costs exceed 18 months.',
        weight: 5,
        mitigationOrLeverage:
          'Ship an interim webhook bridge and publish an early-access roadmap commitment.',
      },
      {
        id: 'sw-5',
        optionId: 'opt-2',
        quadrant: 'strength',
        title: 'Battle-tested execution engine processing 40M daily state transitions',
        detail: 'FluxGraph already runs in production for 3 Fortune 500 design partners.',
        weight: 5,
        mitigationOrLeverage:
          'Use existing Fortune 500 case studies immediately in Q2 enterprise upsell campaigns.',
      },
      {
        id: 'sw-6',
        optionId: 'opt-2',
        quadrant: 'weakness',
        title: 'Divergent persistence layer (PostgreSQL vs. our distributed CockroachDB plane)',
        detail: 'Requires dual-write synchronization during the first two quarters post-close.',
        weight: 3,
        mitigationOrLeverage:
          'Ring-fence database migration to Q3 after initial commercial launch.',
      },
      {
        id: 'sw-7',
        optionId: 'opt-2',
        quadrant: 'opportunity',
        title: 'Cross-sell existing analytics suite into FluxGraph’s 45 mid-market accounts',
        detail: 'Creates an immediate $1.1M cross-sell pipeline upon closing.',
        weight: 4,
        mitigationOrLeverage:
          'Bundle unified workspace licensing at a 15% multi-product discount.',
      },
      {
        id: 'sw-8',
        optionId: 'opt-2',
        quadrant: 'threat',
        title: 'Key-person attrition if earn-out milestones feel unattainable',
        detail:
          'If integration friction slows revenue attribution, acquired engineers may disengage.',
        weight: 4,
        mitigationOrLeverage:
          'Structure retention milestones around technical delivery + platform adoption rather than standalone SKU revenue.',
      },
    ],
    scenarios: [
      {
        optionId: 'opt-1',
        bestCase: {
          headline: 'Seamless Hiring & High-Margin Native Platform Launch in 11 Months',
          narrative:
            'We recruit 6 senior systems engineers within 60 days, ship an alpha preview that retains 90% of Q2 enterprise accounts, and launch a zero-tech-debt engine that commands a 25% gross-margin premium.',
          weightedImpactAnalysis:
            'Maximizes your Weight-5 Pro (Zero legacy tech debt) while neutralizing the Weight-5 Market Timing Con through early design-partner previews.',
          keyDriverOrContingency:
            'Requires hiring a Principal Runtime Lead within the first 30 days and securing beta commitments from top 10 renewals.',
          probabilityPercent: 20,
        },
        mostLikelyCase: {
          headline: 'Solid Architecture Delivered in 15 Months with Moderate Q2 Churn',
          narrative:
            'Recruiting takes 4.5 months, pushing general availability to Month 15. The resulting architecture is clean and maintainable, but we lose 5–7 impatient enterprise expansions ($1.2M ARR) to faster-moving competitors.',
          weightedImpactAnalysis:
            'Your Weight-5 Architectural Pro is achieved, but the Weight-5 Market Timing Con and Weight-4 Core Bandwidth Con both exact a tangible toll on Year-1 ARR.',
          keyDriverOrContingency:
            'Build a lightweight partner integration to stem customer defections during months 4–12.',
          probabilityPercent: 55,
        },
        worstCase: {
          headline: '18-Month Slippage, Staff Engineer Burnout & Competitive Lock-Out',
          narrative:
            'Distributed state edge-cases delay production stability to 18+ months. Pulling 3 internal staff engineers derails our core Q1 analytics roadmap, while competitors capture the workflow budget in 60% of our enterprise base.',
          weightedImpactAnalysis:
            'The Weight-5 Market Timing Con and Weight-4 Execution Risk Con compound severely, rendering the Weight-3 equity savings negligible.',
          keyDriverOrContingency:
            'Set a hard Month-6 architectural kill-switch milestone; if core engine benchmarks fail, pivot to OEM licensing.',
          probabilityPercent: 25,
        },
      },
      {
        optionId: 'opt-2',
        bestCase: {
          headline: '90-Day Commercial Launch Unlocks $3.4M ARR & Retains Full Acquired Team',
          narrative:
            'The API bridge ships on schedule in 75 days, defending 100% of Q2 renewals and closing $1.1M in cross-sell pipeline. FluxGraph’s founders thrive as heads of the new Automation Business Unit.',
          weightedImpactAnalysis:
            'Fully captures your Weight-5 Market Timing Pro and Weight-4 Talent Pro while keeping the Weight-3 Auth/Billing refactoring strictly contained.',
          keyDriverOrContingency:
            'Grant acquired founders clear architectural ownership of the automation layer and align earn-outs to platform adoption.',
          probabilityPercent: 30,
        },
        mostLikelyCase: {
          headline: 'Strong Year-1 Revenue Lift Followed by 6 Months of Schema Refactoring',
          narrative:
            'Commercial launch succeeds within 100 days and protects Q2 renewals, but unifying multi-region SOC2 compliance takes 2 quarters longer than planned, and 2 of the 9 acquired engineers depart after Year 1.',
          weightedImpactAnalysis:
            'The Weight-5 Market Timing Pro outweighs the Weight-3 Architecture Con, delivering a net positive ROI despite moderate integration friction.',
          keyDriverOrContingency:
            'Dedicate a 3-person platform bridge squad to isolate multi-region database migration from customer-facing feature work.',
          probabilityPercent: 50,
        },
        worstCase: {
          headline: 'Culture Clash, Founder Exit at Month 12 & Costly Stack Rewrite',
          narrative:
            'Hidden single-tenant assumptions in FluxGraph’s Go runtime cause enterprise outages under load. Disagreements over roadmap priority trigger founder departures, forcing our core team to rewrite 60% of the acquired codebase.',
          weightedImpactAnalysis:
            'Both the Weight-4 Retention Con and Weight-3 Architecture Con escalate into critical failures, eroding the initial time-to-market advantage.',
          keyDriverOrContingency:
            'Perform a 14-day deep-dive load-test & codebase audit prior to signing the definitive purchase agreement.',
          probabilityPercent: 20,
        },
      },
    ],
    blindSpots: [
      'Have we audited whether FluxGraph’s largest enterprise contracts contain change-of-control termination clauses?',
      'If we build in-house, what is the realistic cost of customer churn if 30% of Q2 renewals defect to a competitor?',
      'Can we negotiate a 60-day OEM source-code license with FluxGraph before committing to full M&A?',
    ],
  },
  {
    id: 'dec-career-offer',
    title: 'Accept Founding VP Engineering at Series B Biotech vs. Stay as Principal Architect',
    category: 'Career & Compensation',
    createdAt: 'Oct 2026',
    summary:
      'Evaluating whether to leave a high-cash, high-autonomy Principal Architect position ($460K liquid total comp) to lead a 28-person engineering org at a Series B computational biology company ($295K base + 1.15% early-exercise equity).',
    options: [
      {
        id: 'opt-1',
        name: 'Join Series B as VP Eng',
        tagline: 'High equity upside, executive scope, higher volatility',
        description:
          'Take full organizational ownership of 28 engineers with $295K cash compensation and 1.15% equity following a $65M Series B.',
      },
      {
        id: 'opt-2',
        name: 'Stay as Principal Architect',
        tagline: 'Guaranteed $460K liquid comp, deep technical craft',
        description:
          'Continue leading cross-company technical architecture with predictable RSU vesting, zero management politics, and 35-hour workweeks.',
      },
    ],
    prosCons: [
      {
        id: 'pc-101',
        optionId: 'opt-1',
        type: 'pro',
        title: 'Step-function career leap into executive C-suite leadership',
        impactNote:
          'Establishes proven VP track record scaling an organization from 28 to 75+ engineers.',
        weight: 5,
        domain: 'Career Growth',
      },
      {
        id: 'pc-102',
        optionId: 'opt-1',
        type: 'pro',
        title: 'Asymmetric 1.15% equity stake with QSBS tax treatment potential',
        impactNote: 'At a $1.2B exit scenario, net equity value exceeds $9.5M after dilution.',
        weight: 4,
        domain: 'Financial',
      },
      {
        id: 'pc-103',
        optionId: 'opt-1',
        type: 'con',
        title: '$165K annual reduction in guaranteed liquid cash flow',
        impactNote:
          'Reduces monthly post-tax savings rate by ~$8,500 until a liquidity event occurs.',
        weight: 4,
        domain: 'Financial',
      },
      {
        id: 'pc-104',
        optionId: 'opt-1',
        type: 'con',
        title: '55+ hour weeks with 4-day in-office mandate and recruiting pressure',
        impactNote:
          'Shifts 80% of calendar from deep technical design to hiring, board prep, and org management.',
        weight: 4,
        domain: 'Lifestyle',
      },
      {
        id: 'pc-105',
        optionId: 'opt-2',
        type: 'pro',
        title: '$460K liquid compensation with quarterly public RSU liquidity',
        impactNote:
          'Zero illiquidity risk; compounds directly in diversified index and real estate holdings.',
        weight: 5,
        domain: 'Financial',
      },
      {
        id: 'pc-106',
        optionId: 'opt-2',
        type: 'pro',
        title: 'High psychological autonomy and protected family evenings',
        impactNote:
          'Established organizational trust allows deep technical problem-solving without people-management escalations.',
        weight: 4,
        domain: 'Lifestyle',
      },
      {
        id: 'pc-107',
        optionId: 'opt-2',
        type: 'con',
        title: 'Plateaued learning curve and capped compensation ceiling',
        impactNote:
          'Distinguished Engineer promotion track is politically bottlenecked for the next 24–36 months.',
        weight: 4,
        domain: 'Career Growth',
      },
    ],
    criteria: [
      {
        id: 'crit-101',
        name: 'Risk-Adjusted 4-Year Net Worth',
        description:
          'Expected net wealth creation factoring probability of startup liquidity vs. public RSUs.',
        weight: 5,
        scores: [
          {
            optionId: 'opt-1',
            score: 4,
            rationale:
              '$1.18M guaranteed cash over 4 yrs + high-variance equity with ~$2.8M probability-weighted EV.',
          },
          {
            optionId: 'opt-2',
            score: 4,
            rationale:
              '$1.84M guaranteed liquid cash + public RSUs with low variance and immediate compounding.',
          },
        ],
      },
      {
        id: 'crit-102',
        name: 'Intellectual Fulfilment & Mission Impact',
        description: 'Working on frontier problems that matter deeply over the next decade.',
        weight: 5,
        scores: [
          {
            optionId: 'opt-1',
            score: 5,
            rationale: 'Accelerating therapeutic protein design with wet-lab feedback loops.',
          },
          {
            optionId: 'opt-2',
            score: 3,
            rationale:
              'Incremental latency optimization on mature enterprise cloud infrastructure.',
          },
        ],
      },
      {
        id: 'crit-103',
        name: 'Work-Life Sustainability & Health',
        description: 'Predictable schedule, sleep quality, and time for family and athletics.',
        weight: 4,
        scores: [
          {
            optionId: 'opt-1',
            score: 2,
            rationale:
              'High-intensity Series B scaling phase with board deadlines and on-site presence.',
          },
          {
            optionId: 'opt-2',
            score: 5,
            rationale: 'Full remote flexibility and deep control over calendar commitments.',
          },
        ],
      },
      {
        id: 'crit-104',
        name: 'Long-Term Optionality & Executive Network',
        description: 'Doors opened for future board seats, founder roles, or C-level positions.',
        weight: 4,
        scores: [
          {
            optionId: 'opt-1',
            score: 5,
            rationale:
              'Direct exposure to tier-1 biotech VCs, board governance, and executive scaling.',
          },
          {
            optionId: 'opt-2',
            score: 3,
            rationale:
              'Strong IC reputation, but limited external visibility outside internal architecture councils.',
          },
        ],
      },
    ],
    swot: [
      {
        id: 'sw-101',
        optionId: 'opt-1',
        quadrant: 'strength',
        title: '36 months of cash runway already secured in Series B treasury',
        detail:
          '$65M in the bank insulates the engineering org from near-term fundraising panic.',
        weight: 5,
        mitigationOrLeverage:
          'Lock in a 2-year R&D infrastructure budget commitment in writing prior to signing.',
      },
      {
        id: 'sw-102',
        optionId: 'opt-1',
        quadrant: 'weakness',
        title: 'First-time CEO with academic background and high technical micromanagement tendency',
        detail: 'Two prior engineering directors cited shifting priorities from the founder.',
        weight: 4,
        mitigationOrLeverage:
          'Establish explicit decision-rights charter between CEO (scientific priorities) and VP Eng (delivery & architecture).',
      },
      {
        id: 'sw-103',
        optionId: 'opt-2',
        quadrant: 'strength',
        title: 'Unmatched reputational capital and psychological safety',
        detail: 'Six years of institutional context makes execution effortless.',
        weight: 4,
        mitigationOrLeverage:
          'Use excess bandwidth to advise 1–2 early-stage startups for angel equity.',
      },
      {
        id: 'sw-104',
        optionId: 'opt-2',
        quadrant: 'threat',
        title: 'Quiet stagnation and regret over passing on frontier biotech wave',
        detail:
          'Executive VP roles at well-funded Series B companies rarely align this closely with technical background.',
        weight: 4,
        mitigationOrLeverage:
          'Set a strict 6-month review date to evaluate internal Distinguished Engineer sponsorship.',
      },
    ],
    scenarios: [
      {
        optionId: 'opt-1',
        bestCase: {
          headline: 'Series C Valuation Triples in 24 Months with Secondary Liquidity',
          narrative:
            'Pharma partnership milestones hit ahead of schedule, triggering a $450M Series C where you sell 15% of vested shares ($650K cash) while holding $3.8M in remaining equity and leading a flagship 65-person org.',
          weightedImpactAnalysis:
            'Realizes the full upside of your Weight-5 Career Growth Pro and Weight-4 Equity Pro, completely erasing the Weight-4 Cash Reduction Con within 24 months.',
          keyDriverOrContingency:
            'Negotiate a secondary sale right (up to 20% of vested options) in Series C+ financing rounds.',
          probabilityPercent: 25,
        },
        mostLikelyCase: {
          headline: 'Intense 3-Year Executive Grind Building Credibility & 2.5x Equity Value',
          narrative:
            'You work 52-hour weeks navigating academic-to-commercial growing pains, establish yourself as a respected biotech VP of Engineering, and the company grows steadily toward a $350M–$500M strategic acquisition in Year 4.',
          weightedImpactAnalysis:
            'Balances the Weight-5 Executive Growth Pro against the Weight-4 Lifestyle Con; net wealth roughly matches or modestly beats your public tech comp after 4 years.',
          keyDriverOrContingency:
            'Hire a strong Director of Platform Operations in Quarter 1 to protect 2 evenings a week.',
          probabilityPercent: 50,
        },
        worstCase: {
          headline: 'Founder Alignment Breakdown & Flat Runway Extension at Month 18',
          narrative:
            'Wet-lab validation stalls and the CEO micromanages engineering sprints. You depart after 18 months having forfeited $245K in after-tax liquid cash with illiquid common shares buried under preferred liquidation preferences.',
          weightedImpactAnalysis:
            'Both Weight-4 Cons (Cash sacrifice and 55+ hour weeks) hit simultaneously while the Weight-4 Equity Pro drops near zero.',
          keyDriverOrContingency:
            'Ensure your employment agreement includes 6 months of severance and accelerated vesting upon constructive termination.',
          probabilityPercent: 25,
        },
      },
      {
        optionId: 'opt-2',
        bestCase: {
          headline: 'Distinguished Promotion + Angel Advisory Portfolio Compounding',
          narrative:
            'You remain in your high-leverage Principal role, compound $460K+ liquid compensation in public markets, secure promotion to Distinguished Architect in 18 months ($580K TC), and advise two technology startups for 0.25% advisory equity each.',
          weightedImpactAnalysis:
            'Captures your Weight-5 Liquid Comp Pro and Weight-4 Autonomy Pro while solving the Weight-4 Career Plateau Con through external advisory equity.',
          keyDriverOrContingency:
            'Get formal written sponsorship from the CTO for the Q4 Distinguished Engineer review cycle.',
          probabilityPercent: 30,
        },
        mostLikelyCase: {
          headline: 'Comfortable Financial Compounding with Gradual Technical Boredom',
          narrative:
            'You save over $180K per year effortlessly and enjoy zero-stress evenings, but the technical problems become increasingly routine maintenance and cross-team committee reviews.',
          weightedImpactAnalysis:
            'Delivers 100% of the Weight-5 Financial Pro and Weight-4 Lifestyle Pro, while the Weight-4 Career Plateau Con persists as a mild daily friction.',
          keyDriverOrContingency:
            'Pitch an internal 0-to-1 incubator project to keep technical learning sharp.',
          probabilityPercent: 55,
        },
        worstCase: {
          headline: 'Enterprise Reorg Eliminates Autonomous Architecture Charter',
          narrative:
            'New SVP leadership flattens the Principal Architect group into line-delivery management, removing your autonomy just after the Series B VP role has been filled by another candidate.',
          weightedImpactAnalysis:
            'Erodes your Weight-4 Autonomy Pro while locking in the Weight-4 Career Stagnation Con.',
          keyDriverOrContingency:
            'Keep external executive relationships warm with quarterly check-ins.',
          probabilityPercent: 15,
        },
      },
    ],
    blindSpots: [
      'Can you negotiate a $45K signing bonus or secondary liquidity clause at Series C to bridge the cash gap?',
      'Have you spoken off-the-record with the departed Director of Engineering to verify why they left?',
      'Would your current employer welcome you back at Principal level within 18 months if the startup culture misfires?',
    ],
  },
];
