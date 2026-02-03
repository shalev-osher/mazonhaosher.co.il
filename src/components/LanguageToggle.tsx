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
        "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center",
        "transition-all duration-300 hover:scale-110 group"
      )}
      aria-label={language === 'he' ? 'Switch to English' : 'עבור לעברית'}
    >
      <div className="p-1.5 md:p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-md transition-all duration-300">
        <Globe className="w-4 h-4 md:w-5 md:h-5 text-white fill-white/20" />
      </div>
    </button>
  );
};

export default LanguageToggle;
