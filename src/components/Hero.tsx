import { Button } from "./ui/button";
import { useState, useEffect, useCallback } from "react";
import heroImage from "@/assets/hero-cookies.jpg";
import logo from "@/assets/logo.png";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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
    <Sparkles className="h-4 w-4 text-amber-500/60" />
  </div>
);

const Hero = () => {
  const { t, isRTL } = useLanguage();
  
  const { displayedText, isTyping } = useTypewriter(
    isRTL ? "אופים לכם אושר" : "Baking Happiness",
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
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background" />
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
          className={`max-w-2xl mx-auto text-center -mt-12 md:-mt-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          
          {/* Logo with glow effect */}
          <div className="relative mb-0">
            <img 
              src={logo}
              alt={isRTL ? "מזון האושר" : "Mazon HaOsher"}
              className="h-32 md:h-40 lg:h-48 w-auto mx-auto drop-shadow-2xl"
            />
            {/* Glow effect behind logo */}
            <div className="absolute inset-0 flex items-center justify-center -z-10">
              <div className="w-40 md:w-48 lg:w-56 h-40 md:h-48 lg:h-56 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
            </div>
          </div>
          
          {/* Typewriter text with enhanced styling */}
          <div className="relative min-h-[2.5rem] flex items-center justify-center mb-0">
            <p className="text-2xl md:text-3xl lg:text-4xl text-foreground/80 font-display font-medium">
              <span className="relative">
                {displayedText}
                <span 
                  className={`inline-block w-0.5 h-7 md:h-8 lg:h-10 bg-amber-500 mr-1 align-middle ${
                    isTyping ? 'animate-blink' : 'opacity-0'
                  }`}
                />
              </span>
            </p>
          </div>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-500/50 to-amber-500" />
            <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent via-amber-500/50 to-amber-500" />
          </div>
          
          {/* Social CTA Buttons */}
          <div className="flex items-center justify-center gap-4">
            {/* WhatsApp */}
            <a
              href="https://wa.me/972546791198?text=%D7%94%D7%99%D7%99%2C%20%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%94%D7%96%D7%9E%D7%99%D7%9F%20%D7%A2%D7%95%D7%92%D7%99%D7%95%D7%AA%20%F0%9F%8D%AA"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              style={{ background: '#25D366' }}
              aria-label="WhatsApp"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/profile.php?id=61576498498498"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              style={{ background: '#1877F2' }}
              aria-label="Facebook"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/mazon_haosher"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
    </section>
  );
};

export default Hero;