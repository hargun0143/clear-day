export interface PlanAqiInput {
  value: number;
  mainPollutant?: string;
  source?: string;
  updatedAt?: string;
  isModelled?: boolean;
}

export interface FactSheet {
  cityName: string;
  aqiValue: number;
  aqiBandLabel: string;
  guidanceLine: string;
  mainPollutant: string;
  dataSourceLabel: string;
  isUnder18: boolean;
  vulnerableHome: boolean;
  hasBreathingOrHeartCondition: boolean;
  indoorSmoking: boolean;
  hasPurifier: boolean;
  hasAC: boolean;
  hasExhaust: boolean;
  cookingWithBiomass: boolean;
  highOutdoorHours: boolean;
  mobilityId: string;
  mobilityLabel: string;
  roleLabel: string;
  budgetId: string | null;
  budgetLabel: string | null;
  roleSpecificAnswerLabel: string;
  topFactors: string[];
}
