import { describe, expect, it } from "vitest";
import { processPlanRequest } from "../../api/plan.js";
import { EXAMPLE_PLAN } from "../../api/_lib/plan/example-plan.js";
import {
  createMockGeminiFetch,
  mockGeminiJson,
} from "./helpers/mock-gemini-fetch.js";

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
    const mockFetch = createMockGeminiFetch(async () =>
      mockGeminiJson(EXAMPLE_PLAN)
    );

    const res = await processPlanRequest("POST", validPayload, {
      fetchFn: mockFetch,
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
    const mockFetch = createMockGeminiFetch(async () => ({
      ok: false,
      status: 503,
    }));

    const res = await processPlanRequest("POST", validPayload, {
      fetchFn: mockFetch,
    });
    expect(res.status).toBe(200);
    const body = res.body as Record<string, unknown>;
    expect(body.plan).toEqual(EXAMPLE_PLAN);
    const meta = body.meta as Record<string, unknown>;
    expect(meta.isFallback).toBe(true);
    expect(JSON.stringify(body)).not.toContain("test-key");
  });
});
