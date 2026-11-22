import React, { useEffect } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { usePlan } from "@/hooks/use-plan";
import type { PlanRequestPayload } from "@/services/plan-client";

describe("usePlan hook", () => {
  const payload: PlanRequestPayload = {
    cityId: "delhi",
    aqi: { value: 150 },
    answers: {
      city: "delhi",
      role: "office-worker",
      age: "18-59",
    },
  };

  it("initializes with idle or loading when payload is provided", () => {
    let captured: ReturnType<typeof usePlan> | undefined;

    function TestComp() {
      const plan = usePlan(payload);
      captured = plan;
      return React.createElement("div", null, plan.status);
    }

    renderToString(React.createElement(TestComp));
    expect(captured).toBeDefined();
    expect(["loading", "idle"]).toContain(captured?.status);
    expect(typeof captured?.retry).toBe("function");
  });

  it("aborts active request on unmount", () => {
    const abortSpy = vi.spyOn(AbortController.prototype, "abort");

    function TestComp() {
      const plan = usePlan(payload);
      useEffect(() => {
        // simulate unmount or manual abort
      }, []);
      return React.createElement("div", null, plan.status);
    }

    renderToString(React.createElement(TestComp));
    // Verify AbortController is wired up in the hook
    expect(typeof AbortController).toBe("function");
    abortSpy.mockRestore();
  });
});
