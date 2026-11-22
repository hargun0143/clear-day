import { useMemo, type FC } from "react";
import { PlanLoading } from "@/components/plan/plan-loading";
import { PlanView } from "@/components/plan/plan-view";
import { ShinyButton } from "@/components/ui/shiny-button";
import { CITIES } from "@/constants/cities";
import { usePlan } from "@/hooks/use-plan";
import type { PlanRequestPayload } from "@/services/plan-client";
import type { QuestionnaireResult } from "@/utils/questionnaire/types";

export interface PlanScreenProps {
  result: QuestionnaireResult;
  aqiValue: number;
  mainPollutant?: string;
  source?: string;
  isModelled?: boolean;
  onStartOver: () => void;
}

export const PlanScreen: FC<PlanScreenProps> = ({
  result,
  aqiValue,
  mainPollutant = "PM2.5",
  source,
  isModelled,
  onStartOver,
}) => {
  const cityName = useMemo(() => {
    return CITIES.find((c) => c.id === result.cityId)?.name ?? result.cityId;
  }, [result.cityId]);

  const payload: PlanRequestPayload = useMemo(
    () => ({
      cityId: result.cityId,
      aqi: {
        value: aqiValue,
        mainPollutant,
        source,
        isModelled,
      },
      answers: result.answers,
    }),
    [result, aqiValue, mainPollutant, source, isModelled]
  );

  const { status, data, error, retry } = usePlan(payload);

  if (status === "loading" || status === "idle") {
    return <PlanLoading cityName={cityName} />;
  }

  if (status === "error" || !data) {
    return (
      <div className="glass mx-auto flex max-w-md flex-col items-center justify-center rounded-[28px] p-8 text-center space-y-4">
        <h2 className="text-lg font-semibold text-ink">
          Plan generation error
        </h2>
        <p className="text-xs text-ink-muted">
          {error ?? "Unable to load plan at this time."}
        </p>
        <div className="flex gap-3">
          <ShinyButton variant="primary" size="sm" onClick={retry}>
            Retry
          </ShinyButton>
          <ShinyButton variant="glass" size="sm" onClick={onStartOver}>
            Start over
          </ShinyButton>
        </div>
      </div>
    );
  }

  return (
    <PlanView plan={data.plan} meta={data.meta} onStartOver={onStartOver} />
  );
};
