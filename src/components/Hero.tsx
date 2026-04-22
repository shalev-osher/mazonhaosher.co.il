import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import heroImage from "@/assets/hero-cookies.jpg";
import logo from "@/assets/logo.png";
import { useLanguage } from "@/contexts/LanguageContext";
import GoldenParticles from "@/components/GoldenParticles";
import CookieRain from "@/components/CookieRain";
import SpotlightCursor from "@/components/SpotlightCursor";
import { hapticLight, hapticSuccess } from "@/lib/haptic";
import { usePerformanceMode } from "@/lib/performanceMode";

const useTimeGreeting = (t: (k: string) => string) => {
  const [greeting, setGreeting] = useState("");
  useEffect(() => {
    const compute = () => {
      const h = new Date().getHours();
      let key = "ui.greeting.morning";
      if (h >= 5 && h < 12) key = "ui.greeting.morning";
      else if (h >= 12 && h < 17) key = "ui.greeting.afternoon";
      else if (h >= 17 && h < 22) key = "ui.greeting.evening";
      else key = "ui.greeting.night";
      setGreeting(t(key));
    };
    compute();
    const id = setInterval(compute, 60_000);
    return () => clearInterval(id);
  }, [t]);
  return greeting;
};

const useMultiTypewriter = (phrases: string[], speed = 50, deleteSpeed = 30, pauseTime = 2500, delay = 500) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
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
  const [opacity, setOpacity] = useState(1);
  const handleScroll = useCallback(() => {
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      setOffset(scrollY * speed);
      // Fade out hero as user scrolls
      setOpacity(Math.max(0, 1 - scrollY / (window.innerHeight * 0.6)));
    });
  }, [speed]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return { offset, opacity };
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
  const playClick = useCallback(() => {}, []);
  return playClick;
};

const GoldenSparkle = ({ delay, duration, left, size }: { delay: number; duration: number; left: string; size: number }) => (
  <div
    className="absolute top-0 pointer-events-none opacity-0"
    aria-hidden="true"
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
    aria-hidden="true"
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
const heroTypePhrases: Record<string, string[]> = {
  he: ["אופים לכם אושר", "טעם של בית", "כל עוגיה סיפור", "מתוק מהלב"],
  en: ["Baking Happiness", "Taste of Home", "Every Cookie a Story", "Sweet from the Heart"],
  ar: ["نخبز لكم السعادة", "طعم البيت", "كل كوكيز قصة", "حلاوة من القلب"],
  ru: ["Печём счастье", "Вкус дома", "Каждое печенье — история", "Сладость от сердца"],
  es: ["Horneamos felicidad", "Sabor a hogar", "Cada galleta, una historia", "Dulzura del corazón"],
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
  const { isRTL, language, t } = useLanguage();
  const phrases = useMemo(() => heroTypePhrases[language] || heroTypePhrases.en, [language]);

  const { displayedText } = useMultiTypewriter(phrases, 60, 30, 2500, 500);
  const { offset: parallaxOffset, opacity: scrollOpacity } = useParallax(0.7);
  const lowPower = usePerformanceMode();
  const greeting = useTimeGreeting(t);
  const [revealStep, setRevealStep] = useState(0);
  const cursorPos = useCookieCursor();
  const playClick = useHoverSound();

  const heroRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [logoTilt, setLogoTilt] = useState({ x: 0, y: 0 });
  const [rainTrigger, setRainTrigger] = useState(0);
  const logoClicksRef = useRef(0);
  const logoClickTimer = useRef<ReturnType<typeof setTimeout>>();

  const handleHeroMouse = useCallback((e: React.MouseEvent) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
    const lr = logoRef.current?.getBoundingClientRect();
    if (lr) {
      const cx = lr.left + lr.width / 2;
      const cy = lr.top + lr.height / 2;
      const dx = (e.clientX - cx) / lr.width;
      const dy = (e.clientY - cy) / lr.height;
      setLogoTilt({ x: dy * -10, y: dx * 10 });
    }
  }, []);

  const handleLogoClick = useCallback(() => {
    hapticLight();
    logoClicksRef.current += 1;
    if (logoClickTimer.current) clearTimeout(logoClickTimer.current);
    logoClickTimer.current = setTimeout(() => { logoClicksRef.current = 0; }, 1500);
    if (logoClicksRef.current >= 5) {
      setRainTrigger((t) => t + 1);
      hapticSuccess();
      logoClicksRef.current = 0;
    }
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

  // Staggered reveal: background shows first, then elements appear one by one
  useEffect(() => {
    const delays = [300, 1200, 1800, 2400, 2800, 3200];
    const timers = delays.map((d, i) =>
      setTimeout(() => setRevealStep(i + 1), d)
    );
    return () => timers.forEach(clearTimeout);
  }, []);


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
      href: "https://wa.me/972546791198",
      label: "WhatsApp", color: "#25D366",
      animDelay: "1.0s",
      path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z",
    },
    {
      href: "https://www.instagram.com/mazonaosher/",
      label: "Instagram", color: "#E4405F",
      animDelay: "1.1s",
      path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
    },
    {
      href: "https://www.facebook.com/profile.php?id=61565573526817",
      label: "Facebook", color: "#1877F2",
      animDelay: "1.2s",
      path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
    },
    {
      href: "https://www.tiktok.com/@almogosher27/",
      label: "TikTok", color: "#ffffff",
      animDelay: "1.3s",
      path: "M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.18 8.18 0 004.77 1.52V6.84a4.84 4.84 0 01-1-.15z",
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
        @keyframes logoBreathe {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 8px 20px hsla(40,90%,55%,0.25)); }
          50% { transform: scale(1.025); filter: drop-shadow(0 12px 32px hsla(40,90%,55%,0.45)); }
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
        @keyframes cookieSpin {
          0% { transform: scale(0.3) rotate(0deg); opacity: 0; filter: blur(10px); }
          30% { transform: scale(1.1) rotate(180deg); opacity: 1; filter: blur(0); }
          60% { transform: scale(1) rotate(360deg); opacity: 1; }
          80% { transform: scale(1.05) rotate(540deg); opacity: 1; }
          100% { transform: scale(1) rotate(720deg); opacity: 1; }
        }
        @keyframes cookieBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes cookieGlow {
          0%, 100% { filter: drop-shadow(0 0 8px hsla(40,90%,55%,0.3)); }
          50% { filter: drop-shadow(0 0 25px hsla(40,90%,55%,0.7)) drop-shadow(0 0 50px hsla(40,90%,55%,0.3)); }
        }
        @keyframes crumbDrop {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 0.8; }
          100% { transform: translate(var(--crumb-x), 60px) rotate(var(--crumb-r)) scale(0.3); opacity: 0; }
        }
        @keyframes loaderFade {
          0% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; pointer-events: none; }
        }
        @keyframes glowText {
          0%, 100% { text-shadow: 0 0 4px hsla(40,90%,55%,0.3); }
          50% { text-shadow: 0 0 16px hsla(40,90%,55%,0.7), 0 0 40px hsla(40,90%,55%,0.3); }
        }
        @keyframes scrollRevealText {
          0% { opacity: 0; transform: translateY(20px); clip-path: inset(0 0 100% 0); }
          100% { opacity: 1; transform: translateY(0); clip-path: inset(0 0 0% 0); }
        }
        @keyframes pulseCTA {
          0%, 100% { box-shadow: 0 0 0 0 hsla(40,90%,55%,0.5); }
          50% { box-shadow: 0 0 0 12px hsla(40,90%,55%,0); }
        }
        @keyframes movingGradientBg {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes kenBurns {
          0% { transform: scale(1.2) translate(0%, 0%); }
          25% { transform: scale(1.35) translate(-2%, -1%); }
          50% { transform: scale(1.25) translate(1%, -2%); }
          75% { transform: scale(1.3) translate(-1%, 1%); }
          100% { transform: scale(1.2) translate(0%, 0%); }
        }
        @keyframes rippleEffect {
          0% { transform: translate(-50%,-50%) scale(0); opacity: 0.6; }
          100% { transform: translate(-50%,-50%) scale(4); opacity: 0; }
        }
        html { scroll-behavior: smooth; }
      `}</style>

      {/* No separate loader — elements reveal in place */}


      {/* Cookie cursor — decorative */}
      <div
        className="fixed z-[9999] pointer-events-none select-none"
        aria-hidden="true"
        style={{
          left: cursorPos.x - 12,
          top: cursorPos.y - 12,
          transition: 'opacity 0.3s',
          opacity: cursorPos.x > 0 ? 0.8 : 0,
        }}
      >
        <span className="text-2xl drop-shadow-lg">🍪</span>
      </div>

      <main id="main-content" ref={heroRef} onMouseMove={handleHeroMouse} role="main" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-8" style={{ backgroundImage: revealStep < 1 ? 'none' : 'linear-gradient(135deg, hsla(40,90%,55%,0.03) 0%, transparent 30%, hsla(350,65%,55%,0.03) 60%, transparent 100%), linear-gradient(225deg, hsla(280,60%,60%,0.03) 0%, transparent 40%)', backgroundColor: revealStep < 1 ? 'hsl(25, 20%, 6%)' : 'transparent', backgroundSize: '400% 400%', animation: 'movingGradientBg 15s ease-in-out infinite', transition: 'background-color 1s ease, background-image 1s ease' }}>
        {/* Mouse-reactive radial glow */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none transition-opacity duration-500"
          aria-hidden="true"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, hsla(40,90%,55%,0.12) 0%, transparent 60%)`,
          }}
        />

        {/* Background with stronger Parallax — always visible, fades in */}
        <div
          className="absolute inset-0 z-0 will-change-transform transition-opacity duration-1000"
          style={{ transform: `translateY(${parallaxOffset}px)`, top: '-10%', height: '120%', opacity: revealStep >= 1 ? 1 : 0 }}
        >
          <img src={heroImage} alt="עוגיות קראמבל טריות מהתנור" loading="eager" fetchPriority="high" className="w-full h-full object-cover" style={{ animation: 'kenBurns 25s ease-in-out infinite', transformOrigin: 'center center' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.85) 100%)' }} />
        </div>

        {/* Twinkling stars — decorative */}
        <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden" aria-hidden="true">
          {stars.map((s) => (
            <TwinkleStar key={s.id} top={s.top} left={s.left} size={s.size} delay={s.delay} />
          ))}
        </div>

        {/* Luxury floating gold orbs — decorative */}
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute w-72 h-72 rounded-full blur-3xl" style={{ top: '10%', left: '15%', background: 'radial-gradient(circle, hsla(40,90%,55%,0.15) 0%, transparent 70%)', animation: 'goldFloat 8s ease-in-out infinite' }} />
          <div className="absolute w-56 h-56 rounded-full blur-3xl" style={{ bottom: '20%', right: '10%', background: 'radial-gradient(circle, hsla(350,65%,55%,0.12) 0%, transparent 70%)', animation: 'goldFloat 10s ease-in-out 2s infinite' }} />
          <div className="absolute w-40 h-40 rounded-full blur-3xl" style={{ top: '50%', left: '60%', background: 'radial-gradient(circle, hsla(280,60%,60%,0.08) 0%, transparent 70%)', animation: 'goldFloat 12s ease-in-out 4s infinite' }} />
        </div>

        {/* Golden sparkles — decorative */}
        <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none" aria-hidden="true">
          {sparkles.map((c) => (
            <GoldenSparkle key={c.id} delay={c.delay} duration={c.duration} left={c.left} size={c.size} />
          ))}
        </div>

        {/* 40 Golden floating particles */}
        <GoldenParticles count={40} />

        {/* Content with cinematic entrance */}
        <div className="container mx-auto px-4 relative z-10 transition-opacity duration-100" style={{ opacity: scrollOpacity }}>
          <div className="max-w-2xl mx-auto text-center" style={{ transform: `translateY(${parallaxOffset * 0.3}px)` }}>

            {/* Logo - cinematic entrance with 3D tilt + easter egg (5 clicks) */}
            <div
              ref={logoRef}
              className="relative mb-4 cursor-pointer"
              onClick={handleLogoClick}
              role="button"
              tabIndex={0}
              aria-label={t('ui.brandName')}
              onKeyDown={(e) => { if (e.key === 'Enter') handleLogoClick(); }}
              style={{
                opacity: 0,
                animation: revealStep >= 1 ? 'cinematic 1s cubic-bezier(0.16,1,0.3,1) forwards' : 'none',
                perspective: '1000px',
              }}
            >
              <img
                src={logo}
                alt={t('ui.brandName')}
                className="h-36 md:h-44 lg:h-52 w-auto mx-auto drop-shadow-2xl transition-transform duration-200 ease-out"
                style={{
                  animation: 'logo3D 6s ease-in-out infinite',
                  transform: `rotateX(${logoTilt.x}deg) rotateY(${logoTilt.y}deg)`,
                  transformStyle: 'preserve-3d',
                }}
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
                animation: revealStep >= 2 ? 'cinematic 0.8s cubic-bezier(0.16,1,0.3,1) forwards' : 'none',
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
                animation: revealStep >= 3 ? 'cinematic 0.8s cubic-bezier(0.16,1,0.3,1) forwards' : 'none',
                background: 'linear-gradient(90deg, hsla(40,90%,70%,1), hsla(350,65%,70%,1), hsla(280,60%,70%,1), hsla(40,90%,70%,1))',
                backgroundSize: '300% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                ...(revealStep >= 3 ? { animationName: 'cinematic, gradientText', animationDuration: '0.8s, 6s', animationTimingFunction: 'cubic-bezier(0.16,1,0.3,1), ease-in-out', animationDelay: '0s, 0s', animationIterationCount: '1, infinite', animationFillMode: 'forwards, none' } : {}),
              }}
            >
              {t('ui.boutiqueSubtitle')}
            </p>

            {/* Animated gold wave separator */}
            <div
              className="flex items-center justify-center gap-3 mb-8"
              style={{
                opacity: 0,
                animation: revealStep >= 4 ? 'cinematic 0.6s cubic-bezier(0.16,1,0.3,1) forwards' : 'none',
              }}
            >
              <div className="relative h-px w-24 overflow-hidden">
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent, hsla(40,90%,55%,0.4))' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent, hsla(40,90%,65%,0.9), transparent)', animation: 'goldWave 3s ease-in-out infinite' }} />
              </div>
              <span className="text-lg" aria-hidden="true">🍪</span>
              <div className="relative h-px w-24 overflow-hidden">
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to left, transparent, hsla(40,90%,55%,0.4))' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent, hsla(40,90%,65%,0.9), transparent)', animation: 'goldWave 3s ease-in-out infinite reverse' }} />
              </div>
            </div>

            {/* Social Icons */}
            <nav aria-label={t('ui.socialMedia')} className="flex items-center justify-center gap-7 md:gap-9 mb-6">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="group flex flex-col items-center gap-2"
                  style={{ animation: revealStep >= 5 ? `bounceIn 0.6s ${s.animDelay} both` : 'none' }}
                  onMouseEnter={playClick}
                  onClick={hapticLight}
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="w-9 h-9 md:w-11 md:h-11 drop-shadow-md transition-all duration-300 group-hover:scale-125"
                    style={{ fill: s.color, filter: `drop-shadow(0 0 8px ${s.color}50)` }}
                  >
                    <path d={s.path} />
                  </svg>
                  <span className="text-xs text-white font-light tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true">{s.label}</span>
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom fade — decorative */}
        <div className="absolute bottom-0 left-0 right-0 z-10" aria-hidden="true">
          <div className="h-24" style={{ background: 'linear-gradient(to bottom, transparent, hsl(var(--background)))' }} />
        </div>
      </main>

      <CookieRain trigger={rainTrigger} />
    </>
  );
};

export default Hero;
