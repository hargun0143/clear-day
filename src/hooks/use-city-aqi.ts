import { useCallback, useEffect, useState } from "react";
import { fetchCityAqi, type CityAqiResult } from "@/services/aqi-client";

export type AqiStatus = "loading" | "success" | "error";

export interface UseCityAqiReturn {
  status: AqiStatus;
  data: CityAqiResult | null;
  error: string | null;
  retry: () => void;
}

export function useCityAqi(cityId: string | null): UseCityAqiReturn {
  const [prevCityId, setPrevCityId] = useState(cityId);
  const [status, setStatus] = useState<AqiStatus>("loading");
  const [data, setData] = useState<CityAqiResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  if (prevCityId !== cityId) {
    setPrevCityId(cityId);
    setStatus("loading");
    setData(null);
    setError(null);
  }

  const retry = useCallback(() => {
    setStatus("loading");
    setError(null);
    setRetryKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!cityId) {
      return;
    }

    const controller = new AbortController();

    fetchCityAqi(cityId, controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) {
          setData(result);
          setStatus("success");
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!controller.signal.aborted) {
          const message =
            err instanceof Error ? err.message : "Failed to load AQI";
          setError(message);
          setStatus("error");
        }
      });

    return () => {
      controller.abort();
    };
  }, [cityId, retryKey]);

  return { status, data, error, retry };
}
