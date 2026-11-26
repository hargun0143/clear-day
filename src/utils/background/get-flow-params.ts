export interface FlowParams {
  count: number;
  turbulence: number;
  amberMix: number;
  hazeAlpha: number;
}

export const DEFAULT_AQI = 150;
export const MIN_AQI = 0;
export const MAX_AQI = 500;
const BASE_COUNT = 90;
const EXTRA_COUNT = 420;
const BASE_TURBULENCE = 0.35;
const EXTRA_TURBULENCE = 1.1;
const BASE_HAZE_ALPHA = 0.2;
const EXTRA_HAZE_ALPHA = 0.5;

export function getFlowParams(aqi?: number | null): FlowParams {
  const validAqi =
    typeof aqi === "number" && Number.isFinite(aqi) ? aqi : DEFAULT_AQI;
  const clamped = Math.min(MAX_AQI, Math.max(MIN_AQI, validAqi));
  const d = clamped / MAX_AQI;

  return {
    count: Math.round(BASE_COUNT + EXTRA_COUNT * d),
    turbulence: BASE_TURBULENCE + EXTRA_TURBULENCE * d,
    amberMix: d,
    hazeAlpha: BASE_HAZE_ALPHA + EXTRA_HAZE_ALPHA * d,
  };
}
