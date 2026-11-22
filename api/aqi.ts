import type { IncomingMessage, ServerResponse } from "node:http";
import { getCityById } from "../src/constants/cities.js";
import { computeCityAqi } from "./_lib/city-aqi.js";
import { CACHE_CONTROL_HEADER } from "./_lib/cpcb-config.js";
import {
  OPEN_METEO_LABEL,
  OPEN_METEO_SOURCE,
  type AqiErrorResponse,
  type CityAqiResult,
  type ParsedReading,
} from "./_lib/cpcb-types.js";
import { fetchCpcbRecords } from "./_lib/fetch-cpcb.js";
import { fetchOpenMeteoAqi } from "./_lib/open-meteo.js";
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

  if (apiKey) {
    try {
      const fetchRes = await fetchCpcbRecords(
        city.cpcbCity,
        city.cpcbState,
        apiKey,
        { fetchFn, sleepFn }
      );
      if (fetchRes.ok) {
        const readings = fetchRes.records
          .map(parseRecord)
          .filter((r): r is ParsedReading => r !== null);
        const stations = computeStationAqis(readings, now);
        const cityRes = computeCityAqi(city.id, stations);
        if (cityRes.ok) return { status: 200, headers, body: cityRes.data };
      }
    } catch {
      // Fall through to Open-Meteo fallback
    }
  }

  try {
    const meteoRes = await fetchOpenMeteoAqi(city.latitude, city.longitude, {
      fetchFn,
      sleepFn,
    });
    if (meteoRes.ok) {
      const { aqi, dominantPollutant, updatedAt } = meteoRes.data;
      return {
        status: 200,
        headers,
        body: {
          cityId: city.id,
          aqi,
          dominantPollutant,
          updatedAt,
          source: OPEN_METEO_SOURCE,
          sourceLabel: OPEN_METEO_LABEL,
          isModelled: true,
          isEstimate: true,
        },
      };
    }
  } catch {
    // Fall through to 502
  }

  return { status: 502, headers, body: { error: "no_data_available" } };
}

export default async function handler(
  req: IncomingMessage & {
    query?: Record<string, string | string[] | undefined>;
  },
  res: ServerResponse
): Promise<void> {
  const q = req.query?.city;
  const rawCity = Array.isArray(q)
    ? q[0]
    : (q ??
      new URL(req.url ?? "", "http://localhost").searchParams.get("city") ??
      undefined);

  const result = await processAqiRequest(rawCity);
  res.statusCode = result.status;
  for (const [key, value] of Object.entries(result.headers))
    res.setHeader(key, value);
  res.end(JSON.stringify(result.body));
}
