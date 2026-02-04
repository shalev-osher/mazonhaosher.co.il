import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const WelcomePopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if popup was already shown in this session
    const hasSeenPopup = sessionStorage.getItem("welcomePopupSeen");
    if (!hasSeenPopup) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem("welcomePopupSeen", "true");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-sm sm:max-w-md p-0 border-0 overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="flex flex-col items-center text-center p-6 sm:p-8">
          {/* Logo */}
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 blur-2xl rounded-full scale-150" />
            <img 
              src={logo} 
              alt="מזון האושר" 
              className="w-24 h-24 sm:w-32 sm:h-32 object-contain relative z-10 drop-shadow-lg"
            />
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            ברוכים הבאים! 🍪
          </h2>

          {/* Beta Notice */}
          <div className="bg-warning/20 border border-warning/40 rounded-xl px-4 py-3 mb-6">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-warning text-lg">⚠️</span>
              <span className="font-semibold text-warning">
                האתר בשלב הרצה
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              אנחנו עובדים קשה להשלמת האתר. 
              <br />
              תודה על הסבלנות!
            </p>
          </div>

          {/* CTA Button */}
          <Button 
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold py-6 text-lg rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02]"
          >
            בואו נתחיל! 🚀
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomePopup;
