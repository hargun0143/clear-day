import { useMemo, type FC } from "react";
import { RotateCcw } from "lucide-react";
import { ShinyButton } from "@/components/ui/shiny-button";
import { CITIES } from "@/constants/cities";
import { QUESTIONS } from "@/constants/questionnaire/questions";
import { getQuestionOptions } from "@/utils/questionnaire/validate-answer";
import type { QuestionnaireResult } from "@/utils/questionnaire/types";

export interface PlanPendingScreenProps {
  result: QuestionnaireResult;
  onStartOver: () => void;
}

export const PlanPendingScreen: FC<PlanPendingScreenProps> = ({
  result,
  onStartOver,
}) => {
  const cityName = useMemo(() => {
    return CITIES.find((c) => c.id === result.cityId)?.name ?? result.cityId;
  }, [result.cityId]);

  const summaryItems = useMemo(() => {
    return QUESTIONS.filter((q) => q.id !== "city")
      .map((q) => {
        const val = result.answers[q.id];
        if (val === undefined || val === null) return null;
        const options = getQuestionOptions(q, result.answers);
        const prompt =
          typeof q.prompt === "function" ? q.prompt(result.answers) : q.prompt;

        let displayAnswer = "";
        if (Array.isArray(val)) {
          displayAnswer = val
            .map((id) => options.find((o) => o.id === id)?.label ?? id)
            .join(", ");
        } else {
          displayAnswer = options.find((o) => o.id === val)?.label ?? val;
        }

        return { id: q.id, prompt, displayAnswer };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [result]);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col space-y-6 px-5 py-8 sm:px-8">
      <div className="glass rounded-[28px] p-6 sm:p-8">
        <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          Questionnaire Summary
        </h2>
        <p className="mt-1 text-xs text-ink-muted">
          Your answers have been collected. Generating plan recommendations...
        </p>

        <div className="mt-6 space-y-4 divide-y divide-white/10 text-sm">
          <div className="pt-3">
            <span className="text-xs text-ink-muted">City</span>
            <p className="font-medium text-ink">{cityName}</p>
          </div>
          {summaryItems.map((item) => (
            <div key={item.id} className="pt-3">
              <span className="text-xs text-ink-muted">{item.prompt}</span>
              <p className="font-medium text-ink">{item.displayAnswer}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <ShinyButton
            variant="glass"
            size="md"
            onClick={onStartOver}
            className="w-full gap-2 font-medium sm:w-auto"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Start over</span>
          </ShinyButton>
        </div>
      </div>
    </div>
  );
};
