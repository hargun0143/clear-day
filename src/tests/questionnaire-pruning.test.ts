import { describe, expect, it } from "vitest";
import { getProgress } from "@/utils/questionnaire/get-progress";
import {
  handleExclusiveSelection,
  pruneAnswers,
} from "@/utils/questionnaire/prune-answers";
import type {
  QuestionConfig,
  QuestionnaireAnswers,
} from "@/utils/questionnaire/types";
import { isValidAnswerValue } from "@/utils/questionnaire/validate-answer";

describe("Questionnaire answer pruning and validation", () => {
  it("prune-answers removes stale answers when role changes", () => {
    const answers: QuestionnaireAnswers = {
      city: "delhi",
      role: "school-student",
      age: "under-18",
      care: ["none"],
      mobility: "walk",
      "home-setup": ["none"],
      "role-habit": "regularly",
    };

    const pruned = pruneAnswers({ ...answers, role: "office-worker" });
    expect(pruned["age"]).toBeUndefined();
    expect(pruned["care"]).toBeUndefined();
  });

  it("age options per role, and single option auto-selects or validates", () => {
    const pruned = pruneAnswers({ city: "delhi", role: "senior" });
    expect(pruned["age"]).toBe("60-plus");
  });

  it("care-at-home and home-setup none exclusivity", () => {
    expect(handleExclusiveSelection(["young-children"], "none")).toEqual([
      "none",
    ]);
    expect(handleExclusiveSelection(["none"], "older-adults")).toEqual([
      "older-adults",
    ]);
    expect(
      handleExclusiveSelection(["older-adults", "pregnancy"], "pregnancy")
    ).toEqual(["older-adults"]);
  });

  it("after Back and a role change, the total is still 8", () => {
    const answers: QuestionnaireAnswers = {
      city: "delhi",
      role: "school-student",
      age: "under-18",
    };
    expect(getProgress(answers, "age").totalSteps).toBe(7);

    const changed = pruneAnswers({ city: "delhi", role: "office-worker" });
    expect(getProgress(changed, "role").totalSteps).toBe(8);
  });

  it("unknown option id is rejected by validator", () => {
    const question: QuestionConfig = {
      id: "age",
      type: "single",
      prompt: "Age",
      options: [{ id: "18-59", label: "18 to 59" }],
      visibleWhen: () => true,
    };

    expect(isValidAnswerValue(question, "unknown-option", {})).toBe(false);
    expect(isValidAnswerValue(question, "18-59", {})).toBe(true);
  });
});
