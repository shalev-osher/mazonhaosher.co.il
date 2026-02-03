import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Globe } from 'lucide-react';

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'he' ? 'en' : 'he');
  };

  return (
    <button
      onClick={toggleLanguage}
      className={cn(
        "flex flex-col items-center gap-0 px-1.5 md:px-2.5 py-0.5 md:py-1",
        "transition-all duration-300 rounded-lg group hover:bg-muted"
      )}
      aria-label={language === 'he' ? 'Switch to English' : 'עבור לעברית'}
    >
      <div className="p-1 md:p-1.5 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 shadow-md group-hover:scale-105 transition-all duration-300">
        <Globe className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
      </div>
      <span className="text-[9px] md:text-[11px] font-medium text-muted-foreground group-hover:text-foreground">
        {language === 'he' ? 'עברית' : 'English'}
      </span>
    </button>
  );
};

export default LanguageToggle;
