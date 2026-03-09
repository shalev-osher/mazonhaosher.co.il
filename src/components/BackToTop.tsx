import { useState, useEffect, useCallback } from "react";
import { ChevronUp } from "lucide-react";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    setVisible(scrollY > 400);
    setProgress(docHeight > 0 ? (scrollY / docHeight) * 100 : 0);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`fixed bottom-20 right-4 z-40 w-12 h-12 rounded-full
        bg-primary text-primary-foreground shadow-warm
        flex items-center justify-center
        transition-all duration-500 ease-out
        hover:scale-110 hover:shadow-elevated active:scale-95
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"}`}
    >
      {/* Progress ring */}
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
  );
};

export default BackToTop;
