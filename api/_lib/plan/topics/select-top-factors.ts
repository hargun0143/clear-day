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
    weight: 100,
    label: "Indoor smoking",
    description: "Indoor smoke adds dense, toxic particulates inside the home.",
    applies: (fs) => fs.indoorSmoking,
  },
  {
    id: "high-outdoor-hours",
    weight: 90,
    label: "High outdoor hours",
    description:
      "Extended time outdoors multiplies direct exposure to ambient particulate spikes.",
    applies: (fs) =>
      fs.highOutdoorHours ||
      fs.roleLabel.toLowerCase().includes("outdoor") ||
      fs.roleSpecificAnswerLabel.toLowerCase().includes("sport") ||
      fs.roleSpecificAnswerLabel.toLowerCase().includes("outdoor"),
  },
  {
    id: "biomass-cooking",
    weight: 85,
    label: "Wood or biomass cooking",
    description:
      "Solid fuel combustion releases intense indoor particle concentrations.",
    applies: (fs) => fs.cookingWithBiomass,
  },
  {
    id: "car-or-two-wheeler",
    weight: 70,
    label: "Motorised commute (car, bike or auto)",
    description:
      "Road-level vehicular travel places you directly in traffic exhaust plumes.",
    applies: (fs) =>
      fs.mobilityId === "car" ||
      fs.mobilityId === "auto-or-cab" ||
      fs.mobilityId === "motorbike-or-scooter",
  },
  {
    id: "no-purifier-with-care",
    weight: 60,
    label: "No purifier with extra-care household members",
    description:
      "Household members needing care lack a mechanical filtration baseline indoors.",
    applies: (fs) => !fs.hasPurifier && fs.vulnerableHome,
  },
  {
    id: "no-exhaust-cooking",
    weight: 50,
    label: "No exhaust while cooking",
    description:
      "Cooking without mechanical exhaust traps culinary fumes and oils inside living spaces.",
    applies: (fs) =>
      !fs.hasExhaust &&
      (fs.cookingWithBiomass ||
        fs.roleLabel.toLowerCase().includes("homemaker")),
  },
] as const;

export const MAX_TOP_FACTORS = 3;

export function selectTopFactors(factSheet: FactSheet): string[] {
  return FACTOR_WEIGHTS.filter((f) => f.applies(factSheet))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, MAX_TOP_FACTORS)
    .map((f) => f.id);
}
