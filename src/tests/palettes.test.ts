import { describe, expect, it } from "vitest";
import { CALM_PALETTE, LANDING_PALETTE } from "@/constants/palettes";

describe("palettes", () => {
  it("defines landing palette with three colors", () => {
    expect(LANDING_PALETTE).toHaveLength(3);
    expect(LANDING_PALETTE[0]).toBe("#B9722A");
    expect(LANDING_PALETTE[1]).toBe("#5B6572");
    expect(LANDING_PALETTE[2]).toBe("#3A424D");
  });

  it("defines calm palette with three colors", () => {
    expect(CALM_PALETTE).toHaveLength(3);
    expect(CALM_PALETTE[0]).toBe("#A65A1C");
    expect(CALM_PALETTE[1]).toBe("#3D444E");
    expect(CALM_PALETTE[2]).toBe("#2B323B");
  });
});
