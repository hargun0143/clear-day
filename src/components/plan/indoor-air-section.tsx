import type { FC } from "react";
import type { GeneratedPlan } from "../../../api/_lib/plan/plan-schema.js";
import { DiyFilterCard } from "@/components/plan/diy-filter-card";

export interface IndoorAirSectionProps {
  indoorAir: GeneratedPlan["indoorAir"];
}

export const IndoorAirSection: FC<IndoorAirSectionProps> = ({ indoorAir }) => {
  return (
    <section className="glass rounded-[28px] p-6 space-y-4">
      <h2 className="text-lg font-semibold tracking-tight text-ink">
        Indoor Air
      </h2>

      <ul className="list-inside list-disc space-y-1.5 text-sm text-ink/90">
        {indoorAir.tips.map((tip, i) => (
          <li key={i}>{tip}</li>
        ))}
      </ul>

      {indoorAir.diyFilter.include && (
        <DiyFilterCard diyFilter={indoorAir.diyFilter} />
      )}
    </section>
  );
};
