import { describe, expect, it, vi } from "vitest";
import { buildFactSheet } from "../../api/_lib/plan/build-fact-sheet.js";
import { callGeminiPlan } from "../../api/_lib/plan/call-gemini.js";
import { EXAMPLE_PLAN } from "../../api/_lib/plan/example-plan.js";

describe("callGeminiPlan", () => {
  const factSheet = buildFactSheet(
    "delhi",
    { value: 150 },
    {
      city: "delhi",
      role: "school-student",
      age: "18-59",
      care: ["none"],
      mobility: "bus-or-metro",
      "home-setup": ["none"],
      "role-habit": "regularly",
      budget: "under-1000",
    }
  );

  it("fails if GEMINI_API_KEY is not set", async () => {
    const origKey = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;
    try {
      const res = await callGeminiPlan(factSheet);
      expect(res.success).toBe(false);
    } finally {
      process.env.GEMINI_API_KEY = origKey;
    }
  });

  it("succeeds on first 200 response and passes key in header only", async () => {
    process.env.GEMINI_API_KEY = "test-secret-key";

    let capturedUrl = "";
    let capturedHeaders: HeadersInit | undefined;

    const mockFetch = vi
      .fn()
      .mockImplementation(async (url: string, init?: RequestInit) => {
        capturedUrl = url;
        capturedHeaders = init?.headers;
        return {
          ok: true,
          json: async () => ({
            candidates: [
              {
                content: {
                  parts: [{ text: JSON.stringify(EXAMPLE_PLAN) }],
                },
              },
            ],
          }),
        };
      });

    const res = await callGeminiPlan(factSheet, mockFetch as any);
    expect(res.success).toBe(true);
    expect(capturedUrl).not.toContain("test-secret-key");
    const headers = capturedHeaders as Record<string, string>;
    expect(headers["x-goog-api-key"]).toBe("test-secret-key");
  });

  it("retries on 429 and succeeds on second attempt", async () => {
    process.env.GEMINI_API_KEY = "test-secret-key";
    let count = 0;

    const mockFetch = vi.fn().mockImplementation(async () => {
      count++;
      if (count === 1) {
        return { ok: false, status: 429 };
      }
      return {
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: JSON.stringify(EXAMPLE_PLAN) }],
              },
            },
          ],
        }),
      };
    });

    const res = await callGeminiPlan(factSheet, mockFetch as any);
    expect(res.success).toBe(true);
    expect(count).toBe(2);
  });

  it("returns failure when two consecutive attempts fail", async () => {
    process.env.GEMINI_API_KEY = "test-secret-key";
    const mockFetch = vi.fn().mockImplementation(async () => {
      return { ok: false, status: 500 };
    });

    const res = await callGeminiPlan(factSheet, mockFetch as any);
    expect(res.success).toBe(false);
  });
});
