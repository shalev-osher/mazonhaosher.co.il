import { useLanguage } from "@/contexts/LanguageContext";
import { Globe, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type LangOption = {
  code: 'he' | 'en' | 'ar' | 'ru' | 'es';
  label: string;
  flag: string;
};

const languages: LangOption[] = [
  { code: 'he', label: 'עברית', flag: '🇮🇱' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
];

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <div ref={ref} className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Select language"
        aria-expanded={open}
        className="group flex items-center gap-2
          bg-card border border-border
          rounded-full px-3 py-2 shadow-[var(--shadow-soft)]
          hover:shadow-[var(--shadow-warm)] hover:border-primary
          transition-all duration-300 ease-out
          hover:scale-105 active:scale-95"
      >
        <Globe size={16} className="text-foreground group-hover:text-primary transition-colors duration-300" />
        <span className="text-sm">{currentLang.flag}</span>
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 bg-card border border-border rounded-xl shadow-lg overflow-hidden min-w-[160px] animate-in fade-in slide-in-from-top-2 duration-200">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { setLanguage(lang.code); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-200
                hover:bg-accent/50
                ${language === lang.code ? 'bg-accent/30 font-bold text-foreground' : 'text-muted-foreground'}`}
            >
              <span className="text-base">{lang.flag}</span>
              <span className="flex-1 text-start">{lang.label}</span>
              {language === lang.code && <Check size={14} className="text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;
