export const GAUGE_CONFIG = {
  cx: 120,
  cy: 115,
  radius: 82,
  strokeWidth: 12,
  gapDegrees: 4,
  countUpDurationMs: 600,
  maxScaleValue: 500,
} as const;

export interface GaugeSegment {
  path: string;
  color: string;
  id: string;
}

export function computeGaugeSegments(
  colors: readonly string[],
  ids: readonly string[]
): GaugeSegment[] {
  const { cx, cy, radius, gapDegrees } = GAUGE_CONFIG;
  const segmentSpan = 180 / colors.length;

  return colors.map((color, i) => {
    const startAngle = 180 - (i * segmentSpan + gapDegrees / 2);
    const endAngle = 180 - ((i + 1) * segmentSpan - gapDegrees / 2);

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy - radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy - radius * Math.sin(endRad);

    return {
      path: `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`,
      color,
      id: ids[i] ?? `seg-${i}`,
    };
  });
}
