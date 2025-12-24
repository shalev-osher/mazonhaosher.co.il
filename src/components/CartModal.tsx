import { X, Plus, Minus, Trash2, MessageCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WHATSAPP_NUMBER = "972546791198";

const CartModal = ({ isOpen, onClose }: CartModalProps) => {
  const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();

  const handleWhatsAppOrder = () => {
    if (items.length === 0) {
      toast.error("העגלה ריקה");
      return;
    }

    const orderDetails = items
      .map((item) => `• ${item.name} x${item.quantity} (${parseInt(item.price.replace(/[^\d]/g, "")) * item.quantity}₪)`)
      .join("\n");

    const message = `היי! 🍪\n\nאשמח להזמין:\n${orderDetails}\n\nסה״כ: ${getTotalPrice()}₪\n\nתודה!`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    
    toast.success("ההזמנה נשלחה לוואטסאפ!");
    clearCart();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-background rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-display font-bold text-foreground">העגלה שלי</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
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
                    <p className="text-primary font-medium">{item.price}</p>
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
            <div className="flex justify-between items-center text-lg">
              <span className="font-semibold">סה״כ:</span>
              <span className="font-bold text-primary text-2xl">₪{getTotalPrice()}</span>
            </div>
            <Button
              onClick={handleWhatsAppOrder}
              className="w-full h-14 text-lg gap-2 bg-green-500 hover:bg-green-600"
            >
              <MessageCircle className="w-5 h-5" />
              שלחו הזמנה בוואטסאפ
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;