import { useMemo, type FC } from "react";
import { SAMPLE_BANNER_TEXT } from "@/constants/copy";
import {
  formatSnapshotTime,
  getSnapshotCapturedAt,
} from "@/utils/snapshot-reader";

export interface SampleBannerProps {
  visible: boolean;
}

export const SampleBanner: FC<SampleBannerProps> = ({ visible }) => {
  const bannerText = useMemo(() => {
    const capturedAt = getSnapshotCapturedAt();
    const formatted = formatSnapshotTime(capturedAt);
    if (formatted) {
      return `Sample data captured ${formatted}`;
    }
    return SAMPLE_BANNER_TEXT;
  }, []);

  if (!visible) return null;

  return (
    <aside
      aria-live="polite"
      className="glass-sm fixed top-24 left-1/2 z-30 -translate-x-1/2 px-4 py-1.5 text-xs font-medium tracking-wide text-amber"
    >
      {bannerText}
    </aside>
  );
};
