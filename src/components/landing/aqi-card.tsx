import { useMemo, type FC } from "react";
import { AqiGauge } from "@/components/landing/aqi-gauge";
import { AQI_BANDS } from "@/constants/aqi-bands";
import { getAqiBand } from "@/utils/aqi-category";

export interface AqiCardProps {
  value: number;
  guidance?: string;
  mainPollutant?: string;
  updatedTime?: string;
  stationsCount?: number;
  sourceText?: string;
}

export const AqiCard: FC<AqiCardProps> = ({
  value,
  guidance,
  mainPollutant = "PM2.5",
  updatedTime = "18:00",
  stationsCount = 6,
  sourceText = "Source: CPCB via data.gov.in",
}) => {
  const result = useMemo(() => getAqiBand(value), [value]);
  const band = result?.band ?? AQI_BANDS[0];
  const activeGuidance = guidance ?? band.guidance;

  return (
    <div className="flex flex-col items-center rounded-2xl bg-white/[0.03] p-5 text-center border border-white/10">
      <AqiGauge value={value} />

      <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink/90">
        {activeGuidance}
      </p>

      <div className="mt-4 w-full border-t border-white/10 pt-3 text-xs text-ink-muted space-y-1">
        <p>
          Main pollutant: {mainPollutant} · Updated {updatedTime} ·{" "}
          {stationsCount} stations
        </p>
        <p className="text-[11px] opacity-80">{sourceText}</p>
      </div>
    </div>
  );
};
