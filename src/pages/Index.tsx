import Hero from "@/components/Hero";
import LuxuryFooter from "@/components/LuxuryFooter";
import TopToolbar from "@/components/TopToolbar";
import CookieCrumbs from "@/components/CookieCrumbs";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import BackToTop from "@/components/BackToTop";
import CinematicPreloader from "@/components/CinematicPreloader";

import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background texture-paper relative">
      <CinematicPreloader />
      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-1/2 focus:-translate-x-1/2 focus:z-[10000] focus:bg-primary focus:text-primary-foreground focus:px-6 focus:py-3 focus:rounded-lg focus:shadow-lg focus:text-sm focus:font-medium"
      >
        {t('ui.skipToContent')}
      </a>
      <CookieCrumbs />
      <TopToolbar />
      <AccessibilityWidget />
      <BackToTop />
      <Hero />
      <LuxuryFooter />
    </div>
  );

export default Index;
