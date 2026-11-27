import type { FC } from "react";
import { AqiCard, type AqiCardProps } from "@/components/landing/aqi-card";
import { CityPicker } from "@/components/landing/city-picker";
import { CityStrip } from "@/components/landing/city-strip";
import { ShinyButton } from "@/components/ui/shiny-button";
import type { City } from "@/constants/cities";

export interface HeroAqiPanelProps {
  selectedCityId: string | null;
  selectedCity: City | null;
  onSelectCity: (cityId: string) => void;
  cityPickerError: string | null;
  displayValue: number | undefined;
  isManual: boolean;
  source?: AqiCardProps["source"];
  sampleMode: boolean;
  mainPollutant?: string;
  stationsCount?: number;
  updatedTime?: string;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onManualSubmit: (value: number | null) => void;
  onStartClick: () => void;
}

export const HeroAqiPanel: FC<HeroAqiPanelProps> = ({
  selectedCityId,
  selectedCity,
  onSelectCity,
  cityPickerError,
  displayValue,
  isManual,
  source,
  sampleMode,
  mainPollutant,
  stationsCount,
  updatedTime,
  isLoading,
  error,
  onRetry,
  onManualSubmit,
  onStartClick,
}) => {
  return (
    <div className="glass flex w-full flex-col space-y-5 rounded-[28px] p-6 sm:p-8">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          Check your air
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          Choose your city to see today's reading.
        </p>
      </div>

      <div className="space-y-1.5">
        <CityPicker
          selectedCityId={selectedCityId}
          onSelectCity={onSelectCity}
          triggerId="city-picker-trigger"
          isError={Boolean(cityPickerError)}
        />
        {cityPickerError && (
          <p
            id="city-picker-error"
            className="px-2 text-xs font-medium text-amber"
            role="alert"
          >
            {cityPickerError}
          </p>
        )}
      </div>

      {selectedCity && (
        <div className="space-y-4 pt-2">
          <AqiCard
            value={displayValue}
            isManual={isManual}
            source={source}
            sampleMode={sampleMode}
            mainPollutant={mainPollutant}
            stationsCount={stationsCount}
            updatedTime={updatedTime}
            isLoading={isLoading}
            error={error}
            onRetry={onRetry}
            onManualSubmit={onManualSubmit}
          />
          <CityStrip
            selectedCityId={selectedCity.id}
            onSelectCity={onSelectCity}
            sampleMode={sampleMode}
          />
          <ShinyButton
            variant="primary"
            size="md"
            onClick={onStartClick}
            className="w-full font-semibold"
          >
            Continue with {selectedCity.name}
          </ShinyButton>
        </div>
      )}
    </div>
  );
};
