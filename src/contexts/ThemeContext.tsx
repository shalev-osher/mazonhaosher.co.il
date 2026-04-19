import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';
type ThemeMode = Theme;

interface ThemeContextType {
  theme: Theme;
  mode: ThemeMode;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  const oldTheme = localStorage.getItem('theme');
  if (oldTheme) localStorage.removeItem('theme');
  const stored = localStorage.getItem('themeMode');
  if (stored === 'light' || stored === 'dark') return stored;
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  return 'light';
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty('--theme-transition', 'background-color 0.4s ease, color 0.3s ease, border-color 0.3s ease');
    root.classList.add('theme-transitioning');

    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    localStorage.setItem('themeMode', theme);

    const timer = setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 500);

    const themeColor = theme === 'dark' ? '#1a0d10' : '#faf6f7';
    const metaTags = document.querySelectorAll('meta[name="theme-color"]');
    metaTags.forEach(tag => tag.remove());
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = themeColor;
    document.head.appendChild(meta);

    return () => clearTimeout(timer);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const setMode = (newMode: ThemeMode) => {
    setTheme(newMode);
  };

  return (
    <ThemeContext.Provider value={{ theme, mode: theme, toggleTheme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
