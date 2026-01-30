import { useState } from "react";
import { KeyRound, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const passwordSchema = z.object({
  newPassword: z.string()
    .min(8, "סיסמה חייבת להכיל לפחות 8 תווים")
    .regex(/[A-Z]/, "סיסמה חייבת להכיל אות גדולה באנגלית")
    .regex(/[0-9]/, "סיסמה חייבת להכיל מספר"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "הסיסמאות לא תואמות",
  path: ["confirmPassword"],
});

const ChangePasswordModal = ({ isOpen, onClose }: ChangePasswordModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

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
    const result = passwordSchema.safeParse(formData);
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
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword,
      });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error: any) {
      console.error("Change password error:", error);
      setErrors({ newPassword: error.message || "אירעה שגיאה בשינוי הסיסמה" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ newPassword: "", confirmPassword: "" });
    setErrors({});
    setSuccess(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="auth-modal-luxury sm:max-w-[360px]" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <KeyRound className="w-5 h-5 text-primary" />
            שינוי סיסמה
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
              <KeyRound className="w-8 h-8 text-primary" />
            </div>
            <p className="text-lg font-medium text-foreground">הסיסמה שונתה בהצלחה!</p>
            <p className="text-sm text-muted-foreground">השתמש בסיסמה החדשה בהתחברות הבאה</p>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">סיסמה חדשה</label>
              <div className="relative">
                <KeyRound className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) => handleChange("newPassword", e.target.value)}
                  placeholder="לפחות 8 תווים"
                  className={`pr-10 pl-10 text-right bg-background/50 ${errors.newPassword ? "border-destructive" : "border-primary/30"}`}
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.newPassword && <p className="text-xs text-destructive">{errors.newPassword}</p>}
              <p className="text-[10px] text-muted-foreground">אות גדולה + מספר + 8 תווים לפחות</p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">אימות סיסמה</label>
              <div className="relative">
                <KeyRound className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  placeholder="הזן שוב את הסיסמה"
                  className={`pr-10 pl-10 text-right bg-background/50 ${errors.confirmPassword ? "border-destructive" : "border-primary/30"}`}
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !formData.newPassword || !formData.confirmPassword}
              className="w-full bg-background/80 border border-primary text-foreground hover:bg-primary hover:text-primary-foreground"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin ml-2" />
                  מעדכן...
                </>
              ) : (
                "שנה סיסמה"
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal;
