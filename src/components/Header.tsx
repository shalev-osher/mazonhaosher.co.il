import { Cookie } from "lucide-react";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cookie className="h-8 w-8 text-accent" />
          <span className="font-display text-2xl font-semibold text-foreground">
            Crumble
          </span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#cookies" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
            Our Cookies
          </a>
          <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
            Our Story
          </a>
          <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
            Contact
          </a>
        </nav>

        <Button variant="honey" size="sm">
          Order Now
        </Button>
      </div>
    </header>
  );
};

export default Header;
