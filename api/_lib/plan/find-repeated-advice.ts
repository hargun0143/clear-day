import type { GeneratedPlan } from "./plan-schema.js";
import { TOPIC_KEYWORDS } from "./topics/topic-signatures.js";

export interface RepeatPair {
  a: string;
  b: string;
}

const NEAR_DUPLICATE_WORDS = 6;

function normalise(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function firstWords(text: string, count: number): string {
  return text.split(" ").slice(0, count).join(" ");
}

function getSectionTexts(plan: GeneratedPlan): Record<string, string> {
  const daily = plan.dailyPlan.flatMap((s) => [...s.actions, s.why]).join(" ");
  const indoor = [
    ...plan.indoorAir.tips,
    plan.indoorAir.diyFilter.safetyNote,
  ].join(" ");
  const swaps = plan.lowEmissionChoices
    .flatMap((c) => [c.swap, c.benefit])
    .join(" ");
  const impact = plan.impact.flatMap((i) => [i.choice, i.effect]).join(" ");
  return {
    dailyPlan: normalise(daily),
    indoorAir: normalise(indoor),
    lowEmissionChoices: normalise(swaps),
    impact: normalise(impact),
  };
}

export function findRepeatedAdvice(plan: GeneratedPlan): RepeatPair[] {
  const pairs: RepeatPair[] = [];

  // Sentence-level exact and near duplicates first
  const sentences: string[] = [
    ...plan.dailyPlan.flatMap((s) => [
      ...s.actions.map(normalise),
      normalise(s.why),
    ]),
    ...plan.indoorAir.tips.map(normalise),
    ...plan.lowEmissionChoices.flatMap((c) => [
      normalise(c.swap),
      normalise(c.benefit),
    ]),
    ...plan.impact.flatMap((i) => [normalise(i.choice), normalise(i.effect)]),
  ];

  for (let i = 0; i < sentences.length; i++) {
    for (let j = i + 1; j < sentences.length; j++) {
      const a = sentences[i]!;
      const b = sentences[j]!;
      if (!a || !b) continue;
      const isExact = a === b;
      const isNear =
        !isExact &&
        a.split(" ").length >= NEAR_DUPLICATE_WORDS &&
        b.split(" ").length >= NEAR_DUPLICATE_WORDS &&
        firstWords(a, NEAR_DUPLICATE_WORDS) ===
          firstWords(b, NEAR_DUPLICATE_WORDS);
      if (isExact || isNear) pairs.push({ a, b });
    }
  }

  // Topic ID usage across multiple distinct sections
  const sectionTexts = getSectionTexts(plan);
  const sections = Object.keys(sectionTexts);

  for (const [topicId, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    const matchingSections: string[] = [];
    for (const sec of sections) {
      if (keywords.some((kw) => sectionTexts[sec]!.includes(kw))) {
        matchingSections.push(sec);
      }
    }
    if (matchingSections.length > 1) {
      for (let i = 0; i < matchingSections.length; i++) {
        for (let j = i + 1; j < matchingSections.length; j++) {
          pairs.push({
            a: `${topicId} in ${matchingSections[i]}`,
            b: `${topicId} in ${matchingSections[j]}`,
          });
        }
      }
    }
  }

  return pairs;
}
