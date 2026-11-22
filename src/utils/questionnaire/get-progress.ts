import { QUESTIONS } from "@/constants/questionnaire/questions";
import { isUnder18 } from "@/utils/questionnaire/is-under-18";
import type {
  QuestionConfig,
  QuestionnaireAnswers,
} from "@/utils/questionnaire/types";

export interface QuestionnaireProgress {
  currentStep: number;
  totalSteps: number;
  isLastStep: boolean;
}

export function getApplicableQuestions(
  answers: QuestionnaireAnswers
): readonly QuestionConfig[] {
  if (isUnder18(answers)) {
    return QUESTIONS.filter((q) => q.id !== "budget");
  }
  return QUESTIONS;
}

export function getProgress(
  answers: QuestionnaireAnswers,
  activeQuestionId?: string | null
): QuestionnaireProgress {
  const applicable = getApplicableQuestions(answers);
  const totalSteps = applicable.length;

  if (!activeQuestionId) {
    return {
      currentStep: totalSteps,
      totalSteps,
      isLastStep: true,
    };
  }

  const index = applicable.findIndex((q) => q.id === activeQuestionId);
  const currentStep = index >= 0 ? index + 1 : 1;
  const isLastStep = index === totalSteps - 1;

  return { currentStep, totalSteps, isLastStep };
}
