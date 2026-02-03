import { Instagram, Facebook, ShoppingBag, MoonStar, Sun, UserCircle, LogOut, Package, UserPen, Lock } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
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

const Footer = () => {
  const { setIsCartOpen } = useCart();
  const { isRTL, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { profile, isLoggedIn, logout, user } = useProfile();
  
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0];
  const firstName = displayName?.split(" ")[0] || "";

  const handleLogout = async () => {
    await logout();
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <footer className="fixed bottom-0 left-0 right-0 z-40 py-2 md:py-3 bg-background/90 border-t border-border/30">
        <div className="w-full px-3 md:px-6">
          <div className="flex items-center justify-between">
            {/* Right side - Theme Toggle, Cart, WhatsApp */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center hover:bg-primary hover:border-transparent transition-all duration-300 hover:scale-110 group"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 md:w-5 md:h-5 text-amber-500 group-hover:text-white transition-colors" />
                ) : (
                  <MoonStar className="w-4 h-4 md:w-5 md:h-5 text-indigo-400 group-hover:text-white transition-colors" />
                )}
              </button>
              
              <button 
                onClick={() => setIsCartOpen(true)}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center hover:bg-accent hover:border-transparent transition-all duration-300 hover:scale-110 group"
              >
                <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 text-accent group-hover:text-white transition-colors" />
              </button>
              <a 
                href="https://wa.me/972546791198"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#25D366]/20 border border-[#25D366]/30 flex items-center justify-center hover:bg-[#25D366] hover:border-transparent transition-all duration-300 hover:scale-110 group"
              >
                <svg 
                  className="w-4 h-4 md:w-5 md:h-5 text-[#25D366] group-hover:text-white transition-colors" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>

            {/* Center - Copyright + Brand name + Year */}
            <span className="text-sm md:text-base font-medium text-foreground/80">
              © {isRTL ? "מזון האושר" : "Mazon HaOsher"} 2026
            </span>

            {/* Left side - Account, Facebook, Instagram */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Account Button */}
              {isLoggedIn ? (
                <DropdownMenu dir={isRTL ? "rtl" : "ltr"}>
                  <DropdownMenuTrigger asChild>
                    <button className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center hover:bg-accent hover:border-transparent transition-all duration-300 hover:scale-110 group">
                      <UserCircle className="w-4 h-4 md:w-5 md:h-5 text-accent group-hover:text-white transition-colors" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    side="top"
                    className={`w-48 rounded-xl shadow-xl border-border/50 bg-background animate-scale-in text-sm ${isRTL ? 'text-right [direction:rtl]' : 'text-left [direction:ltr]'}`}
                  >
                    <div className={`px-2.5 py-1.5 bg-primary/5 rounded-t-lg ${isRTL ? 'text-right' : 'text-left'}`}>
                      <p className="text-xs font-medium text-foreground">{displayName || (isRTL ? "שלום!" : "Hello!")}</p>
                      <p className="text-[10px] text-muted-foreground">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => scrollToSection("order-history")}
                      className="gap-2 cursor-pointer hover:bg-primary/10 text-xs py-1.5 justify-start"
                    >
                      <Package className="w-3.5 h-3.5 text-primary" />
                      <span>{t('nav.orderHistory')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setShowEditProfileModal(true)}
                      className="gap-2 cursor-pointer hover:bg-primary/10 text-xs py-1.5 justify-start"
                    >
                      <UserPen className="w-3.5 h-3.5 text-primary" />
                      <span>{t('nav.editProfile')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setShowChangePasswordModal(true)}
                      className="gap-2 cursor-pointer hover:bg-primary/10 text-xs py-1.5 justify-start"
                    >
                      <Lock className="w-3.5 h-3.5 text-primary" />
                      <span>{t('profile.changePassword')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="gap-2 cursor-pointer hover:bg-primary/10 text-xs py-1.5 justify-start"
                    >
                      <LogOut className="w-3.5 h-3.5 text-primary" />
                      <span>{t('nav.logout')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center hover:bg-accent hover:border-transparent transition-all duration-300 hover:scale-110 group"
                >
                  <UserCircle className="w-4 h-4 md:w-5 md:h-5 text-accent group-hover:text-white transition-colors" />
                </button>
              )}
              
              <a 
                href="https://www.facebook.com/p/%D7%9E%D7%96%D7%95%D7%9F-%D7%94%D7%90%D7%95%D7%A9%D7%A8-61565573526817/" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#1877F2]/20 border border-[#1877F2]/30 flex items-center justify-center hover:bg-[#1877F2] hover:border-transparent transition-all duration-300 hover:scale-110 group"
              >
                <Facebook className="w-4 h-4 md:w-5 md:h-5 text-[#1877F2] group-hover:text-white transition-colors" />
              </a>
              <a 
                href="https://www.instagram.com/mazonaosher/" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-orange-500/20 border border-pink-500/30 flex items-center justify-center hover:from-purple-500 hover:via-pink-500 hover:to-orange-500 hover:border-transparent transition-all duration-300 hover:scale-110 group"
              >
                <Instagram className="w-4 h-4 md:w-5 md:h-5 text-pink-500 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </footer>

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

export default Footer;
