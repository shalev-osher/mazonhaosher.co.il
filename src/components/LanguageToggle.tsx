import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Globe } from 'lucide-react';

const LanguageToggle = () => {
  const { language, setLanguage, isRTL } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'he' ? 'en' : 'he');
  };

  return (
    <button
      onClick={toggleLanguage}
      className={cn(
        "flex flex-col items-center gap-0.5 px-2 md:px-3 py-1 md:py-1.5",
        "transition-all duration-300 rounded-lg group hover:bg-muted/50"
      )}
      aria-label={language === 'he' ? 'Switch to English' : 'עבור לעברית'}
    >
      <div className="p-1 md:p-1.5 rounded-lg bg-violet-500/15 transition-all duration-300 group-hover:scale-105">
        <Globe className="w-3.5 h-3.5 md:w-4 md:h-4 text-violet-500" />
      </div>
      <span className="text-[9px] md:text-[11px] font-medium text-muted-foreground group-hover:text-foreground">
        {language === 'he' ? 'English' : 'עברית'}
      </span>
    </button>
  );
};

export default LanguageToggle;
