import { Instagram, Facebook } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden">
      {/* Decorative background - warm pink base */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/25 via-secondary to-accent/15" />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 50% 100%, hsl(var(--primary) / 0.5) 0%, transparent 50%), radial-gradient(circle at 20% 30%, hsl(var(--accent) / 0.4) 0%, transparent 40%)' }} />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIj48Y2lyY2xlIGN4PSIyNSIgY3k9IjI1IiByPSIxIiBmaWxsPSIjZTg1ZDhmIiBmaWxsLW9wYWNpdHk9IjAuMTUiLz48L2c+PC9zdmc+')] opacity-70" />
      
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col items-center gap-6 animate-fade-in">
          <div className="relative animate-float">
            {/* Sparkle particles */}
            <div className="absolute -inset-4 pointer-events-none">
              <div className="absolute top-0 left-1/4 w-2 h-2 bg-golden-honey rounded-full animate-sparkle-particle opacity-80" style={{ animationDelay: '0s' }} />
              <div className="absolute top-1/3 right-0 w-1.5 h-1.5 bg-accent rounded-full animate-sparkle-particle opacity-70" style={{ animationDelay: '0.5s' }} />
              <div className="absolute bottom-1/4 left-0 w-2 h-2 bg-golden-honey rounded-full animate-sparkle-particle opacity-90" style={{ animationDelay: '1s' }} />
              <div className="absolute bottom-0 right-1/4 w-1 h-1 bg-primary rounded-full animate-sparkle-particle opacity-60" style={{ animationDelay: '1.5s' }} />
            </div>
            <img 
              src={logo} 
              alt="מזון האושר" 
              className="h-36 md:h-44 w-auto object-contain animate-sparkle drop-shadow-2xl hover:scale-105 transition-transform duration-300" 
              style={{ imageRendering: 'crisp-edges' }}
              loading="lazy"
            />
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="#" 
              className="w-10 h-10 bg-card rounded-full flex items-center justify-center text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all duration-300 hover:scale-110 hover:-translate-y-1"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="w-10 h-10 bg-card rounded-full flex items-center justify-center text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all duration-300 hover:scale-110 hover:-translate-y-1"
            >
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Same style as header */}
      <div className="bg-background/95 backdrop-blur-md border-t border-border/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <img 
              src={logo} 
              alt="מזון האושר" 
              className="h-10 md:h-12 w-auto object-contain" 
            />
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} מזון האושר. נאפה באהבה.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
