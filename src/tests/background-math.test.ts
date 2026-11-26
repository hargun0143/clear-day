import { describe, expect, it } from "vitest";
import { angleAt } from "@/utils/background/flow-angle";
import { getFlowParams } from "@/utils/background/get-flow-params";
import { particleColor } from "@/utils/background/particle-color";
import { lerpParams, TWEEN_DURATION_MS } from "@/utils/background/tween-params";

describe("getFlowParams", () => {
  it("handles key AQI values, clamping, and invalid inputs", () => {
    const p0 = getFlowParams(0);
    expect(p0.count).toBe(90);
    expect(p0.turbulence).toBeCloseTo(0.35);
    expect(p0.amberMix).toBe(0);
    expect(p0.hazeAlpha).toBeCloseTo(0.2);

    const p500 = getFlowParams(500);
    expect(p500.count).toBe(510);
    expect(p500.turbulence).toBeCloseTo(1.45);
    expect(p500.amberMix).toBe(1);
    expect(p500.hazeAlpha).toBeCloseTo(0.7);

    expect(getFlowParams(-20)).toEqual(p0);
    expect(getFlowParams(800)).toEqual(p500);

    const p150 = getFlowParams(150);
    expect(getFlowParams(Number.NaN)).toEqual(p150);
    expect(getFlowParams(undefined)).toEqual(p150);

    const samples = [0, 29, 243, 460, 500].map((v) => getFlowParams(v));
    for (let i = 1; i < samples.length; i++) {
      expect(samples[i]!.count).toBeGreaterThanOrEqual(samples[i - 1]!.count);
      expect(samples[i]!.turbulence).toBeGreaterThanOrEqual(
        samples[i - 1]!.turbulence
      );
    }
  });
});

describe("angleAt", () => {
  it("is deterministic and finite across a grid of inputs", () => {
    for (let x = 0; x <= 1200; x += 300) {
      for (let y = 0; y <= 800; y += 200) {
        for (const t of [0, 1.5, 10]) {
          for (const turb of [0.35, 0.9, 1.45]) {
            const a1 = angleAt(x, y, t, turb);
            const a2 = angleAt(x, y, t, turb);
            expect(Number.isFinite(a1)).toBe(true);
            expect(a1).toBe(a2);
          }
        }
      }
    }
  });
});

describe("particleColor", () => {
  it("matches teal and amber endpoints and increases amber monotonically", () => {
    expect(particleColor(0, 0, 0)).toEqual({ r: 45, g: 212, b: 191 });
    expect(particleColor(0, 1, 0)).toEqual({ r: 224, g: 138, b: 60 });

    let prevRed = 0;
    for (let mix = 0; mix <= 1; mix += 0.2) {
      const c = particleColor(0.2, mix, 0);
      expect(c.r).toBeGreaterThanOrEqual(prevRed);
      prevRed = c.r;
    }
  });
});

describe("lerpParams", () => {
  it("moves toward target and never overshoots", () => {
    const start = getFlowParams(0);
    const target = getFlowParams(500);

    const mid = lerpParams(start, target, TWEEN_DURATION_MS / 2);
    expect(mid.count).toBeGreaterThan(start.count);
    expect(mid.count).toBeLessThan(target.count);
    expect(mid.amberMix).toBeGreaterThan(start.amberMix);
    expect(mid.amberMix).toBeLessThan(target.amberMix);

    const done = lerpParams(start, target, TWEEN_DURATION_MS * 2);
    expect(done).toEqual(target);
  });
});
