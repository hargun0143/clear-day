import type { GeneratedPlan } from "./plan-schema.js";

export const BANNED_PHRASES: readonly string[] = [
  "check local air quality",
  "check the air quality",
  "vulnerable home",
  "breathing steady",
  "calm your lungs",
] as const;

const RELAX_BREATHING_REGEX =
  /\b(?:relax(?:ing)?|calm(?:ing)?)\s+(?:your\s+)?breathing\b/i;

function extractAllTexts(plan: GeneratedPlan): string[] {
  return [
    plan.headline,
    plan.todaySummary,
    ...plan.dailyPlan.flatMap((s) => [...s.actions, s.why]),
    ...plan.indoorAir.tips.map((t) => t.text),
    plan.indoorAir.diyFilter.safetyNote,
    ...plan.lowEmissionChoices.flatMap((c) => [c.swap, c.benefit]),
    ...plan.impact.flatMap((i) => [i.choice, i.effect]),
    plan.disclaimer,
    ...(plan.goodHabits?.map((h) => h.text) ?? []),
  ];
}

export function hasBannedPhrase(text: string): boolean {
  const lower = text.toLowerCase();
  if (BANNED_PHRASES.some((bp) => lower.includes(bp))) return true;
  return RELAX_BREATHING_REGEX.test(text);
}

export function findBannedPhrases(plan: GeneratedPlan): string[] {
  const texts = extractAllTexts(plan);
  const found = new Set<string>();
  for (const text of texts) {
    const lower = text.toLowerCase();
    for (const phrase of BANNED_PHRASES) {
      if (lower.includes(phrase)) found.add(phrase);
    }
    const match = text.match(RELAX_BREATHING_REGEX);
    if (match) found.add(match[0].toLowerCase());
  }
  return [...found];
}

function countMatches(regex: RegExp, text: string): number {
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

const EQUIPMENT_PATTERNS: Record<string, RegExp> = {
  purifier: /\b(?:air\s+)?purifiers?\b/gi,
  ac: /\b(?:ac|air\s+conditioners?)\b/gi,
  exhaust: /\bexhaust(?:s|ed|ing)?\b/gi,
  chimney: /\bchimneys?\b/gi,
  filter: /\bfilters?\b/gi,
};

export function findEquipmentViolations(plan: GeneratedPlan): string[] {
  const violations: string[] = [];
  const fullText = extractAllTexts(plan).join(" ");
  for (const [name, pattern] of Object.entries(EQUIPMENT_PATTERNS)) {
    const count = countMatches(pattern, fullText);
    if (count > 2) {
      violations.push(`${name} mentioned ${count} times (max 2)`);
    }
  }

  const outsideIndoor = [
    plan.headline,
    plan.todaySummary,
    ...plan.dailyPlan.flatMap((s) => [...s.actions, s.why]),
    ...plan.lowEmissionChoices.flatMap((c) => [c.swap, c.benefit]),
    ...plan.impact.flatMap((i) => [i.choice, i.effect]),
    plan.disclaimer,
    ...(plan.goodHabits?.map((h) => h.text) ?? []),
  ].join(" ");

  const purifierOutside = countMatches(
    EQUIPMENT_PATTERNS["purifier"]!,
    outsideIndoor
  );
  if (purifierOutside > 1) {
    violations.push(
      `purifier mentioned ${purifierOutside} times outside indoorAir (max 1)`
    );
  }
  return violations;
}

export function sanitizeBannedActions(
  plan: GeneratedPlan,
  defaultSlotActions: Record<string, string[]>
): GeneratedPlan {
  const newSlots = plan.dailyPlan.map((slot) => {
    let actions = slot.actions.filter((a) => !hasBannedPhrase(a));
    if (actions.length === 0) {
      const fallback = defaultSlotActions[slot.slot]?.[0];
      actions = [fallback ?? "Rest indoors in a sealed room."];
    }
    return { ...slot, actions };
  });
  return { ...plan, dailyPlan: newSlots };
}
