import {
  TOP_FACTOR_LABELS,
  TOP_FACTOR_WEIGHTS,
} from "../../../../src/constants/top-factors.js";
import type { FactSheet } from "../fact-sheet-types.js";

export interface FactorWeight {
  id: string;
  weight: number;
  label: string;
  description: string;
  applies: (fs: FactSheet) => boolean;
}

export const FACTOR_WEIGHTS: readonly FactorWeight[] = [
  {
    id: "indoor-smoking",
    weight: TOP_FACTOR_WEIGHTS["indoor-smoking"]!,
    label: TOP_FACTOR_LABELS["indoor-smoking"]!,
    description: "Indoor smoke adds dense, toxic particulates inside the home.",
    applies: (fs) => fs.indoorSmoking,
  },
  {
    id: "high-outdoor-hours",
    weight: TOP_FACTOR_WEIGHTS["high-outdoor-hours"]!,
    label: TOP_FACTOR_LABELS["high-outdoor-hours"]!,
    description:
      "Extended time outdoors multiplies direct exposure to ambient particulate spikes.",
    applies: (fs) => fs.highOutdoorHours,
  },
  {
    id: "regular-outdoor-sport",
    weight: TOP_FACTOR_WEIGHTS["regular-outdoor-sport"]!,
    label: TOP_FACTOR_LABELS["regular-outdoor-sport"]!,
    description:
      "Active outdoor sports increase air intake during elevated pollution hours.",
    applies: (fs) => fs.regularOutdoorSport,
  },
  {
    id: "biomass-cooking",
    weight: TOP_FACTOR_WEIGHTS["biomass-cooking"]!,
    label: TOP_FACTOR_LABELS["biomass-cooking"]!,
    description:
      "Solid fuel combustion releases intense indoor particle concentrations.",
    applies: (fs) => fs.cookingWithBiomass,
  },
  {
    id: "car-or-two-wheeler",
    weight: TOP_FACTOR_WEIGHTS["car-or-two-wheeler"]!,
    label: TOP_FACTOR_LABELS["car-or-two-wheeler"]!,
    description:
      "Road-level vehicular travel places you directly in traffic exhaust plumes.",
    applies: (fs) =>
      fs.mobilityId === "car" ||
      fs.mobilityId === "auto-or-cab" ||
      fs.mobilityId === "motorbike-or-scooter",
  },
  {
    id: "no-purifier-with-care",
    weight: TOP_FACTOR_WEIGHTS["no-purifier-with-care"]!,
    label: TOP_FACTOR_LABELS["no-purifier-with-care"]!,
    description:
      "Household members needing care lack a mechanical filtration baseline indoors.",
    applies: (fs) => !fs.hasPurifier && fs.vulnerableHome,
  },
  {
    id: "no-exhaust-cooking",
    weight: TOP_FACTOR_WEIGHTS["no-exhaust-cooking"]!,
    label: TOP_FACTOR_LABELS["no-exhaust-cooking"]!,
    description:
      "Cooking without mechanical exhaust traps culinary fumes and oils inside living spaces.",
    applies: (fs) =>
      !fs.hasExhaust && (fs.cookingWithBiomass || fs.roleId === "homemaker"),
  },
] as const;

export const MAX_TOP_FACTORS = 3;

export function selectTopFactors(factSheet: FactSheet): string[] {
  return FACTOR_WEIGHTS.filter((f) => f.applies(factSheet))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, MAX_TOP_FACTORS)
    .map((f) => f.id);
}
