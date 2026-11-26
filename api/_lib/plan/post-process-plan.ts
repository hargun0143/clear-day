import { DEFAULT_SLOT_ACTIONS } from "./knowledge-sheet.js";
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

export function postProcessPlan(
  raw: unknown,
  isUnder18: boolean
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

  if (typeof obj.indoorAir === "object" && obj.indoorAir !== null) {
    const indoorAir = { ...(obj.indoorAir as Record<string, unknown>) };
    if (Array.isArray(indoorAir.tips)) {
      indoorAir.tips = indoorAir.tips.map((tip: unknown, i: number) => {
        if (typeof tip === "string") return { topicId: `tip-${i}`, text: tip };
        return tip;
      });
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

  if (isUnder18) {
    obj.lowEmissionChoices = [];
    if (typeof obj.indoorAir === "object" && obj.indoorAir !== null) {
      const indoorAir = { ...(obj.indoorAir as Record<string, unknown>) };
      if (
        typeof indoorAir.diyFilter === "object" &&
        indoorAir.diyFilter !== null
      ) {
        indoorAir.diyFilter = {
          ...(indoorAir.diyFilter as Record<string, unknown>),
          include: true,
        };
      }
      obj.indoorAir = indoorAir;
    }
  }

  return GeneratedPlanSchema.parse(obj);
}
