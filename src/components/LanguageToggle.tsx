import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'he' ? 'en' : 'he');
  };

  return (
    <button
      onClick={toggleLanguage}
      aria-label={language === 'he' ? 'Switch to English' : 'החלף לעברית'}
      className="fixed top-4 right-4 z-50 group flex items-center gap-2
        bg-card border border-border
        rounded-full px-3 py-2 shadow-[var(--shadow-soft)]
        hover:shadow-[var(--shadow-warm)] hover:border-primary
        transition-all duration-300 ease-out
        hover:scale-105 active:scale-95"
    >
      <Globe size={16} className="text-foreground group-hover:text-primary transition-colors duration-300" />
      <span className="text-xs font-body font-bold text-muted-foreground group-hover:text-foreground transition-colors duration-300">
        {language === 'he' ? 'EN' : 'עב'}
      </span>
    </button>
  );
};

export default LanguageToggle;
