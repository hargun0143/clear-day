export type AnswerValue = string | string[];
export type QuestionnaireAnswers = Record<string, AnswerValue | undefined>;

export interface QuestionnaireResult {
  cityId: string;
  answers: QuestionnaireAnswers;
}

export interface QuestionOption {
  id: string;
  label: string;
}

export type QuestionType = "single" | "multi";

export interface QuestionConfig {
  id: string;
  type: QuestionType;
  prompt: string | ((answers: QuestionnaireAnswers) => string);
  options:
    | readonly QuestionOption[]
    | ((answers: QuestionnaireAnswers) => readonly QuestionOption[]);
  visibleWhen: (answers: QuestionnaireAnswers) => boolean;
}
