import type { FC } from "react";
import { ExternalLink } from "lucide-react";
import { HOW_IT_WORKS_DISCLAIMER } from "@/constants/copy";

export const SiteFooter: FC = () => {
  return (
    <footer className="mt-auto border-t border-white/10 bg-bg/80 py-10 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-6 px-5 text-center sm:px-8 md:flex-row md:text-left">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold tracking-wide text-ink">
            Clear Day
          </p>
          <p className="text-xs text-ink-muted">{HOW_IT_WORKS_DISCLAIMER}</p>
        </div>

        <nav
          aria-label="Data sources"
          className="flex flex-wrap items-center justify-center gap-5 text-xs text-ink-muted"
        >
          <span className="font-medium text-ink/70">Sources:</span>
          <a
            href="https://data.gov.in/resource/real-time-air-quality-index-various-locations"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-1.5 transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-white"
          >
            <span>CPCB Real-Time AQI</span>
            <ExternalLink className="h-3 w-3 opacity-70" />
          </a>
          <a
            href="https://www.who.int/news-room/q-a-detail/who-global-air-quality-guidelines"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-1.5 transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-white"
          >
            <span>WHO Air Quality Guidelines</span>
            <ExternalLink className="h-3 w-3 opacity-70" />
          </a>
        </nav>
      </div>
    </footer>
  );
};
