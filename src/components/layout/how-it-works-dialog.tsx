import type { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  HOW_IT_WORKS_DISCLAIMER,
  HOW_IT_WORKS_NOTE,
  HOW_IT_WORKS_STEPS,
  HOW_IT_WORKS_TITLE,
} from "@/constants/copy";

export interface HowItWorksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HowItWorksDialog: FC<HowItWorksDialogProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass max-w-xl p-6 sm:p-8 text-ink border-white/15">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            {HOW_IT_WORKS_TITLE}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {HOW_IT_WORKS_TITLE}
          </DialogDescription>
        </DialogHeader>

        <ol className="mt-4 space-y-4">
          {HOW_IT_WORKS_STEPS.map(({ step, text }) => (
            <li key={step} className="flex items-start gap-3.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-teal-soft">
                {step}
              </span>
              <p className="text-sm leading-relaxed text-ink/90 sm:text-base">
                {text}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-6 rounded-2xl bg-white/[0.04] p-4 border border-white/10">
          <p className="text-xs leading-relaxed text-muted sm:text-sm">
            {HOW_IT_WORKS_NOTE}
          </p>
          <p className="mt-2.5 text-xs font-semibold tracking-wide uppercase text-amber">
            {HOW_IT_WORKS_DISCLAIMER}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
