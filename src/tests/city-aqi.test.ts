import { describe, expect, it } from "vitest";
import { computeCityAqi } from "../../api/_lib/city-aqi.js";
import type { StationAqi } from "../../api/_lib/cpcb-types.js";

describe("computeCityAqi", () => {
  const timeA = new Date("2026-11-22T08:00:00.000Z");
  const timeB = new Date("2026-11-22T08:30:00.000Z");

  it("calculates median for odd number of stations", () => {
    const stations: StationAqi[] = [
      {
        station: "S1",
        aqi: 100,
        dominantPollutant: "PM2.5",
        updatedAt: timeA,
      },
      {
        station: "S2",
        aqi: 150,
        dominantPollutant: "PM10",
        updatedAt: timeA,
      },
      {
        station: "S3",
        aqi: 200,
        dominantPollutant: "PM2.5",
        updatedAt: timeB,
      },
    ];

    const result = computeCityAqi("delhi", stations);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.data.aqi).toBe(150);
    expect(result.data.stationCount).toBe(3);
    expect(result.data.dominantPollutant).toBe("PM2.5");
    expect(result.data.updatedAt).toBe(timeB.toISOString());
    expect(result.data.isEstimate).toBe(true);
  });

  it("calculates rounded average of two middle values for even number of stations", () => {
    const stations: StationAqi[] = [
      {
        station: "S1",
        aqi: 100,
        dominantPollutant: "PM2.5",
        updatedAt: timeA,
      },
      {
        station: "S2",
        aqi: 150,
        dominantPollutant: "PM10",
        updatedAt: timeA,
      },
      {
        station: "S3",
        aqi: 180,
        dominantPollutant: "PM10",
        updatedAt: timeA,
      },
      {
        station: "S4",
        aqi: 220,
        dominantPollutant: "PM2.5",
        updatedAt: timeA,
      },
    ];

    const result = computeCityAqi("mumbai", stations);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    // (150 + 180) / 2 = 165
    expect(result.data.aqi).toBe(165);
    expect(result.data.stationCount).toBe(4);
  });

  it("identifies the dominant pollutant as the one with highest frequency among stations", () => {
    const stations: StationAqi[] = [
      {
        station: "S1",
        aqi: 80,
        dominantPollutant: "PM10",
        updatedAt: timeA,
      },
      {
        station: "S2",
        aqi: 90,
        dominantPollutant: "PM2.5",
        updatedAt: timeA,
      },
      {
        station: "S3",
        aqi: 110,
        dominantPollutant: "PM10",
        updatedAt: timeA,
      },
    ];

    const result = computeCityAqi("bengaluru", stations);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.data.dominantPollutant).toBe("PM10");
  });

  it("returns no_fresh_data when there are no valid stations", () => {
    const result = computeCityAqi("kolkata", []);
    expect(result).toEqual({ ok: false, error: "no_fresh_data" });
  });
});
