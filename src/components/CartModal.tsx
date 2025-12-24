import { useState } from "react";
import { X, Plus, Minus, Trash2, ShoppingBag, Gift } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import CheckoutForm from "./CheckoutForm";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BUNDLE_PRICE = 80;
const BUNDLE_SIZE = 4;
const REGULAR_PRICE = 25;

const CartModal = ({ isOpen, onClose }: CartModalProps) => {
  const { items, updateQuantity, removeFromCart, getTotalItems } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  // חישוב מחיר עם הנחת חבילה
  const calculateTotalPrice = () => {
    const totalItems = getTotalItems();
    const bundles = Math.floor(totalItems / BUNDLE_SIZE);
    const remaining = totalItems % BUNDLE_SIZE;
    return bundles * BUNDLE_PRICE + remaining * REGULAR_PRICE;
  };

  const getOriginalPrice = () => {
    return getTotalItems() * REGULAR_PRICE;
  };

  const getSavings = () => {
    return getOriginalPrice() - calculateTotalPrice();
  };

  const handleClose = () => {
    setShowCheckout(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative bg-background rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[85vh] flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-display font-bold text-foreground">
            {showCheckout ? "השלמת הזמנה" : "העגלה שלי"}
          </h2>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {showCheckout ? (
          <CheckoutForm onBack={() => setShowCheckout(false)} onClose={handleClose} totalPrice={calculateTotalPrice()} />
        ) : (
          <>
            {/* Bundle Deal Banner */}
            <div className="mx-6 mt-4 p-3 bg-primary/10 border border-primary/30 rounded-xl flex items-center gap-3">
              <Gift className="w-6 h-6 text-primary flex-shrink-0" />
              <div className="text-sm">
                <span className="font-bold text-primary">מבצע! </span>
                <span className="text-foreground">4 עוגיות ב-₪80 במקום ₪100</span>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground text-lg">העגלה ריקה</p>
                  <p className="text-muted-foreground text-sm mt-2">הוסיפו עוגיות טעימות!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div 
                      key={item.name}
                      className="flex items-center gap-4 bg-secondary/50 rounded-xl p-4"
                    >
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{item.name}</h3>
                        <p className="text-primary font-medium">₪{REGULAR_PRICE}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.name, item.quantity - 1)}
                          className="p-1 hover:bg-secondary rounded-full transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.name, item.quantity + 1)}
                          className="p-1 hover:bg-secondary rounded-full transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.name)}
                          className="p-1 hover:bg-destructive/20 text-destructive rounded-full transition-colors mr-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-border space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>{getTotalItems()} עוגיות</span>
                    {getSavings() > 0 && (
                      <span className="line-through">₪{getOriginalPrice()}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold">סה״כ:</span>
                    <div className="flex items-center gap-2">
                      {getSavings() > 0 && (
                        <span className="text-sm text-green-600 font-medium">
                          חסכת ₪{getSavings()}!
                        </span>
                      )}
                      <span className="font-bold text-primary text-2xl">₪{calculateTotalPrice()}</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => setShowCheckout(true)}
                  className="w-full h-14 text-lg gap-2"
                >
                  המשך להזמנה
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CartModal;
