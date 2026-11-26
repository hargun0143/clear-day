import type { FC } from "react";
import type { GeneratedPlan } from "../../../api/_lib/plan/plan-schema.js";

export interface SwapsSectionProps {
  choices: GeneratedPlan["lowEmissionChoices"];
}

export const SwapsSection: FC<SwapsSectionProps> = ({ choices }) => {
  if (choices.length === 0) return null;

  return (
    <section className="glass rounded-[28px] p-6 space-y-4">
      <h2 className="text-lg font-semibold tracking-tight text-ink">
        Low-Emission Swaps
      </h2>
      <div className="grid gap-3 md:grid-cols-2">
        {choices.map((item, i) => (
          <div
            key={item.topicId || i}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-1"
          >
            <p className="text-sm font-medium text-ink">{item.swap}</p>
            <p className="text-xs text-ink-muted">{item.benefit}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
