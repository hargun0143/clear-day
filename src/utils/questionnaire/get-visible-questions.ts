import { QUESTIONS } from "@/constants/questionnaire/questions";
import type {
  QuestionConfig,
  QuestionnaireAnswers,
} from "@/utils/questionnaire/types";

export function getVisibleQuestions(
  answers: QuestionnaireAnswers
): readonly QuestionConfig[] {
  return QUESTIONS.filter((q) => q.visibleWhen(answers));
}
