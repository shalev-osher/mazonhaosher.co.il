import { User, LogIn, LogOut, Package, ChevronDown, Menu, X, Cookie, Star, MessageCircle, HelpCircle, Gift, ShoppingCart, Smartphone } from "lucide-react";
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

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ThemeToggle from "./ThemeToggle";
import AuthModal from "./AuthModal";
import TrustedDevicesModal from "./TrustedDevicesModal";

const Header = () => {
  const { profile, isLoggedIn, logout, user } = useProfile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    setMobileMenuOpen(false);
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0];

  const navItems = [
    { id: "cookies", label: "עוגיות", icon: Cookie },
    { id: "gift-packages", label: "מארזים", icon: Gift },
    { id: "reviews", label: "ביקורות", icon: Star },
    { id: "faq", label: "שאלות", icon: HelpCircle },
    { id: "contact", label: "קשר", icon: MessageCircle },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? "bg-background/98 backdrop-blur-lg border-b border-border/50 shadow-md py-1" 
        : "bg-background/80 backdrop-blur-md py-1.5"
    }`}>
      <div className="max-w-7xl mx-auto px-3">
        <div className="flex items-center justify-between">

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-0">
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

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden relative w-8 h-8 rounded-full hover:bg-primary/10 transition-all duration-300"
                >
                  <Menu className={`w-4 h-4 absolute transition-all duration-300 ${mobileMenuOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"}`} />
                  <X className={`w-4 h-4 absolute transition-all duration-300 ${mobileMenuOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"}`} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 bg-background/98 backdrop-blur-xl border-primary/20">
                <SheetHeader className="text-right border-b border-border/50 pb-3 mb-3">
                  <SheetTitle className="font-display text-base text-primary flex items-center gap-2 justify-end">
                    <span>תפריט</span>
                    <Cookie className="w-4 h-4" />
                  </SheetTitle>
                </SheetHeader>
                
                <nav className="flex flex-col gap-1">
                  {navItems.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className="flex items-center justify-end gap-2.5 px-3 py-2 text-right rounded-lg transition-all duration-300 hover:bg-primary/10 group animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          {item.label}
                        </span>
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                          <IconComponent className="w-3.5 h-3.5 text-primary" />
                        </div>
                      </button>
                    );
                  })}
                </nav>

                {/* Decorative bottom */}
                <div className="absolute bottom-6 left-3 right-3">
                  <div className="flex justify-center gap-1.5">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-primary/30 animate-pulse"
                        style={{ animationDelay: `${i * 200}ms` }}
                      />
                    ))}
                  </div>
                  <p className="text-center text-[10px] text-muted-foreground mt-3">
                    עוגיות ביתיות עם אהבה 🍪
                  </p>
                </div>
              </SheetContent>
            </Sheet>
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
