import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Home, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ThankYou = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isRTL } = useLanguage();
  
  const { orderNumber, customerName, totalPrice } = location.state || {};

  // Redirect to home if accessed directly without order data
  useEffect(() => {
    if (!orderNumber && !customerName) {
      navigate("/");
    }
  }, [orderNumber, customerName, navigate]);

  if (!orderNumber && !customerName) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <Header />
      
      <main className="pt-20 pb-32 px-4 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="max-w-lg w-full text-center">
          {/* Success animation */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6 animate-scale-in">
              <CheckCircle className="w-14 h-14 text-green-500" />
            </div>
            
            <h1 className="text-3xl font-display font-bold text-foreground mb-3">
              {isRTL ? "תודה על ההזמנה!" : "Thank You for Your Order!"}
            </h1>
            
            <p className="text-muted-foreground text-lg">
              {isRTL 
                ? `שלום ${customerName}, קיבלנו את הזמנתך בהצלחה`
                : `Hi ${customerName}, we received your order successfully`
              }
            </p>
          </div>

          {/* Order details card */}
          <div className="bg-secondary/50 rounded-2xl p-6 mb-8 border border-primary/20">
            <div className="flex items-center justify-center gap-2 mb-4">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">
                {isRTL ? "פרטי ההזמנה" : "Order Details"}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-muted-foreground">
                  {isRTL ? "מספר הזמנה" : "Order Number"}
                </span>
                <span className="font-bold text-primary text-lg">{orderNumber}</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">
                  {isRTL ? "סה״כ לתשלום" : "Total"}
                </span>
                <span className="font-bold text-foreground text-xl">₪{totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Info message */}
          <div className="bg-primary/10 rounded-xl p-4 mb-8 border border-primary/30">
            <p className="text-sm text-foreground">
              {isRTL 
                ? "📧 שלחנו לך אישור הזמנה למייל. ניצור איתך קשר בקרוב לתיאום המשלוח."
                : "📧 We sent you an order confirmation email. We'll contact you soon to arrange delivery."
              }
            </p>
          </div>

          {/* Payment reminder */}
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 mb-8 border border-amber-200 dark:border-amber-700/50">
            <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
              {isRTL 
                ? "💵 תשלום במזומן בעת קבלת המשלוח"
                : "💵 Cash payment upon delivery"
              }
            </p>
          </div>

          {/* Back to home button */}
          <Button
            onClick={() => navigate("/")}
            size="lg"
            className="gap-2"
          >
            <Home className="w-5 h-5" />
            {isRTL ? "חזרה לדף הבית" : "Back to Home"}
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ThankYou;
