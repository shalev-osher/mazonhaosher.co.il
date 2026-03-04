import { useState, useEffect, useRef, useCallback } from "react";
import { X, RotateCcw } from "lucide-react";

type FontSize = 0 | 1 | 2 | 3;

interface A11yState {
  fontSize: FontSize;
  highContrast: boolean;
  reduceMotion: boolean;
  highlightLinks: boolean;
  bigCursor: boolean;
  readableFont: boolean;
  textSpacing: boolean;
  saturation: 0 | 1 | 2; // 0=normal, 1=low, 2=grayscale
  highlightFocus: boolean;
}

const DEFAULT_STATE: A11yState = {
  fontSize: 0,
  highContrast: false,
  reduceMotion: false,
  highlightLinks: false,
  bigCursor: false,
  readableFont: false,
  textSpacing: false,
  saturation: 0,
  highlightFocus: false,
};

const AccessibilityWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<A11yState>(DEFAULT_STATE);
  const panelRef = useRef<HTMLDivElement>(null);

  const update = useCallback((key: keyof A11yState, value: unknown) => {
    setState(prev => ({ ...prev, [key]: value }));
  }, []);

  // Font size
  useEffect(() => {
    const sizes = ["100%", "115%", "130%", "145%"];
    document.documentElement.style.fontSize = sizes[state.fontSize];
  }, [state.fontSize]);

  // High contrast
  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast", state.highContrast);
  }, [state.highContrast]);

  // Reduce motion
  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", state.reduceMotion);
  }, [state.reduceMotion]);

  // Highlight links
  useEffect(() => {
    document.documentElement.classList.toggle("a11y-highlight-links", state.highlightLinks);
  }, [state.highlightLinks]);

  // Big cursor
  useEffect(() => {
    document.documentElement.classList.toggle("a11y-big-cursor", state.bigCursor);
  }, [state.bigCursor]);

  // Readable font
  useEffect(() => {
    document.documentElement.classList.toggle("a11y-readable-font", state.readableFont);
  }, [state.readableFont]);

  // Text spacing
  useEffect(() => {
    document.documentElement.classList.toggle("a11y-text-spacing", state.textSpacing);
  }, [state.textSpacing]);

  // Saturation
  useEffect(() => {
    document.documentElement.classList.remove("a11y-low-saturation", "a11y-grayscale");
    if (state.saturation === 1) document.documentElement.classList.add("a11y-low-saturation");
    if (state.saturation === 2) document.documentElement.classList.add("a11y-grayscale");
  }, [state.saturation]);

  // Focus highlight
  useEffect(() => {
    document.documentElement.classList.toggle("a11y-highlight-focus", state.highlightFocus);
  }, [state.highlightFocus]);

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

  const resetAll = () => setState(DEFAULT_STATE);

  const hasChanges = JSON.stringify(state) !== JSON.stringify(DEFAULT_STATE);

  const fontLabels = ["רגיל", "גדול", "גדול מאוד", "ענק"];
  const satLabels = ["רגיל", "רוויה נמוכה", "גווני אפור"];

  return (
    <div ref={panelRef} className="fixed bottom-4 left-4 z-50" dir="rtl" role="region" aria-label="תפריט נגישות">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="תפריט נגישות"
        aria-expanded={isOpen}
        className={`w-14 h-14 rounded-full flex items-center justify-center
          shadow-lg hover:scale-110 active:scale-95 transition-all duration-200
          ${hasChanges ? 'ring-2 ring-offset-2 ring-yellow-400' : ''}`}
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
          className="absolute bottom-16 left-0 w-80
            bg-card/98 backdrop-blur-xl border border-border/60 
            rounded-2xl shadow-[var(--shadow-elevated)]
            animate-in fade-in slide-in-from-bottom-3 duration-200
            max-h-[80vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-card/98 backdrop-blur-xl px-5 pt-5 pb-3 border-b border-border/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#2563eb' }}>
                  <svg width="16" height="16" viewBox="0 0 486.4 486.4" fill="white" aria-hidden="true">
                    <circle cx="243.2" cy="59.6" r="59.6"/>
                    <path d="M403.27 388.49l-50.8-101.6c-6.4-12.8-19.2-20.8-33.6-20.8h-62.4l-4-48h44.8c13.6 0 24-10.4 24-24s-10.4-24-24-24h-49.6l-2.4-28.8c-1.6-16-14.4-27.2-30.4-27.2h-4c-17.6 1.6-30.4 16.8-28.8 33.6l10.4 120c1.6 14.4 13.6 25.6 28.8 25.6h80l46.4 92.8c4 8 12 13.6 21.6 13.6 4 0 8-0.8 11.2-3.2 12-6.4 16.8-21.6 10.4-33.6l11.6 25.6z"/>
                    <path d="M209.6 382.09c-42.4-4-75.2-40-75.2-83.2 0-36 22.4-66.4 54.4-78.4l-4-44.8c-57.6 14.4-100 66.4-100 128.8 0 72 56.8 131.2 128 135.2 38.4 2.4 74.4-12 101.6-36l-36-28c-18.4 12.8-42.4 19.2-68.8 6.4z"/>
                  </svg>
                </div>
                <h3 id="a11y-panel-title" className="text-sm font-display font-bold text-foreground">
                  תפריט נגישות
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="סגור תפריט נגישות"
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="p-5 space-y-5">
            {/* Font Size — Stepper */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/>
                  </svg>
                  גודל טקסט
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                  {fontLabels[state.fontSize]}
                </span>
              </div>
              <div className="flex gap-1">
                {[0, 1, 2, 3].map(level => (
                  <button
                    key={level}
                    onClick={() => update("fontSize", level as FontSize)}
                    className={`flex-1 h-9 rounded-lg text-xs font-medium transition-all duration-200
                      ${state.fontSize === level
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    style={{ fontSize: `${11 + level * 2}px` }}
                  >
                    א
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-border/40" />

            {/* Toggle Grid */}
            <div className="grid grid-cols-2 gap-2">
              <ToggleOption
                active={state.highContrast}
                onClick={() => update("highContrast", !state.highContrast)}
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20z" fill="currentColor"/></svg>}
                label="ניגודיות גבוהה"
              />
              <ToggleOption
                active={state.highlightLinks}
                onClick={() => update("highlightLinks", !state.highlightLinks)}
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>}
                label="הדגשת קישורים"
              />
              <ToggleOption
                active={state.bigCursor}
                onClick={() => update("bigCursor", !state.bigCursor)}
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 4l7.07 17 2.51-7.39L21 11.07z"/></svg>}
                label="סמן גדול"
              />
              <ToggleOption
                active={state.reduceMotion}
                onClick={() => update("reduceMotion", !state.reduceMotion)}
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M18.36 18.36A9 9 0 0 0 21 12c0-5-4-9-9-9s-9 4-9 9 4 9 9 9"/><path d="m1 1 22 22"/></svg>}
                label="ביטול אנימציות"
              />
              <ToggleOption
                active={state.readableFont}
                onClick={() => update("readableFont", !state.readableFont)}
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>}
                label="פונט קריא"
              />
              <ToggleOption
                active={state.textSpacing}
                onClick={() => update("textSpacing", !state.textSpacing)}
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M21 10H3"/><path d="M21 6H3"/><path d="M21 14H3"/><path d="M21 18H3"/></svg>}
                label="ריווח טקסט"
              />
              <ToggleOption
                active={state.highlightFocus}
                onClick={() => update("highlightFocus", !state.highlightFocus)}
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12h8"/></svg>}
                label="הדגשת פוקוס"
              />
              {/* Saturation cycle */}
              <button
                onClick={() => update("saturation", ((state.saturation + 1) % 3) as 0 | 1 | 2)}
                className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all duration-200
                  ${state.saturation > 0
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-muted/30 text-muted-foreground border-border/50 hover:bg-muted/60 hover:text-foreground'
                  }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/><path d="M12 2v20"/><path d="M2 12h20"/>
                </svg>
                <span>{satLabels[state.saturation]}</span>
              </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-border/40" />

            {/* Reset */}
            <button
              onClick={resetAll}
              disabled={!hasChanges}
              className="w-full h-10 rounded-xl flex items-center justify-center gap-2 text-xs font-medium
                bg-muted/40 text-muted-foreground hover:bg-destructive/10 hover:text-destructive 
                disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              <RotateCcw size={14} />
              איפוס כל ההגדרות
            </button>

            {/* Branding */}
            <p className="text-[10px] text-muted-foreground/50 text-center">
              תפריט נגישות · תקן WCAG 2.1
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const ToggleOption = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
  <button
    onClick={onClick}
    aria-pressed={active}
    className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all duration-200
      ${active
        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
        : 'bg-muted/30 text-muted-foreground border-border/50 hover:bg-muted/60 hover:text-foreground'
      }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default AccessibilityWidget;
