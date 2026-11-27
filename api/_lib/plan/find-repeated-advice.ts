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
    ...plan.indoorAir.tips.map((t) => t.text),
    plan.indoorAir.diyFilter.safetyNote,
  ].join(" ");
  const swaps = plan.lowEmissionChoices
    .flatMap((c) => [c.swap, c.benefit])
    .join(" ");
  const impact = plan.impact.flatMap((i) => [i.factorId, i.effect]).join(" ");
  return {
    dailyPlan: normalise(daily),
    indoorAir: normalise(indoor),
    lowEmissionChoices: normalise(swaps),
    impact: normalise(impact),
  };
}

const SMOKE_FREE_HOME_REGEX = /\bsmoke[- ]?free\s+home\b/gi;

function findSmokeFreeRepeats(plan: GeneratedPlan): RepeatPair[] {
  const sections: Record<string, string> = {
    summary: `${plan.headline} ${plan.todaySummary}`,
    dailyPlan: plan.dailyPlan.flatMap((s) => [...s.actions, s.why]).join(" "),
    indoorAir: plan.indoorAir.tips.map((t) => t.text).join(" "),
    lowEmissionChoices: plan.lowEmissionChoices
      .flatMap((c) => [c.swap, c.benefit])
      .join(" "),
    impact: plan.impact.flatMap((i) => [i.factorId, i.effect]).join(" "),
    goodHabits: (plan.goodHabits ?? []).map((h) => h.text).join(" "),
  };

  const hits: string[] = [];
  for (const [sec, text] of Object.entries(sections)) {
    const matches = text.match(SMOKE_FREE_HOME_REGEX);
    if (matches && matches.length > 0) hits.push(sec);
  }
  const hasOutsideGoodHabits = hits.some((s) => s !== "goodHabits");
  if (hits.length > 1 || (hits.length === 1 && hasOutsideGoodHabits)) {
    return hits.map((sec) => ({
      a: `smoke-free-home in ${sec}`,
      b: "smoke-free-home",
    }));
  }
  return [];
}

export function findRepeatedAdvice(plan: GeneratedPlan): RepeatPair[] {
  const pairs: RepeatPair[] = [];

  const sentences: string[] = [
    ...plan.dailyPlan.flatMap((s) => [
      ...s.actions.map(normalise),
      normalise(s.why),
    ]),
    ...plan.indoorAir.tips.map((t) => normalise(t.text)),
    ...plan.lowEmissionChoices.flatMap((c) => [
      normalise(c.swap),
      normalise(c.benefit),
    ]),
    ...plan.impact.flatMap((i) => [normalise(i.factorId), normalise(i.effect)]),
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

  return [...pairs, ...findSmokeFreeRepeats(plan)];
}
