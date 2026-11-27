import { useMemo, useState, type FC } from "react";
import { HeroAqiPanel } from "@/components/landing/hero-aqi-panel";
import { HeroIntro } from "@/components/landing/hero-intro";
import { CITIES } from "@/constants/cities";
import { useCityAqi } from "@/hooks/use-city-aqi";
import {
  getSnapshotCapturedAt,
  getSnapshotReading,
} from "@/utils/snapshot-reader";

export interface HeroActiveAqiInfo {
  value: number;
  mainPollutant?: string;
  source?: string;
  isModelled?: boolean;
}

export interface HeroProps {
  selectedCityId: string | null;
  onSelectCity: (cityId: string) => void;
  onStart: (activeAqi?: HeroActiveAqiInfo) => void;
  sampleMode?: boolean;
  cityPickerError?: string | null;
}

export const Hero: FC<HeroProps> = ({
  selectedCityId,
  onSelectCity,
  onStart,
  sampleMode = false,
  cityPickerError = null,
}) => {
  const [prevCityId, setPrevCityId] = useState(selectedCityId);
  const [manualAqi, setManualAqi] = useState<number | null>(null);

  if (prevCityId !== selectedCityId) {
    setPrevCityId(selectedCityId);
    setManualAqi(null);
  }

  const selectedCity = useMemo(
    () => CITIES.find((c) => c.id === selectedCityId) ?? null,
    [selectedCityId]
  );

  const snapshot = selectedCity ? getSnapshotReading(selectedCity.id) : null;
  const liveAqi = useCityAqi(sampleMode ? null : (selectedCity?.id ?? null));

  const isManual = manualAqi !== null;
  const activeReading = sampleMode ? snapshot : liveAqi.data;
  const displayValue = isManual ? manualAqi : activeReading?.aqi;

  const cardError = sampleMode
    ? snapshot
      ? null
      : "No snapshot data available for this city"
    : isManual
      ? null
      : liveAqi.status === "error"
        ? liveAqi.error
        : null;

  const stationsCount =
    activeReading && "stationCount" in activeReading
      ? activeReading.stationCount
      : undefined;

  const snapshotCapturedAt = sampleMode ? getSnapshotCapturedAt() : null;

  const handleStartClick = () => {
    if (typeof displayValue === "number") {
      onStart({
        value: displayValue,
        mainPollutant: activeReading?.dominantPollutant,
        source: activeReading?.source,
        isModelled:
          activeReading && "isModelled" in activeReading
            ? Boolean(activeReading.isModelled)
            : false,
      });
    } else {
      onStart();
    }
  };

  return (
    <section className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-10 px-5 pt-12 pb-16 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:pt-16 lg:pb-24">
      <HeroIntro
        onStart={handleStartClick}
        sampleMode={sampleMode}
        capturedAt={snapshotCapturedAt}
      />
      <HeroAqiPanel
        selectedCityId={selectedCityId}
        selectedCity={selectedCity}
        onSelectCity={onSelectCity}
        cityPickerError={cityPickerError}
        displayValue={displayValue}
        isManual={isManual}
        source={activeReading?.source}
        sampleMode={sampleMode}
        mainPollutant={activeReading?.dominantPollutant}
        stationsCount={stationsCount}
        updatedTime={activeReading?.updatedAt}
        isLoading={!sampleMode && !isManual && liveAqi.status === "loading"}
        error={cardError}
        onRetry={liveAqi.retry}
        onManualSubmit={setManualAqi}
        onStartClick={handleStartClick}
      />
    </section>
  );
};
