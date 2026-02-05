import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

// SVG icon with inline styles to prevent Tailwind purging
const ChevronDownIcon = () => (
  <svg style={{ width: '24px', height: '24px', color: 'white' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

const scrollButtonGradient = { background: 'linear-gradient(to bottom right, #f59e0b, #ea580c)' };

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
        "fixed bottom-[5.25rem] md:bottom-[5.5rem] z-40 w-10 h-10 rounded-full",
        "text-white shadow-lg",
        "flex items-center justify-center",
        "hover:bg-amber-600 transition-colors duration-200",
        isRTL ? "left-4" : "right-4"
      )}
      style={scrollButtonGradient}
      aria-label={isRTL ? "גלול למטה" : "Scroll down"}
    >
      <ChevronDownIcon />
    </button>
  );
};

export default ScrollDownButton;