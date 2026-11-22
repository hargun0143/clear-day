import { z } from "zod";

export const PlanDailySlotSchema = z.object({
  slot: z.enum(["Morning", "Afternoon", "Evening", "Night"]),
  actions: z.array(z.string().min(1)).min(1).max(3),
  why: z.string().min(1),
});

export const PlanDiyFilterSchema = z.object({
  include: z.boolean(),
  materials: z.array(z.string()),
  steps: z.array(z.string()),
  safetyNote: z.string(),
});

export const PlanIndoorAirSchema = z.object({
  diyFilter: PlanDiyFilterSchema,
  tips: z.array(z.string()).max(5),
});

export const PlanLowEmissionChoiceSchema = z.object({
  swap: z.string().min(1),
  benefit: z.string().min(1),
});

export const PlanImpactItemSchema = z.object({
  choice: z.string().min(1),
  effect: z.string().min(1),
});

export const GeneratedPlanSchema = z.object({
  headline: z.string().max(80),
  todaySummary: z.string().max(240),
  goodHabits: z.array(z.string()).max(3).optional(),
  dailyPlan: z.array(PlanDailySlotSchema).length(4),
  indoorAir: PlanIndoorAirSchema,
  lowEmissionChoices: z.array(PlanLowEmissionChoiceSchema).max(4),
  impact: z.array(PlanImpactItemSchema).max(4),
  disclaimer: z.string().min(1),
});

export type GeneratedPlan = z.infer<typeof GeneratedPlanSchema>;

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
    obj.goodHabits = obj.goodHabits.slice(0, 3);
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
