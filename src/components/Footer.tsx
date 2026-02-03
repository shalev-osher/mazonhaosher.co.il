import { Instagram, Facebook, Github, ShoppingBag } from "lucide-react";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 py-2 bg-background/90 border-t border-border/30">
      <div className="container mx-auto px-3">
        <div className="flex items-center justify-between">
          {/* Right side - Cart */}
          <div className="flex items-center gap-2">
            <a 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('[data-cart-button]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
              }}
              className="w-8 h-8 rounded-full bg-card/50 border border-border/30 flex items-center justify-center hover:bg-primary hover:border-transparent transition-all duration-300 hover:scale-110 group"
            >
              <ShoppingBag className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
            </a>
          </div>

          {/* Center - Copyright + Brand name + Year */}
          <span className="text-sm font-medium text-foreground/80">© מזון האושר 2026</span>

          {/* Left side - Facebook, Instagram, GitHub */}
          <div className="flex items-center gap-2">
            <a 
              href="https://facebook.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-card/50 border border-border/30 flex items-center justify-center hover:bg-[#1877F2] hover:border-transparent transition-all duration-300 hover:scale-110 group"
            >
              <Facebook className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-card/50 border border-border/30 flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-500 hover:via-pink-500 hover:to-orange-500 hover:border-transparent transition-all duration-300 hover:scale-110 group"
            >
              <Instagram className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
            </a>
            <a 
              href="https://github.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-card/50 border border-border/30 flex items-center justify-center hover:bg-foreground hover:border-transparent transition-all duration-300 hover:scale-110 group"
            >
              <Github className="w-4 h-4 text-muted-foreground group-hover:text-background transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
