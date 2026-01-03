import { useState } from "react";
import { User, LogIn, LogOut, Package, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProfile } from "@/contexts/ProfileContext";
import PhoneAuthModal from "./PhoneAuthModal";

interface Profile {
  id: string;
  phone: string;
  full_name: string | null;
  address: string | null;
  city: string | null;
  notes: string | null;
}

const Header = () => {
  const { profile, isLoggedIn, setProfile, logout } = useProfile();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleProfileLoaded = (loadedProfile: Profile) => {
    setProfile(loadedProfile);
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-background/80 backdrop-blur-md rounded-2xl border border-border/50 shadow-lg px-4 py-2">
            <div className="flex items-center justify-between">
              {/* Logo / Brand */}
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="font-display text-xl font-bold text-primary hover:text-primary/80 transition-colors"
              >
                מזון האושר
              </button>

              {/* Navigation - Desktop */}
              <nav className="hidden md:flex items-center gap-6">
                <button
                  onClick={() => scrollToSection("cookies")}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  העוגיות
                </button>
                <button
                  onClick={() => scrollToSection("reviews")}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ביקורות
                </button>
                <button
                  onClick={() => scrollToSection("faq")}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  שאלות נפוצות
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  צור קשר
                </button>
              </nav>

              {/* Auth Button */}
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <User className="w-4 h-4" />
                      <span className="hidden sm:inline max-w-[100px] truncate">
                        {profile?.full_name || profile?.phone}
                      </span>
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5 text-sm font-medium text-foreground">
                      {profile?.full_name || "שלום!"}
                    </div>
                    <div className="px-2 pb-2 text-xs text-muted-foreground">
                      {profile?.phone}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => scrollToSection("order-history")}>
                      <Package className="w-4 h-4 ml-2" />
                      ההזמנות שלי
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-destructive">
                      <LogOut className="w-4 h-4 ml-2" />
                      התנתקות
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">התחברות</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <PhoneAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onProfileLoaded={handleProfileLoaded}
      />
    </>
  );
};

export default Header;
