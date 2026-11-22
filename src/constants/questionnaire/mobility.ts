import type {
  QuestionOption,
  QuestionnaireAnswers,
} from "@/utils/questionnaire/types";

export const DEFAULT_MOBILITY_OPTIONS: readonly QuestionOption[] = [
  { id: "walk", label: "Walk" },
  { id: "bicycle-or-two-wheeler", label: "Bicycle or two-wheeler" },
  { id: "bus-or-metro", label: "Bus or metro" },
  { id: "car", label: "Car" },
  { id: "auto-or-cab", label: "Auto or cab" },
  { id: "mostly-indoors", label: "Mostly indoors" },
] as const;

export const OUTDOOR_HOURS_OPTIONS: readonly QuestionOption[] = [
  { id: "under-2", label: "Under 2 hours" },
  { id: "2-to-5", label: "2 to 5 hours" },
  { id: "over-5", label: "Over 5 hours" },
] as const;

export const COOKING_FUEL_OPTIONS: readonly QuestionOption[] = [
  { id: "lpg-or-induction", label: "LPG or induction" },
  { id: "wood-coal-or-biomass", label: "Wood, coal or biomass" },
] as const;

export function getMobilityPrompt(answers: QuestionnaireAnswers): string {
  const role = answers["role"];
  if (role === "outdoor-worker") {
    return "How many hours do you typically spend outdoors each day?";
  }
  if (role === "homemaker") {
    return "What primary cooking fuel is used in your home?";
  }
  return "How do you usually commute or travel during the day?";
}

export function getMobilityOptions(
  answers: QuestionnaireAnswers
): readonly QuestionOption[] {
  const role = answers["role"];
  if (role === "outdoor-worker") {
    return OUTDOOR_HOURS_OPTIONS;
  }
  if (role === "homemaker") {
    return COOKING_FUEL_OPTIONS;
  }
  return DEFAULT_MOBILITY_OPTIONS;
}
