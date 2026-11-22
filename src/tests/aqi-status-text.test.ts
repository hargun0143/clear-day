import { describe, expect, it } from "vitest";
import {
  formatCapturedTime,
  getAqiCardSourceText,
  getStatusPill,
} from "@/utils/aqi-status-text";

describe("aqi-status-text", () => {
  describe("formatCapturedTime", () => {
    it("returns null for null, undefined or empty input", () => {
      expect(formatCapturedTime(null)).toBeNull();
      expect(formatCapturedTime(undefined)).toBeNull();
      expect(formatCapturedTime("")).toBeNull();
    });

    it("formats a valid ISO string into Indian Standard Time", () => {
      const formatted = formatCapturedTime("2026-11-22T08:19:12.203Z");
      expect(formatted).toContain("IST");
      expect(formatted).toContain("Nov");
      expect(formatted).toContain("2026");
    });
  });

  describe("getStatusPill", () => {
    it("returns live mode pill text and teal dot color", () => {
      const result = getStatusPill(false);
      expect(result.text).toBe("Live CPCB readings · 23 Indian cities");
      expect(result.dotColorClass).toBe("bg-teal");
    });

    it("returns sample mode pill text with formatted date and amber dot color", () => {
      const result = getStatusPill(true, "2026-11-22T08:19:12.203Z");
      expect(result.text).toContain("Sample data · saved");
      expect(result.text).toContain("IST");
      expect(result.dotColorClass).toBe("bg-amber");
    });

    it("handles sample mode when capturedAt is missing", () => {
      const result = getStatusPill(true, null);
      expect(result.text).toBe("Sample data · saved");
      expect(result.dotColorClass).toBe("bg-amber");
    });
  });

  describe("getAqiCardSourceText", () => {
    it("returns manual entry text for manual state", () => {
      expect(getAqiCardSourceText({ isManual: true })).toBe("Entered by you");
      expect(getAqiCardSourceText({ source: "manual" })).toBe("Entered by you");
    });

    it("returns sample reading text for sample mode", () => {
      const text = getAqiCardSourceText({
        sampleMode: true,
        capturedAt: "2026-11-22T07:30:00.000Z",
      });
      expect(text).toMatch(/^Saved CPCB reading, captured \d{2}:\d{2}$/);
    });

    it("returns open-meteo modelled estimate text", () => {
      const text = getAqiCardSourceText({
        source: "open-meteo",
        updatedTime: "2026-11-22T07:30:00.000Z",
      });
      expect(text).toContain(
        "Modelled estimate (Open-Meteo / CAMS), not a station reading, updated"
      );
    });

    it("returns live CPCB estimate text with station count", () => {
      const text1 = getAqiCardSourceText({
        source: "cpcb",
        stationsCount: 1,
        updatedTime: "2026-11-22T07:30:00.000Z",
      });
      expect(text1).toContain("Estimate from 1 CPCB station, updated");

      const textMultiple = getAqiCardSourceText({
        source: "cpcb",
        stationsCount: 8,
        updatedTime: "2026-11-22T07:30:00.000Z",
      });
      expect(textMultiple).toContain("Estimate from 8 CPCB stations, updated");
    });

    it("falls back to generic updated time if stationCount is undefined in live mode", () => {
      const text = getAqiCardSourceText({
        source: "cpcb",
        updatedTime: "2026-11-22T07:30:00.000Z",
      });
      expect(text).toMatch(/^Updated \d{2}:\d{2}$/);
    });
  });
});
