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
        "flex flex-col items-center gap-0.5",
        "transition-all duration-300 hover:scale-110 group"
      )}
      aria-label={language === 'he' ? 'Switch to English' : 'עבור לעברית'}
    >
      <div className="p-1.5 md:p-2 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 shadow-md transition-all duration-300">
        <Globe className="w-4 h-4 md:w-5 md:h-5 text-white" />
      </div>
      <span className="text-[10px] md:text-xs font-medium text-foreground/70">
        {language === 'he' ? 'עברית' : 'English'}
      </span>
    </button>
  );
};

export default LanguageToggle;
