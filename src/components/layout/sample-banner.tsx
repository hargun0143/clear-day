import type { FC } from "react";
import { SAMPLE_BANNER_TEXT } from "@/constants/copy";

export interface SampleBannerProps {
  visible: boolean;
}

export const SampleBanner: FC<SampleBannerProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <aside
      aria-live="polite"
      className="fixed top-24 left-1/2 z-30 -translate-x-1/2 px-4 py-1.5 text-xs font-medium tracking-wide text-amber glass-sm"
    >
      {SAMPLE_BANNER_TEXT}
    </aside>
  );
};
