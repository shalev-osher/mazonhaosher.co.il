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
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="relative w-8 h-8 rounded-full hover:bg-primary/10 transition-all duration-300 overflow-hidden p-1.5"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <Sunrise 
              className={`w-4 h-4 absolute transition-all duration-500 text-muted-foreground ${
                theme === 'dark' 
                  ? 'rotate-90 scale-0 opacity-0' 
                  : 'rotate-0 scale-100 opacity-100'
              }`}
            />
            <MoonStar 
              className={`w-4 h-4 absolute transition-all duration-500 text-muted-foreground ${
                theme === 'dark' 
                  ? 'rotate-0 scale-100 opacity-100' 
                  : '-rotate-90 scale-0 opacity-0'
              }`}
            />
          </Button>
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
