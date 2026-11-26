const BASE_DRIFT_RADIANS = 0.32;
const WAVE_1_FREQ = 0.0028;
const WAVE_2_FREQ = 0.0023;
const WAVE_3_FREQ = 0.0017;
const WAVE_1_SPEED = 0.35;
const WAVE_2_SPEED = 0.27;
const WAVE_3_SPEED = 0.19;
const WAVE_1_AMP = 0.55;
const WAVE_2_AMP = 0.45;
const WAVE_3_AMP = 0.3;

export function angleAt(
  x: number,
  y: number,
  time: number,
  turbulence: number
): number {
  const w1 = WAVE_1_AMP * Math.sin(x * WAVE_1_FREQ + time * WAVE_1_SPEED);
  const w2 = WAVE_2_AMP * Math.cos(y * WAVE_2_FREQ - time * WAVE_2_SPEED);
  const w3 = WAVE_3_AMP * Math.sin((x + y) * WAVE_3_FREQ + time * WAVE_3_SPEED);
  return BASE_DRIFT_RADIANS + turbulence * (w1 + w2 + w3);
}
