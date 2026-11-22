import { describe, expect, it } from "vitest";
import { buildFactSheet } from "../../api/_lib/plan/build-fact-sheet.js";
import {
  buildPlanPrompt,
  PROMPT_VERSION,
} from "../../api/_lib/plan/prompts/plan-prompt-v1.js";
import type { QuestionnaireAnswers } from "../utils/questionnaire/types.js";

describe("plan-prompt-v1", () => {
  it("exports PROMPT_VERSION constant", () => {
    expect(PROMPT_VERSION).toBe("v1");
  });

  it("contains the AQI value, band, and guidance without free-text user fields", () => {
    const answers: QuestionnaireAnswers = {
      city: "bengaluru",
      role: "senior",
      age: "60-plus",
      care: ["none"],
      mobility: "mostly-indoors",
      "home-setup": ["cooler-or-fan"],
      "role-habit": "daily",
      budget: "nothing-diy-only",
    };
    const factSheet = buildFactSheet("bengaluru", { value: 75 }, answers);
    const { systemInstruction, userContent } = buildPlanPrompt(factSheet);

    expect(systemInstruction).toContain("Clear Day");
    expect(userContent).toContain("Bengaluru");
    expect(userContent).toContain("Satisfactory");
    expect(userContent).toContain('"aqiValue":75');
    // Ensure it strictly uses structured json facts, not arbitrary untyped input
    expect(userContent).toContain('"roleLabel":"Senior"');
  });

  it("includes under-18 safety instructions when isUnder18 is true", () => {
    const minorAnswers: QuestionnaireAnswers = {
      city: "delhi",
      role: "school-student",
      age: "under-18",
      care: ["none"],
      mobility: "walk",
      "home-setup": ["none"],
      "role-habit": "regularly",
    };
    const factSheet = buildFactSheet("delhi", { value: 240 }, minorAnswers);
    const { systemInstruction, userContent } = buildPlanPrompt(factSheet);

    expect(systemInstruction).toContain("isUnder18 is true");
    expect(systemInstruction).toContain(
      "lowEmissionChoices must be an empty array"
    );
    expect(userContent).toContain('"isUnder18":true');
  });
});
