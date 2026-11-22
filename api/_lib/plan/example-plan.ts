import type { GeneratedPlan } from "./plan-schema.js";

export const EXAMPLE_PLAN: GeneratedPlan = {
  headline: "Managing your day with Moderate air quality in Delhi",
  todaySummary:
    "Air quality is in the Moderate band today. Keep strenuous outdoor exertion limited, shift high-energy workouts indoors, and ventilate during afternoon hours.",
  dailyPlan: [
    {
      slot: "Morning",
      actions: [
        "Keep windows closed during peak morning traffic hours",
        "Perform light stretching indoors rather than outdoor running",
      ],
      why: "Particulate levels typically peak in early morning when atmospheric dispersion is lowest.",
    },
    {
      slot: "Afternoon",
      actions: [
        "Briefly ventilate the home if outdoor air clears up",
        "Run kitchen exhaust while preparing lunch",
      ],
      why: "Solar heating improves vertical air mixing and reduces ambient ground-level concentrations.",
    },
    {
      slot: "Evening",
      actions: [
        "Wear an N95 mask if commuting through heavy traffic",
        "Close external doors before dust and vehicle exhaust settle",
      ],
      why: "Evening commutes create localized spikes of fine vehicle emissions along roadways.",
    },
    {
      slot: "Night",
      actions: [
        "Run your air purifier or DIY box-fan filter in the bedroom",
        "Keep bedroom windows and doors closed overnight",
      ],
      why: "Uninterrupted clean air overnight helps rest respiratory passages after daytime exposure.",
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
