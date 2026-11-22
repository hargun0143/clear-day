import type { IncomingMessage, ServerResponse } from "node:http";
import { readRequestBody } from "./_lib/plan/body-reader.js";
import { buildFactSheet } from "./_lib/plan/build-fact-sheet.js";
import {
  callGeminiPlan,
  GEMINI_DEFAULT_MODEL,
  type InjectedFetch,
} from "./_lib/plan/call-gemini.js";
import { EXAMPLE_PLAN } from "./_lib/plan/example-plan.js";
import type {
  PlanHandlerResult,
  PlanRequestPayload,
} from "./_lib/plan/handler-types.js";
import { PROMPT_VERSION } from "./_lib/plan/prompts/plan-prompt-v1.js";

export async function processPlanRequest(
  method: string | undefined,
  rawBody: string | undefined,
  options: { fetchFn?: InjectedFetch; now?: Date } = {}
): Promise<PlanHandlerResult> {
  const headers = { "Content-Type": "application/json" };
  const now = options.now ?? new Date();

  if (method !== "POST") {
    return { status: 405, headers, body: { error: "Method not allowed" } };
  }
  if (!rawBody) {
    return { status: 400, headers, body: { error: "Payload empty" } };
  }

  let payload: PlanRequestPayload;
  try {
    payload = JSON.parse(rawBody) as PlanRequestPayload;
  } catch {
    return { status: 400, headers, body: { error: "Invalid JSON" } };
  }

  const { cityId, aqi, answers } = payload ?? {};
  if (!cityId || !aqi || !answers || typeof answers !== "object") {
    return { status: 400, headers, body: { error: "Missing required fields" } };
  }

  let factSheet;
  try {
    factSheet = buildFactSheet(cityId, aqi, answers);
  } catch {
    return { status: 400, headers, body: { error: "Invalid parameters" } };
  }

  const model = process.env.GEMINI_MODEL || GEMINI_DEFAULT_MODEL;
  const geminiRes = await callGeminiPlan(factSheet, options.fetchFn);

  const plan = geminiRes.success ? geminiRes.plan : EXAMPLE_PLAN;
  const isFallback = !geminiRes.success;

  return {
    status: 200,
    headers,
    body: {
      plan,
      meta: {
        promptVersion: PROMPT_VERSION,
        model,
        generatedAt: now.toISOString(),
        isFallback,
      },
    },
  };
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const readRes = await readRequestBody(req);
  if (!readRes.ok) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: readRes.error }));
    return;
  }

  const result = await processPlanRequest(req.method, readRes.body);
  res.statusCode = result.status;
  for (const [key, val] of Object.entries(result.headers)) {
    res.setHeader(key, val);
  }
  res.end(JSON.stringify(result.body));
}
