import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'he' ? 'en' : 'he');
  };

  return (
    <button
      onClick={toggleLanguage}
      className={cn(
        "flex items-center justify-center w-8 h-8 rounded-lg",
        "bg-primary/10 hover:bg-primary/20 transition-all duration-300",
        "text-xs font-bold text-foreground/80 hover:text-foreground",
        "border border-primary/20 hover:border-primary/40"
      )}
      aria-label={language === 'he' ? 'Switch to English' : 'עבור לעברית'}
    >
      {language === 'he' ? 'EN' : 'עב'}
    </button>
  );
};

export default LanguageToggle;
