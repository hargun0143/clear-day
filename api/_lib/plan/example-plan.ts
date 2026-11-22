import type { GeneratedPlan } from "./plan-schema.js";

export const EXAMPLE_PLAN: GeneratedPlan = {
  headline: "Office routine with moderate outdoor exposure in Delhi",
  todaySummary:
    "Air quality is in the Moderate band today. For an office worker commuting via transit with family at home, pace outdoor travel around peak hours and maintain a clean indoor baseline.",
  goodHabits: [
    "Using public transit for commuting",
    "Maintaining a smoke-free home environment",
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
        "Prepare meals with steady ventilation",
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
        "Establish a restful bedroom environment with sealed doors",
        "Keep evening activities calm and indoors",
      ],
      why: "Uninterrupted rest helps recovery after daytime particulate exposure.",
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
      "Keep windows closed during rush hours.",
      "Use wet mopping rather than dry sweeping to prevent stirring settled dust.",
      "Avoid all indoor smoking, burning incense, or mosquito coils.",
      "Run exhaust fans while cooking with oils or gas.",
    ],
  },
  lowEmissionChoices: [
    {
      swap: "Take public transit or metro for longer trips",
      benefit: "Reduces neighborhood vehicle emissions and congestion.",
    },
    {
      swap: "Combine short car errands into one trip",
      benefit: "Reduces cold-start engine pollution and overall fuel use.",
    },
  ],
  impact: [
    {
      choice: "Filtering indoor bedroom air",
      effect:
        "Substantially lowers overnight particulate inhalation while sleeping.",
    },
    {
      choice: "Avoiding outdoor morning exertion",
      effect:
        "Minimizes deep-lung air exchange during the day's highest pollution window.",
    },
  ],
  disclaimer:
    "Estimates and guidance based on air quality data, not medical advice.",
};
