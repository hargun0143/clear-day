import type { FC } from "react";
import type { GeneratedPlan } from "../../../api/_lib/plan/plan-schema.js";

export interface ImpactSectionProps {
  impact: GeneratedPlan["impact"];
}

export const ImpactSection: FC<ImpactSectionProps> = ({ impact }) => {
  if (impact.length === 0) return null;

  return (
    <section className="glass rounded-[28px] p-6 space-y-0">
      <h2 className="text-lg font-semibold tracking-tight text-ink mb-4">
        Estimated Impact
      </h2>
      {impact.map((item, i) => (
        <div
          key={i}
          className={`py-3 text-sm${i > 0 ? " border-t border-white/10" : ""}`}
        >
          <span className="font-semibold text-ink">{item.choice}: </span>
          <span className="text-ink-muted">{item.effect}</span>
        </div>
      ))}
    </section>
  );
};
