import { describe, expect, it } from "vitest";
import { buildFactSheet } from "../../api/_lib/plan/build-fact-sheet.js";
import type { QuestionnaireAnswers } from "../utils/questionnaire/types.js";

describe("buildFactSheet", () => {
  const baseAnswers: QuestionnaireAnswers = {
    city: "delhi",
    role: "office-worker",
    age: "18-59",
    care: ["young-children"],
    mobility: "bus-or-metro",
    "home-setup": ["ac", "air-purifier"],
    "role-habit": "ac-yes",
    budget: "under-1000",
  };

  it("builds a complete FactSheet with human-readable labels", () => {
    const sheet = buildFactSheet("delhi", { value: 220 }, baseAnswers);
    expect(sheet.cityName).toBe("Delhi");
    expect(sheet.aqiValue).toBe(220);
    expect(sheet.aqiBandLabel).toBe("Poor");
    expect(sheet.isUnder18).toBe(false);
    expect(sheet.vulnerableHome).toBe(true);
    expect(sheet.hasPurifier).toBe(true);
    expect(sheet.hasAC).toBe(true);
    expect(sheet.hasExhaust).toBe(false);
    expect(sheet.roleLabel).toBe("Office worker");
    expect(sheet.mobilityLabel).toBe("Bus or metro");
    expect(sheet.budgetLabel).toBe("Under ₹1,000");
  });

  it("sets under-18 flags properly and sets budgetLabel to null", () => {
    const under18Answers: QuestionnaireAnswers = {
      ...baseAnswers,
      role: "school-student",
      age: "under-18",
    };
    const sheet = buildFactSheet("delhi", { value: 120 }, under18Answers);
    expect(sheet.isUnder18).toBe(true);
    expect(sheet.budgetLabel).toBeNull();
  });

  it("sets highOutdoorHours flag for outdoor worker with over-5 hours", () => {
    const outdoorAnswers: QuestionnaireAnswers = {
      ...baseAnswers,
      role: "outdoor-worker",
      mobility: "over-5",
    };
    const sheet = buildFactSheet("mumbai", { value: 140 }, outdoorAnswers);
    expect(sheet.highOutdoorHours).toBe(true);
    expect(sheet.cookingWithBiomass).toBe(false);
  });

  it("sets cookingWithBiomass flag for homemaker", () => {
    const homemakerAnswers: QuestionnaireAnswers = {
      ...baseAnswers,
      role: "homemaker",
      mobility: "wood-coal-or-biomass",
    };
    const sheet = buildFactSheet("kolkata", { value: 80 }, homemakerAnswers);
    expect(sheet.cookingWithBiomass).toBe(true);
    expect(sheet.highOutdoorHours).toBe(false);
  });

  it("rejects non-integer, negative, or over-500 aqi values", () => {
    expect(() => buildFactSheet("delhi", { value: -5 }, baseAnswers)).toThrow();
    expect(() =>
      buildFactSheet("delhi", { value: 505 }, baseAnswers)
    ).toThrow();
    expect(() =>
      buildFactSheet("delhi", { value: 120.5 }, baseAnswers)
    ).toThrow();
  });
});
