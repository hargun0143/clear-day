import { describe, expect, it } from "vitest";
import {
  findBannedPhrases,
  findEquipmentViolations,
  hasBannedPhrase,
  sanitizeBannedActions,
} from "../../api/_lib/plan/banned-phrases.js";
import { EXAMPLE_PLAN } from "../../api/_lib/plan/example-plan.js";
import { DEFAULT_SLOT_ACTIONS } from "../../api/_lib/plan/knowledge-sheet.js";
import type { GeneratedPlan } from "../../api/_lib/plan/plan-schema.js";

describe("banned phrases and equipment limits", () => {
  it("detects blocklisted phrases and relaxing breathing variations", () => {
    expect(hasBannedPhrase("Check local air quality before departing")).toBe(
      true
    );
    expect(hasBannedPhrase("We have a vulnerable home with seniors")).toBe(
      true
    );
    expect(hasBannedPhrase("Keep breathing steady while outdoors")).toBe(true);
    expect(hasBannedPhrase("Try to calm your lungs today")).toBe(true);
    expect(hasBannedPhrase("Sit down and relax your breathing")).toBe(true);
    expect(hasBannedPhrase("Pacing yourself helps calm breathing")).toBe(true);
    expect(hasBannedPhrase("Keep windows closed during rush hours")).toBe(
      false
    );
  });

  it("findBannedPhrases extracts all violations from a plan", () => {
    const dirtyPlan: GeneratedPlan = {
      ...EXAMPLE_PLAN,
      headline: "Managing air quality in a vulnerable home",
      dailyPlan: [
        {
          ...EXAMPLE_PLAN.dailyPlan[0]!,
          actions: ["Check local air quality reports first", "Walk early"],
        },
        ...EXAMPLE_PLAN.dailyPlan.slice(1),
      ],
    };

    const violations = findBannedPhrases(dirtyPlan);
    expect(violations).toContain("vulnerable home");
    expect(violations).toContain("check local air quality");
  });

  it("returns empty array for clean plan", () => {
    expect(findBannedPhrases(EXAMPLE_PLAN)).toEqual([]);
  });

  it("detects equipment mentioned more than twice", () => {
    const heavyAcPlan: GeneratedPlan = {
      ...EXAMPLE_PLAN,
      headline: "Turn on your AC early",
      todaySummary: "Run the AC unit throughout the day. Check the AC filter.",
      dailyPlan: [
        {
          ...EXAMPLE_PLAN.dailyPlan[0]!,
          actions: ["Turn on AC recirculate", "Close windows"],
        },
        ...EXAMPLE_PLAN.dailyPlan.slice(1),
      ],
    };

    const violations = findEquipmentViolations(heavyAcPlan);
    expect(violations.some((v) => v.includes("ac mentioned"))).toBe(true);
  });

  it("detects purifier mentioned more than once outside indoorAir", () => {
    const multiplePurifiersPlan: GeneratedPlan = {
      ...EXAMPLE_PLAN,
      headline: "Air purifier schedule for office worker",
      todaySummary: "Use an air purifier during peak hours.",
    };

    const violations = findEquipmentViolations(multiplePurifiersPlan);
    expect(violations.some((v) => v.includes("outside indoorAir"))).toBe(true);
  });

  it("sanitizeBannedActions removes violating action if slot keeps at least one action", () => {
    const dirtyPlan: GeneratedPlan = {
      ...EXAMPLE_PLAN,
      dailyPlan: [
        {
          slot: "Morning",
          actions: ["Check local air quality before leaving", "Walk early"],
          why: "Avoid morning pollution peaks.",
        },
        ...EXAMPLE_PLAN.dailyPlan.slice(1),
      ],
    };

    const cleaned = sanitizeBannedActions(dirtyPlan, DEFAULT_SLOT_ACTIONS);
    expect(cleaned.dailyPlan[0]!.actions).toEqual(["Walk early"]);
  });

  it("sanitizeBannedActions replaces action with default if slot has only one action", () => {
    const singleDirtyPlan: GeneratedPlan = {
      ...EXAMPLE_PLAN,
      dailyPlan: [
        {
          slot: "Morning",
          actions: ["Check local air quality before leaving"],
          why: "Avoid morning pollution peaks.",
        },
        ...EXAMPLE_PLAN.dailyPlan.slice(1),
      ],
    };

    const cleaned = sanitizeBannedActions(
      singleDirtyPlan,
      DEFAULT_SLOT_ACTIONS
    );
    expect(cleaned.dailyPlan[0]!.actions.length).toBe(1);
    expect(cleaned.dailyPlan[0]!.actions[0]).toBe(
      DEFAULT_SLOT_ACTIONS["Morning"]![0]
    );
  });
});
