import { useState, useEffect, useMemo } from "react";
import logo from "@/assets/logo.png";
import { useLanguage } from "@/contexts/LanguageContext";

const CinematicEntry = ({ onComplete }: { onComplete: () => void }) => {
  const { isRTL } = useLanguage();
  const [phase, setPhase] = useState<'particles' | 'logo' | 'text' | 'exit' | 'done'>('particles');

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('logo'), 400),
      setTimeout(() => setPhase('text'), 1200),
      setTimeout(() => setPhase('exit'), 3000),
      setTimeout(() => { setPhase('done'); onComplete(); }, 3800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  // Floating particles like osher.cc
  const particles = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 3,
      duration: 3 + Math.random() * 5,
      delay: Math.random() * 2,
      opacity: 0.1 + Math.random() * 0.5,
    })), []
  );

  if (phase === 'done') return null;

  return (
    <div
      role="status"
      aria-label={isRTL ? "טוען..." : "Loading..."}
      className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden"
      style={{
        background: 'hsl(25, 20%, 6%)',
        opacity: phase === 'exit' ? 0 : 1,
        transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <style>{`
        @keyframes entryParticleDrift {
          0% { transform: translate(0, 0); opacity: 0; }
          20% { opacity: var(--p-op); }
          80% { opacity: var(--p-op); }
          100% { transform: translate(var(--dx), var(--dy)); opacity: 0; }
        }
        @keyframes entryLogoReveal {
          0% { opacity: 0; transform: scale(0.8); filter: blur(20px); }
          100% { opacity: 1; transform: scale(1); filter: blur(0); }
        }
        @keyframes entryTextSlide {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes entryLineExpand {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        @keyframes entryGlowPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        @keyframes entrySubFade {
          0% { opacity: 0; letter-spacing: 0.3em; }
          100% { opacity: 0.6; letter-spacing: 0.15em; }
        }
      `}</style>

      {/* Ambient glow */}
      <div
        className="absolute"
        style={{
          width: '600px',
          height: '600px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, hsla(35, 85%, 45%, 0.08) 0%, hsla(35, 85%, 45%, 0.02) 40%, transparent 70%)',
          animation: 'entryGlowPulse 3s ease-in-out infinite',
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: p.size > 2.5
                ? 'hsla(35, 80%, 60%, 0.8)'
                : 'hsla(35, 60%, 70%, 0.5)',
              boxShadow: p.size > 2 ? `0 0 ${p.size * 3}px hsla(35, 80%, 55%, 0.3)` : 'none',
              '--dx': `${-20 + Math.random() * 40}px`,
              '--dy': `${-30 + Math.random() * 60}px`,
              '--p-op': p.opacity,
              animation: `entryParticleDrift ${p.duration}s ${p.delay}s ease-in-out infinite`,
              opacity: 0,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex flex-col items-center gap-5 relative z-10">
        {/* Logo */}
        {phase !== 'particles' && (
          <img
            src={logo}
            alt=""
            className="w-28 h-28 md:w-36 md:h-36 object-contain"
            style={{
              animation: 'entryLogoReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              filter: 'drop-shadow(0 0 40px hsla(35, 80%, 50%, 0.4))',
            }}
          />
        )}

        {/* Brand name */}
        {(phase === 'text' || phase === 'exit') && (
          <div className="flex flex-col items-center gap-3">
            <h1
              className="text-4xl md:text-6xl font-display font-bold"
              style={{
                color: 'hsla(35, 80%, 60%, 1)',
                animation: 'entryTextSlide 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                textShadow: '0 0 40px hsla(35, 80%, 50%, 0.3)',
              }}
            >
              {isRTL ? "מזון האושר" : "Mazon HaOsher"}
            </h1>

            {/* Expanding line */}
            <div
              className="h-px w-48 md:w-64"
              style={{
                background: 'linear-gradient(90deg, transparent, hsla(35, 80%, 55%, 0.6), transparent)',
                animation: 'entryLineExpand 0.8s 0.2s cubic-bezier(0.16, 1, 0.3, 1) both',
                transformOrigin: 'center',
              }}
            />

            {/* Subtitle */}
            <p
              className="text-xs md:text-sm font-body tracking-widest uppercase"
              style={{
                color: 'hsla(35, 60%, 70%, 0.6)',
                animation: 'entrySubFade 0.8s 0.4s ease-out both',
              }}
            >
              {isRTL ? "עוגיות בוטיק בעבודת יד" : "Handcrafted Boutique Cookies"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CinematicEntry;
