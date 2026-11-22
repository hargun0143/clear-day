import rawSnapshot from "@/data/sample-snapshot.json";
import type { CityAqiResult } from "@/services/aqi-client";
import { formatCapturedTime } from "@/utils/aqi-status-text";

export interface SnapshotData {
  capturedAt: string | null;
  readings: Record<string, CityAqiResult>;
}

const snapshot = rawSnapshot as unknown as SnapshotData;

export function getSnapshotCapturedAt(): string | null {
  return snapshot.capturedAt;
}

export function readSnapshotEntry(
  data: SnapshotData,
  cityId: string
): CityAqiResult | null {
  const normalized = cityId.trim().toLowerCase();
  return data.readings[normalized] ?? null;
}

export function getSnapshotReading(cityId: string): CityAqiResult | null {
  return readSnapshotEntry(snapshot, cityId);
}

export const formatSnapshotTime = formatCapturedTime;
