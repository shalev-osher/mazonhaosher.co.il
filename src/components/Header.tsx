import { Gift, Star, CircleHelp, Users, Home, Heart } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

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
    { id: "hero", labelKey: "nav.home", label: isRTL ? "בית" : "Home", icon: Home, gradient: "from-orange-500 to-amber-600" },
    { id: "gift-packages", labelKey: "gift.title", label: isRTL ? "מארזים" : "Packages", icon: Gift, gradient: "from-pink-500 to-rose-600" },
    { id: "reviews", labelKey: "nav.reviews", label: isRTL ? "ביקורות" : "Reviews", icon: Star, gradient: "from-amber-500 to-orange-600" },
    { id: "faq", labelKey: "nav.faq", label: isRTL ? "שאלות" : "FAQ", icon: CircleHelp, gradient: "from-sky-500 to-cyan-600" },
    { id: "about", labelKey: "nav.about", label: isRTL ? "אודות" : "About", icon: Users, gradient: "from-emerald-500 to-teal-600" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Safe area background - solid color to match theme-color */}
      <div className="absolute inset-x-0 top-0 h-[env(safe-area-inset-top)] bg-background" />
      <div className="flex items-center justify-center px-1 py-0.5 md:py-1 pt-[calc(0.125rem+env(safe-area-inset-top))] bg-background border-b border-amber-500/30">
        {/* Navigation bar */}
        <nav className="flex items-center gap-0">
          {/* Navigation items */}
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`flex flex-col items-center gap-0 px-1.5 md:px-2.5 py-0.5 md:py-1 transition-all duration-300 rounded-lg group ${
                  isActive 
                    ? "bg-amber-500/20" 
                    : "hover:bg-muted"
                }`}
              >
                <div className={`p-1 md:p-1.5 rounded-xl transition-all duration-300 bg-gradient-to-br ${item.gradient} shadow-md ${
                  isActive ? "scale-110" : "group-hover:scale-105"
                }`}>
                  <IconComponent className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                </div>
                <span className={`text-[9px] md:text-[11px] font-medium ${isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      {/* Made with love typewriter */}
      <div className="bg-amber-100 dark:bg-amber-900/50 border-b border-amber-500/20">
        <div className="flex items-center justify-center py-0.5">
          <span className="text-[10px] md:text-xs text-muted-foreground">
            {typewriterText}
          </span>
          <Heart className="w-3 h-3 text-red-500 fill-red-500 ml-1 rtl:ml-0 rtl:mr-1" />
        </div>
      </div>
    </header>
  );
};

export default Header;