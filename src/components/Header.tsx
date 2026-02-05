import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

// SVG icons as components with inline styles to match footer icons
const HomeIcon = () => (
  <svg style={{ width: '14px', height: '14px', color: 'white' }} className="md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const GiftIcon = () => (
  <svg style={{ width: '14px', height: '14px', color: 'white' }} className="md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="8" width="18" height="4" rx="1"/>
    <path d="M12 8v13"/>
    <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/>
    <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>
  </svg>
);

const StarIcon = () => (
  <svg style={{ width: '14px', height: '14px', color: 'white' }} className="md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const CircleHelpIcon = () => (
  <svg style={{ width: '14px', height: '14px', color: 'white' }} className="md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <path d="M12 17h.01"/>
  </svg>
);

const UsersIcon = () => (
  <svg style={{ width: '14px', height: '14px', color: 'white' }} className="md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const CookieIcon = () => (
  <svg style={{ width: '14px', height: '14px', color: 'white' }} className="md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/>
    <path d="M8.5 8.5v.01"/>
    <path d="M16 15.5v.01"/>
    <path d="M12 12v.01"/>
    <path d="M11 17v.01"/>
    <path d="M7 14v.01"/>
  </svg>
);

// Gradient styles for nav items
const navGradients = {
  home: { background: 'linear-gradient(to bottom right, #f97316, #ea580c)' },
  cookies: { background: 'linear-gradient(to bottom right, #a855f7, #7c3aed)' },
  packages: { background: 'linear-gradient(to bottom right, #ec4899, #db2777)' },
  reviews: { background: 'linear-gradient(to bottom right, #f59e0b, #d97706)' },
  faq: { background: 'linear-gradient(to bottom right, #3b82f6, #2563eb)' },
  contact: { background: 'linear-gradient(to bottom right, #10b981, #059669)' },
};

const Header = () => {
  const { isRTL } = useLanguage();
  const [activeSection, setActiveSection] = useState<string>("hero");

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
      id: "cookies",
      labelKey: "nav.cookies",
      label: isRTL ? "קולקציה" : "Collection",
      icon: CookieIcon,
      gradientStyle: navGradients.cookies,
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
      id: "contact",
      labelKey: "nav.contact",
      label: isRTL ? "צור קשר" : "Contact",
      icon: UsersIcon,
      gradientStyle: navGradients.about,
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Safe area background - solid color to match theme-color */}
      <div className="absolute inset-x-0 top-0 h-[env(safe-area-inset-top)] bg-background" />
      <div className="flex items-center justify-center px-2 py-1 pt-[calc(0.25rem+env(safe-area-inset-top))] bg-background border-b border-amber-500/30">
        {/* Navigation bar */}
        <nav className="flex items-center gap-1">
          {/* Navigation items - matching footer sizing */}
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`p-2.5 rounded-full shadow-md hover:scale-105 transition-all duration-300 ${
                  isActive ? "ring-2 ring-amber-500/50" : ""
                }`}
                style={item.gradientStyle}
                aria-label={item.label}
              >
                <item.icon />
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;