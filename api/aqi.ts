import type { IncomingMessage, ServerResponse } from "node:http";
import { getCityById } from "../src/constants/cities.js";
import { computeCityAqi } from "./_lib/city-aqi.js";
import { CACHE_CONTROL_HEADER } from "./_lib/cpcb-config.js";
import type {
  AqiErrorResponse,
  CityAqiResult,
  ParsedReading,
} from "./_lib/cpcb-types.js";
import { fetchCpcbRecords } from "./_lib/fetch-cpcb.js";
import { parseRecord } from "./_lib/parse-record.js";
import { computeStationAqis } from "./_lib/station-aqi.js";

export interface HandlerResult {
  status: number;
  headers: Record<string, string>;
  body: CityAqiResult | AqiErrorResponse;
}

export interface ProcessAqiOptions {
  now?: Date;
  apiKey?: string;
  fetchFn?: typeof fetch;
  sleepFn?: (ms: number) => Promise<void>;
}

export async function processAqiRequest(
  cityIdRaw: string | undefined,
  options: ProcessAqiOptions = {}
): Promise<HandlerResult> {
  const {
    now = new Date(),
    apiKey = process.env.DATA_GOV_IN_API_KEY,
    fetchFn,
    sleepFn,
  } = options;

  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": CACHE_CONTROL_HEADER,
  };

  if (!cityIdRaw || typeof cityIdRaw !== "string") {
    return { status: 400, headers, body: { error: "invalid_city" } };
  }

  const city = getCityById(cityIdRaw);
  if (!city) {
    return { status: 400, headers, body: { error: "invalid_city" } };
  }

  if (!apiKey) {
    return { status: 502, headers, body: { error: "upstream_error" } };
  }

  try {
    const fetchRes = await fetchCpcbRecords(
      city.cpcbCity,
      city.cpcbState,
      apiKey,
      { fetchFn, sleepFn }
    );
    if (!fetchRes.ok) {
      return { status: 502, headers, body: { error: fetchRes.error } };
    }

    const readings: ParsedReading[] = [];
    for (const record of fetchRes.records) {
      const parsed = parseRecord(record);
      if (parsed) {
        readings.push(parsed);
      }
    }

    const stations = computeStationAqis(readings, now);
    const cityRes = computeCityAqi(city.id, stations);

    if (!cityRes.ok) {
      return { status: 502, headers, body: { error: cityRes.error } };
    }

    return { status: 200, headers, body: cityRes.data };
  } catch {
    return { status: 502, headers, body: { error: "upstream_error" } };
  }
}

export default async function handler(
  req: IncomingMessage & {
    query?: Record<string, string | string[] | undefined>;
  },
  res: ServerResponse
): Promise<void> {
  const url = new URL(req.url ?? "", "http://localhost");
  const queryCity = req.query?.city;
  const rawCity = Array.isArray(queryCity)
    ? queryCity[0]
    : (queryCity ?? url.searchParams.get("city") ?? undefined);

  const result = await processAqiRequest(rawCity);

  res.statusCode = result.status;
  for (const [key, value] of Object.entries(result.headers)) {
    res.setHeader(key, value);
  }
  res.end(JSON.stringify(result.body));
}
