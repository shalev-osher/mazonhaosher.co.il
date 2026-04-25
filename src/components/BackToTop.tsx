import { useState, useEffect, useCallback } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { hapticLight } from "@/lib/haptic";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [atBottom, setAtBottom] = useState(false);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    setVisible(scrollY > 200 || docHeight > 100);
    setProgress(docHeight > 0 ? (scrollY / docHeight) * 100 : 0);
    setAtBottom(docHeight > 0 && scrollY >= docHeight - 4);
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [handleScroll]);

  const scrollToTop = () => {
    hapticLight();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    hapticLight();
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`fixed bottom-20 right-4 z-40 flex flex-col gap-0 rounded-full overflow-hidden shadow-warm
        transition-all duration-500 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"}`}
    >
      {/* Up button with progress ring */}
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className="relative w-12 h-12 bg-primary text-primary-foreground
          flex items-center justify-center
          transition-all duration-300
          hover:bg-primary/90 hover:shadow-elevated active:scale-95"
      >
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <circle
            cx="24" cy="24" r="22"
            fill="none"
            stroke="hsl(var(--primary-foreground) / 0.2)"
            strokeWidth="2"
          />
          <circle
            cx="24" cy="24" r="22"
            fill="none"
            stroke="hsl(var(--primary-foreground))"
            strokeWidth="2"
            strokeDasharray={`${2 * Math.PI * 22}`}
            strokeDashoffset={`${2 * Math.PI * 22 * (1 - progress / 100)}`}
            strokeLinecap="round"
            className="transition-all duration-150"
          />
        </svg>
        <ChevronUp size={20} className="relative z-10" />
      </button>

      {/* Divider */}
      <div className="h-px bg-primary-foreground/20" aria-hidden="true" />

      {/* Down button */}
      <button
        onClick={scrollToBottom}
        aria-label="Scroll to bottom"
        disabled={atBottom}
        className="relative w-12 h-12 bg-primary text-primary-foreground
          flex items-center justify-center
          transition-all duration-300
          hover:bg-primary/90 hover:shadow-elevated active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronDown size={20} className="relative z-10" />
      </button>
    </div>
  );
};

export default BackToTop;
