import { describe, expect, it, vi } from "vitest";
import { processPlanRequest } from "../../api/plan.js";
import type { InjectedFetch } from "../../api/_lib/plan/call-gemini.js";
import { EXAMPLE_PLAN } from "../../api/_lib/plan/example-plan.js";
import type { GeneratedPlan } from "../../api/_lib/plan/plan-schema.js";

describe("POST /api/plan handler logic", () => {
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

  it("returns 405 for non-POST method", async () => {
    const res = await processPlanRequest("GET", validPayload);
    expect(res.status).toBe(405);
  });

  it("returns 400 for empty or invalid JSON payload", async () => {
    const res = await processPlanRequest("POST", "invalid-json");
    expect(res.status).toBe(400);
  });

  it("returns 200 with generated plan on Gemini success", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    const mockFetch = vi.fn().mockImplementation(async () => ({
      ok: true,
      json: async () => ({
        candidates: [
          {
            content: { parts: [{ text: JSON.stringify(EXAMPLE_PLAN) }] },
          },
        ],
      }),
    }));

    const res = await processPlanRequest("POST", validPayload, {
      fetchFn: mockFetch as InjectedFetch,
    });
    expect(res.status).toBe(200);
    const body = res.body as Record<string, unknown>;
    expect(body.plan).toBeDefined();
    const meta = body.meta as Record<string, unknown>;
    expect(meta.isFallback).toBe(false);
    expect(JSON.stringify(body)).not.toContain("test-key");
  });

  it("returns fallback plan with isFallback true when Gemini fails", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    const mockFetch = vi.fn().mockImplementation(async () => ({
      ok: false,
      status: 503,
    }));

    const res = await processPlanRequest("POST", validPayload, {
      fetchFn: mockFetch as InjectedFetch,
    });
    expect(res.status).toBe(200);
    const body = res.body as Record<string, unknown>;
    expect(body.plan).toEqual(EXAMPLE_PLAN);
    const meta = body.meta as Record<string, unknown>;
    expect(meta.isFallback).toBe(true);
    expect(JSON.stringify(body)).not.toContain("test-key");
  });

  it("retries once when first response has repeated advice, accepts clean retry", async () => {
    process.env.GEMINI_API_KEY = "test-key";

    // Plan with an exact duplicate between indoorAir.tips and impact.choice
    const planWithRepeat: GeneratedPlan = {
      ...EXAMPLE_PLAN,
      indoorAir: {
        ...EXAMPLE_PLAN.indoorAir,
        tips: ["Keep windows closed during rush hours."],
      },
      impact: [
        {
          choice: "Keep windows closed during rush hours",
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
    // Must have called Gemini exactly twice (original + repeat-removal retry)
    expect(callCount).toBe(2);
  });

  it("accepts the plan after repeat retry even if repeats remain (does not loop)", async () => {
    process.env.GEMINI_API_KEY = "test-key";

    const planWithRepeat: GeneratedPlan = {
      ...EXAMPLE_PLAN,
      indoorAir: {
        ...EXAMPLE_PLAN.indoorAir,
        tips: ["Keep windows closed during rush hours."],
      },
      impact: [
        {
          choice: "Keep windows closed during rush hours",
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
    // Must NOT loop — exactly 2 total Gemini calls maximum
    expect(callCount).toBe(2);
  });
});
