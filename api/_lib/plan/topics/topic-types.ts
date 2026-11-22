import {
  INDOOR_TOPICS,
  type KnowledgeTopic,
  type TopicSection,
} from "./indoor-topics-data.js";
import { IMPACT_TOPICS, SWAP_TOPICS } from "./swaps-topics-data.js";

export {
  IMPACT_TOPICS,
  INDOOR_TOPICS,
  SWAP_TOPICS,
  type KnowledgeTopic,
  type TopicSection,
};

export const ALL_KNOWLEDGE_TOPICS: readonly KnowledgeTopic[] = [
  ...INDOOR_TOPICS,
  ...SWAP_TOPICS,
  ...IMPACT_TOPICS,
];
