import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const sections = [
  "cookies",
  "gift-packages", 
  "order-history",
  "reviews",
  "faq",
  "newsletter",
  "about",
  "contact"
];

const ScrollDownButton = () => {
  const { isRTL } = useLanguage();
  
  const scrollToNextSection = () => {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    
    // Find the next section below current scroll position
    for (const sectionId of sections) {
      const section = document.getElementById(sectionId);
      if (section) {
        const sectionTop = section.offsetTop;
        if (sectionTop > scrollY + 100) {
          section.scrollIntoView({ behavior: "smooth" });
          return;
        }
      }
    }
    
    // If no section found, scroll to footer
    const footer = document.querySelector("footer");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <button
      onClick={scrollToNextSection}
      className={cn(
        "fixed bottom-14 z-40 w-10 h-10 rounded-full",
        "bg-amber-500 text-white shadow-lg",
        "flex items-center justify-center",
        "hover:bg-amber-600 transition-colors duration-200",
        isRTL ? "left-4" : "right-4"
      )}
      aria-label={isRTL ? "גלול למטה" : "Scroll down"}
    >
      <ChevronDown className="w-6 h-6" />
    </button>
  );
};

export default ScrollDownButton;