export const GEMINI_RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    headline: {
      type: "STRING",
      description:
        "Brief headline summarizing the day's air quality context (max 80 chars).",
    },
    todaySummary: {
      type: "STRING",
      description:
        "Concise summary of routine recommendations for today (max 240 chars).",
    },
    dailyPlan: {
      type: "ARRAY",
      description:
        "Chronological daily schedule covering Morning, Afternoon, Evening, and Night.",
      items: {
        type: "OBJECT",
        properties: {
          slot: {
            type: "STRING",
            enum: ["Morning", "Afternoon", "Evening", "Night"],
          },
          actions: {
            type: "ARRAY",
            items: { type: "STRING" },
            description: "1 to 3 practical routine steps for this slot.",
          },
          why: {
            type: "STRING",
            description:
              "Single sentence explaining the effect of these actions.",
          },
        },
        required: ["slot", "actions", "why"],
      },
    },
    indoorAir: {
      type: "OBJECT",
      properties: {
        diyFilter: {
          type: "OBJECT",
          properties: {
            include: { type: "BOOLEAN" },
            materials: { type: "ARRAY", items: { type: "STRING" } },
            steps: { type: "ARRAY", items: { type: "STRING" } },
            safetyNote: { type: "STRING" },
          },
          required: ["include", "materials", "steps", "safetyNote"],
        },
        tips: {
          type: "ARRAY",
          items: { type: "STRING" },
          description: "Up to 5 actionable indoor air quality tips.",
        },
      },
      required: ["diyFilter", "tips"],
    },
    lowEmissionChoices: {
      type: "ARRAY",
      description: "Up to 4 practical low emission swaps (empty if under-18).",
      items: {
        type: "OBJECT",
        properties: {
          swap: { type: "STRING" },
          benefit: { type: "STRING" },
        },
        required: ["swap", "benefit"],
      },
    },
    impact: {
      type: "ARRAY",
      description:
        "Up to 4 qualitative impacts of the choices without invented statistics.",
      items: {
        type: "OBJECT",
        properties: {
          choice: { type: "STRING" },
          effect: { type: "STRING" },
        },
        required: ["choice", "effect"],
      },
    },
    disclaimer: {
      type: "STRING",
      description:
        "Clear statement that this is air quality guidance and not medical advice.",
    },
  },
  required: [
    "headline",
    "todaySummary",
    "dailyPlan",
    "indoorAir",
    "lowEmissionChoices",
    "impact",
    "disclaimer",
  ],
} as const;
