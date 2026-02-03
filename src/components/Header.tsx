import { User, KeyRound, LogOut, Package, ChevronDown, Crown, Gift, Star, HelpCircle, Heart, ShoppingBag, Smartphone, Home, Trash2, UserPen, Lock } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
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
import TrustedDevicesModal from "./TrustedDevicesModal";
import DeleteAccountModal from "./DeleteAccountModal";
import EditProfileModal from "./EditProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";

const Header = () => {
  const { profile, isLoggedIn, logout, user } = useProfile();
  const [scrolled, setScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showDevicesModal, setShowDevicesModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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

  const navItems = [
    { id: "hero", label: "ראשי", icon: Home },
    { id: "cookies", label: "הקולקציה שלנו", icon: Crown },
    { id: "gift-packages", label: "מארזי מתנה", icon: Gift },
    { id: "reviews", label: "ביקורות לקוחות", icon: Star },
    { id: "faq", label: "שאלות נפוצות", icon: HelpCircle },
    { id: "about", label: "אודותינו", icon: Heart },
  ];

  return (
    <header className={`fixed top-[env(safe-area-inset-top)] left-0 right-0 z-50 transition-all duration-500 bg-transparent ${
      scrolled ? "py-1" : "py-1.5"
    }`}>
      <div className="max-w-7xl mx-auto px-[max(0.75rem,env(safe-area-inset-left))]">
        <div className="flex items-center justify-between">

          {/* Navigation - All devices */}
          <TooltipProvider delayDuration={100}>
            <nav className="flex items-center gap-0.5">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => scrollToSection(item.id)}
                        className={`relative p-2 transition-all duration-300 rounded-lg group border ${
                          isActive 
                            ? "text-primary bg-primary/15 shadow-sm shadow-primary/20 border-primary/20" 
                            : "text-muted-foreground hover:text-primary hover:bg-primary/10 border-transparent hover:border-primary/20 bg-card/50"
                        }`}
                      >
                        <IconComponent className={`w-4 h-4 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent 
                      side="bottom" 
                      className="bg-background/95 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/5 px-3 py-1.5 text-xs font-medium"
                    >
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </nav>
          </TooltipProvider>

          {/* Right side - Cart + Theme Toggle + Auth */}
          <TooltipProvider delayDuration={100}>
            <div className="flex items-center gap-0.5">
              {/* Cart Button */}
              <CartHeaderButton />
              {/* Theme Toggle */}
              <ThemeToggle />
              {/* Auth Button */}
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="relative p-2 transition-all duration-300 rounded-lg group text-primary bg-primary/15 shadow-sm shadow-primary/20 border border-primary/20">
                      <User className="w-4 h-4 transition-transform duration-300 scale-110" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48 rounded-lg shadow-lg border-primary/20 animate-scale-in text-sm" dir="rtl">
                    <div className="px-2.5 py-1.5 bg-primary/5 rounded-t-lg text-right">
                      <p className="text-xs font-medium text-foreground">{displayName || "שלום!"}</p>
                      <p className="text-[10px] text-muted-foreground">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => scrollToSection("order-history")} className="flex-row-reverse gap-2 cursor-pointer hover:bg-primary/10 text-xs py-1.5">
                      <Package className="w-3.5 h-3.5 text-primary" />
                      ההזמנות שלי
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowEditProfileModal(true)} className="flex-row-reverse gap-2 cursor-pointer hover:bg-primary/10 text-xs py-1.5">
                      <UserPen className="w-3.5 h-3.5 text-primary" />
                      עריכת פרופיל
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowChangePasswordModal(true)} className="flex-row-reverse gap-2 cursor-pointer hover:bg-primary/10 text-xs py-1.5">
                      <Lock className="w-3.5 h-3.5 text-primary" />
                      שינוי סיסמה
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowDevicesModal(true)} className="flex-row-reverse gap-2 cursor-pointer hover:bg-primary/10 text-xs py-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-primary" />
                      מכשירים מהימנים
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowDeleteModal(true)} className="flex-row-reverse gap-2 text-destructive cursor-pointer hover:bg-destructive/10 text-xs py-1.5">
                      <Trash2 className="w-3.5 h-3.5" />
                      מחיקת חשבון
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="flex-row-reverse gap-2 text-destructive cursor-pointer hover:bg-destructive/10 text-xs py-1.5">
                      <LogOut className="w-3.5 h-3.5" />
                      התנתקות
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setAuthModalOpen(true)}
                      className={`relative p-2 transition-all duration-300 rounded-lg group border ${
                        authModalOpen
                          ? "text-primary bg-primary/15 shadow-sm shadow-primary/20 border-primary/20"
                          : "text-muted-foreground hover:text-primary hover:bg-primary/10 border-transparent hover:border-primary/20 bg-card/50"
                      }`}
                    >
                      <KeyRound className={`w-4 h-4 transition-transform duration-300 ${authModalOpen ? "scale-110" : "group-hover:scale-110"}`} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="bottom" 
                    className="bg-background/95 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/5 px-3 py-1.5 text-xs font-medium"
                  >
                    התחברות
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </TooltipProvider>

          {/* Auth Modal */}
          <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
          
          {/* Trusted Devices Modal */}
          {user?.email && (
            <TrustedDevicesModal 
              isOpen={showDevicesModal} 
              onClose={() => setShowDevicesModal(false)} 
              userEmail={user.email}
            />
          )}

          {/* Delete Account Modal */}
          <DeleteAccountModal 
            isOpen={showDeleteModal} 
            onClose={() => setShowDeleteModal(false)} 
          />

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
        </div>
      </div>
    </header>
  );
};

const CartHeaderButton = () => {
  const { getTotalItems, setIsCartOpen, isCartOpen } = useCart();
  const totalItems = getTotalItems();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={() => setIsCartOpen(true)}
          className={`relative p-2 transition-all duration-300 rounded-lg group border ${
            isCartOpen || totalItems > 0
              ? "text-primary bg-primary/15 shadow-sm shadow-primary/20 border-primary/20"
              : "text-muted-foreground hover:text-primary hover:bg-primary/10 border-transparent hover:border-primary/20 bg-card/50"
          }`}
        >
          <ShoppingBag className={`w-4 h-4 transition-transform duration-300 ${isCartOpen || totalItems > 0 ? "scale-110" : "group-hover:scale-110"}`} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold animate-pulse">
              {totalItems}
            </span>
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent 
        side="bottom" 
        className="bg-background/95 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/5 px-3 py-1.5 text-xs font-medium"
      >
        עגלת קניות {totalItems > 0 && `(${totalItems})`}
      </TooltipContent>
    </Tooltip>
  );
};

export default Header;
