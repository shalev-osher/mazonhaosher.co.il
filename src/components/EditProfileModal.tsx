import { useState, useEffect, useRef } from "react";
import { User, Loader2, MapPin, Phone, FileText, Building, Camera, X, Trash2 } from "lucide-react";
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
import { z } from "zod";
import DeleteAccountModal from "./DeleteAccountModal";

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
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (profile) {
        setFormData({
          full_name: profile.full_name || "",
          phone: profile.phone || "",
          address: profile.address || "",
          city: profile.city || "",
          notes: profile.notes || "",
        });
      }
      // Load avatar from user metadata or Google
      const googleAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
      setAvatarUrl(googleAvatar || null);
      setErrors({});
      setSuccessMessage(null);
    }
  }, [isOpen, profile, user]);

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

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      setErrors({ avatar: "יש להעלות קובץ תמונה בלבד" });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors({ avatar: "גודל התמונה מקסימלי 2MB" });
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("assets")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("assets")
        .getPublicUrl(fileName);

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl + `?t=${Date.now()}` },
      });

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl + `?t=${Date.now()}`);
      setSuccessMessage("התמונה הועלתה בהצלחה!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      console.error("Avatar upload error:", error);
      setErrors({ avatar: error.message || "שגיאה בהעלאת התמונה" });
    } finally {
      setIsUploadingAvatar(false);
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
      setSuccessMessage("הפרופיל עודכן בהצלחה! ✨");
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error: any) {
      console.error("Update profile error:", error);
      setErrors({ submit: error.message || "אירעה שגיאה בעדכון הפרופיל" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="auth-modal-luxury sm:max-w-[360px] max-h-[85vh] overflow-y-auto" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <User className="w-5 h-5 text-primary" />
            עריכת פרופיל
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-2">
            <div 
              onClick={handleAvatarClick}
              className="relative w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 cursor-pointer hover:border-primary/50 transition-all overflow-hidden group"
            >
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-10 h-10 text-primary/50" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {isUploadingAvatar ? (
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                ) : (
                  <Camera className="w-6 h-6 text-white" />
                )}
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            <p className="text-[10px] text-muted-foreground">לחץ להחלפת תמונה</p>
            {errors.avatar && <p className="text-xs text-destructive">{errors.avatar}</p>}
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-2 text-center">
              <p className="text-sm text-primary">{successMessage}</p>
            </div>
          )}

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

          {/* Submit Error */}
          {errors.submit && (
            <p className="text-xs text-destructive text-center">{errors.submit}</p>
          )}

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

          {/* Delete Account Button */}
          <Button
            variant="ghost"
            onClick={() => setShowDeleteModal(true)}
            className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 text-xs"
          >
            <Trash2 className="w-3.5 h-3.5 ml-2" />
            מחיקת חשבון
          </Button>
        </div>

        {/* Delete Account Modal */}
        <DeleteAccountModal 
          isOpen={showDeleteModal} 
          onClose={() => setShowDeleteModal(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
