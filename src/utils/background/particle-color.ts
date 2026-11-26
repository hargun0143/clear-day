export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

const TEAL_RGB: RgbColor = { r: 45, g: 212, b: 191 };
const AMBER_RGB: RgbColor = { r: 224, g: 138, b: 60 };
const X_MIX_WEIGHT = 0.12;
const JITTER_WEIGHT = 0.1;

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function particleColor(
  xNormalised: number,
  amberMix: number,
  jitter = 0
): RgbColor {
  const t = clamp01(
    amberMix + clamp01(xNormalised) * X_MIX_WEIGHT + jitter * JITTER_WEIGHT
  );
  return {
    r: Math.round(TEAL_RGB.r + (AMBER_RGB.r - TEAL_RGB.r) * t),
    g: Math.round(TEAL_RGB.g + (AMBER_RGB.g - TEAL_RGB.g) * t),
    b: Math.round(TEAL_RGB.b + (AMBER_RGB.b - TEAL_RGB.b) * t),
  };
}

export function formatRgba(color: RgbColor, alpha: number): string {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
}
