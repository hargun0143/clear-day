import type { FlowParams } from "./get-flow-params";

export const TWEEN_DURATION_MS = 800;

function lerp(start: number, end: number, alpha: number): number {
  return start + (end - start) * alpha;
}

export function lerpParams(
  current: FlowParams,
  target: FlowParams,
  dt: number
): FlowParams {
  if (dt <= 0) return current;
  const alpha = Math.min(1, dt / TWEEN_DURATION_MS);
  return {
    count: Math.round(lerp(current.count, target.count, alpha)),
    turbulence: lerp(current.turbulence, target.turbulence, alpha),
    amberMix: lerp(current.amberMix, target.amberMix, alpha),
    hazeAlpha: lerp(current.hazeAlpha, target.hazeAlpha, alpha),
  };
}
