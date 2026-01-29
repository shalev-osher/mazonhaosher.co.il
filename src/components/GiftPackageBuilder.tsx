import { useState } from "react";
import { Gift, Plus, Minus, ShoppingBag, X, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";

import cookieLotus from "@/assets/cookie-lotus.jpg";
import cookieKinder from "@/assets/cookie-kinder.jpg";
import cookieKinderBueno from "@/assets/cookie-kinderbueno.jpg";
import cookieRedVelvet from "@/assets/cookie-redvelvet.jpg";
import cookiePistachio from "@/assets/cookie-pistachio.jpg";
import cookieOreo from "@/assets/cookie-oreo.jpg";
import cookiePeanut from "@/assets/cookie-peanut.jpg";
import cookieSaltedCaramel from "@/assets/cookie-salted-caramel.jpg";
import cookieChocolate from "@/assets/cookie-chocolate.jpg";
import cookieConfetti from "@/assets/cookie-confetti.jpg";

const availableCookies = [
  { name: "לוטוס", image: cookieLotus, price: 25 },
  { name: "קינדר", image: cookieKinder, price: 25 },
  { name: "קינדר בואנו", image: cookieKinderBueno, price: 25 },
  { name: "רד וולווט", image: cookieRedVelvet, price: 25 },
  { name: "פיסטוק", image: cookiePistachio, price: 25 },
  { name: "אוראו", image: cookieOreo, price: 25 },
  { name: "חמאת בוטנים", image: cookiePeanut, price: 25 },
  { name: "קרמל מלוח", image: cookieSaltedCaramel, price: 25 },
  { name: "שוקולד צ׳יפס", image: cookieChocolate, price: 25 },
  { name: "קונפטי", image: cookieConfetti, price: 25 },
];

const packageSizes = [
  { name: "חבילה קטנה", count: 6, discount: 5, description: "6 עוגיות לבחירתך" },
  { name: "חבילה בינונית", count: 12, discount: 10, description: "12 עוגיות לבחירתך" },
  { name: "חבילה גדולה", count: 24, discount: 15, description: "24 עוגיות לבחירתך" },
];

interface SelectedCookie {
  name: string;
  image: string;
  quantity: number;
}

const GiftPackageBuilder = () => {
  const { addToCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(packageSizes[0]);
  const [selectedCookies, setSelectedCookies] = useState<SelectedCookie[]>([]);
  const [packageName, setPackageName] = useState("");

  const totalSelected = selectedCookies.reduce((acc, c) => acc + c.quantity, 0);
  const remaining = selectedSize.count - totalSelected;

  const basePrice = selectedCookies.reduce((acc, c) => acc + c.quantity * 25, 0);
  const discount = Math.round(basePrice * (selectedSize.discount / 100));
  const finalPrice = basePrice - discount;

  const handleAddCookie = (cookie: typeof availableCookies[0]) => {
    if (remaining <= 0) {
      toast({
        title: "החבילה מלאה",
        description: `בחרת כבר ${selectedSize.count} עוגיות`,
        variant: "destructive",
      });
      return;
    }

    setSelectedCookies(prev => {
      const existing = prev.find(c => c.name === cookie.name);
      if (existing) {
        return prev.map(c => 
          c.name === cookie.name ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { name: cookie.name, image: cookie.image, quantity: 1 }];
    });
  };

  const handleRemoveCookie = (cookieName: string) => {
    setSelectedCookies(prev => {
      const existing = prev.find(c => c.name === cookieName);
      if (existing && existing.quantity > 1) {
        return prev.map(c => 
          c.name === cookieName ? { ...c, quantity: c.quantity - 1 } : c
        );
      }
      return prev.filter(c => c.name !== cookieName);
    });
  };

  const handleAddToCart = () => {
    if (totalSelected !== selectedSize.count) {
      toast({
        title: "החבילה לא מלאה",
        description: `נא לבחור ${remaining} עוגיות נוספות`,
        variant: "destructive",
      });
      return;
    }

    const name = packageName || selectedSize.name;
    addToCart({
      name: `🎁 ${name}`,
      price: `₪${finalPrice}`,
      image: selectedCookies[0]?.image || cookieLotus,
    });

    toast({
      title: "החבילה נוספה לעגלה! 🎁",
      description: `${name} עם ${totalSelected} עוגיות`,
    });

    setIsOpen(false);
    setSelectedCookies([]);
    setPackageName("");
  };

  const resetBuilder = () => {
    setSelectedCookies([]);
    setPackageName("");
  };

  return (
    <section id="gift-packages" className="py-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/10 via-background to-accent/10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-primary mb-2">
            חבילות מתנה
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            בנו חבילת מתנה מושלמת עם העוגיות האהובות עליכם
          </p>
        </div>

        {/* Package Size Cards */}
        <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-6">
          {packageSizes.map((pkg) => (
            <Dialog key={pkg.name} open={isOpen && selectedSize.name === pkg.name} onOpenChange={(open) => {
              if (open) {
                setSelectedSize(pkg);
                resetBuilder();
              }
              setIsOpen(open);
            }}>
              <DialogTrigger asChild>
                <button
                  className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-primary/10 hover:border-primary/30 hover:shadow-lg transition-all duration-300 text-center group"
                >
                  <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                    <Gift className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-primary mb-1">{pkg.name}</h3>
                  <p className="text-muted-foreground text-xs mb-2">{pkg.description}</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded-full text-xs font-bold">
                      {pkg.discount}% הנחה
                    </span>
                  </div>
                </button>
              </DialogTrigger>

              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl text-primary flex items-center gap-2">
                    <Gift className="h-6 w-6" />
                    {pkg.name} - {pkg.count} עוגיות
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Package Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">שם החבילה (אופציונלי)</label>
                    <Input
                      value={packageName}
                      onChange={(e) => setPackageName(e.target.value)}
                      placeholder="למשל: מתנה ליום הולדת"
                      className="text-right"
                    />
                  </div>

                  {/* Progress */}
                  <div className="bg-secondary/50 rounded-2xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">נבחרו {totalSelected} מתוך {pkg.count}</span>
                      {remaining > 0 ? (
                        <span className="text-muted-foreground">עוד {remaining} לבחירה</span>
                      ) : (
                        <span className="text-green-600 font-bold">החבילה מלאה! ✓</span>
                      )}
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(totalSelected / pkg.count) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Selected Cookies */}
                  {selectedCookies.length > 0 && (
                    <div className="bg-card rounded-2xl p-4 border border-primary/10">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        העוגיות שבחרתם
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCookies.map((cookie) => (
                          <div
                            key={cookie.name}
                            className="flex items-center gap-2 bg-primary/10 rounded-full px-3 py-1"
                          >
                            <img src={cookie.image} alt={cookie.name} className="w-6 h-6 rounded-full object-cover" />
                            <span className="text-sm">{cookie.name}</span>
                            <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                              x{cookie.quantity}
                            </span>
                            <button
                              onClick={() => handleRemoveCookie(cookie.name)}
                              className="text-destructive hover:bg-destructive/10 rounded-full p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cookie Selection Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {availableCookies.map((cookie) => {
                      const selected = selectedCookies.find(c => c.name === cookie.name);
                      return (
                        <button
                          key={cookie.name}
                          onClick={() => handleAddCookie(cookie)}
                          disabled={remaining <= 0 && !selected}
                          className={`relative bg-card rounded-xl p-3 border transition-all duration-200 ${
                            selected 
                              ? "border-primary shadow-md" 
                              : "border-primary/10 hover:border-primary/30"
                          } ${remaining <= 0 && !selected ? "opacity-50" : ""}`}
                        >
                          <img
                            src={cookie.image}
                            alt={cookie.name}
                            className="w-full aspect-square object-cover rounded-lg mb-2"
                          />
                          <span className="text-sm font-medium block truncate">{cookie.name}</span>
                          {selected && (
                            <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                              {selected.quantity}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Price Summary */}
                  <div className="bg-accent/10 rounded-2xl p-4 space-y-2">
                    <div className="flex justify-between">
                      <span>מחיר רגיל:</span>
                      <span>₪{basePrice}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>הנחת חבילה ({pkg.discount}%):</span>
                      <span>-₪{discount}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-primary border-t pt-2">
                      <span>סה״כ:</span>
                      <span>₪{finalPrice}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    disabled={totalSelected !== pkg.count}
                    size="lg"
                    className="w-full bg-accent hover:bg-accent/90"
                  >
                    <ShoppingBag className="h-5 w-5 ml-2" />
                    להוסיף לעגלה
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GiftPackageBuilder;
