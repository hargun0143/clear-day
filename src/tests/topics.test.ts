import { describe, expect, it } from "vitest";
import { buildFactSheet } from "../../api/_lib/plan/build-fact-sheet.js";
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

describe("topic selectors indoor and swaps", () => {
  it("smoker without purifier gets DIY and the smoking tip", () => {
    const sheet = buildFactSheet(
      "delhi",
      { value: 150 },
      {
        ...templateAnswers,
        "home-setup": ["indoor-smoking"],
        budget: "under-1000",
      }
    );
    const ids = selectIndoorTopics(sheet).map((t) => t.id);
    expect(ids).toContain("indoor-smoking");
    expect(ids).toContain("diy-filter");
    expect(ids).not.toContain("purifier-care");
  });

  it("purifier owner gets placement tip and no DIY", () => {
    const sheet = buildFactSheet(
      "delhi",
      { value: 150 },
      {
        ...templateAnswers,
        "home-setup": ["air-purifier"],
        budget: "nothing-diy-only",
      }
    );
    const ids = selectIndoorTopics(sheet).map((t) => t.id);
    expect(ids).toContain("purifier-care");
    expect(ids).not.toContain("diy-filter");
  });

  it("non-smoker gets no smoking tip", () => {
    const sheet = buildFactSheet(
      "delhi",
      { value: 150 },
      {
        ...templateAnswers,
        "home-setup": ["ac"],
      }
    );
    expect(selectIndoorTopics(sheet).map((t) => t.id)).not.toContain(
      "indoor-smoking"
    );
  });

  it("AC owner gets recirculation, others do not", () => {
    const withAC = buildFactSheet(
      "delhi",
      { value: 150 },
      { ...templateAnswers, "home-setup": ["ac"] }
    );
    expect(selectIndoorTopics(withAC).map((t) => t.id)).toContain(
      "ac-recirculation"
    );

    const withoutAC = buildFactSheet(
      "delhi",
      { value: 150 },
      { ...templateAnswers, "home-setup": ["none"] }
    );
    expect(selectIndoorTopics(withoutAC).map((t) => t.id)).not.toContain(
      "ac-recirculation"
    );
  });

  it("walkers and metro users do not get those swaps", () => {
    const walker = buildFactSheet(
      "delhi",
      { value: 150 },
      { ...templateAnswers, mobility: "walk" }
    );
    const walkerSwaps = selectSwaps(walker).map((t) => t.id);
    expect(walkerSwaps).not.toContain("walking-or-cycling");
    expect(walkerSwaps).toContain("never-burn-waste");

    const metroUser = buildFactSheet(
      "delhi",
      { value: 150 },
      { ...templateAnswers, mobility: "bus-or-metro" }
    );
    const metroSwaps = selectSwaps(metroUser).map((t) => t.id);
    expect(metroSwaps).not.toContain("public-transit");
    expect(metroSwaps).toContain("never-burn-waste");
  });

  it("biomass cooking gets the cleaner-fuel swap", () => {
    const sheet = buildFactSheet(
      "delhi",
      { value: 150 },
      {
        ...templateAnswers,
        role: "homemaker",
        mobility: "wood-coal-or-biomass",
      }
    );
    expect(selectSwaps(sheet).map((t) => t.id)).toContain(
      "cleaner-cooking-fuel"
    );
  });
});
