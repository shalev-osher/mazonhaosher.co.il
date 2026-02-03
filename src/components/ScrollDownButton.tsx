import { ArrowDownCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ScrollDownButton = () => {
  const { isRTL } = useLanguage();
  
  const scrollToContent = () => {
    const cookiesSection = document.getElementById("cookies");
    if (cookiesSection) {
      cookiesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <button
      onClick={scrollToContent}
      className="fixed bottom-14 right-4 z-50 w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center hover:bg-amber-600 transition-all duration-300 hover:scale-110 group shadow-lg animate-bounce"
      aria-label={isRTL ? "גלול למטה" : "Scroll down"}
    >
      <ArrowDownCircle className="w-6 h-6 text-white" />
    </button>
  );
};

export default ScrollDownButton;