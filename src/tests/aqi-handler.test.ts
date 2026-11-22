import { describe, expect, it, vi } from "vitest";
import { processAqiRequest } from "../../api/aqi.js";

describe("processAqiRequest handler fallback order", () => {
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

  it("returns cpcb source when CPCB request succeeds", async () => {
    const mockFetch = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes("data.gov.in")) {
        return {
          ok: true,
          json: async () => ({
            records: [
              {
                station: "S1",
                pollutant_id: "PM2.5",
                avg_value: "160",
                last_update: "22-11-2026 13:00:00",
              },
              {
                station: "S1",
                pollutant_id: "PM10",
                avg_value: "190",
                last_update: "22-11-2026 13:00:00",
              },
              {
                station: "S1",
                pollutant_id: "NO2",
                avg_value: "50",
                last_update: "22-11-2026 13:00:00",
              },
            ],
          }),
        } as Response;
      }
      return { ok: false, status: 500 } as Response;
    });

    const res = await processAqiRequest("delhi", {
      now,
      apiKey: dummyApiKey,
      fetchFn: mockFetch,
      sleepFn: vi.fn(),
    });

    expect(res.status).toBe(200);
    expect(JSON.stringify(res.body)).not.toContain(dummyApiKey);
    if ("source" in res.body) {
      expect(res.body.source).toBe("cpcb");
      expect(res.body.aqi).toBe(190);
    }
  });

  it("falls back to open-meteo source when CPCB fails", async () => {
    const mockFetch = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes("data.gov.in")) {
        return { ok: false, status: 500 } as Response;
      }
      if (url.includes("open-meteo.com")) {
        return {
          ok: true,
          json: async () => ({
            current: {
              time: "2026-11-22T13:00",
              pm2_5: 60, // AQI 100
              pm10: 50,
            },
          }),
        } as Response;
      }
      return { ok: false, status: 500 } as Response;
    });

    const res = await processAqiRequest("delhi", {
      now,
      apiKey: dummyApiKey,
      fetchFn: mockFetch,
      sleepFn: vi.fn(),
    });

    expect(res.status).toBe(200);
    if ("source" in res.body) {
      expect(res.body.source).toBe("open-meteo");
      expect(res.body.aqi).toBe(100);
      expect(res.body.isEstimate).toBe(true);
      if (res.body.source === "open-meteo") {
        expect(res.body.isModelled).toBe(true);
        expect(res.body.sourceLabel).toBe("Open-Meteo (CAMS model)");
      }
    }
  });

  it("returns 502 with no_data_available when both CPCB and Open-Meteo fail", async () => {
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
    expect(res.body).toEqual({ error: "no_data_available" });
  });
});
