import { useState, useEffect, useMemo } from "react";
import logo from "@/assets/logo.png";
import { useLanguage } from "@/contexts/LanguageContext";

const CinematicEntry = ({ onComplete }: { onComplete: () => void }) => {
  const { isRTL } = useLanguage();
  const [phase, setPhase] = useState<'lines' | 'logo' | 'name' | 'reveal' | 'done'>('lines');

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('logo'), 800),
      setTimeout(() => setPhase('name'), 2000),
      setTimeout(() => setPhase('reveal'), 3500),
      setTimeout(() => { setPhase('done'); onComplete(); }, 4500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const goldenLines = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      angle: (i * 30),
      delay: i * 0.06,
      length: 60 + Math.random() * 40,
    })), []
  );

  if (phase === 'done') return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center"
      style={{
        background: 'hsl(25, 20%, 8%)',
        animation: phase === 'reveal' ? 'entryBlurReveal 1s cubic-bezier(0.4,0,0.2,1) forwards' : undefined,
      }}
    >
      <style>{`
        @keyframes entryBlurReveal {
          0% { opacity: 1; filter: blur(0px); }
          60% { opacity: 0.6; filter: blur(20px); transform: scale(1.1); }
          100% { opacity: 0; filter: blur(40px); transform: scale(1.3); pointer-events: none; }
        }
        @keyframes goldenLineIn {
          0% { transform: scaleX(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: scaleX(1); opacity: 0.6; }
        }
        @keyframes goldenLineOut {
          0% { transform: scaleX(1); opacity: 0.6; }
          100% { transform: scaleX(0); opacity: 0; }
        }
        @keyframes entryLogoIn {
          0% { transform: scale(0.3) rotate(-10deg); opacity: 0; filter: blur(15px); }
          60% { transform: scale(1.08) rotate(2deg); opacity: 1; filter: blur(0); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; filter: blur(0); }
        }
        @keyframes entryNameReveal {
          0% { opacity: 0; letter-spacing: 0.5em; filter: blur(8px); }
          50% { opacity: 1; filter: blur(2px); }
          100% { opacity: 1; letter-spacing: 0.15em; filter: blur(0); }
        }
        @keyframes entryNameGlow {
          0%, 100% { text-shadow: 0 0 10px hsla(40,90%,55%,0.3), 0 0 30px hsla(40,90%,55%,0.1); }
          50% { text-shadow: 0 0 30px hsla(40,90%,55%,0.8), 0 0 60px hsla(40,90%,55%,0.4), 0 0 100px hsla(40,90%,55%,0.2); }
        }
        @keyframes entrySubtitle {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 0.7; transform: translateY(0); }
        }
        @keyframes entryLinePulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        @keyframes entrySparkBurst {
          0% { transform: scale(0); opacity: 1; }
          50% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>

      {/* Golden radiating lines */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {goldenLines.map((line) => (
          <div
            key={line.id}
            className="absolute"
            style={{
              width: `${line.length}%`,
              height: '1px',
              transform: `rotate(${line.angle}deg)`,
              transformOrigin: 'center',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                background: `linear-gradient(90deg, transparent, hsla(40,90%,55%,0.6), hsla(40,90%,65%,0.8), hsla(40,90%,55%,0.6), transparent)`,
                transformOrigin: 'left center',
                animation: phase === 'lines'
                  ? `goldenLineIn 0.8s ${line.delay}s cubic-bezier(0.16,1,0.3,1) forwards`
                  : phase === 'logo' || phase === 'name'
                  ? `entryLinePulse 2s ${line.delay}s ease-in-out infinite`
                  : 'none',
                opacity: phase === 'lines' ? 0 : undefined,
              }}
            />
          </div>
        ))}
      </div>

      {/* Spark burst behind logo */}
      {(phase === 'logo' || phase === 'name' || phase === 'reveal') && (
        <div
          className="absolute rounded-full"
          style={{
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, hsla(40,90%,55%,0.15) 0%, hsla(40,90%,55%,0.05) 40%, transparent 70%)',
            animation: 'entrySparkBurst 1.5s cubic-bezier(0.16,1,0.3,1) forwards',
          }}
        />
      )}

      {/* Logo */}
      <div className="flex flex-col items-center gap-6 relative z-10">
        {(phase === 'logo' || phase === 'name' || phase === 'reveal') && (
          <img
            src={logo}
            alt=""
            className="w-32 h-32 md:w-40 md:h-40 object-contain"
            style={{
              animation: 'entryLogoIn 1s cubic-bezier(0.16,1,0.3,1) forwards',
              filter: 'drop-shadow(0 0 30px hsla(40,90%,55%,0.5))',
            }}
          />
        )}

        {/* Brand name with letter-spacing reveal */}
        {(phase === 'name' || phase === 'reveal') && (
          <div className="flex flex-col items-center gap-3">
            <h1
              className="text-3xl md:text-5xl font-display font-bold"
              style={{
                color: 'hsla(40,85%,70%,1)',
                animation: 'entryNameReveal 1.2s cubic-bezier(0.16,1,0.3,1) forwards, entryNameGlow 3s ease-in-out 1.2s infinite',
              }}
            >
              {isRTL ? "מזון האושר" : "Mazon HaOsher"}
            </h1>

            {/* Decorative golden line under name */}
            <div
              className="h-px w-0"
              style={{
                background: 'linear-gradient(90deg, transparent, hsla(40,90%,55%,0.8), transparent)',
                animation: 'goldenLineIn 0.8s 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
                width: '200px',
                transformOrigin: 'center',
              }}
            />

            <p
              className="text-sm md:text-base font-light tracking-widest uppercase"
              style={{
                color: 'hsla(40,70%,70%,0.7)',
                opacity: 0,
                animation: 'entrySubtitle 0.8s 0.6s ease-out forwards',
              }}
            >
              {isRTL ? "עוגיות בוטיק בעבודת יד" : "Handcrafted Boutique Cookies"}
            </p>
          </div>
        )}
      </div>

      {/* Corner golden accents */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t border-l" style={{ borderColor: 'hsla(40,90%,55%,0.3)', opacity: 0, animation: phase !== 'lines' ? 'entrySubtitle 0.5s 0.2s forwards' : 'none' }} />
      <div className="absolute top-8 right-8 w-16 h-16 border-t border-r" style={{ borderColor: 'hsla(40,90%,55%,0.3)', opacity: 0, animation: phase !== 'lines' ? 'entrySubtitle 0.5s 0.3s forwards' : 'none' }} />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-b border-l" style={{ borderColor: 'hsla(40,90%,55%,0.3)', opacity: 0, animation: phase !== 'lines' ? 'entrySubtitle 0.5s 0.4s forwards' : 'none' }} />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r" style={{ borderColor: 'hsla(40,90%,55%,0.3)', opacity: 0, animation: phase !== 'lines' ? 'entrySubtitle 0.5s 0.5s forwards' : 'none' }} />
    </div>
  );
};

export default CinematicEntry;
