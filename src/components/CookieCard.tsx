import { Plus, Minus, Trash2, Check, Info, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
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
  const [isShaking, setIsShaking] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
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
        {/* Image with lazy loading */}
        <div className="relative shrink-0">
          <div className="w-20 h-20 overflow-hidden rounded-full relative bg-white">
            <img
              src={image}
              alt={name}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-semibold text-foreground">
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
    <Dialog>
      <div 
        ref={cardRef}
        className="group bg-card rounded-xl overflow-hidden shadow-soft flex flex-col cursor-pointer border-2 border-amber-500/30"
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
          {tag && (
            <div className={`absolute top-1 left-1 z-10 px-1.5 py-0.5 rounded-full text-[8px] font-bold shadow-sm ${
              tag === "מומלץ" || tag === "Recommended"
                ? "bg-amber-500 text-white" 
                : "bg-emerald-500 text-white"
            }`}>
              {(tag === "מומלץ" || tag === "Recommended") ? "⭐" : "✨"}
            </div>
          )}
          {/* Image opens dialog */}
          <DialogTrigger asChild>
            <div className="aspect-[4/3] overflow-hidden relative rounded-md cursor-pointer bg-white">
              <img
                src={image}
                alt={name}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </DialogTrigger>
        </div>
        
        {/* Content section */}
        <div className="p-2 pt-1.5 flex-1 text-center">
          <h3 className="font-display text-sm font-semibold text-foreground line-clamp-1 mb-1">
            {name}
          </h3>
          <span className="text-amber-600 font-bold text-sm block mb-1">{price}</span>
          <DialogTrigger asChild>
            <button
              type="button"
              aria-label={`${t('cookieCard.readMore')} ${name}`}
              className="w-full text-center text-muted-foreground text-xs leading-relaxed line-clamp-2 hover:text-foreground transition-colors"
            >
              {description}
            </button>
          </DialogTrigger>
        </div>

        {/* Dialog Content */}
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
    </Dialog>
  );
};

export default CookieCard;
