import type { GeneratedPlan } from "./plan-schema.js";

export const EXAMPLE_PLAN: GeneratedPlan = {
  headline: "Office routine with moderate outdoor exposure in Delhi",
  todaySummary:
    "Air quality is in the Moderate band today. For an office worker commuting via transit with family at home, pace outdoor travel around peak hours and maintain a clean indoor baseline.",
  goodHabits: [
    {
      topicId: "public-transit",
      text: "Using public transit for commuting",
    },
    {
      topicId: "smoke-free-home",
      text: "Maintaining a smoke-free home environment",
    },
  ],
  dailyPlan: [
    {
      slot: "Morning",
      actions: [
        "Plan indoor morning exercise instead of outdoor jogging",
        "Take an earlier transit route before traffic peaks",
      ],
      why: "Particulate levels typically peak in early morning near major roadways.",
    },
    {
      slot: "Afternoon",
      actions: [
        "Take scheduled rest breaks inside during midday heat",
        "Keep pots covered while preparing midday meals to limit cooking particles",
      ],
      why: "Solar heating improves vertical air mixing during midday hours.",
    },
    {
      slot: "Evening",
      actions: [
        "Wear an N95 mask if walking through busy transit hubs",
        "Wrap up errands early before nightfall",
      ],
      why: "Evening commutes create localized spikes of fine vehicle emissions along roadways.",
    },
    {
      slot: "Night",
      actions: [
        "Keep the bedroom door closed to maintain a clean sleeping zone",
      ],
      why: "Keeping the sleeping room sealed overnight lowers particle exposure while asleep.",
    },
  ],
  indoorAir: {
    diyFilter: {
      include: true,
      materials: [
        "One standard 20-inch box fan in good condition",
        "Four MERV 13 or better furnace filters",
        "Duct tape or packing tape",
        "Cardboard for bottom shroud",
      ],
      steps: [
        "Tape the four filters together into a cube, ensuring airflow arrows point inward",
        "Tape a cardboard square securely across the bottom opening",
        "Place the box fan on top with air blowing outward away from the cube",
        "Seal all seams with tape to ensure air passes through the filters",
      ],
      safetyNote:
        "Use a fan in good condition, never leave it unattended while damaged, and keep away from water.",
    },
    tips: [
      {
        topicId: "windows-closed",
        text: "Keep windows closed during rush hours.",
      },
      {
        topicId: "wet-mopping",
        text: "Use wet mopping rather than dry sweeping to prevent stirring settled dust.",
      },
      {
        topicId: "indoor-smoking",
        text: "Smoke outside and away from windows and doors, never in the rooms where others spend time.",
      },
      {
        topicId: "exhaust-or-chimney",
        text: "Run exhaust fans while cooking with oils or gas.",
      },
    ],
  },
  lowEmissionChoices: [
    {
      topicId: "public-transit",
      swap: "Take public transit or metro for longer trips",
      benefit: "Reduces neighborhood vehicle emissions and congestion.",
    },
    {
      topicId: "avoid-idling",
      swap: "Turn off vehicle engine while stopped",
      benefit: "Reduces cold-start engine pollution and overall fuel use.",
    },
  ],
  impact: [
    {
      factorId: "car-or-two-wheeler",
      effect:
        "Substantially lowers daily road-level tailpipe particulate inhalation.",
    },
    {
      factorId: "high-outdoor-hours",
      effect:
        "Minimizes deep-lung air exchange during the day's highest pollution window.",
    },
  ],
  disclaimer:
    "Estimates and guidance based on air quality data, not medical advice.",
};
