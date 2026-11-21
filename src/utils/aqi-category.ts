import { AQI_BANDS, type AqiBand } from "@/constants/aqi-bands";

export interface AqiBandResult {
  band: AqiBand;
  beyondScale: boolean;
}

export function getAqiBand(value: number): AqiBandResult | null {
  if (!Number.isFinite(value) || !Number.isInteger(value) || value < 0) {
    return null;
  }

  if (value > 500) {
    const severeBand = AQI_BANDS[AQI_BANDS.length - 1];
    return { band: severeBand, beyondScale: true };
  }

  const band = AQI_BANDS.find((b) => value >= b.min && value <= b.max);
  if (!band) {
    return null;
  }

  return { band, beyondScale: false };
}
