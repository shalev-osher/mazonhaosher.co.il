import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Minus, Plus, Trash2, ShoppingBag, User, LogIn, Mail, Package, Truck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { useProfile } from "@/contexts/ProfileContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { 
  nameSchema, 
  emailSchema, 
  phoneSchema, 
  addressSchema, 
  citySchema, 
  notesSchema,
  getValidationError 
} from "@/lib/validation";

const BUNDLE_PRICE = 80;
const BUNDLE_SIZE = 4;
const REGULAR_PRICE = 25;
const DELIVERY_FEE = 30;

const Cart = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, clearCart, getTotalItems, orderNumber } = useCart();
  const { profile, setProfile, isLoggedIn, user } = useProfile();
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">("pickup");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
  });

  // Calculate price with bundle discount
  const calculateTotalPrice = () => {
    const totalItems = getTotalItems();
    const bundles = Math.floor(totalItems / BUNDLE_SIZE);
    const remaining = totalItems % BUNDLE_SIZE;
    const itemsTotal = bundles * BUNDLE_PRICE + remaining * REGULAR_PRICE;
    const deliveryTotal = deliveryMethod === "delivery" ? DELIVERY_FEE : 0;
    return itemsTotal + deliveryTotal;
  };

  const getItemsPrice = () => {
    const totalItems = getTotalItems();
    const bundles = Math.floor(totalItems / BUNDLE_SIZE);
    const remaining = totalItems % BUNDLE_SIZE;
    return bundles * BUNDLE_PRICE + remaining * REGULAR_PRICE;
  };

  const getOriginalPrice = () => {
    return getTotalItems() * REGULAR_PRICE;
  };

  const getSavings = () => {
    return getOriginalPrice() - getItemsPrice();
  };

  const totalPrice = calculateTotalPrice();

  // Pre-fill form with profile data
  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        fullName: profile.full_name || "",
        email: user?.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
        city: profile.city || "",
        notes: profile.notes || "",
      }));
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
    try {
      nameSchema.parse(formData.fullName.trim());
    } catch (error) {
      const message = getValidationError(error);
      toast.error(message || t('checkoutForm.orderError'));
      return false;
    }

    try {
      emailSchema.parse(formData.email.trim());
    } catch (error) {
      const message = getValidationError(error);
      toast.error(message || t('checkoutForm.orderError'));
      return false;
    }

    try {
      phoneSchema.parse(formData.phone.trim());
    } catch (error) {
      const message = getValidationError(error);
      toast.error(message || t('checkoutForm.orderError'));
      return false;
    }

    // Only validate address fields if delivery is selected
    if (deliveryMethod === "delivery") {
      try {
        addressSchema.parse(formData.address.trim());
      } catch (error) {
        const message = getValidationError(error);
        toast.error(message || t('checkoutForm.orderError'));
        return false;
      }

      try {
        citySchema.parse(formData.city.trim());
      } catch (error) {
        const message = getValidationError(error);
        toast.error(message || t('checkoutForm.orderError'));
        return false;
      }
    }

    if (formData.notes) {
      try {
        notesSchema.parse(formData.notes);
      } catch (error) {
        const message = getValidationError(error);
        toast.error(message || t('checkoutForm.orderError'));
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
          if (data.error.includes("יותר מדי")) {
            toast.error(t('checkoutForm.tooManyOrders'));
            setIsLoading(false);
            return;
          }
          throw new Error(data.error);
        }

        profileId = data?.profileId;
      }

      // Send email confirmation (to customer and owner)
      const { error: emailError } = await supabase.functions.invoke("send-order-confirmation", {
        body: {
          customerName: formData.fullName.trim(),
          customerEmail: formData.email.trim(),
          customerPhone: formData.phone.trim(),
          orderDetails,
          totalPrice,
          isDarkMode,
        },
      });

      if (emailError) {
        console.error("Error sending email");
      }

      // Clear cart and navigate to thank you page
      clearCart();
      navigate("/thank-you", { 
        state: { 
          orderNumber: orderNumber,
          customerName: formData.fullName.trim(),
          totalPrice,
        } 
      });
    } catch (error) {
      console.error("Error submitting order");
      toast.error(t('checkoutForm.orderError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <Header />
      
      <main className="pt-20 pb-32 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowRight className={`w-4 h-4 ${!isRTL ? 'rotate-180' : ''}`} />
            {t('checkoutForm.back')}
          </button>

          {/* Page title */}
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-foreground">
              {t('cartModal.title')}
            </h1>
          </div>

          {items.length === 0 ? (
            // Empty cart
            <div className="text-center py-16 bg-background rounded-2xl">
              <ShoppingBag className="w-20 h-20 mx-auto text-muted-foreground/50 mb-6" />
              <p className="text-muted-foreground text-xl mb-6">{t('cartModal.empty')}</p>
              <Button onClick={() => navigate("/")} variant="outline">
                {isRTL ? "חזרה לחנות" : "Back to Shop"}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col md:grid md:grid-cols-2 gap-8 items-start">
              {/* Cart items - First on both mobile and desktop */}
              <div className="space-y-4 md:order-1">
                <h2 className="text-xl font-semibold mb-4">{isRTL ? "פריטים בעגלה" : "Cart Items"}</h2>
                {items.map((item) => (
                  <div 
                    key={item.name}
                    className="flex items-center gap-4 bg-secondary/50 rounded-xl p-4"
                  >
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                      <p className="text-primary font-medium">₪{REGULAR_PRICE}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.name, item.quantity - 1)}
                        className="p-2 hover:bg-secondary rounded-full transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => {
                                if (item.quantity < 6) {
                                  updateQuantity(item.name, item.quantity + 1);
                                }
                              }}
                              className={cn(
                                "p-2 rounded-full transition-colors",
                                item.quantity >= 6
                                  ? "opacity-50 cursor-not-allowed text-muted-foreground"
                                  : "hover:bg-secondary"
                              )}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </TooltipTrigger>
                          {item.quantity >= 6 && (
                            <TooltipContent side="top" className="bg-background/90 border border-primary/50 text-foreground">
                              <p>{t('cartModal.maxItems')}</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                      <button
                        onClick={() => removeFromCart(item.name)}
                        className="p-2 hover:bg-destructive/20 text-destructive rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Delivery item - shown when delivery is selected */}
                {deliveryMethod === "delivery" && (
                  <div className="flex items-center gap-4 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <div className="w-20 h-20 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Truck className="w-10 h-10 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{isRTL ? "משלוח" : "Delivery"}</h3>
                      <p className="text-blue-500 font-medium">₪{DELIVERY_FEE}</p>
                    </div>
                  </div>
                )}
                <div className="bg-primary/10 rounded-xl p-4 mt-6">
                  <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
                    <span>{getTotalItems()} {t('cartModal.cookies')}</span>
                    {getSavings() > 0 && (
                      <span className="line-through">₪{getOriginalPrice()}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
                    <span>{isRTL ? "סכום עוגיות" : "Items subtotal"}</span>
                    <span>₪{getItemsPrice()}</span>
                  </div>
                  {deliveryMethod === "delivery" && (
                    <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
                      <span>{isRTL ? "משלוח" : "Delivery"}</span>
                      <span>₪{DELIVERY_FEE}</span>
                    </div>
                  )}
                  {getSavings() > 0 && (
                    <div className="flex justify-between items-center text-sm text-emerald-600 mb-2">
                      <span>{t('cartModal.saved')}</span>
                      <span>-₪{getSavings()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center border-t border-primary/20 pt-2 mt-2">
                    <span className="font-semibold text-lg">{t('cartModal.total')}</span>
                    <span className="font-bold text-primary text-2xl">₪{totalPrice}</span>
                  </div>
                </div>

                {/* Checkout section - Mobile only (after price summary) */}
                <div className="md:hidden bg-secondary/30 rounded-2xl p-4">
                  {!showCheckoutForm ? (
                    <div className="flex flex-col items-center justify-center py-6 space-y-3">
                      <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                        <ShoppingBag className="w-7 h-7 text-primary" />
                      </div>
                      <div className="text-center space-y-1">
                        <h3 className="text-lg font-display font-bold text-foreground">
                          {isRTL ? "מוכנים להזמין?" : "Ready to order?"}
                        </h3>
                        <p className="text-muted-foreground text-xs">
                          {isRTL ? "לחצו להמשך ומילוי פרטי המשלוח" : "Click to continue and fill in delivery details"}
                        </p>
                      </div>
                      <Button 
                        onClick={() => setShowCheckoutForm(true)} 
                        size="lg" 
                        className="gap-2 w-full"
                      >
                        <ArrowRight className={`w-5 h-5 ${!isRTL ? 'rotate-180' : ''}`} />
                        {isRTL ? "המשך להזמנה" : "Continue to Checkout"}
                      </Button>
                    </div>
                  ) : !isLoggedIn ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                        <LogIn className="w-8 h-8 text-primary" />
                      </div>
                      <div className="text-center space-y-1">
                        <h3 className="text-lg font-display font-bold text-foreground">{t('checkoutForm.loginRequired')}</h3>
                        <p className="text-muted-foreground text-xs max-w-xs">
                          {t('checkoutForm.loginRequiredDesc')}
                        </p>
                      </div>
                      <Button 
                        onClick={() => setShowAuthModal(true)} 
                        size="lg" 
                        className="gap-2"
                      >
                        <LogIn className="w-5 h-5" />
                        {t('checkoutForm.loginSignup')}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2 text-right">
                      <div className="flex items-center gap-2 p-1.5 bg-primary/10 border border-primary/30 rounded-lg text-[11px]">
                        <User className="w-3 h-3 text-primary" />
                        <span className="text-foreground">
                          {t('checkoutForm.connectedAs')} <strong>{profile?.full_name || user?.email}</strong>
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <Input name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder={t('checkoutForm.fullName')} className="text-right h-8 text-xs" maxLength={100} />
                        <Input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder={t('checkoutForm.email')} className="text-right h-8 text-xs" dir="ltr" maxLength={255} />
                        <Input name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder={t('checkoutForm.phone')} className="text-right h-8 text-xs col-span-2" dir="ltr" maxLength={10} />
                      </div>
                      {/* Delivery method toggle */}
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => setDeliveryMethod("pickup")}
                          className={`flex-1 flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-medium transition-all ${
                            deliveryMethod === "pickup"
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                          }`}
                        >
                          <Package className="w-3.5 h-3.5" />
                          {isRTL ? "איסוף עצמי" : "Pickup"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeliveryMethod("delivery")}
                          className={`flex-1 flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-medium transition-all ${
                            deliveryMethod === "delivery"
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                          }`}
                        >
                          <Truck className="w-3.5 h-3.5" />
                          {isRTL ? "משלוח" : "Delivery"}
                        </button>
                      </div>
                      {/* Address fields and notes - only show for delivery */}
                      {deliveryMethod === "delivery" && (
                        <>
                          <div className="grid grid-cols-2 gap-1.5">
                            <Input name="city" value={formData.city} onChange={handleInputChange} placeholder={t('checkoutForm.city')} className="text-right h-8 text-xs" maxLength={50} />
                            <Input name="address" value={formData.address} onChange={handleInputChange} placeholder={t('checkoutForm.address')} className="text-right h-8 text-xs" maxLength={200} />
                          </div>
                          <Textarea name="notes" value={formData.notes} onChange={handleInputChange} placeholder={t('checkoutForm.notes')} className="text-right resize-none text-xs min-h-[50px]" rows={1} maxLength={500} />
                        </>
                      )}
                      {/* Credit Card fields */}
                      <div className="border border-primary/30 rounded-lg p-2 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-medium text-primary mb-1">
                          <div className="flex items-center gap-1.5">
                            <CreditCard className="w-3.5 h-3.5" />
                            {isRTL ? "פרטי תשלום" : "Payment Details"}
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                            </svg>
                            <span className="text-[10px] text-emerald-600 font-medium">SSL</span>
                          </div>
                        </div>
                        <Input 
                          name="cardNumber" 
                          value={formData.cardNumber} 
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                            const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
                            setFormData(prev => ({ ...prev, cardNumber: formatted }));
                          }}
                          placeholder={isRTL ? "מספר כרטיס" : "Card Number"}
                          className="h-8 text-xs" 
                          dir="ltr"
                          maxLength={19}
                        />
                        <div className="grid grid-cols-2 gap-1.5">
                          <Input 
                            name="cardExpiry" 
                            value={formData.cardExpiry} 
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, '').slice(0, 4);
                              if (value.length >= 2) {
                                value = value.slice(0, 2) + '/' + value.slice(2);
                              }
                              setFormData(prev => ({ ...prev, cardExpiry: value }));
                            }}
                            placeholder="MM/YY"
                            className="h-8 text-xs" 
                            dir="ltr"
                            maxLength={5}
                          />
                          <Input 
                            name="cardCvv" 
                            value={formData.cardCvv} 
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                              setFormData(prev => ({ ...prev, cardCvv: value }));
                            }}
                            placeholder="CVV"
                            className="h-8 text-xs" 
                            dir="ltr"
                            maxLength={4}
                            type="password"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-secondary/50 rounded-lg p-2">
                        <span className="font-semibold text-xs">{t('checkoutForm.totalPayment')}</span>
                        <span className="font-bold text-primary text-lg">₪{totalPrice}</span>
                      </div>
                      <Button onClick={handleSubmitOrder} disabled={isLoading} className="w-full h-9 text-xs gap-1.5">
                        {isLoading ? t('checkoutForm.sending') : (<>{isRTL ? "שלח הזמנה" : "Submit Order"}<Mail className="w-3.5 h-3.5" /></>)}
                      </Button>
                      {/* Security Trust Badges */}
                      <div className="flex items-center justify-center gap-3 pt-2 border-t border-primary/10">
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <svg className="w-3 h-3 text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                          </svg>
                          <span>{isRTL ? "מאובטח" : "Secure"}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <svg className="w-3 h-3 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                          </svg>
                          <span>{isRTL ? "מוגן" : "Protected"}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <svg className="w-3 h-3 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                          </svg>
                          <span>{isRTL ? "אמין" : "Trusted"}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Checkout section - Desktop only (side by side) */}
              <div className="hidden md:block bg-secondary/30 rounded-2xl p-4 md:order-2">
                {!showCheckoutForm ? (
                  <div className="flex flex-col items-center justify-center py-6 space-y-3">
                    <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                      <ShoppingBag className="w-7 h-7 text-primary" />
                    </div>
                    <div className="text-center space-y-1">
                      <h3 className="text-lg font-display font-bold text-foreground">
                        {isRTL ? "מוכנים להזמין?" : "Ready to order?"}
                      </h3>
                      <p className="text-muted-foreground text-xs">
                        {isRTL ? "לחצו להמשך ומילוי פרטי המשלוח" : "Click to continue and fill in delivery details"}
                      </p>
                    </div>
                    <Button 
                      onClick={() => setShowCheckoutForm(true)} 
                      size="lg" 
                      className="gap-2 w-full"
                    >
                      <ArrowRight className={`w-5 h-5 ${!isRTL ? 'rotate-180' : ''}`} />
                      {isRTL ? "המשך להזמנה" : "Continue to Checkout"}
                    </Button>
                  </div>
                ) : !isLoggedIn ? (
                  <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <LogIn className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-center space-y-1">
                      <h3 className="text-lg font-display font-bold text-foreground">{t('checkoutForm.loginRequired')}</h3>
                      <p className="text-muted-foreground text-xs max-w-xs">
                        {t('checkoutForm.loginRequiredDesc')}
                      </p>
                    </div>
                    <Button 
                      onClick={() => setShowAuthModal(true)} 
                      size="lg" 
                      className="gap-2"
                    >
                      <LogIn className="w-5 h-5" />
                      {t('checkoutForm.loginSignup')}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2 text-right">
                    <div className="flex items-center gap-2 p-1.5 bg-primary/10 border border-primary/30 rounded-lg text-[11px]">
                      <User className="w-3 h-3 text-primary" />
                      <span className="text-foreground">
                        {t('checkoutForm.connectedAs')} <strong>{profile?.full_name || user?.email}</strong>
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <Input name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder={t('checkoutForm.fullName')} className="text-right h-8 text-xs" maxLength={100} />
                      <Input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder={t('checkoutForm.email')} className="text-right h-8 text-xs" dir="ltr" maxLength={255} />
                      <Input name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder={t('checkoutForm.phone')} className="text-right h-8 text-xs col-span-2" dir="ltr" maxLength={10} />
                    </div>
                    {/* Delivery method toggle */}
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod("pickup")}
                        className={`flex-1 flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-medium transition-all ${
                          deliveryMethod === "pickup"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                        }`}
                      >
                        <Package className="w-3.5 h-3.5" />
                        {isRTL ? "איסוף עצמי" : "Pickup"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod("delivery")}
                        className={`flex-1 flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-medium transition-all ${
                          deliveryMethod === "delivery"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                        }`}
                      >
                        <Truck className="w-3.5 h-3.5" />
                        {isRTL ? "משלוח" : "Delivery"}
                      </button>
                    </div>
                    {/* Address fields and notes - only show for delivery */}
                    {deliveryMethod === "delivery" && (
                      <>
                        <div className="grid grid-cols-2 gap-1.5">
                          <Input name="city" value={formData.city} onChange={handleInputChange} placeholder={t('checkoutForm.city')} className="text-right h-8 text-xs" maxLength={50} />
                          <Input name="address" value={formData.address} onChange={handleInputChange} placeholder={t('checkoutForm.address')} className="text-right h-8 text-xs" maxLength={200} />
                        </div>
                        <Textarea name="notes" value={formData.notes} onChange={handleInputChange} placeholder={t('checkoutForm.notes')} className="text-right resize-none text-xs min-h-[50px]" rows={1} maxLength={500} />
                      </>
                    )}
                    {/* Credit Card fields */}
                    <div className="border border-primary/30 rounded-lg p-2 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-medium text-primary mb-1">
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5" />
                          {isRTL ? "פרטי תשלום" : "Payment Details"}
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                          </svg>
                          <span className="text-[10px] text-emerald-600 font-medium">SSL</span>
                        </div>
                      </div>
                      <Input 
                        name="cardNumber" 
                        value={formData.cardNumber} 
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                          const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
                          setFormData(prev => ({ ...prev, cardNumber: formatted }));
                        }}
                        placeholder={isRTL ? "מספר כרטיס" : "Card Number"}
                        className="h-8 text-xs" 
                        dir="ltr"
                        maxLength={19}
                      />
                      <div className="grid grid-cols-2 gap-1.5">
                        <Input 
                          name="cardExpiry" 
                          value={formData.cardExpiry} 
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '').slice(0, 4);
                            if (value.length >= 2) {
                              value = value.slice(0, 2) + '/' + value.slice(2);
                            }
                            setFormData(prev => ({ ...prev, cardExpiry: value }));
                          }}
                          placeholder="MM/YY"
                          className="h-8 text-xs" 
                          dir="ltr"
                          maxLength={5}
                        />
                        <Input 
                          name="cardCvv" 
                          value={formData.cardCvv} 
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                            setFormData(prev => ({ ...prev, cardCvv: value }));
                          }}
                          placeholder="CVV"
                          className="h-8 text-xs" 
                          dir="ltr"
                          maxLength={4}
                          type="password"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-secondary/50 rounded-lg p-2">
                      <span className="font-semibold text-xs">{t('checkoutForm.totalPayment')}</span>
                      <span className="font-bold text-primary text-lg">₪{totalPrice}</span>
                    </div>
                    <Button onClick={handleSubmitOrder} disabled={isLoading} className="w-full h-9 text-xs gap-1.5">
                      {isLoading ? t('checkoutForm.sending') : (<>{isRTL ? "שלח הזמנה" : "Submit Order"}<Mail className="w-3.5 h-3.5" /></>)}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default Cart;
