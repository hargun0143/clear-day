import type { FC } from "react";
import type { GeneratedPlan } from "../../../api/_lib/plan/plan-schema.js";

export interface DailyPlanGridProps {
  dailyPlan: GeneratedPlan["dailyPlan"];
}

export const DailyPlanGrid: FC<DailyPlanGridProps> = ({ dailyPlan }) => {
  return (
    <section className="glass rounded-[28px] p-6 space-y-4">
      <h2 className="text-lg font-semibold tracking-tight text-ink">
        Daily Plan
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {dailyPlan.map((item) => (
          <div
            key={item.slot}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-2"
          >
            <h3 className="text-sm font-semibold text-teal">{item.slot}</h3>
            <ul className="list-inside list-disc space-y-1 text-xs text-ink/90">
              {item.actions.map((act, i) => (
                <li key={i}>{act}</li>
              ))}
            </ul>
            <p className="text-xs text-ink-muted italic">{item.why}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
