import CookieCard from "./CookieCard";
import chocolateCookie from "@/assets/cookie-chocolate.jpg";
import oatmealCookie from "@/assets/cookie-oatmeal.jpg";
import peanutCookie from "@/assets/cookie-peanut.jpg";
import snickerdoodleCookie from "@/assets/cookie-snickerdoodle.jpg";

const cookies = [
  {
    image: chocolateCookie,
    name: "שוקולד צ'יפס קלאסית",
    description: "נתחי שוקולד בלגי עשיר בתוך עוגייה חמאתית וזהובה עם מרכז רך ונמס.",
    price: "₪12",
  },
  {
    image: oatmealCookie,
    name: "שיבולת שועל וצימוקים",
    description: "שיבולת שועל מלאה עם צימוקים עסיסיים ונגיעה של קינמון. נחמה אמיתית.",
    price: "₪11",
  },
  {
    image: peanutCookie,
    name: "חמאת בוטנים",
    description: "עוגיית חמאת בוטנים קרמית עם הדפוס הקלאסי ומרקם נמס בפה.",
    price: "₪12",
  },
  {
    image: snickerdoodleCookie,
    name: "סניקרדודל",
    description: "רכה ואוורירית עם ציפוי סוכר-קינמון מתוק. נוסטלגיה טהורה מהילדות.",
    price: "₪10",
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
