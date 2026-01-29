import { useState, useEffect } from "react";
import { User, Loader2, MapPin, Phone, FileText, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/contexts/ProfileContext";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const profileSchema = z.object({
  full_name: z.string().min(2, "שם חייב להכיל לפחות 2 תווים").max(100, "שם ארוך מדי").optional().or(z.literal("")),
  phone: z.string().min(9, "מספר טלפון לא תקין").max(15, "מספר טלפון ארוך מדי"),
  address: z.string().max(200, "כתובת ארוכה מדי").optional().or(z.literal("")),
  city: z.string().max(50, "שם עיר ארוך מדי").optional().or(z.literal("")),
  notes: z.string().max(500, "הערות ארוכות מדי").optional().or(z.literal("")),
});

const EditProfileModal = ({ isOpen, onClose }: EditProfileModalProps) => {
  const { profile, refreshProfile, user } = useProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });

  useEffect(() => {
    if (isOpen && profile) {
      setFormData({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        address: profile.address || "",
        city: profile.city || "",
        notes: profile.notes || "",
      });
      setErrors({});
    }
  }, [isOpen, profile]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async () => {
    // Validate
    const result = profileSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          newErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.rpc("upsert_my_profile", {
        p_phone: formData.phone,
        p_full_name: formData.full_name || null,
        p_address: formData.address || null,
        p_city: formData.city || null,
        p_notes: formData.notes || null,
      });

      if (error) throw error;

      await refreshProfile();
      
      toast({
        title: "הפרופיל עודכן! ✨",
        description: "הפרטים נשמרו בהצלחה",
      });
      
      onClose();
    } catch (error: any) {
      console.error("Update profile error:", error);
      toast({
        title: "שגיאה",
        description: error.message || "אירעה שגיאה בעדכון הפרופיל",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="auth-modal-luxury sm:max-w-[400px]" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <User className="w-5 h-5 text-primary" />
            עריכת פרופיל
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Email (read-only) */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">אימייל</label>
            <Input
              value={user?.email || ""}
              disabled
              className="bg-muted/50 text-muted-foreground text-right"
              dir="ltr"
            />
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">שם מלא</label>
            <div className="relative">
              <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={formData.full_name}
                onChange={(e) => handleChange("full_name", e.target.value)}
                placeholder="השם שלך"
                className={`pr-10 text-right bg-background/50 ${errors.full_name ? "border-destructive" : "border-primary/30"}`}
              />
            </div>
            {errors.full_name && <p className="text-xs text-destructive">{errors.full_name}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">טלפון *</label>
            <div className="relative">
              <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="054-1234567"
                className={`pr-10 text-right bg-background/50 ${errors.phone ? "border-destructive" : "border-primary/30"}`}
                dir="ltr"
              />
            </div>
            {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
          </div>

          {/* City */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">עיר</label>
            <div className="relative">
              <Building className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                placeholder="שם העיר"
                className={`pr-10 text-right bg-background/50 ${errors.city ? "border-destructive" : "border-primary/30"}`}
              />
            </div>
            {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">כתובת</label>
            <div className="relative">
              <MapPin className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="רחוב ומספר בית"
                className={`pr-10 text-right bg-background/50 ${errors.address ? "border-destructive" : "border-primary/30"}`}
              />
            </div>
            {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">הערות למשלוח</label>
            <div className="relative">
              <FileText className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
              <Textarea
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="קוד בניין, קומה, הוראות מיוחדות..."
                className={`pr-10 text-right bg-background/50 min-h-[80px] resize-none ${errors.notes ? "border-destructive" : "border-primary/30"}`}
              />
            </div>
            {errors.notes && <p className="text-xs text-destructive">{errors.notes}</p>}
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-background/80 border border-primary text-foreground hover:bg-primary hover:text-primary-foreground"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
                שומר...
              </>
            ) : (
              "שמור שינויים"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
