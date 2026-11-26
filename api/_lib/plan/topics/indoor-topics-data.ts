export type TopicSection = "indoorAir" | "swaps" | "impact";

export interface KnowledgeTopic {
  id: string;
  section: TopicSection;
  title: string;
  detail: string;
}

export const INDOOR_TOPICS: readonly KnowledgeTopic[] = [
  {
    id: "windows-closed",
    section: "indoorAir",
    title: "Keep windows closed",
    detail:
      "Keep windows and exterior doors securely closed when outdoor AQI is elevated.",
  },
  {
    id: "wet-mopping",
    section: "indoorAir",
    title: "Wet mopping",
    detail:
      "Use wet mopping rather than dry sweeping to prevent stirring settled dust into the air.",
  },
  {
    id: "indoor-smoking",
    section: "indoorAir",
    title: "Smoke outside living areas",
    detail:
      "Smoke outside and away from windows and doors, never in the rooms where others spend time, because indoor smoke adds fine particles that a filter has to work against.",
  },
  {
    id: "exhaust-or-chimney",
    section: "indoorAir",
    title: "Kitchen exhaust venting",
    detail:
      "Run the kitchen exhaust fan or chimney while cooking to vent particulates outdoors.",
  },
  {
    id: "cooking-no-exhaust-low-aqi",
    section: "indoorAir",
    title: "Open a kitchen window while cooking",
    detail:
      "Open a window in the kitchen while cooking so smoke and cooking particles can clear outdoors.",
  },
  {
    id: "cooking-no-exhaust-high-aqi",
    section: "indoorAir",
    title: "Contain cooking particles indoors",
    detail:
      "Keep lids on pots and keep the kitchen door closed while cooking so particles do not spread.",
  },
  {
    id: "purifier-care",
    section: "indoorAir",
    title: "Air purifier operation",
    detail:
      "Run your air purifier continuously in the primary living or sleeping space and maintain clean filters.",
  },
  {
    id: "diy-filter",
    section: "indoorAir",
    title: "DIY box-fan filter",
    detail:
      "Assemble and operate a low-cost DIY box-fan filter using a clean box fan and MERV 13 filter.",
  },
  {
    id: "ac-recirculation",
    section: "indoorAir",
    title: "AC recirculation mode",
    detail:
      "Set air conditioning to recirculate indoor air rather than drawing polluted air from outdoors.",
  },
] as const;
