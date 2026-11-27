export type ExposureLevel = "High" | "Moderate" | "Low";

export const TOP_FACTOR_LABELS: Record<string, string> = {
  "indoor-smoking": "Indoor smoking",
  "high-outdoor-hours": "Long hours outdoors",
  "regular-outdoor-sport": "Regular outdoor sport",
  "biomass-cooking": "Cooking with wood or biomass",
  "car-or-two-wheeler": "Motorised commute (car, bike or auto)",
  "no-purifier-with-care":
    "No air purifier with children or older adults at home",
  "no-exhaust-cooking": "Cooking without an exhaust",
};

export const TOP_FACTOR_WEIGHTS: Record<string, number> = {
  "indoor-smoking": 100,
  "high-outdoor-hours": 90,
  "regular-outdoor-sport": 88,
  "biomass-cooking": 85,
  "car-or-two-wheeler": 70,
  "no-purifier-with-care": 60,
  "no-exhaust-cooking": 50,
};

const AQI_SEVERE_THRESHOLD = 201;
const AQI_MODERATE_THRESHOLD = 101;
const LEVEL_HIGH_SCORE = 85;
const LEVEL_MODERATE_SCORE = 55;

export function computeExposureLevel(
  factorId: string,
  aqiValue: number
): ExposureLevel {
  const weight = TOP_FACTOR_WEIGHTS[factorId] ?? 50;
  const aqiScale =
    aqiValue >= AQI_SEVERE_THRESHOLD
      ? 1.2
      : aqiValue >= AQI_MODERATE_THRESHOLD
        ? 1.0
        : 0.75;
  const score = weight * aqiScale;
  if (score >= LEVEL_HIGH_SCORE) return "High";
  if (score >= LEVEL_MODERATE_SCORE) return "Moderate";
  return "Low";
}
