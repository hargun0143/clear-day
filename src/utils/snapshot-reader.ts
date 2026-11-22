import rawSnapshot from "@/data/sample-snapshot.json";
import type { CityAqiResult } from "@/services/aqi-client";

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

export function formatSnapshotTime(
  isoString: string | null | undefined
): string | null {
  if (!isoString) return null;
  try {
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return null;
    const formatted = d.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return `${formatted} IST`;
  } catch {
    return null;
  }
}
