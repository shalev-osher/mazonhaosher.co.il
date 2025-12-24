import CookieCard from "./CookieCard";
import cookieOreo from "@/assets/cookie-oreo.jpg";
import cookieLotus from "@/assets/cookie-lotus.jpg";
import cookieToblerone from "@/assets/cookie-toblerone.jpg";
import cookieRedVelvet from "@/assets/cookie-redvelvet.jpg";
import cookieKinderBueno from "@/assets/cookie-kinderbueno.jpg";
import cookieConfetti from "@/assets/cookie-confetti.jpg";

const cookies = [
  {
    image: cookieOreo,
    name: "אוראו",
    description: "עוגייה עם קרם לבן קטיפתי ועוגיית אוראו שלמה למעלה. פריכות ושוקולד בכל ביס.",
    price: "₪25",
  },
  {
    image: cookieLotus,
    name: "לוטוס",
    description: "עוגייה עם ביסקוויט לוטוס מקורי וצ׳יפס שוקולד לבן. הטעם הקרמלי המושלם.",
    price: "₪25",
  },
  {
    image: cookieToblerone,
    name: "טובלרון",
    description: "עוגייה עם משולשי טובלרון ושוקולד חלב מותך. שוויצרית ומפנקת.",
    price: "₪25",
  },
  {
    image: cookieRedVelvet,
    name: "רד וולווט",
    description: "עוגייה אדומה קטיפתית עם ציפוי שוקולד לבן ופירורים אדומים. מפתה ויפהפייה.",
    price: "₪25",
  },
  {
    image: cookieKinderBueno,
    name: "קינדר בואנו",
    description: "עוגייה עם אצבעות קינדר בואנו, שוקולד חלב וצ׳יפס שוקולד לבן.",
    price: "₪25",
  },
  {
    image: cookieConfetti,
    name: "קונפטי",
    description: "עוגייה צבעונית ושמחה עם סוכריות וסמארטיז. מושלמת לימי הולדת וחגיגות.",
    price: "₪25",
  },
];

const CookiesSection = () => {
  return (
    <section id="cookies" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block text-primary font-medium tracking-wider uppercase text-sm mb-4">
            הקולקציה המיוחדת שלנו
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            טרי מהתנור
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            כל עוגייה נאפית טרייה מדי יום ממרכיבים משובחים 
            ומתכונים שעברו מדור לדור.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cookies.map((cookie, index) => (
            <CookieCard
              key={cookie.name}
              {...cookie}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CookiesSection;