import { MoonStar, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex flex-col items-center gap-0.5 md:gap-1 px-2 md:px-4 py-1 md:py-2 transition-all duration-300 rounded-lg group text-muted-foreground hover:text-foreground hover:bg-muted/50"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-4 h-4 md:w-5 md:h-5">
        <Sun 
          className={`absolute inset-0 w-4 h-4 md:w-5 md:h-5 transition-all duration-500 ${
            theme === 'dark' 
              ? 'rotate-90 scale-0 opacity-0' 
              : 'rotate-0 scale-100 opacity-100'
          }`}
        />
        <MoonStar 
          className={`absolute inset-0 w-4 h-4 md:w-5 md:h-5 transition-all duration-500 ${
            theme === 'dark' 
              ? 'rotate-0 scale-100 opacity-100' 
              : '-rotate-90 scale-0 opacity-0'
          }`}
        />
      </div>
      <span className="text-[9px] md:text-xs font-medium">
        {theme === 'dark' ? 'בהיר' : 'כהה'}
      </span>
    </button>
  );
};

export default ThemeToggle;
