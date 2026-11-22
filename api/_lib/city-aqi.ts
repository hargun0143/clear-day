import { CPCB_SOURCE } from "./cpcb-config.js";
import type { CityAqiResult, StationAqi } from "./cpcb-types.js";

export type CityAqiComputationResult =
  { ok: true; data: CityAqiResult } | { ok: false; error: "no_fresh_data" };

export function computeCityAqi(
  cityId: string,
  stations: readonly StationAqi[]
): CityAqiComputationResult {
  if (stations.length === 0) {
    return { ok: false, error: "no_fresh_data" };
  }

  const sortedAqis = stations.map((s) => s.aqi).sort((a, b) => a - b);
  const mid = Math.floor(sortedAqis.length / 2);
  const medianAqi =
    sortedAqis.length % 2 === 1
      ? sortedAqis[mid]
      : Math.round((sortedAqis[mid - 1] + sortedAqis[mid]) / 2);

  const pollutantCounts = new Map<string, number>();
  for (const s of stations) {
    const current = pollutantCounts.get(s.dominantPollutant) ?? 0;
    pollutantCounts.set(s.dominantPollutant, current + 1);
  }

  let dominantPollutant = "";
  let highestCount = -1;
  for (const [pollutant, count] of pollutantCounts.entries()) {
    if (count > highestCount) {
      highestCount = count;
      dominantPollutant = pollutant;
    }
  }

  const newestTime = Math.max(...stations.map((s) => s.updatedAt.getTime()));

  return {
    ok: true,
    data: {
      cityId,
      aqi: medianAqi,
      stationCount: stations.length,
      dominantPollutant,
      updatedAt: new Date(newestTime).toISOString(),
      source: CPCB_SOURCE,
      isEstimate: true,
    },
  };
}
