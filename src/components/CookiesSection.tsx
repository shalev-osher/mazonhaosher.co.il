import { useEffect, useState } from "react";
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
    description: "ביסקוויט לוטוס וממרח קרמל",
    price: "₪25",
  },
  {
    image: cookieKinder,
    name: "קינדר",
    description: "שוקולד קינדר וכדורי שוקולד צבעוניים",
    price: "₪25",
  },
  {
    image: cookieKinderBueno,
    name: "קינדר בואנו",
    description: "קינדר בואנו, שוקולד חלב וציפוי שוקולד",
    price: "₪25",
  },
  {
    image: cookieRedVelvet,
    name: "רד וולווט",
    description: "בצק רד וולווט, שוקולד לבן ופירורי פטל",
    price: "₪25",
  },
  {
    image: cookieConfetti,
    name: "קונפטי",
    description: "סוכריות צבעוניות וסמארטיז",
    price: "₪25",
  },
  {
    image: cookiePistachio,
    name: "פיסטוק",
    description: "שוקולד לבן, פיסטוקים קלויים וגרגירי רימון",
    price: "₪25",
  },
  {
    image: cookiePretzel,
    name: "בייגלה",
    description: "בייגלה מלוח, שוקולד לבן וצ׳יפס שוקולד",
    price: "₪25",
  },
];

const CookiesSection = () => {
  const fullText = "הקולקציה המיוחדת שלנו";
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayedText.length < fullText.length) {
          setDisplayedText(fullText.slice(0, displayedText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayedText.length > 0) {
          setDisplayedText(fullText.slice(0, displayedText.length - 1));
        } else {
          setIsDeleting(false);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting]);

  return (
    <section id="cookies" className="py-24 relative overflow-hidden">
      {/* Decorative background - rich pink tones */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary via-primary/20 to-accent/30" />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 10% 20%, hsl(var(--primary) / 0.45) 0%, transparent 40%), radial-gradient(circle at 90% 80%, hsl(var(--accent) / 0.4) 0%, transparent 45%), radial-gradient(circle at 50% 50%, hsl(var(--golden-honey) / 0.2) 0%, transparent 60%)' }} />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zMCAzMGMwLTUuNTIzIDQuNDc3LTEwIDEwLTEwczEwIDQuNDc3IDEwIDEwLTQuNDc3IDEwLTEwIDEwLTEwLTQuNDc3LTEwLTEweiIgZmlsbD0iI2U4NWQ4ZiIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-60" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-primary">
            {displayedText}
            <span className="inline-block w-1 h-12 md:h-16 bg-primary mr-1 animate-blink" />
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
