import type { FactSheet } from "../fact-sheet-types.js";
import { STATIC_ROLE_TOPICS, type RoleTopic } from "./role-topics-data.js";

export type { RoleTopic };

const AQI_MASK_MIN = 101;
const AQI_INDOOR_SPORT_MIN = 201;

function getStudentSportDetail(aqi: number, occasional: boolean): string {
  if (aqi >= AQI_INDOOR_SPORT_MIN) {
    return occasional
      ? "Skip outdoor sports today and choose an indoor activity instead."
      : "Move outdoor sports and PE indoors today instead of playing on open fields.";
  }
  return occasional
    ? "Keep occasional outdoor games away from busy roadside traffic hours."
    : "Schedule outdoor sports away from rush-hour traffic peaks.";
}

function getOutdoorWorkerDetail(habitId: string, aqi: number): string {
  if (aqi >= AQI_MASK_MIN) {
    if (habitId === "cloth") {
      return "Use a well-fitted N95 or FFP2 mask instead of a cloth cover during outdoor work shifts.";
    }
    if (habitId === "n95-or-better") {
      return "Keep your N95 or FFP2 mask fitted snugly around your nose and chin during outdoor work.";
    }
    return "Wear a well-fitted N95 or FFP2 mask during outdoor work shifts.";
  }
  if (habitId === "cloth") {
    return "Take work breaks away from busy roadside queues and idling engines.";
  }
  if (habitId === "n95-or-better") {
    return "Take midday breaks in shaded spots away from heavy road dust.";
  }
  return "Take short shaded breaks away from idling vehicles and dusty road edges during work.";
}

export function selectRoleTopic(factSheet: FactSheet): RoleTopic | null {
  const { roleId, roleHabitId, aqiValue } = factSheet;
  if (!roleId || !roleHabitId) return null;

  if (roleId === "school-student" || roleId === "college-student") {
    if (
      roleHabitId === "regularly" ||
      roleHabitId === "hostel-sports" ||
      roleHabitId === "day-scholar-sports"
    ) {
      return {
        id: "role-outdoor-sport",
        slotHint: "Afternoon",
        detail: getStudentSportDetail(aqiValue, false),
      };
    }
    if (roleHabitId === "occasionally") {
      return {
        id: "role-outdoor-sport-occasional",
        slotHint: "Afternoon",
        detail: getStudentSportDetail(aqiValue, true),
      };
    }
    return {
      id: "role-student-indoor",
      slotHint: "Afternoon",
      detail:
        "Plan study and break times in low-traffic indoor spaces away from road edges.",
    };
  }

  if (roleId === "senior") {
    if (roleHabitId === "daily" || roleHabitId === "sometimes") {
      return {
        id: "role-senior-walk",
        slotHint: "Morning",
        detail:
          aqiValue > 100
            ? "Choose the quietest low-traffic route for your walk and avoid early-morning traffic peaks."
            : "Take your walk along calm, low-traffic residential paths away from main roads.",
      };
    }
    return {
      id: "role-senior-indoor",
      slotHint: "Morning",
      detail:
        "Keep daytime routines indoors away from roadside doors during peak traffic.",
    };
  }

  if (roleId === "outdoor-worker") {
    return {
      id: "role-outdoor-worker-mask",
      slotHint: "Morning",
      detail: getOutdoorWorkerDetail(roleHabitId, aqiValue),
    };
  }

  if (roleId === "work-from-home" && roleHabitId === "window-open") {
    return {
      id: "role-wfh-window-open",
      slotHint: "Morning",
      detail:
        aqiValue >= AQI_MASK_MIN
          ? "Close workspace windows facing roads during daytime traffic peaks."
          : "Shift to a quieter interior room if nearby road traffic picks up.",
    };
  }

  return STATIC_ROLE_TOPICS[`${roleId}:${roleHabitId}`] ?? null;
}
