import { angleAt } from "./flow-angle";
import type { FlowParams } from "./get-flow-params";
import { formatRgba, particleColor } from "./particle-color";

export interface Particle {
  x: number;
  y: number;
  life: number;
  maxLife: number;
  jitter: number;
}

const MIN_LIFE = 50;
const EXTRA_LIFE = 70;
const STEP_DISTANCE_PX = 2.4;
const FADE_ALPHA = 0.08;
const TRAIL_ALPHA = 0.32;
const HEAD_ALPHA = 0.72;
const HEAD_RADIUS_PX = 1.1;
const TRAIL_WIDTH_PX = 1.2;
const FADE_FILL_RGB = "8, 11, 16";

function spawnParticle(
  width: number,
  height: number,
  randomAge: boolean
): Particle {
  const maxLife = MIN_LIFE + Math.random() * EXTRA_LIFE;
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    life: randomAge ? Math.random() * maxLife : maxLife,
    maxLife,
    jitter: Math.random() * 2 - 1,
  };
}

export function syncParticles(
  particles: Particle[],
  targetCount: number,
  width: number,
  height: number
): void {
  while (particles.length < targetCount) {
    particles.push(spawnParticle(width, height, true));
  }
  if (particles.length > targetCount) {
    particles.length = targetCount;
  }
}

export function stepAndDrawParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  params: FlowParams,
  width: number,
  height: number,
  time: number,
  speedScale: number
): void {
  ctx.fillStyle = `rgba(${FADE_FILL_RGB}, ${FADE_ALPHA})`;
  ctx.fillRect(0, 0, width, height);

  const step = STEP_DISTANCE_PX * speedScale;
  const safeWidth = Math.max(1, width);
  ctx.lineWidth = TRAIL_WIDTH_PX;

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]!;
    const prevX = p.x;
    const prevY = p.y;
    const angle = angleAt(p.x, p.y, time, params.turbulence);
    p.x += Math.cos(angle) * step;
    p.y += Math.sin(angle) * step;
    p.life -= 1;

    if (p.life <= 0 || p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
      particles[i] = spawnParticle(width, height, false);
      continue;
    }

    const lifeRatio = Math.sin((p.life / p.maxLife) * Math.PI);
    const rgb = particleColor(p.x / safeWidth, params.amberMix, p.jitter);

    ctx.strokeStyle = formatRgba(
      rgb,
      Math.min(TRAIL_ALPHA, TRAIL_ALPHA * lifeRatio)
    );
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();

    ctx.fillStyle = formatRgba(
      rgb,
      Math.min(HEAD_ALPHA, HEAD_ALPHA * lifeRatio)
    );
    ctx.beginPath();
    ctx.arc(p.x, p.y, HEAD_RADIUS_PX, 0, Math.PI * 2);
    ctx.fill();
  }
}
