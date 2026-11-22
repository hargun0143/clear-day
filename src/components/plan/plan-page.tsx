import { useMemo, type FC } from "react";
import type { GeneratedPlan } from "../../../api/_lib/plan/plan-schema.js";
import { AQI_BANDS } from "@/constants/aqi-bands";
import { CITIES } from "@/constants/cities";
import { DailyPlanGrid } from "@/components/plan/daily-plan-grid";
import { GoodHabitsCard } from "@/components/plan/good-habits-card";
import { ImpactSection } from "@/components/plan/impact-section";
import { IndoorAirSection } from "@/components/plan/indoor-air-section";
import { PlanSummaryPanel } from "@/components/plan/plan-summary-panel";
import { SwapsSection } from "@/components/plan/swaps-section";
import type { PlanApiMeta } from "@/services/plan-client";

const FALLBACK_BAND = AQI_BANDS[0]!;

export interface PlanPageProps {
  plan: GeneratedPlan;
  meta: PlanApiMeta;
  aqiValue: number;
  cityId: string;
  source?: string;
  isModelled?: boolean;
  onStartOver: () => void;
}

export const PlanPage: FC<PlanPageProps> = ({
  plan,
  meta,
  aqiValue,
  cityId,
  source,
  isModelled,
  onStartOver,
}) => {
  const cityName = useMemo(
    () => CITIES.find((c) => c.id === cityId)?.name ?? cityId,
    [cityId]
  );

  const band = useMemo(
    () =>
      AQI_BANDS.find((b) => aqiValue >= b.min && aqiValue <= b.max) ??
      FALLBACK_BAND,
    [aqiValue]
  );

  const dataSourceLabel = useMemo(() => {
    if (isModelled) return "Modelled estimate (Open-Meteo / CAMS)";
    if (source === "open-meteo") return "Open-Meteo";
    return "CPCB via data.gov.in";
  }, [source, isModelled]);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8 sm:px-4">
      {meta.isFallback && (
        <div className="mb-6 rounded-2xl border border-amber/30 bg-amber/10 p-3.5 text-center text-xs text-amber">
          Example plan shown because live generation was unavailable
        </div>
      )}

      <div className="lg:grid lg:grid-cols-[380px_1fr] lg:gap-8">
        <div>
          <PlanSummaryPanel
            headline={plan.headline}
            todaySummary={plan.todaySummary}
            aqiValue={aqiValue}
            aqiBandLabel={band.label}
            aqiBandColor={band.color}
            cityName={cityName}
            dataSourceLabel={dataSourceLabel}
            onStartOver={onStartOver}
          />
        </div>

        <div className="mt-6 flex flex-col gap-6 lg:mt-0">
          <GoodHabitsCard goodHabits={plan.goodHabits} />
          <DailyPlanGrid dailyPlan={plan.dailyPlan} />
          <IndoorAirSection indoorAir={plan.indoorAir} />
          <SwapsSection choices={plan.lowEmissionChoices} />
          <ImpactSection impact={plan.impact} />
          <p className="px-1 text-xs text-ink-muted max-w-[65ch]">
            {plan.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
};
