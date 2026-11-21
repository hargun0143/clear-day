import type { FC } from "react";
import { HAZE_BLOBS, HAZE_GRAIN_CONFIG } from "@/constants/haze";
import type { Palette } from "@/constants/palettes";

export interface HazeBackgroundProps {
  palette: Palette;
}

export const HazeBackground: FC<HazeBackgroundProps> = ({ palette }) => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg"
    >
      {palette.map((color, index) => {
        const blob = HAZE_BLOBS[index];
        if (!blob) return null;
        return (
          <div
            key={index}
            className={blob.blobClass}
            style={{
              backgroundColor: color,
              opacity: blob.opacity,
            }}
          />
        );
      })}

      <svg
        className={`pointer-events-none absolute inset-0 h-full w-full ${HAZE_GRAIN_CONFIG.opacityClassName} mix-blend-overlay`}
      >
        <filter id="haze-grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={HAZE_GRAIN_CONFIG.baseFrequency}
            numOctaves={HAZE_GRAIN_CONFIG.numOctaves}
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#haze-grain-filter)" />
      </svg>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(8,11,16,0.85)_100%)]" />
    </div>
  );
};
