import * as React from "react";
import { cn } from "cn";
import { Switch as SwitchPrimitive } from "radix-ui";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // Layout and shape
        "group/switch relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full",
        // Off state: neutral glass track
        "border border-white/20 bg-white/10 p-[3px]",
        // On state: teal track, driven by data-state="checked" (Radix)
        "data-[state=checked]:border-teal data-[state=checked]:bg-teal",
        // Transition
        "transition-colors duration-200 motion-reduce:transition-none",
        // Outline
        "outline-none",
        // Focus ring
        "focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        // Disabled
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          // Size: 22px circle
          "block h-[22px] w-[22px] rounded-full bg-cream shadow-sm",
          // Off: thumb left; on: thumb right (48px track − 2×3px padding − 22px thumb = 20px travel)
          "translate-x-0 data-[state=checked]:translate-x-5",
          // Transition
          "transition-transform duration-200 motion-reduce:transition-none"
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
