import { useState, useMemo } from "react";
import { Globe, Check, Sun, Moon, Monitor } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useRef, useEffect } from "react";

const useMultiTypewriter = (phrases: string[], speed = 50, deleteSpeed = 30, pauseTime = 2500, delay = 500) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const animate = () => {
      const currentPhrase = phrases[phraseIndex];
      if (!isDeleting) {
        if (charIndex < currentPhrase.length) {
          setDisplayedText(currentPhrase.slice(0, charIndex + 1));
          charIndex++;
          timeout = setTimeout(animate, speed);
        } else {
          timeout = setTimeout(() => { isDeleting = true; animate(); }, pauseTime);
        }
      } else {
        if (charIndex > 0) {
          charIndex--;
          setDisplayedText(currentPhrase.slice(0, charIndex));
          timeout = setTimeout(animate, deleteSpeed);
        } else {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          timeout = setTimeout(animate, delay);
        }
      }
    };

    timeout = setTimeout(animate, delay);
    return () => clearTimeout(timeout);
  }, [phrases, speed, deleteSpeed, pauseTime, delay]);

  return displayedText;
};

const marqueePhrases: Record<string, string[]> = {
  he: ["🍪 מוזמנים לקניון ברנע (שד׳ ירושלים 119 אשקלון) מדי יום ו׳ בין השעות 7:30-14:30", "❤️ אפייה טרייה בעבודת יד", "🎁 מארזים מיוחדים לאירועים"],
  en: ["🍪 Visit us at Barnea Mall (119 Jerusalem Blvd, Ashkelon) every Friday 7:30-14:30", "❤️ Freshly baked by hand", "🎁 Special event packages"],
  ar: ["🍪 زوروا مركز بارنيع (شارع القدس 119، أشكلون) كل يوم جمعة 7:30-14:30", "❤️ خبز طازج يدوي الصنع", "🎁 باقات خاصة للمناسبات"],
  ru: ["🍪 Посетите нас в ТЦ Барнеа (бульвар Иерусалим 119, Ашкелон) каждую пятницу 7:30-14:30", "❤️ Свежая выпечка ручной работы", "🎁 Специальные наборы для мероприятий"],
  es: ["🍪 Visítanos en el centro Barnea (Blvd. Jerusalén 119, Ashkelon) cada viernes 7:30-14:30", "❤️ Horneado fresco a mano", "🎁 Paquetes especiales para eventos"],
};

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

const TopToolbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const { mode, toggleTheme } = useTheme();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const phrases = useMemo(() => marqueePhrases[language] || marqueePhrases.en, [language]);
  const displayedText = useMultiTypewriter(phrases, 50, 25, 3000, 400);

  const currentLang = languages.find(l => l.code === language) || languages[0];

  const themeIcon = mode === 'light' ? <Sun size={15} /> : mode === 'dark' ? <Moon size={15} /> : <Monitor size={15} />;
  const themeLabel = mode === 'light' ? t('ui.themeLight') : mode === 'dark' ? t('ui.themeDark') : t('ui.themeAuto');

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav
      aria-label={t('ui.infoBanner')}
      className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm"
    >
      <div className="flex items-center justify-between px-3 py-2 max-w-screen-xl mx-auto gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label={`${t('ui.displayMode')}: ${themeLabel}`}
          className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5
            hover:bg-accent/50 transition-colors duration-200
            text-foreground hover:text-primary shrink-0"
        >
          {themeIcon}
          <span className="text-xs font-medium text-muted-foreground hidden sm:inline">{themeLabel}</span>
        </button>

        {/* Copyright — left-center */}
        <span className="text-xs font-medium text-muted-foreground tracking-wide shrink-0 hidden sm:inline">
          © {t('ui.brandName')} 2026
        </span>

        {/* Marquee text — center */}
        <div className="flex-1 overflow-hidden text-center min-w-0" role="status" aria-live="polite">
          <span className="text-xs md:text-sm font-medium text-foreground whitespace-nowrap block truncate">
            {displayedText}
            <span className="inline-block w-0.5 h-3.5 align-middle animate-blink bg-foreground ms-1" aria-hidden="true" />
          </span>
        </div>

        {/* Language toggle */}
        <div ref={langRef} className="relative shrink-0">
          <button
            onClick={() => setLangOpen(!langOpen)}
            aria-label="Select language"
            aria-expanded={langOpen}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5
              hover:bg-accent/50 transition-colors duration-200
              text-foreground hover:text-primary"
          >
            <Globe size={15} />
            <span className="text-sm">{currentLang.flag}</span>
          </button>

          {langOpen && (
            <div className="absolute top-full mt-1 end-0 bg-card border border-border rounded-xl shadow-lg overflow-hidden min-w-[150px] animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors duration-200
                    hover:bg-accent/50
                    ${language === lang.code ? 'bg-accent/30 font-bold text-foreground' : 'text-muted-foreground'}`}
                >
                  <span>{lang.flag}</span>
                  <span className="flex-1 text-start">{lang.label}</span>
                  {language === lang.code && <Check size={13} className="text-primary" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopToolbar;
