import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import heroImage from "@/assets/hero-cookies.jpg";
import logo from "@/assets/logo.png";
import { useLanguage } from "@/contexts/LanguageContext";

const useMultiTypewriter = (phrases: string[], speed = 50, deleteSpeed = 30, pauseTime = 2500, delay = 500) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const animate = () => {
      const currentPhrase = phrases[phraseIndex];
      if (!isDeleting) {
        if (charIndex < currentPhrase.length) {
          setDisplayedText(currentPhrase.slice(0, charIndex + 1));
          charIndex++;
          setIsTyping(true);
          timeout = setTimeout(animate, speed);
        } else {
          setIsTyping(false);
          timeout = setTimeout(() => { isDeleting = true; animate(); }, pauseTime);
        }
      } else {
        if (charIndex > 0) {
          charIndex--;
          setDisplayedText(currentPhrase.slice(0, charIndex));
          setIsTyping(true);
          timeout = setTimeout(animate, deleteSpeed);
        } else {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setIsTyping(false);
          timeout = setTimeout(animate, delay);
        }
      }
    };

    timeout = setTimeout(animate, delay);
    return () => clearTimeout(timeout);
  }, [phrases, speed, deleteSpeed, pauseTime, delay]);

  return { displayedText, isTyping };
};

const useParallax = (speed = 0.5) => {
  const [offset, setOffset] = useState(0);
  const handleScroll = useCallback(() => {
    requestAnimationFrame(() => setOffset(window.scrollY * speed));
  }, [speed]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return offset;
};

const useCookieCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const targetRef = useRef({ x: -100, y: -100 });
  const animRef = useRef<number>();

  useEffect(() => {
    const onMove = (e: MouseEvent) => { targetRef.current = { x: e.clientX, y: e.clientY }; };
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

// Soft, pleasant hover sound
const useHoverSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const playClick = useCallback(() => {
    try {
      if (!audioContextRef.current) audioContextRef.current = new AudioContext();
      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(680, ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    } catch {}
  }, []);
  return playClick;
};

// Cookie crumb shapes
const crumbShapes = [
  // Irregular cookie chunk
  "M4,1 Q6,0 8,1.5 Q10,3 9,5 Q8,7 6,7.5 Q3,8 1.5,6 Q0,4 1,2.5 Q2,0.5 4,1Z",
  // Rounded chip
  "M3,0.5 Q6,-0.5 8,1 Q10,2.5 9.5,5 Q9,7.5 6.5,8 Q3,8.5 1,6.5 Q-0.5,4.5 0.5,2 Q1.5,0.5 3,0.5Z",
  // Crescent piece
  "M2,0 Q5,-1 8,1 Q10,3 8,6 Q6,8 4,7 Q2,6 1,4 Q0,2 2,0Z",
];

const CookieCrumb = ({ delay, duration, left, size }: { delay: number; duration: number; left: string; size: number }) => (
  <div
    className="absolute top-0 pointer-events-none opacity-0"
    style={{ left, animation: `crumbFall ${duration}s ${delay}s ease-in infinite` }}
  >
    <svg
      width={size}
      height={size}
      viewBox="0 0 10 8"
      style={{ animation: `crumbSpin ${duration * 0.7}s ${delay}s linear infinite` }}
    >
      <path
        d={crumbShapes[Math.floor(delay * 10) % crumbShapes.length]}
        fill={`hsl(${30 + (delay * 5) % 15}, ${60 + (delay * 3) % 20}%, ${50 + (delay * 2) % 15}%)`}
        opacity="0.7"
      />
    </svg>
  </div>
);

const Hero = () => {
  const { isRTL } = useLanguage();
  const phrases = useMemo(() =>
    isRTL
      ? ["אופים לכם אושר", "טעם של בית", "כל עוגיה סיפור", "מתוק מהלב"]
      : ["Baking Happiness", "Taste of Home", "Every Cookie a Story", "Sweet from the Heart"],
    [isRTL]
  );

  const { displayedText, isTyping } = useMultiTypewriter(phrases, 60, 30, 2500, 500);
  const parallaxOffset = useParallax(0.4);
  const [isVisible, setIsVisible] = useState(false);
  const cursorPos = useCookieCursor();
  const playClick = useHoverSound();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const highlights = isRTL
    ? ["🍪 עוגיות בוטיק", "🎁 מארזי מתנה", "🚚 משלוחים עד הבית", "❤️ אפייה באהבה"]
    : ["🍪 Boutique Cookies", "🎁 Gift Packages", "🚚 Home Delivery", "❤️ Baked with Love"];

  const crumbs = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      delay: i * 1.4 + Math.random() * 2,
      duration: 7 + Math.random() * 4,
      left: `${5 + (i * 7.5) % 90}%`,
      size: 12 + Math.random() * 14,
    })), []
  );

  const socials = [
    {
      href: "https://wa.me/972546791198?text=%D7%94%D7%99%D7%99%2C%20%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%94%D7%96%D7%9E%D7%99%D7%9F%20%D7%A2%D7%95%D7%92%D7%99%D7%95%D7%AA%20%F0%9F%8D%AA",
      label: "WhatsApp",
      bg: "linear-gradient(135deg, #25D366, #128C7E)",
      glow: "rgba(37,211,102,0.5)",
      animDelay: "0.8s",
      y: "translate-y-3",
      size: "w-16 h-16 md:w-[4.5rem] md:h-[4.5rem]",
      iconSize: "w-8 h-8 md:w-9 md:h-9",
      path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z",
    },
    {
      href: "https://www.instagram.com/mazon_haosher",
      label: "Instagram",
      bg: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
      glow: "rgba(220,39,67,0.5)",
      animDelay: "1.0s",
      y: "-translate-y-2",
      size: "w-[4.5rem] h-[4.5rem] md:w-20 md:h-20",
      iconSize: "w-9 h-9 md:w-10 md:h-10",
      path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
    },
    {
      href: "https://www.facebook.com/profile.php?id=61576498498498",
      label: "Facebook",
      bg: "linear-gradient(135deg, #1877F2, #0C5DC7)",
      glow: "rgba(24,119,242,0.5)",
      animDelay: "1.2s",
      y: "translate-y-3",
      size: "w-16 h-16 md:w-[4.5rem] md:h-[4.5rem]",
      iconSize: "w-8 h-8 md:w-9 md:h-9",
      path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
    },
  ];

  return (
    <>
      <style>{`
        @keyframes crumbFall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.2; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
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
        @keyframes logo3D {
          0% { transform: perspective(800px) rotateY(0deg); }
          25% { transform: perspective(800px) rotateY(8deg); }
          50% { transform: perspective(800px) rotateY(0deg); }
          75% { transform: perspective(800px) rotateY(-8deg); }
          100% { transform: perspective(800px) rotateY(0deg); }
        }
        @keyframes socialGlow {
          0%, 100% { box-shadow: 0 8px 25px var(--glow-color); }
          50% { box-shadow: 0 8px 40px var(--glow-color), 0 0 60px var(--glow-color); }
        }
        @keyframes goldFloat {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.15; }
          50% { transform: translateY(-20px) scale(1.1); opacity: 0.25; }
        }
      `}</style>

      {/* Cookie cursor */}
      <div
        className="fixed z-[9999] pointer-events-none select-none"
        style={{
          left: cursorPos.x - 12,
          top: cursorPos.y - 12,
          transition: 'opacity 0.3s',
          opacity: cursorPos.x > 0 ? 0.8 : 0,
        }}
      >
        <span className="text-2xl drop-shadow-lg">🍪</span>
      </div>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with Parallax */}
        <div
          className="absolute inset-0 z-0 will-change-transform"
          style={{ transform: `translateY(${parallaxOffset}px) scale(1.1)`, top: '-5%', height: '110%' }}
        >
          <img src={heroImage} alt="עוגיות קראמבל טריות מהתנור" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.85) 100%)' }} />
        </div>

        {/* Luxury floating gold orbs */}
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          <div className="absolute w-64 h-64 rounded-full blur-3xl" style={{ top: '10%', left: '15%', background: 'radial-gradient(circle, hsla(40,90%,55%,0.12) 0%, transparent 70%)', animation: 'goldFloat 8s ease-in-out infinite' }} />
          <div className="absolute w-48 h-48 rounded-full blur-3xl" style={{ bottom: '20%', right: '10%', background: 'radial-gradient(circle, hsla(350,65%,55%,0.1) 0%, transparent 70%)', animation: 'goldFloat 10s ease-in-out 2s infinite' }} />
        </div>

        {/* Cookie crumbs */}
        <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none">
          {crumbs.map((c) => (
            <CookieCrumb key={c.id} delay={c.delay} duration={c.duration} left={c.left} size={c.size} />
          ))}
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className={`max-w-2xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

            {/* Logo */}
            <div className="relative mb-4">
              <img
                src={logo}
                alt={isRTL ? "מזון האושר" : "Mazon HaOsher"}
                className="h-36 md:h-44 lg:h-52 w-auto mx-auto drop-shadow-2xl"
                style={{ animation: 'logo3D 6s ease-in-out infinite' }}
              />
              <div className="absolute inset-0 flex items-center justify-center -z-10">
                <div className="w-48 md:w-56 lg:w-64 h-48 md:h-56 lg:h-64 rounded-full blur-3xl animate-pulse" style={{ background: 'radial-gradient(circle, hsla(40,90%,55%,0.2) 0%, transparent 70%)' }} />
              </div>
            </div>

            {/* Typewriter */}
            <div className="relative min-h-[2.5rem] flex items-center justify-center mb-2">
              <p className="text-2xl md:text-3xl lg:text-4xl text-white font-display font-medium drop-shadow-lg">
                <span className="relative">
                  {displayedText}
                  <span className={`inline-block w-0.5 h-7 md:h-8 lg:h-10 mr-1 align-middle animate-blink`} style={{ background: 'hsl(var(--amber))' }} />
                </span>
              </p>
            </div>

            <p className="text-base md:text-lg text-white/70 mb-6 font-light">
              {isRTL ? "עוגיות בוטיק בעבודת יד · טעמים שלא תשכחו" : "Handcrafted boutique cookies · Flavors you won't forget"}
            </p>

            {/* Decorative line */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px w-20" style={{ background: 'linear-gradient(to right, transparent, hsla(40,90%,55%,0.6), hsla(40,90%,55%,0.8))' }} />
              <span className="text-lg">🍪</span>
              <div className="h-px w-20" style={{ background: 'linear-gradient(to left, transparent, hsla(40,90%,55%,0.6), hsla(40,90%,55%,0.8))' }} />
            </div>

            {/* Luxurious Social Icons */}
            <div className="flex items-end justify-center gap-5 md:gap-7 mb-6">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex flex-col items-center gap-2 ${s.y}`}
                  style={{ animation: isVisible ? `bounceIn 0.6s ${s.animDelay} both` : 'none' }}
                  onMouseEnter={playClick}
                >
                  <div
                    className={`${s.size} rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110`}
                    style={{
                      background: s.bg,
                      boxShadow: `0 8px 25px ${s.glow}`,
                      '--glow-color': s.glow,
                      animation: `socialGlow 3s ease-in-out infinite`,
                    } as React.CSSProperties}
                  >
                    {/* Inner ring for luxury feel */}
                    <div className="absolute inset-1 rounded-full border border-white/20" />
                    <svg viewBox="0 0 24 24" className={`${s.iconSize} fill-white relative z-10 drop-shadow-md`}>
                      <path d={s.path} />
                    </svg>
                  </div>
                  <span className="text-xs text-white/50 font-light tracking-wider uppercase">{s.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="h-24" style={{ background: 'linear-gradient(to bottom, transparent, hsl(var(--background)))' }} />
        </div>
      </section>

      {/* Highlights */}
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
