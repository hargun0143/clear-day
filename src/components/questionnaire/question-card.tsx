import { useEffect, useRef, type FC } from "react";
import { OptionButton } from "@/components/questionnaire/option-button";
import type {
  AnswerValue,
  QuestionConfig,
  QuestionOption,
  QuestionnaireAnswers,
} from "@/utils/questionnaire/types";

export interface QuestionCardProps {
  question: QuestionConfig;
  answers: QuestionnaireAnswers;
  options: readonly QuestionOption[];
  onAnswerSingle: (optionId: string) => void;
  onToggleMulti: (optionId: string) => void;
  under18Note?: string | null;
}

export const QuestionCard: FC<QuestionCardProps> = ({
  question,
  answers,
  options,
  onAnswerSingle,
  onToggleMulti,
  under18Note,
}) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const promptText =
    typeof question.prompt === "function"
      ? question.prompt(answers)
      : question.prompt;

  useEffect(() => {
    headingRef.current?.focus();
  }, [question.id]);

  const currentAnswer: AnswerValue | undefined = answers[question.id];
  const isMulti = question.type === "multi";

  return (
    <div className="space-y-6">
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="text-xl font-semibold tracking-tight text-ink outline-none sm:text-2xl"
      >
        {promptText}
      </h2>

      <div
        role={isMulti ? "group" : "radiogroup"}
        aria-label={promptText}
        className="space-y-3"
      >
        {options.map((opt) => {
          const isSelected = isMulti
            ? Array.isArray(currentAnswer) && currentAnswer.includes(opt.id)
            : currentAnswer === opt.id;

          return (
            <OptionButton
              key={opt.id}
              id={opt.id}
              label={opt.label}
              type={question.type}
              isSelected={isSelected}
              onSelect={() =>
                isMulti ? onToggleMulti(opt.id) : onAnswerSingle(opt.id)
              }
            />
          );
        })}
      </div>

      {under18Note && (
        <div className="rounded-2xl border border-teal/30 bg-teal/10 p-4 text-xs leading-relaxed text-teal">
          {under18Note}
        </div>
      )}
    </div>
  );
};
