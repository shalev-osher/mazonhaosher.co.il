import CookieCard from "./CookieCard";
import cookieKinder from "@/assets/cookie-kinder.jpg";
import cookieKinderBueno from "@/assets/cookie-kinderbueno.jpg";
import cookieRedVelvet from "@/assets/cookie-redvelvet.jpg";
import cookieConfetti from "@/assets/cookie-confetti.jpg";
import cookieLotus from "@/assets/cookie-lotus.jpg";
import cookiePistachio from "@/assets/cookie-pistachio.jpg";
import cookiePretzel from "@/assets/cookie-pretzel.jpg";

const cookies = [
  {
    image: cookieLotus,
    name: "לוטוס",
    description: "עוגייה עם ביסקוויט לוטוס מקורי וממרח קרמל. הטעם הקרמלי המושלם.",
    price: "₪25",
  },
  {
    image: cookieKinder,
    name: "קינדר",
    description: "עוגייה עם חפיסת שוקולד קינדר וכדורי שוקולד צבעוניים. פינוק לילדים ומבוגרים.",
    price: "₪25",
  },
  {
    image: cookieKinderBueno,
    name: "קינדר בואנו",
    description: "עוגייה עם חתיכות קינדר בואנו, שוקולד חלב וציפוי שוקולד מותך.",
    price: "₪25",
  },
  {
    image: cookieRedVelvet,
    name: "רד וולווט",
    description: "עוגייה אדומה קטיפתית עם ציפוי שוקולד לבן ופירורי פטל. מפתה ויפהפייה.",
    price: "₪25",
  },
  {
    image: cookieConfetti,
    name: "קונפטי",
    description: "עוגייה צבעונית ושמחה עם סוכריות וסמארטיז. מושלמת לימי הולדת וחגיגות.",
    price: "₪25",
  },
  {
    image: cookiePistachio,
    name: "פיסטוק",
    description: "עוגייה עם שוקולד לבן, פיסטוקים קלויים וגרגירי רימון. טעם מתוחכם ומיוחד.",
    price: "₪25",
  },
  {
    image: cookiePretzel,
    name: "בייגלה",
    description: "עוגייה עם בייגלה מלוח, שוקולד לבן וצ׳יפס שוקולד. השילוב המושלם של מתוק ומלוח.",
    price: "₪25",
  },
];

const CookiesSection = () => {
  return (
    <section id="cookies" className="py-24 bg-secondary/30 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-primary">
            הקולקציה המיוחדת שלנו
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
