import { useState } from "react";
import { HazeBackground } from "@/components/layout/haze-background";
import { HowItWorksDialog } from "@/components/layout/how-it-works-dialog";
import { NavBar } from "@/components/layout/nav-bar";
import { SampleBanner } from "@/components/layout/sample-banner";
import { Hero, type HeroActiveAqiInfo } from "@/components/landing/hero";
import { ImpactSection } from "@/components/landing/impact-section";
import { SiteFooter } from "@/components/landing/site-footer";
import { PlanScreen } from "@/components/plan/plan-screen";
import { QuestionnaireScreen } from "@/components/questionnaire/questionnaire-screen";
import { CALM_PALETTE, LANDING_PALETTE } from "@/constants/palettes";
import type { QuestionnaireResult } from "@/utils/questionnaire/types";

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
      const trigger = document.getElementById("city-picker-trigger");
      trigger?.focus();
      return;
    }
    if (aqiInfo) {
      setActiveAqi(aqiInfo);
    }
    setCityPickerError(null);
    setView("questionnaire");
  };

  const handleCitySelect = (cityId: string) => {
    setSelectedCityId(cityId);
    setCityPickerError(null);
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
    <div className="flex min-h-screen flex-col">
      <HazeBackground palette={currentPalette} />
      <NavBar
        onHowItWorks={() => setDialogOpen(true)}
        sampleMode={sampleMode}
        onSampleModeChange={setSampleMode}
        onLogoClick={() => setView("landing")}
      />
      <SampleBanner visible={sampleMode} />
      <HowItWorksDialog open={dialogOpen} onOpenChange={setDialogOpen} />

      <main className="relative flex-1 pt-24 sm:pt-32">
        {view === "landing" && (
          <>
            <Hero
              selectedCityId={selectedCityId}
              onSelectCity={handleCitySelect}
              onStart={handleStart}
              sampleMode={sampleMode}
              cityPickerError={cityPickerError}
            />
            <ImpactSection />
          </>
        )}

        {view === "questionnaire" && selectedCityId && (
          <QuestionnaireScreen
            cityId={selectedCityId}
            onBackToLanding={() => setView("landing")}
            onComplete={handleQuestionnaireComplete}
          />
        )}

        {view === "plan" && questionnaireResult && (
          <PlanScreen
            result={questionnaireResult}
            aqiValue={activeAqi?.value ?? 150}
            mainPollutant={activeAqi?.mainPollutant}
            source={activeAqi?.source}
            isModelled={activeAqi?.isModelled}
            onStartOver={handleStartOver}
          />
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

export default App;
