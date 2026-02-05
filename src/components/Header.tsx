import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

// SVG icons as components with inline styles to match footer icons
const HomeIcon = () => (
  <svg style={{ width: '16px', height: '16px', color: 'white' }} className="md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const GiftIcon = () => (
  <svg style={{ width: '16px', height: '16px', color: 'white' }} className="md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="8" width="18" height="4" rx="1"/>
    <path d="M12 8v13"/>
    <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/>
    <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>
  </svg>
);

const StarIcon = () => (
  <svg style={{ width: '16px', height: '16px', color: 'white' }} className="md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const CircleHelpIcon = () => (
  <svg style={{ width: '16px', height: '16px', color: 'white' }} className="md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <path d="M12 17h.01"/>
  </svg>
);

const UsersIcon = () => (
  <svg style={{ width: '16px', height: '16px', color: 'white' }} className="md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const HeartIcon = () => (
  <svg style={{ width: '12px', height: '12px', color: '#ef4444', fill: '#ef4444' }} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
  </svg>
);

// Gradient styles for nav items
const navGradients = {
  home: { background: 'linear-gradient(to bottom right, #f97316, #d97706)' },
  packages: { background: 'linear-gradient(to bottom right, #ec4899, #e11d48)' },
  reviews: { background: 'linear-gradient(to bottom right, #f59e0b, #ea580c)' },
  faq: { background: 'linear-gradient(to bottom right, #0ea5e9, #0891b2)' },
  about: { background: 'linear-gradient(to bottom right, #10b981, #0d9488)' },
};

// Typewriter hook for "Made with love" effect
const useTypewriter = (text: string, speed: number = 100, pauseTime: number = 2000) => {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (!isDeleting && displayText === text) {
      // Pause before deleting
      timeout = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && displayText === '') {
      // Pause before typing again
      timeout = setTimeout(() => setIsDeleting(false), 500);
    } else if (isDeleting) {
      // Delete characters
      timeout = setTimeout(() => {
        setDisplayText(text.substring(0, displayText.length - 1));
      }, speed / 2);
    } else {
      // Type characters
      timeout = setTimeout(() => {
        setDisplayText(text.substring(0, displayText.length + 1));
      }, speed);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, text, speed, pauseTime]);

  return displayText;
};

const Header = () => {
  const { isRTL } = useLanguage();
  const [activeSection, setActiveSection] = useState<string>("hero");
  
  const madeWithLoveText = isRTL ? "מיוצר באהבה" : "Made with love";
  const typewriterText = useTypewriter(madeWithLoveText, 100, 2000);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "cookies", "gift-packages", "reviews", "faq", "about"];
      let current = "";
      
      if (window.scrollY < 100) {
        current = "hero";
      } else {
        for (const sectionId of sections) {
          if (sectionId === "hero") continue;
          const section = document.getElementById(sectionId);
          if (section) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 150 && rect.bottom >= 150) {
              current = sectionId;
              break;
            }
          }
        }
      }
      setActiveSection(current);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (sectionId === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItems = [
    {
      id: "hero",
      labelKey: "nav.home",
      label: isRTL ? "בית" : "Home",
      icon: HomeIcon,
      gradientStyle: navGradients.home,
    },
    {
      id: "gift-packages",
      labelKey: "gift.title",
      label: isRTL ? "מארזים" : "Packages",
      icon: GiftIcon,
      gradientStyle: navGradients.packages,
    },
    {
      id: "reviews",
      labelKey: "nav.reviews",
      label: isRTL ? "ביקורות" : "Reviews",
      icon: StarIcon,
      gradientStyle: navGradients.reviews,
    },
    {
      id: "faq",
      labelKey: "nav.faq",
      label: isRTL ? "שאלות" : "FAQ",
      icon: CircleHelpIcon,
      gradientStyle: navGradients.faq,
    },
    {
      id: "about",
      labelKey: "nav.about",
      label: isRTL ? "אודות" : "About",
      icon: UsersIcon,
      gradientStyle: navGradients.about,
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Safe area background - solid color to match theme-color */}
      <div className="absolute inset-x-0 top-0 h-[env(safe-area-inset-top)] bg-background" />
      <div className="flex items-center justify-center px-1 py-0.5 md:py-1 pt-[calc(0.125rem+env(safe-area-inset-top))] bg-background border-b border-amber-500/30">
        {/* Navigation bar */}
        <nav className="flex items-center gap-0">
          {/* Navigation items - matching footer sizing */}
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <div key={item.id} className="w-14 md:w-20 flex justify-center">
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`flex flex-col items-center gap-0.5 py-0.5 transition-all duration-300 rounded-lg group px-2 ${
                    isActive 
                      ? "bg-amber-500/20" 
                      : "hover:bg-muted"
                  }`}
                >
                  <div 
                    className={`p-1.5 md:p-2 rounded-xl transition-all duration-300 shadow-md ${
                    isActive ? "scale-110" : "group-hover:scale-105"
                    }`}
                    style={item.gradientStyle}
                  >
                    <item.icon />
                  </div>
                  <span className={`text-[10px] md:text-xs font-medium ${isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>{item.label}</span>
                </button>
              </div>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;