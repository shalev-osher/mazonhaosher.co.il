import { Instagram, Facebook } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-secondary/50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4">
          <img src={logo} alt="מזון האושר" className="h-20 w-auto" />

          <div className="flex items-center gap-3">
            <a 
              href="#" 
              className="w-8 h-8 bg-card rounded-full flex items-center justify-center text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a 
              href="#" 
              className="w-8 h-8 bg-card rounded-full flex items-center justify-center text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all"
            >
              <Facebook className="w-4 h-4" />
            </a>
          </div>

          <p className="text-muted-foreground text-xs text-center">
            © {new Date().getFullYear()} מזון האושר. נאפה באהבה.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
