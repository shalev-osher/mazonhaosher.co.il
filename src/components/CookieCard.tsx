import { Plus, Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CookieCardProps {
  image: string;
  name: string;
  description: string;
  price: string;
  delay?: number;
}

const CookieCard = ({ image, name, description, price, delay = 0 }: CookieCardProps) => {
  const { addToCart, items } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  
  const itemInCart = items.find((i) => i.name === name);
  const quantity = itemInCart?.quantity || 0;

  const handleAddToCart = () => {
    addToCart({ name, price, image });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1000);
  };

  return (
    <div 
      className="group bg-card rounded-[2rem] overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-500 hover:-translate-y-3 animate-fade-in-up flex flex-col h-full"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="p-6 pb-0">
        <div className="aspect-square overflow-hidden relative rounded-full">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out rounded-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
          {quantity > 0 && (
            <div className="absolute top-3 right-3 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg animate-scale-in">
              {quantity}
            </div>
          )}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
            {name}
          </h3>
          <span className="text-primary font-bold text-lg group-hover:scale-110 transition-transform duration-300">{price}</span>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              aria-label={`קרא עוד על ${name}`}
              className="w-full text-right text-muted-foreground text-base leading-relaxed mb-4 h-12 line-clamp-2 hover:text-foreground transition-colors"
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
                <DialogTitle className="font-display text-2xl text-primary">{name}</DialogTitle>
              </DialogHeader>
              <p className="text-muted-foreground leading-relaxed">{description}</p>
              <span className="text-primary font-bold text-xl">{price}</span>
              <Button
                onClick={handleAddToCart}
                className={`w-full gap-2 transition-all duration-300 ${
                  justAdded 
                    ? "bg-green-500 hover:bg-green-500" 
                    : "bg-primary hover:bg-primary/90"
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4 animate-scale-in" />
                    נוסף לעגלה!
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    הוסף לעגלה
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Button
          onClick={handleAddToCart}
          className={`w-full gap-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
            justAdded 
              ? "bg-green-500 hover:bg-green-500" 
              : "bg-primary hover:bg-primary/90"
          }`}
        >
          {justAdded ? (
            <>
              <Check className="w-4 h-4 animate-scale-in" />
              נוסף לעגלה!
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              הוסף לעגלה
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CookieCard;
