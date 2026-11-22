import { useCallback, useMemo, useState } from "react";
import { getNextQuestion } from "@/utils/questionnaire/get-next-question";
import {
  getApplicableQuestions,
  getProgress,
} from "@/utils/questionnaire/get-progress";
import {
  getStepQuestionId,
  updateAnswerState,
} from "@/utils/questionnaire/nav-helpers";
import {
  handleExclusiveSelection,
  pruneAnswers,
} from "@/utils/questionnaire/prune-answers";
import type {
  AnswerValue,
  QuestionConfig,
  QuestionnaireAnswers,
} from "@/utils/questionnaire/types";
import {
  getQuestionOptions,
  isValidAnswerValue,
} from "@/utils/questionnaire/validate-answer";

export function useQuestionnaire(cityId: string | null) {
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(() =>
    pruneAnswers(cityId ? { city: cityId } : {})
  );

  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(
    () => getNextQuestion(cityId ? { city: cityId } : {})?.id ?? "role"
  );

  const applicableQuestions = useMemo(
    () => getApplicableQuestions(answers),
    [answers]
  );

  const currentQuestion = useMemo((): QuestionConfig | null => {
    if (!activeQuestionId) return null;
    return applicableQuestions.find((q) => q.id === activeQuestionId) ?? null;
  }, [activeQuestionId, applicableQuestions]);

  const progress = useMemo(
    () => getProgress(answers, activeQuestionId),
    [answers, activeQuestionId]
  );

  const isComplete = useMemo(
    () => getNextQuestion(answers) === null,
    [answers]
  );

  const answer = useCallback((questionId: string, value: AnswerValue) => {
    setAnswers((prev) =>
      updateAnswerState(prev, questionId, value, pruneAnswers)
    );
  }, []);

  const toggleMultiOption = useCallback(
    (questionId: string, optionId: string) => {
      setAnswers((prev) => {
        const cur = Array.isArray(prev[questionId])
          ? (prev[questionId] as string[])
          : [];
        const next = handleExclusiveSelection(cur, optionId);
        return pruneAnswers({ ...prev, [questionId]: next });
      });
    },
    []
  );

  const next = useCallback(() => {
    const nextId = getStepQuestionId("next", currentQuestion, answers);
    setActiveQuestionId(nextId);
  }, [currentQuestion, answers]);

  const back = useCallback((): boolean => {
    const prevId = getStepQuestionId("back", currentQuestion, answers);
    if (prevId) {
      setActiveQuestionId(prevId);
      return true;
    }
    return false;
  }, [currentQuestion, answers]);

  const reset = useCallback(() => {
    const initial: QuestionnaireAnswers = cityId ? { city: cityId } : {};
    setAnswers(pruneAnswers(initial));
    setActiveQuestionId(getNextQuestion(initial)?.id ?? "role");
  }, [cityId]);

  const currentOptions = useMemo(() => {
    return currentQuestion ? getQuestionOptions(currentQuestion, answers) : [];
  }, [currentQuestion, answers]);

  const canGoNext = useMemo(() => {
    if (!currentQuestion) return false;
    return isValidAnswerValue(
      currentQuestion,
      answers[currentQuestion.id],
      answers
    );
  }, [currentQuestion, answers]);

  return {
    answers,
    currentQuestion,
    currentOptions,
    progress,
    isComplete,
    canGoNext,
    answer,
    toggleMultiOption,
    next,
    back,
    reset,
  };
}
