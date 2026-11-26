import {
  findBannedPhrases,
  findEquipmentViolations,
  sanitizeBannedActions,
} from "./banned-phrases.js";
import { buildCorrectionPrompt } from "./correction-prompt.js";
import { enforceTopicCoverage } from "./coverage-enforcer.js";
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
import { DEFAULT_SLOT_ACTIONS } from "./knowledge-sheet.js";
import { type GeneratedPlan, postProcessPlan } from "./plan-schema.js";
import { buildPlanPrompt } from "./prompts/plan-prompt.js";
import { selectGoodHabits } from "./topics/select-good-habits.js";
import { selectIndoorTopics } from "./topics/select-indoor-topics.js";
import { selectSwaps } from "./topics/select-swaps.js";

export const GEMINI_DEFAULT_MODEL = "gemini-2.5-flash";
export { GEMINI_MAX_OUTPUT_TOKENS, GEMINI_TEMPERATURE, GEMINI_TIMEOUT_MS };
export type { InjectedFetch };

export type GeminiCallResult =
  { success: true; plan: GeneratedPlan } | { success: false; error: string };

const RETRY_DELAY_MS = 400;

export async function callGeminiPlan(
  factSheet: FactSheet,
  fetchFn: InjectedFetch = fetch
): Promise<GeminiCallResult> {
  const startTime = Date.now();
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return { success: false, error: "Missing GEMINI_API_KEY" };

  const primaryModel = process.env.GEMINI_MODEL || GEMINI_DEFAULT_MODEL;
  const fallbackModel = process.env.GEMINI_FALLBACK_MODEL;
  const { systemInstruction, userContent } = buildPlanPrompt(factSheet);

  const selectedTopics = {
    indoorAir: selectIndoorTopics(factSheet),
    swaps: selectSwaps(factSheet),
    goodHabits: selectGoodHabits(factSheet),
  };

  let lastValidPlan: GeneratedPlan | null = null;
  let attemptsCount = 0;

  for (let attempt = 0; attempt < 2; attempt++) {
    attemptsCount++;
    const isRetry = attempt === 1;
    const model =
      isRetry && fallbackModel && !lastValidPlan ? fallbackModel : primaryModel;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    let bodyContent = userContent;
    if (isRetry && lastValidPlan) {
      const repeats = findRepeatedAdvice(lastValidPlan);
      const banned = findBannedPhrases(lastValidPlan);
      const equip = findEquipmentViolations(lastValidPlan);
      bodyContent = buildCorrectionPrompt(userContent, repeats, banned, equip);
    }

    const requestBody = buildRequestBody(systemInstruction, bodyContent, model);
    const result = await fetchGemini(url, apiKey, requestBody, fetchFn);

    if (!result.ok) {
      const isRetryable =
        result.status === 429 ||
        (result.status && result.status >= 500) ||
        !result.status;
      if (attempt === 0 && isRetryable) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        continue;
      }
      break;
    }

    try {
      const parsedJson = JSON.parse(result.text!) as unknown;
      const processed = postProcessPlan(parsedJson, factSheet.isUnder18);
      const covered = enforceTopicCoverage(
        processed,
        selectedTopics,
        factSheet.isUnder18
      );
      lastValidPlan = covered;

      if (attempt === 0) {
        const repeats = findRepeatedAdvice(covered);
        const banned = findBannedPhrases(covered);
        const equip = findEquipmentViolations(covered);
        if (repeats.length > 0 || banned.length > 0 || equip.length > 0) {
          await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
          continue;
        }
      }
      break;
    } catch {
      if (attempt === 0) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        continue;
      }
      break;
    }
  }

  if (process.env.NODE_ENV !== "production") {
    console.log(
      `[plan-timing] durationMs=${Date.now() - startTime} attempts=${attemptsCount}`
    );
  }

  if (lastValidPlan) {
    const sanitized = sanitizeBannedActions(
      lastValidPlan,
      DEFAULT_SLOT_ACTIONS
    );
    return { success: true, plan: sanitized };
  }

  return { success: false, error: "Failed to generate plan after retry" };
}
