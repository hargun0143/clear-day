export const ROTATING_LINES = [
  (city: string) => `Reading today's air for ${city}`,
  () => "Matching it to your routine",
  () => "Writing your plan",
] as const;
