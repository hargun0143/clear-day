import { describe, expect, it } from "vitest";
import { buildFactSheet } from "../../api/_lib/plan/build-fact-sheet.js";
import type { QuestionnaireAnswers } from "../utils/questionnaire/types.js";

describe("buildFactSheet home-setup options", () => {
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

  it("tests each home-setup option on its own and none", () => {
    const purifierOnly = buildFactSheet(
      "delhi",
      { value: 150 },
      { ...baseAnswers, "home-setup": ["air-purifier"] }
    );
    expect(purifierOnly.hasPurifier).toBe(true);
    expect(purifierOnly.hasAC).toBe(false);
    expect(purifierOnly.indoorSmoking).toBe(false);
    expect(purifierOnly.hasExhaust).toBe(false);

    const acOnly = buildFactSheet(
      "delhi",
      { value: 150 },
      { ...baseAnswers, "home-setup": ["ac"] }
    );
    expect(acOnly.hasPurifier).toBe(false);
    expect(acOnly.hasAC).toBe(true);
    expect(acOnly.indoorSmoking).toBe(false);

    const exhaustOnly = buildFactSheet(
      "delhi",
      { value: 150 },
      { ...baseAnswers, "home-setup": ["exhaust-or-chimney"] }
    );
    expect(exhaustOnly.hasExhaust).toBe(true);
    expect(exhaustOnly.hasPurifier).toBe(false);

    const smokingOnly = buildFactSheet(
      "delhi",
      { value: 150 },
      { ...baseAnswers, "home-setup": ["indoor-smoking"] }
    );
    expect(smokingOnly.indoorSmoking).toBe(true);
    expect(smokingOnly.hasPurifier).toBe(false);

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
});
