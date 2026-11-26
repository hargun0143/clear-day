import { useRef, type FC } from "react";
import type { FlowPalette } from "@/constants/palettes";
import { useFlowCanvas } from "@/hooks/use-flow-canvas";

export type BackgroundMode = "landing" | "questionnaire" | "plan";

export interface FlowBackgroundProps {
  palette: FlowPalette;
  aqi: number;
  mode: BackgroundMode;
}

const CALM_DENSITY_SCALE = 0.35;
const CALM_SPEED_SCALE = 0.6;
const GRAIN_DATA_URI =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export const FlowBackground: FC<FlowBackgroundProps> = ({
  palette,
  aqi,
  mode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isCalm = mode !== "landing";
  const { skipCanvas, hazeAlpha } = useFlowCanvas(canvasRef, {
    aqi,
    densityScale: isCalm ? CALM_DENSITY_SCALE : 1,
    speedScale: isCalm ? CALM_SPEED_SCALE : 1,
  });

  if (skipCanvas) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-bg"
      />
    );
  }

  const quietZoneBackground =
    mode === "plan"
      ? "radial-gradient(75vw 65vh at 50% 50%, rgba(8, 11, 16, 0.6), transparent 100%)"
      : "radial-gradient(45vw 45vw at 33% 58%, rgba(8, 11, 16, 0.6), transparent 100%)";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg"
      style={{
        background: `linear-gradient(180deg, ${palette.baseTop} 0%, ${palette.baseBottom} 100%)`,
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 85% 15%, ${palette.tealGlow}, transparent 45%)`,
        }}
      />

      <div
        className="absolute inset-0 transition-opacity duration-[800ms]"
        style={{
          opacity: hazeAlpha,
          background: `radial-gradient(ellipse 80% 45% at 50% 100%, ${palette.amberGlow}, transparent 70%)`,
        }}
      />

      <div
        className="absolute inset-0"
        style={{ background: quietZoneBackground }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 40%, rgba(8, 11, 16, 0.85) 100%)",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: GRAIN_DATA_URI }}
      />
    </div>
  );
};
