import { describe, expect, it } from "vitest";
import type { ParsedReading } from "../../api/_lib/cpcb-types.js";
import { computeStationAqis } from "../../api/_lib/station-aqi.js";

describe("computeStationAqis", () => {
  const baseTime = new Date("2026-11-22T08:00:00.000Z");

  it("selects maximum avg_value as AQI and records dominant pollutant", () => {
    const readings: ParsedReading[] = [
      {
        station: "Station 1",
        pollutantId: "PM2.5",
        avgValue: 145,
        updatedAt: baseTime,
      },
      {
        station: "Station 1",
        pollutantId: "PM10",
        avgValue: 210,
        updatedAt: baseTime,
      },
      {
        station: "Station 1",
        pollutantId: "NO2",
        avgValue: 60,
        updatedAt: baseTime,
      },
    ];

    const results = computeStationAqis(readings, baseTime);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      station: "Station 1",
      aqi: 210,
      dominantPollutant: "PM10",
      updatedAt: baseTime,
    });
  });

  it("requires at least 3 distinct pollutants per station", () => {
    const onlyTwo: ParsedReading[] = [
      {
        station: "Station 2",
        pollutantId: "PM2.5",
        avgValue: 100,
        updatedAt: baseTime,
      },
      {
        station: "Station 2",
        pollutantId: "NO2",
        avgValue: 50,
        updatedAt: baseTime,
      },
    ];

    expect(computeStationAqis(onlyTwo, baseTime)).toHaveLength(0);
  });

  it("requires PM2.5 or PM10 among pollutants", () => {
    const noKeyPollutant: ParsedReading[] = [
      {
        station: "Station 3",
        pollutantId: "SO2",
        avgValue: 30,
        updatedAt: baseTime,
      },
      {
        station: "Station 3",
        pollutantId: "NO2",
        avgValue: 40,
        updatedAt: baseTime,
      },
      {
        station: "Station 3",
        pollutantId: "CO",
        avgValue: 20,
        updatedAt: baseTime,
      },
    ];

    expect(computeStationAqis(noKeyPollutant, baseTime)).toHaveLength(0);
  });

  it("excludes stations where newest reading is older than 3 hours", () => {
    // 3 hours and 5 minutes earlier
    const staleTime = new Date(baseTime.getTime() - (3 * 60 + 5) * 60 * 1000);
    const staleReadings: ParsedReading[] = [
      {
        station: "Station Stale",
        pollutantId: "PM2.5",
        avgValue: 150,
        updatedAt: staleTime,
      },
      {
        station: "Station Stale",
        pollutantId: "PM10",
        avgValue: 180,
        updatedAt: staleTime,
      },
      {
        station: "Station Stale",
        pollutantId: "NO2",
        avgValue: 50,
        updatedAt: staleTime,
      },
    ];

    expect(computeStationAqis(staleReadings, baseTime)).toHaveLength(0);
  });
});
