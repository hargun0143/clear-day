export interface DtoFixedFilterInfo {
  steps: readonly string[];
  materials: readonly string[];
  safetyNotes: readonly string[];
}

export const DIY_BOX_FAN_FILTER: DtoFixedFilterInfo = {
  materials: [
    "One standard 20-inch box fan in good condition",
    "Four MERV 13 or better furnace filters",
    "Duct tape or packing tape",
    "Cardboard for bottom shroud",
  ],
  steps: [
    "Tape the four filters together into a cube, ensuring airflow arrows point inward",
    "Tape a cardboard square securely across the bottom opening",
    "Place the box fan on top with air blowing outward away from the cube",
    "Seal all seams with tape to ensure air passes through the filters",
  ],
  safetyNotes: [
    "Use only a box fan in clean, good operating condition",
    "Never block or cover the fan motor or airflow",
    "Keep electrical cords and the fan away from water",
    "An adult must assemble or supervise building the filter",
    "Never leave a damaged, humming, or overheating fan running",
  ],
} as const;

export const INDOOR_AIR_FACTS: readonly string[] = [
  "Keep windows and doors securely closed when outdoor AQI is elevated.",
  "Avoid all indoor smoking and burning incense or mosquito coils.",
  "Use wet mopping rather than dry sweeping to prevent stirring up settled dust.",
  "Ventilate the home briefly only when outdoor air pollution is at its lowest daily level.",
] as const;

export const LOW_EMISSION_SWAPS: readonly string[] = [
  "Choose walking or cycling for short neighborhood trips where air permits.",
  "Use metro or public buses instead of driving personal motorized vehicles.",
  "Avoid vehicle idling when stopped in traffic or waiting.",
  "Never burn garden leaves, municipal solid waste, or open garbage.",
] as const;
