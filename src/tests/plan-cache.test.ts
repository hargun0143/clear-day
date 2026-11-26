import { beforeEach, describe, expect, it, vi } from "vitest";
import { EXAMPLE_PLAN } from "../../api/_lib/plan/example-plan.js";
import {
  clearPlanCache,
  getPlanCacheSize,
  requestPlan,
  type PlanRequestPayload,
} from "../services/plan-client.js";

describe("plan-client in-memory cache", () => {
  beforeEach(() => {
    clearPlanCache();
    vi.restoreAllMocks();
  });

  const basePayload: PlanRequestPayload = {
    cityId: "delhi",
    aqi: { value: 150 },
    answers: {
      city: "delhi",
      role: "office-worker",
      age: "18-59",
      care: ["none"],
      mobility: "walk",
      "home-setup": ["none"],
      "role-habit": "none",
      budget: "under-1000",
    },
  };

  it("caches successful plan and returns it on second call without fetching", async () => {
    const mockSuccessResponse = {
      plan: EXAMPLE_PLAN,
      meta: {
        promptVersion: "v3.1",
        model: "gemini-2.5-flash",
        generatedAt: new Date().toISOString(),
        isFallback: false,
      },
    };

    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockSuccessResponse,
    });
    vi.stubGlobal("fetch", fetchSpy);

    const firstRes = await requestPlan(basePayload);
    expect(firstRes.meta.isFallback).toBe(false);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(getPlanCacheSize()).toBe(1);

    const secondRes = await requestPlan(basePayload);
    expect(secondRes).toEqual(firstRes);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("does not cache fallback plan", async () => {
    const mockFallbackResponse = {
      plan: EXAMPLE_PLAN,
      meta: {
        promptVersion: "v3.1",
        model: "gemini-2.5-flash",
        generatedAt: new Date().toISOString(),
        isFallback: true,
      },
    };

    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockFallbackResponse,
    });
    vi.stubGlobal("fetch", fetchSpy);

    const firstRes = await requestPlan(basePayload);
    expect(firstRes.meta.isFallback).toBe(true);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(getPlanCacheSize()).toBe(0);

    await requestPlan(basePayload);
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });
});
