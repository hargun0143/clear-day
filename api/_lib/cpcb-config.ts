// Assumption: CPCB avg_value numbers are treated as pollutant sub-indices, not raw concentrations.
export const ASSUME_AVG_VALUE_IS_SUB_INDEX = true;

export const CPCB_RESOURCE_ID = "3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69";
export const CPCB_BASE_URL = `https://api.data.gov.in/resource/${CPCB_RESOURCE_ID}`;

export const CPCB_FETCH_LIMIT = 500;
export const CPCB_FETCH_TIMEOUT_MS = 8000;
export const CPCB_MAX_RETRIES = 3;
export const CPCB_RETRY_BACKOFF_MS = 300;

export const STATION_MIN_DISTINCT_POLLUTANTS = 3;
export const STATION_MAX_AGE_HOURS = 3;
export const STATION_MAX_AGE_MS = STATION_MAX_AGE_HOURS * 60 * 60 * 1000;

export const KEY_POLLUTANTS = ["PM2.5", "PM10"] as const;
export const CPCB_SOURCE = "cpcb" as const;
export const CPCB_LABEL = "CPCB via data.gov.in" as const;

export const CACHE_CONTROL_HEADER = "s-maxage=300, stale-while-revalidate=300";
