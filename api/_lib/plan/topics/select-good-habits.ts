import type { FactSheet } from "../fact-sheet-types.js";

const MAX_GOOD_HABITS = 3;

export function selectGoodHabits(factSheet: FactSheet): string[] {
  const habits: string[] = [];
  const mobility = factSheet.mobilityId || "";
  const mobLabel = factSheet.mobilityLabel.toLowerCase();

  // walks or cycles
  if (
    mobility === "walk" ||
    mobility === "bicycle-or-two-wheeler" ||
    mobLabel.includes("walk") ||
    mobLabel.includes("bicycle")
  ) {
    habits.push("Walking or cycling for daily travel");
  }

  // uses public transport
  if (
    mobility === "bus-or-metro" ||
    mobLabel.includes("bus") ||
    mobLabel.includes("metro")
  ) {
    habits.push("Using public transit for commuting");
  }

  // has a purifier
  if (factSheet.hasPurifier) {
    habits.push("Running an air purifier at home");
  }

  // has an exhaust or chimney
  if (factSheet.hasExhaust) {
    habits.push("Using a kitchen exhaust or chimney while cooking");
  }

  // no indoor smoking
  if (!factSheet.indoorSmoking) {
    habits.push("Maintaining a smoke-free home environment");
  }

  // mostly indoors
  if (mobility === "mostly-indoors" || mobLabel.includes("mostly indoors")) {
    habits.push("Staying mostly indoors during peak outdoor pollution");
  }

  return habits.slice(0, MAX_GOOD_HABITS);
}
