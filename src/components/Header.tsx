import { User, KeyRound, LogOut, Package, ChevronDown, Crown, Gift, Star, HelpCircle, Heart, ShoppingBag, Smartphone, Home } from "lucide-react";
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

const Header = () => {
  const { profile, isLoggedIn, logout, user } = useProfile();
  const [scrolled, setScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showDevicesModal, setShowDevicesModal] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? "bg-background/98 backdrop-blur-lg border-b border-border/50 shadow-md py-1" 
        : "bg-background/80 backdrop-blur-md py-1.5"
    }`}>
      <div className="max-w-7xl mx-auto px-3">
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
                        className={`relative p-1.5 transition-all duration-300 rounded-full group ${
                          isActive 
                            ? "text-primary bg-primary/15 shadow-sm shadow-primary/20" 
                            : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                        }`}
                      >
                        <IconComponent className={`w-4 h-4 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                        <span className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-primary/50 via-primary to-primary/50 transition-all duration-300 rounded-full ${
                          isActive ? "w-full" : "w-0 group-hover:w-full"
                        }`} />
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
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAuthModalOpen(true)}
                      className="p-1.5 rounded-full hover:bg-primary/10 transition-all duration-300"
                    >
                      <KeyRound className="w-4 h-4 text-muted-foreground hover:text-primary" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="bottom" 
                    className="bg-background/95 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/5 px-3 py-1.5 text-xs font-medium"
                  >
                    התחברות
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-1.5 text-muted-foreground hover:text-primary transition-all duration-300 rounded-full hover:bg-primary/10"
          >
            <ShoppingBag className="w-4 h-4" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold animate-pulse">
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
    </TooltipProvider>
  );
};

export default Header;
