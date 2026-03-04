import { useRef, useState, useEffect, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const staticReviews = [
  { id: 1, nameHe: "מיכל כ.", nameEn: "Michal K.", rating: 5, textHe: "העוגיות הכי טובות שטעמתי! הלוטוס פשוט מדהים, והמשלוח הגיע מהר.", textEn: "The best cookies I've ever tasted! The Lotus is amazing, and delivery was fast." },
  { id: 2, nameHe: "יוסי ד.", nameEn: "Yossi D.", rating: 5, textHe: "הזמנתי מארז ליום הולדת של אשתי — הכי שווה. כולם השתגעו!", textEn: "Ordered a package for my wife's birthday — totally worth it. Everyone went crazy!" },
  { id: 3, nameHe: "נועה ל.", nameEn: "Noa L.", rating: 5, textHe: "הפיסטוק והקרמל מלוח שינו לי את החיים. לא מפסיקה להזמין.", textEn: "The Pistachio and Salted Caramel changed my life. I can't stop ordering." },
  { id: 4, nameHe: "אלמוג ש.", nameEn: "Almog S.", rating: 5, textHe: "איכות ברמה אחרת לגמרי. מרגיש שכל עוגיה מוכנה עם אהבה אמיתית.", textEn: "Quality on a completely different level. You can feel every cookie is made with real love." },
  { id: 5, nameHe: "רוני מ.", nameEn: "Roni M.", rating: 4, textHe: "האוראו וקינדר בואנו — שילוב מנצח. ממליצה בחום!", textEn: "Oreo and Kinder Bueno — a winning combo. Highly recommend!" },
  { id: 6, nameHe: "דנה ב.", nameEn: "Dana B.", rating: 5, textHe: "הזמנתי לאירוע בעבודה, קיבלתי מלא מחמאות. חוזרת בהחלט!", textEn: "Ordered for a work event, got tons of compliments. Definitely coming back!" },
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        className={`w-4 h-4 ${star <= rating ? 'text-amber-400' : 'text-muted-foreground/30'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const Reviews = () => {
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
        background: 'linear-gradient(180deg, hsl(var(--background)) 0%, hsla(280,20%,10%,0.25) 50%, hsl(var(--background)) 100%)',
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
          {isRTL ? '⭐ מה הלקוחות אומרים ⭐' : '⭐ What Our Customers Say ⭐'}
        </h2>
        <p
          className="text-center text-muted-foreground mb-12 text-base"
          style={{
            opacity: 0,
            animation: revealed ? 'highlightReveal 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s forwards' : 'none',
          }}
        >
          {isRTL ? 'ביקורות אמיתיות מלקוחות מרוצים' : 'Real reviews from happy customers'}
        </p>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {staticReviews.map((review, i) => (
            <div
              key={review.id}
              className="group relative rounded-2xl border border-border/30 p-5 cursor-default overflow-hidden transition-all duration-400"
              style={{
                opacity: 0,
                animation: revealed ? `highlightReveal 0.7s cubic-bezier(0.16,1,0.3,1) ${0.2 + i * 0.1}s forwards` : 'none',
                background: 'linear-gradient(135deg, hsla(var(--card), 0.6), hsla(var(--card), 0.3))',
                backdropFilter: 'blur(10px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 16px 32px hsla(40,90%,55%,0.12)';
                e.currentTarget.style.borderColor = 'hsla(40,90%,55%,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '';
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: 'linear-gradient(135deg, hsla(40,90%,55%,0.3), hsla(350,65%,55%,0.3))' }}
                >
                  {(isRTL ? review.nameHe : review.nameEn).charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{isRTL ? review.nameHe : review.nameEn}</p>
                  <StarRating rating={review.rating} />
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                "{isRTL ? review.textHe : review.textEn}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
