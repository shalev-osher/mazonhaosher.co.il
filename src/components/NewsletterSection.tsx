import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Mail, Phone, Check, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { emailSchema, optionalPhoneSchema, getValidationError } from "@/lib/validation";
import { z } from "zod";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const validateInputs = (): boolean => {
    // At least one field required
    if (!email.trim() && !phone.trim()) {
      toast({
        title: "שגיאה",
        description: "נא להזין מייל או טלפון",
        variant: "destructive",
      });
      return false;
    }

    // Validate email if provided
    if (email.trim()) {
      try {
        emailSchema.parse(email.trim());
      } catch (error) {
        const message = getValidationError(error);
        toast({
          title: "שגיאה",
          description: message || "כתובת מייל לא תקינה",
          variant: "destructive",
        });
        return false;
      }
    }

    // Validate phone if provided
    if (phone.trim()) {
      try {
        // Phone must match Israeli format
        const phoneRegex = /^0(5[0-9]|7[0-9])[0-9]{7}$/;
        if (!phoneRegex.test(phone.trim())) {
          throw new z.ZodError([{
            code: "custom",
            message: "מספר טלפון לא תקין (נדרש פורמט ישראלי)",
            path: ["phone"],
          }]);
        }
      } catch (error) {
        const message = getValidationError(error);
        toast({
          title: "שגיאה",
          description: message || "מספר טלפון לא תקין",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleSubscribe = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);

    try {
      // Use edge function with rate limiting
      const { data, error } = await supabase.functions.invoke("newsletter-subscribe", {
        body: {
          email: email.trim() || null,
          phone: phone.trim() || null,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        // Handle rate limiting
        if (data.error.includes("יותר מדי")) {
          toast({
            title: "יותר מדי בקשות",
            description: "נסו שוב מאוחר יותר",
            variant: "destructive",
          });
          return;
        }
        throw new Error(data.error);
      }

      setSubscribed(true);
      toast({
        title: "נרשמת בהצלחה! 🎉",
        description: "תקבל/י עדכונים על מבצעים וחדשות",
      });
    } catch (error) {
      console.error("Error subscribing");
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה, נסו שוב מאוחר יותר",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (subscribed) {
    return (
      <section className="py-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-md mx-auto text-center bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-primary/20">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-display text-xl font-bold text-primary mb-2">
              תודה שנרשמת! ✨
            </h3>
            <p className="text-muted-foreground text-sm">
              נעדכן אותך על מבצעים מיוחדים, מוצרים חדשים והפתעות מתוקות
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zMCAzMGMwLTUuNTIzIDQuNDc3LTEwIDEwLTEwczEwIDQuNDc3IDEwIDEwLTQuNDc3IDEwLTEwIDEwLTEwLTQuNDc3LTEwLTEweiIgZmlsbD0iI2U4NWQ4ZiIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-md mx-auto text-center bg-card/80 backdrop-blur-sm rounded-2xl p-4 border border-primary/20 shadow-lg">
          <div className="flex items-center justify-center gap-1 mb-2">
            <Bell className="h-5 w-5 text-primary animate-bounce" />
            <Sparkles className="h-4 w-4 text-accent" />
          </div>
          
          <h3 className="font-display text-xl font-bold text-primary mb-1">
            לא לפספס מבצעים!
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            הירשמו לניוזלטר וקבלו עדכונים על מבצעים מיוחדים
          </p>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <Input
                type="email"
                placeholder="כתובת המייל שלך"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 text-center"
                dir="ltr"
                maxLength={255}
              />
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <Input
                type="tel"
                placeholder="מספר טלפון (אופציונלי)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 text-center"
                dir="ltr"
                maxLength={10}
              />
            </div>

            <Button
              onClick={handleSubscribe}
              disabled={isLoading}
              size="lg"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
            >
              {isLoading ? "שולח..." : "להירשם לעדכונים ✨"}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            אנחנו מבטיחים לא לשלוח ספאם. רק טוב טעים. ✨
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
