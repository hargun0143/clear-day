export type ManualAqiValidationResult =
  { ok: true; aqi: number } | { ok: false; error: string };

export function validateManualAqi(
  input: string | number | null | undefined
): ManualAqiValidationResult {
  if (input === null || input === undefined) {
    return { ok: false, error: "Please enter an AQI value" };
  }

  const str = String(input).trim();
  if (str === "") {
    return { ok: false, error: "Please enter an AQI value" };
  }

  const num = Number(str);
  if (Number.isNaN(num) || !Number.isFinite(num)) {
    return { ok: false, error: "Must be a valid number" };
  }

  if (!Number.isInteger(num)) {
    return { ok: false, error: "Must be a whole number" };
  }

  if (num < 0 || num > 500) {
    return { ok: false, error: "AQI must be between 0 and 500" };
  }

  return { ok: true, aqi: num };
}
