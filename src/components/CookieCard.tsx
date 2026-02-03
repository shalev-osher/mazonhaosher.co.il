import { Plus, Minus, Trash2, Check, Info, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect, useCallback } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface CookieCardProps {
  image: string;
  name: string;
  description: string;
  price: string;
  delay?: number;
  tag?: "מומלץ" | "חדש" | "Recommended" | "New" | null;
  viewMode?: "grid" | "list";
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const CookieCard = ({ image, name, description, price, delay = 0, tag, viewMode = "grid", isFavorite = false, onToggleFavorite }: CookieCardProps) => {
  const { addToCart, removeFromCart, updateQuantity, items } = useCart();
  const { t } = useLanguage();
  const [justAdded, setJustAdded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const itemInCart = items.find((i) => i.name === name);
  const quantity = itemInCart?.quantity || 0;

  // 3D tilt effect handler
  const handleMouseMove = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = (y - centerY) / 8;
    const tiltY = (centerX - x) / 8;
    setTilt({ x: tiltX, y: tiltY });
  }, []);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    setTilt({ x: 0, y: 0 });
  };

  // Intersection Observer for scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleAddToCart = () => {
    addToCart({ name, price, image });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1000);
  };

  const handleIncrement = () => {
    if (quantity < 6) {
      updateQuantity(name, quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(name, quantity - 1);
    } else {
      removeFromCart(name);
    }
  };

  // List view layout
  if (viewMode === "list") {
    return (
      <div 
        ref={cardRef}
        className={cn(
          "group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-500 flex items-center gap-4 p-4 border-2 border-amber-500/30",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
        style={{ 
          transitionDelay: `${delay}ms`,
          transitionProperty: 'opacity, transform'
        }}
      >
        {/* Image with lazy loading */}
        <div className="relative shrink-0">
          {tag && (
            <div className={`absolute -top-1 -right-1 z-10 px-2 py-0.5 rounded-full text-xs font-bold shadow-lg ${
              tag === "מומלץ" || tag === "Recommended"
                ? "bg-amber-500 text-white" 
                : "bg-emerald-500 text-white"
            }`}>
              {(tag === "מומלץ" || tag === "Recommended") ? "⭐" : "✨"}
            </div>
          )}
          <div className="w-20 h-20 overflow-hidden rounded-full relative bg-card">
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 animate-pulse rounded-full transition-opacity duration-500",
              imageLoaded ? "opacity-0" : "opacity-100"
            )} />
            <img
              src={image}
              alt={name}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              className={cn(
                "w-full h-full object-cover group-hover:scale-110 transition-all duration-500",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-amber-600 transition-colors">
              {name}
            </h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground hover:text-sky-500 transition-colors">
                    <Info className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs text-right" dir="rtl">
                  <p className="font-medium">{name}</p>
                  <p className="text-sm text-muted-foreground">{description}</p>
                  <p className="text-sm text-amber-600 font-bold mt-1">{price}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-muted-foreground text-sm truncate">{description}</p>
        </div>

        {/* Favorite Button */}
        {onToggleFavorite && (
          <button
            onClick={onToggleFavorite}
            className={`shrink-0 p-2 rounded-full transition-all duration-300 ${
              isFavorite 
                ? "text-red-500 hover:text-red-600" 
                : "text-muted-foreground hover:text-red-500"
            }`}
          >
            <Heart className={`h-5 w-5 transition-transform duration-300 hover:scale-125 ${isFavorite ? "fill-current" : ""}`} />
          </button>
        )}

        {/* Price */}
        <span className="text-amber-600 font-bold text-lg shrink-0">{price}</span>

        {/* Actions */}
        <div className="shrink-0">
          {quantity > 0 ? (
            <div className="flex items-center gap-2">
              <Button
                onClick={handleDecrement}
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
              >
                {quantity === 1 ? <Trash2 className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
              </Button>
              <span className="w-6 text-center font-bold">{quantity}</span>
              <Button
                onClick={handleIncrement}
                size="icon"
                className="h-8 w-8 rounded-full bg-amber-500 hover:bg-amber-600"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleAddToCart}
              size="sm"
              className={`gap-1 transition-all duration-300 ${
                justAdded 
                  ? "bg-emerald-500 hover:bg-emerald-500" 
                  : "bg-amber-500 hover:bg-amber-600"
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3 h-3" />
                  {t('cookieCard.added')}
                </>
              ) : (
                <>
                  <Plus className="w-3 h-3" />
                  {t('cookieCard.add')}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Grid view layout (original)
  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col cursor-pointer border-2 border-amber-500/30",
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"
      )}
      style={{
        transitionDelay: isVisible ? '0ms' : `${delay}ms`,
        transitionProperty: 'opacity, transform, box-shadow',
        transform: isHovering 
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(10px) scale(1.02)` 
          : isVisible 
            ? 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)' 
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(0.95)',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Image section */}
      <div className="p-3 pb-0 relative">
        {/* Favorite Button */}
        {onToggleFavorite && (
          <button
            onClick={onToggleFavorite}
            className={`absolute top-1 right-1 z-10 p-1 rounded-full bg-card shadow-sm transition-all duration-300 hover:scale-110 ${
              isFavorite 
                ? "text-red-500" 
                : "text-muted-foreground hover:text-red-500"
            }`}
          >
            <Heart className={`h-3 w-3 ${isFavorite ? "fill-current" : ""}`} />
          </button>
        )}
        {tag && (
          <div className={`absolute top-1 left-1 z-10 px-1.5 py-0.5 rounded-full text-[8px] font-bold shadow-sm ${
            tag === "מומלץ" || tag === "Recommended"
              ? "bg-amber-500 text-white" 
              : "bg-emerald-500 text-white"
          }`}>
            {(tag === "מומלץ" || tag === "Recommended") ? "⭐" : "✨"}
          </div>
        )}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="aspect-square overflow-hidden relative rounded-md group/image cursor-pointer bg-card">
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 animate-pulse rounded-lg transition-opacity duration-500",
                  imageLoaded ? "opacity-0" : "opacity-100"
                )} />
                <img
                  src={image}
                  alt={name}
                  loading="lazy"
                  onLoad={() => setImageLoaded(true)}
                  className={cn(
                    "w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ease-out rounded-lg bg-card",
                    imageLoaded ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs text-right" dir="rtl">
              <p className="font-medium text-base">{name}</p>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                <span className="text-amber-600 font-bold">{price}</span>
                {tag && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    tag === "מומלץ" || tag === "Recommended"
                      ? "bg-amber-500/20 text-amber-700" 
                      : "bg-emerald-500/20 text-emerald-700"
                  }`}>
                    {(tag === "מומלץ" || tag === "Recommended") ? `⭐ ${t('cookieCard.recommended')}` : `✨ ${t('cookieCard.new')}`}
                  </span>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Content section */}
      <div className="p-3 pt-3 flex-1 text-center">
        <h3 className="font-display text-base font-semibold text-foreground group-hover:text-amber-600 transition-colors duration-300 line-clamp-1 mb-2">
          {name}
        </h3>
        <span className="text-amber-600 font-bold text-base block mb-2">{price}</span>
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              aria-label={`${t('cookieCard.readMore')} ${name}`}
              className="w-full text-center text-muted-foreground text-sm leading-relaxed line-clamp-2 hover:text-foreground transition-colors"
            >
              {description}
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-sm text-center" dir="rtl">
            <div className="flex flex-col items-center gap-4">
              <div className="w-40 h-40 rounded-full overflow-hidden shadow-elevated">
                <img 
                  src={image} 
                  alt={name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <DialogHeader className="text-center">
                <DialogTitle className="font-display text-2xl text-amber-600">{name}</DialogTitle>
              </DialogHeader>
              <p className="text-muted-foreground leading-relaxed">{description}</p>
              <span className="text-amber-600 font-bold text-xl">{price}</span>
              
              {/* Quantity controls in dialog */}
              {quantity > 0 ? (
                <div className="flex items-center gap-3 w-full">
                  <Button
                    onClick={handleDecrement}
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full"
                  >
                    {quantity === 1 ? <Trash2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                  </Button>
                  <span className="flex-1 text-center font-bold text-lg">{quantity}</span>
                  <Button
                    onClick={handleIncrement}
                    size="icon"
                    className="h-10 w-10 rounded-full bg-amber-500 hover:bg-amber-600"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleAddToCart}
                  className="w-full gap-2 bg-amber-500 hover:bg-amber-600"
                >
                  <Plus className="w-4 h-4" />
                  {t('cookieCard.addToCart')}
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Button section */}
      <div className="px-3 pb-3 pt-2 flex justify-center">
        {quantity > 0 ? (
          <div className="flex items-center gap-2">
            <Button
              onClick={handleDecrement}
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full shrink-0"
            >
              {quantity === 1 ? <Trash2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
            </Button>
            <div className="w-8 text-center font-bold text-base text-foreground">
              {quantity}
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {
                      if (quantity >= 6) {
                        setIsShaking(true);
                        setTimeout(() => setIsShaking(false), 500);
                      } else {
                        handleIncrement();
                      }
                    }}
                    size="icon"
                    className={cn(
                      "h-8 w-8 rounded-full shrink-0 transition-all duration-200",
                      quantity >= 6 
                        ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50" 
                        : "bg-amber-500 hover:bg-amber-600",
                      isShaking && "animate-[shake_0.5s_ease-in-out]"
                    )}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                {quantity >= 6 && (
                  <TooltipContent side="top" className="bg-background/90 border border-amber-500/50 text-foreground">
                    <p>{t('cookieCard.maxItems')}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        ) : (
          <Button
            onClick={handleAddToCart}
            size="icon"
            className={`h-9 w-9 rounded-full transition-all duration-300 ${
              justAdded 
                ? "bg-emerald-500 hover:bg-emerald-500" 
                : "bg-amber-500 hover:bg-amber-600"
            }`}
          >
            {justAdded ? (
              <Check className="w-5 h-5" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CookieCard;
