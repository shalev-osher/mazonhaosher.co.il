import { useState } from "react";
import { Plus, Minus, X } from "lucide-react";
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
import { useLanguage } from "@/contexts/LanguageContext";
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

// SVG icons with inline styles to prevent Tailwind purging
const GiftIcon = ({ size = 28 }: { size?: number }) => (
  <svg style={{ width: `${size}px`, height: `${size}px`, color: 'white', fill: 'rgba(255,255,255,0.2)' }} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="8" width="18" height="4" rx="1"/>
    <path d="M12 8v13"/>
    <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/>
    <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>
  </svg>
);

const PackageIcon = () => (
  <svg style={{ width: '16px', height: '16px', color: 'white', fill: 'rgba(255,255,255,0.2)' }} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m7.5 4.27 9 5.15"/>
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
    <path d="m3.3 7 8.7 5 8.7-5"/>
    <path d="M12 22V12"/>
  </svg>
);

const ShoppingBagIcon = () => (
  <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
    <path d="M3 6h18"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);

const giftGradientStyle = { background: 'linear-gradient(to bottom right, #a855f7, #7c3aed)' };

const availableCookiesData = {
  he: [
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
  ],
  en: [
    { name: "Lotus", image: cookieLotus, price: 25 },
    { name: "Kinder", image: cookieKinder, price: 25 },
    { name: "Kinder Bueno", image: cookieKinderBueno, price: 25 },
    { name: "Red Velvet", image: cookieRedVelvet, price: 25 },
    { name: "Pistachio", image: cookiePistachio, price: 25 },
    { name: "Oreo", image: cookieOreo, price: 25 },
    { name: "Peanut Butter", image: cookiePeanut, price: 25 },
    { name: "Salted Caramel", image: cookieSaltedCaramel, price: 25 },
    { name: "Chocolate Chip", image: cookieChocolate, price: 25 },
    { name: "Confetti", image: cookieConfetti, price: 25 },
  ],
};

interface SelectedCookie {
  name: string;
  image: string;
  quantity: number;
}

const GiftPackageBuilder = () => {
  const { addToCart } = useCart();
  const { t, language, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  
  const packageSizes = [
    { nameKey: "gift.small", count: 6, discount: 5, descKey: "gift.smallDesc" },
    { nameKey: "gift.medium", count: 12, discount: 10, descKey: "gift.mediumDesc" },
    { nameKey: "gift.large", count: 24, discount: 15, descKey: "gift.largeDesc" },
  ];
  
  const [selectedSize, setSelectedSize] = useState(packageSizes[0]);
  const [selectedCookies, setSelectedCookies] = useState<SelectedCookie[]>([]);
  const [packageName, setPackageName] = useState("");

  const availableCookies = availableCookiesData[language];
  const totalSelected = selectedCookies.reduce((acc, c) => acc + c.quantity, 0);
  const remaining = selectedSize.count - totalSelected;

  const basePrice = selectedCookies.reduce((acc, c) => acc + c.quantity * 25, 0);
  const discount = Math.round(basePrice * (selectedSize.discount / 100));
  const finalPrice = basePrice - discount;

  const handleAddCookie = (cookie: typeof availableCookies[0]) => {
    if (remaining <= 0) {
      toast({
        title: t('gift.packageFullError'),
        description: t('gift.alreadySelected').replace('{count}', String(selectedSize.count)),
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
        title: t('gift.notComplete'),
        description: t('gift.selectMore').replace('{count}', String(remaining)),
        variant: "destructive",
      });
      return;
    }

    const name = packageName || t(selectedSize.nameKey);
    addToCart({
      name: `🎁 ${name}`,
      price: `₪${finalPrice}`,
      image: selectedCookies[0]?.image || cookieLotus,
    });

    toast({
      title: t('gift.addedToCart'),
      description: `${name} ${language === 'he' ? 'עם' : 'with'} ${totalSelected} ${t('gift.cookies')}`,
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
      {/* Rich purple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-violet-50 to-fuchsia-100 dark:from-purple-950/40 dark:via-violet-950/30 dark:to-fuchsia-950/40" />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, hsl(270 70% 60% / 0.25) 0%, transparent 50%), radial-gradient(circle at 75% 75%, hsl(280 65% 55% / 0.2) 0%, transparent 45%), radial-gradient(circle at 50% 50%, hsl(265 75% 65% / 0.15) 0%, transparent 55%)' }} />
      {/* Gift pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='10' y='20' width='30' height='25' fill='%238b5cf6' rx='3' /%3E%3Crect x='22' y='20' width='6' height='25' fill='%23a855f7' /%3E%3Crect x='10' y='15' width='30' height='8' fill='%239333ea' rx='2' /%3E%3Ccircle cx='25' cy='12' r='5' fill='%23c084fc' /%3E%3C/svg%3E")`, backgroundSize: '80px 80px' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-purple-600 mb-2">
            {t('gift.title')}
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            {t('gift.subtitle')}
          </p>
        </div>

        {/* Package Size Cards */}
        <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-6">
          {packageSizes.map((pkg) => (
            <Dialog key={pkg.nameKey} open={isOpen && selectedSize.nameKey === pkg.nameKey} onOpenChange={(open) => {
              if (open) {
                setSelectedSize(pkg);
                resetBuilder();
              }
              setIsOpen(open);
            }}>
              <DialogTrigger asChild>
                <button
                  className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/40 hover:shadow-lg transition-all duration-300 text-center group"
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform shadow-lg" style={giftGradientStyle}>
                    <GiftIcon size={28} />
                  </div>
                  <h3 className="font-display text-lg font-bold text-purple-600 mb-1">{t(pkg.nameKey)}</h3>
                  <p className="text-muted-foreground text-xs mb-2">{t(pkg.descKey)}</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="bg-emerald-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                      {pkg.discount}% {t('gift.discount')}
                    </span>
                  </div>
                </button>
              </DialogTrigger>

              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir={isRTL ? "rtl" : "ltr"}>
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl text-purple-600 flex items-center gap-2">
                    <div className="p-2 rounded-xl shadow-md" style={giftGradientStyle}>
                      <GiftIcon size={20} />
                    </div>
                    {t(pkg.nameKey)} - {pkg.count} {t('gift.cookies')}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Package Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('gift.packageNameOptional')}</label>
                    <Input
                      value={packageName}
                      onChange={(e) => setPackageName(e.target.value)}
                      placeholder={t('gift.packageNamePlaceholder')}
                      className={isRTL ? "text-right" : "text-left"}
                    />
                  </div>

                  {/* Progress */}
                  <div className="bg-secondary/50 rounded-2xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{t('gift.selected')} {totalSelected} {t('gift.outOf')} {pkg.count}</span>
                      {remaining > 0 ? (
                        <span className="text-muted-foreground">{t('gift.moreToSelect').replace('{count}', String(remaining))}</span>
                      ) : (
                        <span className="text-emerald-600 font-bold">{t('gift.packageFull')} ✓</span>
                      )}
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(totalSelected / pkg.count) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Selected Cookies */}
                  {selectedCookies.length > 0 && (
                    <div className="bg-card rounded-2xl p-4 border border-purple-500/20">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <div className="p-1.5 rounded-lg shadow-sm" style={giftGradientStyle}>
                          <PackageIcon />
                        </div>
                        {t('gift.yourCookies')}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                          {selectedCookies.map((cookie) => (
                          <div
                            key={cookie.name}
                            className="flex items-center gap-2 bg-purple-500/10 rounded-full px-3 py-1"
                          >
                            <img src={cookie.image} alt={cookie.name} className="w-6 h-6 rounded-full object-cover" />
                            <span className="text-sm">{cookie.name}</span>
                            <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full">
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
                              ? "border-purple-500 shadow-md" 
                              : "border-purple-500/10 hover:border-purple-500/30"
                          } ${remaining <= 0 && !selected ? "opacity-50" : ""}`}
                        >
                          <img
                            src={cookie.image}
                            alt={cookie.name}
                            className="w-full aspect-square object-cover rounded-lg mb-2"
                          />
                          <span className="text-sm font-medium block truncate">{cookie.name}</span>
                          {selected && (
                            <div className={`absolute -top-2 ${isRTL ? '-right-2' : '-left-2'} bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold`}>
                              {selected.quantity}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Price Summary */}
                  <div className="bg-teal-500/10 rounded-2xl p-4 space-y-2">
                    <div className="flex justify-between">
                      <span>{t('gift.regularPrice')}</span>
                      <span>₪{basePrice}</span>
                    </div>
                    <div className="flex justify-between text-emerald-600">
                      <span>{t('gift.packageDiscount')} ({pkg.discount}%):</span>
                      <span>-₪{discount}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-purple-600 border-t pt-2">
                      <span>{t('gift.total')}</span>
                      <span>₪{finalPrice}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    disabled={totalSelected !== pkg.count}
                    size="lg"
                    className="w-full bg-purple-500 hover:bg-purple-600"
                  >
                    <span className="ml-2"><ShoppingBagIcon /></span>
                    {t('gift.addToCart')}
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
