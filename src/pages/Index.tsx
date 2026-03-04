import Hero from "@/components/Hero";
import LuxuryFooter from "@/components/LuxuryFooter";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import CookieCrumbs from "@/components/CookieCrumbs";
import AccessibilityWidget from "@/components/AccessibilityWidget";

const Index = () => {
  return (
    <div className="min-h-screen bg-background texture-paper relative">
      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-1/2 focus:-translate-x-1/2 focus:z-[10000] focus:bg-primary focus:text-primary-foreground focus:px-6 focus:py-3 focus:rounded-lg focus:shadow-lg focus:text-sm focus:font-medium"
      >
        דלג לתוכן הראשי
      </a>
      <CookieCrumbs />
      <ThemeToggle />
      <AccessibilityWidget />
      <Hero />
      <LuxuryFooter />
    </div>
  );
};

export default Index;
