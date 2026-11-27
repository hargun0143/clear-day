import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { buildFactSheet } from "../../api/_lib/plan/build-fact-sheet.js";
import {
  FACTOR_WEIGHTS,
  selectTopFactors,
} from "../../api/_lib/plan/topics/select-top-factors.js";
import { ImpactSection } from "@/components/plan/impact-section";
import { TOP_FACTOR_LABELS } from "@/constants/top-factors";
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

  it("prioritizes high outdoor hours for outdoor-worker over-5 and biomass cooking for homemaker", () => {
    const outdoorSheet = buildFactSheet(
      "patna",
      { value: 310 },
      {
        city: "patna",
        role: "outdoor-worker",
        age: "18-59",
        care: ["none"],
        mobility: "over-5",
        "home-setup": ["none"],
        "role-habit": "none",
        budget: "under-1000",
      }
    );
    expect(selectTopFactors(outdoorSheet)).toEqual(["high-outdoor-hours"]);

    const homemakerSheet = buildFactSheet(
      "patna",
      { value: 310 },
      {
        city: "patna",
        role: "homemaker",
        age: "18-59",
        care: ["none"],
        mobility: "wood-coal-or-biomass",
        "home-setup": ["none"],
        "role-habit": "dry-sweep",
        budget: "under-1000",
      }
    );
    expect(selectTopFactors(homemakerSheet)).toEqual([
      "biomass-cooking",
      "no-exhaust-cooking",
    ]);
  });

  it("maps every factor id in FACTOR_WEIGHTS and renders plain labels in UI", () => {
    for (const factor of FACTOR_WEIGHTS) {
      expect(TOP_FACTOR_LABELS[factor.id]).toBeDefined();
      expect(TOP_FACTOR_LABELS[factor.id]!.length).toBeGreaterThan(0);
    }
    const html = renderToStaticMarkup(
      <ImpactSection
        impact={[
          { factorId: "high-outdoor-hours", effect: "Lowers peak intake." },
          {
            factorId: "no-purifier-with-care",
            effect: "Adds indoor protection.",
          },
        ]}
      />
    );
    expect(html).toContain("Long hours outdoors");
    expect(html).toContain(
      "No air purifier with children or older adults at home"
    );
    expect(html).not.toContain("high-outdoor-hours");
    expect(html).not.toContain("no-purifier-with-care");
  });
});
