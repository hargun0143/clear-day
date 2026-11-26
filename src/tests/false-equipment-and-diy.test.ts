import { describe, expect, it } from "vitest";
import { buildFactSheet } from "../../api/_lib/plan/build-fact-sheet.js";
import { enforceTopicCoverage } from "../../api/_lib/plan/coverage-enforcer.js";
import { EXAMPLE_PLAN } from "../../api/_lib/plan/example-plan.js";
import { postProcessPlan } from "../../api/_lib/plan/post-process-plan.js";
import { INDOOR_TOPICS } from "../../api/_lib/plan/topics/indoor-topics-data.js";
import { selectGoodHabits } from "../../api/_lib/plan/topics/select-good-habits.js";
import { selectIndoorTopics } from "../../api/_lib/plan/topics/select-indoor-topics.js";
import type { QuestionnaireAnswers } from "../utils/questionnaire/types.js";

describe("false equipment claims, determinism, and DIY consistency", () => {
  const outdoorProfile: QuestionnaireAnswers = {
    city: "delhi",
    role: "outdoor-worker",
    age: "18-59",
    care: ["young-children"],
    mobility: "over-5",
    "home-setup": ["ac", "cooler-or-fan"],
    "role-habit": "regularly",
    budget: "nothing-diy-only",
  };

  it("never claims exhaust for AC/cooler-only home, selects DIY, and only expected habits", () => {
    const sheet = buildFactSheet("delhi", { value: 84 }, outdoorProfile);
    const topics = selectIndoorTopics(sheet);
    const habits = selectGoodHabits(sheet);

    expect(topics.map((t) => t.id)).not.toContain("exhaust-or-chimney");
    expect(topics.map((t) => t.id)).toContain("diy-filter");
    expect(topics.map((t) => t.id)).toContain("ac-recirculation");
    expect(habits.map((h) => h.id)).toEqual(["smoke-free-home"]);
  });

  it("is 100% deterministic across 20 runs for the same input", () => {
    const sheet = buildFactSheet("delhi", { value: 84 }, outdoorProfile);
    const firstTopics = selectIndoorTopics(sheet);
    const firstHabits = selectGoodHabits(sheet);

    for (let i = 0; i < 20; i++) {
      expect(selectIndoorTopics(sheet)).toEqual(firstTopics);
      expect(selectGoodHabits(sheet)).toEqual(firstHabits);
    }
  });

  it("gives AQI-appropriate cooking advice without mentioning exhaust when cooking has no exhaust", () => {
    const cookAnswers: QuestionnaireAnswers = {
      ...outdoorProfile,
      role: "homemaker",
      mobility: "wood-coal-or-biomass",
      "home-setup": ["none"],
    };

    const lowAqiTopics = selectIndoorTopics(
      buildFactSheet("delhi", { value: 84 }, cookAnswers)
    );
    expect(lowAqiTopics.map((t) => t.id)).toContain(
      "cooking-no-exhaust-low-aqi"
    );
    expect(lowAqiTopics.map((t) => t.id)).not.toContain("exhaust-or-chimney");

    const highAqiTopics = selectIndoorTopics(
      buildFactSheet("delhi", { value: 180 }, cookAnswers)
    );
    expect(highAqiTopics.map((t) => t.id)).toContain(
      "cooking-no-exhaust-high-aqi"
    );
    expect(highAqiTopics.map((t) => t.id)).not.toContain("exhaust-or-chimney");
  });

  it("forces diyFilter.include=true with full card and removes diy-filter from tips when selected", () => {
    const raw = {
      ...EXAMPLE_PLAN,
      indoorAir: {
        diyFilter: { include: false, materials: [], steps: [], safetyNote: "" },
        tips: [{ topicId: "diy-filter", text: "Build a box-fan filter." }],
      },
    };
    const processed = postProcessPlan(raw, false, true);
    const covered = enforceTopicCoverage(
      processed,
      {
        indoorAir: [
          INDOOR_TOPICS.find((t) => t.id === "wet-mopping")!,
          INDOOR_TOPICS.find((t) => t.id === "diy-filter")!,
        ],
        swaps: [],
        goodHabits: [],
      },
      false
    );

    expect(covered.indoorAir.diyFilter.include).toBe(true);
    expect(covered.indoorAir.diyFilter.materials.length).toBeGreaterThan(0);
    expect(covered.indoorAir.diyFilter.steps.length).toBeGreaterThan(0);
    expect(covered.indoorAir.diyFilter.safetyNote.length).toBeGreaterThan(0);
    expect(covered.indoorAir.tips.map((t) => t.topicId)).not.toContain(
      "diy-filter"
    );
  });

  it("forces diyFilter.include=false and strips all DIY text when not selected", () => {
    const processed = postProcessPlan(EXAMPLE_PLAN, false, false);
    const covered = enforceTopicCoverage(
      processed,
      {
        indoorAir: [INDOOR_TOPICS.find((t) => t.id === "wet-mopping")!],
        swaps: [],
        goodHabits: [],
      },
      false
    );

    expect(covered.indoorAir.diyFilter.include).toBe(false);
    expect(covered.indoorAir.diyFilter.materials).toEqual([]);
    expect(covered.indoorAir.diyFilter.steps).toEqual([]);
    expect(covered.indoorAir.diyFilter.safetyNote).toBe("");
    const tipsText = JSON.stringify(covered.indoorAir.tips).toLowerCase();
    expect(tipsText).not.toContain("diy");
    expect(tipsText).not.toContain("box-fan");
    expect(tipsText).not.toContain("merv");
  });
});
