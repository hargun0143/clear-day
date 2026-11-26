import type { FlowParams } from "./get-flow-params";
import {
  stepAndDrawParticles,
  syncParticles,
  type Particle,
} from "./particle-sim";

const MAX_DPR = 1.5;
const MOBILE_WIDTH_PX = 768;
const MOBILE_COUNT_SCALE = 0.4;
const STATIC_PRE_DRAW_STEPS = 24;
const STATIC_TIME_STEP = 0.05;
const BASE_BG_HEX = "#080b10";

export function matchesMedia(query: string): boolean {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return false;
  }
  return window.matchMedia(query).matches;
}

export function getScaledCount(
  rawCount: number,
  width: number,
  densityScale: number
): number {
  const mobileScale = width < MOBILE_WIDTH_PX ? MOBILE_COUNT_SCALE : 1;
  return Math.max(1, Math.round(rawCount * densityScale * mobileScale));
}

export function resizeFlowCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
): { width: number; height: number } {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = BASE_BG_HEX;
  ctx.fillRect(0, 0, width, height);
  return { width, height };
}

export function drawStaticFlowFrame(
  ctx: CanvasRenderingContext2D,
  params: FlowParams,
  width: number,
  height: number,
  densityScale: number,
  speedScale: number
): void {
  const particles: Particle[] = [];
  syncParticles(
    particles,
    getScaledCount(params.count, width, densityScale),
    width,
    height
  );
  for (let s = 0; s < STATIC_PRE_DRAW_STEPS; s++) {
    stepAndDrawParticles(
      ctx,
      particles,
      params,
      width,
      height,
      s * STATIC_TIME_STEP,
      speedScale
    );
  }
}
