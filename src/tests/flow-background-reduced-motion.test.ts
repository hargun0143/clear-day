import { afterEach, describe, expect, it, vi } from "vitest";
import { startFlowCanvas } from "@/hooks/use-flow-canvas";
import { getFlowParams } from "@/utils/background/get-flow-params";

describe("FlowBackground reduced motion", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  function setupMocks(reducedMotion: boolean) {
    const rafSpy = vi.fn(() => 1);
    const cancelRafSpy = vi.fn();
    const ctxMock = {
      setTransform: vi.fn(),
      fillRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      fillStyle: "",
      strokeStyle: "",
      lineWidth: 1,
    } as unknown as CanvasRenderingContext2D;

    vi.stubGlobal("window", {
      innerWidth: 1280,
      innerHeight: 800,
      devicePixelRatio: 1,
      matchMedia: (query: string) => ({
        matches: reducedMotion && query === "(prefers-reduced-motion: reduce)",
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
      requestAnimationFrame: rafSpy,
      cancelAnimationFrame: cancelRafSpy,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    vi.stubGlobal("document", {
      hidden: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    const canvas = { width: 0, height: 0 } as HTMLCanvasElement;
    return { canvas, ctxMock, rafSpy };
  }

  it("draws a single static frame and starts no rAF loop when prefers-reduced-motion is reduce", () => {
    const { canvas, ctxMock, rafSpy } = setupMocks(true);
    const params = getFlowParams(200);
    const cleanup = startFlowCanvas(
      canvas,
      ctxMock,
      { current: params },
      { current: params },
      1,
      1
    );

    expect(rafSpy).not.toHaveBeenCalled();
    expect(ctxMock.fillRect).toHaveBeenCalled();
    expect(ctxMock.stroke).toHaveBeenCalled();
    cleanup();
  });

  it("starts rAF loop when prefers-reduced-motion is not set", () => {
    const { canvas, ctxMock, rafSpy } = setupMocks(false);
    const params = getFlowParams(200);
    const cleanup = startFlowCanvas(
      canvas,
      ctxMock,
      { current: params },
      { current: params },
      1,
      1
    );

    expect(rafSpy).toHaveBeenCalledTimes(1);
    cleanup();
  });
});
