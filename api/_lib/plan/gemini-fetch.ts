import { GEMINI_RESPONSE_SCHEMA } from "./gemini-schema-def.js";

export const GEMINI_TIMEOUT_MS = 25000;
export const GEMINI_MAX_OUTPUT_TOKENS = 2048;
export const GEMINI_TEMPERATURE = 0.5;

export type InjectedFetch = typeof fetch;

interface GeminiCandidate {
  content?: {
    parts?: Array<{ text?: string }>;
  };
}

interface GeminiApiResponse {
  candidates?: GeminiCandidate[];
}

export function buildRequestBody(
  systemInstruction: string,
  userContent: string
): Record<string, unknown> {
  return {
    system_instruction: { parts: [{ text: systemInstruction }] },
    contents: [{ role: "user", parts: [{ text: userContent }] }],
    generationConfig: {
      temperature: GEMINI_TEMPERATURE,
      maxOutputTokens: GEMINI_MAX_OUTPUT_TOKENS,
      responseMimeType: "application/json",
      responseSchema: GEMINI_RESPONSE_SCHEMA,
    },
  };
}

export async function fetchGemini(
  url: string,
  apiKey: string,
  body: Record<string, unknown>,
  fetchFn: InjectedFetch
): Promise<{ ok: boolean; status?: number; text?: string }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);
  try {
    const response = await fetchFn(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) return { ok: false, status: response.status };
    const json = (await response.json()) as GeminiApiResponse;
    const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText || typeof rawText !== "string") return { ok: false };
    return { ok: true, text: rawText };
  } catch {
    clearTimeout(timeoutId);
    return { ok: false };
  }
}
