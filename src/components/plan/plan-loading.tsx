import { useEffect, useState, type FC } from "react";
import { ROTATING_LINES } from "@/constants/plan-loading";

export interface PlanLoadingProps {
  cityName: string;
}

export const PlanLoading: FC<PlanLoadingProps> = ({ cityName }) => {
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setLineIndex((prev) => (prev + 1) % ROTATING_LINES.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const currentText = ROTATING_LINES[lineIndex]!(cityName);

  return (
    <div
      role="status"
      aria-live="polite"
      className="glass mx-auto flex min-h-[320px] max-w-lg flex-col items-center justify-center rounded-[28px] p-8 text-center"
    >
      <div className="mb-6 h-8 w-8 animate-spin rounded-full border-2 border-teal border-t-transparent motion-reduce:hidden" />
      <p className="text-base font-medium tracking-tight text-ink sm:text-lg">
        {currentText}
      </p>
      <p className="mt-2 text-xs text-ink-muted">
        Tailoring advice to your environment and routine...
      </p>
    </div>
  );
};
