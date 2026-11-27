import {
  getMobilityOptions,
  OUTDOOR_HOURS_OPTIONS,
} from "@/constants/questionnaire/mobility";
import {
  AGE_OPTIONS,
  CARE_OPTIONS,
  HOME_SETUP_OPTIONS,
} from "@/constants/questionnaire/options";
import { ROLES } from "@/constants/questionnaire/roles";
import type {
  QuestionOption,
  QuestionnaireAnswers,
} from "@/utils/questionnaire/types";
import { toStringList } from "@/utils/to-string-list";

function findLabel(
  options: readonly QuestionOption[],
  id: string
): string | null {
  return options.find((opt) => opt.id === id)?.label ?? null;
}

export function buildProfileChips(answers: QuestionnaireAnswers): string[] {
  const chips: string[] = [];

  const roleId = typeof answers["role"] === "string" ? answers["role"] : "";
  const roleLabel = findLabel(ROLES, roleId);
  if (roleLabel) chips.push(roleLabel);

  const ageId = typeof answers["age"] === "string" ? answers["age"] : "";
  const ageOptions = Object.values(AGE_OPTIONS);
  const ageLabel = findLabel(ageOptions, ageId);
  if (ageLabel) chips.push(ageLabel);

  if (ageId === "under-18") {
    return chips;
  }

  const mobilityId =
    typeof answers["mobility"] === "string" ? answers["mobility"] : "";
  if (mobilityId) {
    const isOutdoorHours = OUTDOOR_HOURS_OPTIONS.some(
      (o) => o.id === mobilityId
    );
    const mobLabel = findLabel(getMobilityOptions(answers), mobilityId);
    if (mobLabel) {
      chips.push(isOutdoorHours ? `${mobLabel} outdoors` : mobLabel);
    }
  }

  const careIds = toStringList(answers["care"]).filter((id) => id !== "none");
  for (const id of careIds) {
    const label = findLabel(CARE_OPTIONS, id);
    if (label) chips.push(label);
  }

  const setupIds = toStringList(answers["home-setup"]).filter(
    (id) => id !== "none"
  );
  for (const id of setupIds) {
    const label = findLabel(HOME_SETUP_OPTIONS, id);
    if (label) chips.push(label);
  }

  return chips;
}
