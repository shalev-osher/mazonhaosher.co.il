import { User, LogOut, Package, ChevronDown, Gift, Star, CircleHelp, Users, ShoppingBag, Smartphone, Home, Trash2, UserPen, Lock, Cookie, UserCircle } from "lucide-react";
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
    { id: "hero", label: "בית", icon: Home },
    { id: "cookies", label: "עוגיות", icon: Cookie },
    { id: "gift-packages", label: "מארזים", icon: Gift },
    { id: "reviews", label: "ביקורות", icon: Star },
    { id: "faq", label: "שאלות", icon: CircleHelp },
    { id: "about", label: "אודות", icon: Users },
  ];

  return (
    <header className={`fixed top-[env(safe-area-inset-top)] left-0 right-0 z-50 transition-all duration-500 bg-transparent ${
      scrolled ? "py-1.5" : "py-2"
    }`}>
      <div className="flex justify-center px-2">
        {/* Single centered floating pill with all icons + labels */}
        <nav className="flex items-center bg-background/70 backdrop-blur-xl rounded-2xl px-2 py-1.5 border border-border/40 shadow-lg shadow-black/5 gap-0.5">
          {/* Navigation items */}
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative flex flex-col items-center gap-0.5 px-2.5 py-1.5 transition-all duration-300 rounded-xl group ${
                  isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <IconComponent className={`w-4 h-4 transition-all duration-300 ${
                  isActive ? "scale-110" : "group-hover:scale-105"
                }`} />
                <span className={`text-[10px] font-medium transition-all duration-300 ${
                  isActive ? "text-primary" : ""
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* Separator */}
          <div className="w-px h-8 bg-border/40 mx-1" />

          {/* Cart Button */}
          <CartHeaderButton />
          {/* Theme Toggle */}
          <ThemeToggle />
          {/* Auth Button */}
          {isLoggedIn ? (
            <DropdownMenu dir="rtl">
              <DropdownMenuTrigger asChild>
                <button className="flex flex-col items-center gap-0.5 px-2.5 py-1.5 transition-all duration-300 rounded-xl group text-primary bg-primary/10">
                  <UserCircle className="w-4 h-4" />
                  <span className="text-[10px] font-medium">חשבון</span>
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
            <button
              onClick={() => setAuthModalOpen(true)}
              className={`flex flex-col items-center gap-0.5 px-2.5 py-1.5 transition-all duration-300 rounded-xl group ${
                authModalOpen
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <UserCircle className={`w-4 h-4 transition-all duration-300 ${authModalOpen ? "scale-110" : "group-hover:scale-105"}`} />
              <span className="text-[10px] font-medium">כניסה</span>
            </button>
          )}
        </nav>
      </div>

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
    </header>
  );
};

const CartHeaderButton = () => {
  const { getTotalItems, setIsCartOpen, isCartOpen } = useCart();
  const totalItems = getTotalItems();
  const isActive = isCartOpen || totalItems > 0;

  return (
    <button
      onClick={() => setIsCartOpen(true)}
      className={`relative flex flex-col items-center gap-0.5 px-2.5 py-1.5 transition-all duration-300 rounded-xl group ${
        isActive
          ? "text-primary bg-primary/10"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      }`}
    >
      <div className="relative">
        <ShoppingBag className={`w-4 h-4 transition-all duration-300 ${isActive ? "scale-110" : "group-hover:scale-105"}`} />
        {totalItems > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-accent text-accent-foreground w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shadow-sm">
            {totalItems}
          </span>
        )}
      </div>
      <span className="text-[10px] font-medium">עגלה</span>
    </button>
  );
};

export default Header;
