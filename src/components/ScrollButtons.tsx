import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

// SVG icons with inline styles
const ChevronUpIcon = () => (
  <svg style={{ width: '20px', height: '20px', color: 'white' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m18 15-6-6-6 6"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg style={{ width: '20px', height: '20px', color: 'white' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

const ScrollButtons = () => {
  const [showUp, setShowUp] = useState(false);
  const { isRTL } = useLanguage();

  useEffect(() => {
    const toggleVisibility = () => {
      setShowUp(window.scrollY > 400);
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToPreviousSection = () => {
    const scrollY = window.scrollY;
    const headerOffset = 80;
    
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
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToNextSection = () => {
    const scrollY = window.scrollY;
    const headerOffset = 80;
    
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
    
    const footer = document.querySelector("footer");
    if (footer) {
      window.scrollTo({
        top: footer.getBoundingClientRect().top + window.scrollY - headerOffset,
        behavior: "smooth"
      });
    }
  };

  return (
    <div 
      className={cn(
        "fixed bottom-[9.5rem] md:bottom-[10rem] z-40 flex flex-col rounded-full overflow-hidden shadow-lg",
        isRTL ? "right-4" : "left-4"
      )}
    >
      {/* Up button */}
      <button
        onClick={scrollToPreviousSection}
        className={cn(
          "w-10 h-10 flex items-center justify-center",
          "text-white hover:brightness-110 transition-all duration-200",
          showUp ? "opacity-100" : "opacity-0 pointer-events-none h-0"
        )}
        style={scrollButtonGradient}
        aria-label={isRTL ? "לסקשן הקודם" : "Previous section"}
      >
        <ChevronUpIcon />
      </button>
      
      {/* Down button */}
      <button
        onClick={scrollToNextSection}
        className={cn(
          "w-10 h-10 flex items-center justify-center",
          "text-white hover:brightness-110 transition-all duration-200"
        )}
        style={scrollButtonGradient}
        aria-label={isRTL ? "גלול למטה" : "Scroll down"}
      >
        <ChevronDownIcon />
      </button>
    </div>
  );
};

export default ScrollButtons;