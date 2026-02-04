import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

// Custom Sun/Moon combined icon for auto mode
const SunMoonIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    {/* Sun on right side */}
    <circle cx="16" cy="8" r="3" fill="currentColor" opacity="0.9" />
    <line x1="16" y1="2" x2="16" y2="3.5" />
    <line x1="16" y1="12.5" x2="16" y2="14" />
    <line x1="21" y1="8" x2="22" y2="8" />
    <line x1="19.5" y1="4.5" x2="20.5" y2="3.5" />
    <line x1="19.5" y1="11.5" x2="20.5" y2="12.5" />
    
    {/* Diagonal divider */}
    <line x1="13" y1="3" x2="11" y2="21" strokeOpacity="0.5" />
    
    {/* Moon on left side */}
    <path d="M3 15.5a7 7 0 0 0 7-7 7 7 0 0 0-.5-2.5 5.5 5.5 0 1 0-6 9.5z" fill="currentColor" opacity="0.9" />
  </svg>
);

const ThemeToggle = () => {
  const { mode, toggleTheme } = useTheme();
  const { isRTL } = useLanguage();

  const getIcon = () => {
    switch (mode) {
      case 'auto':
        return <SunMoonIcon className="w-3.5 h-3.5 md:w-4 md:h-4 transition-all duration-300 text-white" />;
      case 'light':
        return <Sun className="w-3.5 h-3.5 md:w-4 md:h-4 transition-all duration-300 text-white" />;
      case 'dark':
        return <Moon className="w-3.5 h-3.5 md:w-4 md:h-4 transition-all duration-300 text-white" />;
    }
  };

  const getGradient = () => {
    switch (mode) {
      case 'auto':
        return 'from-amber-400 via-purple-500 to-indigo-600';
      case 'light':
        return 'from-amber-400 to-orange-500';
      case 'dark':
        return 'from-indigo-500 to-violet-600';
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

  return (
    <button
      onClick={toggleTheme}
      className="w-14 md:w-16 flex flex-col items-center gap-0 py-0.5 md:py-1 transition-all duration-300 rounded-lg group hover:bg-muted"
      aria-label="Toggle theme"
    >
      <div className={`p-1 md:p-1.5 rounded-xl transition-all duration-300 group-hover:scale-105 shadow-md bg-gradient-to-br ${getGradient()}`}>
        {getIcon()}
      </div>
      <span className="text-[8px] md:text-[10px] font-medium text-muted-foreground group-hover:text-foreground">
        {getLabel()}
      </span>
    </button>
  );
};

export default ThemeToggle;
