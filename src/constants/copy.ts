export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    text: "Pick your city. We read today's air quality for it from the public CPCB real-time data.",
  },
  {
    step: 2,
    text: "Answer a few questions. About nine short ones on your routine, your home and who lives with you.",
  },
  {
    step: 3,
    text: "Get your plan. Gemini turns your answers and the air quality data into a plan for today, with the reasons behind each suggestion.",
  },
] as const;

export const HOW_IT_WORKS_NOTE =
  "The air quality number comes from CPCB data and our own calculations. Gemini only writes your advice and never decides the air quality. We don't save your answers. A summary of them is sent to Google's Gemini to write your plan.";

export const HOW_IT_WORKS_DISCLAIMER = "Estimates, not medical advice.";

export const HOW_IT_WORKS_TITLE = "How Clear Day works";

export const SAMPLE_BANNER_TEXT =
  "Sample data is on. Showing a saved example, not live readings.";

export const APP_NAME = "Clear Day";

export const NAV_LABELS = {
  howItWorks: "How it works",
  sampleData: "Sample data",
} as const;
