import { useMemo, type FC } from "react";
import { AQI_BANDS } from "@/constants/aqi-bands";
import type { City } from "@/constants/cities";
import { getPlaceholderAqi } from "@/constants/placeholder-readings";
import { useCityAqi } from "@/hooks/use-city-aqi";
import { getAqiBand } from "@/utils/aqi-category";

export interface CityStripItemProps {
  city: City;
  isSelected: boolean;
  sampleMode: boolean;
  onSelect: (cityId: string) => void;
}

export const CityStripItem: FC<CityStripItemProps> = ({
  city,
  isSelected,
  sampleMode,
  onSelect,
}) => {
  const placeholderAqi = useMemo(() => getPlaceholderAqi(city.id), [city.id]);
  const liveResult = useCityAqi(sampleMode ? null : city.id);

  const aqi = sampleMode
    ? placeholderAqi
    : liveResult.status === "success" && liveResult.data
      ? liveResult.data.aqi
      : liveResult.status === "loading"
        ? null
        : placeholderAqi;

  const band = useMemo(() => {
    if (aqi === null) return AQI_BANDS[0];
    return getAqiBand(aqi)?.band ?? AQI_BANDS[0];
  }, [aqi]);

  return (
    <button
      type="button"
      onClick={() => onSelect(city.id)}
      aria-pressed={isSelected}
      className={`flex min-h-[44px] cursor-pointer flex-col items-center justify-center rounded-xl p-2.5 text-center transition-all border ${
        isSelected
          ? "border-teal bg-white/[0.08] shadow-sm ring-1 ring-teal/30"
          : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
      }`}
    >
      <span className="w-full truncate text-xs font-semibold text-ink">
        {city.name}
      </span>
      <div className="mt-1 flex items-center gap-1.5 text-[11px]">
        {aqi === null ? (
          <span className="h-2 w-8 animate-pulse rounded bg-white/20" />
        ) : (
          <>
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: band.color }}
            />
            <span className="font-bold text-ink">{aqi}</span>
            <span className="hidden text-[10px] text-ink-muted sm:inline">
              {band.label}
            </span>
          </>
        )}
      </div>
    </button>
  );
};
