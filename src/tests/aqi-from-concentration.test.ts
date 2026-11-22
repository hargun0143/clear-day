import { describe, expect, it } from "vitest";
import {
  calculateSubIndex,
  computeAqiFromConcentrations,
} from "../../api/_lib/aqi-from-concentration.js";
import {
  PM10_BREAKPOINTS,
  PM25_BREAKPOINTS,
} from "../../api/_lib/aqi-breakpoints.js";

describe("calculateSubIndex", () => {
  it("interpolates PM2.5 correctly at each breakpoint edge", () => {
    expect(calculateSubIndex(0, PM25_BREAKPOINTS)).toBe(0);
    expect(calculateSubIndex(30, PM25_BREAKPOINTS)).toBe(50);
    expect(calculateSubIndex(31, PM25_BREAKPOINTS)).toBe(51);
    expect(calculateSubIndex(60, PM25_BREAKPOINTS)).toBe(100);
    expect(calculateSubIndex(61, PM25_BREAKPOINTS)).toBe(101);
    expect(calculateSubIndex(90, PM25_BREAKPOINTS)).toBe(200);
    expect(calculateSubIndex(91, PM25_BREAKPOINTS)).toBe(201);
    expect(calculateSubIndex(120, PM25_BREAKPOINTS)).toBe(300);
    expect(calculateSubIndex(121, PM25_BREAKPOINTS)).toBe(301);
    expect(calculateSubIndex(250, PM25_BREAKPOINTS)).toBe(400);
  });

  it("interpolates PM10 correctly at each breakpoint edge", () => {
    expect(calculateSubIndex(0, PM10_BREAKPOINTS)).toBe(0);
    expect(calculateSubIndex(50, PM10_BREAKPOINTS)).toBe(50);
    expect(calculateSubIndex(51, PM10_BREAKPOINTS)).toBe(51);
    expect(calculateSubIndex(100, PM10_BREAKPOINTS)).toBe(100);
    expect(calculateSubIndex(101, PM10_BREAKPOINTS)).toBe(101);
    expect(calculateSubIndex(250, PM10_BREAKPOINTS)).toBe(200);
    expect(calculateSubIndex(251, PM10_BREAKPOINTS)).toBe(201);
    expect(calculateSubIndex(350, PM10_BREAKPOINTS)).toBe(300);
    expect(calculateSubIndex(351, PM10_BREAKPOINTS)).toBe(301);
    expect(calculateSubIndex(430, PM10_BREAKPOINTS)).toBe(400);
  });

  it("interpolates interior values correctly", () => {
    // PM2.5: 0-30 -> 0-50: at 15 concentration = 25 AQI
    expect(calculateSubIndex(15, PM25_BREAKPOINTS)).toBe(25);
    // PM10: 0-50 -> 0-50: at 25 concentration = 25 AQI
    expect(calculateSubIndex(25, PM10_BREAKPOINTS)).toBe(25);
  });

  it("linearly extends last segment and clamps to 500 above maximum breakpoint", () => {
    // PM2.5 at 300 is 438
    expect(calculateSubIndex(300, PM25_BREAKPOINTS)).toBe(438);
    // Extreme values clamped to 500
    expect(calculateSubIndex(600, PM25_BREAKPOINTS)).toBe(500);
    expect(calculateSubIndex(800, PM10_BREAKPOINTS)).toBe(500);
  });

  it("rejects negative or non-numeric input", () => {
    expect(calculateSubIndex(-5, PM25_BREAKPOINTS)).toBeNull();
    expect(calculateSubIndex(Number.NaN, PM25_BREAKPOINTS)).toBeNull();
    expect(
      calculateSubIndex(Number.POSITIVE_INFINITY, PM25_BREAKPOINTS)
    ).toBeNull();
  });
});

describe("computeAqiFromConcentrations", () => {
  it("selects dominant pollutant when PM10 is higher than PM2.5", () => {
    // PM2.5 concentration 15 -> subindex 25
    // PM10 concentration 100 -> subindex 100
    const result = computeAqiFromConcentrations(15, 100);
    expect(result).toEqual({ aqi: 100, dominantPollutant: "PM10" });
  });

  it("selects dominant pollutant when PM2.5 is higher than PM10", () => {
    // PM2.5 concentration 60 -> subindex 100
    // PM10 concentration 25 -> subindex 25
    const result = computeAqiFromConcentrations(60, 25);
    expect(result).toEqual({ aqi: 100, dominantPollutant: "PM2.5" });
  });

  it("returns null when all inputs are invalid", () => {
    expect(computeAqiFromConcentrations(-1, -10)).toBeNull();
    expect(computeAqiFromConcentrations(null, undefined)).toBeNull();
  });
});
