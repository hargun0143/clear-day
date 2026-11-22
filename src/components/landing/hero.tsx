import { useMemo, useState, type FC } from "react";
import { AqiCard } from "@/components/landing/aqi-card";
import { CityPicker } from "@/components/landing/city-picker";
import { CityStrip } from "@/components/landing/city-strip";
import { HeroIntro } from "@/components/landing/hero-intro";
import { ShinyButton } from "@/components/ui/shiny-button";
import { CITIES } from "@/constants/cities";
import { useCityAqi } from "@/hooks/use-city-aqi";
import {
  getSnapshotCapturedAt,
  getSnapshotReading,
} from "@/utils/snapshot-reader";

export interface HeroProps {
  selectedCityId: string | null;
  onSelectCity: (cityId: string) => void;
  onStart: () => void;
  sampleMode?: boolean;
}

export const Hero: FC<HeroProps> = ({
  selectedCityId,
  onSelectCity,
  onStart,
  sampleMode = false,
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

  return (
    <section className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-10 px-5 pt-12 pb-16 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:pt-16 lg:pb-24">
      <HeroIntro
        onStart={onStart}
        sampleMode={sampleMode}
        capturedAt={snapshotCapturedAt}
      />

      <div className="glass flex w-full flex-col space-y-5 rounded-[28px] p-6 sm:p-8">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            Check your air
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Choose your city to see today's reading.
          </p>
        </div>

        <CityPicker
          selectedCityId={selectedCityId}
          onSelectCity={onSelectCity}
        />

        {selectedCity && (
          <div className="space-y-4 pt-2">
            <AqiCard
              value={displayValue}
              isManual={isManual}
              source={activeReading?.source}
              sampleMode={sampleMode}
              mainPollutant={activeReading?.dominantPollutant}
              stationsCount={stationsCount}
              updatedTime={activeReading?.updatedAt}
              isLoading={
                !sampleMode && !isManual && liveAqi.status === "loading"
              }
              error={cardError}
              onRetry={liveAqi.retry}
              onManualSubmit={setManualAqi}
            />
            <CityStrip
              selectedCityId={selectedCity.id}
              onSelectCity={onSelectCity}
              sampleMode={sampleMode}
            />
            <ShinyButton
              variant="primary"
              size="md"
              onClick={onStart}
              className="w-full font-semibold"
            >
              Continue with {selectedCity.name}
            </ShinyButton>
          </div>
        )}
      </div>
    </section>
  );
};
