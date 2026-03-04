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
          <svg width="26" height="26" viewBox="0 0 486.4 486.4" fill="white" aria-hidden="true">
            <circle cx="243.2" cy="59.6" r="59.6"/>
            <path d="M403.27 388.49l-50.8-101.6c-6.4-12.8-19.2-20.8-33.6-20.8h-62.4l-4-48h44.8c13.6 0 24-10.4 24-24s-10.4-24-24-24h-49.6l-2.4-28.8c-1.6-16-14.4-27.2-30.4-27.2h-4c-17.6 1.6-30.4 16.8-28.8 33.6l10.4 120c1.6 14.4 13.6 25.6 28.8 25.6h80l46.4 92.8c4 8 12 13.6 21.6 13.6 4 0 8-0.8 11.2-3.2 12-6.4 16.8-21.6 10.4-33.6l11.6 25.6z"/>
            <path d="M209.6 382.09c-42.4-4-75.2-40-75.2-83.2 0-36 22.4-66.4 54.4-78.4l-4-44.8c-57.6 14.4-100 66.4-100 128.8 0 72 56.8 131.2 128 135.2 38.4 2.4 74.4-12 101.6-36l-36-28c-18.4 12.8-42.4 19.2-68.8 6.4z"/>
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
