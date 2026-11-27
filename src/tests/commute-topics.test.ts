import { describe, expect, it } from "vitest";
import {
  COMMUTE_TOPICS,
  selectCommuteTopic,
} from "../../api/_lib/plan/topics/commute-topics-data.js";

describe("commute topics per mobility and AQI mask gate", () => {
  it("returns car commute precautions for car and auto-or-cab", () => {
    const car = selectCommuteTopic("car", 150);
    expect(car?.id).toBe("commute-car");
    expect(car?.detail).toContain("windows up");
    expect(car?.detail).toContain("recirculate");

    expect(selectCommuteTopic("auto-or-cab", 150)?.id).toBe("commute-car");
  });

  it("gates mask advice by AQI (no mask at <= 100, mask at >= 101)", () => {
    for (const mobility of [
      "bus-or-metro",
      "bicycle",
      "motorbike-or-scooter",
    ]) {
      const lowAqi = selectCommuteTopic(mobility, 100);
      expect(lowAqi).toBeDefined();
      expect(lowAqi!.detail.toLowerCase()).not.toContain("mask");

      const highAqi = selectCommuteTopic(mobility, 101);
      expect(highAqi).toBeDefined();
      expect(highAqi!.detail.toLowerCase()).toContain("mask");
    }
  });

  it("returns walk adjustments for walk without mask", () => {
    const topic = selectCommuteTopic("walk", 150);
    expect(topic?.id).toBe("commute-walk");
    expect(topic?.detail).toContain("quieter streets away from main roads");
    expect(topic?.detail.toLowerCase()).not.toContain("mask");
  });

  it("returns null for non-road mobility like mostly-indoors", () => {
    expect(selectCommuteTopic("mostly-indoors", 150)).toBeNull();
    expect(selectCommuteTopic("under-2", 150)).toBeNull();
  });

  it("defines all five vetted commute topics", () => {
    expect(COMMUTE_TOPICS.length).toBe(5);
  });
});
