import { ShoppingBag } from "lucide-react";
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
      className="fixed bottom-14 right-4 z-50 w-10 h-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 bg-primary hover:bg-primary/90"
      size="icon"
    >
      <ShoppingBag className="w-5 h-5" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold">
          {totalItems}
        </span>
      )}
    </Button>
  );
};

export default CartButton;