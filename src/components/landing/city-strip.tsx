import { useMemo, type FC } from "react";
import { AQI_BANDS } from "@/constants/aqi-bands";
import { CITIES } from "@/constants/cities";
import { getPlaceholderAqi } from "@/constants/placeholder-readings";
import { getAqiBand } from "@/utils/aqi-category";
import { getStripCityIds } from "@/utils/strip-cities";

export interface CityStripProps {
  selectedCityId: string;
  onSelectCity: (cityId: string) => void;
}

export const CityStrip: FC<CityStripProps> = ({
  selectedCityId,
  onSelectCity,
}) => {
  const cityIds = useMemo(
    () => getStripCityIds(selectedCityId),
    [selectedCityId]
  );

  const stripData = useMemo(() => {
    return cityIds.map((id) => {
      const city = CITIES.find((c) => c.id === id) ?? {
        id,
        name: id.toUpperCase(),
        state: "",
        popular: false,
      };
      const aqi = getPlaceholderAqi(id);
      const band = getAqiBand(aqi)?.band ?? AQI_BANDS[0];
      return { city, aqi, band };
    });
  }, [cityIds]);

  return (
    <div
      role="group"
      aria-label="Compare air quality across cities"
      className="grid grid-cols-3 gap-2"
    >
      {stripData.map(({ city, aqi, band }) => {
        const isSelected = city.id === selectedCityId;
        return (
          <button
            key={city.id}
            type="button"
            onClick={() => onSelectCity(city.id)}
            aria-pressed={isSelected}
            className={`flex min-h-[44px] flex-col items-center justify-center rounded-xl p-2.5 text-center transition-all cursor-pointer border ${
              isSelected
                ? "border-teal bg-white/[0.08] shadow-sm ring-1 ring-teal/30"
                : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
            }`}
          >
            <span className="text-xs font-semibold text-ink truncate w-full">
              {city.name}
            </span>
            <div className="mt-1 flex items-center gap-1.5 text-[11px]">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: band.color }}
              />
              <span className="font-bold text-ink">{aqi}</span>
              <span className="text-ink-muted text-[10px] hidden sm:inline">
                {band.label}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
