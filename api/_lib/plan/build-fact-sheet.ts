import { AQI_BANDS } from "../../../src/constants/aqi-bands.js";
import { CITIES } from "../../../src/constants/cities.js";
import { getMobilityOptions } from "../../../src/constants/questionnaire/mobility.js";
import { BUDGET_OPTIONS } from "../../../src/constants/questionnaire/options.js";
import { getRoleHabitOptions } from "../../../src/constants/questionnaire/role-habits.js";
import { ROLES } from "../../../src/constants/questionnaire/roles.js";
import type { QuestionnaireAnswers } from "../../../src/utils/questionnaire/types.js";
import type { FactSheet, PlanAqiInput } from "./fact-sheet-types.js";
import { getOptionLabel, toStringList } from "./label-helper.js";

export function buildFactSheet(
  cityId: string,
  aqiInput: PlanAqiInput,
  answers: QuestionnaireAnswers
): FactSheet {
  if (
    !Number.isInteger(aqiInput.value) ||
    aqiInput.value < 0 ||
    aqiInput.value > 500
  ) {
    throw new Error(`Invalid AQI value: ${aqiInput.value}`);
  }

  const city = CITIES.find((c) => c.id === cityId);
  const cityName = city ? city.name : cityId;
  const band =
    AQI_BANDS.find((b) => aqiInput.value >= b.min && aqiInput.value <= b.max) ??
    AQI_BANDS[0]!;
  const mainPollutant = aqiInput.mainPollutant || "PM2.5";
  const dataSourceLabel = aqiInput.isModelled
    ? "Modelled estimate (Open-Meteo / CAMS)"
    : aqiInput.source === "open-meteo"
      ? "Open-Meteo"
      : "CPCB via data.gov.in";

  const isUnder18 = answers["age"] === "under-18";
  const careAnswers = toStringList(answers["care"]);
  const careHasNone = careAnswers.includes("none");
  const vulnerableHome = careAnswers.length > 0 && !careHasNone;
  const hasBreathingOrHeartCondition =
    !careHasNone && careAnswers.includes("breathing-or-heart-condition");

  const homeSetupAnswers = toStringList(answers["home-setup"]);
  const homeHasNone = homeSetupAnswers.includes("none");
  const indoorSmoking =
    !homeHasNone && homeSetupAnswers.includes("indoor-smoking");
  const hasPurifier = !homeHasNone && homeSetupAnswers.includes("air-purifier");
  const hasAC = !homeHasNone && homeSetupAnswers.includes("ac");
  const hasExhaust =
    !homeHasNone && homeSetupAnswers.includes("exhaust-or-chimney");

  const mobilityVal =
    typeof answers["mobility"] === "string" ? answers["mobility"] : "";
  const mobilityId = mobilityVal;
  const cookingWithBiomass = mobilityVal === "wood-coal-or-biomass";
  const highOutdoorHours = mobilityVal === "over-5";

  const mobilityLabel = getOptionLabel(
    getMobilityOptions(answers),
    mobilityVal
  );
  const roleVal = typeof answers["role"] === "string" ? answers["role"] : "";
  const roleLabel = getOptionLabel(ROLES, roleVal);

  const budgetVal =
    typeof answers["budget"] === "string" ? answers["budget"] : "";
  const budgetId = isUnder18 ? null : budgetVal || null;
  const budgetLabel = isUnder18
    ? null
    : getOptionLabel(BUDGET_OPTIONS, budgetVal);

  const habitVal =
    typeof answers["role-habit"] === "string" ? answers["role-habit"] : "";
  const roleSpecificAnswerLabel = getOptionLabel(
    getRoleHabitOptions(answers),
    habitVal
  );

  return {
    cityName,
    aqiValue: aqiInput.value,
    aqiBandLabel: band.label,
    guidanceLine: band.guidance,
    mainPollutant,
    dataSourceLabel,
    isUnder18,
    vulnerableHome,
    hasBreathingOrHeartCondition,
    indoorSmoking,
    hasPurifier,
    hasAC,
    hasExhaust,
    cookingWithBiomass,
    highOutdoorHours,
    mobilityId,
    mobilityLabel,
    roleLabel,
    budgetId,
    budgetLabel,
    roleSpecificAnswerLabel,
  };
}
