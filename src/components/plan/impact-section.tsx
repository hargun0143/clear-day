import type { FC } from "react";
import type { GeneratedPlan } from "../../../api/_lib/plan/plan-schema.js";
import {
  computeExposureLevel,
  TOP_FACTOR_LABELS,
  type ExposureLevel,
} from "@/constants/top-factors";

export interface ImpactSectionProps {
  impact: GeneratedPlan["impact"];
  aqiValue?: number;
}

const LEVEL_BADGE_CLASS: Record<ExposureLevel, string> = {
  High: "border-amber/40 bg-amber/15 text-amber",
  Moderate: "border-white/20 bg-white/10 text-ink",
  Low: "border-teal/35 bg-teal/10 text-teal",
};

export const ImpactSection: FC<ImpactSectionProps> = ({
  impact,
  aqiValue = 150,
}) => {
  const visibleItems = impact.filter((item) =>
    Boolean(TOP_FACTOR_LABELS[item.factorId])
  );
  if (visibleItems.length === 0) return null;

  return (
    <section className="glass rounded-[28px] p-6 space-y-0">
      <h2 className="text-lg font-semibold tracking-tight text-ink">
        Estimated Impact
      </h2>
      <p className="mt-1 mb-3 text-xs text-ink-muted">
        Contribution to your exposure today
      </p>
      {visibleItems.map((item, i) => {
        const level = computeExposureLevel(item.factorId, aqiValue);
        return (
          <div
            key={item.factorId}
            className={`py-3 space-y-1 text-sm${i > 0 ? " border-t border-white/10" : ""}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-ink">
                {TOP_FACTOR_LABELS[item.factorId]}
              </span>
              <span
                className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${LEVEL_BADGE_CLASS[level]}`}
              >
                {level}
              </span>
            </div>
            <p className="text-ink-muted">{item.effect}</p>
          </div>
        );
      })}
    </section>
  );
};
