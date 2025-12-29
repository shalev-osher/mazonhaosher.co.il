import { Button } from "./ui/button";
import heroImage from "@/assets/hero-cookies.jpg";
import logo from "@/assets/logo.png";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="עוגיות קראמבל טריות מהתנור"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/70" />
      </div>

      {/* Logo */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
        <img
          src={logo}
          alt="מזון האושר"
          className="h-32 md:h-44 w-auto"
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-xl mx-auto text-center animate-fade-in-up">
          <span className="inline-block text-accent font-medium tracking-wider uppercase text-base md:text-lg mb-2">
            מיוצר באהבה
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
            <span className="text-accent">מזון האושר</span>{" "}
            עוגיות ביתיות
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-6 mx-auto max-w-md">
            עוגיות קראמבל אפויות בעבודת יד עם אהבה. בהזמנה מראש בלבד.
            אספקה עד 3 ימי עסקים.
          </p>
          <Button variant="honey" size="lg" onClick={() => document.getElementById('cookies')?.scrollIntoView({ behavior: 'smooth' })}>
            צפו בתפריט
          </Button>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default Hero;