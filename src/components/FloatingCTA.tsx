import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Floating Call-To-Action button.
 * Appears after scrolling past the hero, hides at top and near footer.
 * Direct WhatsApp link — no popups.
 */
const FloatingCTA = () => {
  const { isRTL, language } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const viewport = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const nearBottom = scrollY + viewport >= docHeight - 200;
      // Show after scrolling 60% of viewport, hide near bottom
      setVisible(scrollY > viewport * 0.6 && !nearBottom);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const labels: Record<string, string> = {
    he: "הזמנה מהירה",
    en: "Quick Order",
    ar: "طلب سريع",
    ru: "Быстрый заказ",
    es: "Pedido rápido",
  };

  return (
    <a
      href="https://wa.me/972546791198"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={labels[language] || labels.en}
      className={`fixed z-[60] bottom-24 ${isRTL ? "left-5" : "right-5"} flex items-center gap-2 px-5 py-3 rounded-full font-medium text-sm shadow-2xl transition-all duration-500 ease-out ${
        visible
          ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
          : "opacity-0 translate-y-6 scale-90 pointer-events-none"
      }`}
      style={{
        background: "linear-gradient(135deg, hsl(45, 95%, 60%) 0%, hsl(35, 85%, 45%) 100%)",
        color: "hsl(25, 30%, 12%)",
        boxShadow:
          "0 10px 40px hsla(40, 90%, 50%, 0.45), 0 0 0 1px hsla(45, 95%, 70%, 0.3) inset",
        animation: visible ? "ctaFloat 3s ease-in-out infinite" : "none",
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487 2.981 1.286 2.981.857 3.518.804.537-.054 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
      </svg>
      <span>{labels[language] || labels.en}</span>
      <style>{`
        @keyframes ctaFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </a>
  );
};

export default FloatingCTA;
