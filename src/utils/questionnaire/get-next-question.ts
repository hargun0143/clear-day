import { getVisibleQuestions } from "@/utils/questionnaire/get-visible-questions";
import type {
  QuestionConfig,
  QuestionnaireAnswers,
} from "@/utils/questionnaire/types";

export function getNextQuestion(
  answers: QuestionnaireAnswers
): QuestionConfig | null {
  const visible = getVisibleQuestions(answers);
  for (const q of visible) {
    if (q.id === "city") continue;
    const ans = answers[q.id];
    if (ans === undefined || ans === null) {
      return q;
    }
    if (Array.isArray(ans) && ans.length === 0) {
      return q;
    }
  }
  return null;
}
