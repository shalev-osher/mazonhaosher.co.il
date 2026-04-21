import { memo } from "react";

interface SectionDividerProps {
  variant?: "wave" | "ornament" | "minimal";
  flip?: boolean;
}

/**
 * Cinematic section divider with golden SVG ornaments.
 * Pure decorative element — no interactivity.
 */
const SectionDivider = memo(({ variant = "ornament", flip = false }: SectionDividerProps) => {
  if (variant === "minimal") {
    return (
      <div
        className="relative w-full h-px my-8"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, hsla(40,90%,55%,0.4) 50%, transparent 100%)",
        }}
      />
    );
  }

  if (variant === "wave") {
    return (
      <div
        className="relative w-full overflow-hidden pointer-events-none"
        aria-hidden="true"
        style={{ height: "60px", transform: flip ? "rotate(180deg)" : "none" }}
      >
        <svg
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(40, 90%, 55%)" stopOpacity="0" />
              <stop offset="50%" stopColor="hsl(40, 90%, 55%)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="hsl(40, 90%, 55%)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,30 C300,60 600,0 900,30 C1050,45 1150,15 1200,30 L1200,60 L0,60 Z"
            fill="url(#waveGradient)"
          />
        </svg>
      </div>
    );
  }

  // Ornament variant — center medallion with side flourishes
  return (
    <div
      className="relative w-full flex items-center justify-center py-8 pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="flex-1 h-px max-w-[200px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, hsla(40,90%,55%,0.5))",
        }}
      />
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        className="mx-4"
        style={{
          filter: "drop-shadow(0 0 8px hsla(40,90%,55%,0.4))",
          animation: "ornamentPulse 4s ease-in-out infinite",
        }}
      >
        <defs>
          <linearGradient id="ornamentGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(45, 95%, 65%)" />
            <stop offset="100%" stopColor="hsl(35, 85%, 45%)" />
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="3" fill="url(#ornamentGold)" />
        <path
          d="M24 4 L26 22 L24 24 L22 22 Z M24 44 L22 26 L24 24 L26 26 Z M4 24 L22 22 L24 24 L22 26 Z M44 24 L26 26 L24 24 L26 22 Z"
          fill="url(#ornamentGold)"
          opacity="0.85"
        />
        <circle cx="24" cy="24" r="10" fill="none" stroke="url(#ornamentGold)" strokeWidth="0.5" opacity="0.4" />
      </svg>
      <div
        className="flex-1 h-px max-w-[200px]"
        style={{
          background:
            "linear-gradient(90deg, hsla(40,90%,55%,0.5), transparent)",
        }}
      />
      <style>{`
        @keyframes ornamentPulse {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.9; }
          50% { transform: scale(1.1) rotate(45deg); opacity: 1; }
        }
      `}</style>
    </div>
  );
});

SectionDivider.displayName = "SectionDivider";

export default SectionDivider;
