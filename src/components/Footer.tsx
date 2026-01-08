import { Instagram, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-8">
            <a 
              href="https://instagram.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                <Instagram className="w-5 h-5 text-primary/60 group-hover:text-primary transition-colors" />
              </div>
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                <Facebook className="w-5 h-5 text-primary/60 group-hover:text-primary transition-colors" />
              </div>
            </a>
          </div>
          
          {/* Copyright with style */}
          <p className="text-muted-foreground/40 text-xs tracking-widest uppercase">
            © {new Date().getFullYear()} מזון האושר
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
