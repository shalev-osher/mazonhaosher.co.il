import { Instagram, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-card">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-10 relative z-10">
        <div className="flex flex-col items-center gap-5">
          <h3 className="font-display text-2xl font-bold text-foreground">
            מזון האושר
          </h3>
          
          <p className="text-muted-foreground text-center max-w-md">
            עוגיות קראמבל אפויות בעבודת יד עם אהבה
          </p>

          <div className="flex items-center gap-4">
            <a 
              href="#" 
              className="w-10 h-10 bg-background rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 hover:scale-110"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="w-10 h-10 bg-background rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 hover:scale-110"
            >
              <Facebook className="w-5 h-5" />
            </a>
          </div>

          <div className="h-px w-32 bg-gradient-to-r from-transparent via-border to-transparent" />
          
          <p className="text-muted-foreground text-sm text-center">
            © {new Date().getFullYear()} מזון האושר. נאפה באהבה 💕
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
