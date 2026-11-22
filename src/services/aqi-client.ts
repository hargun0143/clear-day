export interface CityAqiResult {
  cityId: string;
  aqi: number;
  stationCount: number;
  dominantPollutant: string;
  updatedAt: string;
  source: string;
  isEstimate: boolean;
}

export interface AqiErrorResponse {
  error: string;
}

export async function fetchCityAqi(
  cityId: string,
  signal?: AbortSignal
): Promise<CityAqiResult> {
  const response = await fetch(`/api/aqi?city=${encodeURIComponent(cityId)}`, {
    signal,
  });

  if (!response.ok) {
    let errorMsg = "Unable to fetch air quality data";
    try {
      const errData = (await response.json()) as AqiErrorResponse;
      if (errData.error === "no_fresh_data") {
        errorMsg = "No fresh CPCB station data available for this city";
      } else if (errData.error === "invalid_city") {
        errorMsg = "Selected city is not supported";
      }
    } catch {
      // Keep default message
    }
    throw new Error(errorMsg);
  }

  return (await response.json()) as CityAqiResult;
}
