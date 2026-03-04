import { useRef, useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import collectionImage from "@/assets/cookies-collection.jpg";

const AboutUs = () => {
  const { isRTL } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setRevealed(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const features = isRTL
    ? [
        { emoji: "❤️", title: "אפייה באהבה", desc: "כל עוגיה מוכנה בתשוקה ובקפידה, בדיוק כמו שסבתא הייתה עושה" },
        { emoji: "🌿", title: "חומרי גלם משובחים", desc: "רק המרכיבים הטריים והאיכותיים ביותר נכנסים לעוגיות שלנו" },
        { emoji: "🎨", title: "מגוון טעמים", desc: "למעלה מ-15 טעמים ייחודיים שתמיד מתחדשים ומפתיעים" },
      ]
    : [
        { emoji: "❤️", title: "Baked with Love", desc: "Every cookie is made with passion and care, just like grandma used to make" },
        { emoji: "🌿", title: "Premium Ingredients", desc: "Only the freshest and highest quality ingredients go into our cookies" },
        { emoji: "🎨", title: "Variety of Flavors", desc: "Over 15 unique flavors that are always evolving and surprising" },
      ];

  return (
    <section
      ref={sectionRef}
      className="relative z-20 py-20 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, hsl(var(--background)) 0%, hsla(350,30%,10%,0.3) 50%, hsl(var(--background)) 100%)',
      }}
    >
      <div className="container mx-auto px-4">
        {/* Section title */}
        <h2
          className="text-center text-3xl md:text-4xl font-bold mb-14 font-display"
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
          {isRTL ? '✨ הסיפור שלנו ✨' : '✨ Our Story ✨'}
        </h2>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Image side */}
          <div
            className="relative rounded-3xl overflow-hidden aspect-[4/3]"
            style={{
              opacity: 0,
              animation: revealed ? 'highlightReveal 1s cubic-bezier(0.16,1,0.3,1) 0.2s forwards' : 'none',
            }}
          >
            <img
              src={collectionImage}
              alt={isRTL ? "קולקציית עוגיות מזון האושר" : "Mazon HaOsher cookie collection"}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(135deg, hsla(40,90%,55%,0.15) 0%, transparent 50%, hsla(350,65%,55%,0.1) 100%)' }}
            />
            <div className="absolute inset-0 rounded-3xl border border-border/20 pointer-events-none" />
          </div>

          {/* Text side */}
          <div>
            <p
              className="text-foreground text-base md:text-lg leading-relaxed mb-8"
              style={{
                opacity: 0,
                animation: revealed ? 'highlightReveal 0.8s cubic-bezier(0.16,1,0.3,1) 0.4s forwards' : 'none',
              }}
            >
              {isRTL
                ? "מזון האושר נולד מתוך אהבה אמיתית לאפייה. התחלנו במטבח ביתי קטן עם חלום פשוט — ליצור עוגיות שמביאות חיוך לכל מי שטועם אותן. היום, כל עוגיה שלנו עדיין מוכנה בעבודת יד, עם אותה תשוקה ומסירות של היום הראשון."
                : "Mazon HaOsher was born from a true love of baking. We started in a small home kitchen with a simple dream — to create cookies that bring a smile to everyone who tastes them. Today, every cookie is still handcrafted with the same passion and dedication as day one."}
            </p>

            <div className="space-y-5">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 group"
                  style={{
                    opacity: 0,
                    animation: revealed ? `highlightReveal 0.7s cubic-bezier(0.16,1,0.3,1) ${0.5 + i * 0.15}s forwards` : 'none',
                  }}
                >
                  <span className="text-2xl mt-0.5 transition-transform duration-300 group-hover:scale-125">{f.emoji}</span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-1">{f.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
