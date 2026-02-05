import { Plus, Minus, Trash2, Check, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
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

const CookieCard = ({ image, name, price, delay = 0, viewMode = "grid", isFavorite = false, onToggleFavorite }: CookieCardProps) => {
  const { addToCart, removeFromCart, updateQuantity, items } = useCart();
  const { t } = useLanguage();
  const [justAdded, setJustAdded] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const itemInCart = items.find((i) => i.name === name);
  const quantity = itemInCart?.quantity || 0;

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
        className="group bg-card rounded-2xl overflow-hidden shadow-soft flex items-center gap-4 p-4 border-2 border-amber-500/30"
      >
        {/* Image placeholder */}
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-full bg-white border border-amber-200 shadow-sm" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg font-semibold text-foreground">
            {name}
          </h3>
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

  // Grid view layout
  return (
    <div 
      ref={cardRef}
      className="group bg-card rounded-xl overflow-hidden shadow-soft flex flex-col border-2 border-amber-500/30"
    >
      {/* Image section */}
      <div className="p-2 pb-0 relative">
        {/* Favorite Button */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className={`absolute top-1 right-1 z-10 p-1 rounded-full bg-card shadow-sm ${
              isFavorite 
                ? "text-red-500" 
                : "text-muted-foreground hover:text-red-500"
            }`}
          >
            <Heart className={`h-3 w-3 ${isFavorite ? "fill-current" : ""}`} />
          </button>
        )}
        <div className="aspect-[4/3] rounded-md bg-white border border-amber-200 shadow-sm" />
      </div>
      
      {/* Content section */}
      <div className="p-2 pt-1.5 flex-1 text-center">
        <h3 className="font-display text-sm font-semibold text-foreground line-clamp-1 mb-1">
          {name}
        </h3>
        <span className="text-amber-600 font-bold text-sm block">{price}</span>
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
