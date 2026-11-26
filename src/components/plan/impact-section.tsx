import type { FC } from "react";
import type { GeneratedPlan } from "../../../api/_lib/plan/plan-schema.js";
import { TOP_FACTOR_LABELS } from "@/constants/top-factors";

export interface ImpactSectionProps {
  impact: GeneratedPlan["impact"];
}

export const ImpactSection: FC<ImpactSectionProps> = ({ impact }) => {
  const visibleItems = impact.filter((item) =>
    Boolean(TOP_FACTOR_LABELS[item.factorId])
  );
  if (visibleItems.length === 0) return null;

  return (
    <section className="glass rounded-[28px] p-6 space-y-0">
      <h2 className="text-lg font-semibold tracking-tight text-ink mb-4">
        Estimated Impact
      </h2>
      {visibleItems.map((item, i) => (
        <div
          key={item.factorId}
          className={`py-3 text-sm${i > 0 ? " border-t border-white/10" : ""}`}
        >
          <span className="font-semibold text-ink">
            {TOP_FACTOR_LABELS[item.factorId]}:{" "}
          </span>
          <span className="text-ink-muted">{item.effect}</span>
        </div>
      ))}
    </section>
  );
};
