export interface ImpactItem {
  id: string;
  title: string;
  description: string;
}

export const IMPACT_HEADING = "How the air around you affects everyone";

export const IMPACT_ITEMS: readonly ImpactItem[] = [
  {
    id: "breathing",
    title: "What you're breathing",
    description:
      "Fine particles called PM2.5 and PM10 are small enough to travel deep into your lungs. In winter smog they build up and stay close to the ground.",
  },
  {
    id: "affects",
    title: "Who it affects most",
    description:
      "Children, older adults and people with asthma or heart conditions feel it first, but heavy smog can affect healthy people too.",
  },
  {
    id: "origin",
    title: "Where it comes from",
    description:
      "Vehicle exhaust, burning of crop residue, garbage and fuel, construction dust and cooking smoke all add up, and cold still air keeps it from clearing.",
  },
  {
    id: "change",
    title: "What you can change",
    description:
      "When you go out, how you travel and how you run your home all change what you and your neighbours breathe. Your plan shows how.",
  },
] as const;
