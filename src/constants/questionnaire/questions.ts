import { getAgeOptions } from "@/constants/questionnaire/age-options";
import {
  getMobilityOptions,
  getMobilityPrompt,
} from "@/constants/questionnaire/mobility";
import {
  BUDGET_OPTIONS,
  CARE_OPTIONS,
  HOME_SETUP_OPTIONS,
} from "@/constants/questionnaire/options";
import {
  getRoleHabitOptions,
  getRoleHabitPrompt,
} from "@/constants/questionnaire/role-habits";
import { ROLES } from "@/constants/questionnaire/roles";
import { isUnder18 } from "@/utils/questionnaire/is-under-18";
import type { QuestionConfig } from "@/utils/questionnaire/types";

export const QUESTIONS: readonly QuestionConfig[] = [
  {
    id: "city",
    type: "single",
    prompt: "Which city are you checking?",
    options: [],
    visibleWhen: () => true,
  },
  {
    id: "role",
    type: "single",
    prompt: "What best describes your primary daily routine?",
    options: ROLES,
    visibleWhen: () => true,
  },
  {
    id: "age",
    type: "single",
    prompt: "What is your age band?",
    options: getAgeOptions,
    visibleWhen: (answers) => Boolean(answers["role"]),
  },
  {
    id: "care",
    type: "multi",
    prompt: "Do you care for or live with any vulnerable family members?",
    options: CARE_OPTIONS,
    visibleWhen: (answers) => Boolean(answers["age"]),
  },
  {
    id: "mobility",
    type: "single",
    prompt: getMobilityPrompt,
    options: getMobilityOptions,
    visibleWhen: (answers) => Boolean(answers["care"]),
  },
  {
    id: "home-setup",
    type: "multi",
    prompt: "Which of these apply to your home environment?",
    options: HOME_SETUP_OPTIONS,
    visibleWhen: (answers) => Boolean(answers["mobility"]),
  },
  {
    id: "role-habit",
    type: "single",
    prompt: getRoleHabitPrompt,
    options: getRoleHabitOptions,
    visibleWhen: (answers) => Boolean(answers["home-setup"]),
  },
  {
    id: "budget",
    type: "single",
    prompt: "What is your approximate budget for clean air measures?",
    options: BUDGET_OPTIONS,
    visibleWhen: (answers) =>
      Boolean(answers["role-habit"]) && !isUnder18(answers),
  },
] as const;
