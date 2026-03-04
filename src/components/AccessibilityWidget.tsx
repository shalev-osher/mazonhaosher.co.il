import { useState, useEffect, useRef, useCallback } from "react";
import { X, RotateCcw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type FontSize = 0 | 1 | 2 | 3;
type LineHeight = 0 | 1 | 2;
type TextAlign = "default" | "left" | "center" | "right";

interface A11yState {
  fontSize: FontSize;
  lineHeight: LineHeight;
  textAlign: TextAlign;
  highContrast: boolean;
  invertColors: boolean;
  reduceMotion: boolean;
  highlightLinks: boolean;
  highlightTitles: boolean;
  bigCursor: boolean;
  readableFont: boolean;
  textSpacing: boolean;
  saturation: 0 | 1 | 2;
  highlightFocus: boolean;
  hideImages: boolean;
  readingGuide: boolean;
}

const DEFAULT_STATE: A11yState = {
  fontSize: 0,
  lineHeight: 0,
  textAlign: "default",
  highContrast: false,
  invertColors: false,
  reduceMotion: false,
  highlightLinks: false,
  highlightTitles: false,
  bigCursor: false,
  readableFont: false,
  textSpacing: false,
  saturation: 0,
  highlightFocus: false,
  hideImages: false,
  readingGuide: false,
};

const AccessibilityWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<A11yState>(DEFAULT_STATE);
  const panelRef = useRef<HTMLDivElement>(null);
  const guideRef = useRef<HTMLDivElement>(null);
  const { isRTL, t } = useLanguage();

  const update = useCallback((key: keyof A11yState, value: unknown) => {
    setState(prev => ({ ...prev, [key]: value }));
  }, []);

  // Font size
  useEffect(() => {
    const sizes = ["100%", "115%", "130%", "145%"];
    document.documentElement.style.fontSize = sizes[state.fontSize];
  }, [state.fontSize]);

  // Line height
  useEffect(() => {
    document.documentElement.classList.remove("a11y-line-height-1", "a11y-line-height-2");
    if (state.lineHeight === 1) document.documentElement.classList.add("a11y-line-height-1");
    if (state.lineHeight === 2) document.documentElement.classList.add("a11y-line-height-2");
  }, [state.lineHeight]);

  // Text alignment
  useEffect(() => {
    document.documentElement.classList.remove("a11y-align-left", "a11y-align-center", "a11y-align-right");
    if (state.textAlign !== "default") document.documentElement.classList.add(`a11y-align-${state.textAlign}`);
  }, [state.textAlign]);

  // Boolean toggles
  useEffect(() => {
    const toggles: [keyof A11yState, string][] = [
      ["highContrast", "high-contrast"],
      ["invertColors", "a11y-invert"],
      ["reduceMotion", "reduce-motion"],
      ["highlightLinks", "a11y-highlight-links"],
      ["highlightTitles", "a11y-highlight-titles"],
      ["bigCursor", "a11y-big-cursor"],
      ["readableFont", "a11y-readable-font"],
      ["textSpacing", "a11y-text-spacing"],
      ["highlightFocus", "a11y-highlight-focus"],
      ["hideImages", "a11y-hide-images"],
    ];
    toggles.forEach(([key, cls]) => {
      document.documentElement.classList.toggle(cls, !!state[key]);
    });
  }, [state.highContrast, state.invertColors, state.reduceMotion, state.highlightLinks, state.highlightTitles, state.bigCursor, state.readableFont, state.textSpacing, state.highlightFocus, state.hideImages]);

  // Saturation
  useEffect(() => {
    document.documentElement.classList.remove("a11y-low-saturation", "a11y-grayscale");
    if (state.saturation === 1) document.documentElement.classList.add("a11y-low-saturation");
    if (state.saturation === 2) document.documentElement.classList.add("a11y-grayscale");
  }, [state.saturation]);

  // Reading guide
  useEffect(() => {
    if (!state.readingGuide || !guideRef.current) return;
    const guide = guideRef.current;
    const onMove = (e: MouseEvent) => { guide.style.top = `${e.clientY - 20}px`; };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [state.readingGuide]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    if (isOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const resetAll = () => setState(DEFAULT_STATE);
  const hasChanges = JSON.stringify(state) !== JSON.stringify(DEFAULT_STATE);
  const activeCount = Object.entries(state).filter(([, v]) => v !== false && v !== 0 && v !== "default").length;

  const fontLabels = [t('ui.a11yFontNormal'), t('ui.a11yFontLarge'), t('ui.a11yFontLarger'), t('ui.a11yFontHuge')];
  const lineLabels = [t('ui.a11yLineNormal'), t('ui.a11yLineLarge'), t('ui.a11yLineXL')];
  const satLabels = [t('ui.a11ySatNormal'), t('ui.a11ySatLow'), t('ui.a11ySatGray')];
  const alignLabels: { val: TextAlign; label: string }[] = [
    { val: "default", label: t('ui.a11yAlignDefault') },
    { val: "right", label: t('ui.a11yAlignRight') },
    { val: "center", label: t('ui.a11yAlignCenter') },
    { val: "left", label: t('ui.a11yAlignLeft') },
  ];

  return (
    <>
      {/* Reading Guide */}
      {state.readingGuide && (
        <div
          ref={guideRef}
          className="fixed left-0 right-0 z-[9997] pointer-events-none"
          style={{ height: "40px", background: "hsla(210, 100%, 50%, 0.12)", borderTop: "2px solid hsl(210, 100%, 50%)", borderBottom: "2px solid hsl(210, 100%, 50%)" }}
          aria-hidden="true"
        />
      )}

      <div ref={panelRef} className="fixed bottom-4 left-4 z-50" dir={isRTL ? "rtl" : "ltr"} role="region" aria-label={t('ui.a11yMenu')}>
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={t('ui.a11yMenu')}
          aria-expanded={isOpen}
          className={`relative w-14 h-14 rounded-full flex items-center justify-center
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
          {activeCount > 0 && !isOpen && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-yellow-400 text-black text-[10px] font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>

        {/* Panel */}
        {isOpen && (
          <div
            role="dialog"
            aria-labelledby="a11y-panel-title"
            className="absolute bottom-16 left-0 w-80
              bg-card border border-border
              rounded-2xl shadow-[var(--shadow-elevated)]
              animate-in fade-in slide-in-from-bottom-3 duration-200
              max-h-[80vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-card px-5 pt-5 pb-3 border-b border-border rounded-t-2xl">
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
                    {t('ui.a11yMenu')}
                  </h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label={t('ui.a11yClose')}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* === SECTION: Content === */}
              <SectionTitle>{t('ui.a11yContent')}</SectionTitle>

              {/* Font Size */}
              <StepperRow label={t('ui.a11yFontSize')} valueLabel={fontLabels[state.fontSize]}>
                {[0, 1, 2, 3].map(level => (
                  <button
                    key={level}
                    onClick={() => update("fontSize", level as FontSize)}
                    className={`flex-1 h-9 rounded-lg font-bold transition-all duration-200
                      ${state.fontSize === level
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground'
                      }`}
                    style={{ fontSize: `${11 + level * 2}px` }}
                  >
                    א
                  </button>
                ))}
              </StepperRow>

              {/* Line Height */}
              <StepperRow label={t('ui.a11yLineHeight')} valueLabel={lineLabels[state.lineHeight]}>
                {[0, 1, 2].map(level => (
                  <button
                    key={level}
                    onClick={() => update("lineHeight", level as LineHeight)}
                    className={`flex-1 h-9 rounded-lg text-xs font-medium transition-all duration-200
                      ${state.lineHeight === level
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground'
                      }`}
                  >
                    {lineLabels[level]}
                  </button>
                ))}
              </StepperRow>

              {/* Text Alignment */}
              <StepperRow label={t('ui.a11yTextAlign')} valueLabel={alignLabels.find(a => a.val === state.textAlign)?.label || ""}>
                {alignLabels.map(a => (
                  <button
                    key={a.val}
                    onClick={() => update("textAlign", a.val)}
                    className={`flex-1 h-9 rounded-lg text-[10px] font-medium transition-all duration-200
                      ${state.textAlign === a.val
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground'
                      }`}
                  >
                    {a.label}
                  </button>
                ))}
              </StepperRow>

              <div className="h-px bg-border" />

              {/* === SECTION: Display === */}
              <SectionTitle>{t('ui.a11yDisplay')}</SectionTitle>

              <div className="grid grid-cols-2 gap-2">
                <ToggleOption active={state.highContrast} onClick={() => update("highContrast", !state.highContrast)}
                  icon={<ContrastIcon />} label={t('ui.a11yHighContrast')} />
                <ToggleOption active={state.invertColors} onClick={() => update("invertColors", !state.invertColors)}
                  icon={<InvertIcon />} label={t('ui.a11yInvertColors')} />
                <ToggleOption active={state.highlightLinks} onClick={() => update("highlightLinks", !state.highlightLinks)}
                  icon={<LinkIcon />} label={t('ui.a11yHighlightLinks')} />
                <ToggleOption active={state.highlightTitles} onClick={() => update("highlightTitles", !state.highlightTitles)}
                  icon={<TitleIcon />} label={t('ui.a11yHighlightTitles')} />
                <ToggleOption active={state.hideImages} onClick={() => update("hideImages", !state.hideImages)}
                  icon={<ImageOffIcon />} label={t('ui.a11yHideImages')} />
                {/* Saturation cycle */}
                <button
                  onClick={() => update("saturation", ((state.saturation + 1) % 3) as 0 | 1 | 2)}
                  className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all duration-200
                    ${state.saturation > 0
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-muted text-muted-foreground border-border hover:bg-secondary hover:text-foreground'
                    }`}
                >
                  <SaturationIcon />
                  <span>{satLabels[state.saturation]}</span>
                </button>
              </div>

              <div className="h-px bg-border" />

              {/* === SECTION: Navigation === */}
              <SectionTitle>{t('ui.a11yNavigation')}</SectionTitle>

              <div className="grid grid-cols-2 gap-2">
                <ToggleOption active={state.bigCursor} onClick={() => update("bigCursor", !state.bigCursor)}
                  icon={<CursorIcon />} label={t('ui.a11yBigCursor')} />
                <ToggleOption active={state.readingGuide} onClick={() => update("readingGuide", !state.readingGuide)}
                  icon={<GuideIcon />} label={t('ui.a11yReadingGuide')} />
                <ToggleOption active={state.reduceMotion} onClick={() => update("reduceMotion", !state.reduceMotion)}
                  icon={<MotionIcon />} label={t('ui.a11yReduceMotion')} />
                <ToggleOption active={state.readableFont} onClick={() => update("readableFont", !state.readableFont)}
                  icon={<FontIcon />} label={t('ui.a11yReadableFont')} />
                <ToggleOption active={state.textSpacing} onClick={() => update("textSpacing", !state.textSpacing)}
                  icon={<SpacingIcon />} label={t('ui.a11yTextSpacing')} />
                <ToggleOption active={state.highlightFocus} onClick={() => update("highlightFocus", !state.highlightFocus)}
                  icon={<FocusIcon />} label={t('ui.a11yHighlightFocus')} />
              </div>

              <div className="h-px bg-border" />

              {/* Reset */}
              <button
                onClick={resetAll}
                disabled={!hasChanges}
                className="w-full h-10 rounded-xl flex items-center justify-center gap-2 text-xs font-medium
                  bg-muted text-muted-foreground hover:bg-destructive hover:text-destructive-foreground
                  disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              >
                <RotateCcw size={14} />
                {t('ui.a11yReset')}
              </button>

              {/* WCAG Badge */}
              <div className="flex items-center justify-center gap-2 py-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted border border-border">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true" className="text-green-600">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                  <span className="text-[10px] font-bold text-foreground tracking-wide">WCAG 2.1 AA</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

/* === Sub-components === */

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{children}</p>
);

const StepperRow = ({ label, valueLabel, children }: { label: string; valueLabel: string; children: React.ReactNode }) => (
  <div>
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-medium text-foreground">{label}</span>
      <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">{valueLabel}</span>
    </div>
    <div className="flex gap-1">{children}</div>
  </div>
);

const ToggleOption = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
  <button
    onClick={onClick}
    aria-pressed={active}
    className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all duration-200
      ${active
        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
        : 'bg-muted text-muted-foreground border-border hover:bg-secondary hover:text-foreground'
      }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

/* === Icons === */
const ContrastIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20z" fill="currentColor"/></svg>;
const InvertIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 2v20" strokeDasharray="2 2"/></svg>;
const LinkIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
const TitleIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 12h12"/><path d="M6 4h12"/><path d="M9 20h6"/></svg>;
const ImageOffIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="m2 2 20 20"/><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5"/></svg>;
const SaturationIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 2v20"/><path d="M2 12h20"/></svg>;
const CursorIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 4l7.07 17 2.51-7.39L21 11.07z"/></svg>;
const GuideIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M2 12h20"/><path d="M2 6h20"/><path d="M2 18h20"/></svg>;
const MotionIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 14.14 14.14"/></svg>;
const FontIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>;
const SpacingIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M21 10H3"/><path d="M21 6H3"/><path d="M21 14H3"/><path d="M21 18H3"/></svg>;
const FocusIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="12" r="3"/></svg>;

export default AccessibilityWidget;
