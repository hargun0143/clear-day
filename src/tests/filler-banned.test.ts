import { describe, expect, it } from "vitest";
import { hasBannedPhrase } from "../../api/_lib/plan/banned-phrases.js";
import { buildFactSheet } from "../../api/_lib/plan/build-fact-sheet.js";
import { buildPlanPrompt } from "../../api/_lib/plan/prompts/plan-prompt.js";
import type { QuestionnaireAnswers } from "../utils/questionnaire/types.js";

describe("filler banned phrases and night prompt rule", () => {
  it("flags hydration, generic rest, and next-day prep filler phrases", () => {
    expect(hasBannedPhrase("Drink water and stay hydrated today")).toBe(true);
    expect(hasBannedPhrase("Focus on hydration throughout the day")).toBe(true);
    expect(hasBannedPhrase("Rest well overnight to recover")).toBe(true);
    expect(
      hasBannedPhrase("Organise items for the next day for a smooth morning")
    ).toBe(true);
    expect(hasBannedPhrase("Keep bedroom doors closed at night")).toBe(false);
  });

  it("includes filler ban and night sleeping-environment rule in prompt", () => {
    const answers: QuestionnaireAnswers = {
      city: "delhi",
      role: "office-worker",
      age: "18-59",
      care: ["none"],
      mobility: "car",
      "home-setup": ["none"],
      "role-habit": "none",
      budget: "under-1000",
    };
    const sheet = buildFactSheet("delhi", { value: 150 }, answers);
    const { systemInstruction } = buildPlanPrompt(sheet);
    expect(systemInstruction).toContain("hydration or drinking water");
    expect(systemInstruction).toContain("sleeping environment or home air");
  });
});
