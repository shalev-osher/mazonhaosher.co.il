import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, ArrowRight, User } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { useProfile } from "@/contexts/ProfileContext";
import { supabase } from "@/integrations/supabase/client";

interface CheckoutFormProps {
  onBack: () => void;
  onClose: () => void;
  totalPrice: number;
}

const OWNER_WHATSAPP_NUMBER = "972546791198";

const WhatsAppIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`fill-current ${className}`}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const CheckoutForm = ({ onBack, onClose, totalPrice }: CheckoutFormProps) => {
  const { items, clearCart } = useCart();
  const { profile, setProfile } = useProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });

  // Pre-fill form with profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.full_name || "",
        email: "",
        phone: profile.phone || "",
        address: profile.address || "",
        city: profile.city || "",
        notes: profile.notes || "",
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error("נא להזין שם מלא");
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
    if (!formData.address.trim()) {
      toast.error("נא להזין כתובת למשלוח");
      return false;
    }
    if (!formData.city.trim()) {
      toast.error("נא להזין עיר");
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

    try {
      // Find or create profile by phone
      let profileId = profile?.id;
      
      if (!profileId) {
        // Check if profile exists
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("phone", formData.phone)
          .maybeSingle();

        if (existingProfile) {
          profileId = existingProfile.id;
          setProfile(existingProfile);
        } else {
          // Create new profile
          const { data: newProfile, error: profileError } = await supabase
            .from("profiles")
            .insert({
              phone: formData.phone,
              full_name: formData.fullName,
              address: formData.address,
              city: formData.city,
              notes: formData.notes,
            })
            .select()
            .single();

          if (profileError) {
            console.error("Error creating profile:", profileError);
          } else if (newProfile) {
            profileId = newProfile.id;
            setProfile(newProfile);
          }
        }
      } else {
        // Update existing profile
        const { data: updatedProfile } = await supabase
          .from("profiles")
          .update({
            full_name: formData.fullName,
            address: formData.address,
            city: formData.city,
            notes: formData.notes,
          })
          .eq("id", profileId)
          .select()
          .single();

        if (updatedProfile) {
          setProfile(updatedProfile);
        }
      }

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          profile_id: profileId,
          phone: formData.phone,
          full_name: formData.fullName,
          address: formData.address,
          city: formData.city,
          notes: formData.notes,
          total_amount: totalPrice,
        })
        .select()
        .single();

      if (orderError) {
        console.error("Error creating order:", orderError);
        throw orderError;
      }

      // Create order items
      if (order) {
        const orderItems = items.map((item) => ({
          order_id: order.id,
          cookie_name: item.name,
          quantity: item.quantity,
          price: parseInt(item.price.replace(/[^\d]/g, "")),
        }));

        await supabase.from("order_items").insert(orderItems);
      }

      // שליחת הודעה לוואטסאפ של בעלת העסק
      const ownerMessage = `🍪 הזמנה חדשה!\n\n👤 פרטי לקוח:\nשם: ${formData.fullName}\nטלפון: ${formData.phone}\nמייל: ${formData.email}\nכתובת: ${formData.address}, ${formData.city}\n${formData.notes ? `הערות: ${formData.notes}\n` : ""}\n📦 ההזמנה:\n${orderDetails}\n\n💰 סה״כ: ₪${totalPrice}\n\n💵 תשלום במזומן`;
      const ownerWhatsappUrl = `https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${encodeURIComponent(ownerMessage)}`;

      // שליחת מייל ללקוח
      const { error: emailError } = await supabase.functions.invoke("send-order-confirmation", {
        body: {
          customerName: formData.fullName,
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
      const customerMessage = `🍪 מזון האושר - אישור הזמנה\n\nשלום ${formData.fullName}!\n\nקיבלנו את הזמנתך:\n${orderDetails}\n\nסה״כ: ₪${totalPrice}\n\nניצור איתך קשר בקרוב לתיאום משלוח.\nתודה רבה! 🍪`;
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
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(85vh-80px)]">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowRight className="w-4 h-4" />
        חזרה לעגלה
      </button>

      {profile && (
        <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/30 rounded-xl">
          <User className="w-5 h-5 text-primary" />
          <span className="text-sm text-foreground">
            מחובר כ: <strong>{profile.full_name || profile.phone}</strong>
          </span>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-xl font-display font-bold text-foreground">פרטי הזמנה</h3>
        
        <div className="space-y-2">
          <Label htmlFor="fullName">שם מלא</Label>
          <Input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="ישראל ישראלי"
            className="text-right"
          />
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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">עיר</Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="תל אביב"
              className="text-right"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">כתובת</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="רחוב הרצל 1"
              className="text-right"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">הערות למשלוח (אופציונלי)</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="קומה, דירה, הוראות מיוחדות..."
            className="text-right resize-none"
            rows={2}
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
