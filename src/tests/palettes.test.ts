import { describe, expect, it } from "vitest";
import { CALM_PALETTE, LANDING_PALETTE } from "@/constants/palettes";

describe("palettes", () => {
  it("defines landing flow palette", () => {
    expect(LANDING_PALETTE.baseTop).toBe("#080b10");
    expect(LANDING_PALETTE.baseBottom).toBe("#0e131b");
    expect(LANDING_PALETTE.tealGlow).toContain("45, 212, 191");
    expect(LANDING_PALETTE.amberGlow).toContain("224, 138, 60");
  });

  it("defines calm flow palette", () => {
    expect(CALM_PALETTE.baseTop).toBe("#080b10");
    expect(CALM_PALETTE.baseBottom).toBe("#0b0f16");
    expect(CALM_PALETTE.tealGlow).toContain("45, 212, 191");
    expect(CALM_PALETTE.amberGlow).toContain("224, 138, 60");
  });
});
