import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GoodHabitsCard } from "@/components/plan/good-habits-card";

describe("GoodHabitsCard", () => {
  it("renders nothing when goodHabits is undefined", () => {
    const html = renderToStaticMarkup(<GoodHabitsCard />);
    expect(html).toBe("");
  });

  it("renders nothing when goodHabits is an empty array", () => {
    const html = renderToStaticMarkup(<GoodHabitsCard goodHabits={[]} />);
    expect(html).toBe("");
  });

  it("renders the title and habits when non-empty", () => {
    const habits = [
      "Using public transit for commuting",
      "Running an air purifier at home",
    ];
    const html = renderToStaticMarkup(<GoodHabitsCard goodHabits={habits} />);
    expect(html).toContain("What you are already doing well");
    expect(html).toContain("Using public transit for commuting");
    expect(html).toContain("Running an air purifier at home");
  });
});
