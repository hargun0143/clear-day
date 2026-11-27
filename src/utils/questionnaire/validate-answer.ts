import type {
  QuestionConfig,
  QuestionOption,
  QuestionnaireAnswers,
} from "@/utils/questionnaire/types";
import { toStringList } from "@/utils/to-string-list";

export function getQuestionOptions(
  question: QuestionConfig,
  answers: QuestionnaireAnswers
): readonly QuestionOption[] {
  if (typeof question.options === "function") {
    return question.options(answers);
  }
  return question.options;
}

export function isValidAnswerValue(
  question: QuestionConfig,
  val: unknown,
  answers: QuestionnaireAnswers
): boolean {
  if (val === undefined || val === null) return false;
  const validOptions = getQuestionOptions(question, answers);
  const validIds = new Set(validOptions.map((o) => o.id));

  if (question.type === "single") {
    return typeof val === "string" && validIds.has(val);
  }

  if (Array.isArray(val)) {
    const items = toStringList(val);
    return (
      items.length > 0 &&
      items.length === val.length &&
      items.every((item) => validIds.has(item))
    );
  }

  return false;
}
