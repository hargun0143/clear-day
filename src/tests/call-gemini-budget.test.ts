import { describe, expect, it, vi } from "vitest";
import { buildFactSheet } from "../../api/_lib/plan/build-fact-sheet.js";
import {
  callGeminiPlan,
  type InjectedFetch,
} from "../../api/_lib/plan/call-gemini.js";
import { EXAMPLE_PLAN } from "../../api/_lib/plan/example-plan.js";
import type { GeneratedPlan } from "../../api/_lib/plan/plan-schema.js";

describe("callGeminiPlan retry budget", () => {
  const factSheet = buildFactSheet(
    "delhi",
    { value: 150 },
    {
      city: "delhi",
      role: "office-worker",
      age: "18-59",
      care: ["none"],
      mobility: "walk",
      "home-setup": ["none"],
      "role-habit": "none",
      budget: "under-1000",
    }
  );

  it("never exceeds 2 attempts when plan has repeated advice", async () => {
    process.env.GEMINI_API_KEY = "test-secret-key";

    const planWithRepeat: GeneratedPlan = {
      ...EXAMPLE_PLAN,
      impact: [
        {
          factorId: "high-outdoor-hours",
          effect: "Keep windows closed during rush hours.",
        },
      ],
    };

    let attempts = 0;
    const mockFetch = vi.fn().mockImplementation(async () => {
      attempts++;
      return {
        ok: true,
        json: async () => ({
          candidates: [
            { content: { parts: [{ text: JSON.stringify(planWithRepeat) }] } },
          ],
        }),
      };
    });

    const res = await callGeminiPlan(factSheet, mockFetch as InjectedFetch);
    expect(res.success).toBe(true);
    expect(attempts).toBe(2);
  });

  it("never exceeds 2 attempts when plan contains banned phrases and sanitizes them", async () => {
    process.env.GEMINI_API_KEY = "test-secret-key";

    const planWithBanned: GeneratedPlan = {
      ...EXAMPLE_PLAN,
      dailyPlan: [
        {
          slot: "Morning",
          actions: [
            "Check local air quality before leaving home",
            "Take the quieter side street",
          ],
          why: "Avoid major traffic emissions.",
        },
        ...EXAMPLE_PLAN.dailyPlan.slice(1),
      ],
    };

    let attempts = 0;
    const mockFetch = vi.fn().mockImplementation(async () => {
      attempts++;
      return {
        ok: true,
        json: async () => ({
          candidates: [
            { content: { parts: [{ text: JSON.stringify(planWithBanned) }] } },
          ],
        }),
      };
    });

    const res = await callGeminiPlan(factSheet, mockFetch as InjectedFetch);
    expect(res.success).toBe(true);
    expect(attempts).toBe(2);
    if (res.success) {
      const morningActions = res.plan.dailyPlan[0]!.actions;
      expect(morningActions).not.toContain(
        "Check local air quality before leaving home"
      );
      expect(morningActions).toContain("Take the quieter side street");
    }
  });
});
