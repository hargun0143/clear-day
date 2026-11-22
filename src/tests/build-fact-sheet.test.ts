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

  it("tests each home-setup option on its own and none", () => {
    // 1. air-purifier on its own
    const purifierOnly = buildFactSheet(
      "delhi",
      { value: 150 },
      { ...baseAnswers, "home-setup": ["air-purifier"] }
    );
    expect(purifierOnly.hasPurifier).toBe(true);
    expect(purifierOnly.hasAC).toBe(false);
    expect(purifierOnly.indoorSmoking).toBe(false);
    expect(purifierOnly.hasExhaust).toBe(false);

    // 2. ac on its own
    const acOnly = buildFactSheet(
      "delhi",
      { value: 150 },
      { ...baseAnswers, "home-setup": ["ac"] }
    );
    expect(acOnly.hasPurifier).toBe(false);
    expect(acOnly.hasAC).toBe(true);
    expect(acOnly.indoorSmoking).toBe(false);
    expect(acOnly.hasExhaust).toBe(false);

    // 3. cooler-or-fan on its own
    const coolerOnly = buildFactSheet(
      "delhi",
      { value: 150 },
      { ...baseAnswers, "home-setup": ["cooler-or-fan"] }
    );
    expect(coolerOnly.hasPurifier).toBe(false);
    expect(coolerOnly.hasAC).toBe(false);
    expect(coolerOnly.indoorSmoking).toBe(false);
    expect(coolerOnly.hasExhaust).toBe(false);

    // 4. exhaust-or-chimney on its own
    const exhaustOnly = buildFactSheet(
      "delhi",
      { value: 150 },
      { ...baseAnswers, "home-setup": ["exhaust-or-chimney"] }
    );
    expect(exhaustOnly.hasPurifier).toBe(false);
    expect(exhaustOnly.hasAC).toBe(false);
    expect(exhaustOnly.indoorSmoking).toBe(false);
    expect(exhaustOnly.hasExhaust).toBe(true);

    // 5. indoor-smoking on its own
    const smokingOnly = buildFactSheet(
      "delhi",
      { value: 150 },
      { ...baseAnswers, "home-setup": ["indoor-smoking"] }
    );
    expect(smokingOnly.hasPurifier).toBe(false);
    expect(smokingOnly.hasAC).toBe(false);
    expect(smokingOnly.indoorSmoking).toBe(true);
    expect(smokingOnly.hasExhaust).toBe(false);

    // 6. none sets all of them false
    const noneOnly = buildFactSheet(
      "delhi",
      { value: 150 },
      { ...baseAnswers, "home-setup": ["none"] }
    );
    expect(noneOnly.hasPurifier).toBe(false);
    expect(noneOnly.hasAC).toBe(false);
    expect(noneOnly.indoorSmoking).toBe(false);
    expect(noneOnly.hasExhaust).toBe(false);
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
