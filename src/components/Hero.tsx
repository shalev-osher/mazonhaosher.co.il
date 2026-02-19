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

const GoldenSparkle = ({ delay, duration, left, size }: { delay: number; duration: number; left: string; size: number }) => (
  <div
    className="absolute top-0 pointer-events-none opacity-0"
    style={{ left, animation: `crumbFall ${duration}s ${delay}s ease-in infinite` }}
  >
    <div
      className="rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: `radial-gradient(circle, hsla(40,85%,65%,0.9) 0%, hsla(35,80%,50%,0.3) 60%, transparent 100%)`,
        boxShadow: `0 0 ${size}px hsla(40,90%,55%,0.4)`,
      }}
    />
  </div>
);

// Twinkling star
const TwinkleStar = ({ top, left, size, delay }: { top: string; left: string; size: number; delay: number }) => (
  <div
    className="absolute pointer-events-none rounded-full"
    style={{
      top, left,
      width: `${size}px`,
      height: `${size}px`,
      background: 'hsla(40,90%,80%,0.9)',
      boxShadow: `0 0 ${size * 2}px hsla(40,90%,65%,0.6), 0 0 ${size * 4}px hsla(40,90%,55%,0.3)`,
      animation: `twinkle ${2.5 + delay * 0.5}s ease-in-out ${delay}s infinite`,
    }}
  />
);
const MarqueeBanner = ({ isRTL }: { isRTL: boolean }) => {
  const phrases = useMemo(() =>
    isRTL
      ? ["🍪 מוזמנים לקניון ברנע (שד׳ ירושלים 119 אשקלון) מדי יום ו׳ בין השעות 7:30-14:30", "❤️ אפייה טרייה בעבודת יד", "🎁 מארזים מיוחדים לאירועים"]
      : ["🍪 Visit us at Barnea Mall every Friday 7:30-14:30", "❤️ Freshly baked by hand", "🎁 Special event packages"],
    [isRTL]
  );
  const { displayedText } = useMultiTypewriter(phrases, 50, 25, 3000, 400);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center px-5 py-2 bg-background border border-border rounded-full shadow-sm min-w-[280px] justify-center">
        <span className="text-sm md:text-base font-medium text-muted-foreground whitespace-nowrap">
          {displayedText}
          <span className="inline-block w-0.5 h-4 mr-1 align-middle animate-blink bg-muted-foreground/50" />
        </span>
      </div>
    </div>
  );
};

const useScrollReveal = (threshold = 0.2) => {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setRevealed(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, revealed };
};
const Hero = () => {

  const { isRTL } = useLanguage();
  const phrases = useMemo(() =>
    isRTL
      ? ["אופים לכם אושר", "טעם של בית", "כל עוגיה סיפור", "מתוק מהלב"]
      : ["Baking Happiness", "Taste of Home", "Every Cookie a Story", "Sweet from the Heart"],
    [isRTL]
  );

  const { displayedText } = useMultiTypewriter(phrases, 60, 30, 2500, 500);
  const parallaxOffset = useParallax(0.7);
  const [isVisible, setIsVisible] = useState(false);
  const cursorPos = useCookieCursor();
  const playClick = useHoverSound();
  const highlightsReveal = useScrollReveal(0.3);
  const heroRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleHeroMouse = useCallback((e: React.MouseEvent) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  const stars = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      top: `${5 + Math.random() * 85}%`,
      left: `${5 + Math.random() * 90}%`,
      size: 1.5 + Math.random() * 2.5,
      delay: Math.random() * 3,
    })), []
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const highlights = isRTL
    ? ["🍪 עוגיות בוטיק", "🎁 מארזי מתנה", "🚚 משלוחים עד הבית", "❤️ אפייה באהבה"]
    : ["🍪 Boutique Cookies", "🎁 Gift Packages", "🚚 Home Delivery", "❤️ Baked with Love"];

  const sparkles = useMemo(() =>
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      delay: i * 1.8 + Math.random() * 3,
      duration: 8 + Math.random() * 5,
      left: `${8 + (i * 9) % 85}%`,
      size: 4 + Math.random() * 4,
    })), []
  );

  const socials = [
    {
      href: "https://wa.me/972546791198?text=%D7%94%D7%99%D7%99%2C%20%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%94%D7%96%D7%9E%D7%99%D7%9F%20%D7%A2%D7%95%D7%92%D7%99%D7%95%D7%AA%20%F0%9F%8D%AA",
      label: "WhatsApp", bg: "linear-gradient(135deg, #25D366, #128C7E)", glow: "rgba(37,211,102,0.5)",
      animDelay: "1.0s", y: "translate-y-3", size: "w-16 h-16 md:w-[4.5rem] md:h-[4.5rem]", iconSize: "w-8 h-8 md:w-9 md:h-9",
      path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z",
    },
    {
      href: "https://www.instagram.com/mazon_haosher",
      label: "Instagram", bg: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)", glow: "rgba(220,39,67,0.5)",
      animDelay: "1.2s", y: "-translate-y-2", size: "w-[4.5rem] h-[4.5rem] md:w-20 md:h-20", iconSize: "w-9 h-9 md:w-10 md:h-10",
      path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
    },
    {
      href: "https://www.facebook.com/profile.php?id=61576498498498",
      label: "Facebook", bg: "linear-gradient(135deg, #1877F2, #0C5DC7)", glow: "rgba(24,119,242,0.5)",
      animDelay: "1.4s", y: "translate-y-3", size: "w-16 h-16 md:w-[4.5rem] md:h-[4.5rem]", iconSize: "w-8 h-8 md:w-9 md:h-9",
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
        @keyframes textGlow {
          0%, 100% { text-shadow: 0 0 10px hsla(40,90%,55%,0.3), 0 0 30px hsla(40,90%,55%,0.1); }
          50% { text-shadow: 0 0 20px hsla(40,90%,55%,0.5), 0 0 50px hsla(40,90%,55%,0.2), 0 0 80px hsla(40,90%,55%,0.1); }
        }
        @keyframes cinematic {
          0% { opacity: 0; transform: scale(1.1) translateY(30px); filter: blur(8px); }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
        }
        @keyframes gradientText {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes goldWave {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes highlightReveal {
          0% { opacity: 0; transform: translateY(25px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.3); }
        }
      `}</style>

      {/* Running marquee banner */}
      <MarqueeBanner isRTL={isRTL} />

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

      <section ref={heroRef} onMouseMove={handleHeroMouse} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-8">
        {/* Mouse-reactive radial glow */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none transition-opacity duration-500"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, hsla(40,90%,55%,0.12) 0%, transparent 60%)`,
          }}
        />

        {/* Background with stronger Parallax */}
        <div
          className="absolute inset-0 z-0 will-change-transform"
          style={{ transform: `translateY(${parallaxOffset}px) scale(1.2)`, top: '-10%', height: '120%' }}
        >
          <img src={heroImage} alt="עוגיות קראמבל טריות מהתנור" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.85) 100%)' }} />
        </div>

        {/* Twinkling stars */}
        <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
          {stars.map((s) => (
            <TwinkleStar key={s.id} top={s.top} left={s.left} size={s.size} delay={s.delay} />
          ))}
        </div>

        {/* Luxury floating gold orbs */}
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          <div className="absolute w-72 h-72 rounded-full blur-3xl" style={{ top: '10%', left: '15%', background: 'radial-gradient(circle, hsla(40,90%,55%,0.15) 0%, transparent 70%)', animation: 'goldFloat 8s ease-in-out infinite' }} />
          <div className="absolute w-56 h-56 rounded-full blur-3xl" style={{ bottom: '20%', right: '10%', background: 'radial-gradient(circle, hsla(350,65%,55%,0.12) 0%, transparent 70%)', animation: 'goldFloat 10s ease-in-out 2s infinite' }} />
          <div className="absolute w-40 h-40 rounded-full blur-3xl" style={{ top: '50%', left: '60%', background: 'radial-gradient(circle, hsla(280,60%,60%,0.08) 0%, transparent 70%)', animation: 'goldFloat 12s ease-in-out 4s infinite' }} />
        </div>

        {/* Golden sparkles */}
        <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none">
          {sparkles.map((c) => (
            <GoldenSparkle key={c.id} delay={c.delay} duration={c.duration} left={c.left} size={c.size} />
          ))}
        </div>

        {/* Content with cinematic entrance */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">

            {/* Logo - cinematic entrance */}
            <div
              className="relative mb-4"
              style={{
                opacity: 0,
                animation: isVisible ? 'cinematic 1.2s cubic-bezier(0.16,1,0.3,1) 0.2s forwards' : 'none',
              }}
            >
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

            {/* Typewriter with golden glow */}
            <div
              className="relative min-h-[2.5rem] flex items-center justify-center mb-2"
              style={{
                opacity: 0,
                animation: isVisible ? 'cinematic 1s cubic-bezier(0.16,1,0.3,1) 0.6s forwards' : 'none',
              }}
            >
              <p
                className="text-2xl md:text-3xl lg:text-4xl text-white font-display font-medium"
                style={{ animation: 'textGlow 4s ease-in-out infinite' }}
              >
                <span className="relative">
                  {displayedText}
                  <span className="inline-block w-0.5 h-7 md:h-8 lg:h-10 mr-1 align-middle animate-blink" style={{ background: 'hsl(var(--amber))' }} />
                </span>
              </p>
            </div>

            {/* Animated gradient subtitle */}
            <p
              className="text-base md:text-lg mb-6 font-light"
              style={{
                opacity: 0,
                animation: isVisible ? 'cinematic 1s cubic-bezier(0.16,1,0.3,1) 0.9s forwards' : 'none',
                background: 'linear-gradient(90deg, hsla(40,90%,70%,1), hsla(350,65%,70%,1), hsla(280,60%,70%,1), hsla(40,90%,70%,1))',
                backgroundSize: '300% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                ...(isVisible ? { animationName: 'cinematic, gradientText', animationDuration: '1s, 6s', animationTimingFunction: 'cubic-bezier(0.16,1,0.3,1), ease-in-out', animationDelay: '0.9s, 0s', animationIterationCount: '1, infinite', animationFillMode: 'forwards, none' } : {}),
              }}
            >
              {isRTL ? "עוגיות בוטיק בעבודת יד · טעמים שלא תשכחו" : "Handcrafted boutique cookies · Flavors you won't forget"}
            </p>

            {/* Animated gold wave separator */}
            <div
              className="flex items-center justify-center gap-3 mb-8"
              style={{
                opacity: 0,
                animation: isVisible ? 'cinematic 0.8s cubic-bezier(0.16,1,0.3,1) 1.1s forwards' : 'none',
              }}
            >
              <div className="relative h-px w-24 overflow-hidden">
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent, hsla(40,90%,55%,0.4))' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent, hsla(40,90%,65%,0.9), transparent)', animation: 'goldWave 3s ease-in-out infinite' }} />
              </div>
              <span className="text-lg">🍪</span>
              <div className="relative h-px w-24 overflow-hidden">
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to left, transparent, hsla(40,90%,55%,0.4))' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent, hsla(40,90%,65%,0.9), transparent)', animation: 'goldWave 3s ease-in-out infinite reverse' }} />
              </div>
            </div>

            {/* Social Icons */}
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

      {/* Gold wave divider */}
      <div className="relative z-20 bg-background overflow-hidden">
        <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent 10%, hsla(40,90%,55%,0.3) 30%, hsla(40,90%,55%,0.6) 50%, hsla(40,90%,55%,0.3) 70%, transparent 90%)' }} />
      </div>

      {/* Highlights with scroll reveal */}
      <section ref={highlightsReveal.ref} className="relative z-20 bg-background py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {highlights.map((item, i) => (
              <div
                key={i}
                className="text-center py-4 px-3 rounded-2xl border border-border/50 bg-card/50 hover:bg-card transition-all duration-500 hover:shadow-lg hover:-translate-y-1"
                style={{
                  opacity: 0,
                  animation: highlightsReveal.revealed ? `highlightReveal 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s forwards` : 'none',
                }}
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
