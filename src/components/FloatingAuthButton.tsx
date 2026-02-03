import { UserCircle, LogOut, Package, UserPen, Lock } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfile } from "@/contexts/ProfileContext";
import { cn } from "@/lib/utils";
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

const FloatingAuthButton = () => {
  const { t, isRTL } = useLanguage();
  const { profile, isLoggedIn, logout, user } = useProfile();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0];
  const firstName = displayName?.split(" ")[0] || "";
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
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
      {isLoggedIn ? (
        <DropdownMenu dir={isRTL ? "rtl" : "ltr"}>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "fixed bottom-14 z-40 rounded-full",
                "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg",
                "flex items-center gap-1.5 px-2 py-1.5",
                "hover:scale-105 transition-all duration-200",
                isRTL ? "right-4" : "left-4"
              )}
            >
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt={firstName}
                  className="w-6 h-6 rounded-full object-cover border border-white/30"
                />
              ) : (
                <UserCircle className="w-6 h-6 text-white fill-white/20" />
              )}
              <span className="text-xs font-medium text-white">
                {firstName || (isRTL ? "חשבון" : "Account")}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align={isRTL ? "end" : "start"}
            side="top"
            className={`w-52 rounded-xl shadow-xl border-border/50 bg-background animate-scale-in text-sm ${isRTL ? 'text-right [direction:rtl]' : 'text-left [direction:ltr]'}`}
          >
            <div className={`px-2.5 py-2 bg-cyan-500/10 rounded-t-lg flex items-center gap-2.5 ${isRTL ? 'flex-row' : ''}`}>
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt={displayName || ""}
                  className="w-9 h-9 rounded-full object-cover border-2 border-cyan-500/30 shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0">
                  <UserCircle className="w-5 h-5 text-white" />
                </div>
              )}
              <div className={`min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                <p className="text-xs font-medium text-foreground truncate">{displayName || (isRTL ? "שלום!" : "Hello!")}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => scrollToSection("order-history")}
              className="gap-2 cursor-pointer hover:bg-amber-500/10 text-xs py-1.5 justify-start"
            >
              <Package className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('nav.orderHistory')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setShowEditProfileModal(true)}
              className="gap-2 cursor-pointer hover:bg-emerald-500/10 text-xs py-1.5 justify-start"
            >
              <UserPen className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t('nav.editProfile')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setShowChangePasswordModal(true)}
              className="gap-2 cursor-pointer hover:bg-purple-500/10 text-xs py-1.5 justify-start"
            >
              <Lock className="w-3.5 h-3.5 text-purple-500" />
              <span>{t('profile.changePassword')}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="gap-2 cursor-pointer hover:bg-red-500/10 text-xs py-1.5 justify-start"
            >
              <LogOut className="w-3.5 h-3.5 text-red-500" />
              <span>{t('nav.logout')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <button
          onClick={() => setAuthModalOpen(true)}
          className={cn(
            "fixed bottom-14 z-40 rounded-full",
            "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg",
            "flex items-center gap-1.5 px-3 py-2",
            "hover:scale-105 transition-all duration-200",
            isRTL ? "right-4" : "left-4"
          )}
        >
          <UserCircle className="w-5 h-5 text-white fill-white/20" />
          <span className="text-xs font-medium text-white">
            {isRTL ? "התחברות" : "Login"}
          </span>
        </button>
      )}

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

export default FloatingAuthButton;