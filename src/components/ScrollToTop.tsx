import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

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

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { isRTL } = useLanguage();

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToPreviousSection = () => {
    const scrollY = window.scrollY;
    const headerOffset = 80;
    
    // Find the previous section above current scroll position
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = document.getElementById(sections[i]);
      if (section) {
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        if (sectionTop < scrollY - 50) {
          window.scrollTo({
            top: sectionTop - headerOffset,
            behavior: "smooth"
          });
          return;
        }
      }
    }
    
    // If no previous section, scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToPreviousSection}
      className={cn(
        "fixed bottom-[9.5rem] md:bottom-[10rem] z-40 w-10 h-10 rounded-full",
        "bg-amber-500 text-white shadow-lg",
        "flex items-center justify-center",
        "hover:bg-amber-600 transition-colors duration-200",
        isRTL ? "left-4" : "right-4",
        isVisible 
          ? "opacity-100" 
          : "opacity-0 pointer-events-none"
      )}
      aria-label={isRTL ? "לסקשן הקודם" : "Previous section"}
    >
      <ChevronUp className="w-6 h-6" />
    </button>
  );
};

export default ScrollToTop;
