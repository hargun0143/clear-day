import { useCallback, useEffect, useRef, useState } from "react";
import {
  type PlanApiResponse,
  type PlanRequestPayload,
  requestPlan,
} from "@/services/plan-client";

export type PlanStatus = "idle" | "loading" | "success" | "error";

export const CLIENT_TIMEOUT_MS = 30000;

export function usePlan(payload: PlanRequestPayload | null) {
  const [status, setStatus] = useState<PlanStatus>(() =>
    payload ? "loading" : "idle"
  );
  const [data, setData] = useState<PlanApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  const execute = useCallback(async (currentPayload: PlanRequestPayload) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setStatus("loading");
    setError(null);

    timeoutIdRef.current = setTimeout(() => {
      controller.abort();
    }, CLIENT_TIMEOUT_MS);

    try {
      const result = await requestPlan(currentPayload, controller.signal);
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
      setData(result);
      setStatus("success");
    } catch (err: unknown) {
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
      if (controller.signal.aborted) {
        setError("Request timed out. Please try again.");
      } else {
        setError(err instanceof Error ? err.message : "Failed to load plan");
      }
      setStatus("error");
    }
  }, []);

  const retry = useCallback(() => {
    if (payload) {
      void execute(payload);
    }
  }, [payload, execute]);

  useEffect(() => {
    if (!payload) {
      return;
    }

    let isMounted = true;
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, CLIENT_TIMEOUT_MS);
    timeoutIdRef.current = timeoutId;

    requestPlan(payload, controller.signal)
      .then((res) => {
        if (!isMounted) return;
        clearTimeout(timeoutId);
        setData(res);
        setStatus("success");
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        clearTimeout(timeoutId);
        if (controller.signal.aborted) {
          setError("Request timed out. Please try again.");
        } else {
          setError(err instanceof Error ? err.message : "Failed to load plan");
        }
        setStatus("error");
      });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [payload]);

  return { status, data, error, retry };
}
