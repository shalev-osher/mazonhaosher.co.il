import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

const ThemeToggle = () => {
  const { mode, toggleTheme } = useTheme();
  const { isRTL } = useLanguage();

  const getIcon = () => {
    switch (mode) {
      case 'auto':
        return <Monitor className="w-3.5 h-3.5 md:w-4 md:h-4 transition-all duration-300 text-white" />;
      case 'light':
        return <Sun className="w-3.5 h-3.5 md:w-4 md:h-4 transition-all duration-300 text-white" />;
      case 'dark':
        return <Moon className="w-3.5 h-3.5 md:w-4 md:h-4 transition-all duration-300 text-white" />;
    }
  };

  const getLabel = () => {
    switch (mode) {
      case 'auto':
        return isRTL ? 'אוטומטי' : 'Auto';
      case 'light':
        return isRTL ? 'בהיר' : 'Light';
      case 'dark':
        return isRTL ? 'כהה' : 'Dark';
    }
  };

  // Use explicit class names so Tailwind can detect them
  const gradientClasses = {
    auto: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    light: 'bg-gradient-to-br from-amber-400 to-orange-500',
    dark: 'bg-gradient-to-br from-indigo-500 to-violet-600',
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-14 md:w-16 flex flex-col items-center gap-0 py-0.5 md:py-1 transition-all duration-300 rounded-lg group hover:bg-muted"
      aria-label="Toggle theme"
    >
      <div className={`p-1 md:p-1.5 rounded-xl transition-all duration-300 group-hover:scale-105 shadow-md ${gradientClasses[mode]}`}>
        {getIcon()}
      </div>
      <span className="text-[8px] md:text-[10px] font-medium text-muted-foreground group-hover:text-foreground">
        {getLabel()}
      </span>
    </button>
  );
};

export default ThemeToggle;
