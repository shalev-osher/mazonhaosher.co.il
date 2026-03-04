import Hero from "@/components/Hero";
import LuxuryFooter from "@/components/LuxuryFooter";
import ThemeToggle from "@/components/ThemeToggle";
import CookieCrumbs from "@/components/CookieCrumbs";
import AccessibilityWidget from "@/components/AccessibilityWidget";

const Index = () => {
  return (
    <div className="min-h-screen bg-background texture-paper relative">
      <CookieCrumbs />
      <ThemeToggle />
      <AccessibilityWidget />
      <Hero />
      <LuxuryFooter />
    </div>
  );
};

export default Index;
