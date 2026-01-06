import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, ArrowRight, User, LogIn } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { useProfile } from "@/contexts/ProfileContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  nameSchema, 
  emailSchema, 
  phoneSchema, 
  addressSchema, 
  citySchema, 
  notesSchema,
  getValidationError 
} from "@/lib/validation";

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
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const { profile, setProfile, isLoggedIn, user } = useProfile();
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
        email: user?.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
        city: profile.city || "",
        notes: profile.notes || "",
      });
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || "",
        fullName: user.user_metadata?.full_name || "",
        phone: user.user_metadata?.phone || "",
      }));
    }
  }, [profile, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    // Validate name
    try {
      nameSchema.parse(formData.fullName.trim());
    } catch (error) {
      const message = getValidationError(error);
      toast.error(message || "נא להזין שם מלא תקין");
      return false;
    }

    // Validate email
    try {
      emailSchema.parse(formData.email.trim());
    } catch (error) {
      const message = getValidationError(error);
      toast.error(message || "נא להזין כתובת מייל תקינה");
      return false;
    }

    // Validate phone
    try {
      phoneSchema.parse(formData.phone.trim());
    } catch (error) {
      const message = getValidationError(error);
      toast.error(message || "נא להזין מספר טלפון תקין");
      return false;
    }

    // Validate address
    try {
      addressSchema.parse(formData.address.trim());
    } catch (error) {
      const message = getValidationError(error);
      toast.error(message || "נא להזין כתובת תקינה");
      return false;
    }

    // Validate city
    try {
      citySchema.parse(formData.city.trim());
    } catch (error) {
      const message = getValidationError(error);
      toast.error(message || "נא להזין עיר");
      return false;
    }

    // Validate notes (optional)
    if (formData.notes) {
      try {
        notesSchema.parse(formData.notes);
      } catch (error) {
        const message = getValidationError(error);
        toast.error(message || "ההערות ארוכות מדי");
        return false;
      }
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
      let profileId = profile?.id;

      // If logged in, use RPC for profile management
      if (isLoggedIn && !profileId) {
        const { data: profileData, error: profileError } = await supabase.rpc("upsert_my_profile", {
          p_phone: formData.phone.trim(),
          p_full_name: formData.fullName.trim(),
          p_address: formData.address.trim(),
          p_city: formData.city.trim(),
          p_notes: formData.notes.trim() || null,
        });

        if (profileError) {
          console.error("Error creating profile");
        } else if (profileData && profileData.length > 0) {
          profileId = profileData[0].id;
          setProfile(profileData[0]);
        }
      } else if (isLoggedIn && profileId) {
        // Update existing profile via RPC
        const { data: updatedProfile } = await supabase.rpc("upsert_my_profile", {
          p_phone: formData.phone.trim(),
          p_full_name: formData.fullName.trim(),
          p_address: formData.address.trim(),
          p_city: formData.city.trim(),
          p_notes: formData.notes.trim() || null,
        });

        if (updatedProfile && updatedProfile.length > 0) {
          setProfile(updatedProfile[0]);
        }

        // For logged in users, create order directly
        const { data: order, error: orderError } = await supabase
          .from("orders")
          .insert({
            profile_id: profileId,
            phone: formData.phone.trim(),
            full_name: formData.fullName.trim(),
            address: formData.address.trim(),
            city: formData.city.trim(),
            notes: formData.notes.trim() || null,
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
      } else {
        // Guest checkout - use edge function with rate limiting
        const { data, error: checkoutError } = await supabase.functions.invoke("guest-checkout", {
          body: {
            fullName: formData.fullName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            address: formData.address.trim(),
            city: formData.city.trim(),
            notes: formData.notes.trim() || null,
            items: items.map((item) => ({
              name: item.name,
              quantity: item.quantity,
              price: parseInt(item.price.replace(/[^\d]/g, "")),
            })),
            totalPrice,
          },
        });

        if (checkoutError) {
          throw checkoutError;
        }

        if (data?.error) {
          // Handle rate limiting
          if (data.error.includes("יותר מדי")) {
            toast.error("יותר מדי הזמנות. נסו שוב מאוחר יותר.");
            setIsLoading(false);
            return;
          }
          throw new Error(data.error);
        }

        profileId = data?.profileId;
      }

      // שליחת הודעה לוואטסאפ של בעלת העסק
      const ownerMessage = `🍪 הזמנה חדשה!\n\n👤 פרטי לקוח:\nשם: ${formData.fullName.trim()}\nטלפון: ${formData.phone.trim()}\nמייל: ${formData.email.trim()}\nכתובת: ${formData.address.trim()}, ${formData.city.trim()}\n${formData.notes ? `הערות: ${formData.notes.trim()}\n` : ""}\n📦 ההזמנה:\n${orderDetails}\n\n💰 סה״כ: ₪${totalPrice}\n\n💵 תשלום במזומן`;
      const ownerWhatsappUrl = `https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${encodeURIComponent(ownerMessage)}`;

      // שליחת מייל ללקוח
      const { error: emailError } = await supabase.functions.invoke("send-order-confirmation", {
        body: {
          customerName: formData.fullName.trim(),
          customerEmail: formData.email.trim(),
          customerPhone: formData.phone.trim(),
          orderDetails,
          totalPrice,
        },
      });

      if (emailError) {
        console.error("Error sending email");
      }

      // שליחת וואטסאפ ללקוח
      const customerMessage = `🍪 מזון האושר - אישור הזמנה\n\nשלום ${formData.fullName.trim()}!\n\nקיבלנו את הזמנתך:\n${orderDetails}\n\nסה״כ: ₪${totalPrice}\n\nניצור איתך קשר בקרוב לתיאום משלוח.\nתודה רבה! 🍪`;
      const customerWhatsappUrl = `https://wa.me/972${formData.phone.trim().replace(/^0/, "")}?text=${encodeURIComponent(customerMessage)}`;

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
      console.error("Error submitting order");
      toast.error("שגיאה בשליחת ההזמנה, נסו שוב");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    onClose();
    navigate("/auth");
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

      {isLoggedIn && profile ? (
        <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/30 rounded-xl">
          <User className="w-5 h-5 text-primary" />
          <span className="text-sm text-foreground">
            מחובר כ: <strong>{profile.full_name || user?.email}</strong>
          </span>
        </div>
      ) : !isLoggedIn ? (
        <div className="flex items-center justify-between gap-2 p-3 bg-secondary/50 border border-border rounded-xl">
          <span className="text-sm text-muted-foreground">
            התחבר כדי לשמור את פרטיך להזמנות הבאות
          </span>
          <Button size="sm" variant="outline" onClick={handleLoginRedirect}>
            <LogIn className="w-4 h-4 ml-1" />
            התחברות
          </Button>
        </div>
      ) : null}

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
            maxLength={100}
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
            maxLength={255}
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
            maxLength={10}
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
              maxLength={50}
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
              maxLength={200}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">הערות למשלוח (אופציונלי, עד 500 תווים)</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="קומה, דירה, הוראות מיוחדות..."
            className="text-right resize-none"
            rows={2}
            maxLength={500}
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
