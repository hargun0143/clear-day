import { toStringList } from "../../../src/utils/to-string-list.js";
import type { QuestionOption } from "../../../src/utils/questionnaire/types.js";

export { toStringList };

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
