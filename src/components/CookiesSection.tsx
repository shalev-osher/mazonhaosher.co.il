import CookieCard from "./CookieCard";
import chocolateCookie from "@/assets/cookie-chocolate.jpg";
import oatmealCookie from "@/assets/cookie-oatmeal.jpg";
import peanutCookie from "@/assets/cookie-peanut.jpg";
import snickerdoodleCookie from "@/assets/cookie-snickerdoodle.jpg";
import doubleChocolateCookie from "@/assets/cookie-double-chocolate.jpg";
import macadamiaCookie from "@/assets/cookie-macadamia.jpg";
import redVelvetCookie from "@/assets/cookie-red-velvet.jpg";
import lemonCookie from "@/assets/cookie-lemon.jpg";
import sugarSprinklesCookie from "@/assets/cookie-sugar-sprinkles.jpg";
import saltedCaramelCookie from "@/assets/cookie-salted-caramel.jpg";
import matchaCookie from "@/assets/cookie-matcha.jpg";
import tahiniCookie from "@/assets/cookie-tahini.jpg";
import bambaCookie from "@/assets/cookie-bamba.jpg";
import kinderCookie from "@/assets/cookie-kinder.jpg";
import cornflakesCookie from "@/assets/cookie-cornflakes.jpg";
import bigaleCookie from "@/assets/cookie-bigale.jpg";

const cookies = [
  {
    image: bambaCookie,
    name: "במבה אדומה",
    description: "עוגייה מיוחדת עם קרם לבן וכדורי במבה אדומה פריכים. טעם ישראלי מקורי.",
    price: "₪14",
  },
  {
    image: kinderCookie,
    name: "קינדר",
    description: "עוגייה עם ממרח קינדר, חתיכות שוקולד וכדורי שוקולד צבעוניים. לחובבי הקינדר.",
    price: "₪15",
  },
  {
    image: cornflakesCookie,
    name: "קורנפלקס",
    description: "עוגייה עם שוקולד לבן מותך ופתיתי קורנפלקס פריכים. מתוקה ומפתה.",
    price: "₪13",
  },
  {
    image: bigaleCookie,
    name: "ביגלה",
    description: "עוגייה עם שוקולד לבן קרמי, שוקולד צ׳יפס וביגלה פריכה. שילוב מתוק-מלוח.",
    price: "₪14",
  },
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
  {
    image: doubleChocolateCookie,
    name: "דאבל שוקולד",
    description: "עוגיית בראוני עשירה עם מרכז פאדג׳י ונתחי שוקולד מריר. לחובבי השוקולד.",
    price: "₪14",
  },
  {
    image: macadamiaCookie,
    name: "שוקולד לבן ומקדמיה",
    description: "שוקולד לבן קרמי עם אגוזי מקדמיה פריכים. שילוב מנצח ומפנק.",
    price: "₪15",
  },
  {
    image: redVelvetCookie,
    name: "רד וולווט",
    description: "עוגייה אדומה קטיפתית עם קרם גבינה מתוק. אלגנטית ומפתה.",
    price: "₪14",
  },
  {
    image: lemonCookie,
    name: "לימון ואבקת סוכר",
    description: "עוגייה רעננה וחמצמצה עם ציפוי אבקת סוכר. טעם קיצי מרענן.",
    price: "₪11",
  },
  {
    image: sugarSprinklesCookie,
    name: "סוכריות צבעוניות",
    description: "עוגיית חמאה רכה עם סוכריות צבעוניות. מושלמת לימי הולדת וחגיגות.",
    price: "₪10",
  },
  {
    image: saltedCaramelCookie,
    name: "קרמל מלוח",
    description: "קרמל זהוב עשיר עם גבישי מלח ים. השילוב המתוק-מלוח המושלם.",
    price: "₪14",
  },
  {
    image: matchaCookie,
    name: "מאצ׳ה ושוקולד לבן",
    description: "תה ירוק יפני משובח עם שוקולד לבן קרמי. טעם ייחודי ומרגיע.",
    price: "₪15",
  },
  {
    image: tahiniCookie,
    name: "טחינה וחלווה",
    description: "טחינה ישראלית משובחת עם פירורי חלווה ושומשום. הטעם של הבית.",
    price: "₪13",
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
