import type { FC } from "react";
import { Wind } from "lucide-react";
import { ShinyButton } from "@/components/ui/shiny-button";
import { Switch } from "@/components/ui/switch";
import { APP_NAME, NAV_LABELS } from "@/constants/copy";
import { NAV_DIMENSIONS } from "@/constants/layout";

export interface NavBarProps {
  onHowItWorks: () => void;
  sampleMode: boolean;
  onSampleModeChange: (val: boolean) => void;
}

export const NavBar: FC<NavBarProps> = ({
  onHowItWorks,
  sampleMode,
  onSampleModeChange,
}) => {
  return (
    <header
      className={`fixed ${NAV_DIMENSIONS.topOffsetClass} left-1/2 z-40 flex ${NAV_DIMENSIONS.heightClass} w-[calc(100%-3rem)] ${NAV_DIMENSIONS.maxWidthClass} -translate-x-1/2 items-center justify-between px-5 glass`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`${NAV_DIMENSIONS.iconCircleClass} flex items-center justify-center rounded-full bg-cream text-bg shadow-sm`}
        >
          <Wind className="h-5 w-5" />
        </div>
        <span className="text-base font-semibold tracking-tight text-ink">
          {APP_NAME}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <ShinyButton variant="glass" size="sm" onClick={onHowItWorks}>
          {NAV_LABELS.howItWorks}
        </ShinyButton>

        <label
          htmlFor="sample-mode-switch"
          className="flex min-h-[44px] cursor-pointer select-none items-center gap-2.5 text-sm text-ink-muted"
        >
          <span>{NAV_LABELS.sampleData}</span>
          <Switch
            id="sample-mode-switch"
            aria-label="Use saved sample data"
            checked={sampleMode}
            onCheckedChange={onSampleModeChange}
          />
        </label>
      </div>
    </header>
  );
};
