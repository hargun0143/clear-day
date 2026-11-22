import type { QuestionnaireAnswers } from "@/utils/questionnaire/types";

export function isUnder18(answers: QuestionnaireAnswers): boolean {
  return answers["age"] === "under-18";
}
