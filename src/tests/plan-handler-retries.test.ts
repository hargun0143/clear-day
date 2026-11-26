import { describe, expect, it, vi } from "vitest";
import { processPlanRequest } from "../../api/plan.js";
import type { InjectedFetch } from "../../api/_lib/plan/call-gemini.js";
import { EXAMPLE_PLAN } from "../../api/_lib/plan/example-plan.js";
import type { GeneratedPlan } from "../../api/_lib/plan/plan-schema.js";

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
          choice: "Keep windows closed during rush hours.",
          effect: "Reduces indoor particulate load.",
        },
      ],
    };

    let callCount = 0;
    const mockFetch = vi.fn().mockImplementation(async () => {
      callCount++;
      const plan = callCount === 1 ? planWithRepeat : EXAMPLE_PLAN;
      return {
        ok: true,
        json: async () => ({
          candidates: [
            { content: { parts: [{ text: JSON.stringify(plan) }] } },
          ],
        }),
      };
    });

    const res = await processPlanRequest("POST", validPayload, {
      fetchFn: mockFetch as InjectedFetch,
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
          choice: "Keep windows closed during rush hours.",
          effect: "Reduces indoor particulate load.",
        },
      ],
    };

    let callCount = 0;
    const mockFetch = vi.fn().mockImplementation(async () => {
      callCount++;
      return {
        ok: true,
        json: async () => ({
          candidates: [
            { content: { parts: [{ text: JSON.stringify(planWithRepeat) }] } },
          ],
        }),
      };
    });

    const res = await processPlanRequest("POST", validPayload, {
      fetchFn: mockFetch as InjectedFetch,
    });

    expect(res.status).toBe(200);
    const body = res.body as Record<string, unknown>;
    const meta = body.meta as Record<string, unknown>;
    expect(meta.isFallback).toBe(false);
    expect(callCount).toBe(2);
  });
});
