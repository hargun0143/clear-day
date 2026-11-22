import type { GeneratedPlan } from "../../api/_lib/plan/plan-schema";
import type { QuestionnaireAnswers } from "@/utils/questionnaire/types";

export interface PlanRequestAqi {
  value: number;
  mainPollutant?: string;
  source?: string;
  updatedAt?: string;
  isModelled?: boolean;
}

export interface PlanRequestPayload {
  cityId: string;
  aqi: PlanRequestAqi;
  answers: QuestionnaireAnswers;
}

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

export async function requestPlan(
  payload: PlanRequestPayload,
  signal?: AbortSignal
): Promise<PlanApiResponse> {
  const response = await fetch("/api/plan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to generate plan: HTTP ${response.status}`);
  }

  const data = (await response.json()) as PlanApiResponse;
  return data;
}
