import { Gift, Star, CircleHelp, Users, Home } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "./LanguageToggle";

const Header = () => {
  const { t, isRTL } = useLanguage();
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
    { id: "hero", labelKey: "nav.home", label: isRTL ? "בית" : "Home", icon: Home, bgColor: "bg-orange-500/20", iconColor: "text-orange-500" },
    { id: "gift-packages", labelKey: "gift.title", label: isRTL ? "מארזים" : "Packages", icon: Gift, bgColor: "bg-teal-500/20", iconColor: "text-teal-500" },
    { id: "reviews", labelKey: "nav.reviews", label: isRTL ? "ביקורות" : "Reviews", icon: Star, bgColor: "bg-amber-500/20", iconColor: "text-amber-500" },
    { id: "faq", labelKey: "nav.faq", label: isRTL ? "שאלות" : "FAQ", icon: CircleHelp, bgColor: "bg-sky-500/20", iconColor: "text-sky-500" },
    { id: "about", labelKey: "nav.about", label: isRTL ? "אודות" : "About", icon: Users, bgColor: "bg-emerald-500/20", iconColor: "text-emerald-500" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-amber-500/30">
      {/* Safe area background - solid color to match theme-color */}
      <div className="absolute inset-x-0 top-0 h-[env(safe-area-inset-top)] bg-background" />
      <div className="flex items-center justify-center px-2 py-1.5 md:py-2 pt-[calc(0.375rem+env(safe-area-inset-top))] bg-background">
        {/* Navigation bar */}
        <nav className="flex items-center gap-0.5 md:gap-1">
          {/* Navigation items */}
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`flex flex-col items-center gap-0.5 px-2 md:px-3 py-1 md:py-1.5 transition-all duration-300 rounded-lg group ${
                  isActive 
                    ? "bg-amber-500/20" 
                    : "hover:bg-muted"
                }`}
              >
                <div className={`p-1 md:p-1.5 rounded-lg transition-all duration-300 ${item.bgColor} ${
                  isActive ? "scale-110" : "group-hover:scale-105"
                }`}>
                  <IconComponent className={`w-3.5 h-3.5 md:w-4 md:h-4 ${item.iconColor}`} />
                </div>
                <span className={`text-[9px] md:text-[11px] font-medium ${isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>{item.label}</span>
              </button>
            );
          })}

          {/* Language Toggle */}
          <LanguageToggle />
        </nav>
      </div>
    </header>
  );
};

export default Header;
