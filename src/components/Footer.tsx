import { Instagram, Facebook, Heart, MessageCircle, Store, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 py-2 bg-background/90 border-t border-border/30">
      <div className="container mx-auto px-3">
        <div className="flex items-center justify-center gap-4">
          {/* WhatsApp, Store, GitHub */}
          <div className="flex items-center gap-2">
            <a 
              href="https://wa.me/972000000000" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-card/50 border border-border/30 flex items-center justify-center hover:bg-green-500 hover:border-transparent transition-all duration-300 hover:scale-110 group"
            >
              <MessageCircle className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
            </a>
            <a 
              href="#cookies"
              className="w-8 h-8 rounded-full bg-card/50 border border-border/30 flex items-center justify-center hover:bg-primary hover:border-transparent transition-all duration-300 hover:scale-110 group"
            >
              <Store className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
            </a>
            <a 
              href="https://github.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-card/50 border border-border/30 flex items-center justify-center hover:bg-gray-800 hover:border-transparent transition-all duration-300 hover:scale-110 group"
            >
              <Github className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
            </a>
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-border/40" />

          {/* Social Icons */}
          <div className="flex items-center gap-2">
            <a 
              href="https://instagram.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-card/50 border border-border/30 flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-500 hover:via-pink-500 hover:to-orange-500 hover:border-transparent transition-all duration-300 hover:scale-110 group"
            >
              <Instagram className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-card/50 border border-border/30 flex items-center justify-center hover:bg-blue-500 hover:border-transparent transition-all duration-300 hover:scale-110 group"
            >
              <Facebook className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
            </a>
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-border/40" />
          
          {/* Made with love + Copyright */}
          <div className="flex items-center gap-1.5 text-muted-foreground/60 text-[10px]">
            <span>נאפה עם</span>
            <Heart className="w-3 h-3 text-primary/60 fill-primary/30" />
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;