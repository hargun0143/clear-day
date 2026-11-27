import { describe, expect, it } from "vitest";
import { toStringList } from "@/utils/to-string-list";

describe("toStringList", () => {
  it("normalizes string arrays, single strings, and invalid values", () => {
    expect(toStringList(["a", "b"])).toEqual(["a", "b"]);
    expect(toStringList(["a", 123, null, "b"])).toEqual(["a", "b"]);
    expect(toStringList("single")).toEqual(["single"]);
    expect(toStringList("")).toEqual([]);
    expect(toStringList(null)).toEqual([]);
    expect(toStringList(undefined)).toEqual([]);
    expect(toStringList(42)).toEqual([]);
    expect(toStringList({})).toEqual([]);
  });
});
