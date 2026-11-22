import type { FC } from "react";
import { ArrowRight } from "lucide-react";
import { ShinyButton } from "@/components/ui/shiny-button";

export interface HeroIntroProps {
  onStart: () => void;
}

export const HeroIntro: FC<HeroIntroProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-start space-y-6">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-xs font-medium text-ink/90">
        <span className="h-2 w-2 rounded-full bg-teal" />
        <span>Live CPCB readings · 23 Indian cities</span>
      </div>

      <h1 className="text-5xl font-[650] leading-[0.98] tracking-[-0.05em] text-ink sm:text-6xl lg:text-[76px]">
        <span>Plan a</span>
        <br />
        <span className="text-ink-muted">clearer day.</span>
      </h1>

      <p className="max-w-xl text-base leading-relaxed text-ink/80 sm:text-lg">
        Tell us your city and how your day looks. We read today's air quality
        and turn it into a plan that fits your routine, your home and the people
        in it.
      </p>

      <div className="flex flex-col items-start gap-3 pt-2">
        <ShinyButton
          variant="primary"
          size="md"
          onClick={onStart}
          className="gap-2.5 font-semibold"
        >
          <span>Get my plan</span>
          <ArrowRight className="h-4 w-4" />
        </ShinyButton>
        <span className="text-xs text-ink-muted">
          Free. No sign-up. Estimates, not medical advice.
        </span>
      </div>
    </div>
  );
};
