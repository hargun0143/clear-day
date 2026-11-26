import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { matchesMedia } from "@/utils/background/canvas-helpers";
import { startFlowCanvas } from "@/utils/background/canvas-runner";
import {
  getFlowParams,
  type FlowParams,
} from "@/utils/background/get-flow-params";

export { startFlowCanvas };

export interface UseFlowCanvasOptions {
  aqi: number;
  densityScale: number;
  speedScale: number;
}

export function useFlowCanvas(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  { aqi, densityScale, speedScale }: UseFlowCanvasOptions
): { skipCanvas: boolean; hazeAlpha: number } {
  const targetParams = useMemo(() => getFlowParams(aqi), [aqi]);
  const currentRef = useRef<FlowParams>(targetParams);
  const targetRef = useRef<FlowParams>(targetParams);

  useEffect(() => {
    targetRef.current = targetParams;
  }, [targetParams]);

  const [skipCanvas, setSkipCanvas] = useState(
    () =>
      matchesMedia("(prefers-reduced-transparency: reduce)") ||
      matchesMedia("(forced-colors: active)")
  );

  const reducedMotion = matchesMedia("(prefers-reduced-motion: reduce)");
  const staticTrigger = reducedMotion ? aqi : 0;

  useEffect(() => {
    const rt = window.matchMedia("(prefers-reduced-transparency: reduce)");
    const fc = window.matchMedia("(forced-colors: active)");
    const onAccess = () => setSkipCanvas(rt.matches || fc.matches);
    rt.addEventListener("change", onAccess);
    fc.addEventListener("change", onAccess);

    let cleanupCanvas: (() => void) | undefined;
    if (!rt.matches && !fc.matches) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) {
        cleanupCanvas = startFlowCanvas(
          canvas,
          ctx,
          currentRef,
          targetRef,
          densityScale,
          speedScale
        );
      }
    }

    return () => {
      cleanupCanvas?.();
      rt.removeEventListener("change", onAccess);
      fc.removeEventListener("change", onAccess);
    };
  }, [canvasRef, densityScale, speedScale, skipCanvas, staticTrigger]);

  return { skipCanvas, hazeAlpha: targetParams.hazeAlpha };
}
