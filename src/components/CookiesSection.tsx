import CookieCard from "./CookieCard";
import cookiesCollection from "@/assets/cookies-collection.jpg";

const cookies = [
  {
    image: cookiesCollection,
    name: "אוראו",
    description: "עוגייה עם קרם לבן קטיפתי ועוגיית אוראו שלמה למעלה. פריכות ושוקולד בכל ביס.",
    price: "₪25",
  },
  {
    image: cookiesCollection,
    name: "לוטוס",
    description: "עוגייה עם ביסקוויט לוטוס מקורי וצ׳יפס שוקולד לבן. הטעם הקרמלי המושלם.",
    price: "₪25",
  },
  {
    image: cookiesCollection,
    name: "טובלרון",
    description: "עוגייה עם משולשי טובלרון ושוקולד חלב מותך. שוויצרית ומפנקת.",
    price: "₪25",
  },
  {
    image: cookiesCollection,
    name: "טחינה",
    description: "עוגייה עם טחינה ישראלית, ציפוי שוקולד לבן וצ׳יפס שוקולד. הטעם של הבית.",
    price: "₪25",
  },
  {
    image: cookiesCollection,
    name: "רד וולווט",
    description: "עוגייה אדומה קטיפתית עם ציפוי שוקולד לבן ופירורים אדומים. מפתה ויפהפייה.",
    price: "₪25",
  },
  {
    image: cookiesCollection,
    name: "קינדר בואנו",
    description: "עוגייה עם חתיכות קינדר בואנו, שוקולד חלב וכדורי שוקולד פריכים.",
    price: "₪25",
  },
  {
    image: cookiesCollection,
    name: "סוכריות",
    description: "עוגייה צבעונית ושמחה עם סוכריות, שוקולד חלב וסמארטיז. לכל חגיגה.",
    price: "₪25",
  },
];

const CookiesSection = () => {
  return (
    <section id="cookies" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block text-accent font-medium tracking-wider uppercase text-sm mb-4">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
