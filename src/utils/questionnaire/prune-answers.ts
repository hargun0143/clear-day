import { QUESTIONS } from "@/constants/questionnaire/questions";
import {
  getQuestionOptions,
  isValidAnswerValue,
} from "@/utils/questionnaire/validate-answer";
import type { QuestionnaireAnswers } from "@/utils/questionnaire/types";

export function handleExclusiveSelection(
  current: readonly string[],
  nextId: string,
  exclusiveId = "none"
): string[] {
  if (nextId === exclusiveId) {
    return [exclusiveId];
  }
  const withoutExclusive = current.filter((id) => id !== exclusiveId);
  if (withoutExclusive.includes(nextId)) {
    return withoutExclusive.filter((id) => id !== nextId);
  }
  return [...withoutExclusive, nextId];
}

export function pruneAnswers(
  answers: QuestionnaireAnswers
): QuestionnaireAnswers {
  const pruned: QuestionnaireAnswers = { ...answers };

  for (const q of QUESTIONS) {
    if (q.id === "city") continue;
    if (!q.visibleWhen(pruned)) {
      delete pruned[q.id];
      continue;
    }
    const val = pruned[q.id];
    if (val !== undefined && !isValidAnswerValue(q, val, pruned)) {
      delete pruned[q.id];
    }
    // If the question now has only 1 valid option and no valid answer, auto-populate
    if (pruned[q.id] === undefined && q.type === "single") {
      const opts = getQuestionOptions(q, pruned);
      if (opts.length === 1 && opts[0]) {
        pruned[q.id] = opts[0].id;
      }
    }
  }

  return pruned;
}
