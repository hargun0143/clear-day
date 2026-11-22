import { describe, expect, it, vi } from "vitest";
import { processAqiRequest } from "../../api/aqi.js";

describe("processAqiRequest handler logic", () => {
  const dummyApiKey = "secret-cpcb-key-12345";
  const now = new Date("2026-11-22T08:00:00.000Z");

  it("returns 400 for unknown or missing city id", async () => {
    const resMissing = await processAqiRequest(undefined);
    expect(resMissing.status).toBe(400);
    expect(resMissing.body).toEqual({ error: "invalid_city" });

    const resUnknown = await processAqiRequest("atlantis");
    expect(resUnknown.status).toBe(400);
    expect(resUnknown.body).toEqual({ error: "invalid_city" });
  });

  it("returns 502 when upstream API fails or returns no data", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    const res = await processAqiRequest("delhi", {
      now,
      apiKey: dummyApiKey,
      fetchFn: mockFetch,
      sleepFn: vi.fn(),
    });

    expect(res.status).toBe(502);
    expect(res.body).toEqual({ error: "upstream_error" });
  });

  it("returns 200 with CityAqiResult for valid records and never leaks the API key", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        status: "ok",
        records: [
          {
            station: "Station 1",
            pollutant_id: "PM2.5",
            avg_value: "160",
            last_update: "22-11-2026 13:00:00",
          },
          {
            station: "Station 1",
            pollutant_id: "PM10",
            avg_value: "190",
            last_update: "22-11-2026 13:00:00",
          },
          {
            station: "Station 1",
            pollutant_id: "NO2",
            avg_value: "50",
            last_update: "22-11-2026 13:00:00",
          },
        ],
      }),
    } as Response);

    const res = await processAqiRequest("delhi", {
      now,
      apiKey: dummyApiKey,
      fetchFn: mockFetch,
      sleepFn: vi.fn(),
    });

    expect(res.status).toBe(200);
    expect(res.headers["Cache-Control"]).toBe(
      "s-maxage=300, stale-while-revalidate=300"
    );

    const bodyStr = JSON.stringify(res.body);
    const headersStr = JSON.stringify(res.headers);

    expect(bodyStr).not.toContain(dummyApiKey);
    expect(headersStr).not.toContain(dummyApiKey);

    if ("aqi" in res.body) {
      expect(res.body.cityId).toBe("delhi");
      expect(res.body.aqi).toBe(190);
      expect(res.body.stationCount).toBe(1);
      expect(res.body.dominantPollutant).toBe("PM10");
      expect(res.body.source).toBe("CPCB via data.gov.in");
      expect(res.body.isEstimate).toBe(true);
    }
  });
});
