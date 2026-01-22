import { useState } from "react";
import { Mail, Lock, User, Phone, Loader2, Eye, EyeOff } from "lucide-react";
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

type AuthMode = "login" | "register" | "forgot";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
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
    setMode("login");
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
    
    if (mode !== "forgot") {
      const passwordResult = passwordSchema.safeParse(formData.password);
      if (!passwordResult.success) {
        newErrors.password = passwordResult.error.errors[0].message;
      }
    }
    
    if (mode === "register") {
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

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "שגיאה",
        description: error.message || "אירעה שגיאה בהתחברות עם Google",
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const emailResult = emailSchema.safeParse(formData.email);
    if (!emailResult.success) {
      setErrors({ email: emailResult.error.errors[0].message });
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/`,
      });
      
      if (error) throw error;
      
      toast({
        title: "נשלח בהצלחה! 📧",
        description: "קישור לאיפוס סיסמה נשלח לאימייל שלך",
      });
      setMode("login");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === "forgot") {
      await handleForgotPassword();
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (mode === "login") {
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

  const getTitle = () => {
    switch (mode) {
      case "login": return "התחברות";
      case "register": return "הרשמה";
      case "forgot": return "שכחתי סיסמה";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[360px] p-4" dir="rtl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg font-display text-primary text-center">
            {getTitle()}
          </DialogTitle>
        </DialogHeader>
        
        {mode !== "forgot" && (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full h-8 text-sm gap-2"
            >
              {isGoogleLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              המשך עם Google
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">או</span>
              </div>
            </div>
          </>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "register" && (
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
          
          {mode !== "forgot" && (
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
          )}
          
          {mode === "login" && (
            <div className="text-left">
              <button
                type="button"
                onClick={() => {
                  setMode("forgot");
                  setErrors({});
                }}
                className="text-xs text-primary hover:underline"
              >
                שכחתי סיסמה
              </button>
            </div>
          )}
          
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-8 text-sm"
            size="sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 ml-1.5 animate-spin" />
                {mode === "login" ? "מתחבר..." : mode === "register" ? "נרשם..." : "שולח..."}
              </>
            ) : (
              mode === "login" ? "התחברות" : mode === "register" ? "הרשמה" : "שלח קישור לאיפוס"
            )}
          </Button>
        </form>
        
        <div className="text-center pt-1">
          {mode === "forgot" ? (
            <button
              onClick={() => {
                setMode("login");
                setErrors({});
              }}
              className="text-xs text-primary hover:underline"
            >
              חזרה להתחברות
            </button>
          ) : (
            <p className="text-muted-foreground text-xs">
              {mode === "login" ? "אין לך חשבון?" : "כבר יש לך חשבון?"}
              {" "}
              <button
                onClick={() => {
                  setMode(mode === "login" ? "register" : "login");
                  setErrors({});
                }}
                className="text-primary hover:underline font-medium"
              >
                {mode === "login" ? "הירשם" : "התחבר"}
              </button>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
