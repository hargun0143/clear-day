import type { QuestionnaireAnswers } from "../../../src/utils/questionnaire/types.js";
import type { GeneratedPlan } from "./plan-schema.js";

export interface PlanApiMeta {
  promptVersion: string;
  model: string;
  generatedAt: string;
  isFallback: boolean;
}

export interface PlanApiResponse {
  plan: GeneratedPlan;
  meta: PlanApiMeta;
}

export interface PlanHandlerResult {
  status: number;
  headers: Record<string, string>;
  body: PlanApiResponse | { error: string };
}

export interface PlanRequestPayload {
  cityId?: string;
  aqi?: { value: number; mainPollutant?: string };
  answers?: QuestionnaireAnswers;
}
