import { useState, useCallback } from "react";
import Hero from "@/components/Hero";
import LuxuryFooter from "@/components/LuxuryFooter";
import CinematicEntry from "@/components/CinematicEntry";
import ThemeToggle from "@/components/ThemeToggle";
import CookieCrumbs from "@/components/CookieCrumbs";

const Index = () => {
  const [entryDone, setEntryDone] = useState(false);
  const handleEntryComplete = useCallback(() => setEntryDone(true), []);

  return (
    <div className="min-h-screen bg-background texture-paper relative">
      {!entryDone && <CinematicEntry onComplete={handleEntryComplete} />}
      <CookieCrumbs />
      <ThemeToggle />
      <Hero />
      <LuxuryFooter />
    </div>
  );
};

export default Index;
