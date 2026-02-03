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
      {/* Decorative background - darker rich tones */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/60 to-primary/30" />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 10% 20%, hsl(var(--primary) / 0.3) 0%, transparent 40%), radial-gradient(circle at 90% 80%, hsl(var(--accent) / 0.25) 0%, transparent 45%), radial-gradient(circle at 50% 50%, hsl(var(--golden-honey) / 0.15) 0%, transparent 60%)' }} />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zMCAzMGMwLTUuNTIzIDQuNDc3LTEwIDEwLTEwczEwIDQuNDc3IDEwIDEwLTQuNDc3IDEwLTEwIDEwLTEwLTQuNDc3LTEwLTEweiIgZmlsbD0iI2U4NWQ4ZiIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-60" />
      
      {/* Floating cookie decorations */}
      {floatingElements.map((el) => (
        <div
          key={el.id}
          className="absolute pointer-events-none opacity-20"
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            animation: `float ${3 + el.delay}s ease-in-out infinite`,
            animationDelay: `${el.delay}s`,
          }}
        >
          <Cookie 
            className="text-primary" 
            style={{ width: el.size, height: el.size }}
          />
        </div>
      ))}
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Animated title section */}
        <div 
          className={`text-center mb-12 transition-all duration-1000 ${
            sectionVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-16'
          }`}
        >
          {/* Decorative top element */}
          <div className={`flex items-center justify-center gap-3 mb-4 transition-all duration-700 delay-200 ${
            sectionVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary to-transparent" />
            <Cookie className="h-6 w-6 text-primary animate-bounce" />
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>
          
          <h2 className={`font-display text-5xl md:text-6xl lg:text-7xl font-bold transition-all duration-1000 delay-300 ${
            sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              {displayedText}
            </span>
            <span className={`inline-block w-1 h-12 md:h-16 bg-primary ${isRTL ? 'mr-1' : 'ml-1'} animate-blink`} />
          </h2>
          
          {/* Decorative subtitle */}
          <p className={`mt-4 text-muted-foreground text-lg transition-all duration-700 delay-500 ${
            sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            {t('cookies.subtitle')}
          </p>
        </div>

        {/* All Controls - Compact Layout */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {/* Search */}
          <div className="relative w-48">
            <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground`} />
            <Input
              type="text"
              placeholder={t('cookies.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${isRTL ? 'pr-8 pl-7' : 'pl-8 pr-7'} py-1.5 h-8 text-sm rounded-full bg-background/50 border-primary/30 focus:border-primary ${isRTL ? 'text-right' : 'text-left'}`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className={`absolute ${isRTL ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-primary transition-all`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-border/50" />

          {/* Category Filter */}
          {categories.map((category) => (
            <Button
              key={category.key}
              onClick={() => handleCategoryChange(category.key)}
              variant={activeCategoryKey === category.key ? "default" : "ghost"}
              size="sm"
              className={`rounded-full px-3 h-7 text-xs transition-all duration-200 ${
                activeCategoryKey === category.key 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-background/40 hover:bg-background/60"
              }`}
            >
              {isRTL ? category.he : category.en}
              <span className={`${isRTL ? 'mr-1' : 'ml-1'} text-[10px] opacity-70`}>
                {getCategoryCount(category.key)}
              </span>
            </Button>
          ))}

          {/* Divider */}
          <div className="w-px h-6 bg-border/50" />

          {/* Tags */}
          <button
            onClick={() => setActiveTag("מומלץ")}
            className={`flex items-center gap-1 text-xs px-2.5 py-1 h-7 rounded-full transition-all ${
              activeTag === "מומלץ"
                ? "bg-accent text-accent-foreground"
                : "bg-background/40 text-muted-foreground hover:text-foreground hover:bg-background/60"
            }`}
            title={isRTL ? "מומלץ" : "Recommended"}
          >
            <Star className="h-3 w-3" />
          </button>
          <button
            onClick={() => setActiveTag("חדש")}
            className={`flex items-center gap-1 text-xs px-2.5 py-1 h-7 rounded-full transition-all ${
              activeTag === "חדש"
                ? "bg-green-500 text-white"
                : "bg-background/40 text-muted-foreground hover:text-foreground hover:bg-background/60"
            }`}
            title={isRTL ? "חדש" : "New"}
          >
            <Sparkles className="h-3 w-3" />
          </button>
          <button
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setActiveTag(activeTag === "מועדפים" ? "הכל" : "מועדפים");
                setIsTransitioning(false);
              }, 200);
            }}
            className={`flex items-center gap-1 text-xs px-2.5 py-1 h-7 rounded-full transition-all ${
              activeTag === "מועדפים"
                ? "bg-red-500 text-white"
                : "bg-background/40 text-muted-foreground hover:text-foreground hover:bg-background/60"
            }`}
            title={isRTL ? "מועדפים" : "Favorites"}
          >
            <Heart className={`h-3 w-3 ${favorites.length > 0 ? "fill-current" : ""}`} />
            {favorites.length > 0 && <span>{favorites.length}</span>}
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-border/50" />

          {/* Sort */}
          <div className="flex items-center gap-1 bg-background/40 rounded-full px-2 py-1 h-7">
            <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value)}
                className={`text-xs px-2 py-0.5 rounded-full transition-all ${
                  sortBy === option.value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isRTL ? option.he : option.en}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-card/80 rounded-full p-0.5 h-7">
            <button
              onClick={() => handleViewModeChange("grid")}
              className={`p-1.5 rounded-full transition-all ${
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="h-3 w-3" />
            </button>
            <button
              onClick={() => handleViewModeChange("list")}
              className={`p-1.5 rounded-full transition-all ${
                viewMode === "list"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="h-3 w-3" />
            </button>
          </div>

          {/* Reset */}
          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="flex items-center gap-1 text-xs px-2.5 py-1 h-7 rounded-full bg-card/80 text-muted-foreground hover:text-primary transition-all"
              title={isRTL ? "איפוס" : "Reset"}
            >
              <RotateCcw className="h-3 w-3" />
            </button>
          )}
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
