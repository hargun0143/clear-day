import { describe, expect, it } from "vitest";
import { buildFactSheet } from "../../api/_lib/plan/build-fact-sheet.js";
import { selectGoodHabits } from "../../api/_lib/plan/topics/select-good-habits.js";
import { selectSwaps } from "../../api/_lib/plan/topics/select-swaps.js";
import { selectTopFactors } from "../../api/_lib/plan/topics/select-top-factors.js";
import { TOP_FACTOR_LABELS } from "@/constants/top-factors";
import type { QuestionnaireAnswers } from "@/utils/questionnaire/types";

const base: QuestionnaireAnswers = {
  city: "delhi",
  role: "office-worker",
  age: "18-59",
  care: ["none"],
  "home-setup": ["indoor-smoking"],
  "role-habit": "none",
  budget: "under-1000",
};

describe("habits, swaps, and top factors per mobility", () => {
  it("walk and bicycle get walk-or-cycle habit and only never-burn-waste swap", () => {
    for (const mobility of ["walk", "bicycle"]) {
      const sheet = buildFactSheet(
        "delhi",
        { value: 150 },
        { ...base, mobility }
      );
      expect(selectGoodHabits(sheet).map((h) => h.id)).toEqual([
        "walk-or-cycle",
      ]);
      expect(selectSwaps(sheet).map((s) => s.id)).toEqual(["never-burn-waste"]);
      expect(selectTopFactors(sheet)).not.toContain("car-or-two-wheeler");
    }
  });

  it("bus-or-metro gets public-transit habit and neither transit nor walk swaps", () => {
    const sheet = buildFactSheet(
      "delhi",
      { value: 150 },
      { ...base, mobility: "bus-or-metro" }
    );
    expect(selectGoodHabits(sheet).map((h) => h.id)).toEqual([
      "public-transit",
    ]);
    expect(selectSwaps(sheet).map((s) => s.id)).toEqual(["never-burn-waste"]);
    expect(selectTopFactors(sheet)).not.toContain("car-or-two-wheeler");
  });

  it("motorised commutes get walk, transit, and avoid-idling swaps and motorised top factor", () => {
    expect(TOP_FACTOR_LABELS["car-or-two-wheeler"]).toBe(
      "Motorised commute (car, bike or auto)"
    );
    for (const mobility of ["car", "auto-or-cab", "motorbike-or-scooter"]) {
      const sheet = buildFactSheet(
        "delhi",
        { value: 150 },
        { ...base, mobility }
      );
      expect(selectGoodHabits(sheet)).toEqual([]);
      expect(selectSwaps(sheet).map((s) => s.id)).toEqual([
        "walking-or-cycling",
        "public-transit",
        "avoid-idling",
      ]);
      expect(selectTopFactors(sheet)).toContain("car-or-two-wheeler");
    }
  });

  it("mostly-indoors gets mostly-indoors habit and only never-burn-waste swap", () => {
    const sheet = buildFactSheet(
      "delhi",
      { value: 150 },
      { ...base, mobility: "mostly-indoors" }
    );
    expect(selectGoodHabits(sheet).map((h) => h.id)).toEqual([
      "mostly-indoors",
    ]);
    expect(selectSwaps(sheet).map((s) => s.id)).toEqual(["never-burn-waste"]);
  });
});
