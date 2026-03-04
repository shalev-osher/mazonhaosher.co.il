import { useState, useRef, useEffect, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

import cookieLotus from "@/assets/cookie-lotus.jpg";
import cookieKinder from "@/assets/cookie-kinder.jpg";
import cookieKinderbueno from "@/assets/cookie-kinderbueno.jpg";
import cookieRedVelvet from "@/assets/cookie-red-velvet.jpg";
import cookieConfetti from "@/assets/cookie-confetti.jpg";
import cookiePistachio from "@/assets/cookie-pistachio.jpg";
import cookiePretzel from "@/assets/cookie-pretzel.jpg";
import cookieChocolate from "@/assets/cookie-chocolate.jpg";
import cookieOreo from "@/assets/cookie-oreo.jpg";
import cookiePeanut from "@/assets/cookie-peanut.jpg";
import cookieLemon from "@/assets/cookie-lemon.jpg";
import cookieMacadamia from "@/assets/cookie-macadamia.jpg";
import cookieSaltedCaramel from "@/assets/cookie-salted-caramel.jpg";
import cookieTahini from "@/assets/cookie-tahini-new.jpg";
import cookieBamba from "@/assets/cookie-bamba.jpg";
import cookieMatcha from "@/assets/cookie-matcha.jpg";

const cookies = [
  { id: 1, image: cookieLotus, nameHe: "לוטוס", nameEn: "Lotus" },
  { id: 2, image: cookieKinder, nameHe: "קינדר", nameEn: "Kinder" },
  { id: 3, image: cookieKinderbueno, nameHe: "קינדר בואנו", nameEn: "Kinder Bueno" },
  { id: 4, image: cookieRedVelvet, nameHe: "רד וולווט", nameEn: "Red Velvet" },
  { id: 5, image: cookieConfetti, nameHe: "קונפטי", nameEn: "Confetti" },
  { id: 6, image: cookiePistachio, nameHe: "פיסטוק", nameEn: "Pistachio" },
  { id: 7, image: cookiePretzel, nameHe: "בייגלה", nameEn: "Pretzel" },
  { id: 8, image: cookieChocolate, nameHe: "שוקולד צ׳יפס", nameEn: "Chocolate Chip" },
  { id: 9, image: cookieOreo, nameHe: "אוראו", nameEn: "Oreo" },
  { id: 10, image: cookiePeanut, nameHe: "חמאת בוטנים", nameEn: "Peanut Butter" },
  { id: 11, image: cookieLemon, nameHe: "לימון", nameEn: "Lemon" },
  { id: 12, image: cookieMacadamia, nameHe: "מקדמיה", nameEn: "Macadamia" },
  { id: 13, image: cookieSaltedCaramel, nameHe: "קרמל מלוח", nameEn: "Salted Caramel" },
  { id: 14, image: cookieTahini, nameHe: "טחינה", nameEn: "Tahini" },
  { id: 15, image: cookieBamba, nameHe: "במבה", nameEn: "Bamba" },
  { id: 16, image: cookieMatcha, nameHe: "מאצ׳ה", nameEn: "Matcha" },
];

const CookieGallery = () => {
  const { isRTL } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setRevealed(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-20 py-20 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, hsl(var(--background)) 0%, hsla(25,20%,8%,0.4) 50%, hsl(var(--background)) 100%)',
      }}
    >
      <div className="container mx-auto px-4">
        {/* Section title */}
        <h2
          className="text-center text-3xl md:text-4xl font-bold mb-4 font-display"
          style={{
            opacity: 0,
            animation: revealed ? 'highlightReveal 0.8s cubic-bezier(0.16,1,0.3,1) 0s forwards' : 'none',
            background: 'linear-gradient(90deg, hsla(40,90%,65%,1), hsla(40,90%,80%,1), hsla(40,90%,65%,1))',
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            ...(revealed ? { animationName: 'highlightReveal, gradientText', animationDuration: '0.8s, 4s', animationTimingFunction: 'cubic-bezier(0.16,1,0.3,1), ease-in-out', animationDelay: '0s, 0s', animationIterationCount: '1, infinite', animationFillMode: 'forwards, none' } : {}),
          }}
        >
          {isRTL ? '🍪 הקולקציה שלנו 🍪' : '🍪 Our Collection 🍪'}
        </h2>
        <p
          className="text-center text-muted-foreground mb-12 text-base"
          style={{
            opacity: 0,
            animation: revealed ? 'highlightReveal 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s forwards' : 'none',
          }}
        >
          {isRTL ? 'כל עוגיה נאפית בעבודת יד מחומרי גלם משובחים' : 'Each cookie is handcrafted from premium ingredients'}
        </p>

        {/* Gallery grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          {cookies.map((cookie, i) => (
            <div
              key={cookie.id}
              className="group relative rounded-2xl overflow-hidden cursor-default aspect-square"
              style={{
                opacity: 0,
                animation: revealed ? `highlightReveal 0.6s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.06}s forwards` : 'none',
              }}
            >
              <img
                src={cookie.image}
                alt={isRTL ? cookie.nameHe : cookie.nameEn}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              {/* Overlay */}
              <div
                className="absolute inset-0 flex items-end justify-center transition-all duration-500"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 40%, transparent 100%)',
                  opacity: 0.7,
                }}
              />
              <div className="absolute inset-0 flex items-end justify-center opacity-0 group-hover:opacity-100 transition-all duration-500"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                }}
              />
              {/* Cookie name */}
              <div className="absolute bottom-0 left-0 right-0 p-3 text-center transition-transform duration-500 group-hover:translate-y-[-4px]">
                <span className="text-white font-display text-sm md:text-base drop-shadow-lg">
                  {isRTL ? cookie.nameHe : cookie.nameEn}
                </span>
              </div>
              {/* Gold border on hover */}
              <div
                className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-amber-400/50 transition-colors duration-500 pointer-events-none"
                style={{ boxShadow: 'inset 0 0 0 0 hsla(40,90%,55%,0)' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CookieGallery;
