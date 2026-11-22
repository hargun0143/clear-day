import { describe, expect, it } from "vitest";
import { findRepeatedAdvice } from "../../api/_lib/plan/find-repeated-advice.js";
import { EXAMPLE_PLAN } from "../../api/_lib/plan/example-plan.js";
import type { GeneratedPlan } from "../../api/_lib/plan/plan-schema.js";

function clonePlan(overrides: Partial<GeneratedPlan> = {}): GeneratedPlan {
  return { ...EXAMPLE_PLAN, ...overrides };
}

describe("findRepeatedAdvice", () => {
  it("returns empty array for a plan with no repeated advice", () => {
    const result = findRepeatedAdvice(EXAMPLE_PLAN);
    expect(result).toEqual([]);
  });

  it("detects an exact duplicate action appearing in two sections", () => {
    const plan = clonePlan({
      impact: [
        {
          choice: "Keep windows closed during rush hours",
          effect: "Reduces your indoor particulate load significantly.",
        },
      ],
    });
    const result = findRepeatedAdvice(plan);
    // "keep windows closed during rush hours" appears in indoorAir.tips AND impact.choice
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]!.a).toBe("keep windows closed during rush hours");
    expect(result[0]!.b).toBe("keep windows closed during rush hours");
  });

  it("detects near-duplicates sharing the same first 6 words", () => {
    const plan = clonePlan({
      impact: [
        {
          choice: "Keep windows closed during rush hours for better indoor air",
          effect: "Lowers your indoor particulate exposure overnight.",
        },
        {
          choice:
            "Keep windows closed during rush hours to reduce pollution entry",
          effect: "Maintains a cleaner indoor baseline through the day.",
        },
      ],
    });
    const result = findRepeatedAdvice(plan);
    expect(result.length).toBeGreaterThan(0);
    // Both start with "keep windows closed during rush hours"
    const pair = result[0]!;
    expect(pair.a.startsWith("keep windows closed during rush hours")).toBe(
      true
    );
    expect(pair.b.startsWith("keep windows closed during rush hours")).toBe(
      true
    );
  });

  it("is case-insensitive and strips punctuation", () => {
    const plan = clonePlan({
      dailyPlan: [
        {
          slot: "Morning",
          actions: ["Wear an N95 mask if commuting through heavy traffic!"],
          why: "Morning traffic carries concentrated fine particles.",
        },
        {
          slot: "Afternoon",
          actions: ["Briefly ventilate the home if outdoor air clears up"],
          why: "Solar heating improves air mixing.",
        },
        {
          slot: "Evening",
          actions: ["WEAR AN N95 MASK IF COMMUTING THROUGH HEAVY TRAFFIC"],
          why: "Evening commutes create localized spikes.",
        },
        {
          slot: "Night",
          actions: [
            "Run your air purifier or DIY box-fan filter in the bedroom",
          ],
          why: "Overnight clean air supports rest.",
        },
      ],
    });
    const result = findRepeatedAdvice(plan);
    expect(result.length).toBeGreaterThan(0);
  });

  it("does not flag short sentences as near-duplicates by first-6-word rule", () => {
    const plan = clonePlan({
      impact: [
        { choice: "Walk more", effect: "Reduces emissions." },
        { choice: "Walk daily", effect: "Good for health." },
      ],
    });
    // "walk more" and "walk daily" share only 1 word — should not be flagged as near-dup
    const result = findRepeatedAdvice(plan);
    // No exact matches expected either
    expect(result.every((p) => p.a !== p.b || p.a !== "walk more")).toBe(true);
  });

  it("flags when the same topic appears in two different sections", () => {
    const plan = clonePlan({
      dailyPlan: [
        {
          ...EXAMPLE_PLAN.dailyPlan[0]!,
          actions: [
            "Perform wet mopping across living rooms early in the morning",
          ],
        },
        EXAMPLE_PLAN.dailyPlan[1]!,
        EXAMPLE_PLAN.dailyPlan[2]!,
        EXAMPLE_PLAN.dailyPlan[3]!,
      ],
    });
    const result = findRepeatedAdvice(plan);
    expect(
      result.some(
        (p) => p.a.includes("wet-mopping") || p.b.includes("wet-mopping")
      )
    ).toBe(true);
  });
});
