import { describe, expect, it } from "vitest";
import {
  COMMUTE_TOPICS,
  selectCommuteTopic,
} from "../../api/_lib/plan/topics/commute-topics-data.js";

describe("commute topics per mobility", () => {
  it("returns car commute precautions for car", () => {
    const topic = selectCommuteTopic("car");
    expect(topic).toBeDefined();
    expect(topic?.id).toBe("commute-car");
    expect(topic?.detail).toContain("windows up");
    expect(topic?.detail).toContain("recirculate");
  });

  it("returns car commute precautions for auto-or-cab", () => {
    const topic = selectCommuteTopic("auto-or-cab");
    expect(topic).toBeDefined();
    expect(topic?.id).toBe("commute-car");
  });

  it("returns transit commute precautions for bus-or-metro", () => {
    const topic = selectCommuteTopic("bus-or-metro");
    expect(topic).toBeDefined();
    expect(topic?.id).toBe("commute-bus-or-metro");
    expect(topic?.detail).toContain("N95 or FFP2");
    expect(topic?.detail).toContain("less crowded carriage");
  });

  it("returns two-wheeler precautions for bicycle-or-two-wheeler", () => {
    const topic = selectCommuteTopic("bicycle-or-two-wheeler");
    expect(topic).toBeDefined();
    expect(topic?.id).toBe("commute-two-wheeler");
    expect(topic?.detail).toContain("quieter lane or side street");
  });

  it("returns walk adjustments for walk", () => {
    const topic = selectCommuteTopic("walk");
    expect(topic).toBeDefined();
    expect(topic?.id).toBe("commute-walk");
    expect(topic?.detail).toContain("quieter streets away from main roads");
  });

  it("returns null for non-road mobility like mostly-indoors", () => {
    expect(selectCommuteTopic("mostly-indoors")).toBeNull();
    expect(selectCommuteTopic("under-2")).toBeNull();
  });

  it("defines all vetted commute topics", () => {
    expect(COMMUTE_TOPICS.length).toBe(4);
  });
});
