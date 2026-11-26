import type { GeneratedPlan } from "./plan-schema.js";

export const BANNED_PHRASES: readonly string[] = [
  "check local air quality",
  "check the air quality",
  "vulnerable home",
  "breathing steady",
  "calm your lungs",
  "drink water",
  "stay hydrated",
  "hydration",
  "rest well",
  "recover",
  "smooth morning",
] as const;

const BANNED_REGEXES: readonly RegExp[] = [
  /\b(?:relax(?:ing)?|calm(?:ing)?)\s+(?:your\s+)?breathing\b/i,
  /\b(?:stay\s+hydrated|drink(?:ing)?\s+(?:plenty\s+of\s+)?water|hydrat(?:e|ion))\b/i,
  /\b(?:organis|organiz|prepar)(?:e|ing)\s+(?:items|things|bags?|clothes|gear)\s+for\s+(?:the\s+)?next\s+day\b/i,
];

function extractAllTexts(plan: GeneratedPlan): string[] {
  return [
    plan.headline,
    plan.todaySummary,
    ...plan.dailyPlan.flatMap((s) => [...s.actions, s.why]),
    ...plan.indoorAir.tips.map((t) => t.text),
    plan.indoorAir.diyFilter.safetyNote,
    ...plan.lowEmissionChoices.flatMap((c) => [c.swap, c.benefit]),
    ...plan.impact.flatMap((i) => [i.factorId, i.effect]),
    plan.disclaimer,
    ...(plan.goodHabits?.map((h) => h.text) ?? []),
  ];
}

export function hasBannedPhrase(text: string): boolean {
  const lower = text.toLowerCase();
  if (BANNED_PHRASES.some((bp) => lower.includes(bp))) return true;
  return BANNED_REGEXES.some((rx) => rx.test(text));
}

export function findBannedPhrases(plan: GeneratedPlan): string[] {
  const texts = extractAllTexts(plan);
  const found = new Set<string>();
  for (const text of texts) {
    const lower = text.toLowerCase();
    for (const phrase of BANNED_PHRASES) {
      if (lower.includes(phrase)) found.add(phrase);
    }
    for (const rx of BANNED_REGEXES) {
      const match = text.match(rx);
      if (match) found.add(match[0].toLowerCase());
    }
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
    ...plan.impact.flatMap((i) => [i.factorId, i.effect]),
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
      actions = [
        fallback ?? "Keep bedroom doors closed to maintain clean indoor air.",
      ];
    }
    return { ...slot, actions };
  });
  return { ...plan, dailyPlan: newSlots };
}
