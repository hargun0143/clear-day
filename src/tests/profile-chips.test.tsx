import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { PlanSummaryPanel } from "@/components/plan/plan-summary-panel";
import { buildProfileChips } from "@/utils/plan/build-profile-chips";
import type { QuestionnaireAnswers } from "@/utils/questionnaire/types";

describe("buildProfileChips and PlanSummaryPanel", () => {
  it("builds plain chips for adult profile with outdoor hours, care, and home setup", () => {
    const answers: QuestionnaireAnswers = {
      city: "delhi",
      role: "outdoor-worker",
      age: "18-59",
      care: ["young-children", "older-adults"],
      mobility: "over-5",
      "home-setup": ["ac", "cooler-or-fan"],
      "role-habit": "regularly",
      budget: "nothing-diy-only",
    };

    const chips = buildProfileChips(answers);
    expect(chips).toEqual([
      "Outdoor worker",
      "18 to 59",
      "Over 5 hours outdoors",
      "Young children",
      "Older adults",
      "Air conditioner (AC)",
      "Air cooler or fan",
    ]);
  });

  it("shows only role and age band for under-18", () => {
    const minorAnswers: QuestionnaireAnswers = {
      city: "delhi",
      role: "school-student",
      age: "under-18",
      care: ["young-children"],
      mobility: "walk",
      "home-setup": ["air-purifier"],
    };

    expect(buildProfileChips(minorAnswers)).toEqual([
      "School student",
      "Under 18",
    ]);
  });

  it("renders Planned for chips inside PlanSummaryPanel", () => {
    const html = renderToStaticMarkup(
      <PlanSummaryPanel
        headline="Outdoor work plan"
        todaySummary="Keep exposure low."
        aqiValue={150}
        aqiBandLabel="Moderate"
        aqiBandColor="#f5c842"
        cityName="Delhi"
        dataSourceLabel="Open-Meteo"
        profileChips={["Outdoor worker", "18 to 59", "Air conditioner (AC)"]}
        onStartOver={vi.fn()}
      />
    );
    expect(html).toContain("Planned for");
    expect(html).toContain("Outdoor worker");
    expect(html).toContain("18 to 59");
    expect(html).toContain("Air conditioner (AC)");
  });
});
