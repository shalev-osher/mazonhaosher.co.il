import { Button } from "./ui/button";
import logo from "@/assets/logo.png";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={logo} alt="מזון האושר" className="h-16 w-auto" />
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#cookies" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
            העוגיות שלנו
          </a>
          <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
            הסיפור שלנו
          </a>
          <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
            צרו קשר
          </a>
        </nav>

        <Button variant="honey" size="sm">
          הזמינו עכשיו
        </Button>
      </div>
    </header>
  );
};

export default Header;
