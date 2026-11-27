import {
  COMMUTE_TOPICS,
  selectCommuteTopic,
  type CommuteTopic,
} from "./topics/commute-topics-data.js";
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
  COMMUTE_TOPICS,
  IMPACT_TOPICS,
  INDOOR_TOPICS,
  SWAP_TOPICS,
  selectCommuteTopic,
  type CommuteTopic,
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

export const DEFAULT_SLOT_ACTIONS: Record<string, string[]> = {
  Morning: [
    "Keep windows and exterior doors closed before roadway traffic peaks.",
    "Schedule essential morning tasks to avoid heavy physical exertion outside.",
  ],
  Afternoon: [
    "Stay in the most shielded interior room during peak sunlight hours.",
    "Operate kitchen exhaust or keep doors closed while preparing midday meals.",
  ],
  Evening: [
    "Take quieter side streets away from main roads if travelling in the evening.",
    "Keep windows sealed as evening vehicle exhaust accumulates.",
  ],
  Night: [
    "Keep the bedroom door closed to maintain a clean sleeping zone overnight.",
  ],
};
