import type { QuestionOption } from "@/utils/questionnaire/types";

export const AGE_OPTIONS = {
  UNDER_18: { id: "under-18", label: "Under 18" },
  AGE_18_59: { id: "18-59", label: "18 to 59" },
  AGE_60_PLUS: { id: "60-plus", label: "60 and above" },
} as const satisfies Record<string, QuestionOption>;

export const CARE_OPTIONS: readonly QuestionOption[] = [
  { id: "young-children", label: "Young children" },
  { id: "older-adults", label: "Older adults" },
  { id: "breathing-or-heart-condition", label: "Breathing or heart condition" },
  { id: "pregnancy", label: "Pregnancy" },
  { id: "none", label: "None of these" },
] as const;

export const HOME_SETUP_OPTIONS: readonly QuestionOption[] = [
  { id: "air-purifier", label: "Air purifier" },
  { id: "ac", label: "Air conditioner (AC)" },
  { id: "cooler-or-fan", label: "Air cooler or fan" },
  { id: "exhaust-or-chimney", label: "Kitchen exhaust or chimney" },
  { id: "indoor-smoking", label: "Indoor smoking" },
  { id: "none", label: "None of these" },
] as const;

export const BUDGET_OPTIONS: readonly QuestionOption[] = [
  { id: "nothing-diy-only", label: "Nothing (do-it-yourself only)" },
  { id: "under-1000", label: "Under ₹1,000" },
  { id: "up-to-5000", label: "Up to ₹5,000" },
  { id: "purifier-is-fine", label: "Air purifier is fine" },
] as const;
