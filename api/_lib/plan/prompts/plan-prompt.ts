import type { FactSheet } from "../fact-sheet-types.js";
import { DIY_BOX_FAN_FILTER, selectCommuteTopic } from "../knowledge-sheet.js";
import { selectGoodHabits } from "../topics/select-good-habits.js";
import { selectIndoorTopics } from "../topics/select-indoor-topics.js";
import { selectSwaps } from "../topics/select-swaps.js";

export const PROMPT_VERSION = "v3.1" as const;

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
  const commute = selectCommuteTopic(factSheet.mobilityId, factSheet.aqiValue);

  const bandStrictness =
    factSheet.aqiValue <= 100
      ? "AQI is 100 or below (Good or Satisfactory): Keep the plan light and positive; state plainly conditions are manageable. Do NOT include any mask advice anywhere in the plan."
      : factSheet.aqiValue <= 200
        ? "AQI is moderate: Apply sensible precautions without alarming language."
        : "AQI is high: Strictly minimise outdoor exposure and prioritise indoor air quality.";

  const systemInstruction = `You are Clear Day's air quality routine advisor.
Write and personalise a daily routine plan based ONLY on supplied facts and vetted knowledge.

TONE & BOUNDARIES (v3.1):
1. Never use words "vulnerable home", "check local air quality", "check the air quality", "breathing steady", "calm your lungs", "rest well", "recover", "smooth morning", any phrase about relaxing breathing, hydration or drinking water, organising/preparing items for the next day, or any action not connected to air exposure, indoor air, or the person's commute/work environment.
2. If indoorSmoking is true, state neutrally: smoke outside and away from windows and doors, never in rooms where others spend time, because indoor smoke adds fine particles that a filter has to work against.
3. When outdoor AQI is 101 or above, NEVER advise opening windows or ventilating as a response to indoor smoking or anything else. Do NOT give any ventilation timing advice in this version.
4. Mention a piece of equipment ONLY if the user has it. Max 2 mentions total per equipment type across the entire plan; purifier may appear in indoorAir and at most once elsewhere.

HEADLINE & SUMMARY (v3.1):
5. Headline (max 80 chars) must reflect role plus biggest exposure factor, never start with "Managing", and never be generic.
6. todaySummary (max 240 chars) must cite at least two specific facts with no medical or breathing claims. Headline and todaySummary must NEVER name a transport mode the person did not select.

DAILY PLAN (v3.1):
7. Morning, Afternoon, Evening MUST have 2 or 3 actions each; Night MUST have 1 or 2 actions, with at least one action about the sleeping environment or home air (e.g. sleeping-room air, AC recirculation, keeping the filter running), NEVER generic rest.
8. If selectedTopics.commute is provided, the daily plan MUST include the selected commute topic in either the Morning or Afternoon slot.
9. FORBIDDEN IN DAILY PLAN: Do NOT include home-setup or cleaning tips (wet mopping, sealing windows, purifier maintenance, AC recirculation, DIY filter building).

TOPIC SECTIONS & TOPIC IDs (v3.1):
10. indoorAir.tips: Present ONLY selectedTopics.indoorAir. Each item MUST include its topicId string and rewritten text. If diy-filter is absent, diyFilter.include MUST be false.
11. lowEmissionChoices: Present ONLY selectedTopics.swaps. Each item MUST include topicId, swap, and benefit. Empty if under-18.
12. goodHabits: Present selectedTopics.goodHabits (max 3), each with its topicId and text. Empty array if none.
13. Impact: Must contain exactly the factors in facts.topFactors in that exact order, returning each factorId and a qualitative effect with no numbers, and must NOT repeat an indoorAir or swaps topic.
14. Disclaimer: "Estimates and guidance based on air quality data, not medical advice."
15. ${bandStrictness}`;

  const userContent = JSON.stringify({
    facts: factSheet,
    selectedTopics: {
      indoorAir: indoorTopics,
      swaps,
      goodHabits,
      commute,
    },
    forbiddenInDailyPlan: FORBIDDEN_IN_DAILY_PLAN,
    knowledge: {
      diyFilter: DIY_BOX_FAN_FILTER,
    },
  });

  return { systemInstruction, userContent };
}
