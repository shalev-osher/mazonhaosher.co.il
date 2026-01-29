import { Button } from "./ui/button";
import { useState, useEffect, useCallback } from "react";
import heroImage from "@/assets/hero-cookies.jpg";
import { Sparkles, Heart } from "lucide-react";

const useTypewriter = (text: string, speed: number = 50, delay: number = 500, pauseTime: number = 2000) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let currentIndex = 0;
    let isDeleting = false;
    
    const animate = () => {
      if (!isDeleting) {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
          setIsTyping(true);
          timeout = setTimeout(animate, speed);
        } else {
          setIsTyping(false);
          timeout = setTimeout(() => {
            isDeleting = true;
            animate();
          }, pauseTime);
        }
      } else {
        if (currentIndex > 0) {
          currentIndex--;
          setDisplayedText(text.slice(0, currentIndex));
          setIsTyping(true);
          timeout = setTimeout(animate, speed / 2);
        } else {
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

const useParallax = (speed: number = 0.5) => {
  const [offset, setOffset] = useState(0);

  const handleScroll = useCallback(() => {
    requestAnimationFrame(() => {
      setOffset(window.scrollY * speed);
    });
  }, [speed]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return offset;
};

const FloatingSparkle = ({ delay, left, top }: { delay: number; left: string; top: string }) => (
  <div 
    className="absolute animate-sparkle-particle pointer-events-none"
    style={{ 
      left, 
      top, 
      animationDelay: `${delay}s`,
      animationDuration: '3s'
    }}
  >
    <Sparkles className="h-4 w-4 text-accent/60" />
  </div>
);

const Hero = () => {
  const { displayedText, isTyping } = useTypewriter(
    "אופים לכם אושר",
    60,
    1000,
    3500
  );

  const parallaxOffset = useParallax(0.4);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Image with Parallax */}
      <div 
        className="absolute inset-0 z-0 will-change-transform"
        style={{ 
          transform: `translateY(${parallaxOffset}px) scale(1.1)`,
          top: '-5%',
          height: '110%'
        }}
      >
        <img
          src={heroImage}
          alt="עוגיות קראמבל טריות מהתנור"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/60 to-background/80" />
      </div>

      {/* Floating Sparkles */}
      <FloatingSparkle delay={0} left="15%" top="25%" />
      <FloatingSparkle delay={0.5} left="80%" top="20%" />
      <FloatingSparkle delay={1} left="25%" top="70%" />
      <FloatingSparkle delay={1.5} left="75%" top="65%" />
      <FloatingSparkle delay={2} left="10%" top="50%" />
      <FloatingSparkle delay={2.5} left="85%" top="45%" />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div 
          className={`max-w-2xl mx-auto text-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Made with love badge */}
          <div className="inline-flex items-center gap-2 bg-accent/10 backdrop-blur-sm border border-accent/20 rounded-full px-4 py-1.5 mb-6 animate-bounce-gentle">
            <Heart className="h-3.5 w-3.5 text-accent fill-accent animate-pulse" />
            <span className="text-accent font-medium tracking-wider uppercase text-xs">
              מיוצר באהבה
            </span>
            <Heart className="h-3.5 w-3.5 text-accent fill-accent animate-pulse" />
          </div>
          
          {/* Main title with gradient and glow */}
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 relative">
            <span className="relative inline-block">
              <span className="gradient-text animate-sparkle drop-shadow-lg">
                מזון האושר
              </span>
              {/* Glow effect behind text */}
              <span className="absolute inset-0 gradient-text blur-xl opacity-50 -z-10">
                מזון האושר
              </span>
            </span>
          </h1>
          
          {/* Typewriter text with enhanced styling */}
          <div className="relative min-h-[4rem] flex items-center justify-center mb-8">
            <p className="text-xl md:text-2xl lg:text-3xl text-foreground/80 font-display font-medium">
              <span className="relative">
                {displayedText}
                <span 
                  className={`inline-block w-0.5 h-6 md:h-7 lg:h-8 bg-accent mr-1 align-middle ${
                    isTyping ? 'animate-blink' : 'opacity-0'
                  }`}
                />
              </span>
            </p>
          </div>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-accent/50 to-accent" />
            <Sparkles className="h-4 w-4 text-accent animate-pulse" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent via-accent/50 to-accent" />
          </div>
          
          {/* CTA Button */}
          <Button 
            variant="honey" 
            size="lg"
            className="animate-glow-pulse hover:scale-105 transition-transform duration-300 text-base px-8"
            onClick={() => document.getElementById('cookies')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Sparkles className="h-4 w-4 ml-2" />
            צפו בתפריט
          </Button>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
    </section>
  );
};

export default Hero;