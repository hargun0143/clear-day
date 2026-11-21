import { useState } from "react";
import { HazeBackground } from "@/components/layout/haze-background";
import { HowItWorksDialog } from "@/components/layout/how-it-works-dialog";
import { NavBar } from "@/components/layout/nav-bar";
import { SampleBanner } from "@/components/layout/sample-banner";
import { Hero } from "@/components/landing/hero";
import { ImpactSection } from "@/components/landing/impact-section";
import { SiteFooter } from "@/components/landing/site-footer";
import { LANDING_PALETTE } from "@/constants/palettes";

export function App() {
  const [sampleMode, setSampleMode] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);

  const handleStart = () => {
    // No-op for now as questionnaire is built in a later phase.
  };

  return (
    <div className="flex min-h-screen flex-col">
      <HazeBackground palette={LANDING_PALETTE} />
      <NavBar
        onHowItWorks={() => setDialogOpen(true)}
        sampleMode={sampleMode}
        onSampleModeChange={setSampleMode}
      />
      <SampleBanner visible={sampleMode} />
      <HowItWorksDialog open={dialogOpen} onOpenChange={setDialogOpen} />

      <main className="relative flex-1 pt-24 sm:pt-32">
        <Hero
          selectedCityId={selectedCityId}
          onSelectCity={setSelectedCityId}
          onStart={handleStart}
        />
        <ImpactSection />
      </main>

      <SiteFooter />
    </div>
  );
}

export default App;
