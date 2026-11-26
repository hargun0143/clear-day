export function buildCorrectionPrompt(
  base: string,
  repeats: { a: string }[],
  banned: string[],
  equipment: string[]
): string {
  const parts: string[] = [base];
  if (repeats.length > 0) {
    parts.push(
      `REMOVE REPEATED ADVICE: ${repeats.map((p) => `"${p.a}"`).join(", ")}`
    );
  }
  if (banned.length > 0) {
    parts.push(
      `DO NOT USE BANNED PHRASES: ${banned.map((b) => `"${b}"`).join(", ")}`
    );
  }
  if (equipment.length > 0) {
    parts.push(`FIX EQUIPMENT LIMITS: ${equipment.join("; ")}`);
  }
  return parts.join("\n\n");
}
