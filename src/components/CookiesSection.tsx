import { useEffect, useState } from "react";
import CookieCard from "./CookieCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, ArrowUpDown, Star, Sparkles, RotateCcw, LayoutGrid, List, Heart, Trash2, Cookie } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useScrollReveal } from "@/hooks/useScrollReveal";
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
type SortOption = "default" | "name" | "price";
type Tag = "מומלץ" | "חדש" | null;
type TagFilter = Tag | "הכל" | "מועדפים";

const cookies = [
  {
    image: cookieLotus,
    name: "לוטוס",
    description: "ביסקוויט לוטוס וממרח קרמל",
    price: "₪25",
    category: "ממתקים" as Category,
    tag: "מומלץ" as Tag,
  },
  {
    image: cookieKinder,
    name: "קינדר",
    description: "שוקולד קינדר וכדורי שוקולד צבעוניים",
    price: "₪25",
    category: "שוקולד" as Category,
    tag: null as Tag,
  },
  {
    image: cookieKinderBueno,
    name: "קינדר בואנו",
    description: "קינדר בואנו, שוקולד חלב וציפוי שוקולד",
    price: "₪25",
    category: "שוקולד" as Category,
    tag: "חדש" as Tag,
  },
  {
    image: cookieRedVelvet,
    name: "רד וולווט",
    description: "בצק רד וולווט, שוקולד לבן ופירורי פטל",
    price: "₪25",
    category: "פירות" as Category,
    tag: null as Tag,
  },
  {
    image: cookieConfetti,
    name: "קונפטי",
    description: "סוכריות צבעוניות וסמארטיז",
    price: "₪25",
    category: "ממתקים" as Category,
    tag: null as Tag,
  },
  {
    image: cookiePistachio,
    name: "פיסטוק",
    description: "שוקולד לבן, פיסטוקים קלויים וגרגירי רימון",
    price: "₪25",
    category: "אגוזים" as Category,
    tag: "מומלץ" as Tag,
  },
  {
    image: cookiePretzel,
    name: "בייגלה",
    description: "בייגלה מלוח, שוקולד לבן וצ׳יפס שוקולד",
    price: "₪25",
    category: "שוקולד" as Category,
    tag: "חדש" as Tag,
  },
  {
    image: cookieChocolate,
    name: "שוקולד צ׳יפס",
    description: "צ׳יפס שוקולד בלגי מריר ושוקולד חלב",
    price: "₪25",
    category: "שוקולד" as Category,
    tag: null as Tag,
  },
  {
    image: cookieOreo,
    name: "אוראו",
    description: "פירורי אוראו, שוקולד לבן וקרם וניל",
    price: "₪25",
    category: "ממתקים" as Category,
    tag: null as Tag,
  },
  {
    image: cookiePeanut,
    name: "חמאת בוטנים",
    description: "חמאת בוטנים, בוטנים קלויים ושוקולד",
    price: "₪25",
    category: "אגוזים" as Category,
    tag: null as Tag,
  },
  {
    image: cookieLemon,
    name: "לימון",
    description: "גרידת לימון טרי וציפוי סוכר",
    price: "₪25",
    category: "פירות" as Category,
    tag: null as Tag,
  },
  {
    image: cookieMacadamia,
    name: "מקדמיה",
    description: "אגוזי מקדמיה ושוקולד לבן",
    price: "₪25",
    category: "אגוזים" as Category,
    tag: null as Tag,
  },
  {
    image: cookieOatmeal,
    name: "שיבולת שועל",
    description: "שיבולת שועל, צימוקים וקינמון",
    price: "₪25",
    category: "קלאסי" as Category,
    tag: null as Tag,
  },
  {
    image: cookieSaltedCaramel,
    name: "קרמל מלוח",
    description: "קרמל ביתי וקריסטלי מלח ים",
    price: "₪25",
    category: "קלאסי" as Category,
    tag: "מומלץ" as Tag,
  },
  {
    image: cookieTahini,
    name: "טחינה",
    description: "טחינה גולמית, שומשום ודבש",
    price: "₪25",
    category: "קלאסי" as Category,
    tag: null as Tag,
  },
];

const categories: Category[] = ["הכל", "שוקולד", "פירות", "ממתקים", "אגוזים", "קלאסי"];
const sortOptions: { value: SortOption; label: string }[] = [
  { value: "default", label: "ברירת מחדל" },
  { value: "name", label: "לפי שם" },
  { value: "price", label: "לפי מחיר" },
];

const CookiesSection = () => {
  const fullText = "הקולקציה שלנו";
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>("הכל");
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
      
      toast({
        title: isRemoving ? "הוסר מהמועדפים" : "נוסף למועדפים",
        description: isRemoving ? `${cookieName} הוסר מרשימת המועדפים` : `${cookieName} נוסף לרשימת המועדפים`,
      });
      
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
    toast({
      title: "המועדפים נוקו",
      description: "כל המוצרים הוסרו מרשימת המועדפים",
    });
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
  }, [displayedText, isDeleting]);

  const handleCategoryChange = (category: Category) => {
    if (category === activeCategory) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveCategory(category);
      setIsTransitioning(false);
    }, 200);
  };

  const getCategoryCount = (category: Category) => {
    if (category === "הכל") return cookies.length;
    return cookies.filter(c => c.category === category).length;
  };

  const hasActiveFilters = activeCategory !== "הכל" || activeTag !== "הכל" || searchQuery !== "" || sortBy !== "default";

  const resetAllFilters = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveCategory("הכל");
      setActiveTag("הכל");
      setSearchQuery("");
      setSortBy("default");
      setIsTransitioning(false);
    }, 200);
  };

  const filteredCookies = cookies
    .filter(cookie => {
      const matchesCategory = activeCategory === "הכל" || cookie.category === activeCategory;
      const matchesSearch = cookie.name.includes(searchQuery) || cookie.description.includes(searchQuery);
      let matchesTag = true;
      if (activeTag === "מועדפים") {
        matchesTag = favorites.includes(cookie.name);
      } else if (activeTag !== "הכל") {
        matchesTag = cookie.tag === activeTag;
      }
      return matchesCategory && matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name, "he");
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
      {/* Decorative background - rich pink tones */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary via-primary/20 to-accent/30" />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 10% 20%, hsl(var(--primary) / 0.45) 0%, transparent 40%), radial-gradient(circle at 90% 80%, hsl(var(--accent) / 0.4) 0%, transparent 45%), radial-gradient(circle at 50% 50%, hsl(var(--golden-honey) / 0.2) 0%, transparent 60%)' }} />
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
            <span className="inline-block w-1 h-12 md:h-16 bg-primary mr-1 animate-blink" />
          </h2>
          
          {/* Decorative subtitle */}
          <p className={`mt-4 text-muted-foreground text-lg transition-all duration-700 delay-500 ${
            sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            מיוצר באהבה, במיוחד בשבילכם ✨
          </p>
        </div>

        {/* All Controls - Compact Layout */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {/* Search */}
          <div className="relative w-48">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="חיפוש..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-8 pl-7 py-1.5 h-8 text-sm rounded-full bg-card/90 border-primary/30 focus:border-primary text-right"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-primary transition-all"
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
              key={category}
              onClick={() => handleCategoryChange(category)}
              variant={activeCategory === category ? "default" : "ghost"}
              size="sm"
              className={`rounded-full px-3 h-7 text-xs transition-all duration-200 ${
                activeCategory === category 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-card"
              }`}
            >
              {category}
              <span className="mr-1 text-[10px] opacity-70">
                {getCategoryCount(category)}
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
                : "bg-card/80 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Star className="h-3 w-3" />
          </button>
          <button
            onClick={() => setActiveTag("חדש")}
            className={`flex items-center gap-1 text-xs px-2.5 py-1 h-7 rounded-full transition-all ${
              activeTag === "חדש"
                ? "bg-green-500 text-white"
                : "bg-card/80 text-muted-foreground hover:text-foreground"
            }`}
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
                : "bg-card/80 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Heart className={`h-3 w-3 ${favorites.length > 0 ? "fill-current" : ""}`} />
            {favorites.length > 0 && <span>{favorites.length}</span>}
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-border/50" />

          {/* Sort */}
          <div className="flex items-center gap-1 bg-card/80 rounded-full px-2 py-1 h-7">
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
                {option.label}
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
              ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
              : "flex flex-col gap-4 max-w-3xl mx-auto"
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
              tag={cookie.tag}
              viewMode={viewMode}
              isFavorite={favorites.includes(cookie.name)}
              onToggleFavorite={() => toggleFavorite(cookie.name)}
            />
          ))}
        </div>

        {filteredCookies.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-6xl mb-4">✨</div>
            <p className="text-foreground text-xl font-medium mb-2">
              {searchQuery ? `לא מצאנו מוצרים עבור "${searchQuery}"` : "אין מוצרים בקטגוריה זו"}
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
