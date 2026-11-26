export const GEMINI_RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    headline: {
      type: "STRING",
      description:
        "Brief headline summarizing air quality context (max 80 chars).",
    },
    todaySummary: {
      type: "STRING",
      description:
        "Concise summary of routine recommendations today (max 240 chars).",
    },
    goodHabits: {
      type: "ARRAY",
      description:
        "Up to 3 positive clean-air habits the user is already doing.",
      items: {
        type: "OBJECT",
        properties: {
          topicId: { type: "STRING" },
          text: { type: "STRING" },
        },
        required: ["topicId", "text"],
      },
    },
    dailyPlan: {
      type: "ARRAY",
      description:
        "Schedule covering Morning, Afternoon, Evening (2-3 actions), and Night (1-2 actions).",
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
            description: "Practical routine steps (2-3 day slots, 1-2 Night).",
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
          description: "Indoor tips rewritten with their topicId.",
          items: {
            type: "OBJECT",
            properties: {
              topicId: { type: "STRING" },
              text: { type: "STRING" },
            },
            required: ["topicId", "text"],
          },
        },
      },
      required: ["diyFilter", "tips"],
    },
    lowEmissionChoices: {
      type: "ARRAY",
      description: "Low emission swaps with topicId (empty if under-18).",
      items: {
        type: "OBJECT",
        properties: {
          topicId: { type: "STRING" },
          swap: { type: "STRING" },
          benefit: { type: "STRING" },
        },
        required: ["topicId", "swap", "benefit"],
      },
    },
    impact: {
      type: "ARRAY",
      description: "Top impact factors in order without numbers.",
      items: {
        type: "OBJECT",
        properties: {
          factorId: { type: "STRING" },
          effect: { type: "STRING" },
        },
        required: ["factorId", "effect"],
      },
    },
    disclaimer: {
      type: "STRING",
      description: "Guidance based on air quality, not medical advice.",
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
