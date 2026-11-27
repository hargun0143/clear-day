import { describe, expect, it } from "vitest";
import { ROLES } from "@/constants/questionnaire/roles";
import { getNextQuestion } from "@/utils/questionnaire/get-next-question";
import {
  getApplicableQuestions,
  getProgress,
} from "@/utils/questionnaire/get-progress";
import { getVisibleQuestions } from "@/utils/questionnaire/get-visible-questions";
import { isUnder18 } from "@/utils/questionnaire/is-under-18";
import { getStepQuestionId } from "@/utils/questionnaire/nav-helpers";
import type { QuestionnaireAnswers } from "@/utils/questionnaire/types";
import { getQuestionOptions } from "@/utils/questionnaire/validate-answer";

describe("Questionnaire visibility and progress", () => {
  it("happy path to completion for each of the 7 roles", () => {
    for (const roleObj of ROLES) {
      const answers: QuestionnaireAnswers = { city: "delhi", role: roleObj.id };
      let current = getNextQuestion(answers);
      let steps = 0;
      while (current !== null && steps < 10) {
        steps++;
        const opts = getQuestionOptions(current, answers);
        expect(opts.length).toBeGreaterThan(0);
        const firstOpt = opts[0]?.id;
        expect(firstOpt).toBeDefined();
        answers[current.id] =
          current.type === "multi" ? [firstOpt!] : firstOpt!;
        current = getNextQuestion(answers);
      }
      expect(current).toBeNull();
      expect(getVisibleQuestions(answers).length).toBeGreaterThanOrEqual(7);
    }
  });

  it("under-18 skips the budget question", () => {
    const adult: QuestionnaireAnswers = {
      city: "delhi",
      role: "school-student",
      age: "18-59",
      care: ["none"],
      mobility: "walk",
      "home-setup": ["none"],
      "role-habit": "regularly",
    };
    expect(getApplicableQuestions(adult).some((q) => q.id === "budget")).toBe(
      true
    );
    const minor: QuestionnaireAnswers = { ...adult, age: "under-18" };
    expect(isUnder18(minor)).toBe(true);
    expect(getApplicableQuestions(minor).some((q) => q.id === "budget")).toBe(
      false
    );
  });

  it("role-specific question 7 prompt and options differ per role", () => {
    const student: QuestionnaireAnswers = {
      city: "delhi",
      role: "school-student",
    };
    const senior: QuestionnaireAnswers = { city: "delhi", role: "senior" };
    const habitQ = getVisibleQuestions({
      ...student,
      age: "under-18",
      care: ["none"],
      mobility: "walk",
      "home-setup": ["none"],
    }).find((q) => q.id === "role-habit")!;
    expect(habitQ).toBeDefined();
    expect(getQuestionOptions(habitQ, student).map((o) => o.id)).not.toEqual(
      getQuestionOptions(habitQ, senior).map((o) => o.id)
    );
  });

  it("question 5 mobility options differ for outdoor-worker and homemaker", () => {
    const def: QuestionnaireAnswers = {
      city: "delhi",
      role: "office-worker",
      age: "18-59",
      care: ["none"],
    };
    const mobilityQ = getVisibleQuestions(def).find(
      (q) => q.id === "mobility"
    )!;
    expect(
      getQuestionOptions(mobilityQ, { ...def, role: "outdoor-worker" }).map(
        (o) => o.id
      )
    ).toEqual(["under-2", "2-to-5", "over-5"]);
    expect(
      getQuestionOptions(mobilityQ, { ...def, role: "homemaker" }).map(
        (o) => o.id
      )
    ).toEqual(["lpg-or-induction", "wood-coal-or-biomass"]);
    expect(getQuestionOptions(mobilityQ, def).map((o) => o.id)).toContain(
      "bus-or-metro"
    );
  });

  it("total is 8 at the first screen for every role", () => {
    for (const roleObj of ROLES) {
      const progress = getProgress({ city: "delhi", role: roleObj.id }, "role");
      expect(progress.currentStep).toBe(2);
      expect(progress.totalSteps).toBe(8);
      expect(progress.isLastStep).toBe(false);
    }
  });

  it("total changes to 7 only after the under-18 answer and not before", () => {
    const base: QuestionnaireAnswers = {
      city: "delhi",
      role: "school-student",
    };
    expect(getProgress(base, "role").totalSteps).toBe(8);
    expect(getProgress(base, "age").totalSteps).toBe(8);
    expect(getProgress({ ...base, age: "18-59" }, "age").totalSteps).toBe(8);
    expect(getProgress({ ...base, age: "under-18" }, "age").totalSteps).toBe(7);
  });

  it("step numbers increase by 1 per Continue for each of the 7 roles on the full happy path", () => {
    for (const roleObj of ROLES) {
      const answers: QuestionnaireAnswers = { city: "delhi", role: roleObj.id };
      const applicable = getApplicableQuestions(answers);
      let expectedStep = 2;
      for (let i = 1; i < applicable.length; i++) {
        const q = applicable[i]!;
        expect(getProgress(answers, q.id).currentStep).toBe(expectedStep);
        const nextId = getStepQuestionId("next", q, answers);
        expect(nextId).toBe(
          i < applicable.length - 1 ? applicable[i + 1]!.id : null
        );
        answers[q.id] = "dummy";
        expectedStep++;
      }
    }
  });

  it("the last-step flag is true only on the final question for an adult and for an under-18", () => {
    const adult: QuestionnaireAnswers = {
      city: "delhi",
      role: "office-worker",
      age: "18-59",
    };
    expect(getProgress(adult, "role").isLastStep).toBe(false);
    expect(getProgress(adult, "role-habit").isLastStep).toBe(false);
    expect(getProgress(adult, "budget").isLastStep).toBe(true);
    const minor: QuestionnaireAnswers = {
      city: "delhi",
      role: "school-student",
      age: "under-18",
    };
    expect(getProgress(minor, "role").isLastStep).toBe(false);
    expect(getProgress(minor, "age").isLastStep).toBe(false);
    expect(getProgress(minor, "role-habit").isLastStep).toBe(true);
  });

  it("the bar value never decreases going forward", () => {
    const minor: QuestionnaireAnswers = {
      city: "delhi",
      role: "school-student",
      age: "under-18",
    };
    const applicable = getApplicableQuestions(minor);
    let prevRatio = -1;
    for (let i = 1; i < applicable.length; i++) {
      const p = getProgress(minor, applicable[i]!.id);
      const ratio = (p.currentStep - 1) / (p.totalSteps - 1);
      expect(ratio).toBeGreaterThanOrEqual(prevRatio);
      prevRatio = ratio;
    }
  });
});
