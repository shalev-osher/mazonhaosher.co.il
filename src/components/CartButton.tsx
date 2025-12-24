import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";

interface CartButtonProps {
  onClick: () => void;
}

const CartButton = ({ onClick }: CartButtonProps) => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 bg-primary hover:bg-primary/90"
      size="icon"
    >
      <ShoppingCart className="w-6 h-6" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
          {totalItems}
        </span>
      )}
    </Button>
  );
};

export default CartButton;