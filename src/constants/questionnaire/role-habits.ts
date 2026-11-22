import type {
  QuestionOption,
  QuestionnaireAnswers,
} from "@/utils/questionnaire/types";

const ROLE_SPECIFIC_CONFIG: Record<
  string,
  { prompt: string; options: readonly QuestionOption[] }
> = {
  "school-student": {
    prompt: "Do you participate in outdoor sports or PE at school?",
    options: [
      { id: "regularly", label: "Yes, regularly" },
      { id: "occasionally", label: "Occasionally" },
      { id: "never", label: "No or rarely" },
    ],
  },
  "college-student": {
    prompt: "What is your living arrangement and outdoor sport routine?",
    options: [
      { id: "hostel-sports", label: "Hostel with regular outdoor sports" },
      { id: "hostel-no-sports", label: "Hostel without outdoor sports" },
      { id: "day-scholar-sports", label: "Home with regular outdoor sports" },
      { id: "day-scholar-no-sports", label: "Home without outdoor sports" },
    ],
  },
  "office-worker": {
    prompt: "Is your primary workplace air-conditioned?",
    options: [
      { id: "ac-yes", label: "Yes, fully air-conditioned" },
      { id: "ac-partial", label: "Partially air-conditioned" },
      { id: "ac-no", label: "No air conditioning" },
    ],
  },
  "work-from-home": {
    prompt: "How is your workspace typically ventilated during the day?",
    options: [
      { id: "window-open", label: "Windows kept open" },
      { id: "closed", label: "Windows closed, fan only" },
      { id: "ac", label: "Air conditioning running" },
    ],
  },
  homemaker: {
    prompt: "What is your typical sweeping and dusting routine at home?",
    options: [
      { id: "dry-sweep", label: "Dry sweeping with broom" },
      { id: "wet-mop", label: "Wet mopping" },
      { id: "vacuum", label: "Vacuum cleaner" },
    ],
  },
  "outdoor-worker": {
    prompt:
      "What type of mask or face cover do you wear while working outdoors?",
    options: [
      { id: "none", label: "None" },
      { id: "cloth", label: "Cloth mask or handkerchief" },
      { id: "n95-or-better", label: "N95, FFP2 or respirator" },
    ],
  },
  senior: {
    prompt: "How often do you go for morning or evening walks outdoors?",
    options: [
      { id: "daily", label: "Daily" },
      { id: "sometimes", label: "A few times a week" },
      { id: "never", label: "Rarely or never" },
    ],
  },
};

const DEFAULT_HABIT = {
  prompt: "What describes your typical daily outdoor activity?",
  options: [
    { id: "daily", label: "Daily outdoor activity" },
    { id: "sometimes", label: "Occasional outdoor activity" },
    { id: "never", label: "Mostly indoors" },
  ],
};

export function getRoleHabitPrompt(answers: QuestionnaireAnswers): string {
  const role = typeof answers["role"] === "string" ? answers["role"] : "";
  return ROLE_SPECIFIC_CONFIG[role]?.prompt ?? DEFAULT_HABIT.prompt;
}

export function getRoleHabitOptions(
  answers: QuestionnaireAnswers
): readonly QuestionOption[] {
  const role = typeof answers["role"] === "string" ? answers["role"] : "";
  return ROLE_SPECIFIC_CONFIG[role]?.options ?? DEFAULT_HABIT.options;
}
