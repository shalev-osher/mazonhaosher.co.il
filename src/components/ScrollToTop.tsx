import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
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
        "fixed bottom-20 z-40 w-10 h-10 rounded-full",
        "bg-primary/90 text-primary-foreground shadow-lg",
        "flex items-center justify-center",
        "hover:bg-primary hover:scale-110 transition-all duration-300",
        "backdrop-blur-sm border border-primary/20",
        isRTL ? "left-4" : "right-4",
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-4 pointer-events-none"
      )}
      aria-label={isRTL ? "חזרה למעלה" : "Back to top"}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};

export default ScrollToTop;
