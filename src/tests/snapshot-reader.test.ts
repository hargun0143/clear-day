import { describe, expect, it } from "vitest";
import {
  formatSnapshotTime,
  getSnapshotCapturedAt,
  getSnapshotReading,
  readSnapshotEntry,
  type SnapshotData,
} from "../utils/snapshot-reader";

describe("snapshot-reader", () => {
  const mockSnapshot: SnapshotData = {
    capturedAt: "2026-11-22T07:30:00.000Z",
    readings: {
      delhi: {
        cityId: "delhi",
        aqi: 220,
        stationCount: 5,
        dominantPollutant: "PM2.5",
        updatedAt: "2026-11-22T07:00:00.000Z",
        source: "cpcb",
        isEstimate: true,
      },
    },
  };

  it("retrieves present city reading correctly", () => {
    const reading = readSnapshotEntry(mockSnapshot, "delhi");
    expect(reading).not.toBeNull();
    expect(reading?.aqi).toBe(220);
    expect(reading?.dominantPollutant).toBe("PM2.5");
  });

  it("returns null for missing city", () => {
    const reading = readSnapshotEntry(mockSnapshot, "unknown_city");
    expect(reading).toBeNull();
  });

  it("handles null or undefined capturedAt", () => {
    expect(formatSnapshotTime(null)).toBeNull();
    expect(formatSnapshotTime(undefined)).toBeNull();
    expect(formatSnapshotTime("invalid-date")).toBeNull();
  });

  it("formats valid ISO timestamp into IST date and time", () => {
    // 2026-11-22T07:30:00.000Z is 13:00 IST (+05:30)
    const formatted = formatSnapshotTime("2026-11-22T07:30:00.000Z");
    expect(formatted).not.toBeNull();
    expect(formatted).toContain("IST");
    expect(formatted).toContain("13:00");
  });

  it("reads real bundled snapshot file without error", () => {
    const capturedAt = getSnapshotCapturedAt();
    expect(typeof capturedAt === "string" || capturedAt === null).toBe(true);
    const reading = getSnapshotReading("delhi");
    expect(reading).not.toBeNull();
    expect(reading?.cityId).toBe("delhi");
  });
});
