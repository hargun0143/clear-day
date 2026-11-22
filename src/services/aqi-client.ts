export interface CpcbCityAqiResult {
  cityId: string;
  aqi: number;
  stationCount: number;
  dominantPollutant: string;
  updatedAt: string;
  source: "cpcb";
  isEstimate: true;
}

export interface OpenMeteoCityAqiResult {
  cityId: string;
  aqi: number;
  dominantPollutant: string;
  updatedAt: string;
  source: "open-meteo";
  sourceLabel: "Open-Meteo (CAMS model)";
  isModelled: true;
  isEstimate: true;
}

export type CityAqiResult = CpcbCityAqiResult | OpenMeteoCityAqiResult;

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
      if (errData.error === "no_data_available") {
        errorMsg = "No fresh or modelled air quality data available";
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
