import { lazy, Suspense, useState } from "react";
import { domAnimation, LazyMotion } from "framer-motion";
import { Hero, type HeroActiveAqiInfo } from "@/components/landing/hero";
import { ImpactSection } from "@/components/landing/impact-section";
import { SiteFooter } from "@/components/landing/site-footer";
import { HazeBackground } from "@/components/layout/haze-background";
import { NavBar } from "@/components/layout/nav-bar";
import { SampleBanner } from "@/components/layout/sample-banner";
import { ViewFallback } from "@/components/layout/view-fallback";
import { CALM_PALETTE, LANDING_PALETTE } from "@/constants/palettes";
import type { QuestionnaireResult } from "@/utils/questionnaire/types";

const HowItWorksDialog = lazy(() =>
  import("@/components/layout/how-it-works-dialog").then((m) => ({
    default: m.HowItWorksDialog,
  }))
);

const QuestionnaireScreen = lazy(() =>
  import("@/components/questionnaire/questionnaire-screen").then((m) => ({
    default: m.QuestionnaireScreen,
  }))
);

const PlanScreen = lazy(() =>
  import("@/components/plan/plan-screen").then((m) => ({
    default: m.PlanScreen,
  }))
);

export type AppView = "landing" | "questionnaire" | "plan";

export function App() {
  const [view, setView] = useState<AppView>("landing");
  const [sampleMode, setSampleMode] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [cityPickerError, setCityPickerError] = useState<string | null>(null);
  const [activeAqi, setActiveAqi] = useState<HeroActiveAqiInfo | null>(null);
  const [questionnaireResult, setQuestionnaireResult] =
    useState<QuestionnaireResult | null>(null);

  const handleStart = (aqiInfo?: HeroActiveAqiInfo) => {
    if (!selectedCityId) {
      setCityPickerError("Choose your city first");
      document.getElementById("city-picker-trigger")?.focus();
      return;
    }
    if (aqiInfo) setActiveAqi(aqiInfo);
    setCityPickerError(null);
    setView("questionnaire");
  };

  const handleQuestionnaireComplete = (result: QuestionnaireResult) => {
    setQuestionnaireResult(result);
    setView("plan");
  };

  const handleStartOver = () => {
    setQuestionnaireResult(null);
    setView("landing");
  };

  const currentPalette = view === "landing" ? LANDING_PALETTE : CALM_PALETTE;

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="flex min-h-screen flex-col">
        <HazeBackground palette={currentPalette} />
        <NavBar
          onHowItWorks={() => setDialogOpen(true)}
          sampleMode={sampleMode}
          onSampleModeChange={setSampleMode}
          onLogoClick={() => setView("landing")}
        />
        <SampleBanner visible={sampleMode} />
        {dialogOpen && (
          <Suspense fallback={null}>
            <HowItWorksDialog open={dialogOpen} onOpenChange={setDialogOpen} />
          </Suspense>
        )}

        <main className="relative flex-1 pt-24 sm:pt-32">
          {view === "landing" && (
            <>
              <Hero
                selectedCityId={selectedCityId}
                onSelectCity={(id) => {
                  setSelectedCityId(id);
                  setCityPickerError(null);
                }}
                onStart={handleStart}
                sampleMode={sampleMode}
                cityPickerError={cityPickerError}
              />
              <ImpactSection />
            </>
          )}

          {view === "questionnaire" && selectedCityId && (
            <Suspense
              fallback={<ViewFallback label="Loading questionnaire..." />}
            >
              <QuestionnaireScreen
                cityId={selectedCityId}
                onBackToLanding={() => setView("landing")}
                onComplete={handleQuestionnaireComplete}
              />
            </Suspense>
          )}

          {view === "plan" && questionnaireResult && (
            <Suspense fallback={<ViewFallback label="Loading your plan..." />}>
              <PlanScreen
                result={questionnaireResult}
                aqiValue={activeAqi?.value ?? 150}
                mainPollutant={activeAqi?.mainPollutant}
                source={activeAqi?.source}
                isModelled={activeAqi?.isModelled}
                onStartOver={handleStartOver}
              />
            </Suspense>
          )}
        </main>

        <SiteFooter />
      </div>
    </LazyMotion>
  );
}

export default App;
