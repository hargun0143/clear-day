import { describe, expect, it } from "vitest";
import { validateManualAqi } from "../utils/validate-manual-aqi";

describe("validateManualAqi", () => {
  it("accepts valid AQI numbers and strings", () => {
    expect(validateManualAqi("150")).toEqual({ ok: true, aqi: 150 });
    expect(validateManualAqi(220)).toEqual({ ok: true, aqi: 220 });
  });

  it("accepts boundary values 0 and 500", () => {
    expect(validateManualAqi(0)).toEqual({ ok: true, aqi: 0 });
    expect(validateManualAqi("0")).toEqual({ ok: true, aqi: 0 });
    expect(validateManualAqi(500)).toEqual({ ok: true, aqi: 500 });
    expect(validateManualAqi("500")).toEqual({ ok: true, aqi: 500 });
  });

  it("rejects 501 (out of upper bound)", () => {
    const res = validateManualAqi("501");
    expect(res.ok).toBe(false);
  });

  it("rejects -1 (negative numbers)", () => {
    const res = validateManualAqi("-1");
    expect(res.ok).toBe(false);
  });

  it("rejects 12.5 (decimals / non-integers)", () => {
    const res = validateManualAqi("12.5");
    expect(res.ok).toBe(false);
  });

  it("rejects empty or whitespace input", () => {
    expect(validateManualAqi("").ok).toBe(false);
    expect(validateManualAqi("   ").ok).toBe(false);
    expect(validateManualAqi(null).ok).toBe(false);
    expect(validateManualAqi(undefined).ok).toBe(false);
  });

  it("rejects NaN or non-numeric strings", () => {
    expect(validateManualAqi("abc").ok).toBe(false);
    expect(validateManualAqi(Number.NaN).ok).toBe(false);
  });
});
