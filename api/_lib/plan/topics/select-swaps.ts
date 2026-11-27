import type { FactSheet } from "../fact-sheet-types.js";
import { SWAP_TOPICS, type KnowledgeTopic } from "./topic-types.js";

const MAX_SWAPS = 3;

const KNOWN_COMMUTE_IDS = new Set([
  "walk",
  "bicycle",
  "motorbike-or-scooter",
  "bus-or-metro",
  "car",
  "auto-or-cab",
  "mostly-indoors",
]);

export function selectSwaps(factSheet: FactSheet): KnowledgeTopic[] {
  if (factSheet.isUnder18) {
    return [];
  }

  const selectedIds: string[] = [];
  const mobility = factSheet.mobilityId || "";
  const hasKnownCommute = KNOWN_COMMUTE_IDS.has(mobility);

  if (factSheet.cookingWithBiomass) {
    selectedIds.push("cleaner-cooking-fuel");
  }

  if (!hasKnownCommute) {
    selectedIds.push("combine-errands", "never-burn-waste");
  } else {
    const isMotorised =
      mobility === "car" ||
      mobility === "auto-or-cab" ||
      mobility === "motorbike-or-scooter";

    if (isMotorised) {
      selectedIds.push("walking-or-cycling", "public-transit", "avoid-idling");
    }
    selectedIds.push("never-burn-waste");
  }

  const cappedIds = selectedIds.slice(0, MAX_SWAPS);
  return cappedIds
    .map((id) => SWAP_TOPICS.find((t) => t.id === id))
    .filter((t): t is KnowledgeTopic => t !== undefined);
}
