import { useState, useEffect } from "react";
import logo from "@/assets/logo.png";

const CinematicPreloader = () => {
  const [phase, setPhase] = useState<"loading" | "reveal" | "done">("loading");

  useEffect(() => {
    // Phase 1: Show preloader for 1.8s
    const t1 = setTimeout(() => setPhase("reveal"), 1800);
    // Phase 2: Fade out over 0.6s, then remove
    const t2 = setTimeout(() => setPhase("done"), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center"
      aria-hidden="true"
      style={{
        background: "hsl(25, 20%, 6%)",
        opacity: phase === "reveal" ? 0 : 1,
        transition: "opacity 0.6s ease-out",
        pointerEvents: phase === "reveal" ? "none" : "auto",
      }}
    >
      <style>{`
        @keyframes preloaderSpin {
          0% { transform: scale(0.5) rotate(-10deg); opacity: 0; filter: blur(10px); }
          50% { transform: scale(1.05) rotate(5deg); opacity: 1; filter: blur(0); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; filter: blur(0); }
        }
        @keyframes preloaderGlow {
          0%, 100% { box-shadow: 0 0 30px hsla(40,90%,55%,0.2), 0 0 60px hsla(40,90%,55%,0.1); }
          50% { box-shadow: 0 0 50px hsla(40,90%,55%,0.4), 0 0 100px hsla(40,90%,55%,0.2); }
        }
        @keyframes preloaderBar {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
      `}</style>

      <div className="flex flex-col items-center gap-8">
        {/* Logo with cinematic entrance */}
        <div
          className="relative"
          style={{
            animation: "preloaderSpin 1.2s cubic-bezier(0.16,1,0.3,1) forwards",
          }}
        >
          <img
            src={logo}
            alt=""
            className="h-32 md:h-40 w-auto drop-shadow-2xl"
          />
          {/* Glow behind logo */}
          <div
            className="absolute inset-0 -z-10 rounded-full blur-3xl"
            style={{
              background: "radial-gradient(circle, hsla(40,90%,55%,0.3) 0%, transparent 70%)",
              animation: "preloaderGlow 2s ease-in-out infinite",
            }}
          />
        </div>

        {/* Progress bar */}
        <div className="w-40 h-0.5 rounded-full overflow-hidden bg-white/10">
          <div
            className="h-full rounded-full origin-left"
            style={{
              background: "linear-gradient(90deg, hsl(40,90%,55%), hsl(350,75%,55%))",
              animation: "preloaderBar 1.6s cubic-bezier(0.4,0,0.2,1) forwards",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CinematicPreloader;
