import { useMemo, type FC } from "react";
import { CityStripItem } from "@/components/landing/city-strip-item";
import { CITIES } from "@/constants/cities";
import { getStripCityIds } from "@/utils/strip-cities";

export interface CityStripProps {
  selectedCityId: string;
  onSelectCity: (cityId: string) => void;
  sampleMode?: boolean;
}

export const CityStrip: FC<CityStripProps> = ({
  selectedCityId,
  onSelectCity,
  sampleMode = false,
}) => {
  const cityIds = useMemo(
    () => getStripCityIds(selectedCityId),
    [selectedCityId]
  );

  const cities = useMemo(() => {
    return cityIds.map((id) => {
      return (
        CITIES.find((c) => c.id === id) ?? {
          id,
          name: id.toUpperCase(),
          state: "",
          popular: false,
          cpcbCity: id,
          cpcbState: "",
          latitude: 0,
          longitude: 0,
        }
      );
    });
  }, [cityIds]);

  return (
    <div
      role="group"
      aria-label="Compare air quality across cities"
      className="grid grid-cols-3 gap-2"
    >
      {cities.map((city) => (
        <CityStripItem
          key={city.id}
          city={city}
          isSelected={city.id === selectedCityId}
          sampleMode={sampleMode}
          onSelect={onSelectCity}
        />
      ))}
    </div>
  );
};
