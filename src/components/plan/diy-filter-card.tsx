import type { FC } from "react";
import { ShieldAlert } from "lucide-react";
import type { GeneratedPlan } from "../../../api/_lib/plan/plan-schema.js";

export interface DiyFilterCardProps {
  diyFilter: GeneratedPlan["indoorAir"]["diyFilter"];
}

export const DiyFilterCard: FC<DiyFilterCardProps> = ({ diyFilter }) => {
  return (
    <div className="rounded-2xl border border-teal/20 bg-teal/5 p-5 space-y-3">
      <h3 className="text-sm font-semibold text-teal">
        Do-it-yourself air filter
      </h3>

      <div>
        <p className="text-xs font-medium text-ink-muted uppercase tracking-wide mb-1.5">
          Materials
        </p>
        <ul className="list-inside list-disc space-y-1 text-xs text-ink/90">
          {diyFilter.materials.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-xs font-medium text-ink-muted uppercase tracking-wide mb-1.5">
          Steps
        </p>
        <ol className="list-inside list-decimal space-y-1 text-xs text-ink/90">
          {diyFilter.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </div>

      <div
        role="note"
        className="flex items-start gap-2.5 rounded-xl border border-amber/25 bg-amber/10 p-3"
      >
        <ShieldAlert
          aria-hidden="true"
          className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber"
        />
        <p className="text-xs text-ink/90">{diyFilter.safetyNote}</p>
      </div>
    </div>
  );
};
