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
    <section className="py-4 relative overflow-hidden w-full">
      <div className="container mx-auto px-4 relative z-10">
        <div className="group max-w-lg mx-auto flex items-center gap-4 bg-background/60 backdrop-blur-sm rounded-xl p-5 shadow-[0_0_25px_-5px_hsl(35_80%_55%/0.5)] border border-[hsl(35,80%,55%)] hover:shadow-[0_0_35px_-5px_hsl(35_80%_55%/0.7)] hover:border-[hsl(35,80%,60%)] transition-all duration-300 hover:scale-[1.02]">
          {/* Badge - centered with glow */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-lg animate-pulse">
            <Star className="h-3 w-3 fill-current" />
            עוגיית השבוע
            <Star className="h-3 w-3 fill-current" />
          </div>

          {/* Image - bigger with glow effect */}
          <div className="relative w-24 h-24 flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(35,80%,55%)] to-accent rounded-full opacity-30 blur-md group-hover:opacity-50 transition-opacity" />
            <img
              src={image}
              alt={cookieOfWeek.cookie_name}
              className="w-full h-full object-cover rounded-full border-2 border-[hsl(35,80%,55%)] shadow-lg relative z-10 group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute -bottom-1 -right-1 bg-destructive text-destructive-foreground px-2 py-0.5 rounded-full font-bold text-xs flex items-center gap-0.5 shadow-md z-20 animate-bounce">
              <Percent className="h-3 w-3" />
              {cookieOfWeek.discount_percent}%
            </div>
          </div>

          {/* Content - bigger text */}
          <div className="flex-1 text-center min-w-0">
            <h3 className="font-display text-xl font-bold text-primary mb-1">
              {cookieOfWeek.cookie_name}
            </h3>
            <p className="text-sm text-muted-foreground">{description}</p>
            
            {/* Price - bigger */}
            <div className="flex items-center justify-center gap-3 mt-2">
              <span className="text-sm text-muted-foreground line-through">₪{originalPrice}</span>
              <span className="text-2xl font-bold text-primary">₪{discountedPrice}</span>
            </div>
          </div>

          <Button
            onClick={handleAddToCart}
            size="default"
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-5 flex-shrink-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            הוספה
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CookieOfTheWeek;
