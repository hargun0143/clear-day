import type { FC } from "react";

export interface ViewFallbackProps {
  label?: string;
}

export const ViewFallback: FC<ViewFallbackProps> = ({
  label = "Loading...",
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto flex min-h-[380px] w-full max-w-xl items-center justify-center p-8 text-center"
    >
      <span className="text-sm font-medium text-ink-muted">{label}</span>
    </div>
  );
};
