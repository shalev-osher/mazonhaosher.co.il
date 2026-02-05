import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

const ThemeToggle = () => {
  const { mode, toggleTheme } = useTheme();
  const { isRTL } = useLanguage();

  const getIcon = () => {
    switch (mode) {
      case 'auto':
        return (
          <svg className="w-4 h-4 md:w-5 md:h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
        );
      case 'light':
        return (
          <svg className="w-4 h-4 md:w-5 md:h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        );
      case 'dark':
        return (
          <svg className="w-4 h-4 md:w-5 md:h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        );
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

  // Use inline styles to prevent Tailwind purging issues
  const gradientStyles = {
    auto: { background: 'linear-gradient(to bottom right, #10b981, #0d9488)' },
    light: { background: 'linear-gradient(to bottom right, #fbbf24, #f97316)' },
    dark: { background: 'linear-gradient(to bottom right, #6366f1, #8b5cf6)' },
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex flex-col items-center gap-0.5 py-0.5 transition-all duration-300 rounded-lg group hover:bg-muted px-2"
      aria-label="Toggle theme"
    >
      <div 
        className="p-1.5 md:p-2 rounded-xl transition-all duration-300 group-hover:scale-105 shadow-md"
        style={gradientStyles[mode]}
      >
        {getIcon()}
      </div>
      <span className="text-[10px] md:text-xs font-medium text-muted-foreground group-hover:text-foreground">
        {getLabel()}
      </span>
    </button>
  );
};

export default ThemeToggle;
