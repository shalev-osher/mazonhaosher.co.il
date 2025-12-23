import { Cookie, Instagram, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary/50 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Cookie className="h-6 w-6 text-accent" />
            <span className="font-display text-xl font-semibold text-foreground">
              מזון האושר
            </span>
          </div>

          <p className="text-muted-foreground text-sm text-center">
            © {new Date().getFullYear()} מזון האושר. נאפה באהבה.
          </p>

          <div className="flex items-center gap-4">
            <a 
              href="#" 
              className="w-10 h-10 bg-card rounded-full flex items-center justify-center text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="w-10 h-10 bg-card rounded-full flex items-center justify-center text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all"
            >
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
