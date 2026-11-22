import { describe, expect, it, vi } from "vitest";
import { processPlanRequest } from "../../api/plan.js";
import { EXAMPLE_PLAN } from "../../api/_lib/plan/example-plan.js";

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
      fetchFn: mockFetch as any,
    });
    expect(res.status).toBe(200);
    const body = res.body as any;
    expect(body.plan).toBeDefined();
    expect(body.meta.isFallback).toBe(false);
    expect(JSON.stringify(body)).not.toContain("test-key");
  });

  it("returns fallback plan with isFallback true when Gemini fails", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    const mockFetch = vi.fn().mockImplementation(async () => ({
      ok: false,
      status: 503,
    }));

    const res = await processPlanRequest("POST", validPayload, {
      fetchFn: mockFetch as any,
    });
    expect(res.status).toBe(200);
    const body = res.body as any;
    expect(body.plan).toEqual(EXAMPLE_PLAN);
    expect(body.meta.isFallback).toBe(true);
    expect(JSON.stringify(body)).not.toContain("test-key");
  });
});
