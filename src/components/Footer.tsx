import { Instagram, Facebook, Heart, Cookie } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="relative py-8 bg-gradient-to-t from-card via-card/80 to-transparent overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zMCAzMGMwLTUuNTIzIDQuNDc3LTEwIDEwLTEwczEwIDQuNDc3IDEwIDEwLTQuNDc3IDEwLTEwIDEwLTEwLTQuNDc3LTEwLTEweiIgZmlsbD0iI2U4NWQ4ZiIgZmlsbC1vcGFjaXR5PSIwLjAzIi8+PC9nPjwvc3ZnPg==')] opacity-50" />
      
      <div className="container mx-auto px-3 relative z-10">
        <div className="flex flex-col items-center gap-4">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex flex-col items-center gap-2 hover:scale-105 transition-transform duration-500"
          >
            <img
              src={logo}
              alt="מזון האושר"
              className="h-20 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity"
            />
          </button>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a 
              href="https://instagram.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 blur-md transition-all duration-500 scale-110" />
              <div className="relative w-9 h-9 rounded-full bg-card border border-primary/10 flex items-center justify-center group-hover:border-transparent group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:via-pink-500 group-hover:to-orange-500 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                <Instagram className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors duration-300" />
              </div>
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
            >
              <div className="absolute inset-0 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 blur-md transition-all duration-500 scale-110" />
              <div className="relative w-9 h-9 rounded-full bg-card border border-primary/10 flex items-center justify-center group-hover:border-transparent group-hover:bg-blue-500 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6">
                <Facebook className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors duration-300" />
              </div>
            </a>
          </div>

          {/* Divider with cookies */}
          <div className="flex items-center gap-3 w-full max-w-[200px]">
            <div className="flex-1 h-px bg-gradient-to-l from-primary/20 to-transparent" />
            <Cookie className="w-3 h-3 text-primary/40 animate-pulse" />
            <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent" />
          </div>
          
          {/* Made with love */}
          <p className="flex items-center gap-1.5 text-muted-foreground/60 text-xs">
            <span>נאפה עם</span>
            <Heart className="w-3 h-3 text-primary/60 fill-primary/30 animate-pulse" />
            <span>באהבה</span>
          </p>

          {/* Copyright */}
          <p className="text-muted-foreground/40 text-[10px] tracking-wider">
            © {new Date().getFullYear()} מזון האושר • כל הזכויות שמורות
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;