import React, { useState } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { useQuestionnaire } from "@/hooks/use-questionnaire";

describe("useQuestionnaire hook state transitions", () => {
  it("tracks back navigation and reset through component wrapper", () => {
    let hookResult: ReturnType<typeof useQuestionnaire> | undefined;

    function TestComponent({ city }: { city: string }) {
      const q = useQuestionnaire(city);
      hookResult = q;
      return React.createElement("div", null, q.currentQuestion?.id);
    }

    renderToString(React.createElement(TestComponent, { city: "mumbai" }));
    expect(hookResult).toBeDefined();
    expect(hookResult?.answers["city"]).toBe("mumbai");
    expect(hookResult?.currentQuestion?.id).toBe("role");
    expect(hookResult?.progress.currentStep).toBe(2);
    expect(hookResult?.canGoNext).toBe(false);

    // Test back from first visible screen returns false
    const movedFromStart = hookResult?.back();
    expect(movedFromStart).toBe(false);
  });

  it("handles step-by-step progress and reset simulation", () => {
    let captured: ReturnType<typeof useQuestionnaire> | undefined;

    function InteractiveComponent() {
      const q = useQuestionnaire("delhi");
      const [, setTick] = useState(0);
      captured = q;

      return React.createElement(
        "button",
        {
          onClick: () => {
            q.answer("role", "office-worker");
            setTick((t) => t + 1);
          },
        },
        "step"
      );
    }

    renderToString(React.createElement(InteractiveComponent));
    expect(captured).toBeDefined();
    expect(captured?.currentQuestion?.id).toBe("role");
    expect(typeof captured?.reset).toBe("function");
    expect(typeof captured?.back).toBe("function");
    expect(typeof captured?.next).toBe("function");
  });
});
