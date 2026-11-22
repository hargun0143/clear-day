import type { FC } from "react";
import { Check } from "lucide-react";

export interface OptionButtonProps {
  id: string;
  label: string;
  type: "single" | "multi";
  isSelected: boolean;
  onSelect: () => void;
}

export const OptionButton: FC<OptionButtonProps> = ({
  id,
  label,
  type,
  isSelected,
  onSelect,
}) => {
  const isRadio = type === "single";

  return (
    <button
      type="button"
      id={`opt-${id}`}
      role={isRadio ? "radio" : "checkbox"}
      aria-checked={isSelected}
      onClick={onSelect}
      className={`glass flex min-h-[48px] w-full cursor-pointer items-center justify-between rounded-2xl px-5 py-3 text-left text-sm transition-all focus-visible:outline-2 focus-visible:outline-teal motion-reduce:transition-none ${
        isSelected
          ? "border-teal/60 bg-teal/15 text-ink ring-1 ring-teal/50 font-medium"
          : "border-white/10 text-ink/90 hover:border-white/20 hover:bg-white/[0.06]"
      }`}
    >
      <span className="flex-1 pr-3">{label}</span>
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center border transition-colors ${
          isRadio ? "rounded-full" : "rounded-md"
        } ${
          isSelected
            ? "border-teal bg-teal text-bg"
            : "border-white/30 bg-transparent text-transparent"
        }`}
        aria-hidden="true"
      >
        <Check className="h-3.5 w-3.5 stroke-[3]" />
      </span>
    </button>
  );
};
