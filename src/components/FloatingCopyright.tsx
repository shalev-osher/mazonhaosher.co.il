import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

const FloatingCopyright = () => {
  const { isRTL } = useLanguage();
  const [visible, setVisible] = useState(true);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    // Delay entrance to match staggered reveal
    const timer = setTimeout(() => setEntered(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector("footer");
      if (!footer) {
        setVisible(true);
        return;
      }
      const footerRect = footer.getBoundingClientRect();
      const isFooterVisible = footerRect.top < window.innerHeight - 20;
      setVisible(!isFooterVisible);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <div className="flex items-center px-5 py-2 bg-background border border-border rounded-full shadow-sm">
        <span className="text-sm md:text-base font-medium text-muted-foreground">
          © {isRTL ? "מזון האושר" : "Mazon HaOsher"} 2026
        </span>
      </div>
    </div>
  );
};

export default FloatingCopyright;
