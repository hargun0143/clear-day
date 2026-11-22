import type { FactSheet } from "./fact-sheet-types.js";
import { findRepeatedAdvice } from "./find-repeated-advice.js";
import {
  buildRequestBody,
  fetchGemini,
  GEMINI_MAX_OUTPUT_TOKENS,
  GEMINI_TEMPERATURE,
  GEMINI_TIMEOUT_MS,
  type InjectedFetch,
} from "./gemini-fetch.js";
import { type GeneratedPlan, postProcessPlan } from "./plan-schema.js";
import { buildPlanPrompt } from "./prompts/plan-prompt.js";

export const GEMINI_DEFAULT_MODEL = "gemini-2.5-flash";
export { GEMINI_TIMEOUT_MS, GEMINI_MAX_OUTPUT_TOKENS, GEMINI_TEMPERATURE };
export type { InjectedFetch };

export type GeminiCallResult =
  { success: true; plan: GeneratedPlan } | { success: false; error: string };

const RETRY_DELAY_MS = 400;

export async function callGeminiPlan(
  factSheet: FactSheet,
  fetchFn: InjectedFetch = fetch
): Promise<GeminiCallResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { success: false, error: "Missing GEMINI_API_KEY" };
  }

  const model = process.env.GEMINI_MODEL || GEMINI_DEFAULT_MODEL;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const { systemInstruction, userContent } = buildPlanPrompt(factSheet);

  let successfulPlan: GeneratedPlan | null = null;

  for (let attempt = 0; attempt < 2; attempt++) {
    let bodyContent = userContent;
    if (attempt === 1 && successfulPlan !== null) {
      const repeats = findRepeatedAdvice(successfulPlan);
      bodyContent = `${userContent}\n\nREMOVE REPEATED ADVICE: ${repeats
        .map((p) => `"${p.a}"`)
        .join(", ")}`;
    }

    const requestBody = buildRequestBody(systemInstruction, bodyContent);
    const result = await fetchGemini(url, apiKey, requestBody, fetchFn);

    if (!result.ok) {
      if (attempt === 0) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        continue;
      }
      return {
        success: false,
        error: result.status
          ? `Upstream error: ${result.status}`
          : "Network error or invalid JSON from Gemini",
      };
    }

    let plan: GeneratedPlan;
    try {
      const parsedJson = JSON.parse(result.text!) as unknown;
      plan = postProcessPlan(parsedJson, factSheet.isUnder18);
    } catch {
      if (attempt === 0) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        continue;
      }
      return { success: false, error: "Empty or invalid response from Gemini" };
    }

    const repeats = findRepeatedAdvice(plan);
    if (repeats.length > 0 && attempt === 0) {
      successfulPlan = plan;
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
      continue;
    }

    return { success: true, plan };
  }

  if (successfulPlan !== null) {
    return { success: true, plan: successfulPlan };
  }

  return { success: false, error: "Failed to generate plan after retry" };
}
