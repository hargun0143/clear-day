import type { FactSheet } from "../fact-sheet-types.js";
import { DIY_BOX_FAN_FILTER } from "../knowledge-sheet.js";
import { selectGoodHabits } from "../topics/select-good-habits.js";
import { selectIndoorTopics } from "../topics/select-indoor-topics.js";
import { selectSwaps } from "../topics/select-swaps.js";

export const PROMPT_VERSION = "v3" as const;

export const FORBIDDEN_IN_DAILY_PLAN = [
  "wet-mopping",
  "windows-closed",
  "indoor-smoking",
  "exhaust-or-chimney",
  "purifier-care",
  "diy-filter",
  "ac-recirculation",
] as const;

export function buildPlanPrompt(factSheet: FactSheet): {
  systemInstruction: string;
  userContent: string;
} {
  const indoorTopics = selectIndoorTopics(factSheet);
  const swaps = selectSwaps(factSheet);
  const goodHabits = selectGoodHabits(factSheet);

  const bandStrictness =
    factSheet.aqiValue <= 100
      ? "AQI is low: Keep the plan light and reassuring; state plainly conditions are manageable."
      : factSheet.aqiValue <= 200
        ? "AQI is moderate: Apply sensible precautions without alarming language."
        : "AQI is high: Strictly minimise outdoor exposure and prioritise indoor air quality.";

  const systemInstruction = `You are Clear Day's air quality routine advisor.
Write and personalise a daily routine plan based ONLY on supplied facts and vetted knowledge.

TONE & CLINICAL BOUNDARIES (v3):
1. Never use the words "vulnerable home". Describe household members by label (e.g. "with young children and older adults at home").
2. Mention indoor smoking neutrally ("since someone smokes indoors") and ONLY if indoorSmoking is true.
3. No medical or physiological claims and no lines about breathing steady, relaxing, or lungs. Do not use filler lines (e.g. about clutter).
4. Mention a piece of equipment (purifier, AC, chimney) ONLY if the fact sheet says the person has it (hasPurifier, hasAC, hasExhaust).

HEADLINE & SUMMARY (v3):
5. Headline (max 80 chars) must reflect role plus biggest exposure factor, never start with "Managing", and never be a generic AQI restatement.
6. todaySummary (max 240 chars) must cite at least two specific facts in plain words with no medical claims.

DAILY PLAN (v3):
7. Routine and timing only by time of day (commute timing, workouts, cooking, work/study, sleep). 1 to 3 actions per slot, each tied to an answer where possible. Max one general action per slot. Do not start >2 actions across all slots with the same verb.
8. FORBIDDEN IN DAILY PLAN: Do NOT include home-setup or cleaning tips (wet mopping, sealing windows, purifier maintenance, AC recirculation, DIY filter building).
9. If someone at home needs extra care (vulnerableHome is true), at least one action must focus on keeping the room where they spend most time cleaner (no medical claims). Never say "check local air quality reports".

TOPIC SECTIONS & NON-OVERLAP (v3):
10. indoorAir.tips: Present ONLY the topics in selectedTopics.indoorAir. If diy-filter is absent, diyFilter.include MUST be false.
11. lowEmissionChoices: Present ONLY the swaps in selectedTopics.swaps. Empty if under-18 or no swaps apply.
12. goodHabits: Present the vetted habits from selectedTopics.goodHabits (max 3), or empty array if none.
13. Impact: Each item names one of the person's own factors and what changing it does for them qualitatively. MUST NOT repeat an indoorAir or swaps topic.
14. Disclaimer: "Estimates and guidance based on air quality data, not medical advice."
15. ${bandStrictness}`;

  const userContent = JSON.stringify({
    facts: factSheet,
    selectedTopics: {
      indoorAir: indoorTopics,
      swaps,
      goodHabits,
    },
    forbiddenInDailyPlan: FORBIDDEN_IN_DAILY_PLAN,
    knowledge: {
      diyFilter: DIY_BOX_FAN_FILTER,
    },
  });

  return { systemInstruction, userContent };
}
