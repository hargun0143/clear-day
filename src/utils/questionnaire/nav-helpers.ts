import { QUESTIONS } from "@/constants/questionnaire/questions";
import { getApplicableQuestions } from "@/utils/questionnaire/get-progress";
import type {
  AnswerValue,
  QuestionConfig,
  QuestionnaireAnswers,
} from "@/utils/questionnaire/types";
import { isValidAnswerValue } from "@/utils/questionnaire/validate-answer";

export function getStepQuestionId(
  direction: "next" | "back",
  currentQ: QuestionConfig | null,
  answers: QuestionnaireAnswers
): string | null {
  const applicable = getApplicableQuestions(answers);

  if (direction === "next") {
    if (!currentQ) return null;
    const idx = applicable.findIndex((q) => q.id === currentQ.id);
    if (idx >= 0 && idx < applicable.length - 1) {
      return applicable[idx + 1]?.id ?? null;
    }
    return null;
  }

  if (!currentQ) {
    const last = applicable[applicable.length - 1];
    return last && last.id !== "city" ? last.id : null;
  }
  const idx = applicable.findIndex((q) => q.id === currentQ.id);
  if (idx > 1) {
    return applicable[idx - 1]?.id ?? null;
  }
  return null;
}

export function updateAnswerState(
  prev: QuestionnaireAnswers,
  questionId: string,
  value: AnswerValue,
  pruner: (answers: QuestionnaireAnswers) => QuestionnaireAnswers
): QuestionnaireAnswers {
  const targetQ = QUESTIONS.find((q) => q.id === questionId);
  if (!targetQ || !isValidAnswerValue(targetQ, value, prev)) {
    return prev;
  }
  return pruner({ ...prev, [questionId]: value });
}
