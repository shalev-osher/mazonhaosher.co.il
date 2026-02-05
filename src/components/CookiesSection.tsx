import { useEffect, useState } from "react";
import CookieCard from "./CookieCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, ArrowUpDown, Star, Sparkles, RotateCcw, LayoutGrid, List, Heart, Trash2, Cookie } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLanguage } from "@/contexts/LanguageContext";
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

type SortOption = "default" | "name" | "price";
type Tag = "מומלץ" | "חדש" | null;
type TagFilter = Tag | "הכל" | "מועדפים";

const CookiesSection = () => {
  const { t, isRTL } = useLanguage();
  
  // Categories with translations
  const categories = [
    { key: "all", he: "הכל", en: "All" },
    { key: "chocolate", he: "שוקולד", en: "Chocolate" },
    { key: "fruits", he: "פירות", en: "Fruits" },
    { key: "candy", he: "ממתקים", en: "Candy" },
    { key: "nuts", he: "אגוזים", en: "Nuts" },
    { key: "classic", he: "קלאסי", en: "Classic" },
  ];

  const sortOptions = [
    { value: "default" as SortOption, he: "ברירת מחדל", en: "Default" },
    { value: "name" as SortOption, he: "לפי שם", en: "By Name" },
    { value: "price" as SortOption, he: "לפי מחיר", en: "By Price" },
  ];

  const cookies = [
    {
      image: cookieLotus,
      nameHe: "לוטוס",
      nameEn: "Lotus",
      descHe: "ביסקוויט לוטוס וממרח קרמל",
      descEn: "Lotus biscuit and caramel spread",
      price: "₪25",
      categoryKey: "candy",
      tag: "מומלץ" as Tag,
    },
    {
      image: cookieKinder,
      nameHe: "קינדר",
      nameEn: "Kinder",
      descHe: "שוקולד קינדר וכדורי שוקולד צבעוניים",
      descEn: "Kinder chocolate with colorful chocolate balls",
      price: "₪25",
      categoryKey: "chocolate",
      tag: null as Tag,
    },
    {
      image: cookieKinderBueno,
      nameHe: "קינדר בואנו",
      nameEn: "Kinder Bueno",
      descHe: "קינדר בואנו, שוקולד חלב וציפוי שוקולד",
      descEn: "Kinder Bueno, milk chocolate and chocolate coating",
      price: "₪25",
      categoryKey: "chocolate",
      tag: "חדש" as Tag,
    },
    {
      image: cookieRedVelvet,
      nameHe: "רד וולווט",
      nameEn: "Red Velvet",
      descHe: "בצק רד וולווט, שוקולד לבן ופירורי פטל",
      descEn: "Red velvet dough, white chocolate and raspberry crumbs",
      price: "₪25",
      categoryKey: "fruits",
      tag: null as Tag,
    },
    {
      image: cookieConfetti,
      nameHe: "קונפטי",
      nameEn: "Confetti",
      descHe: "סוכריות צבעוניות וסמארטיז",
      descEn: "Colorful sprinkles and Smarties",
      price: "₪25",
      categoryKey: "candy",
      tag: null as Tag,
    },
    {
      image: cookiePistachio,
      nameHe: "פיסטוק",
      nameEn: "Pistachio",
      descHe: "שוקולד לבן, פיסטוקים קלויים וגרגירי רימון",
      descEn: "White chocolate, roasted pistachios and pomegranate seeds",
      price: "₪25",
      categoryKey: "nuts",
      tag: "מומלץ" as Tag,
    },
    {
      image: cookiePretzel,
      nameHe: "בייגלה",
      nameEn: "Pretzel",
      descHe: "בייגלה מלוח, שוקולד לבן וצ׳יפס שוקולד",
      descEn: "Salted pretzel, white chocolate and chocolate chips",
      price: "₪25",
      categoryKey: "chocolate",
      tag: "חדש" as Tag,
    },
    {
      image: cookieChocolate,
      nameHe: "שוקולד צ׳יפס",
      nameEn: "Chocolate Chip",
      descHe: "צ׳יפס שוקולד בלגי מריר ושוקולד חלב",
      descEn: "Belgian dark and milk chocolate chips",
      price: "₪25",
      categoryKey: "chocolate",
      tag: null as Tag,
    },
    {
      image: cookieOreo,
      nameHe: "אוראו",
      nameEn: "Oreo",
      descHe: "פירורי אוראו, שוקולד לבן וקרם וניל",
      descEn: "Oreo crumbs, white chocolate and vanilla cream",
      price: "₪25",
      categoryKey: "candy",
      tag: null as Tag,
    },
    {
      image: cookiePeanut,
      nameHe: "חמאת בוטנים",
      nameEn: "Peanut Butter",
      descHe: "חמאת בוטנים, בוטנים קלויים ושוקולד",
      descEn: "Peanut butter, roasted peanuts and chocolate",
      price: "₪25",
      categoryKey: "nuts",
      tag: null as Tag,
    },
    {
      image: cookieLemon,
      nameHe: "לימון",
      nameEn: "Lemon",
      descHe: "גרידת לימון טרי וציפוי סוכר",
      descEn: "Fresh lemon zest with sugar coating",
      price: "₪25",
      categoryKey: "fruits",
      tag: null as Tag,
    },
    {
      image: cookieMacadamia,
      nameHe: "מקדמיה",
      nameEn: "Macadamia",
      descHe: "אגוזי מקדמיה ושוקולד לבן",
      descEn: "Macadamia nuts and white chocolate",
      price: "₪25",
      categoryKey: "nuts",
      tag: null as Tag,
    },
    {
      image: cookieOatmeal,
      nameHe: "שיבולת שועל",
      nameEn: "Oatmeal",
      descHe: "שיבולת שועל, צימוקים וקינמון",
      descEn: "Oatmeal, raisins and cinnamon",
      price: "₪25",
      categoryKey: "classic",
      tag: null as Tag,
    },
    {
      image: cookieSaltedCaramel,
      nameHe: "קרמל מלוח",
      nameEn: "Salted Caramel",
      descHe: "קרמל ביתי וקריסטלי מלח ים",
      descEn: "Homemade caramel with sea salt crystals",
      price: "₪25",
      categoryKey: "classic",
      tag: "מומלץ" as Tag,
    },
    {
      image: cookieTahini,
      nameHe: "טחינה",
      nameEn: "Tahini",
      descHe: "טחינה גולמית, שומשום ודבש",
      descEn: "Raw tahini, sesame seeds and honey",
      price: "₪25",
      categoryKey: "classic",
      tag: null as Tag,
    },
  ];

  const fullTextHe = "הקולקציה שלנו";
  const fullTextEn = "Our Collection";
  const fullText = isRTL ? fullTextHe : fullTextEn;
  
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeCategoryKey, setActiveCategoryKey] = useState<string>("all");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [activeTag, setActiveTag] = useState<TagFilter>("הכל");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("cookie-favorites");
    return saved ? JSON.parse(saved) : [];
  });
  
  // Scroll reveal for section entrance
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollReveal({ threshold: 0.1 });
  
  // Floating decorative elements
  const [floatingElements, setFloatingElements] = useState<Array<{ id: number; x: number; y: number; delay: number; size: number }>>([]);
  
  useEffect(() => {
    const elements = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      size: 12 + Math.random() * 16,
    }));
    setFloatingElements(elements);
  }, []);

  const toggleFavorite = (cookieName: string) => {
    setFavorites(prev => {
      const isRemoving = prev.includes(cookieName);
      const newFavorites = isRemoving
        ? prev.filter(name => name !== cookieName)
        : [...prev, cookieName];
      localStorage.setItem("cookie-favorites", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const clearAllFavorites = () => {
    if (favorites.length === 0) return;
    setFavorites([]);
    localStorage.removeItem("cookie-favorites");
    if (activeTag === "מועדפים") {
      setActiveTag("הכל");
    }
  };

  const handleViewModeChange = (mode: "grid" | "list") => {
    if (mode === viewMode) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setViewMode(mode);
      setIsTransitioning(false);
    }, 200);
  };

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
  }, [displayedText, isDeleting, fullText]);

  // Reset displayed text when language changes
  useEffect(() => {
    setDisplayedText("");
    setIsDeleting(false);
  }, [isRTL]);

  const handleCategoryChange = (categoryKey: string) => {
    if (categoryKey === activeCategoryKey) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveCategoryKey(categoryKey);
      setIsTransitioning(false);
    }, 200);
  };

  const getCategoryCount = (categoryKey: string) => {
    if (categoryKey === "all") return cookies.length;
    return cookies.filter(c => c.categoryKey === categoryKey).length;
  };

  const hasActiveFilters = activeCategoryKey !== "all" || activeTag !== "הכל" || searchQuery !== "" || sortBy !== "default";

  const resetAllFilters = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveCategoryKey("all");
      setActiveTag("הכל");
      setSearchQuery("");
      setSortBy("default");
      setIsTransitioning(false);
    }, 200);
  };

  const filteredCookies = cookies
    .filter(cookie => {
      const matchesCategory = activeCategoryKey === "all" || cookie.categoryKey === activeCategoryKey;
      const name = isRTL ? cookie.nameHe : cookie.nameEn;
      const desc = isRTL ? cookie.descHe : cookie.descEn;
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           cookie.nameHe.includes(searchQuery) ||
                           cookie.descHe.includes(searchQuery);
      let matchesTag = true;
      if (activeTag === "מועדפים") {
        matchesTag = favorites.includes(cookie.nameHe);
      } else if (activeTag !== "הכל") {
        matchesTag = cookie.tag === activeTag;
      }
      return matchesCategory && matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        const nameA = isRTL ? a.nameHe : a.nameEn;
        const nameB = isRTL ? b.nameHe : b.nameEn;
        return nameA.localeCompare(nameB, isRTL ? "he" : "en");
      }
      if (sortBy === "price") {
        const priceA = parseInt(a.price.replace(/[^\d]/g, ""));
        const priceB = parseInt(b.price.replace(/[^\d]/g, ""));
        return priceA - priceB;
      }
      return 0;
    });

  return (
    <section id="cookies" ref={sectionRef} className="py-24 relative overflow-hidden">
      {/* Decorative background - warm baking tones */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-background" />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 10% 20%, hsl(35 85% 55% / 0.2) 0%, transparent 40%), radial-gradient(circle at 90% 80%, hsl(15 75% 60% / 0.15) 0%, transparent 45%), radial-gradient(circle at 50% 50%, hsl(40 90% 55% / 0.1) 0%, transparent 60%)' }} />
      {/* Cookie pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='8' fill='%23d97706' /%3E%3Ccircle cx='26' cy='28' r='2' fill='%234b3621' /%3E%3Ccircle cx='34' cy='32' r='2' fill='%234b3621' /%3E%3Ccircle cx='30' cy='35' r='1.5' fill='%234b3621' /%3E%3C/svg%3E")`, backgroundSize: '80px 80px' }} />
      
      {/* Floating cookie decorations */}
      {floatingElements.map((el) => (
        <div
          key={el.id}
          className="absolute pointer-events-none opacity-30"
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            animation: `float ${3 + el.delay}s ease-in-out infinite`,
            animationDelay: `${el.delay}s`,
          }}
        >
          <Cookie 
            className="text-amber-600" 
            style={{ width: el.size, height: el.size }}
          />
        </div>
      ))}
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Animated title section */}
        <div 
          className={`text-center mb-6 transition-all duration-1000 ${
            sectionVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-16'
          }`}
        >
          {/* Decorative top element */}
          <div className={`flex items-center justify-center gap-3 mb-2 transition-all duration-700 delay-200 ${
            sectionVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
            <Cookie className="h-5 w-5 text-amber-600 animate-bounce" />
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
          </div>
          
          <h2 className={`font-display text-3xl md:text-4xl lg:text-5xl font-bold transition-all duration-1000 delay-300 ${
            sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              {displayedText}
            </span>
            <span className={`inline-block w-1 h-8 md:h-10 bg-amber-500 ${isRTL ? 'mr-1' : 'ml-1'} animate-blink`} />
          </h2>
          
          {/* Decorative subtitle */}
          <p className={`mt-2 text-muted-foreground text-base transition-all duration-700 delay-500 ${
            sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            {t('cookies.subtitle')}
          </p>
        </div>

        {/* Minimal Controls */}
        <div className="flex items-center justify-center gap-3 mb-4">
          {/* Search */}
          <div className="relative w-52">
            <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground`} />
            <Input
              type="text"
              placeholder={t('cookies.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${isRTL ? 'pr-8 pl-7' : 'pl-8 pr-7'} py-1.5 h-8 text-sm rounded-full bg-background border-amber-500/50 focus:border-amber-500 ${isRTL ? 'text-right' : 'text-left'}`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className={`absolute ${isRTL ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-amber-500 transition-all`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Favorites */}
          <button
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setActiveTag(activeTag === "מועדפים" ? "הכל" : "מועדפים");
                setIsTransitioning(false);
              }, 200);
            }}
            className={`flex items-center gap-1 text-xs px-3 py-1.5 h-8 rounded-full transition-all ${
              activeTag === "מועדפים"
                ? "bg-rose-500 text-white"
                : "bg-background text-muted-foreground hover:text-foreground hover:bg-rose-100 dark:hover:bg-rose-900/30 border border-rose-500/50"
            }`}
            title={isRTL ? "מועדפים" : "Favorites"}
          >
            <Heart className={`h-3.5 w-3.5 ${favorites.length > 0 ? "fill-current" : ""}`} />
            {favorites.length > 0 && <span>{favorites.length}</span>}
          </button>
        </div>

        <div 
          className={`transition-all duration-300 ${
            isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
          } ${
            viewMode === "grid" 
              ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4"
              : "flex flex-col gap-4 max-w-3xl mx-auto"
          }`}
        >
          {filteredCookies.map((cookie, index) => (
            <CookieCard
              key={cookie.nameHe}
              image={cookie.image}
              name={isRTL ? cookie.nameHe : cookie.nameEn}
              description={isRTL ? cookie.descHe : cookie.descEn}
              price={cookie.price}
              delay={index * 100}
              tag={cookie.tag}
              viewMode={viewMode}
              isFavorite={favorites.includes(cookie.nameHe)}
              onToggleFavorite={() => toggleFavorite(cookie.nameHe)}
            />
          ))}
        </div>

        {filteredCookies.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-6xl mb-4">✨</div>
            <p className="text-foreground text-xl font-medium mb-2">
              {searchQuery 
                ? (isRTL ? `לא מצאנו מוצרים עבור "${searchQuery}"` : `No products found for "${searchQuery}"`)
                : (isRTL ? "אין מוצרים בקטגוריה זו" : "No products in this category")}
            </p>
            <p className="text-muted-foreground">
              {searchQuery 
                ? (isRTL ? "נסו לחפש משהו אחר או לנקות את החיפוש" : "Try searching for something else or clear search")
                : (isRTL ? "נסו לבחור קטגוריה אחרת" : "Try selecting a different category")}
            </p>
            {searchQuery && (
              <Button
                onClick={() => setSearchQuery("")}
                variant="outline"
                className="mt-4 rounded-full"
              >
                {isRTL ? "נקה חיפוש" : "Clear search"}
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default CookiesSection;
