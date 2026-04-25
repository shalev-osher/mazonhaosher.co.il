import { useState, useEffect, useCallback } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { hapticLight } from "@/lib/haptic";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const [atTop, setAtTop] = useState(true);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    setVisible(docHeight > 100);
    setAtBottom(docHeight > 0 && scrollY >= docHeight - 4);
    setAtTop(scrollY < 4);
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
      className={`fixed bottom-20 right-4 z-40 flex flex-col
        rounded-full border border-primary/40 bg-background/60 backdrop-blur-sm
        shadow-warm overflow-hidden
        transition-all duration-500 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"}`}
    >
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        disabled={atTop}
        className="w-11 h-11 flex items-center justify-center text-primary
          transition-colors duration-200
          hover:bg-primary/10 active:bg-primary/20
          disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
      >
        <ArrowUp size={18} strokeWidth={2} />
      </button>

      <div className="h-px bg-primary/40" aria-hidden="true" />

      <button
        onClick={scrollToBottom}
        aria-label="Scroll to bottom"
        disabled={atBottom}
        className="w-11 h-11 flex items-center justify-center text-primary
          transition-colors duration-200
          hover:bg-primary/10 active:bg-primary/20
          disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
      >
        <ArrowDown size={18} strokeWidth={2} />
      </button>
    </div>
  );
};

export default BackToTop;
