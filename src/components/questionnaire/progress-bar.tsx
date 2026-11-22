import type { FC } from "react";

export interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar: FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
}) => {
  const percent =
    totalSteps > 1
      ? Math.max(
          0,
          Math.min(
            100,
            Math.round(((currentStep - 1) / (totalSteps - 1)) * 100)
          )
        )
      : 0;

  return (
    <div
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={`Step ${currentStep} of ${totalSteps}`}
      className="h-1.5 w-full overflow-hidden rounded-full bg-white/10"
    >
      <div
        className="h-full rounded-full bg-teal transition-all duration-300 motion-reduce:transition-none"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};
