import type { FC } from "react";
import { ArrowLeft } from "lucide-react";

export interface BackButtonProps {
  onClick: () => void;
  label?: string;
}

export const BackButton: FC<BackButtonProps> = ({
  onClick,
  label = "Back",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-teal"
    >
      <ArrowLeft className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
};
