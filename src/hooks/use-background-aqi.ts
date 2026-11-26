import { useCityAqi } from "@/hooks/use-city-aqi";
import { DEFAULT_AQI } from "@/utils/background/get-flow-params";
import { getSnapshotReading } from "@/utils/snapshot-reader";

export function useBackgroundAqi(
  view: "landing" | "questionnaire" | "plan",
  sampleMode: boolean,
  selectedCityId: string | null,
  activeAqiValue?: number
): number {
  const live = useCityAqi(
    view === "landing" && !sampleMode ? selectedCityId : null
  );
  const landingAqi = sampleMode
    ? selectedCityId
      ? getSnapshotReading(selectedCityId)?.aqi
      : undefined
    : live.data?.aqi;

  if (view === "landing") {
    return landingAqi ?? DEFAULT_AQI;
  }
  return activeAqiValue ?? landingAqi ?? DEFAULT_AQI;
}
