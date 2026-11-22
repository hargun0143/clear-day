import { useMemo, type FC } from "react";
import { AqiCardError } from "@/components/landing/aqi-card-error";
import { AqiGauge } from "@/components/landing/aqi-gauge";
import { AQI_BANDS } from "@/constants/aqi-bands";
import { getAqiBand } from "@/utils/aqi-category";
import { getAqiCardSourceText } from "@/utils/aqi-status-text";

export interface AqiCardProps {
  value?: number | null;
  guidance?: string;
  mainPollutant?: string;
  updatedTime?: string;
  stationsCount?: number;
  source?: "cpcb" | "open-meteo" | "manual" | "sample";
  sampleMode?: boolean;
  isManual?: boolean;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onManualSubmit?: (aqi: number) => void;
}

export const AqiCard: FC<AqiCardProps> = ({
  value,
  guidance,
  mainPollutant = "PM2.5",
  updatedTime,
  stationsCount,
  source = "cpcb",
  sampleMode = false,
  isManual = false,
  isLoading = false,
  error = null,
  onRetry,
  onManualSubmit,
}) => {
  const result = useMemo(
    () =>
      value !== null && value !== undefined ? getAqiBand(value) : undefined,
    [value]
  );
  const band = result?.band ?? AQI_BANDS[0];
  const activeGuidance = guidance ?? band.guidance;

  if (isLoading) {
    return (
      <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
        <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-teal border-t-transparent" />
        <p className="text-sm font-medium text-ink">Checking stations...</p>
        <p className="mt-1 text-xs text-ink-muted">Reading air quality data</p>
      </div>
    );
  }

  if (error && !isManual && (value === null || value === undefined)) {
    return (
      <AqiCardError
        error={error}
        onRetry={onRetry}
        onManualSubmit={onManualSubmit}
      />
    );
  }

  if (value === null || value === undefined) return null;

  const estimateLine = getAqiCardSourceText({
    sampleMode,
    source,
    isManual,
    stationsCount,
    updatedTime,
  });

  return (
    <div className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
      <AqiGauge value={value} />
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink/90">
        {activeGuidance}
      </p>
      <div className="mt-4 w-full space-y-1 border-t border-white/10 pt-3 text-xs text-ink-muted">
        <p>
          {!isManual && mainPollutant
            ? `Main pollutant: ${mainPollutant} · `
            : ""}
          {estimateLine}
        </p>
        {source === "open-meteo" ? (
          <p className="text-[11px] opacity-80">
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-ink"
            >
              Weather and air quality data by Open-Meteo.com
            </a>
          </p>
        ) : (
          !isManual &&
          !sampleMode && (
            <p className="text-[11px] opacity-80">
              Source: CPCB via data.gov.in
            </p>
          )
        )}
      </div>
    </div>
  );
};
