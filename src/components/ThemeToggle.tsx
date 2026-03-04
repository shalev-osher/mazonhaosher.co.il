import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon, Monitor } from "lucide-react";

const ThemeToggle = () => {
  const { mode, toggleTheme } = useTheme();

  const icon = mode === 'light' ? <Sun size={16} /> : mode === 'dark' ? <Moon size={16} /> : <Monitor size={16} />;
  const label = mode === 'light' ? 'בהיר' : mode === 'dark' ? 'כהה' : 'אוטומטי';

  return (
    <button
      onClick={toggleTheme}
      aria-label={`מצב תצוגה: ${label}`}
      className="fixed top-4 left-4 z-50 group flex items-center gap-2 
        bg-card border border-border 
        rounded-full px-3 py-2 shadow-[var(--shadow-soft)]
        hover:shadow-[var(--shadow-warm)] hover:border-primary
        transition-all duration-300 ease-out
        hover:scale-105 active:scale-95"
    >
      <span className="text-foreground/70 group-hover:text-primary transition-colors duration-300">
        {icon}
      </span>
      <span className="text-xs font-body text-muted-foreground group-hover:text-foreground transition-colors duration-300 hidden sm:inline">
        {label}
      </span>
    </button>
  );
};

export default ThemeToggle;
