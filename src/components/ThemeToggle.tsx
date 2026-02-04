import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

const ThemeToggle = () => {
  const { mode, toggleTheme } = useTheme();
  const { isRTL } = useLanguage();

  const getIcon = () => {
    switch (mode) {
      case 'light':
        return <Moon className="w-3.5 h-3.5 md:w-4 md:h-4 transition-all duration-300 text-white" />;
      case 'dark':
        return <Sun className="w-3.5 h-3.5 md:w-4 md:h-4 transition-all duration-300 text-white" />;
      case 'auto':
        return <Monitor className="w-3.5 h-3.5 md:w-4 md:h-4 transition-all duration-300 text-white" />;
    }
  };

  const getGradient = () => {
    switch (mode) {
      case 'light':
        return 'from-blue-500 to-cyan-600';
      case 'dark':
        return 'from-amber-400 to-orange-500';
      case 'auto':
        return 'from-purple-500 to-pink-500';
    }
  };

  const getLabel = () => {
    switch (mode) {
      case 'light':
        return isRTL ? 'כהה' : 'Dark';
      case 'dark':
        return isRTL ? 'אוטו' : 'Auto';
      case 'auto':
        return isRTL ? 'בהיר' : 'Light';
    }
  };

  const getAriaLabel = () => {
    switch (mode) {
      case 'light':
        return 'Switch to dark mode';
      case 'dark':
        return 'Switch to auto mode';
      case 'auto':
        return 'Switch to light mode';
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex flex-col items-center gap-0.5 px-2 md:px-3 py-1 md:py-1.5 transition-all duration-300 rounded-lg group hover:bg-muted"
      aria-label={getAriaLabel()}
    >
      <div className={`p-1 md:p-1.5 rounded-xl transition-all duration-300 group-hover:scale-105 shadow-md bg-gradient-to-br ${getGradient()}`}>
        {getIcon()}
      </div>
      <span className="text-[9px] md:text-[11px] font-medium text-muted-foreground group-hover:text-foreground">
        {getLabel()}
      </span>
    </button>
  );
};

export default ThemeToggle;
