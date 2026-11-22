import type { FactSheet } from "../fact-sheet-types.js";
import { SWAP_TOPICS, type KnowledgeTopic } from "./topic-types.js";

const MAX_SWAPS = 3;

export function selectSwaps(factSheet: FactSheet): KnowledgeTopic[] {
  if (factSheet.isUnder18) {
    return [];
  }

  const selectedIds: string[] = [];
  const mobility = factSheet.mobilityId || "";
  const mobLabel = factSheet.mobilityLabel.toLowerCase();

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

  // cleaner-cooking-fuel when cooking uses wood, coal or biomass
  if (factSheet.cookingWithBiomass) {
    selectedIds.push("cleaner-cooking-fuel");
  }

  // walking-or-cycling (unless already walks, cycles, or mostly indoors)
  if (!isWalkerOrCyclist && !isMostlyIndoors) {
    selectedIds.push("walking-or-cycling");
  }

  // public-transit (unless already uses bus/metro, or mostly indoors)
  if (!isTransitUser && !isMostlyIndoors) {
    selectedIds.push("public-transit");
  }

  // avoid-idling (only for car, auto-or-cab, or two-wheeler users)
  if (isMotorizedUser) {
    selectedIds.push("avoid-idling");
  }

  // never-burn-waste (keep always)
  selectedIds.push("never-burn-waste");

  const cappedIds = selectedIds.slice(0, MAX_SWAPS);
  return cappedIds
    .map((id) => SWAP_TOPICS.find((t) => t.id === id))
    .filter((t): t is KnowledgeTopic => t !== undefined);
}
