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
      scrolled ? "py-2" : "py-3"
    }`}>
      <div className="max-w-7xl mx-auto px-[max(1rem,env(safe-area-inset-left))]">
        <div className="flex items-center justify-between">

          {/* Navigation - Floating pill design */}
          <TooltipProvider delayDuration={100}>
            <nav className="flex items-center bg-background/60 backdrop-blur-xl rounded-full p-1 border border-border/50 shadow-lg shadow-black/5">
              {navItems.map((item, index) => {
                const IconComponent = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => scrollToSection(item.id)}
                        className={`relative p-2.5 transition-all duration-400 rounded-full group overflow-hidden ${
                          isActive 
                            ? "text-primary-foreground" 
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {/* Active background blob */}
                        <span className={`absolute inset-0 rounded-full bg-gradient-to-br from-primary via-primary to-primary/80 transition-all duration-400 ${
                          isActive ? "scale-100 opacity-100" : "scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-10"
                        }`} />
                        {/* Glow effect */}
                        <span className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
                          isActive ? "opacity-100 shadow-[0_0_20px_hsl(var(--primary)/0.5)]" : "opacity-0"
                        }`} />
                        <IconComponent className={`relative z-10 w-4 h-4 transition-all duration-300 ${
                          isActive ? "scale-110 drop-shadow-sm" : "group-hover:scale-105"
                        }`} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent 
                      side="bottom" 
                      sideOffset={8}
                      className="bg-background/95 backdrop-blur-xl border-border/50 shadow-xl px-3 py-1.5 text-xs font-medium rounded-full"
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
            <div className="flex items-center bg-background/60 backdrop-blur-xl rounded-full p-1 border border-border/50 shadow-lg shadow-black/5">
              {/* Cart Button */}
              <CartHeaderButton />
              {/* Theme Toggle */}
              <ThemeToggle />
              {/* Auth Button */}
              {isLoggedIn ? (
                <DropdownMenu dir="rtl">
                  <DropdownMenuTrigger asChild>
                    <button className="relative p-2.5 transition-all duration-400 rounded-full group overflow-hidden text-primary-foreground">
                      <span className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-primary to-primary/80" />
                      <span className="absolute inset-0 rounded-full shadow-[0_0_20px_hsl(var(--primary)/0.5)]" />
                      <User className="relative z-10 w-4 h-4 transition-transform duration-300 scale-110 drop-shadow-sm" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-48 rounded-2xl shadow-xl border-border/50 backdrop-blur-xl animate-scale-in text-sm text-right [direction:rtl]"
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
                    <DropdownMenuItem
                      onClick={() => setShowDevicesModal(true)}
                      className="gap-2 cursor-pointer hover:bg-primary/10 text-xs py-1.5 justify-start"
                    >
                      <Smartphone className="w-3.5 h-3.5 text-primary" />
                      <span>מכשירים מהימנים</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setShowDeleteModal(true)}
                      className="gap-2 text-destructive cursor-pointer hover:bg-destructive/10 text-xs py-1.5 justify-start"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>מחיקת חשבון</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="gap-2 text-destructive cursor-pointer hover:bg-destructive/10 text-xs py-1.5 justify-start"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>התנתקות</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setAuthModalOpen(true)}
                      className={`relative p-2.5 transition-all duration-400 rounded-full group overflow-hidden ${
                        authModalOpen
                          ? "text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span className={`absolute inset-0 rounded-full bg-gradient-to-br from-primary via-primary to-primary/80 transition-all duration-400 ${
                        authModalOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-10"
                      }`} />
                      <span className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
                        authModalOpen ? "opacity-100 shadow-[0_0_20px_hsl(var(--primary)/0.5)]" : "opacity-0"
                      }`} />
                      <KeyRound className={`relative z-10 w-4 h-4 transition-all duration-300 ${authModalOpen ? "scale-110 drop-shadow-sm" : "group-hover:scale-105"}`} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="bottom" 
                    sideOffset={8}
                    className="bg-background/95 backdrop-blur-xl border-border/50 shadow-xl px-3 py-1.5 text-xs font-medium rounded-full"
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
  const isActive = isCartOpen || totalItems > 0;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={() => setIsCartOpen(true)}
          className={`relative p-2.5 transition-all duration-400 rounded-full group overflow-hidden ${
            isActive
              ? "text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {/* Active/hover background */}
          <span className={`absolute inset-0 rounded-full bg-gradient-to-br from-primary via-primary to-primary/80 transition-all duration-400 ${
            isActive ? "scale-100 opacity-100" : "scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-10"
          }`} />
          {/* Glow effect */}
          <span className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
            isActive ? "opacity-100 shadow-[0_0_20px_hsl(var(--primary)/0.5)]" : "opacity-0"
          }`} />
          <ShoppingBag className={`relative z-10 w-4 h-4 transition-all duration-300 ${isActive ? "scale-110 drop-shadow-sm" : "group-hover:scale-105"}`} />
          {totalItems > 0 && (
            <span className="absolute -top-0.5 -right-0.5 z-20 bg-accent text-accent-foreground w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shadow-lg ring-2 ring-background/80">
              {totalItems}
            </span>
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent 
        side="bottom" 
        sideOffset={8}
        className="bg-background/95 backdrop-blur-xl border-border/50 shadow-xl px-3 py-1.5 text-xs font-medium rounded-full"
      >
        עגלת קניות {totalItems > 0 && `(${totalItems})`}
      </TooltipContent>
    </Tooltip>
  );
};

export default Header;
