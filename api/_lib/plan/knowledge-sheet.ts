import {
  ALL_KNOWLEDGE_TOPICS,
  IMPACT_TOPICS,
  INDOOR_TOPICS,
  SWAP_TOPICS,
  type KnowledgeTopic,
  type TopicSection,
} from "./topics/topic-types.js";

export {
  ALL_KNOWLEDGE_TOPICS,
  IMPACT_TOPICS,
  INDOOR_TOPICS,
  SWAP_TOPICS,
  type KnowledgeTopic,
  type TopicSection,
};

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

export const INDOOR_AIR_FACTS: readonly string[] = INDOOR_TOPICS.map(
  (t) => t.detail
);

export const LOW_EMISSION_SWAPS: readonly string[] = SWAP_TOPICS.map(
  (t) => t.detail
);
