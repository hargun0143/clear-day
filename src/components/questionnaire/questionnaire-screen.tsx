import { useMemo, type FC } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { BackButton } from "@/components/questionnaire/back-button";
import { ProgressBar } from "@/components/questionnaire/progress-bar";
import { QuestionCard } from "@/components/questionnaire/question-card";
import { ShinyButton } from "@/components/ui/shiny-button";
import { UNDER_18_NOTE } from "@/constants/questionnaire/notes";
import { useQuestionnaire } from "@/hooks/use-questionnaire";
import { isUnder18 } from "@/utils/questionnaire/is-under-18";
import type { QuestionnaireResult } from "@/utils/questionnaire/types";

export interface QuestionnaireScreenProps {
  cityId: string;
  onBackToLanding: () => void;
  onComplete: (result: QuestionnaireResult) => void;
}

export const QuestionnaireScreen: FC<QuestionnaireScreenProps> = ({
  cityId,
  onBackToLanding,
  onComplete,
}) => {
  const {
    answers,
    currentQuestion,
    currentOptions,
    progress,
    canGoNext,
    answer,
    toggleMultiOption,
    next,
    back,
  } = useQuestionnaire(cityId);

  const isFinalStep = progress.isLastStep;
  const isMinor = isUnder18(answers);

  const handleNextOrFinish = () => {
    if (!canGoNext) return;
    if (isFinalStep) {
      onComplete({ cityId, answers });
      return;
    }
    next();
  };

  const noteForCard = useMemo(() => {
    if (currentQuestion?.id === "age" && answers["age"] === "under-18") {
      return UNDER_18_NOTE;
    }
    return null;
  }, [currentQuestion, answers]);

  const showNoteOnFinal =
    isFinalStep && isMinor && currentQuestion?.id !== "age";

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col space-y-6 px-5 py-8 sm:px-8">
      <div className="flex items-center justify-between">
        <BackButton onClick={() => (!back() ? onBackToLanding() : undefined)} />
        <div aria-live="polite" className="text-xs font-medium text-ink-muted">
          Step {progress.currentStep} of {progress.totalSteps}
        </div>
      </div>

      <ProgressBar
        currentStep={progress.currentStep}
        totalSteps={progress.totalSteps}
      />

      <div className="glass relative min-h-[380px] rounded-[28px] p-6 sm:p-8">
        <AnimatePresence mode="wait">
          {currentQuestion && (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="motion-reduce:transition-none"
            >
              <QuestionCard
                question={currentQuestion}
                answers={answers}
                options={currentOptions}
                onAnswerSingle={(id) => answer(currentQuestion.id, id)}
                onToggleMulti={(id) =>
                  toggleMultiOption(currentQuestion.id, id)
                }
                under18Note={noteForCard}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {showNoteOnFinal && (
          <div className="mt-6 rounded-2xl border border-teal/30 bg-teal/10 p-4 text-xs leading-relaxed text-teal">
            {UNDER_18_NOTE}
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <ShinyButton
            variant="primary"
            size="md"
            disabled={!canGoNext}
            onClick={handleNextOrFinish}
            className="w-full gap-2 font-semibold sm:w-auto"
          >
            <span>{isFinalStep ? "Get my plan" : "Continue"}</span>
            <ArrowRight className="h-4 w-4" />
          </ShinyButton>
        </div>
      </div>
    </div>
  );
};
