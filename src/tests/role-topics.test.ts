import { describe, expect, it } from "vitest";
import { buildFactSheet } from "../../api/_lib/plan/build-fact-sheet.js";
import { selectRoleTopic } from "../../api/_lib/plan/topics/select-role-topic.js";
import type { QuestionnaireAnswers } from "@/utils/questionnaire/types";

describe("selectRoleTopic (question 7)", () => {
  it("handles school and college outdoor sport with AQI 201 indoor threshold", () => {
    const student: QuestionnaireAnswers = {
      city: "delhi",
      role: "school-student",
      age: "under-18",
      care: ["none"],
      mobility: "walk",
      "home-setup": ["none"],
      "role-habit": "regularly",
    };

    const moderate = selectRoleTopic(
      buildFactSheet("delhi", { value: 150 }, student)
    );
    expect(moderate?.detail.toLowerCase()).toContain("rush-hour");

    const veryPoor = selectRoleTopic(
      buildFactSheet("delhi", { value: 220 }, student)
    );
    expect(veryPoor?.detail.toLowerCase()).toContain("indoors");

    const college = selectRoleTopic(
      buildFactSheet(
        "delhi",
        { value: 240 },
        {
          ...student,
          role: "college-student",
          age: "18-59",
          "role-habit": "hostel-sports",
        }
      )
    );
    expect(college?.detail.toLowerCase()).toContain("indoors");
  });

  it("handles senior morning walk with quiet route and >100 traffic peak avoidance", () => {
    const senior: QuestionnaireAnswers = {
      city: "delhi",
      role: "senior",
      age: "60-plus",
      care: ["none"],
      mobility: "mostly-indoors",
      "home-setup": ["none"],
      "role-habit": "daily",
      budget: "under-1000",
    };

    const low = selectRoleTopic(buildFactSheet("delhi", { value: 85 }, senior));
    expect(low?.detail.toLowerCase()).toContain("low-traffic");

    const high = selectRoleTopic(
      buildFactSheet("delhi", { value: 150 }, senior)
    );
    expect(high?.detail.toLowerCase()).toContain("quietest low-traffic route");
    expect(high?.detail.toLowerCase()).toContain("early-morning traffic peaks");
  });

  it("gates outdoor-worker mask advice to AQI >= 101", () => {
    for (const habit of ["none", "cloth", "n95-or-better"]) {
      const base: QuestionnaireAnswers = {
        city: "delhi",
        role: "outdoor-worker",
        age: "18-59",
        care: ["none"],
        mobility: "over-5",
        "home-setup": ["none"],
        "role-habit": habit,
        budget: "under-1000",
      };

      const low = selectRoleTopic(buildFactSheet("delhi", { value: 90 }, base));
      expect(low?.detail.toLowerCase()).not.toContain("mask");

      const high = selectRoleTopic(
        buildFactSheet("delhi", { value: 130 }, base)
      );
      expect(high?.detail.toLowerCase()).toContain("mask");
    }
  });

  it("provides fitting topics for office-worker, work-from-home, and homemaker", () => {
    const cases: Array<[string, string]> = [
      ["office-worker", "ac-yes"],
      ["work-from-home", "closed"],
      ["homemaker", "dry-sweep"],
    ];
    for (const [role, habit] of cases) {
      const sheet = buildFactSheet(
        "delhi",
        { value: 150 },
        {
          city: "delhi",
          role,
          age: "18-59",
          care: ["none"],
          mobility: role === "homemaker" ? "lpg-or-induction" : "car",
          "home-setup": ["none"],
          "role-habit": habit,
          budget: "under-1000",
        }
      );
      const topic = selectRoleTopic(sheet);
      expect(topic).not.toBeNull();
      expect(["Morning", "Afternoon", "Evening"]).toContain(topic!.slotHint);
    }
  });
});
