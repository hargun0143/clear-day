import { CPCB_FETCH_TIMEOUT_MS, CPCB_RETRY_BACKOFF_MS } from "./cpcb-config.js";
import { computeAqiFromConcentrations } from "./aqi-from-concentration.js";

export const OPEN_METEO_BASE_URL =
  "https://air-quality-api.open-meteo.com/v1/air-quality";

export interface OpenMeteoSuccessData {
  aqi: number;
  dominantPollutant: string;
  updatedAt: string;
}

export type FetchOpenMeteoResult =
  | { ok: true; data: OpenMeteoSuccessData }
  | { ok: false; error: "upstream_error" };

export interface FetchOpenMeteoOptions {
  fetchFn?: typeof fetch;
  sleepFn?: (ms: number) => Promise<void>;
  timeoutMs?: number;
  maxRetries?: number;
  backoffMs?: number;
}

interface OpenMeteoApiResponse {
  current?: {
    time?: string;
    pm2_5?: number | null;
    pm10?: number | null;
  };
}

const defaultSleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

function formatTime(timeStr: string | undefined): string {
  if (!timeStr) return new Date().toISOString();
  if (
    timeStr.includes("Z") ||
    timeStr.includes("+") ||
    timeStr.includes("-", 10)
  ) {
    const parsed = new Date(timeStr);
    return Number.isNaN(parsed.getTime())
      ? new Date().toISOString()
      : parsed.toISOString();
  }
  const parsed = new Date(`${timeStr}:00+05:30`);
  return Number.isNaN(parsed.getTime())
    ? new Date().toISOString()
    : parsed.toISOString();
}

export async function fetchOpenMeteoAqi(
  latitude: number,
  longitude: number,
  options: FetchOpenMeteoOptions = {}
): Promise<FetchOpenMeteoResult> {
  const {
    fetchFn = fetch,
    sleepFn = defaultSleep,
    timeoutMs = CPCB_FETCH_TIMEOUT_MS,
    maxRetries = 1,
    backoffMs = CPCB_RETRY_BACKOFF_MS,
  } = options;

  const url = `${OPEN_METEO_BASE_URL}?latitude=${latitude}&longitude=${longitude}&current=pm2_5,pm10&timezone=Asia%2FKolkata`;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) {
      await sleepFn(backoffMs * attempt);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetchFn(url, { signal: controller.signal });
      if (!response.ok) {
        continue;
      }

      const json = (await response.json()) as OpenMeteoApiResponse;
      const current = json.current;
      if (!current) {
        continue;
      }

      const aqiRes = computeAqiFromConcentrations(current.pm2_5, current.pm10);
      if (!aqiRes) {
        continue;
      }

      return {
        ok: true,
        data: {
          aqi: aqiRes.aqi,
          dominantPollutant: aqiRes.dominantPollutant,
          updatedAt: formatTime(current.time),
        },
      };
    } catch {
      // Retry on network/timeout error
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return { ok: false, error: "upstream_error" };
}
