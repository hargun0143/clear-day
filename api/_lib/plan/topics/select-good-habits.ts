import type { FactSheet } from "../fact-sheet-types.js";

export interface GoodHabitTopic {
  id: string;
  text: string;
}

export const VETTED_GOOD_HABITS: Record<string, string> = {
  "walk-or-cycle": "Walking or cycling for daily travel",
  "public-transit": "Using public transit for commuting",
  "air-purifier": "Running an air purifier at home",
  "kitchen-exhaust": "Using a kitchen exhaust or chimney while cooking",
  "smoke-free-home": "Maintaining a smoke-free home environment",
  "mostly-indoors": "Staying mostly indoors during peak outdoor pollution",
};

const MAX_GOOD_HABITS = 3;

export function selectGoodHabits(factSheet: FactSheet): GoodHabitTopic[] {
  const habits: GoodHabitTopic[] = [];
  const mobility = factSheet.mobilityId || "";
  const mobLabel = factSheet.mobilityLabel.toLowerCase();

  if (
    mobility === "walk" ||
    mobility === "bicycle-or-two-wheeler" ||
    mobLabel.includes("walk") ||
    mobLabel.includes("bicycle")
  ) {
    habits.push({
      id: "walk-or-cycle",
      text: VETTED_GOOD_HABITS["walk-or-cycle"]!,
    });
  }

  if (
    mobility === "bus-or-metro" ||
    mobLabel.includes("bus") ||
    mobLabel.includes("metro")
  ) {
    habits.push({
      id: "public-transit",
      text: VETTED_GOOD_HABITS["public-transit"]!,
    });
  }

  if (factSheet.hasPurifier) {
    habits.push({
      id: "air-purifier",
      text: VETTED_GOOD_HABITS["air-purifier"]!,
    });
  }

  if (factSheet.hasExhaust) {
    habits.push({
      id: "kitchen-exhaust",
      text: VETTED_GOOD_HABITS["kitchen-exhaust"]!,
    });
  }

  if (!factSheet.indoorSmoking) {
    habits.push({
      id: "smoke-free-home",
      text: VETTED_GOOD_HABITS["smoke-free-home"]!,
    });
  }

  if (mobility === "mostly-indoors" || mobLabel.includes("mostly indoors")) {
    habits.push({
      id: "mostly-indoors",
      text: VETTED_GOOD_HABITS["mostly-indoors"]!,
    });
  }

  return habits.slice(0, MAX_GOOD_HABITS);
}
