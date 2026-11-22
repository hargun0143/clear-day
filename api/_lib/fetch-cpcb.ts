import {
  CPCB_BASE_URL,
  CPCB_FETCH_LIMIT,
  CPCB_FETCH_TIMEOUT_MS,
  CPCB_MAX_RETRIES,
  CPCB_RETRY_BACKOFF_MS,
} from "./cpcb-config.js";
import type { CpcbApiResponse, CpcbRawRecord } from "./cpcb-types.js";

export type FetchCpcbResult =
  | { ok: true; records: CpcbRawRecord[] }
  | { ok: false; error: "upstream_error" | "no_fresh_data" };

export interface FetchCpcbOptions {
  fetchFn?: typeof fetch;
  sleepFn?: (ms: number) => Promise<void>;
  timeoutMs?: number;
  maxRetries?: number;
  backoffMs?: number;
}

const defaultSleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function fetchCpcbRecords(
  cpcbCity: string,
  cpcbState: string,
  apiKey: string,
  options: FetchCpcbOptions = {}
): Promise<FetchCpcbResult> {
  const {
    fetchFn = fetch,
    sleepFn = defaultSleep,
    timeoutMs = CPCB_FETCH_TIMEOUT_MS,
    maxRetries = CPCB_MAX_RETRIES,
    backoffMs = CPCB_RETRY_BACKOFF_MS,
  } = options;

  const url = `${CPCB_BASE_URL}?api-key=${encodeURIComponent(apiKey)}&format=json&limit=${CPCB_FETCH_LIMIT}&filters[city]=${encodeURIComponent(cpcbCity)}&filters[state]=${encodeURIComponent(cpcbState)}`;

  let lastFailureReason: "upstream_error" | "no_fresh_data" = "upstream_error";

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) {
      await sleepFn(backoffMs * attempt);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetchFn(url, { signal: controller.signal });
      if (!response.ok) {
        lastFailureReason = "upstream_error";
        continue;
      }

      const data = (await response.json()) as CpcbApiResponse;
      if (!data.records || !Array.isArray(data.records)) {
        lastFailureReason = "upstream_error";
        continue;
      }

      if (data.records.length === 0) {
        lastFailureReason = "no_fresh_data";
        continue;
      }

      return { ok: true, records: data.records };
    } catch {
      lastFailureReason = "upstream_error";
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return { ok: false, error: lastFailureReason };
}
