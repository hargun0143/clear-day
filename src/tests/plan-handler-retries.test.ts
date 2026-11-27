import { describe, expect, it } from "vitest";
import { processPlanRequest } from "../../api/plan.js";
import { EXAMPLE_PLAN } from "../../api/_lib/plan/example-plan.js";
import type { GeneratedPlan } from "../../api/_lib/plan/plan-schema.js";
import {
  createMockGeminiFetch,
  mockGeminiJson,
} from "./helpers/mock-gemini-fetch.js";

describe("POST /api/plan handler retries", () => {
  const validPayload = JSON.stringify({
    cityId: "delhi",
    aqi: { value: 150 },
    answers: {
      city: "delhi",
      role: "office-worker",
      age: "18-59",
      care: ["none"],
      mobility: "walk",
      "home-setup": ["none"],
      "role-habit": "ac-yes",
      budget: "under-1000",
    },
  });

  it("retries once when first response has repeated advice, accepts clean retry", async () => {
    process.env.GEMINI_API_KEY = "test-key";

    const planWithRepeat: GeneratedPlan = {
      ...EXAMPLE_PLAN,
      impact: [
        {
          factorId: "high-outdoor-hours",
          effect: "Keep windows closed during rush hours.",
        },
      ],
    };

    let callCount = 0;
    const mockFetch = createMockGeminiFetch(async () => {
      callCount++;
      return mockGeminiJson(callCount === 1 ? planWithRepeat : EXAMPLE_PLAN);
    });

    const res = await processPlanRequest("POST", validPayload, {
      fetchFn: mockFetch,
    });

    expect(res.status).toBe(200);
    const body = res.body as Record<string, unknown>;
    const meta = body.meta as Record<string, unknown>;
    expect(meta.isFallback).toBe(false);
    expect(callCount).toBe(2);
  });

  it("accepts the plan after repeat retry even if repeats remain (does not loop)", async () => {
    process.env.GEMINI_API_KEY = "test-key";

    const planWithRepeat: GeneratedPlan = {
      ...EXAMPLE_PLAN,
      impact: [
        {
          factorId: "high-outdoor-hours",
          effect: "Keep windows closed during rush hours.",
        },
      ],
    };

    let callCount = 0;
    const mockFetch = createMockGeminiFetch(async () => {
      callCount++;
      return mockGeminiJson(planWithRepeat);
    });

    const res = await processPlanRequest("POST", validPayload, {
      fetchFn: mockFetch,
    });

    expect(res.status).toBe(200);
    const body = res.body as Record<string, unknown>;
    const meta = body.meta as Record<string, unknown>;
    expect(meta.isFallback).toBe(false);
    expect(callCount).toBe(2);
  });
});
