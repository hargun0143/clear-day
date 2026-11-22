import type { FC } from "react";
import type { GeneratedPlan } from "../../../api/_lib/plan/plan-schema";
import { ShinyButton } from "@/components/ui/shiny-button";
import type { PlanApiMeta } from "@/services/plan-client";

export interface PlanViewProps {
  plan: GeneratedPlan;
  meta: PlanApiMeta;
  onStartOver: () => void;
}

export const PlanView: FC<PlanViewProps> = ({ plan, meta, onStartOver }) => {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col space-y-6 px-5 py-8 sm:px-8">
      {meta.isFallback && (
        <div className="rounded-2xl border border-amber/30 bg-amber/10 p-3.5 text-center text-xs text-amber">
          Example plan shown because live generation was unavailable
        </div>
      )}

      <div className="glass space-y-6 rounded-[28px] p-6 sm:p-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {plan.headline}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink/90 sm:text-base">
            {plan.todaySummary}
          </p>
        </div>

        <section className="space-y-4 border-t border-white/10 pt-5">
          <h2 className="text-lg font-semibold text-ink">Daily Plan</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {plan.dailyPlan.map((item) => (
              <div
                key={item.slot}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs"
              >
                <span className="font-semibold text-teal">{item.slot}</span>
                <ul className="mt-2 list-inside list-disc space-y-1 text-ink/90">
                  {item.actions.map((act, i) => (
                    <li key={i}>{act}</li>
                  ))}
                </ul>
                <p className="mt-2.5 text-ink-muted italic">{item.why}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3 border-t border-white/10 pt-5 text-xs text-ink/90">
          <h2 className="text-lg font-semibold text-ink">Indoor Air</h2>
          {plan.indoorAir.diyFilter.include && (
            <div className="rounded-2xl border border-teal/20 bg-teal/5 p-4">
              <h3 className="font-medium text-teal">DIY Box-Fan Filter</h3>
              <p className="mt-1 text-ink-muted">
                {plan.indoorAir.diyFilter.safetyNote}
              </p>
            </div>
          )}
          <ul className="list-inside list-disc space-y-1">
            {plan.indoorAir.tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </section>

        {plan.lowEmissionChoices.length > 0 && (
          <section className="space-y-2 border-t border-white/10 pt-5 text-xs">
            <h2 className="text-lg font-semibold text-ink">
              Low-Emission Swaps
            </h2>
            <div className="space-y-2">
              {plan.lowEmissionChoices.map((item, i) => (
                <div key={i} className="flex justify-between gap-4">
                  <span className="font-medium text-ink">{item.swap}</span>
                  <span className="text-ink-muted text-right">
                    {item.benefit}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {plan.impact.length > 0 && (
          <section className="space-y-2 border-t border-white/10 pt-5 text-xs">
            <h2 className="text-lg font-semibold text-ink">Estimated Impact</h2>
            <div className="space-y-1.5">
              {plan.impact.map((item, i) => (
                <p key={i}>
                  <strong className="text-ink">{item.choice}: </strong>
                  <span className="text-ink-muted">{item.effect}</span>
                </p>
              ))}
            </div>
          </section>
        )}

        <p className="border-t border-white/10 pt-4 text-center text-xs text-ink-muted">
          {plan.disclaimer}
        </p>

        <div className="pt-2 text-center">
          <ShinyButton variant="glass" size="md" onClick={onStartOver}>
            Start over
          </ShinyButton>
        </div>
      </div>
    </div>
  );
};
