import { Instagram, Facebook } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-secondary/50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-6 animate-fade-in">
          <img 
            src={logo} 
            alt="מזון האושר" 
            className="h-40 md:h-48 w-auto hover:scale-105 transition-transform duration-300" 
          />

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

          <p className="text-muted-foreground text-sm text-center">
            © {new Date().getFullYear()} מזון האושר. נאפה באהבה.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;