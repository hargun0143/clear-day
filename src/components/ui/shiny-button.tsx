import type { ButtonHTMLAttributes, FC } from "react";
import { cn } from "@/lib/utils";

export type ShinyButtonVariant = "primary" | "glass" | "ghost";
export type ShinyButtonSize = "md" | "sm";

export interface ShinyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ShinyButtonVariant;
  size?: ShinyButtonSize;
}

const VARIANT_CLASSES: Record<ShinyButtonVariant, string> = {
  primary: "shiny-btn-primary",
  glass: "shiny-btn-glass",
  ghost: "shiny-btn-ghost",
};

const SIZE_CLASSES: Record<ShinyButtonSize, string> = {
  md: "shiny-btn-md",
  sm: "shiny-btn-sm",
};

export const ShinyButton: FC<ShinyButtonProps> = ({
  variant = "primary",
  size = "md",
  type = "button",
  className,
  children,
  ...props
}) => {
  return (
    <button
      type={type}
      className={cn(
        "shiny-btn",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
