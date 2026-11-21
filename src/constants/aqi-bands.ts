export interface AqiBand {
  id: string;
  label: string;
  min: number;
  max: number;
  colorToken: string;
  color: string;
  guidance: string;
}

export const AQI_BANDS: readonly AqiBand[] = [
  {
    id: "good",
    label: "Good",
    min: 0,
    max: 50,
    colorToken: "var(--color-good)",
    color: "#2EB67D",
    guidance: "Air is clean. Enjoy time outdoors.",
  },
  {
    id: "satisfactory",
    label: "Satisfactory",
    min: 51,
    max: 100,
    colorToken: "var(--color-satisfactory)",
    color: "#9BD84E",
    guidance:
      "Fine for most people. Very sensitive people may notice mild discomfort.",
  },
  {
    id: "moderate",
    label: "Moderate",
    min: 101,
    max: 200,
    colorToken: "var(--color-moderate)",
    color: "#F5C842",
    guidance:
      "People with asthma or lung conditions may feel discomfort. Limit long outdoor exertion.",
  },
  {
    id: "poor",
    label: "Poor",
    min: 201,
    max: 300,
    colorToken: "var(--color-poor)",
    color: "#F28C28",
    guidance:
      "Long time outdoors can cause breathing discomfort. Cut back on outdoor time.",
  },
  {
    id: "very-poor",
    label: "Very Poor",
    min: 301,
    max: 400,
    colorToken: "var(--color-very-poor)",
    color: "#E5484D",
    guidance:
      "Prolonged exposure may affect breathing for everyone. Keep outdoor time short.",
  },
  {
    id: "severe",
    label: "Severe",
    min: 401,
    max: 500,
    colorToken: "var(--color-severe)",
    color: "#9B1C31",
    guidance:
      "Even healthy people may be affected. Stay indoors where you can.",
  },
] as const;
