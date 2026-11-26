import { describe, expect, it } from "vitest";
import { buildFactSheet } from "../../api/_lib/plan/build-fact-sheet.js";
import { selectGoodHabits } from "../../api/_lib/plan/topics/select-good-habits.js";
import { selectIndoorTopics } from "../../api/_lib/plan/topics/select-indoor-topics.js";
import { selectSwaps } from "../../api/_lib/plan/topics/select-swaps.js";
import type { QuestionnaireAnswers } from "../utils/questionnaire/types.js";

const templateAnswers: QuestionnaireAnswers = {
  city: "delhi",
  role: "office-worker",
  age: "18-59",
  care: ["none"],
  mobility: "car",
  "home-setup": ["none"],
  "role-habit": "ac-yes",
  budget: "under-1000",
};

describe("topic selectors habits and non-overlap", () => {
  it("under-18 gets DIY and no swaps", () => {
    const sheet = buildFactSheet(
      "delhi",
      { value: 150 },
      {
        ...templateAnswers,
        role: "school-student",
        age: "under-18",
        "home-setup": ["none"],
      }
    );
    expect(selectIndoorTopics(sheet).map((t) => t.id)).toContain("diy-filter");
    expect(selectSwaps(sheet)).toEqual([]);
  });

  it("selects positive good habits based on user facts", () => {
    const goodSheet = buildFactSheet(
      "delhi",
      { value: 150 },
      {
        ...templateAnswers,
        mobility: "bus-or-metro",
        "home-setup": ["air-purifier", "exhaust-or-chimney"],
      }
    );
    const habits = selectGoodHabits(goodSheet);
    expect(habits.length).toBeGreaterThan(0);
    expect(habits.length).toBeLessThanOrEqual(3);
    expect(
      habits.some(
        (h) =>
          h.text.includes("transit") ||
          h.text.includes("purifier") ||
          h.id.includes("transit") ||
          h.id.includes("purifier")
      )
    ).toBe(true);
  });

  it("ensures no topic id appears in two sections for any combination", () => {
    const testCases: QuestionnaireAnswers[] = [
      {
        ...templateAnswers,
        mobility: "walk",
        "home-setup": ["air-purifier", "ac"],
      },
      {
        ...templateAnswers,
        mobility: "bus-or-metro",
        "home-setup": ["indoor-smoking"],
      },
      {
        ...templateAnswers,
        role: "homemaker",
        mobility: "wood-coal-or-biomass",
        "home-setup": ["none"],
      },
      {
        ...templateAnswers,
        role: "school-student",
        age: "under-18",
        "home-setup": ["none"],
      },
    ];

    for (const answers of testCases) {
      const sheet = buildFactSheet("delhi", { value: 150 }, answers);
      const indoorIds = new Set(selectIndoorTopics(sheet).map((t) => t.id));
      const swapIds = new Set(selectSwaps(sheet).map((t) => t.id));

      for (const id of indoorIds) {
        expect(swapIds.has(id)).toBe(false);
      }
    }
  });
});
