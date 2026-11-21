import { describe, expect, it } from "vitest";
import { getStripCityIds } from "@/utils/strip-cities";

describe("getStripCityIds", () => {
  it("uses Kolkata as third city when Delhi is selected", () => {
    expect(getStripCityIds("delhi")).toEqual(["delhi", "mumbai", "kolkata"]);
  });

  it("uses Kolkata as third city when Mumbai is selected", () => {
    expect(getStripCityIds("mumbai")).toEqual(["delhi", "mumbai", "kolkata"]);
  });

  it("uses the selected city when another city is selected", () => {
    expect(getStripCityIds("pune")).toEqual(["delhi", "mumbai", "pune"]);
    expect(getStripCityIds("bengaluru")).toEqual([
      "delhi",
      "mumbai",
      "bengaluru",
    ]);
  });
});
