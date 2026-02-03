import { Gift, Star, CircleHelp, Users, Home, UserCircle, LogOut, Package, UserPen, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfile } from "@/contexts/ProfileContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AuthModal from "./AuthModal";
import EditProfileModal from "./EditProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";

const Header = () => {
  const { t, isRTL } = useLanguage();
  const { profile, isLoggedIn, logout, user } = useProfile();
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0];

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

  const handleLogout = async () => {
    await logout();
  };

  const navItems = [
    { id: "hero", labelKey: "nav.home", label: isRTL ? "בית" : "Home", icon: Home, gradient: "from-orange-500 to-amber-600" },
    { id: "gift-packages", labelKey: "gift.title", label: isRTL ? "מארזים" : "Packages", icon: Gift, gradient: "from-purple-500 to-violet-600" },
    { id: "reviews", labelKey: "nav.reviews", label: isRTL ? "ביקורות" : "Reviews", icon: Star, gradient: "from-amber-500 to-orange-600" },
    { id: "faq", labelKey: "nav.faq", label: isRTL ? "שאלות" : "FAQ", icon: CircleHelp, gradient: "from-sky-500 to-cyan-600" },
    { id: "about", labelKey: "nav.about", label: isRTL ? "אודות" : "About", icon: Users, gradient: "from-emerald-500 to-teal-600" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-amber-500/30">
        {/* Safe area background - solid color to match theme-color */}
        <div className="absolute inset-x-0 top-0 h-[env(safe-area-inset-top)] bg-background" />
        <div className="flex items-center justify-between px-2 py-1.5 md:py-2 pt-[calc(0.375rem+env(safe-area-inset-top))] bg-background">
          {/* Left side - Login/Account button */}
          <div className="flex items-center">
            {isLoggedIn ? (
              <DropdownMenu dir={isRTL ? "rtl" : "ltr"}>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 md:py-2 transition-all duration-300 rounded-lg group hover:bg-muted/50">
                    <div className="p-1 md:p-1.5 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-md transition-all duration-300 group-hover:scale-105">
                      <UserCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-white fill-white/20" />
                    </div>
                    <span className="text-[10px] md:text-xs font-medium text-muted-foreground group-hover:text-foreground">
                      {isRTL ? "חשבון" : "Account"}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  side="bottom"
                  className={`w-48 rounded-xl shadow-xl border-border/50 bg-background animate-scale-in text-sm ${isRTL ? 'text-right [direction:rtl]' : 'text-left [direction:ltr]'}`}
                >
                  <div className={`px-2.5 py-1.5 bg-cyan-500/10 rounded-t-lg ${isRTL ? 'text-right' : 'text-left'}`}>
                    <p className="text-xs font-medium text-foreground">{displayName || (isRTL ? "שלום!" : "Hello!")}</p>
                    <p className="text-[10px] text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => scrollToSection("order-history")}
                    className="gap-2 cursor-pointer hover:bg-amber-500/10 text-xs py-1.5 justify-start"
                  >
                    <Package className="w-3.5 h-3.5 text-amber-500" />
                    <span>{t('nav.orderHistory')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setShowEditProfileModal(true)}
                    className="gap-2 cursor-pointer hover:bg-emerald-500/10 text-xs py-1.5 justify-start"
                  >
                    <UserPen className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{t('nav.editProfile')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setShowChangePasswordModal(true)}
                    className="gap-2 cursor-pointer hover:bg-purple-500/10 text-xs py-1.5 justify-start"
                  >
                    <Lock className="w-3.5 h-3.5 text-purple-500" />
                    <span>{t('profile.changePassword')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="gap-2 cursor-pointer hover:bg-red-500/10 text-xs py-1.5 justify-start"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-500" />
                    <span>{t('nav.logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 md:py-2 transition-all duration-300 rounded-lg group hover:bg-muted/50"
              >
                <div className="p-1 md:p-1.5 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-md transition-all duration-300 group-hover:scale-105">
                  <UserCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-white fill-white/20" />
                </div>
                <span className="text-[10px] md:text-xs font-medium text-muted-foreground group-hover:text-foreground">
                  {isRTL ? "התחברות" : "Login"}
                </span>
              </button>
            )}
          </div>

          {/* Center - Navigation bar */}
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
                  <div className={`p-1 md:p-1.5 rounded-xl transition-all duration-300 bg-gradient-to-br ${item.gradient} shadow-md ${
                    isActive ? "scale-110" : "group-hover:scale-105"
                  }`}>
                    <IconComponent className="w-3.5 h-3.5 md:w-4 md:h-4 text-white fill-white/20" />
                  </div>
                  <span className={`text-[9px] md:text-[11px] font-medium ${isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right side - Empty for balance */}
          <div className="w-[80px] md:w-[100px]"></div>
        </div>
      </header>

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
    </>
  );
};

export default Header;