import { User, LogOut, Package, ChevronDown, Gift, Star, CircleHelp, Users, Home, UserPen, Lock, Cookie, UserCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useProfile } from "@/contexts/ProfileContext";

import ThemeToggle from "./ThemeToggle";
import AuthModal from "./AuthModal";
import EditProfileModal from "./EditProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";

const Header = () => {
  const { profile, isLoggedIn, logout, user } = useProfile();
  const [scrolled, setScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      // Detect active section
      const sections = ["hero", "cookies", "gift-packages", "reviews", "faq", "about"];
      let current = "";
      
      // Check if at top of page
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

  // Close auth modal immediately after a successful login (incl. OAuth hash flow)
  useEffect(() => {
    if (isLoggedIn && authModalOpen) {
      setAuthModalOpen(false);
    }
  }, [isLoggedIn, authModalOpen]);

  const handleLogout = async () => {
    await logout();
  };

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

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0];
  const firstName = displayName?.split(" ")[0] || "";

  const navItems = [
    { id: "hero", label: "בית", icon: Home, color: "text-blue-500" },
    { id: "gift-packages", label: "מארזים", icon: Gift, color: "text-pink-500" },
    { id: "reviews", label: "ביקורות", icon: Star, color: "text-yellow-500" },
    { id: "faq", label: "שאלות", icon: CircleHelp, color: "text-green-500" },
    { id: "about", label: "אודות", icon: Users, color: "text-purple-500" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/30">
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
                    ? "bg-primary/10" 
                    : "hover:bg-muted/50"
                }`}
              >
                <IconComponent className={`w-4 h-4 md:w-[18px] md:h-[18px] transition-all duration-300 ${item.color} ${
                  isActive ? "scale-110" : "group-hover:scale-105"
                }`} />
                <span className={`text-[9px] md:text-[11px] font-medium ${isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>{item.label}</span>
              </button>
            );
          })}

          {/* Theme Toggle */}
          <ThemeToggle />
          {/* Auth Button */}
          {isLoggedIn ? (
            <DropdownMenu dir="rtl">
              <DropdownMenuTrigger asChild>
                <button className="flex flex-col items-center gap-0.5 px-2 md:px-3 py-1 md:py-1.5 transition-all duration-300 rounded-lg bg-primary/10">
                  <UserCircle className="w-4 h-4 md:w-[18px] md:h-[18px] text-orange-500" />
                  {firstName && <span className="text-[9px] md:text-[11px] font-medium text-foreground">{firstName}</span>}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-48 rounded-xl shadow-xl border-border/50 bg-background/90 animate-scale-in text-sm text-right [direction:rtl]"
              >
                <div className="px-2.5 py-1.5 bg-primary/5 rounded-t-lg text-right">
                  <p className="text-xs font-medium text-foreground">{displayName || "שלום!"}</p>
                  <p className="text-[10px] text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => scrollToSection("order-history")}
                  className="gap-2 cursor-pointer hover:bg-primary/10 text-xs py-1.5 justify-start"
                >
                  <Package className="w-3.5 h-3.5 text-primary" />
                  <span>ההזמנות שלי</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowEditProfileModal(true)}
                  className="gap-2 cursor-pointer hover:bg-primary/10 text-xs py-1.5 justify-start"
                >
                  <UserPen className="w-3.5 h-3.5 text-primary" />
                  <span>עריכת פרופיל</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowChangePasswordModal(true)}
                  className="gap-2 cursor-pointer hover:bg-primary/10 text-xs py-1.5 justify-start"
                >
                  <Lock className="w-3.5 h-3.5 text-primary" />
                  <span>שינוי סיסמה</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="gap-2 cursor-pointer hover:bg-muted/50 text-xs py-1.5 justify-start"
                >
                  <LogOut className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>התנתקות</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className={`flex flex-col items-center gap-0.5 px-2 md:px-3 py-1 md:py-1.5 transition-all duration-300 rounded-lg group ${
                authModalOpen
                  ? "bg-primary/10"
                  : "hover:bg-muted/50"
              }`}
            >
              <UserCircle className={`w-4 h-4 md:w-[18px] md:h-[18px] text-orange-500 transition-all duration-300 ${authModalOpen ? "scale-110" : "group-hover:scale-105"}`} />
              <span className={`text-[9px] md:text-[11px] font-medium ${authModalOpen ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>כניסה</span>
            </button>
          )}
        </nav>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      {/* Edit Profile Modal */}
      <EditProfileModal 
        isOpen={showEditProfileModal} 
        onClose={() => setShowEditProfileModal(false)} 
      />

      {/* Change Password Modal */}
      <ChangePasswordModal 
        isOpen={showChangePasswordModal} 
        onClose={() => setShowChangePasswordModal(false)} 
      />
    </header>
  );
};

export default Header;
