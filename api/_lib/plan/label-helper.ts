import type { QuestionOption } from "../../../src/utils/questionnaire/types.js";

export function getOptionLabel(
  options: readonly QuestionOption[],
  val?: string | string[]
): string {
  if (!val) return "";
  if (Array.isArray(val)) {
    return val
      .map((id) => options.find((o) => o.id === id)?.label ?? id)
      .filter(Boolean)
      .join(", ");
  }
  return options.find((o) => o.id === val)?.label ?? val;
}

export function toStringList(v: unknown): string[] {
  if (Array.isArray(v))
    return v.filter((x): x is string => typeof x === "string");
  if (typeof v === "string") return [v];
  return [];
}
