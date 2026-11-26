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

const planCache = new Map<string, PlanApiResponse>();

export function createPlanCacheKey(payload: PlanRequestPayload): string {
  const sortedAnswers: Record<string, unknown> = {};
  const answerKeys = Object.keys(payload.answers || {}).sort();
  for (const k of answerKeys) {
    const val = payload.answers[k];
    if (Array.isArray(val)) {
      sortedAnswers[k] = [...val].sort();
    } else {
      sortedAnswers[k] = val;
    }
  }
  return JSON.stringify({
    cityId: payload.cityId,
    aqiValue: payload.aqi.value,
    answers: sortedAnswers,
  });
}

export function clearPlanCache(): void {
  planCache.clear();
}

export function getPlanCacheSize(): number {
  return planCache.size;
}

export async function requestPlan(
  payload: PlanRequestPayload,
  signal?: AbortSignal
): Promise<PlanApiResponse> {
  const cacheKey = createPlanCacheKey(payload);
  const cached = planCache.get(cacheKey);
  if (cached) {
    return cached;
  }

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
  if (!data.meta.isFallback) {
    planCache.set(cacheKey, data);
  }
  return data;
}
