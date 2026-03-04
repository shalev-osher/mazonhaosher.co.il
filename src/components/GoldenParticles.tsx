import { useMemo } from "react";

const GoldenParticles = ({ count = 40 }: { count?: number }) => {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 4,
      duration: 6 + Math.random() * 8,
      delay: Math.random() * 10,
      driftX: -30 + Math.random() * 60,
      driftY: -40 + Math.random() * -60,
      opacity: 0.15 + Math.random() * 0.45,
    })), [count]
  );

  return (
    <div className="absolute inset-0 z-[3] pointer-events-none overflow-hidden">
      <style>{`
        @keyframes particleFloat {
          0% { transform: translate(0, 0) scale(1); opacity: 0; }
          10% { opacity: var(--p-opacity); }
          50% { transform: translate(calc(var(--drift-x) * 0.5), calc(var(--drift-y) * 0.5)) scale(1.2); opacity: var(--p-opacity); }
          90% { opacity: calc(var(--p-opacity) * 0.3); }
          100% { transform: translate(var(--drift-x), var(--drift-y)) scale(0.6); opacity: 0; }
        }
      `}</style>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            '--drift-x': `${p.driftX}px`,
            '--drift-y': `${p.driftY}px`,
            '--p-opacity': p.opacity,
            background: `radial-gradient(circle, hsla(40,90%,65%,0.9) 0%, hsla(40,85%,55%,0.4) 50%, transparent 100%)`,
            boxShadow: `0 0 ${p.size * 2}px hsla(40,90%,55%,0.5), 0 0 ${p.size * 4}px hsla(40,90%,55%,0.2)`,
            animation: `particleFloat ${p.duration}s ${p.delay}s ease-in-out infinite`,
            opacity: 0,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

export default GoldenParticles;
