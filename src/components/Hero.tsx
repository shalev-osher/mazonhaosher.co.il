import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import heroImage from "@/assets/hero-cookies.jpg";
import logo from "@/assets/logo.png";

const useTypewriter = (text: string, speed: number = 50, delay: number = 500, pauseTime: number = 2000) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let currentIndex = 0;
    let isDeleting = false;
    
    const animate = () => {
      if (!isDeleting) {
        // Typing
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
          setIsTyping(true);
          timeout = setTimeout(animate, speed);
        } else {
          // Finished typing, pause then start deleting
          setIsTyping(false);
          timeout = setTimeout(() => {
            isDeleting = true;
            animate();
          }, pauseTime);
        }
      } else {
        // Deleting
        if (currentIndex > 0) {
          currentIndex--;
          setDisplayedText(text.slice(0, currentIndex));
          setIsTyping(true);
          timeout = setTimeout(animate, speed / 2);
        } else {
          // Finished deleting, pause then start typing again
          isDeleting = false;
          setIsTyping(false);
          timeout = setTimeout(animate, delay);
        }
      }
    };

    timeout = setTimeout(animate, delay);

    return () => clearTimeout(timeout);
  }, [text, speed, delay, pauseTime]);

  return { displayedText, isTyping };
};

const Hero = () => {
  const { displayedText, isTyping } = useTypewriter(
    "עוגיות קראמבל אפויות בעבודת יד עם אהבה. בהזמנה מראש בלבד. אספקה עד 3 ימי עסקים.",
    40,
    800,
    3000
  );

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

      {/* Logo with effects */}
      <div className="absolute top-4 md:top-6 left-1/2 -translate-x-1/2 z-20">
        <div className="relative animate-float">
          {/* Sparkle particles */}
          <div className="absolute -inset-4 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-2 h-2 bg-golden-honey rounded-full animate-sparkle-particle opacity-80" style={{ animationDelay: '0s' }} />
            <div className="absolute top-1/3 right-0 w-1.5 h-1.5 bg-accent rounded-full animate-sparkle-particle opacity-70" style={{ animationDelay: '0.5s' }} />
            <div className="absolute bottom-1/4 left-0 w-2 h-2 bg-golden-honey rounded-full animate-sparkle-particle opacity-90" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-0 right-1/4 w-1 h-1 bg-primary rounded-full animate-sparkle-particle opacity-60" style={{ animationDelay: '1.5s' }} />
            <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-golden-honey rounded-full animate-sparkle-particle opacity-75" style={{ animationDelay: '2s' }} />
          </div>
          <img
            src={logo}
            alt="מזון האושר"
            className="h-28 md:h-48 w-auto object-contain animate-sparkle drop-shadow-2xl"
            style={{ imageRendering: 'crisp-edges' }}
            loading="eager"
          />
        </div>
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
          <p className="text-base md:text-lg text-muted-foreground mb-6 mx-auto max-w-md min-h-[4rem]">
            {displayedText}
            <span className={`${isTyping ? 'animate-pulse' : 'opacity-0'}`}>|</span>
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