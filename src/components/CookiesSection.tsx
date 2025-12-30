import { useEffect, useState } from "react";
import CookieCard from "./CookieCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import cookieKinder from "@/assets/cookie-kinder.jpg";
import cookieKinderBueno from "@/assets/cookie-kinderbueno.jpg";
import cookieRedVelvet from "@/assets/cookie-redvelvet.jpg";
import cookieConfetti from "@/assets/cookie-confetti.jpg";
import cookieLotus from "@/assets/cookie-lotus.jpg";
import cookiePistachio from "@/assets/cookie-pistachio.jpg";
import cookiePretzel from "@/assets/cookie-pretzel.jpg";
import cookieChocolate from "@/assets/cookie-chocolate.jpg";
import cookieOreo from "@/assets/cookie-oreo.jpg";
import cookiePeanut from "@/assets/cookie-peanut.jpg";
import cookieLemon from "@/assets/cookie-lemon.jpg";
import cookieMacadamia from "@/assets/cookie-macadamia.jpg";
import cookieOatmeal from "@/assets/cookie-oatmeal.jpg";
import cookieSaltedCaramel from "@/assets/cookie-salted-caramel.jpg";
import cookieTahini from "@/assets/cookie-tahini.jpg";

type Category = "הכל" | "שוקולד" | "פירות" | "ממתקים" | "אגוזים" | "קלאסי";

const cookies = [
  {
    image: cookieLotus,
    name: "לוטוס",
    description: "ביסקוויט לוטוס וממרח קרמל",
    price: "₪25",
    category: "ממתקים" as Category,
  },
  {
    image: cookieKinder,
    name: "קינדר",
    description: "שוקולד קינדר וכדורי שוקולד צבעוניים",
    price: "₪25",
    category: "שוקולד" as Category,
  },
  {
    image: cookieKinderBueno,
    name: "קינדר בואנו",
    description: "קינדר בואנו, שוקולד חלב וציפוי שוקולד",
    price: "₪25",
    category: "שוקולד" as Category,
  },
  {
    image: cookieRedVelvet,
    name: "רד וולווט",
    description: "בצק רד וולווט, שוקולד לבן ופירורי פטל",
    price: "₪25",
    category: "פירות" as Category,
  },
  {
    image: cookieConfetti,
    name: "קונפטי",
    description: "סוכריות צבעוניות וסמארטיז",
    price: "₪25",
    category: "ממתקים" as Category,
  },
  {
    image: cookiePistachio,
    name: "פיסטוק",
    description: "שוקולד לבן, פיסטוקים קלויים וגרגירי רימון",
    price: "₪25",
    category: "אגוזים" as Category,
  },
  {
    image: cookiePretzel,
    name: "בייגלה",
    description: "בייגלה מלוח, שוקולד לבן וצ׳יפס שוקולד",
    price: "₪25",
    category: "שוקולד" as Category,
  },
  {
    image: cookieChocolate,
    name: "שוקולד צ׳יפס",
    description: "צ׳יפס שוקולד בלגי מריר ושוקולד חלב",
    price: "₪25",
    category: "שוקולד" as Category,
  },
  {
    image: cookieOreo,
    name: "אוראו",
    description: "פירורי אוראו, שוקולד לבן וקרם וניל",
    price: "₪25",
    category: "ממתקים" as Category,
  },
  {
    image: cookiePeanut,
    name: "חמאת בוטנים",
    description: "חמאת בוטנים, בוטנים קלויים ושוקולד",
    price: "₪25",
    category: "אגוזים" as Category,
  },
  {
    image: cookieLemon,
    name: "לימון",
    description: "גרידת לימון טרי וציפוי סוכר",
    price: "₪25",
    category: "פירות" as Category,
  },
  {
    image: cookieMacadamia,
    name: "מקדמיה",
    description: "אגוזי מקדמיה ושוקולד לבן",
    price: "₪25",
    category: "אגוזים" as Category,
  },
  {
    image: cookieOatmeal,
    name: "שיבולת שועל",
    description: "שיבולת שועל, צימוקים וקינמון",
    price: "₪25",
    category: "קלאסי" as Category,
  },
  {
    image: cookieSaltedCaramel,
    name: "קרמל מלוח",
    description: "קרמל ביתי וקריסטלי מלח ים",
    price: "₪25",
    category: "קלאסי" as Category,
  },
  {
    image: cookieTahini,
    name: "טחינה",
    description: "טחינה גולמית, שומשום ודבש",
    price: "₪25",
    category: "קלאסי" as Category,
  },
];

const categories: Category[] = ["הכל", "שוקולד", "פירות", "ממתקים", "אגוזים", "קלאסי"];

const CookiesSection = () => {
  const fullText = "הקולקציה המיוחדת שלנו";
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>("הכל");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleCategoryChange = (category: Category) => {
    if (category === activeCategory) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveCategory(category);
      setIsTransitioning(false);
    }, 200);
  };

  const filteredCookies = cookies.filter(cookie => {
    const matchesCategory = activeCategory === "הכל" || cookie.category === activeCategory;
    const matchesSearch = cookie.name.includes(searchQuery) || cookie.description.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="cookies" className="py-24 relative overflow-hidden">
      {/* Decorative background - rich pink tones */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary via-primary/20 to-accent/30" />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 10% 20%, hsl(var(--primary) / 0.45) 0%, transparent 40%), radial-gradient(circle at 90% 80%, hsl(var(--accent) / 0.4) 0%, transparent 45%), radial-gradient(circle at 50% 50%, hsl(var(--golden-honey) / 0.2) 0%, transparent 60%)' }} />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zMCAzMGMwLTUuNTIzIDQuNDc3LTEwIDEwLTEwczEwIDQuNDc3IDEwIDEwLTQuNDc3IDEwLTEwIDEwLTEwLTQuNDc3LTEwLTEweiIgZmlsbD0iI2U4NWQ4ZiIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-60" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-primary">
            {displayedText}
            <span className="inline-block w-1 h-12 md:h-16 bg-primary mr-1 animate-blink" />
          </h2>
        </div>

        {/* Search */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-md">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="חיפוש עוגיה..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-12 pl-10 py-3 rounded-full bg-card/90 border-primary/30 focus:border-primary text-right"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground hover:text-primary hover:rotate-90 hover:scale-125 transition-all duration-300"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => handleCategoryChange(category)}
              variant={activeCategory === category ? "default" : "outline"}
              className={`rounded-full px-6 transition-all duration-300 ${
                activeCategory === category 
                  ? "bg-primary text-primary-foreground shadow-lg scale-105" 
                  : "bg-card/80 hover:bg-card hover:scale-105"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        <div 
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 transition-all duration-300 ${
            isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
        >
          {filteredCookies.map((cookie, index) => (
            <CookieCard
              key={cookie.name}
              image={cookie.image}
              name={cookie.name}
              description={cookie.description}
              price={cookie.price}
              delay={index * 100}
            />
          ))}
        </div>

        {filteredCookies.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-6xl mb-4">🍪</div>
            <p className="text-foreground text-xl font-medium mb-2">
              {searchQuery ? `לא מצאנו עוגיות עבור "${searchQuery}"` : "אין עוגיות בקטגוריה זו"}
            </p>
            <p className="text-muted-foreground">
              {searchQuery ? "נסו לחפש משהו אחר או לנקות את החיפוש" : "נסו לבחור קטגוריה אחרת"}
            </p>
            {searchQuery && (
              <Button
                onClick={() => setSearchQuery("")}
                variant="outline"
                className="mt-4 rounded-full"
              >
                נקה חיפוש
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default CookiesSection;
