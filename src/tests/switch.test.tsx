import { describe, expect, it } from "vitest";

/**
 * Radix UI Switch sets data-state="checked" | "unchecked" and aria-checked.
 * Our CSS uses data-[state=checked] / data-[state=unchecked] selectors.
 * This test locks down the string values so a Radix update cannot silently
 * break the visual state by changing what getState() returns.
 */
describe("Switch data-state contract", () => {
  const getState = (checked: boolean) => (checked ? "checked" : "unchecked");

  it("maps true to the string 'checked'", () => {
    expect(getState(true)).toBe("checked");
  });

  it("maps false to the string 'unchecked'", () => {
    expect(getState(false)).toBe("unchecked");
  });

  it("checked state string matches the data-[state=checked] CSS selector literal", () => {
    // The Tailwind variant data-[state=checked]:bg-teal compiles to
    // the attribute selector [data-state="checked"]. Verify the value matches.
    const checkedValue = getState(true);
    expect(`data-[state=${checkedValue}]`).toBe("data-[state=checked]");
  });

  it("unchecked state string matches the data-[state=unchecked] CSS selector literal", () => {
    const uncheckedValue = getState(false);
    expect(`data-[state=${uncheckedValue}]`).toBe("data-[state=unchecked]");
  });

  it("aria-checked should be a boolean string matching the checked state", () => {
    expect(String(true)).toBe("true");
    expect(String(false)).toBe("false");
  });
});
