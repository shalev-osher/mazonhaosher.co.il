import { useEffect, useState } from "react";
import CookieCard from "./CookieCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, ArrowUpDown, Star, Sparkles, RotateCcw, LayoutGrid, List, Heart, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
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
  const fullText = "הקולקציה המיוחדת שלנו";
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
      description: "כל העוגיות הוסרו מרשימת המועדפים",
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

        {/* Category Filter & Sort */}
        <div className="flex flex-col items-center gap-4 mb-12">
          <div className="flex flex-wrap justify-center gap-3">
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
                <span className={`mr-2 text-xs px-2 py-0.5 rounded-full transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-primary-foreground/20 text-primary-foreground scale-110"
                    : "bg-primary/20 text-primary"
                }`}>
                  {getCategoryCount(category)}
                </span>
              </Button>
            ))}
          </div>
          
          {/* Tag Filter */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTag("הכל")}
              className={`flex items-center gap-1 text-sm px-4 py-2 rounded-full transition-all duration-200 ${
                activeTag === "הכל"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card/80 text-muted-foreground hover:text-foreground"
              }`}
            >
              הכל
            </button>
            <button
              onClick={() => setActiveTag("מומלץ")}
              className={`flex items-center gap-1 text-sm px-4 py-2 rounded-full transition-all duration-200 ${
                activeTag === "מומלץ"
                  ? "bg-accent text-accent-foreground shadow-md"
                  : "bg-card/80 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Star className="h-4 w-4" />
              מומלץ
            </button>
            <button
              onClick={() => setActiveTag("חדש")}
              className={`flex items-center gap-1 text-sm px-4 py-2 rounded-full transition-all duration-200 ${
                activeTag === "חדש"
                  ? "bg-green-500 text-white shadow-md"
                  : "bg-card/80 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              חדש
            </button>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2 bg-card/80 rounded-full px-4 py-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">מיון:</span>
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value)}
                className={`text-sm px-3 py-1 rounded-full transition-all duration-200 ${
                  sortBy === option.value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Favorites Filter */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setActiveTag(activeTag === "מועדפים" ? "הכל" : "מועדפים");
                  setIsTransitioning(false);
                }, 200);
              }}
              className={`flex items-center gap-1 text-sm px-4 py-2 rounded-full transition-all duration-200 ${
                activeTag === "מועדפים"
                  ? "bg-red-500 text-white shadow-md"
                  : "bg-card/80 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Heart className={`h-4 w-4 ${favorites.length > 0 ? "fill-current" : ""}`} />
              מועדפים ({favorites.length})
            </button>
            {favorites.length > 0 && (
              <button
                onClick={clearAllFavorites}
                className="flex items-center gap-1 text-sm px-3 py-2 rounded-full bg-card/80 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
                title="נקה את כל המועדפים"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-card/80 rounded-full px-2 py-1">
            <button
              onClick={() => handleViewModeChange("grid")}
              className={`p-2 rounded-full transition-all duration-200 ${
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="תצוגת גריד"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleViewModeChange("list")}
              className={`p-2 rounded-full transition-all duration-200 ${
                viewMode === "list"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="תצוגת רשימה"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Reset Button */}
          {hasActiveFilters && (
            <Button
              onClick={resetAllFilters}
              variant="outline"
              className="rounded-full gap-2 bg-card/80 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all duration-300 animate-fade-in"
            >
              <RotateCcw className="h-4 w-4" />
              איפוס סינונים
            </Button>
          )}
        </div>

        <div 
          className={`transition-all duration-300 ${
            isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
          } ${
            viewMode === "grid" 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
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
