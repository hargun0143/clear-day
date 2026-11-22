import {
  MAX_AQI_VALUE,
  PM10_BREAKPOINTS,
  PM25_BREAKPOINTS,
  type Breakpoint,
} from "./aqi-breakpoints.js";

export interface AqiFromConcentrationResult {
  aqi: number;
  dominantPollutant: "PM2.5" | "PM10";
}

export function calculateSubIndex(
  concentration: number,
  breakpoints: readonly Breakpoint[]
): number | null {
  if (!Number.isFinite(concentration) || concentration < 0) {
    return null;
  }

  let bp = breakpoints[breakpoints.length - 1];
  for (const b of breakpoints) {
    if (concentration <= b.cHigh) {
      bp = b;
      break;
    }
  }

  const { cLow, cHigh, iLow, iHigh } = bp;
  const slope = (iHigh - iLow) / (cHigh - cLow);
  const raw = iLow + slope * (concentration - cLow);

  return Math.min(MAX_AQI_VALUE, Math.max(0, Math.round(raw)));
}

export function computeAqiFromConcentrations(
  pm25: number | null | undefined,
  pm10: number | null | undefined
): AqiFromConcentrationResult | null {
  const pm25SubIndex =
    typeof pm25 === "number" ? calculateSubIndex(pm25, PM25_BREAKPOINTS) : null;
  const pm10SubIndex =
    typeof pm10 === "number" ? calculateSubIndex(pm10, PM10_BREAKPOINTS) : null;

  if (pm25SubIndex === null && pm10SubIndex === null) {
    return null;
  }

  if (pm25SubIndex !== null && pm10SubIndex !== null) {
    if (pm10SubIndex > pm25SubIndex) {
      return { aqi: pm10SubIndex, dominantPollutant: "PM10" };
    }
    return { aqi: pm25SubIndex, dominantPollutant: "PM2.5" };
  }

  if (pm25SubIndex !== null) {
    return { aqi: pm25SubIndex, dominantPollutant: "PM2.5" };
  }

  return { aqi: pm10SubIndex as number, dominantPollutant: "PM10" };
}
