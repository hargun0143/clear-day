export interface CommuteTopic {
  id: string;
  mobilityId: string;
  title: string;
  detail: string;
}

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
    id: "commute-two-wheeler",
    mobilityId: "bicycle-or-two-wheeler",
    title: "Two-wheeler and bicycle precautions",
    detail:
      "Wear a well-fitted N95 mask, avoid peak traffic hours, and take a quieter lane or side street.",
  },
  {
    id: "commute-walk",
    mobilityId: "walk",
    title: "Walking route adjustments",
    detail:
      "Walk on quieter streets away from main roads, and limit brisk outdoor walking during morning and evening traffic peaks.",
  },
] as const;

export function selectCommuteTopic(mobilityId: string): CommuteTopic | null {
  if (mobilityId === "auto-or-cab") {
    return COMMUTE_TOPICS.find((t) => t.mobilityId === "car") ?? null;
  }
  return COMMUTE_TOPICS.find((t) => t.mobilityId === mobilityId) ?? null;
}
