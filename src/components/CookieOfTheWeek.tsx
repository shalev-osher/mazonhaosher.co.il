import { useState, useEffect } from "react";
import { Star, Clock, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Import all cookie images
import cookieLotus from "@/assets/cookie-lotus.jpg";
import cookieKinder from "@/assets/cookie-kinder.jpg";
import cookieKinderBueno from "@/assets/cookie-kinderbueno.jpg";
import cookieRedVelvet from "@/assets/cookie-redvelvet.jpg";
import cookiePistachio from "@/assets/cookie-pistachio.jpg";
import cookieOreo from "@/assets/cookie-oreo.jpg";
import cookiePeanut from "@/assets/cookie-peanut.jpg";
import cookieSaltedCaramel from "@/assets/cookie-salted-caramel.jpg";

const cookieImages: Record<string, string> = {
  "לוטוס": cookieLotus,
  "קינדר": cookieKinder,
  "קינדר בואנו": cookieKinderBueno,
  "רד וולווט": cookieRedVelvet,
  "פיסטוק": cookiePistachio,
  "אוראו": cookieOreo,
  "חמאת בוטנים": cookiePeanut,
  "קרמל מלוח": cookieSaltedCaramel,
};

const cookieDescriptions: Record<string, string> = {
  "לוטוס": "ביסקוויט לוטוס וממרח קרמל",
  "קינדר": "שוקולד קינדר וכדורי שוקולד צבעוניים",
  "קינדר בואנו": "קינדר בואנו, שוקולד חלב וציפוי שוקולד",
  "רד וולווט": "בצק רד וולווט, שוקולד לבן ופירורי פטל",
  "פיסטוק": "שוקולד לבן, פיסטוקים קלויים וגרגירי רימון",
  "אוראו": "פירורי אוראו, שוקולד לבן וקרם וניל",
  "חמאת בוטנים": "חמאת בוטנים, בוטנים קלויים ושוקולד",
  "קרמל מלוח": "קרמל ביתי וקריסטלי מלח ים",
};

interface CookieOfWeek {
  cookie_name: string;
  discount_percent: number;
  valid_until: string;
}

const CookieOfTheWeek = () => {
  const { addToCart } = useCart();
  const [cookieOfWeek, setCookieOfWeek] = useState<CookieOfWeek | null>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const fetchCookieOfWeek = async () => {
      const { data, error } = await supabase
        .from("cookie_of_week")
        .select("*")
        .eq("is_active", true)
        .single();

      if (data && !error) {
        setCookieOfWeek(data);
      }
    };

    fetchCookieOfWeek();
  }, []);

  useEffect(() => {
    if (!cookieOfWeek) return;

    const calculateTimeLeft = () => {
      const validUntil = new Date(cookieOfWeek.valid_until).getTime();
      const now = new Date().getTime();
      const difference = validUntil - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, [cookieOfWeek]);

  if (!cookieOfWeek) return null;

  const originalPrice = 25;
  const discountedPrice = Math.round(originalPrice * (1 - cookieOfWeek.discount_percent / 100));
  const image = cookieImages[cookieOfWeek.cookie_name] || cookieLotus;
  const description = cookieDescriptions[cookieOfWeek.cookie_name] || "";

  const handleAddToCart = () => {
    addToCart({
      name: cookieOfWeek.cookie_name,
      price: `₪${discountedPrice}`,
      image,
    });
    toast({
      title: "נוסף לעגלה!",
      description: `${cookieOfWeek.cookie_name} במחיר מבצע נוסף לעגלה`,
    });
  };

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-accent/30 via-primary/20 to-accent/30" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgZmlsbD0iI2U4NWQ4ZiIgZmlsbC1vcGFjaXR5PSIwLjEiIGN4PSIyMCIgY3k9IjIwIiByPSI0Ii8+PC9nPjwvc3ZnPg==')] opacity-50" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-8 bg-card/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-primary/20">
          {/* Badge */}
          <div className="absolute -top-4 right-8 bg-accent text-accent-foreground px-6 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg animate-bounce-slow">
            <Star className="h-5 w-5 fill-current" />
            עוגיית השבוע
            <Star className="h-5 w-5 fill-current" />
          </div>

          {/* Image */}
          <div className="relative w-64 h-64 flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full animate-pulse" />
            <img
              src={image}
              alt={cookieOfWeek.cookie_name}
              className="w-full h-full object-cover rounded-full border-4 border-primary shadow-xl relative z-10"
            />
            <div className="absolute -bottom-2 -right-2 bg-destructive text-destructive-foreground px-4 py-2 rounded-full font-bold text-lg flex items-center gap-1 shadow-lg z-20">
              <Percent className="h-4 w-4" />
              {cookieOfWeek.discount_percent}% הנחה
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 text-center md:text-right">
            <h3 className="font-display text-4xl font-bold text-primary mb-2">
              {cookieOfWeek.cookie_name}
            </h3>
            <p className="text-lg text-muted-foreground mb-4">{description}</p>
            
            {/* Price */}
            <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
              <span className="text-2xl text-muted-foreground line-through">₪{originalPrice}</span>
              <span className="text-4xl font-bold text-primary">₪{discountedPrice}</span>
            </div>

            {/* Countdown */}
            <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div className="flex gap-2 text-center">
                <div className="bg-primary/10 px-3 py-2 rounded-lg">
                  <span className="text-2xl font-bold text-primary">{timeLeft.days}</span>
                  <span className="text-xs text-muted-foreground block">ימים</span>
                </div>
                <div className="bg-primary/10 px-3 py-2 rounded-lg">
                  <span className="text-2xl font-bold text-primary">{timeLeft.hours}</span>
                  <span className="text-xs text-muted-foreground block">שעות</span>
                </div>
                <div className="bg-primary/10 px-3 py-2 rounded-lg">
                  <span className="text-2xl font-bold text-primary">{timeLeft.minutes}</span>
                  <span className="text-xs text-muted-foreground block">דקות</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-8"
            >
              להוסיף לעגלה במחיר מבצע
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CookieOfTheWeek;
