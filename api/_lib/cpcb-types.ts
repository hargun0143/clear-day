import type { CPCB_SOURCE } from "./cpcb-config.js";

export interface CpcbRawRecord {
  country?: string;
  state?: string;
  city?: string;
  station?: string;
  last_update?: string;
  latitude?: string;
  longitude?: string;
  pollutant_id?: string;
  min_value?: string;
  max_value?: string;
  avg_value?: string;
}

export interface CpcbApiResponse {
  status?: string;
  total?: number;
  count?: number;
  records?: CpcbRawRecord[];
}

export interface ParsedReading {
  station: string;
  pollutantId: string;
  avgValue: number;
  updatedAt: Date;
}

export interface StationAqi {
  station: string;
  aqi: number;
  dominantPollutant: string;
  updatedAt: Date;
}

export interface CityAqiResult {
  cityId: string;
  aqi: number;
  stationCount: number;
  dominantPollutant: string;
  updatedAt: string;
  source: typeof CPCB_SOURCE;
  isEstimate: true;
}

export type AqiErrorCode = "invalid_city" | "no_fresh_data" | "upstream_error";

export interface AqiErrorResponse {
  error: AqiErrorCode;
}
