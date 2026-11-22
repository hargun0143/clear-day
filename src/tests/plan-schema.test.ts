import { describe, expect, it } from "vitest";
import { EXAMPLE_PLAN } from "../../api/_lib/plan/example-plan.js";
import {
  GeneratedPlanSchema,
  postProcessPlan,
} from "../../api/_lib/plan/plan-schema.js";

describe("plan-schema & post-processing", () => {
  it("validates the example plan successfully", () => {
    const parsed = GeneratedPlanSchema.safeParse(EXAMPLE_PLAN);
    expect(parsed.success).toBe(true);
  });

  it("trims over-long headline and summary strings", () => {
    const raw = {
      ...EXAMPLE_PLAN,
      headline: "A".repeat(100),
      todaySummary: "B".repeat(300),
    };
    const processed = postProcessPlan(raw, false);
    expect(processed.headline.length).toBeLessThanOrEqual(80);
    expect(processed.todaySummary.length).toBeLessThanOrEqual(240);
  });

  it("forces lowEmissionChoices empty and diyFilter.include true for under-18", () => {
    const raw = {
      ...EXAMPLE_PLAN,
      lowEmissionChoices: [{ swap: "Bike", benefit: "Clean" }],
      indoorAir: {
        ...EXAMPLE_PLAN.indoorAir,
        diyFilter: {
          ...EXAMPLE_PLAN.indoorAir.diyFilter,
          include: false,
        },
      },
    };
    const processed = postProcessPlan(raw, true);
    expect(processed.lowEmissionChoices).toEqual([]);
    expect(processed.indoorAir.diyFilter.include).toBe(true);
  });

  it("fails validation if required fields are missing", () => {
    const bad = { headline: "Only headline" };
    expect(() => postProcessPlan(bad, false)).toThrow();
  });
});
