import { useEffect, useRef, type FC } from "react";
import { ShinyButton } from "@/components/ui/shiny-button";

// Nav top-6 (24px) + height 60px + 4px gap = 88px
const STICKY_TOP = "top-[88px]";

export interface PlanSummaryPanelProps {
  headline: string;
  todaySummary: string;
  aqiValue: number;
  aqiBandLabel: string;
  aqiBandColor: string;
  cityName: string;
  dataSourceLabel: string;
  profileChips?: string[];
  onStartOver: () => void;
}

export const PlanSummaryPanel: FC<PlanSummaryPanelProps> = ({
  headline,
  todaySummary,
  aqiValue,
  aqiBandLabel,
  aqiBandColor,
  cityName,
  dataSourceLabel,
  profileChips,
  onStartOver,
}) => {
  const h1Ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    h1Ref.current?.focus();
  }, []);

  return (
    <div
      className={`glass rounded-[28px] p-6 lg:sticky ${STICKY_TOP} flex flex-col gap-5`}
    >
      <div className="space-y-3">
        <h1
          ref={h1Ref}
          tabIndex={-1}
          className="text-2xl font-bold tracking-tight text-ink leading-tight focus-visible:outline-none"
        >
          {headline}
        </h1>
        <p className="text-sm leading-relaxed text-ink/90 max-w-[55ch]">
          {todaySummary}
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
        <span
          aria-hidden="true"
          className="h-3 w-3 flex-shrink-0 rounded-full"
          style={{ backgroundColor: aqiBandColor }}
        />
        <div className="min-w-0">
          <p className="text-xs text-ink-muted truncate">{cityName}</p>
          <p className="text-sm font-semibold text-ink">
            AQI {aqiValue}
            <span className="ml-1.5 font-normal text-ink-muted">
              · {aqiBandLabel}
            </span>
          </p>
        </div>
      </div>

      {profileChips && profileChips.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-muted">
            Planned for
          </p>
          <div className="flex flex-wrap gap-1.5">
            {profileChips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-xs text-ink/85"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-ink-muted">Source: {dataSourceLabel}</p>

      <div className="mt-auto pt-2">
        <ShinyButton variant="glass" size="sm" onClick={onStartOver}>
          Start over
        </ShinyButton>
      </div>
    </div>
  );
};
