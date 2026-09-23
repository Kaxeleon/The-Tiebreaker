export interface ProItem {
  id: string;
  text: string;
  detail: string;
  category: 'Financial' | 'Career & Growth' | 'Well-being & Life' | 'Risk & Security' | 'Strategic' | string;
  weight: number; // 1 to 5
  userWeight?: number; // interactive user weight multiplier (1 to 5, default from weight)
}

export interface ConItem {
  id: string;
  text: string;
  detail: string;
  category: 'Financial' | 'Career & Growth' | 'Well-being & Life' | 'Risk & Security' | 'Strategic' | string;
  weight: number; // 1 to 5
  mitigation: string;
  userWeight?: number;
}

export interface DecisionOption {
  id: string;
  name: string;
  summary: string;
  pros: ProItem[];
  cons: ConItem[];
}

export interface CriterionOptionScore {
  optionName: string;
  score: number; // 1 to 10
  rationale: string;
}

export interface ComparisonCriterion {
  id: string;
  name: string;
  description: string;
  importanceWeight: number; // 1 to 5
  userWeight?: number;
  optionScores: CriterionOptionScore[];
}

export interface SwotQuadrantItem {
  title: string;
  explanation: string;
  impact: 'High' | 'Medium';
  mitigationPlan?: string;
}

export interface OptionSwot {
  optionName: string;
  strengths: SwotQuadrantItem[];
  weaknesses: SwotQuadrantItem[];
  opportunities: SwotQuadrantItem[];
  threats: SwotQuadrantItem[];
}

export interface VerdictOptionCondition {
  optionName: string;
  conditions: string[];
}

export interface VerdictData {
  recommendedOption: string;
  confidenceScore: number;
  tiebreakerInsight: string;
  whenToChooseEachOption: VerdictOptionCondition[];
  redLines: string[];
  immediateNextStep: string;
  thoughtExperiment: string;
}

export interface DecisionAnalysis {
  id: string;
  timestamp: number;
  decisionTitle: string;
  description: string;
  priorities: string[];
  urgency: string;
  riskTolerance: string;
  executiveSummary: string;
  primaryDilemmaCore: string;
  options: DecisionOption[];
  comparisonTable: {
    criteria: ComparisonCriterion[];
  };
  swotAnalysis: OptionSwot[];
  verdict: VerdictData;
  isHighDemandFallback?: boolean;
}

export interface StressTestResponse {
  analysis: string;
  blindSpot: string;
  counterPerspective: string;
  recommendedAction: string;
}
