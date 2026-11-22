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
import {
  handleExclusiveSelection,
  pruneAnswers,
} from "@/utils/questionnaire/prune-answers";
import type {
  QuestionConfig,
  QuestionnaireAnswers,
} from "@/utils/questionnaire/types";
import {
  getQuestionOptions,
  isValidAnswerValue,
} from "@/utils/questionnaire/validate-answer";

describe("Questionnaire pure logic", () => {
  it("happy path to completion for each of the 7 roles", () => {
    for (const roleObj of ROLES) {
      const answers: QuestionnaireAnswers = {
        city: "delhi",
        role: roleObj.id,
      };

      let current = getNextQuestion(answers);
      let steps = 0;
      while (current !== null && steps < 10) {
        steps++;
        const opts = getQuestionOptions(current, answers);
        expect(opts.length).toBeGreaterThan(0);
        const firstOpt = opts[0]?.id;
        expect(firstOpt).toBeDefined();

        if (current.type === "multi") {
          answers[current.id] = [firstOpt!];
        } else {
          answers[current.id] = firstOpt!;
        }
        current = getNextQuestion(answers);
      }

      expect(current).toBeNull();
      const visible = getVisibleQuestions(answers);
      expect(visible.length).toBeGreaterThanOrEqual(7);
    }
  });

  it("under-18 skips the budget question", () => {
    const adultAnswers: QuestionnaireAnswers = {
      city: "delhi",
      role: "school-student",
      age: "18-59",
      care: ["none"],
      mobility: "walk",
      "home-setup": ["none"],
      "role-habit": "regularly",
    };
    const adultApplicable = getApplicableQuestions(adultAnswers);
    expect(adultApplicable.some((q) => q.id === "budget")).toBe(true);

    const minorAnswers: QuestionnaireAnswers = {
      ...adultAnswers,
      age: "under-18",
    };
    expect(isUnder18(minorAnswers)).toBe(true);
    const minorApplicable = getApplicableQuestions(minorAnswers);
    expect(minorApplicable.some((q) => q.id === "budget")).toBe(false);
  });

  it("role-specific question 7 prompt and options differ per role", () => {
    const studentAnswers: QuestionnaireAnswers = {
      city: "delhi",
      role: "school-student",
    };
    const seniorAnswers: QuestionnaireAnswers = {
      city: "delhi",
      role: "senior",
    };

    const questions = getVisibleQuestions({
      ...studentAnswers,
      age: "under-18",
      care: ["none"],
      mobility: "walk",
      "home-setup": ["none"],
    });
    const habitQ = questions.find((q) => q.id === "role-habit")!;
    expect(habitQ).toBeDefined();

    const studentOpts = getQuestionOptions(habitQ, studentAnswers);
    const seniorOpts = getQuestionOptions(habitQ, seniorAnswers);
    expect(studentOpts.map((o) => o.id)).not.toEqual(
      seniorOpts.map((o) => o.id)
    );
  });

  it("question 5 mobility options differ for outdoor-worker and homemaker", () => {
    const defaultAnswers: QuestionnaireAnswers = {
      city: "delhi",
      role: "office-worker",
      age: "18-59",
      care: ["none"],
    };
    const outdoorAnswers: QuestionnaireAnswers = {
      ...defaultAnswers,
      role: "outdoor-worker",
    };
    const homemakerAnswers: QuestionnaireAnswers = {
      ...defaultAnswers,
      role: "homemaker",
    };

    const visibleDef = getVisibleQuestions(defaultAnswers);
    const mobilityQ = visibleDef.find((q) => q.id === "mobility")!;
    const defOpts = getQuestionOptions(mobilityQ, defaultAnswers);
    const outdoorOpts = getQuestionOptions(mobilityQ, outdoorAnswers);
    const homeOpts = getQuestionOptions(mobilityQ, homemakerAnswers);

    expect(outdoorOpts.map((o) => o.id)).toEqual([
      "under-2",
      "2-to-5",
      "over-5",
    ]);
    expect(homeOpts.map((o) => o.id)).toEqual([
      "lpg-or-induction",
      "wood-coal-or-biomass",
    ]);
    expect(defOpts.map((o) => o.id)).toContain("bus-or-metro");
  });

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

    const changedRole: QuestionnaireAnswers = {
      ...answers,
      role: "office-worker",
    };
    const pruned = pruneAnswers(changedRole);
    expect(pruned["age"]).toBeUndefined();
    expect(pruned["care"]).toBeUndefined();
  });

  it("age options per role, and single option auto-selects or validates", () => {
    const seniorAnswers: QuestionnaireAnswers = {
      city: "delhi",
      role: "senior",
    };
    const pruned = pruneAnswers(seniorAnswers);
    expect(pruned["age"]).toBe("60-plus");
  });

  it("care-at-home and home-setup none exclusivity", () => {
    const afterNone = handleExclusiveSelection(["young-children"], "none");
    expect(afterNone).toEqual(["none"]);

    const afterOption = handleExclusiveSelection(["none"], "older-adults");
    expect(afterOption).toEqual(["older-adults"]);

    const toggledOff = handleExclusiveSelection(
      ["older-adults", "pregnancy"],
      "pregnancy"
    );
    expect(toggledOff).toEqual(["older-adults"]);
  });

  it("total is 8 at the first screen for every role", () => {
    for (const roleObj of ROLES) {
      const answers: QuestionnaireAnswers = {
        city: "delhi",
        role: roleObj.id,
      };
      const progress = getProgress(answers, "role");
      expect(progress.currentStep).toBe(2);
      expect(progress.totalSteps).toBe(8);
      expect(progress.isLastStep).toBe(false);
    }
  });

  it("total changes to 7 only after the under-18 answer and not before", () => {
    const initialAnswers: QuestionnaireAnswers = {
      city: "delhi",
      role: "school-student",
    };
    expect(getProgress(initialAnswers, "role").totalSteps).toBe(8);
    expect(getProgress(initialAnswers, "age").totalSteps).toBe(8);

    const adultAnswers: QuestionnaireAnswers = {
      ...initialAnswers,
      age: "18-59",
    };
    expect(getProgress(adultAnswers, "age").totalSteps).toBe(8);

    const minorAnswers: QuestionnaireAnswers = {
      ...initialAnswers,
      age: "under-18",
    };
    expect(getProgress(minorAnswers, "age").totalSteps).toBe(7);
  });

  it("step numbers increase by 1 per Continue for each of the 7 roles on the full happy path", () => {
    for (const roleObj of ROLES) {
      const answers: QuestionnaireAnswers = {
        city: "delhi",
        role: roleObj.id,
      };

      const applicable = getApplicableQuestions(answers);
      // We start at role, which is step 2
      let expectedStep = 2;
      for (let i = 1; i < applicable.length; i++) {
        const q = applicable[i]!;
        const progress = getProgress(answers, q.id);
        expect(progress.currentStep).toBe(expectedStep);

        const nextId = getStepQuestionId("next", q, answers);
        if (i < applicable.length - 1) {
          expect(nextId).toBe(applicable[i + 1]!.id);
        } else {
          expect(nextId).toBeNull();
        }

        // simulate answer
        answers[q.id] = "dummy";
        expectedStep++;
      }
    }
  });

  it("the last-step flag is true only on the final question for an adult and for an under-18", () => {
    const adultAnswers: QuestionnaireAnswers = {
      city: "delhi",
      role: "office-worker",
      age: "18-59",
    };
    expect(getProgress(adultAnswers, "role").isLastStep).toBe(false);
    expect(getProgress(adultAnswers, "role-habit").isLastStep).toBe(false);
    expect(getProgress(adultAnswers, "budget").isLastStep).toBe(true);

    const minorAnswers: QuestionnaireAnswers = {
      city: "delhi",
      role: "school-student",
      age: "under-18",
    };
    expect(getProgress(minorAnswers, "role").isLastStep).toBe(false);
    expect(getProgress(minorAnswers, "age").isLastStep).toBe(false);
    expect(getProgress(minorAnswers, "role-habit").isLastStep).toBe(true);
  });

  it("the bar value never decreases going forward", () => {
    const minorAnswers: QuestionnaireAnswers = {
      city: "delhi",
      role: "school-student",
      age: "under-18",
    };
    const applicable = getApplicableQuestions(minorAnswers);
    let prevRatio = -1;

    for (let i = 1; i < applicable.length; i++) {
      const p = getProgress(minorAnswers, applicable[i]!.id);
      const ratio = (p.currentStep - 1) / (p.totalSteps - 1);
      expect(ratio).toBeGreaterThanOrEqual(prevRatio);
      prevRatio = ratio;
    }
  });

  it("after Back and a role change, the total is still 8", () => {
    const answers: QuestionnaireAnswers = {
      city: "delhi",
      role: "school-student",
      age: "under-18",
    };
    expect(getProgress(answers, "age").totalSteps).toBe(7);

    // User backs out and changes role to office-worker
    const changed = pruneAnswers({
      city: "delhi",
      role: "office-worker",
    });
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
