import type { FactSheet } from "./fact-sheet-types.js";
import { GEMINI_RESPONSE_SCHEMA } from "./gemini-schema-def.js";
import { type GeneratedPlan, postProcessPlan } from "./plan-schema.js";
import { buildPlanPrompt } from "./prompts/plan-prompt-v1.js";

export const GEMINI_DEFAULT_MODEL = "gemini-2.5-flash";
export const GEMINI_TIMEOUT_MS = 25000;
export const GEMINI_MAX_OUTPUT_TOKENS = 2048;
export const GEMINI_TEMPERATURE = 0.5;

export type GeminiCallResult =
  { success: true; plan: GeneratedPlan } | { success: false; error: string };

export type InjectedFetch = typeof fetch;

interface GeminiCandidate {
  content?: {
    parts?: Array<{ text?: string }>;
  };
}

interface GeminiApiResponse {
  candidates?: GeminiCandidate[];
}

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

  const requestBody = {
    system_instruction: {
      parts: [{ text: systemInstruction }],
    },
    contents: [
      {
        role: "user",
        parts: [{ text: userContent }],
      },
    ],
    generationConfig: {
      temperature: GEMINI_TEMPERATURE,
      maxOutputTokens: GEMINI_MAX_OUTPUT_TOKENS,
      responseMimeType: "application/json",
      responseSchema: GEMINI_RESPONSE_SCHEMA,
    },
  };

  for (let attempt = 0; attempt < 2; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

    try {
      const response = await fetchFn(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 429 || response.status >= 500) {
          if (attempt === 0) {
            await new Promise((r) => setTimeout(r, 400));
            continue;
          }
        }
        return { success: false, error: `Upstream error: ${response.status}` };
      }

      const json = (await response.json()) as GeminiApiResponse;
      const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText || typeof rawText !== "string") {
        if (attempt === 0) {
          await new Promise((r) => setTimeout(r, 400));
          continue;
        }
        return {
          success: false,
          error: "Empty or invalid response from Gemini",
        };
      }

      const parsedJson = JSON.parse(rawText) as unknown;
      const plan = postProcessPlan(parsedJson, factSheet.isUnder18);
      return { success: true, plan };
    } catch {
      clearTimeout(timeoutId);
      if (attempt === 0) {
        await new Promise((r) => setTimeout(r, 400));
        continue;
      }
      return {
        success: false,
        error: "Network error or invalid JSON from Gemini",
      };
    }
  }

  return { success: false, error: "Failed to generate plan after retry" };
}
