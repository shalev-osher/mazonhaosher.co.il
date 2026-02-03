import { MoonStar, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const { isRTL } = useLanguage();

  return (
    <button
      onClick={toggleTheme}
      className="flex flex-col items-center gap-0.5 px-2 md:px-3 py-1 md:py-1.5 transition-all duration-300 rounded-lg group hover:bg-muted/50"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className={`p-1 md:p-1.5 rounded-lg transition-all duration-300 group-hover:scale-105 ${
        theme === 'dark' ? 'bg-amber-500/15' : 'bg-indigo-500/15'
      }`}>
        <div className="relative w-3.5 h-3.5 md:w-4 md:h-4">
          <Sun 
            className={`absolute inset-0 w-3.5 h-3.5 md:w-4 md:h-4 text-amber-500 transition-all duration-500 ${
              theme === 'dark' 
                ? 'rotate-0 scale-100 opacity-100' 
                : 'rotate-90 scale-0 opacity-0'
            }`}
          />
          <MoonStar 
            className={`absolute inset-0 w-3.5 h-3.5 md:w-4 md:h-4 text-indigo-400 transition-all duration-500 ${
              theme === 'dark' 
                ? '-rotate-90 scale-0 opacity-0'
                : 'rotate-0 scale-100 opacity-100'
            }`}
          />
        </div>
      </div>
      <span className="text-[9px] md:text-[11px] font-medium text-muted-foreground group-hover:text-foreground">
        {theme === 'dark' ? (isRTL ? 'בהיר' : 'Light') : (isRTL ? 'כהה' : 'Dark')}
      </span>
    </button>
  );
};

export default ThemeToggle;
