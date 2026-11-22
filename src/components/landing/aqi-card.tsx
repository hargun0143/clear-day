import { useMemo, type FC } from "react";
import { RefreshCw } from "lucide-react";
import { AqiGauge } from "@/components/landing/aqi-gauge";
import { AQI_BANDS } from "@/constants/aqi-bands";
import { getAqiBand } from "@/utils/aqi-category";

export interface AqiCardProps {
  value?: number | null;
  guidance?: string;
  mainPollutant?: string;
  updatedTime?: string;
  stationsCount?: number;
  sourceText?: string;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

function formatTime(isoOrTime?: string): string {
  if (!isoOrTime) return "--:--";
  try {
    const d = new Date(isoOrTime);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }
  } catch {
    // Return fallback value
  }
  return isoOrTime;
}

export const AqiCard: FC<AqiCardProps> = ({
  value,
  guidance,
  mainPollutant = "PM2.5",
  updatedTime,
  stationsCount,
  sourceText = "Source: CPCB via data.gov.in",
  isLoading = false,
  error = null,
  onRetry,
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
        <p className="mt-1 text-xs text-ink-muted">
          Reading live CPCB monitors
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
        <p className="text-sm font-medium text-ink/90">{error}</p>
        <p className="mt-1 text-xs text-ink-muted">
          Could not retrieve fresh data for this city.
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-ink transition-colors hover:bg-white/15"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Retry</span>
          </button>
        )}
      </div>
    );
  }

  if (value === null || value === undefined) {
    return null;
  }

  const timeLabel = formatTime(updatedTime);
  const estimateLine =
    stationsCount !== undefined
      ? `Estimate from ${stationsCount} CPCB station${stationsCount === 1 ? "" : "s"}, updated ${timeLabel}`
      : `Updated ${timeLabel}`;

  return (
    <div className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
      <AqiGauge value={value} />

      <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink/90">
        {activeGuidance}
      </p>

      <div className="mt-4 w-full space-y-1 border-t border-white/10 pt-3 text-xs text-ink-muted">
        <p>
          Main pollutant: {mainPollutant} · {estimateLine}
        </p>
        <p className="text-[11px] opacity-80">{sourceText}</p>
      </div>
    </div>
  );
};
