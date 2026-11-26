import { describe, expect, it } from "vitest";
import { buildFactSheet } from "../../api/_lib/plan/build-fact-sheet.js";
import { selectTopFactors } from "../../api/_lib/plan/topics/select-top-factors.js";
import type { QuestionnaireAnswers } from "../utils/questionnaire/types.js";

describe("selectTopFactors", () => {
  it("selects correct factors for a smoker car commuter without purifier", () => {
    const answers: QuestionnaireAnswers = {
      city: "delhi",
      role: "office-worker",
      age: "18-59",
      care: ["elderly"],
      mobility: "car",
      "home-setup": ["indoor-smoking"],
      "role-habit": "daily",
      budget: "1000-to-5000",
    };

    const sheet = buildFactSheet("delhi", { value: 250 }, answers);
    const factors = selectTopFactors(sheet);

    expect(factors).toContain("indoor-smoking");
    expect(factors).toContain("car-or-two-wheeler");
    expect(factors).toContain("no-purifier-with-care");
    expect(factors[0]).toBe("indoor-smoking");
    expect(factors[1]).toBe("car-or-two-wheeler");
    expect(factors[2]).toBe("no-purifier-with-care");
  });

  it("returns empty array for purifier owner on metro with no extra exposure factors", () => {
    const answers: QuestionnaireAnswers = {
      city: "delhi",
      role: "office-worker",
      age: "18-59",
      care: ["none"],
      mobility: "bus-or-metro",
      "home-setup": ["air-purifier", "exhaust-or-chimney"],
      "role-habit": "none",
      budget: "above-5000",
    };

    const sheet = buildFactSheet("delhi", { value: 120 }, answers);
    const factors = selectTopFactors(sheet);

    expect(factors).toEqual([]);
  });

  it("prioritizes high outdoor hours and biomass cooking according to weight table", () => {
    const answers: QuestionnaireAnswers = {
      city: "patna",
      role: "outdoor-worker",
      age: "18-59",
      care: ["none"],
      mobility: "wood-coal-or-biomass",
      "home-setup": ["none"],
      "role-habit": "regularly",
      budget: "under-1000",
    };

    const sheet = buildFactSheet("patna", { value: 310 }, answers);
    const factors = selectTopFactors(sheet);

    expect(factors).toContain("high-outdoor-hours");
    expect(factors).toContain("biomass-cooking");
    expect(factors).toContain("no-exhaust-cooking");
    expect(factors[0]).toBe("high-outdoor-hours");
    expect(factors[1]).toBe("biomass-cooking");
  });
});
