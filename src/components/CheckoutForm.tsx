import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircle, Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";

interface CheckoutFormProps {
  onBack: () => void;
  onClose: () => void;
  totalPrice: number;
}

const WHATSAPP_NUMBER = "972546791198";
const OWNER_WHATSAPP_NUMBER = "972546791198"; // מספר הוואטסאפ של בעלת העסק

const CheckoutForm = ({ onBack, onClose, totalPrice }: CheckoutFormProps) => {
  const { items, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      toast.error("נא להזין שם פרטי");
      return false;
    }
    if (!formData.lastName.trim()) {
      toast.error("נא להזין שם משפחה");
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("נא להזין כתובת מייל תקינה");
      return false;
    }
    if (!formData.phone.trim() || formData.phone.length < 9) {
      toast.error("נא להזין מספר טלפון תקין");
      return false;
    }
    return true;
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    const orderDetails = items
      .map((item) => `• ${item.name} x${item.quantity} (${parseInt(item.price.replace(/[^\d]/g, "")) * item.quantity}₪)`)
      .join("\n");

    // totalPrice comes from props
    const customerFullName = `${formData.firstName} ${formData.lastName}`;

    try {
      // שליחת הודעה לוואטסאפ של בעלת העסק
      const ownerMessage = `🍪 הזמנה חדשה!\n\n👤 פרטי לקוח:\nשם: ${customerFullName}\nטלפון: ${formData.phone}\nמייל: ${formData.email}\n\n📦 ההזמנה:\n${orderDetails}\n\n💰 סה״כ: ₪${totalPrice}\n\n💵 תשלום במזומן`;
      const ownerWhatsappUrl = `https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${encodeURIComponent(ownerMessage)}`;

      // שליחת מייל ללקוח
      const { error: emailError } = await supabase.functions.invoke("send-order-confirmation", {
        body: {
          customerName: customerFullName,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          orderDetails,
          totalPrice,
        },
      });

      if (emailError) {
        console.error("Error sending email:", emailError);
      }

      // שליחת וואטסאפ ללקוח
      const customerMessage = `🍪 מזון האושר - אישור הזמנה\n\nשלום ${formData.firstName}!\n\nקיבלנו את הזמנתך:\n${orderDetails}\n\nסה״כ: ₪${totalPrice}\n\nניצור איתך קשר בקרוב לתיאום משלוח.\nתודה רבה! 🍪`;
      const customerWhatsappUrl = `https://wa.me/972${formData.phone.replace(/^0/, "")}?text=${encodeURIComponent(customerMessage)}`;

      // פתיחת וואטסאפ לבעלת העסק
      window.open(ownerWhatsappUrl, "_blank");

      // פתיחת וואטסאפ ללקוח אחרי שניה
      setTimeout(() => {
        window.open(customerWhatsappUrl, "_blank");
      }, 1000);

      toast.success("ההזמנה נשלחה בהצלחה! נשלח מייל ווואטסאפ");
      clearCart();
      onClose();
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("שגיאה בשליחת ההזמנה, נסו שוב");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowRight className="w-4 h-4" />
        חזרה לעגלה
      </button>

      <div className="space-y-4">
        <h3 className="text-xl font-display font-bold text-foreground">פרטי הזמנה</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">שם פרטי</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="ישראל"
              className="text-right"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">שם משפחה</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="ישראלי"
              className="text-right"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">מייל</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="example@email.com"
            className="text-left"
            dir="ltr"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">טלפון</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="0501234567"
            className="text-left"
            dir="ltr"
          />
        </div>
      </div>

      <div className="bg-secondary/50 rounded-xl p-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-semibold">סה״כ לתשלום:</span>
          <span className="font-bold text-primary text-2xl">₪{totalPrice}</span>
        </div>
        <p className="text-sm text-muted-foreground">💵 תשלום במזומן בעת המשלוח</p>
      </div>

      <Button
        onClick={handleSubmitOrder}
        disabled={isLoading}
        className="w-full h-14 text-lg gap-2 bg-green-500 hover:bg-green-600"
      >
        {isLoading ? (
          "שולח..."
        ) : (
          <>
            <MessageCircle className="w-5 h-5" />
            להזמין במזומן
          </>
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        <Mail className="w-3 h-3 inline ml-1" />
        נשלח אישור למייל ולוואטסאפ
      </p>
    </div>
  );
};

export default CheckoutForm;
