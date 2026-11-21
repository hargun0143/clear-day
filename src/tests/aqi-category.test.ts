import { describe, expect, it } from "vitest";
import { getAqiBand } from "@/utils/aqi-category";

describe("getAqiBand", () => {
  it("classifies Good boundaries (0, 50)", () => {
    const minResult = getAqiBand(0);
    expect(minResult?.band.id).toBe("good");
    expect(minResult?.beyondScale).toBe(false);

    const maxResult = getAqiBand(50);
    expect(maxResult?.band.id).toBe("good");
    expect(maxResult?.beyondScale).toBe(false);
  });

  it("classifies Satisfactory boundaries (51, 100)", () => {
    const minResult = getAqiBand(51);
    expect(minResult?.band.id).toBe("satisfactory");
    expect(minResult?.beyondScale).toBe(false);

    const maxResult = getAqiBand(100);
    expect(maxResult?.band.id).toBe("satisfactory");
    expect(maxResult?.beyondScale).toBe(false);
  });

  it("classifies Moderate boundaries (101, 200)", () => {
    const minResult = getAqiBand(101);
    expect(minResult?.band.id).toBe("moderate");
    expect(minResult?.beyondScale).toBe(false);

    const maxResult = getAqiBand(200);
    expect(maxResult?.band.id).toBe("moderate");
    expect(maxResult?.beyondScale).toBe(false);
  });

  it("classifies Poor boundaries (201, 300)", () => {
    const minResult = getAqiBand(201);
    expect(minResult?.band.id).toBe("poor");
    expect(minResult?.beyondScale).toBe(false);

    const maxResult = getAqiBand(300);
    expect(maxResult?.band.id).toBe("poor");
    expect(maxResult?.beyondScale).toBe(false);
  });

  it("classifies Very Poor boundaries (301, 400)", () => {
    const minResult = getAqiBand(301);
    expect(minResult?.band.id).toBe("very-poor");
    expect(minResult?.beyondScale).toBe(false);

    const maxResult = getAqiBand(400);
    expect(maxResult?.band.id).toBe("very-poor");
    expect(maxResult?.beyondScale).toBe(false);
  });

  it("classifies Severe boundaries (401, 500)", () => {
    const minResult = getAqiBand(401);
    expect(minResult?.band.id).toBe("severe");
    expect(minResult?.beyondScale).toBe(false);

    const maxResult = getAqiBand(500);
    expect(maxResult?.band.id).toBe("severe");
    expect(maxResult?.beyondScale).toBe(false);
  });

  it("classifies values above 500 as Severe with beyondScale true (501, 900)", () => {
    const result501 = getAqiBand(501);
    expect(result501?.band.id).toBe("severe");
    expect(result501?.beyondScale).toBe(true);

    const result900 = getAqiBand(900);
    expect(result900?.band.id).toBe("severe");
    expect(result900?.beyondScale).toBe(true);
  });

  it("returns null for non-integer, negative, or non-finite inputs", () => {
    expect(getAqiBand(-1)).toBeNull();
    expect(getAqiBand(12.5)).toBeNull();
    expect(getAqiBand(Number.NaN)).toBeNull();
  });
});
