import { User, LogIn, LogOut, Package, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
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

const Header = () => {
  const navigate = useNavigate();
  const { profile, isLoggedIn, logout, user } = useProfile();

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img
              src={logo}
              alt="מזון האושר"
              className="h-10 md:h-12 w-auto object-contain"
            />
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
                      {displayName}
                    </span>
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm font-medium text-foreground">
                    {displayName || "שלום!"}
                  </div>
                  <div className="px-2 pb-2 text-xs text-muted-foreground">
                    {user?.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => scrollToSection("order-history")}>
                    <Package className="w-4 h-4 ml-2" />
                    ההזמנות שלי
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="w-4 h-4 ml-2" />
                    התנתקות
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/auth")}
                className="gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">התחברות</span>
              </Button>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;
