import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/logo.png";

const LuxuryFooter = () => {
  const { isRTL } = useLanguage();

  return (
    <footer role="contentinfo" aria-label={isRTL ? "כותרת תחתונה" : "Footer"} className="relative py-16 overflow-hidden">
      {/* Top border - golden gradient — decorative */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-0.5" aria-hidden="true"
        style={{ background: 'linear-gradient(90deg, transparent, hsl(40,95%,50%), transparent)' }}
      />

      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <img
            src={logo}
            alt={isRTL ? "מזון האושר - לוגו" : "Mazon HaOsher - Logo"}
            className="h-20 w-auto"
          />

          {/* Copyright */}
          <p className="text-sm text-muted-foreground font-light tracking-widest uppercase">
            © {isRTL ? "מזון האושר" : "Mazon HaOsher"} 2026
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LuxuryFooter;
