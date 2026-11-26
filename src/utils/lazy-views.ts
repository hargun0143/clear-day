import { lazy } from "react";

export const HowItWorksDialog = lazy(() =>
  import("@/components/layout/how-it-works-dialog").then((m) => ({
    default: m.HowItWorksDialog,
  }))
);

export const QuestionnaireScreen = lazy(() =>
  import("@/components/questionnaire/questionnaire-screen").then((m) => ({
    default: m.QuestionnaireScreen,
  }))
);

export const PlanScreen = lazy(() =>
  import("@/components/plan/plan-screen").then((m) => ({
    default: m.PlanScreen,
  }))
);
