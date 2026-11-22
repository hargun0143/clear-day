import { useMemo, type FC } from "react";
import { ArrowRight } from "lucide-react";
import { AqiCard } from "@/components/landing/aqi-card";
import { CityPicker } from "@/components/landing/city-picker";
import { CityStrip } from "@/components/landing/city-strip";
import { ShinyButton } from "@/components/ui/shiny-button";
import { CITIES } from "@/constants/cities";
import { getPlaceholderAqi } from "@/constants/placeholder-readings";
import { useCityAqi } from "@/hooks/use-city-aqi";

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
  const selectedCity = useMemo(
    () => CITIES.find((c) => c.id === selectedCityId) ?? null,
    [selectedCityId]
  );

  const placeholderAqi = selectedCity
    ? getPlaceholderAqi(selectedCity.id)
    : null;
  const liveAqi = useCityAqi(sampleMode ? null : (selectedCity?.id ?? null));

  return (
    <section className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-10 px-5 pt-12 pb-16 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:pt-16 lg:pb-24">
      <div className="flex flex-col items-start space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-xs font-medium text-ink/90">
          <span className="h-2 w-2 rounded-full bg-teal" />
          <span>Live CPCB readings · 23 Indian cities</span>
        </div>

        <h1 className="text-5xl font-[650] leading-[0.98] tracking-[-0.05em] text-ink sm:text-6xl lg:text-[76px]">
          <span>Plan a</span>
          <br />
          <span className="text-ink-muted">clearer day.</span>
        </h1>

        <p className="max-w-xl text-base leading-relaxed text-ink/80 sm:text-lg">
          Tell us your city and how your day looks. We read today's air quality
          and turn it into a plan that fits your routine, your home and the
          people in it.
        </p>

        <div className="flex flex-col items-start gap-3 pt-2">
          <ShinyButton
            variant="primary"
            size="md"
            onClick={onStart}
            className="gap-2.5 font-semibold"
          >
            <span>Get my plan</span>
            <ArrowRight className="h-4 w-4" />
          </ShinyButton>
          <span className="text-xs text-ink-muted">
            Free. No sign-up. Estimates, not medical advice.
          </span>
        </div>
      </div>

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
              value={sampleMode ? placeholderAqi : liveAqi.data?.aqi}
              mainPollutant={liveAqi.data?.dominantPollutant}
              stationsCount={liveAqi.data?.stationCount}
              updatedTime={liveAqi.data?.updatedAt}
              sourceText={liveAqi.data?.source}
              isLoading={!sampleMode && liveAqi.status === "loading"}
              error={
                !sampleMode && liveAqi.status === "error" ? liveAqi.error : null
              }
              onRetry={liveAqi.retry}
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
