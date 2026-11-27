export interface CommuteTopic {
  id: string;
  mobilityId: string;
  title: string;
  detail: string;
}

const AQI_MASK_THRESHOLD = 101;

export const COMMUTE_TOPICS: readonly CommuteTopic[] = [
  {
    id: "commute-car",
    mobilityId: "car",
    title: "Car commute precautions",
    detail:
      "Keep windows up, set AC to recirculate, do not idle, and close fresh-air vents before queues.",
  },
  {
    id: "commute-bus-or-metro",
    mobilityId: "bus-or-metro",
    title: "Public transit commute precautions",
    detail:
      "Wear a well-fitted mask rated N95 or FFP2 if you own one, avoid waiting beside roads, and choose the less crowded carriage or the metro over a roadside stop.",
  },
  {
    id: "commute-bicycle",
    mobilityId: "bicycle",
    title: "Bicycle commute precautions",
    detail:
      "Wear a well-fitted N95 mask, avoid peak traffic hours, and take a quieter lane or side street.",
  },
  {
    id: "commute-motorbike",
    mobilityId: "motorbike-or-scooter",
    title: "Motorbike or scooter commute precautions",
    detail:
      "Wear a well-fitted N95 mask under your helmet if you own one, avoid peak traffic hours, and take quieter side streets where possible.",
  },
  {
    id: "commute-walk",
    mobilityId: "walk",
    title: "Walking route adjustments",
    detail:
      "Walk on quieter streets away from main roads, and limit brisk outdoor walking during morning and evening traffic peaks.",
  },
] as const;

const LOW_AQI_COMMUTE_DETAILS: Record<string, string> = {
  "commute-bus-or-metro":
    "Avoid waiting beside busy roadside traffic and choose a less crowded carriage or metro entrance where available.",
  "commute-bicycle":
    "Avoid peak traffic hours and take a quieter lane or side street away from main roads.",
  "commute-motorbike":
    "Avoid peak traffic hours and take quieter side streets away from dense traffic queues where possible.",
};

export function selectCommuteTopic(
  mobilityId: string,
  aqiValue = 150
): CommuteTopic | null {
  const targetId = mobilityId === "auto-or-cab" ? "car" : mobilityId;
  const topic = COMMUTE_TOPICS.find((t) => t.mobilityId === targetId) ?? null;
  if (!topic) return null;

  if (aqiValue < AQI_MASK_THRESHOLD && LOW_AQI_COMMUTE_DETAILS[topic.id]) {
    return { ...topic, detail: LOW_AQI_COMMUTE_DETAILS[topic.id]! };
  }
  return topic;
}
