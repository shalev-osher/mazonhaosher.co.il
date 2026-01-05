import { useState, useEffect } from "react";
import { Phone, User, MapPin, FileText, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  phone: string;
  full_name: string | null;
  address: string | null;
  city: string | null;
  notes: string | null;
}

interface PhoneAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileLoaded: (profile: Profile) => void;
}

const PhoneAuthModal = ({ isOpen, onClose, onProfileLoaded }: PhoneAuthModalProps) => {
  const [step, setStep] = useState<"phone" | "profile">("phone");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [existingProfile, setExistingProfile] = useState<Profile | null>(null);
  
  const [formData, setFormData] = useState({
    full_name: "",
    address: "",
    city: "",
    notes: "",
  });

  useEffect(() => {
    if (!isOpen) {
      setStep("phone");
      setPhone("");
      setExistingProfile(null);
      setFormData({ full_name: "", address: "", city: "", notes: "" });
    }
  }, [isOpen]);

  const handlePhoneSubmit = async () => {
    if (!phone || phone.length < 9) {
      toast({
        title: "שגיאה",
        description: "נא להזין מספר טלפון תקין",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Use secure RPC function to get profile by phone
      const { data: profileData, error } = await supabase.rpc("get_profile_by_phone", {
        phone_number: phone,
      });

      if (error) throw error;

      if (profileData && profileData.length > 0) {
        // Profile exists - load it
        const profile = profileData[0] as Profile;
        setExistingProfile(profile);
        setFormData({
          full_name: profile.full_name || "",
          address: profile.address || "",
          city: profile.city || "",
          notes: profile.notes || "",
        });
        onProfileLoaded(profile);
        toast({
          title: "שלום שוב! 👋",
          description: `ברוך שובך ${profile.full_name || ""}! הפרטים שלך נטענו`,
        });
        onClose();
      } else {
        // New user - show profile form
        setStep("profile");
      }
    } catch (error) {
      console.error("Error checking profile:", error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה, נסו שוב",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async () => {
    if (!formData.full_name) {
      toast({
        title: "שגיאה",
        description: "נא להזין שם מלא",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("profiles")
        .insert({
          phone,
          full_name: formData.full_name,
          address: formData.address || null,
          city: formData.city || null,
          notes: formData.notes || null,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "נרשמת בהצלחה! 🎉",
        description: "הפרטים שלך נשמרו להזמנות הבאות",
      });

      onProfileLoaded(data);
      onClose();
    } catch (error) {
      console.error("Error creating profile:", error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בשמירת הפרטים",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-primary flex items-center gap-2">
            {step === "phone" ? (
              <>
                <Phone className="h-6 w-6" />
                התחברות עם טלפון
              </>
            ) : (
              <>
                <User className="h-6 w-6" />
                פרטים אישיים
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        {step === "phone" ? (
          <div className="space-y-6">
            <p className="text-muted-foreground">
              הזינו את מספר הטלפון שלכם ונזכור את הפרטים שלכם להזמנות הבאות
            </p>

            <div className="space-y-2">
              <label className="block text-sm font-medium">מספר טלפון</label>
              <div className="flex gap-2">
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0501234567"
                  className="text-left flex-1"
                  dir="ltr"
                />
              </div>
            </div>

            <Button
              onClick={handlePhoneSubmit}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  בודק...
                </>
              ) : (
                "המשך"
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              מלאו את הפרטים שלכם פעם אחת ונשמור אותם להזמנות הבאות
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  שם מלא *
                </label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="ישראל ישראלי"
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  כתובת
                </label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="רחוב, מספר בית, דירה"
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">עיר</label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="תל אביב"
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  הערות (אלרגיות, העדפות)
                </label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="למשל: ללא אגוזים, קומה 3..."
                  className="text-right min-h-[80px]"
                />
              </div>
            </div>

            <Button
              onClick={handleProfileSubmit}
              disabled={isLoading}
              className="w-full bg-accent hover:bg-accent/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  שומר...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 ml-2" />
                  לשמור ולהמשיך
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PhoneAuthModal;
