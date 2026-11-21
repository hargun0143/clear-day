// Placeholders that will be replaced by real data.
export const DEFAULT_PLACEHOLDER_AQI = 180;

export const PLACEHOLDER_READINGS: Record<string, number> = {
  delhi: 312,
  mumbai: 156,
  lucknow: 284,
};

export function getPlaceholderAqi(cityId: string): number {
  return PLACEHOLDER_READINGS[cityId] ?? DEFAULT_PLACEHOLDER_AQI;
}
