import { useEffect, useState } from "react";

interface Crumb {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
  emoji: string;
}

/**
 * One-shot cookie rain effect.
 * Triggers on prop change, auto-cleans after animation.
 */
const CookieRain = ({ trigger }: { trigger: number }) => {
  const [crumbs, setCrumbs] = useState<Crumb[]>([]);

  useEffect(() => {
    if (trigger === 0) return;
    const emojis = ["🍪", "✨", "🌟"];
    const newCrumbs: Crumb[] = Array.from({ length: 30 }, (_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      duration: 2 + Math.random() * 1.5,
      size: 18 + Math.random() * 18,
      rotation: Math.random() * 720 - 360,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));
    setCrumbs(newCrumbs);
    const timeout = setTimeout(() => setCrumbs([]), 4000);
    return () => clearTimeout(timeout);
  }, [trigger]);

  if (crumbs.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {crumbs.map((c) => (
        <span
          key={c.id}
          className="absolute select-none"
          style={{
            left: `${c.left}%`,
            top: "-40px",
            fontSize: `${c.size}px`,
            animation: `cookieRainFall ${c.duration}s ${c.delay}s cubic-bezier(0.45, 0, 0.55, 1) forwards`,
            ["--rotation" as string]: `${c.rotation}deg`,
          }}
        >
          {c.emoji}
        </span>
      ))}
      <style>{`
        @keyframes cookieRainFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% { opacity: 1; }
          100% {
            transform: translateY(110vh) rotate(var(--rotation));
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default CookieRain;
