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
            className="relative p-2.5 transition-all duration-400 rounded-full group overflow-hidden text-muted-foreground hover:text-foreground"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {/* Hover background */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-primary to-primary/80 transition-all duration-400 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-10" />
            
            <div className="relative z-10 w-4 h-4">
              <Sunrise 
                className={`absolute inset-0 w-4 h-4 transition-all duration-500 ${
                  theme === 'dark' 
                    ? 'rotate-90 scale-0 opacity-0' 
                    : 'rotate-0 scale-100 opacity-100'
                }`}
              />
              <MoonStar 
                className={`absolute inset-0 w-4 h-4 transition-all duration-500 ${
                  theme === 'dark' 
                    ? 'rotate-0 scale-100 opacity-100' 
                    : '-rotate-90 scale-0 opacity-0'
                }`}
              />
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side="bottom" 
          sideOffset={8}
          className="bg-background/95 backdrop-blur-xl border-border/50 shadow-xl px-3 py-1.5 text-xs font-medium rounded-full"
        >
          {theme === 'dark' ? 'מצב בהיר' : 'מצב כהה'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ThemeToggle;
