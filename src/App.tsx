import { useState } from "react";
import { HazeBackground } from "@/components/layout/haze-background";
import { HowItWorksDialog } from "@/components/layout/how-it-works-dialog";
import { NavBar } from "@/components/layout/nav-bar";
import { SampleBanner } from "@/components/layout/sample-banner";
import { APP_NAME } from "@/constants/copy";
import { LANDING_PALETTE } from "@/constants/palettes";

export function App() {
  const [sampleMode, setSampleMode] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <HazeBackground palette={LANDING_PALETTE} />
      <NavBar
        onHowItWorks={() => setDialogOpen(true)}
        sampleMode={sampleMode}
        onSampleModeChange={setSampleMode}
      />
      <SampleBanner visible={sampleMode} />
      <HowItWorksDialog open={dialogOpen} onOpenChange={setDialogOpen} />

      <main className="relative min-h-screen pt-32">
        <h1 className="sr-only">{APP_NAME}</h1>
      </main>
    </>
  );
}

export default App;
