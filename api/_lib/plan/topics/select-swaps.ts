import type { FactSheet } from "../fact-sheet-types.js";
import { SWAP_TOPICS, type KnowledgeTopic } from "./topic-types.js";

const MAX_SWAPS = 3;

const KNOWN_COMMUTE_IDS = new Set([
  "walk",
  "bicycle-or-two-wheeler",
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
  const mobLabel = factSheet.mobilityLabel.toLowerCase();
  const hasKnownCommute = KNOWN_COMMUTE_IDS.has(mobility);

  if (factSheet.cookingWithBiomass) {
    selectedIds.push("cleaner-cooking-fuel");
  }

  if (!hasKnownCommute) {
    selectedIds.push("combine-errands", "never-burn-waste");
  } else {
    const isWalkerOrCyclist =
      mobility === "walk" ||
      mobility === "bicycle-or-two-wheeler" ||
      mobLabel.includes("walk") ||
      mobLabel.includes("bicycle");

    const isTransitUser =
      mobility === "bus-or-metro" ||
      mobLabel.includes("bus") ||
      mobLabel.includes("metro");

    const isMostlyIndoors =
      mobility === "mostly-indoors" || mobLabel.includes("mostly indoors");

    const isMotorizedUser =
      mobility === "car" ||
      mobility === "auto-or-cab" ||
      mobility === "bicycle-or-two-wheeler" ||
      mobLabel.includes("car") ||
      mobLabel.includes("cab") ||
      mobLabel.includes("two-wheeler");

    if (!isWalkerOrCyclist && !isMostlyIndoors) {
      selectedIds.push("walking-or-cycling");
    }
    if (!isTransitUser && !isMostlyIndoors) {
      selectedIds.push("public-transit");
    }
    if (isMotorizedUser) {
      selectedIds.push("avoid-idling");
    }
    selectedIds.push("never-burn-waste");
  }

  const cappedIds = selectedIds.slice(0, MAX_SWAPS);
  return cappedIds
    .map((id) => SWAP_TOPICS.find((t) => t.id === id))
    .filter((t): t is KnowledgeTopic => t !== undefined);
}
