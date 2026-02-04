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
    const headerOffset = 80;
    
    // Find the next section below current scroll position
    for (const sectionId of sections) {
      const section = document.getElementById(sectionId);
      if (section) {
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        if (sectionTop > scrollY + headerOffset + 50) {
          window.scrollTo({
            top: sectionTop - headerOffset,
            behavior: "smooth"
          });
          return;
        }
      }
    }
    
    // If no section found, scroll to footer
    const footer = document.querySelector("footer");
    if (footer) {
      window.scrollTo({
        top: footer.getBoundingClientRect().top + window.scrollY - headerOffset,
        behavior: "smooth"
      });
    }
  };

  return (
    <button
      onClick={scrollToNextSection}
      className={cn(
        "fixed bottom-[6.5rem] z-40 w-10 h-10 rounded-full",
        "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg",
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