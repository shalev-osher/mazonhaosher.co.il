import { useEffect, useRef, useState } from "react";

interface SpotlightCursorProps {
  enabled?: boolean;
}

/**
 * Renders a soft golden halo that follows the mouse on desktop.
 * Hidden on touch devices and when reduced-motion is preferred.
 */
const SpotlightCursor = ({ enabled = true }: SpotlightCursorProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setActive(true);
    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const tick = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      if (ref.current) {
        ref.current.style.transform = `translate3d(${cx - 250}px, ${cy - 250}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!active) return null;
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="fixed top-0 left-0 pointer-events-none z-[9998] mix-blend-screen will-change-transform"
      style={{
        width: 500,
        height: 500,
        background:
          "radial-gradient(circle, hsla(40,90%,60%,0.18) 0%, hsla(40,90%,55%,0.08) 30%, transparent 65%)",
        filter: "blur(10px)",
      }}
    />
  );
};

export default SpotlightCursor;
