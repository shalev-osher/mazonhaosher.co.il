import { useState, useEffect, useRef } from "react";
import { Accessibility, Plus, Minus, Eye, Zap, X } from "lucide-react";

type FontSize = "normal" | "large" | "x-large";

const AccessibilityWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>("normal");
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const sizeMap: Record<FontSize, string> = {
      normal: "100%",
      large: "118%",
      "x-large": "136%",
    };
    root.style.fontSize = sizeMap[fontSize];
  }, [fontSize]);

  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast", highContrast);
  }, [highContrast]);

  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", reduceMotion);
  }, [reduceMotion]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const increaseFontSize = () => {
    setFontSize((prev) =>
      prev === "normal" ? "large" : prev === "large" ? "x-large" : prev
    );
  };

  const decreaseFontSize = () => {
    setFontSize((prev) =>
      prev === "x-large" ? "large" : prev === "large" ? "normal" : prev
    );
  };

  const resetAll = () => {
    setFontSize("normal");
    setHighContrast(false);
    setReduceMotion(false);
  };

  const fontLabel =
    fontSize === "normal" ? "רגיל" : fontSize === "large" ? "גדול" : "גדול מאוד";

  return (
    <div ref={panelRef} className="fixed bottom-4 left-4 z-50" dir="rtl" role="region" aria-label="תפריט נגישות">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="תפריט נגישות"
        className="w-14 h-14 rounded-full flex items-center justify-center
          shadow-lg hover:scale-110 active:scale-95 transition-transform duration-200"
        style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
      >
        {isOpen ? <X size={26} strokeWidth={2.5} /> : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <circle cx="12" cy="4" r="2"/>
            <path d="M19 13v-2c-1.54.02-3.09-.75-4.07-1.83l-1.29-1.43C13.17 7.23 12.37 7 11.7 7c-.29 0-.57.04-.84.12l-4.37 1.23C5.6 8.61 5 9.45 5 10.4V15h2v-4.26l1.8-.51L7 19h2l1.41-5.49L13 16v6h2v-7.54l-2.09-3.17L13.75 9c1.08 1.08 2.58 2 4.25 2v2h1z"/>
          </svg>
        )}
      </button>

      {/* Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-labelledby="a11y-panel-title"
          aria-expanded="true"
          className="absolute bottom-16 left-0 w-64 
            bg-card/95 backdrop-blur-xl border border-border/60 
            rounded-2xl shadow-[var(--shadow-elevated)] p-5
            animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <h3 id="a11y-panel-title" className="text-sm font-display font-bold text-foreground mb-4">
            הגדרות נגישות
          </h3>

          {/* Font Size */}
          <div className="mb-4">
            <span className="text-xs text-muted-foreground block mb-2">
              גודל טקסט: {fontLabel}
            </span>
            <div className="flex gap-2">
              <button
                onClick={decreaseFontSize}
                disabled={fontSize === "normal"}
                className="flex-1 h-9 rounded-lg border border-border bg-background/60 
                  text-foreground flex items-center justify-center gap-1 text-xs
                  hover:bg-primary hover:text-primary-foreground hover:border-primary
                  disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Minus size={14} /> הקטן
              </button>
              <button
                onClick={increaseFontSize}
                disabled={fontSize === "x-large"}
                className="flex-1 h-9 rounded-lg border border-border bg-background/60 
                  text-foreground flex items-center justify-center gap-1 text-xs
                  hover:bg-primary hover:text-primary-foreground hover:border-primary
                  disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Plus size={14} /> הגדל
              </button>
            </div>
          </div>

          {/* High Contrast */}
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`w-full h-9 rounded-lg border text-xs flex items-center justify-center gap-2 mb-3 transition-colors duration-200
              ${
                highContrast
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border bg-background/60 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary"
              }`}
          >
            <Eye size={14} />
            ניגודיות גבוהה {highContrast ? "✓" : ""}
          </button>

          {/* Reduce Motion */}
          <button
            onClick={() => setReduceMotion(!reduceMotion)}
            className={`w-full h-9 rounded-lg border text-xs flex items-center justify-center gap-2 mb-4 transition-colors duration-200
              ${
                reduceMotion
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border bg-background/60 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary"
              }`}
          >
            <Zap size={14} />
            ביטול אנימציות {reduceMotion ? "✓" : ""}
          </button>

          {/* Reset */}
          <button
            onClick={resetAll}
            className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 underline underline-offset-2"
          >
            איפוס הכל
          </button>
        </div>
      )}
    </div>
  );
};

export default AccessibilityWidget;
