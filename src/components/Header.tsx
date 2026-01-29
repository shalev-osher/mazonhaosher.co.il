import { User, LogIn, LogOut, Package, ChevronDown, Sparkles, Star, MessageCircle, HelpCircle, Gift, ShoppingCart, Smartphone } from "lucide-react";
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
import { useProfile } from "@/contexts/ProfileContext";

import ThemeToggle from "./ThemeToggle";
import AuthModal from "./AuthModal";
import TrustedDevicesModal from "./TrustedDevicesModal";

const Header = () => {
  const { profile, isLoggedIn, logout, user } = useProfile();
  const [scrolled, setScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showDevicesModal, setShowDevicesModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0];

  const navItems = [
    { id: "cookies", label: "מוצרים", icon: Sparkles },
    { id: "gift-packages", label: "מארזים", icon: Gift },
    { id: "reviews", label: "ביקורות", icon: Star },
    { id: "faq", label: "שאלות", icon: HelpCircle },
    { id: "about", label: "עלינו", icon: MessageCircle },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? "bg-background/98 backdrop-blur-lg border-b border-border/50 shadow-md py-1" 
        : "bg-background/80 backdrop-blur-md py-1.5"
    }`}>
      <div className="max-w-7xl mx-auto px-3">
        <div className="flex items-center justify-between">

          {/* Navigation - All devices */}
          <nav className="flex items-center gap-0.5">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="relative p-1.5 text-muted-foreground hover:text-primary transition-all duration-300 rounded-full hover:bg-primary/10 group"
                  title={item.label}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 rounded-full" />
                </button>
              );
            })}
          </nav>

          {/* Right side - Cart + Theme Toggle + Auth + Mobile Menu Button */}
          <div className="flex items-center gap-1">
            {/* Cart Button */}
            <CartHeaderButton />
            {/* Theme Toggle */}
            <ThemeToggle />
            {/* Auth Button */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5 rounded-full border-primary/30 hover:border-primary hover:bg-primary/10 transition-all duration-300 h-7 px-2 text-xs">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-3 h-3 text-primary" />
                    </div>
                    <span className="hidden sm:inline max-w-[80px] truncate">
                      {displayName}
                    </span>
                    <ChevronDown className="w-2.5 h-2.5 transition-transform duration-300 group-hover:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-lg shadow-lg border-primary/20 animate-scale-in text-sm">
                  <div className="px-2.5 py-1.5 bg-primary/5 rounded-t-lg">
                    <p className="text-xs font-medium text-foreground">{displayName || "שלום!"}</p>
                    <p className="text-[10px] text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => scrollToSection("order-history")} className="gap-2 cursor-pointer hover:bg-primary/10 text-xs py-1.5">
                    <Package className="w-3.5 h-3.5 text-primary" />
                    ההזמנות שלי
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowDevicesModal(true)} className="gap-2 cursor-pointer hover:bg-primary/10 text-xs py-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-primary" />
                    מכשירים מהימנים
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="gap-2 text-destructive cursor-pointer hover:bg-destructive/10 text-xs py-1.5">
                    <LogOut className="w-3.5 h-3.5" />
                    התנתקות
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAuthModalOpen(true)}
                className="p-1.5 rounded-full hover:bg-primary/10 transition-all duration-300"
                title="התחברות"
              >
                <LogIn className="w-4 h-4 text-muted-foreground hover:text-primary" />
              </Button>
            )}

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

          </div>
        </div>
      </div>
    </header>
  );
};

const CartHeaderButton = () => {
  const { getTotalItems, setIsCartOpen } = useCart();
  const totalItems = getTotalItems();

  return (
    <button
      onClick={() => setIsCartOpen(true)}
      className="relative p-1.5 text-muted-foreground hover:text-primary transition-all duration-300 rounded-full hover:bg-primary/10"
      title="עגלת קניות"
    >
      <ShoppingCart className="w-4 h-4" />
      {totalItems > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold">
          {totalItems}
        </span>
      )}
    </button>
  );
};

export default Header;
