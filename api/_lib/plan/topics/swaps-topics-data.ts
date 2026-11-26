import type { KnowledgeTopic } from "./indoor-topics-data.js";

export const SWAP_TOPICS: readonly KnowledgeTopic[] = [
  {
    id: "walking-or-cycling",
    section: "swaps",
    title: "Walk or cycle for short neighborhood trips",
    detail:
      "Replace short motor vehicle trips with walking or cycling when local air permits.",
  },
  {
    id: "public-transit",
    section: "swaps",
    title: "Take public transit instead of driving",
    detail:
      "Use metro or public bus routes rather than private personal motor vehicles.",
  },
  {
    id: "avoid-idling",
    section: "swaps",
    title: "Turn off vehicle engine while stopped",
    detail:
      "Avoid idling your vehicle engine at traffic signals or while parked waiting.",
  },
  {
    id: "cleaner-cooking-fuel",
    section: "swaps",
    title: "Transition to clean cooking fuels",
    detail:
      "Shift away from wood, coal or solid biomass toward LPG, induction, or electric cooking.",
  },
  {
    id: "combine-errands",
    section: "swaps",
    title: "Combine errands into fewer trips",
    detail:
      "Group daily errands into a single outing to cut down total travel and outdoor exposure.",
  },
  {
    id: "never-burn-waste",
    section: "swaps",
    title: "Do not burn garden waste or rubbish",
    detail:
      "Never burn leaves, garden clippings, plastic, or household solid waste openly.",
  },
] as const;

export const IMPACT_TOPICS: readonly KnowledgeTopic[] = [
  {
    id: "impact-vehicle",
    section: "impact",
    title: "Motor vehicle usage",
    detail:
      "Lowering personal vehicle usage directly cuts road-level tailpipe emissions and personal exposure.",
  },
  {
    id: "impact-cooking",
    section: "impact",
    title: "Solid cooking fuels",
    detail:
      "Transitioning away from biomass or coal cooking eliminates concentrated indoor particulate smoke.",
  },
  {
    id: "impact-smoking",
    section: "impact",
    title: "Indoor smoking exposure",
    detail:
      "Keeping living areas completely smoke-free protects household members from fine toxic particles.",
  },
  {
    id: "impact-outdoor",
    section: "impact",
    title: "High-exposure outdoor hours",
    detail:
      "Rescheduling heavy exertion away from pollution peaks minimizes deep-lung particulate intake.",
  },
  {
    id: "impact-filtration",
    section: "impact",
    title: "Indoor filtration and sealing",
    detail:
      "Maintaining closed rooms with active filtration provides a substantially cleaner indoor baseline.",
  },
] as const;
