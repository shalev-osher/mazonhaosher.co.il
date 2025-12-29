import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowRight } from "lucide-react";
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

const WhatsAppIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`fill-current ${className}`}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

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
            <WhatsAppIcon className="w-5 h-5" />
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
