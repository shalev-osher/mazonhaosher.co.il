import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-28 z-40 w-10 h-10 rounded-full",
        "bg-amber-500 text-white shadow-lg",
        "flex items-center justify-center",
        "hover:bg-amber-600 transition-colors duration-200",
        isRTL ? "left-4" : "right-4",
        isVisible 
          ? "opacity-100" 
          : "opacity-0 pointer-events-none"
      )}
      aria-label={isRTL ? "חזרה למעלה" : "Back to top"}
    >
      <ChevronUp className="w-6 h-6" />
    </button>
  );
};

export default ScrollToTop;
