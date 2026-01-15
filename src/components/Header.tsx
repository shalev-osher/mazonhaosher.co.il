import { User, LogIn, LogOut, Package, ChevronDown, Menu, X, Cookie, Star, MessageCircle, HelpCircle, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
import logo from "@/assets/logo.png";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const navigate = useNavigate();
  const { profile, isLoggedIn, logout, user } = useProfile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
        ? "bg-background/98 backdrop-blur-lg border-b border-border/50 shadow-lg py-0.5" 
        : "bg-background/80 backdrop-blur-md py-1"
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 hover:scale-105 transition-transform duration-300"
          >
            <img
              src={logo}
              alt="מזון האושר"
              className={`w-auto object-contain transition-all duration-300 ${scrolled ? "h-7 md:h-8" : "h-8 md:h-9"}`}
            />
          </button>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="relative p-2 text-muted-foreground hover:text-primary transition-all duration-300 rounded-full hover:bg-primary/10 group"
                  title={item.label}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 rounded-full" />
                </button>
              );
            })}
          </nav>

          {/* Right side - Theme Toggle + Auth + Mobile Menu Button */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <ThemeToggle />
            {/* Auth Button */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 rounded-full border-primary/30 hover:border-primary hover:bg-primary/10 transition-all duration-300">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="hidden sm:inline max-w-[100px] truncate">
                      {displayName}
                    </span>
                    <ChevronDown className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 rounded-xl shadow-xl border-primary/20 animate-scale-in">
                  <div className="px-3 py-2 bg-primary/5 rounded-t-lg">
                    <p className="text-sm font-medium text-foreground">{displayName || "שלום!"}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => scrollToSection("order-history")} className="gap-2 cursor-pointer hover:bg-primary/10">
                    <Package className="w-4 h-4 text-primary" />
                    ההזמנות שלי
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="gap-2 text-destructive cursor-pointer hover:bg-destructive/10">
                    <LogOut className="w-4 h-4" />
                    התנתקות
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/auth")}
                className="p-2 rounded-full hover:bg-primary/10 transition-all duration-300"
                title="התחברות"
              >
                <LogIn className="w-5 h-5 text-muted-foreground hover:text-primary" />
              </Button>
            )}

            {/* Mobile Menu Button - Sheet */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden relative w-10 h-10 rounded-full hover:bg-primary/10 transition-all duration-300"
                >
                  <Menu className={`w-5 h-5 absolute transition-all duration-300 ${mobileMenuOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"}`} />
                  <X className={`w-5 h-5 absolute transition-all duration-300 ${mobileMenuOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"}`} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-background/98 backdrop-blur-xl border-primary/20">
                <SheetHeader className="text-right border-b border-border/50 pb-4 mb-4">
                  <SheetTitle className="font-display text-xl text-primary flex items-center gap-2 justify-end">
                    <span>תפריט</span>
                    <Cookie className="w-5 h-5" />
                  </SheetTitle>
                </SheetHeader>
                
                <nav className="flex flex-col gap-2">
                  {navItems.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className="flex items-center justify-end gap-3 px-4 py-3 text-right rounded-xl transition-all duration-300 hover:bg-primary/10 group animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <span className="text-base font-medium text-foreground group-hover:text-primary transition-colors">
                          {item.label}
                        </span>
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                          <IconComponent className="w-4 h-4 text-primary" />
                        </div>
                      </button>
                    );
                  })}
                </nav>

                {/* Decorative bottom */}
                <div className="absolute bottom-8 left-4 right-4">
                  <div className="flex justify-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full bg-primary/30 animate-pulse"
                        style={{ animationDelay: `${i * 200}ms` }}
                      />
                    ))}
                  </div>
                  <p className="text-center text-xs text-muted-foreground mt-4">
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

export default Header;
