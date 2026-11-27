import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { hasBannedPhrase } from "../../api/_lib/plan/banned-phrases.js";
import { buildFactSheet } from "../../api/_lib/plan/build-fact-sheet.js";
import { EXAMPLE_PLAN } from "../../api/_lib/plan/example-plan.js";
import { findRepeatedAdvice } from "../../api/_lib/plan/find-repeated-advice.js";
import { selectTopFactors } from "../../api/_lib/plan/topics/select-top-factors.js";
import { ImpactSection } from "@/components/plan/impact-section";
import { computeExposureLevel } from "@/constants/top-factors";

describe("impact levels, sport factor, smoke-free repetition, and draft filler", () => {
  it("renders legend, code-computed level chips, and plain sentence under each label", () => {
    expect(computeExposureLevel("indoor-smoking", 150)).toBe("High");
    expect(computeExposureLevel("car-or-two-wheeler", 150)).toBe("Moderate");
    expect(computeExposureLevel("no-exhaust-cooking", 150)).toBe("Low");

    const html = renderToStaticMarkup(
      <ImpactSection
        aqiValue={150}
        impact={[
          {
            factorId: "regular-outdoor-sport",
            effect:
              "Timing games away from traffic lowers peak particle intake.",
          },
        ]}
      />
    );

    expect(html).toContain("Contribution to your exposure today");
    expect(html).toContain("Regular outdoor sport");
    expect(html).toContain("High");
    expect(html).toContain(
      "Timing games away from traffic lowers peak particle intake."
    );
  });

  it("gives students regular-outdoor-sport and never high-outdoor-hours", () => {
    const sheet = buildFactSheet(
      "delhi",
      { value: 180 },
      {
        city: "delhi",
        role: "college-student",
        age: "18-59",
        care: ["none"],
        mobility: "walk",
        "home-setup": ["none"],
        "role-habit": "hostel-sports",
        budget: "under-1000",
      }
    );

    const factors = selectTopFactors(sheet);
    expect(factors).toContain("regular-outdoor-sport");
    expect(factors).not.toContain("high-outdoor-hours");
  });

  it("flags smoke-free home if repeated outside goodHabits", () => {
    const repeatedPlan = {
      ...EXAMPLE_PLAN,
      todaySummary: "Keep a smoke-free home today while staying indoors.",
    };
    const repeats = findRepeatedAdvice(repeatedPlan);
    expect(repeats.some((r) => r.a.includes("smoke-free-home"))).toBe(true);
  });

  it("flags draft filler phrases", () => {
    expect(hasBannedPhrase("Block air drafts under the door")).toBe(true);
    expect(hasBannedPhrase("Maintain a stable sleeping environment")).toBe(
      true
    );
    expect(hasBannedPhrase("Seal outdoor air drafts tonight")).toBe(true);
  });
});
