import { DEFAULT_SLOT_ACTIONS, DIY_BOX_FAN_FILTER } from "./knowledge-sheet.js";
import { GeneratedPlanSchema, type GeneratedPlan } from "./plan-schema.js";

function normalizeSlotActions(dailyPlan: unknown[]): unknown[] {
  return dailyPlan.map((slotObj: unknown) => {
    if (typeof slotObj !== "object" || slotObj === null) return slotObj;
    const slot = { ...(slotObj as Record<string, unknown>) };
    const slotName = String(slot.slot);
    const min = slotName === "Night" ? 1 : 2;
    const max = slotName === "Night" ? 2 : 3;
    let actions = Array.isArray(slot.actions)
      ? slot.actions.map(String).filter((a) => a.trim().length > 0)
      : [];
    const defaults = DEFAULT_SLOT_ACTIONS[slotName] ?? [];
    let defIdx = 0;
    while (actions.length < min && defIdx < defaults.length) {
      actions.push(defaults[defIdx]!);
      defIdx++;
    }
    if (actions.length > max) actions = actions.slice(0, max);
    slot.actions = actions;
    return slot;
  });
}

function normalizeDiyFilter(
  rawFilter: unknown,
  shouldInclude: boolean
): Record<string, unknown> {
  const f =
    typeof rawFilter === "object" && rawFilter !== null
      ? { ...(rawFilter as Record<string, unknown>) }
      : {};
  if (!shouldInclude) {
    return { include: false, materials: [], steps: [], safetyNote: "" };
  }
  const materials =
    Array.isArray(f.materials) && f.materials.length > 0
      ? f.materials
      : [...DIY_BOX_FAN_FILTER.materials];
  const steps =
    Array.isArray(f.steps) && f.steps.length > 0
      ? f.steps
      : [...DIY_BOX_FAN_FILTER.steps];
  const safetyNote =
    typeof f.safetyNote === "string" && f.safetyNote.trim().length > 0
      ? f.safetyNote
      : DIY_BOX_FAN_FILTER.safetyNotes.join(" ");
  return { include: true, materials, steps, safetyNote };
}

export function postProcessPlan(
  raw: unknown,
  isUnder18: boolean,
  diySelected?: boolean
): GeneratedPlan {
  if (typeof raw !== "object" || raw === null) {
    throw new Error("Invalid plan object");
  }

  const obj = { ...(raw as Record<string, unknown>) };
  if (typeof obj.headline === "string" && obj.headline.length > 80) {
    obj.headline = obj.headline.slice(0, 80).trim();
  }
  if (typeof obj.todaySummary === "string" && obj.todaySummary.length > 240) {
    obj.todaySummary = obj.todaySummary.slice(0, 240).trim();
  }
  if (Array.isArray(obj.goodHabits)) {
    obj.goodHabits = obj.goodHabits.slice(0, 3).map((h: unknown, i: number) => {
      if (typeof h === "string") return { topicId: `habit-${i}`, text: h };
      return h;
    });
  }
  if (Array.isArray(obj.dailyPlan)) {
    obj.dailyPlan = normalizeSlotActions(obj.dailyPlan);
  }
  if (Array.isArray(obj.impact)) {
    obj.impact = obj.impact.map((item: unknown) => {
      if (typeof item !== "object" || item === null) return item;
      const rec = { ...(item as Record<string, unknown>) };
      if (!rec.factorId && typeof rec.choice === "string") {
        rec.factorId = rec.choice;
      }
      return rec;
    });
  }

  const shouldIncludeDiy = diySelected ?? isUnder18;
  if (typeof obj.indoorAir === "object" && obj.indoorAir !== null) {
    const indoorAir = { ...(obj.indoorAir as Record<string, unknown>) };
    if (Array.isArray(indoorAir.tips)) {
      indoorAir.tips = indoorAir.tips
        .map((tip: unknown, i: number) =>
          typeof tip === "string" ? { topicId: `tip-${i}`, text: tip } : tip
        )
        .filter((tip: unknown) => {
          const rec = tip as Record<string, unknown>;
          return rec.topicId !== "diy-filter";
        });
    }
    if (diySelected !== undefined || isUnder18) {
      indoorAir.diyFilter = normalizeDiyFilter(
        indoorAir.diyFilter,
        shouldIncludeDiy
      );
    }
    obj.indoorAir = indoorAir;
  }

  if (Array.isArray(obj.lowEmissionChoices)) {
    obj.lowEmissionChoices = obj.lowEmissionChoices.map(
      (c: unknown, i: number) => {
        if (typeof c === "object" && c !== null) {
          const item = { ...(c as Record<string, unknown>) };
          if (!item.topicId) item.topicId = `swap-${i}`;
          return item;
        }
        return c;
      }
    );
  }
  if (isUnder18) obj.lowEmissionChoices = [];

  return GeneratedPlanSchema.parse(obj);
}
