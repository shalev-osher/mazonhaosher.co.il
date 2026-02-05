import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Minus, Plus, Trash2, ShoppingBag, User, LogIn, Mail } from "lucide-react";
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
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });

  // Calculate price with bundle discount
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

  const totalPrice = calculateTotalPrice();

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
            {orderNumber && items.length > 0 && (
              <p className="text-muted-foreground mt-2">
                {t('cartModal.orderNumber')}: <span className="font-semibold text-primary">{orderNumber}</span>
              </p>
            )}
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
            <div className="grid md:grid-cols-2 gap-8 md:items-start">
              {/* Cart items */}
              <div className="space-y-4">
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

                {/* Price summary */}
                <div className="bg-primary/10 rounded-xl p-4 mt-6">
                  <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
                    <span>{getTotalItems()} {t('cartModal.cookies')}</span>
                    {getSavings() > 0 && (
                      <span className="line-through">₪{getOriginalPrice()}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">{t('cartModal.total')}</span>
                    <div className="flex items-center gap-2">
                      {getSavings() > 0 && (
                        <span className="text-sm text-green-600 font-medium">
                          {t('cartModal.saved')} ₪{getSavings()}!
                        </span>
                      )}
                      <span className="font-bold text-primary text-2xl">₪{totalPrice}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout section - Mobile only (after price summary) */}
                <div className="md:hidden">
                  <CheckoutSection />
                </div>
              </div>

              {/* Checkout section - Desktop only (side by side) */}
              <div className="hidden md:block bg-secondary/30 rounded-2xl p-4">
                {!showCheckoutForm ? (
                  // Continue to checkout button
                  <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="text-xl font-display font-bold text-foreground">
                        {isRTL ? "מוכנים להזמין?" : "Ready to order?"}
                      </h3>
                      <p className="text-muted-foreground text-sm">
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
                  // Login required
                  <div className="flex flex-col items-center justify-center py-12 space-y-6">
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                      <LogIn className="w-10 h-10 text-primary" />
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="text-xl font-display font-bold text-foreground">{t('checkoutForm.loginRequired')}</h3>
                      <p className="text-muted-foreground text-sm max-w-xs">
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
              <div className="space-y-3">
                    <div className="flex items-center gap-2 p-2 bg-primary/10 border border-primary/30 rounded-lg">
                      <User className="w-4 h-4 text-primary" />
                      <span className="text-xs text-foreground">
                        {t('checkoutForm.connectedAs')} <strong>{profile?.full_name || user?.email}</strong>
                      </span>
                    </div>

                    <h3 className="text-base font-display font-bold text-foreground">{t('checkoutForm.orderDetails')}</h3>
                    
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <Label htmlFor="fullName" className="text-xs">{t('checkoutForm.fullName')}</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder={t('checkoutForm.namePlaceholder')}
                          className={`${isRTL ? "text-right" : "text-left"} h-9 text-sm`}
                          maxLength={100}
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="email" className="text-xs">{t('checkoutForm.email')}</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="example@email.com"
                          className="text-left h-9 text-sm"
                          dir="ltr"
                          maxLength={255}
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="phone" className="text-xs">{t('checkoutForm.phone')}</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="0501234567"
                          className="text-left h-9 text-sm"
                          dir="ltr"
                          maxLength={10}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label htmlFor="city" className="text-xs">{t('checkoutForm.city')}</Label>
                          <Input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder={t('checkoutForm.cityPlaceholder')}
                            className={`${isRTL ? "text-right" : "text-left"} h-9 text-sm`}
                            maxLength={50}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="address" className="text-xs">{t('checkoutForm.address')}</Label>
                          <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder={t('checkoutForm.addressPlaceholder')}
                            className={`${isRTL ? "text-right" : "text-left"} h-9 text-sm`}
                            maxLength={200}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="notes" className="text-xs">{t('checkoutForm.notes')}</Label>
                        <Textarea
                          id="notes"
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          placeholder={t('checkoutForm.notesPlaceholder')}
                          className={`${isRTL ? "text-right" : "text-left"} resize-none text-sm`}
                          rows={2}
                          maxLength={500}
                        />
                      </div>
                    </div>

                    <div className="bg-secondary/50 rounded-lg p-3 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-sm">{t('checkoutForm.totalPayment')}</span>
                        <span className="font-bold text-primary text-xl">₪{totalPrice}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{t('checkoutForm.cashPayment')}</p>
                    </div>

                    <Button
                      onClick={handleSubmitOrder}
                      disabled={isLoading}
                      className="w-full h-11 text-sm gap-2"
                    >
                      {isLoading ? (
                        t('checkoutForm.sending')
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          {isRTL ? "שלח הזמנה" : "Submit Order"}
                        </>
                      )}
                    </Button>
                    <p className="text-[10px] text-center text-muted-foreground">
                      <Mail className="w-3 h-3 inline ml-1" />
                      {t('checkoutForm.confirmationSent')}
                    </p>
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
