import {
  KEY_POLLUTANTS,
  STATION_MAX_AGE_MS,
  STATION_MIN_DISTINCT_POLLUTANTS,
} from "./cpcb-config.js";
import type { ParsedReading, StationAqi } from "./cpcb-types.js";

function hasKeyPollutant(pollutants: Set<string>): boolean {
  return KEY_POLLUTANTS.some((key) => {
    const upper = key.toUpperCase();
    return Array.from(pollutants).some((p) => p.toUpperCase() === upper);
  });
}

export function computeStationAqis(
  readings: readonly ParsedReading[],
  now: Date = new Date()
): StationAqi[] {
  const byStation = new Map<string, ParsedReading[]>();

  for (const r of readings) {
    const list = byStation.get(r.station) ?? [];
    list.push(r);
    byStation.set(r.station, list);
  }

  const validStations: StationAqi[] = [];
  const nowMs = now.getTime();

  for (const [station, stationReadings] of byStation.entries()) {
    const pollutants = new Set(stationReadings.map((r) => r.pollutantId));
    if (pollutants.size < STATION_MIN_DISTINCT_POLLUTANTS) {
      continue;
    }

    if (!hasKeyPollutant(pollutants)) {
      continue;
    }

    let newestMs = 0;
    let maxAvg = -Infinity;
    let dominantPollutant = "";

    for (const r of stationReadings) {
      const timeMs = r.updatedAt.getTime();
      if (timeMs > newestMs) {
        newestMs = timeMs;
      }
      if (r.avgValue > maxAvg) {
        maxAvg = r.avgValue;
        dominantPollutant = r.pollutantId;
      }
    }

    const ageMs = nowMs - newestMs;
    if (ageMs > STATION_MAX_AGE_MS) {
      continue;
    }

    validStations.push({
      station,
      aqi: Math.round(maxAvg),
      dominantPollutant,
      updatedAt: new Date(newestMs),
    });
  }

  return validStations;
}
