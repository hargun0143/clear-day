import { AGE_OPTIONS } from "@/constants/questionnaire/options";
import type {
  QuestionOption,
  QuestionnaireAnswers,
} from "@/utils/questionnaire/types";

export function getAgeOptionsForRole(
  role?: string | null
): readonly QuestionOption[] {
  switch (role) {
    case "school-student":
    case "college-student":
      return [AGE_OPTIONS.UNDER_18, AGE_OPTIONS.AGE_18_59];
    case "office-worker":
    case "work-from-home":
    case "homemaker":
    case "outdoor-worker":
      return [AGE_OPTIONS.AGE_18_59, AGE_OPTIONS.AGE_60_PLUS];
    case "senior":
      return [AGE_OPTIONS.AGE_60_PLUS];
    default:
      return [
        AGE_OPTIONS.UNDER_18,
        AGE_OPTIONS.AGE_18_59,
        AGE_OPTIONS.AGE_60_PLUS,
      ];
  }
}

export function getAgeOptions(
  answers: QuestionnaireAnswers
): readonly QuestionOption[] {
  const role =
    typeof answers["role"] === "string" ? answers["role"] : undefined;
  return getAgeOptionsForRole(role);
}
