import type { FactSheet } from "../fact-sheet-types.js";
import { INDOOR_TOPICS, type KnowledgeTopic } from "./topic-types.js";

const MAX_INDOOR_TOPICS = 5;

export function selectIndoorTopics(factSheet: FactSheet): KnowledgeTopic[] {
  const selectedIds: string[] = [];

  // windows-closed (when AQI is 101 or above)
  if (factSheet.aqiValue >= 101) {
    selectedIds.push("windows-closed");
  }

  // wet-mopping (always)
  selectedIds.push("wet-mopping");

  // indoor-smoking (only if indoorSmoking)
  if (factSheet.indoorSmoking) {
    selectedIds.push("indoor-smoking");
  }

  const cooks =
    factSheet.cookingWithBiomass ||
    factSheet.roleLabel.toLowerCase().includes("homemaker");

  if (factSheet.hasExhaust) {
    selectedIds.push("exhaust-or-chimney");
  } else if (cooks) {
    selectedIds.push(
      factSheet.aqiValue <= 100
        ? "cooking-no-exhaust-low-aqi"
        : "cooking-no-exhaust-high-aqi"
    );
  }

  // purifier use and placement and filter care (only if hasPurifier)
  if (factSheet.hasPurifier) {
    selectedIds.push("purifier-care");
  }

  // the DIY filter (if not hasPurifier and the budget is nothing-diy-only or under-1000, or if under-18)
  const isDiyBudget =
    factSheet.budgetId === "nothing-diy-only" ||
    factSheet.budgetId === "under-1000" ||
    Boolean(
      factSheet.budgetLabel &&
      (factSheet.budgetLabel.toLowerCase().includes("diy") ||
        factSheet.budgetLabel.toLowerCase().includes("1,000"))
    );

  if (!factSheet.hasPurifier && (isDiyBudget || factSheet.isUnder18)) {
    selectedIds.push("diy-filter");
  }

  // AC recirculation (only if hasAC)
  if (factSheet.hasAC) {
    selectedIds.push("ac-recirculation");
  }

  const cappedIds = selectedIds.slice(0, MAX_INDOOR_TOPICS);
  return cappedIds
    .map((id) => INDOOR_TOPICS.find((t) => t.id === id))
    .filter((t): t is KnowledgeTopic => t !== undefined);
}
