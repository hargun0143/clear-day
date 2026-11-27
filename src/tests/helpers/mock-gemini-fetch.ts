import { vi } from "vitest";
import type { InjectedFetch } from "../../../api/_lib/plan/call-gemini.js";

export function mockGeminiJson(plan: unknown) {
  return {
    ok: true,
    json: async () => ({
      candidates: [{ content: { parts: [{ text: JSON.stringify(plan) }] } }],
    }),
  };
}

export function createMockGeminiFetch(
  impl: (url: string, init?: RequestInit) => Promise<unknown>
): InjectedFetch {
  return vi.fn().mockImplementation(impl) as unknown as InjectedFetch;
}
