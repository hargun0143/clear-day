import { describe, expect, it, vi } from "vitest";
import { fetchOpenMeteoAqi } from "../../api/_lib/open-meteo.js";

describe("fetchOpenMeteoAqi", () => {
  const noopSleep = vi.fn().mockResolvedValue(undefined);

  it("successfully parses Open-Meteo response into AQI result", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        latitude: 28.61,
        longitude: 77.21,
        current: {
          time: "2026-11-22T13:00",
          pm2_5: 60, // AQI 100
          pm10: 50, // AQI 50
        },
      }),
    } as Response);

    const result = await fetchOpenMeteoAqi(28.61, 77.21, {
      fetchFn: mockFetch,
      sleepFn: noopSleep,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.aqi).toBe(100);
      expect(result.data.dominantPollutant).toBe("PM2.5");
      expect(result.data.updatedAt).toContain("2026-11-22");
    }
  });

  it("retries on initial failure and succeeds on retry", async () => {
    let calls = 0;
    const mockFetch = vi.fn().mockImplementation(async () => {
      calls++;
      if (calls === 1) {
        return { ok: false, status: 500 } as Response;
      }
      return {
        ok: true,
        json: async () => ({
          current: {
            time: "2026-11-22T13:00",
            pm2_5: 30, // AQI 50
            pm10: 100, // AQI 100
          },
        }),
      } as Response;
    });

    const result = await fetchOpenMeteoAqi(28.61, 77.21, {
      fetchFn: mockFetch,
      sleepFn: noopSleep,
      maxRetries: 1,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.aqi).toBe(100);
      expect(result.data.dominantPollutant).toBe("PM10");
    }
    expect(calls).toBe(2);
    expect(noopSleep).toHaveBeenCalledWith(300);
  });

  it("returns upstream_error after retries are exhausted", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
    } as Response);

    const result = await fetchOpenMeteoAqi(28.61, 77.21, {
      fetchFn: mockFetch,
      sleepFn: noopSleep,
      maxRetries: 1,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("upstream_error");
    }
  });
});
