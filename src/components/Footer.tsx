import { Instagram, Facebook, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-primary/10">
      {/* Elegant gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-card" />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a 
              href="https://instagram.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 border border-primary/20 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-all duration-300"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 border border-primary/20 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-all duration-300"
            >
              <Facebook className="w-4 h-4" />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-muted-foreground/60 text-xs tracking-wide">
            © {new Date().getFullYear()} כל הזכויות שמורות
          </p>

          {/* Contact Info */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground/60">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3 h-3" />
              054-1234567
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3" />
              תל אביב
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
