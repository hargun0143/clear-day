import { describe, expect, it } from "vitest";
import { buildFactSheet } from "../../api/_lib/plan/build-fact-sheet.js";
import {
  buildPlanPrompt,
  FORBIDDEN_IN_DAILY_PLAN,
  PROMPT_VERSION,
} from "../../api/_lib/plan/prompts/plan-prompt.js";
import type { QuestionnaireAnswers } from "../utils/questionnaire/types.js";

const baseAnswers: QuestionnaireAnswers = {
  city: "bengaluru",
  role: "senior",
  age: "60-plus",
  care: ["none"],
  mobility: "mostly-indoors",
  "home-setup": ["cooler-or-fan"],
  "role-habit": "daily",
  budget: "nothing-diy-only",
};

describe("plan-prompt v3", () => {
  it('exports PROMPT_VERSION as "v3"', () => {
    expect(PROMPT_VERSION).toBe("v3");
  });

  it("contains the AQI value, band, and guidance without free-text user fields", () => {
    const factSheet = buildFactSheet("bengaluru", { value: 75 }, baseAnswers);
    const { userContent } = buildPlanPrompt(factSheet);

    expect(userContent).toContain("Bengaluru");
    expect(userContent).toContain("Satisfactory");
    expect(userContent).toContain('"aqiValue":75');
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

    expect(systemInstruction).toContain("Empty if under-18");
    expect(userContent).toContain('"isUnder18":true');
  });

  it("never uses clinical words like 'vulnerable home'", () => {
    const factSheet = buildFactSheet("delhi", { value: 250 }, baseAnswers);
    const { systemInstruction } = buildPlanPrompt(factSheet);

    expect(systemInstruction).toContain(
      'Never use the words "vulnerable home"'
    );
    expect(systemInstruction).toContain("Describe household members by label");
  });

  it("mentions equipment only if fact sheet says person has it", () => {
    const factSheet = buildFactSheet("delhi", { value: 150 }, baseAnswers);
    const { systemInstruction } = buildPlanPrompt(factSheet);

    expect(systemInstruction).toContain(
      "Mention a piece of equipment (purifier, AC, chimney) ONLY if the fact sheet says the person has it"
    );
  });

  it("contains the list of forbidden topics in daily plan", () => {
    const factSheet = buildFactSheet("delhi", { value: 150 }, baseAnswers);
    const { systemInstruction, userContent } = buildPlanPrompt(factSheet);

    expect(systemInstruction).toContain("FORBIDDEN IN DAILY PLAN");
    expect(systemInstruction).toContain(
      "Do NOT include home-setup or cleaning tips"
    );
    expect(userContent).toContain('"forbiddenInDailyPlan"');
    expect(FORBIDDEN_IN_DAILY_PLAN).toContain("wet-mopping");
    expect(FORBIDDEN_IN_DAILY_PLAN).toContain("windows-closed");
  });

  it("includes selectedTopics for indoorAir, swaps, and goodHabits", () => {
    const factSheet = buildFactSheet("delhi", { value: 150 }, baseAnswers);
    const { userContent } = buildPlanPrompt(factSheet);

    expect(userContent).toContain('"selectedTopics"');
    expect(userContent).toContain('"indoorAir"');
    expect(userContent).toContain('"swaps"');
    expect(userContent).toContain('"goodHabits"');
  });

  it("forbids instructing user to check local air quality reports", () => {
    const factSheet = buildFactSheet("delhi", { value: 150 }, baseAnswers);
    const { systemInstruction } = buildPlanPrompt(factSheet);

    expect(systemInstruction).toContain(
      'Never say "check local air quality reports"'
    );
  });
});
