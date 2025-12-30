import { Plus, Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
      className="group bg-card rounded-[2rem] overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-500 hover:-translate-y-3 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="aspect-square overflow-hidden relative">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {quantity > 0 && (
          <div className="absolute top-3 right-3 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg animate-scale-in">
            {quantity}
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
            {name}
          </h3>
          <span className="text-primary font-bold text-lg group-hover:scale-110 transition-transform duration-300">{price}</span>
        </div>
        <p className="text-muted-foreground text-base leading-relaxed mb-4">
          {description}
        </p>
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