import { useState } from "react";
import { Mail, Lock, User, Phone, Loader2, Eye, EyeOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

// Validation schemas
const emailSchema = z.string().email("כתובת אימייל לא תקינה");
const passwordSchema = z.string().min(6, "סיסמה חייבת להכיל לפחות 6 תווים");
const phoneSchema = z.string().min(9, "מספר טלפון לא תקין").max(15, "מספר טלפון ארוך מדי");
const nameSchema = z.string().min(2, "שם חייב להכיל לפחות 2 תווים").max(100, "שם ארוך מדי");

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFormData({ email: "", password: "", fullName: "", phone: "" });
    setErrors({});
    setIsLogin(true);
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    const emailResult = emailSchema.safeParse(formData.email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }
    
    const passwordResult = passwordSchema.safeParse(formData.password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }
    
    if (!isLogin) {
      const nameResult = nameSchema.safeParse(formData.fullName);
      if (!nameResult.success) {
        newErrors.fullName = nameResult.error.errors[0].message;
      }
      
      if (formData.phone) {
        const phoneResult = phoneSchema.safeParse(formData.phone);
        if (!phoneResult.success) {
          newErrors.phone = phoneResult.error.errors[0].message;
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            throw new Error("אימייל או סיסמה שגויים");
          }
          throw error;
        }
        
        toast({
          title: "התחברת בהצלחה! 🎉",
          description: "ברוך הבא",
        });
        handleClose();
      } else {
        const redirectUrl = `${window.location.origin}/`;
        
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: formData.fullName,
              phone: formData.phone,
            },
          },
        });
        
        if (error) {
          if (error.message.includes("already registered")) {
            throw new Error("כתובת האימייל כבר רשומה במערכת");
          }
          throw error;
        }
        
        // Create profile for the user
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.rpc("upsert_my_profile", {
            p_phone: formData.phone || "",
            p_full_name: formData.fullName,
          });
        }
        
        toast({
          title: "נרשמת בהצלחה! 🎉",
          description: "ברוך הבא למשפחת מזון האושר",
        });
        handleClose();
      }
    } catch (error: any) {
      toast({
        title: "שגיאה",
        description: error.message || "אירעה שגיאה, נסו שוב",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[360px] p-4" dir="rtl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg font-display text-primary text-center">
            {isLogin ? "התחברות" : "הרשמה"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          {!isLogin && (
            <>
              <div className="space-y-1">
                <label className="block text-xs font-medium flex items-center gap-1.5">
                  <User className="h-3 w-3" />
                  שם מלא *
                </label>
                <Input
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="ישראל ישראלי"
                  className="text-right h-8 text-sm"
                />
                {errors.fullName && (
                  <p className="text-[10px] text-destructive">{errors.fullName}</p>
                )}
              </div>
              
              <div className="space-y-1">
                <label className="block text-xs font-medium flex items-center gap-1.5">
                  <Phone className="h-3 w-3" />
                  טלפון
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="0501234567"
                  className="text-left h-8 text-sm"
                  dir="ltr"
                />
                {errors.phone && (
                  <p className="text-[10px] text-destructive">{errors.phone}</p>
                )}
              </div>
            </>
          )}
          
          <div className="space-y-1">
            <label className="block text-xs font-medium flex items-center gap-1.5">
              <Mail className="h-3 w-3" />
              אימייל *
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="email@example.com"
              className="text-left h-8 text-sm"
              dir="ltr"
            />
            {errors.email && (
              <p className="text-[10px] text-destructive">{errors.email}</p>
            )}
          </div>
          
          <div className="space-y-1">
            <label className="block text-xs font-medium flex items-center gap-1.5">
              <Lock className="h-3 w-3" />
              סיסמה *
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="לפחות 6 תווים"
                className="text-left pl-8 h-8 text-sm"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[10px] text-destructive">{errors.password}</p>
            )}
          </div>
          
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-8 text-sm"
            size="sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 ml-1.5 animate-spin" />
                {isLogin ? "מתחבר..." : "נרשם..."}
              </>
            ) : (
              isLogin ? "התחברות" : "הרשמה"
            )}
          </Button>
        </form>
        
        <div className="text-center pt-1">
          <p className="text-muted-foreground text-xs">
            {isLogin ? "אין לך חשבון?" : "כבר יש לך חשבון?"}
            {" "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
              }}
              className="text-primary hover:underline font-medium"
            >
              {isLogin ? "הירשם" : "התחבר"}
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
