import {
  drawStaticFlowFrame,
  getScaledCount,
  matchesMedia,
  resizeFlowCanvas,
} from "@/utils/background/canvas-helpers";
import type { FlowParams } from "@/utils/background/get-flow-params";
import {
  stepAndDrawParticles,
  syncParticles,
  type Particle,
} from "@/utils/background/particle-sim";
import { lerpParams } from "@/utils/background/tween-params";

const TARGET_FPS = 30;
const FRAME_INTERVAL_MS = 1000 / TARGET_FPS;
const TIME_STEP_PER_SEC = 0.45;

export function startFlowCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  currentRef: { current: FlowParams },
  targetRef: { current: FlowParams },
  densityScale: number,
  speedScale: number
): () => void {
  let size = resizeFlowCanvas(canvas, ctx);
  const particles: Particle[] = [];

  if (matchesMedia("(prefers-reduced-motion: reduce)")) {
    drawStaticFlowFrame(
      ctx,
      targetRef.current,
      size.width,
      size.height,
      densityScale,
      speedScale
    );
    const onResize = () => {
      size = resizeFlowCanvas(canvas, ctx);
      drawStaticFlowFrame(
        ctx,
        targetRef.current,
        size.width,
        size.height,
        densityScale,
        speedScale
      );
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }

  let rafId: number | null = null;
  let lastTime = performance.now();
  let simTime = 0;

  const tick = (now: number) => {
    if (document.hidden) {
      rafId = null;
      return;
    }
    const dt = now - lastTime;
    if (dt >= FRAME_INTERVAL_MS) {
      lastTime = now - (dt % FRAME_INTERVAL_MS);
      simTime += (dt / 1000) * TIME_STEP_PER_SEC * speedScale;
      currentRef.current = lerpParams(
        currentRef.current,
        targetRef.current,
        dt
      );
      syncParticles(
        particles,
        getScaledCount(currentRef.current.count, size.width, densityScale),
        size.width,
        size.height
      );
      stepAndDrawParticles(
        ctx,
        particles,
        currentRef.current,
        size.width,
        size.height,
        simTime,
        speedScale
      );
    }
    rafId = window.requestAnimationFrame(tick);
  };

  const startLoop = () => {
    if (rafId === null && !document.hidden) {
      lastTime = performance.now();
      rafId = window.requestAnimationFrame(tick);
    }
  };
  const onResize = () => {
    size = resizeFlowCanvas(canvas, ctx);
  };
  const onVisibility = () => {
    if (document.hidden && rafId !== null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    } else if (!document.hidden) {
      startLoop();
    }
  };

  window.addEventListener("resize", onResize);
  document.addEventListener("visibilitychange", onVisibility);
  startLoop();

  return () => {
    if (rafId !== null) window.cancelAnimationFrame(rafId);
    window.removeEventListener("resize", onResize);
    document.removeEventListener("visibilitychange", onVisibility);
  };
}
