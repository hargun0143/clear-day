import { useEffect, useMemo, useState, type FC } from "react";
import { AQI_BANDS } from "@/constants/aqi-bands";
import { computeGaugeSegments, GAUGE_CONFIG } from "@/constants/gauge";
import { getAqiBand } from "@/utils/aqi-category";

export interface AqiGaugeProps {
  value: number;
}

export const AqiGauge: FC<AqiGaugeProps> = ({ value }) => {
  const result = useMemo(() => getAqiBand(value), [value]);
  const band = result?.band ?? AQI_BANDS[0];
  const beyondScale = result?.beyondScale ?? value > GAUGE_CONFIG.maxScaleValue;

  const [displayValue, setDisplayValue] = useState(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return value;
    }
    return 0;
  });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let start: number | null = null;
    let animId: number;

    const step = (now: number) => {
      if (!start) start = now;
      const elapsed = now - start;
      const progress = Math.min(elapsed / GAUGE_CONFIG.countUpDurationMs, 1);
      setDisplayValue(Math.round(progress * value));

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [value]);

  const segments = useMemo(
    () =>
      computeGaugeSegments(
        AQI_BANDS.map((b) => b.color),
        AQI_BANDS.map((b) => b.id)
      ),
    []
  );

  const clamped = Math.min(Math.max(value, 0), GAUGE_CONFIG.maxScaleValue);
  const markerAngle = 180 - (clamped / GAUGE_CONFIG.maxScaleValue) * 180;
  const markerRad = (markerAngle * Math.PI) / 180;
  const markerX = GAUGE_CONFIG.cx + GAUGE_CONFIG.radius * Math.cos(markerRad);
  const markerY = GAUGE_CONFIG.cy - GAUGE_CONFIG.radius * Math.sin(markerRad);

  return (
    <div
      role="img"
      aria-label={`Air quality index ${value}, ${band.label}`}
      className="flex flex-col items-center justify-center"
    >
      <div className="relative w-[240px]">
        <svg
          viewBox="0 0 240 135"
          className="w-full overflow-visible"
          aria-hidden="true"
        >
          {segments.map((seg) => {
            const isActive = seg.id === band.id;
            return (
              <path
                key={seg.id}
                d={seg.path}
                fill="none"
                stroke={seg.color}
                strokeWidth={GAUGE_CONFIG.strokeWidth}
                strokeLinecap="round"
                opacity={isActive ? 1 : 0.5}
                className="transition-opacity duration-300"
              />
            );
          })}

          <circle
            cx={markerX}
            cy={markerY}
            r={6.5}
            fill={band.color}
            stroke="#ffffff"
            strokeWidth={2.5}
            className="transition-all duration-300"
          />
        </svg>

        <div className="absolute inset-x-0 bottom-1 flex flex-col items-center text-center">
          <span className="text-4xl font-bold tracking-tight text-ink">
            {displayValue}
          </span>
          {beyondScale && (
            <span className="text-[11px] font-semibold text-amber">
              Beyond scale (500+)
            </span>
          )}
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: band.color }}
        />
        <span className="text-sm font-semibold tracking-wide text-ink">
          {band.label}
        </span>
      </div>
    </div>
  );
};
