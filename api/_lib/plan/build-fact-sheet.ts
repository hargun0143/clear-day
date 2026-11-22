import { AQI_BANDS } from "../../../src/constants/aqi-bands.js";
import { CITIES } from "../../../src/constants/cities.js";
import { getMobilityOptions } from "../../../src/constants/questionnaire/mobility.js";
import { BUDGET_OPTIONS } from "../../../src/constants/questionnaire/options.js";
import { getRoleHabitOptions } from "../../../src/constants/questionnaire/role-habits.js";
import { ROLES } from "../../../src/constants/questionnaire/roles.js";
import type {
  QuestionOption,
  QuestionnaireAnswers,
} from "../../../src/utils/questionnaire/types.js";
import type { FactSheet, PlanAqiInput } from "./fact-sheet-types.js";

function getOptionLabel(
  options: readonly QuestionOption[],
  idOrIds?: string | string[]
): string {
  if (!idOrIds) return "";
  if (Array.isArray(idOrIds)) {
    return idOrIds
      .map((id) => options.find((o) => o.id === id)?.label ?? id)
      .filter(Boolean)
      .join(", ");
  }
  return options.find((o) => o.id === idOrIds)?.label ?? idOrIds;
}

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
  const careAnswers = Array.isArray(answers["care"])
    ? (answers["care"] as string[])
    : [];
  const vulnerableHome =
    careAnswers.length > 0 && !careAnswers.includes("none");
  const hasBreathingOrHeartCondition = careAnswers.includes(
    "breathing-or-heart-condition"
  );

  const homeSetupAnswers = Array.isArray(answers["home-setup"])
    ? (answers["home-setup"] as string[])
    : [];
  const indoorSmoking = homeSetupAnswers.includes("indoor-smoking");
  const hasPurifier = homeSetupAnswers.includes("air-purifier");
  const hasAC = homeSetupAnswers.includes("ac");

  const mobilityVal = answers["mobility"];
  const cookingWithBiomass = mobilityVal === "wood-coal-or-biomass";
  const highOutdoorHours = mobilityVal === "over-5";

  const mobilityOpts = getMobilityOptions(answers);
  const mobilityLabel = getOptionLabel(
    mobilityOpts,
    typeof mobilityVal === "string" ? mobilityVal : ""
  );

  const roleVal = typeof answers["role"] === "string" ? answers["role"] : "";
  const roleLabel = getOptionLabel(ROLES, roleVal);

  const budgetLabel = isUnder18
    ? null
    : getOptionLabel(
        BUDGET_OPTIONS,
        typeof answers["budget"] === "string" ? answers["budget"] : ""
      );

  const habitOpts = getRoleHabitOptions(answers);
  const habitVal =
    typeof answers["role-habit"] === "string" ? answers["role-habit"] : "";
  const roleSpecificAnswerLabel = getOptionLabel(habitOpts, habitVal);

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
    cookingWithBiomass,
    highOutdoorHours,
    mobilityLabel,
    roleLabel,
    budgetLabel,
    roleSpecificAnswerLabel,
  };
}
