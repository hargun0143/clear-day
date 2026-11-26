import { describe, expect, it } from "vitest";
import { enforceTopicCoverage } from "../../api/_lib/plan/coverage-enforcer.js";
import { EXAMPLE_PLAN } from "../../api/_lib/plan/example-plan.js";
import type { GeneratedPlan } from "../../api/_lib/plan/plan-schema.js";
import { INDOOR_TOPICS } from "../../api/_lib/plan/topics/indoor-topics-data.js";
import type { GoodHabitTopic } from "../../api/_lib/plan/topics/select-good-habits.js";
import { SWAP_TOPICS } from "../../api/_lib/plan/topics/swaps-topics-data.js";

describe("enforceTopicCoverage", () => {
  const selectedTopics = {
    indoorAir: [
      INDOOR_TOPICS.find((t) => t.id === "windows-closed")!,
      INDOOR_TOPICS.find((t) => t.id === "wet-mopping")!,
      INDOOR_TOPICS.find((t) => t.id === "indoor-smoking")!,
    ],
    swaps: [
      SWAP_TOPICS.find((t) => t.id === "public-transit")!,
      SWAP_TOPICS.find((t) => t.id === "avoid-idling")!,
    ],
    goodHabits: [
      { id: "public-transit", text: "Using public transit" },
      { id: "smoke-free-home", text: "Smoke-free home" },
    ] as readonly GoodHabitTopic[],
  };

  it("fills missing selected topics with vetted defaults in exact order", () => {
    const thinPlan: GeneratedPlan = {
      ...EXAMPLE_PLAN,
      indoorAir: {
        ...EXAMPLE_PLAN.indoorAir,
        tips: [{ topicId: "windows-closed", text: "Shut your windows tight" }],
      },
    };

    const result = enforceTopicCoverage(thinPlan, selectedTopics, false);

    expect(result.indoorAir.tips.length).toBe(3);
    expect(result.indoorAir.tips[0]!.topicId).toBe("windows-closed");
    expect(result.indoorAir.tips[0]!.text).toBe("Shut your windows tight");
    expect(result.indoorAir.tips[1]!.topicId).toBe("wet-mopping");
    expect(result.indoorAir.tips[2]!.topicId).toBe("indoor-smoking");
    expect(result.indoorAir.tips[2]!.text).toContain("Smoke outside");
  });

  it("drops unselected unknown topicIds", () => {
    const planWithUnknown: GeneratedPlan = {
      ...EXAMPLE_PLAN,
      indoorAir: {
        ...EXAMPLE_PLAN.indoorAir,
        tips: [
          { topicId: "unknown-cleaning-tip", text: "Burn incense sticks" },
          { topicId: "windows-closed", text: "Keep windows closed" },
        ],
      },
    };

    const result = enforceTopicCoverage(planWithUnknown, selectedTopics, false);

    const ids = result.indoorAir.tips.map((t) => t.topicId);
    expect(ids).not.toContain("unknown-cleaning-tip");
    expect(ids).toEqual(["windows-closed", "wet-mopping", "indoor-smoking"]);
  });

  it("ensures all selected good habits are present", () => {
    const planNoHabits: GeneratedPlan = {
      ...EXAMPLE_PLAN,
      goodHabits: [],
    };

    const result = enforceTopicCoverage(planNoHabits, selectedTopics, false);

    expect(result.goodHabits).toBeDefined();
    expect(result.goodHabits!.length).toBe(2);
    expect(result.goodHabits![0]!.topicId).toBe("public-transit");
    expect(result.goodHabits![1]!.topicId).toBe("smoke-free-home");
  });

  it("empties low emission choices for under-18 users", () => {
    const result = enforceTopicCoverage(EXAMPLE_PLAN, selectedTopics, true);
    expect(result.lowEmissionChoices).toEqual([]);
  });
});
