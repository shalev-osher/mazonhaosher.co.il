import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import heroImage from "@/assets/hero-cookies.jpg";
import logo from "@/assets/logo.png";
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

// Cookie cursor follower hook
const useCookieCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const targetRef = useRef({ x: -100, y: -100 });
  const animRef = useRef<number>();

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      setPos(prev => ({
        x: prev.x + (targetRef.current.x - prev.x) * 0.15,
        y: prev.y + (targetRef.current.y - prev.y) * 0.15,
      }));
      animRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove);
    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return pos;
};

// Cookie crumb particle component
const CookieCrumb = ({ delay, duration, left, size }: { delay: number; duration: number; left: string; size: number }) => (
  <div
    className="absolute top-0 pointer-events-none opacity-0"
    style={{
      left,
      animation: `crumbFall ${duration}s ${delay}s ease-in infinite`,
    }}
  >
    <div
      className="rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: `radial-gradient(circle, rgba(210,160,90,0.8) 0%, rgba(180,130,60,0.4) 100%)`,
        animation: `crumbSpin ${duration * 0.7}s ${delay}s linear infinite`,
      }}
    />
  </div>
);

const Hero = () => {
  const { isRTL } = useLanguage();
  
  const { displayedText, isTyping } = useTypewriter(
    isRTL ? "אופים לכם אושר" : "Baking Happiness",
    60,
    1000,
    3500
  );

  const parallaxOffset = useParallax(0.4);
  const [isVisible, setIsVisible] = useState(false);
  const cursorPos = useCookieCursor();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const highlights = isRTL
    ? ["🍪 עוגיות בוטיק", "🎁 מארזי מתנה", "🚚 משלוחים עד הבית", "❤️ אפייה באהבה"]
    : ["🍪 Boutique Cookies", "🎁 Gift Packages", "🚚 Home Delivery", "❤️ Baked with Love"];

  const crumbs = useMemo(() => 
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      delay: i * 1.2 + Math.random() * 2,
      duration: 6 + Math.random() * 4,
      left: `${5 + (i * 6.5) % 90}%`,
      size: 3 + Math.random() * 5,
    })), []
  );

  return (
    <>
      <style>{`
        @keyframes crumbFall {
          0% { transform: translateY(-10px); opacity: 0; }
          10% { opacity: 0.7; }
          90% { opacity: 0.3; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes crumbSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes bounceIn {
          0% { transform: scale(0) translateY(20px); opacity: 0; }
          60% { transform: scale(1.15) translateY(-5px); opacity: 1; }
          80% { transform: scale(0.95) translateY(2px); }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes goldenRing {
          0% { transform: scale(0.8); opacity: 0; box-shadow: 0 0 0 0 rgba(245,158,11,0.6); }
          50% { transform: scale(1.05); opacity: 1; box-shadow: 0 0 30px 10px rgba(245,158,11,0.3); }
          100% { transform: scale(1.2); opacity: 0; box-shadow: 0 0 0 0 rgba(245,158,11,0); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          25% { background-position: 50% 100%; }
          50% { background-position: 100% 50%; }
          75% { background-position: 50% 0%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* Cookie cursor follower */}
      <div
        className="fixed z-[9999] pointer-events-none select-none"
        style={{
          left: cursorPos.x - 12,
          top: cursorPos.y - 12,
          transition: 'opacity 0.3s',
          opacity: cursorPos.x > 0 ? 0.8 : 0,
        }}
      >
        <span className="text-2xl drop-shadow-lg" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>🍪</span>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated gradient overlay */}
        <div
          className="absolute inset-0 z-[0] opacity-40"
          style={{
            background: 'linear-gradient(135deg, rgba(139,69,19,0.6) 0%, rgba(210,105,30,0.4) 25%, rgba(184,115,51,0.5) 50%, rgba(101,67,33,0.6) 75%, rgba(139,69,19,0.6) 100%)',
            backgroundSize: '400% 400%',
            animation: 'gradientShift 12s ease infinite',
          }}
        />

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
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.85) 100%)' }} />
        </div>

        {/* Cookie crumb particles */}
        <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
          {crumbs.map((c) => (
            <CookieCrumb key={c.id} delay={c.delay} duration={c.duration} left={c.left} size={c.size} />
          ))}
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div 
            className={`max-w-2xl mx-auto text-center transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            
            {/* Logo with golden ring pulse */}
            <div className="relative mb-4">
              <div className="relative inline-block">
                <img 
                  src={logo}
                  alt={isRTL ? "מזון האושר" : "Mazon HaOsher"}
                  className="h-36 md:h-44 lg:h-52 w-auto mx-auto drop-shadow-2xl relative z-10"
                />
                {/* Golden ring pulse */}
                <div
                  className="absolute inset-0 rounded-full z-0 pointer-events-none"
                  style={{
                    animation: 'goldenRing 3s ease-out infinite',
                    border: '2px solid rgba(245,158,11,0.4)',
                    margin: '-10%',
                  }}
                />
                <div
                  className="absolute inset-0 rounded-full z-0 pointer-events-none"
                  style={{
                    animation: 'goldenRing 3s 1.5s ease-out infinite',
                    border: '2px solid rgba(245,158,11,0.3)',
                    margin: '-10%',
                  }}
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center -z-10">
                <div className="w-48 md:w-56 lg:w-64 h-48 md:h-56 lg:h-64 rounded-full blur-3xl animate-pulse" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.25) 0%, transparent 70%)' }} />
              </div>
            </div>
            
            {/* Typewriter */}
            <div className="relative min-h-[2.5rem] flex items-center justify-center mb-2">
              <p className="text-2xl md:text-3xl lg:text-4xl text-white font-display font-medium drop-shadow-lg">
                <span className="relative">
                  {displayedText}
                  <span 
                    className={`inline-block w-0.5 h-7 md:h-8 lg:h-10 mr-1 align-middle ${
                      isTyping ? 'animate-blink' : 'opacity-0'
                    }`}
                    style={{ background: '#f59e0b' }}
                  />
                </span>
              </p>
            </div>

            {/* Subtitle */}
            <p className="text-base md:text-lg text-white/70 mb-6 font-light">
              {isRTL ? "עוגיות בוטיק בעבודת יד · טעמים שלא תשכחו" : "Handcrafted boutique cookies · Flavors you won't forget"}
            </p>

            {/* Decorative line */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px w-20" style={{ background: 'linear-gradient(to right, transparent, rgba(245,158,11,0.6), rgba(245,158,11,0.8))' }} />
              <span className="text-lg">🍪</span>
              <div className="h-px w-20" style={{ background: 'linear-gradient(to left, transparent, rgba(245,158,11,0.6), rgba(245,158,11,0.8))' }} />
            </div>
            
            {/* Social CTA Buttons - Arc Layout with bounce-in */}
            <div className="flex items-end justify-center gap-5 md:gap-7 mb-6">
              {/* WhatsApp */}
              <a
                href="https://wa.me/972546791198?text=%D7%94%D7%99%D7%99%2C%20%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%94%D7%96%D7%9E%D7%99%D7%9F%20%D7%A2%D7%95%D7%92%D7%99%D7%95%D7%AA%20%F0%9F%8D%AA"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 translate-y-3"
                style={{ animation: isVisible ? 'bounceIn 0.6s 0.8s both' : 'none' }}
              >
                <div
                  className="w-16 h-16 md:w-[4.5rem] md:h-[4.5rem] rounded-full flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl"
                  style={{ background: '#25D366', boxShadow: '0 8px 25px rgba(37,211,102,0.4)' }}
                >
                  <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-9 md:h-9 fill-white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <span className="text-xs text-white/60 font-light">WhatsApp</span>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/mazon_haosher"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 -translate-y-2"
                style={{ animation: isVisible ? 'bounceIn 0.6s 1.0s both' : 'none' }}
              >
                <div
                  className="w-[4.5rem] h-[4.5rem] md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl"
                  style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', boxShadow: '0 8px 25px rgba(220,39,67,0.4)' }}
                >
                  <svg viewBox="0 0 24 24" className="w-9 h-9 md:w-10 md:h-10 fill-white">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </div>
                <span className="text-xs text-white/60 font-light">Instagram</span>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/profile.php?id=61576498498498"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 translate-y-3"
                style={{ animation: isVisible ? 'bounceIn 0.6s 1.2s both' : 'none' }}
              >
                <div
                  className="w-16 h-16 md:w-[4.5rem] md:h-[4.5rem] rounded-full flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl"
                  style={{ background: '#1877F2', boxShadow: '0 8px 25px rgba(24,119,242,0.4)' }}
                >
                  <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-9 md:h-9 fill-white">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <span className="text-xs text-white/60 font-light">Facebook</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom fade into highlights */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="h-24" style={{ background: 'linear-gradient(to bottom, transparent, hsl(var(--background)))' }} />
        </div>
      </section>

      {/* Highlights Strip */}
      <section className="relative z-20 bg-background py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {highlights.map((item, i) => (
              <div 
                key={i}
                className="text-center py-4 px-3 rounded-2xl border border-border/50 bg-card/50 hover:bg-card transition-colors duration-300"
              >
                <p className="text-sm md:text-base font-medium text-foreground">{item}</p>
              </div>
            ))}
          </div>
          
          <p className="text-center text-muted-foreground text-base md:text-lg mt-8">
            {isRTL ? "© מזון האושר 2026 · כל הזכויות שמורות" : "© Mazon HaOsher 2026 · All rights reserved"}
          </p>
        </div>
      </section>
    </>
  );
};

export default Hero;
