import { z } from "zod";
import { postProcessPlan } from "./post-process-plan.js";

export { postProcessPlan };

export const PlanDailySlotSchema = z.object({
  slot: z.enum(["Morning", "Afternoon", "Evening", "Night"]),
  actions: z.array(z.string().min(1)),
  why: z.string().min(1),
});

export const PlanDiyFilterSchema = z.object({
  include: z.boolean(),
  materials: z.array(z.string()),
  steps: z.array(z.string()),
  safetyNote: z.string(),
});

export const PlanIndoorTipSchema = z.object({
  topicId: z.string().min(1),
  text: z.string().min(1),
});

export const PlanIndoorAirSchema = z.object({
  diyFilter: PlanDiyFilterSchema,
  tips: z.array(PlanIndoorTipSchema).max(5),
});

export const PlanLowEmissionChoiceSchema = z.object({
  topicId: z.string().min(1),
  swap: z.string().min(1),
  benefit: z.string().min(1),
});

export const PlanGoodHabitItemSchema = z.object({
  topicId: z.string().min(1),
  text: z.string().min(1),
});

export const PlanImpactItemSchema = z.object({
  choice: z.string().min(1),
  effect: z.string().min(1),
});

export const GeneratedPlanSchema = z.object({
  headline: z.string().max(80),
  todaySummary: z.string().max(240),
  goodHabits: z.array(PlanGoodHabitItemSchema).max(3).optional(),
  dailyPlan: z
    .array(PlanDailySlotSchema)
    .length(4)
    .superRefine((slots, ctx) => {
      for (let i = 0; i < slots.length; i++) {
        const s = slots[i]!;
        const min = s.slot === "Night" ? 1 : 2;
        const max = s.slot === "Night" ? 2 : 3;
        if (s.actions.length < min || s.actions.length > max) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${s.slot} must have between ${min} and ${max} actions`,
            path: [i, "actions"],
          });
        }
      }
    }),
  indoorAir: PlanIndoorAirSchema,
  lowEmissionChoices: z.array(PlanLowEmissionChoiceSchema).max(4),
  impact: z.array(PlanImpactItemSchema).max(4),
  disclaimer: z.string().min(1),
});

export type GeneratedPlan = z.infer<typeof GeneratedPlanSchema>;
