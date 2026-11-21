export function getStripCityIds(
  selectedCityId: string
): [string, string, string] {
  const normalized = selectedCityId.toLowerCase();
  if (normalized === "delhi" || normalized === "mumbai") {
    return ["delhi", "mumbai", "kolkata"];
  }
  return ["delhi", "mumbai", normalized];
}
