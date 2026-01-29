import { MoonStar, Sunrise } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={toggleTheme}
            className="relative p-2 transition-all duration-300 rounded-lg group border text-muted-foreground hover:text-primary hover:bg-primary/10 border-transparent hover:border-primary/20 bg-card/50 overflow-hidden"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <Sunrise 
              className={`w-4 h-4 transition-all duration-500 ${
                theme === 'dark' 
                  ? 'rotate-90 scale-0 opacity-0 absolute' 
                  : 'rotate-0 scale-100 opacity-100'
              }`}
            />
            <MoonStar 
              className={`w-4 h-4 transition-all duration-500 ${
                theme === 'dark' 
                  ? 'rotate-0 scale-100 opacity-100' 
                  : '-rotate-90 scale-0 opacity-0 absolute'
              }`}
            />
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side="bottom" 
          className="bg-background/95 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/5 px-3 py-1.5 text-xs font-medium"
        >
          {theme === 'dark' ? 'מצב בהיר' : 'מצב כהה'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ThemeToggle;
