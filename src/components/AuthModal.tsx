import React, { useState, useRef, useEffect } from "react";
import { Mail, Lock, User, Phone, Loader2, Eye, EyeOff, Shield, Smartphone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { z } from "zod";
import logo from "@/assets/logo.png";

// Validation schemas
const emailSchema = z.string().email("כתובת אימייל לא תקינה");
const passwordSchema = z.string().min(6, "סיסמה חייבת להכיל לפחות 6 תווים");
const phoneSchema = z.string().min(9, "מספר טלפון לא תקין").max(15, "מספר טלפון ארוך מדי");
const nameSchema = z.string().min(2, "שם חייב להכיל לפחות 2 תווים").max(100, "שם ארוך מדי");

// Trusted devices storage key
const TRUSTED_DEVICES_KEY = "mazon_haosher_trusted_devices";
const MAX_OTP_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

interface TrustedDevice {
  email: string;
  deviceId: string;
  trustedUntil: number;
  addedAt: number;
  deviceInfo: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = "login" | "register" | "forgot" | "otp";

// Device fingerprint helpers
const getDeviceId = (): string => {
  const stored = localStorage.getItem("device_id");
  if (stored) return stored;
  const newId = crypto.randomUUID();
  localStorage.setItem("device_id", newId);
  return newId;
};

const getDeviceInfo = (): string => {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
  if (/Android/.test(ua)) return "Android";
  if (/Mac/.test(ua)) return "Mac";
  if (/Windows/.test(ua)) return "Windows";
  if (/Linux/.test(ua)) return "Linux";
  return "מכשיר לא ידוע";
};

const getTrustedDevices = (): TrustedDevice[] => {
  try {
    const data = JSON.parse(localStorage.getItem(TRUSTED_DEVICES_KEY) || "[]");
    // Convert old format to new format if needed
    if (!Array.isArray(data)) {
      const devices: TrustedDevice[] = [];
      for (const [key, value] of Object.entries(data as Record<string, number>)) {
        const [email, deviceId] = key.split("_");
        if (email && deviceId) {
          devices.push({
            email,
            deviceId,
            trustedUntil: value as number,
            addedAt: Date.now(),
            deviceInfo: getDeviceInfo()
          });
        }
      }
      localStorage.setItem(TRUSTED_DEVICES_KEY, JSON.stringify(devices));
      return devices;
    }
    return data;
  } catch {
    return [];
  }
};

const isDeviceTrusted = (email: string): boolean => {
  const devices = getTrustedDevices();
  const deviceId = getDeviceId();
  const device = devices.find(d => d.email === email && d.deviceId === deviceId);
  return device ? device.trustedUntil > Date.now() : false;
};

const trustDevice = (email: string) => {
  const devices = getTrustedDevices();
  const deviceId = getDeviceId();
  const existingIndex = devices.findIndex(d => d.email === email && d.deviceId === deviceId);
  
  const newDevice: TrustedDevice = {
    email,
    deviceId,
    trustedUntil: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    addedAt: Date.now(),
    deviceInfo: getDeviceInfo()
  };
  
  if (existingIndex >= 0) {
    devices[existingIndex] = newDevice;
  } else {
    devices.push(newDevice);
  }
  
  localStorage.setItem(TRUSTED_DEVICES_KEY, JSON.stringify(devices));
};

// Rate limiting for OTP attempts
const getOtpAttempts = (email: string): { count: number; lockedUntil: number | null } => {
  try {
    const data = JSON.parse(sessionStorage.getItem(`otp_attempts_${email}`) || "{}");
    return { count: data.count || 0, lockedUntil: data.lockedUntil || null };
  } catch {
    return { count: 0, lockedUntil: null };
  }
};

const incrementOtpAttempts = (email: string): boolean => {
  const attempts = getOtpAttempts(email);
  const newCount = attempts.count + 1;
  
  if (newCount >= MAX_OTP_ATTEMPTS) {
    sessionStorage.setItem(`otp_attempts_${email}`, JSON.stringify({
      count: newCount,
      lockedUntil: Date.now() + LOCKOUT_DURATION
    }));
    return false; // Locked out
  }
  
  sessionStorage.setItem(`otp_attempts_${email}`, JSON.stringify({ count: newCount, lockedUntil: null }));
  return true; // Can continue
};

const resetOtpAttempts = (email: string) => {
  sessionStorage.removeItem(`otp_attempts_${email}`);
};

const GoogleIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>((props, ref) => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" ref={ref} {...props}>
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
));
GoogleIcon.displayName = "GoogleIcon";

const AppleIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>((props, ref) => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" ref={ref} {...props}>
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
));
AppleIcon.displayName = "AppleIcon";

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [otpResendTimer, setOtpResendTimer] = useState(0);
  const [pendingAction, setPendingAction] = useState<"login" | "register" | null>(null);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [remainingAttempts, setRemainingAttempts] = useState(MAX_OTP_ATTEMPTS);
  const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(null);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Timer for resend OTP
  useEffect(() => {
    if (otpResendTimer > 0) {
      const timer = setTimeout(() => setOtpResendTimer(otpResendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpResendTimer]);

  // Lockout timer
  useEffect(() => {
    if (lockoutEndTime && lockoutEndTime > Date.now()) {
      const timer = setInterval(() => {
        if (lockoutEndTime <= Date.now()) {
          setLockoutEndTime(null);
          resetOtpAttempts(formData.email);
          setRemainingAttempts(MAX_OTP_ATTEMPTS);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lockoutEndTime, formData.email]);

  const resetForm = () => {
    setFormData({ email: "", password: "", fullName: "", phone: "" });
    setErrors({});
    setMode("login");
    setShowPassword(false);
    setOtpSent(false);
    setOtpCode(["", "", "", "", "", ""]);
    setPendingAction(null);
    setRememberDevice(true);
    setRemainingAttempts(MAX_OTP_ATTEMPTS);
    setLockoutEndTime(null);
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
    
    if (mode !== "forgot" && mode !== "otp") {
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

  // Helper to translate OAuth errors to Hebrew
  const translateOAuthError = (error: any): string => {
    const msg = error?.message?.toLowerCase() || "";
    if (msg.includes("cancelled") || msg.includes("canceled")) {
      return "ההתחברות בוטלה";
    }
    if (msg.includes("popup closed") || msg.includes("popup_closed")) {
      return "החלון נסגר לפני השלמת ההתחברות";
    }
    if (msg.includes("network") || msg.includes("fetch")) {
      return "שגיאת רשת, בדוק את החיבור לאינטרנט";
    }
    if (msg.includes("provider is not enabled") || msg.includes("missing oauth secret")) {
      return "ספק ההתחברות לא מוגדר כרגע";
    }
    return error?.message || "אירעה שגיאה בהתחברות";
  };

  // OAuth redirect should return to the exact origin the user is currently on
  // (important for custom domain vs www vs preview domains)
  const getRedirectUri = () => window.location.origin;

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: getRedirectUri(),
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "שגיאה",
        description: translateOAuthError(error),
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setIsAppleLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth("apple", {
        redirect_uri: getRedirectUri(),
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "שגיאה",
        description: translateOAuthError(error),
        variant: "destructive",
      });
    } finally {
      setIsAppleLoading(false);
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

  const sendOTP = async () => {
    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke("send-otp", {
        body: { email: formData.email, action: "send" },
      });

      if (response.error) throw new Error(response.error.message);
      if (response.data?.error) throw new Error(response.data.error);

      setOtpSent(true);
      setOtpResendTimer(60);
      toast({
        title: "קוד נשלח! 📧",
        description: "בדוק את תיבת המייל שלך",
      });
    } catch (error: any) {
      toast({
        title: "שגיאה",
        description: error.message || "אירעה שגיאה בשליחת הקוד",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (): Promise<boolean> => {
    const code = otpCode.join("");
    if (code.length !== 6) {
      setErrors({ otp: "יש להזין 6 ספרות" });
      return false;
    }

    // Check if locked out
    const attempts = getOtpAttempts(formData.email);
    if (attempts.lockedUntil && attempts.lockedUntil > Date.now()) {
      const remainingMinutes = Math.ceil((attempts.lockedUntil - Date.now()) / 60000);
      setErrors({ otp: `יותר מדי ניסיונות שגויים. נסה שוב בעוד ${remainingMinutes} דקות` });
      setLockoutEndTime(attempts.lockedUntil);
      return false;
    }

    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke("send-otp", {
        body: { email: formData.email, action: "verify", code },
      });

      if (response.error) throw new Error(response.error.message);
      if (response.data?.error) throw new Error(response.data.error);

      // Reset attempts on success
      resetOtpAttempts(formData.email);
      
      // Trust device if requested
      if (rememberDevice) {
        trustDevice(formData.email);
      }

      return true;
    } catch (error: any) {
      // Increment failed attempts
      const canContinue = incrementOtpAttempts(formData.email);
      const newAttempts = getOtpAttempts(formData.email);
      setRemainingAttempts(MAX_OTP_ATTEMPTS - newAttempts.count);
      
      if (!canContinue) {
        setLockoutEndTime(newAttempts.lockedUntil);
        setErrors({ otp: "יותר מדי ניסיונות שגויים. נסה שוב בעוד 15 דקות" });
      } else {
        setErrors({ otp: `${error.message || "קוד אימות שגוי"} (נותרו ${MAX_OTP_ATTEMPTS - newAttempts.count} ניסיונות)` });
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otpCode];
    newOtp[index] = value.slice(-1);
    setOtpCode(newOtp);
    setErrors({});

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otpCode];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || "";
    }
    setOtpCode(newOtp);
    if (pasted.length === 6) {
      otpInputRefs.current[5]?.focus();
    }
  };

  const completeAuth = async () => {
    if (pendingAction === "login") {
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
    } else if (pendingAction === "register") {
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
    }
    handleClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === "forgot") {
      await handleForgotPassword();
      return;
    }

    if (mode === "otp") {
      const isValid = await verifyOTP();
      if (isValid) {
        try {
          await completeAuth();
        } catch (error: any) {
          toast({
            title: "שגיאה",
            description: error.message || "אירעה שגיאה, נסו שוב",
            variant: "destructive",
          });
        }
      }
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    // Check if device is trusted - skip 2FA
    if (mode === "login" && isDeviceTrusted(formData.email)) {
      setPendingAction("login");
      try {
        await completeAuth();
      } catch (error: any) {
        // If auth fails, still require 2FA
        setPendingAction("login");
        setMode("otp");
        await sendOTP();
      }
      return;
    }
    
    // Send OTP for 2FA
    setPendingAction(mode as "login" | "register");
    setMode("otp");
    await sendOTP();
  };

  const getTitle = () => {
    switch (mode) {
      case "login": return "התחברות";
      case "register": return "הרשמה";
      case "forgot": return "שכחתי סיסמה";
      case "otp": return "אימות דו-שלבי";
    }
  };

  const isLockedOut = lockoutEndTime && lockoutEndTime > Date.now();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent variant="luxury" overlayVariant="glass" className="sm:max-w-[380px] p-6" dir="rtl">
        {/* Decorative sparkles */}
        <Sparkles className="absolute top-4 left-12 h-4 w-4 auth-sparkle" />
        <Sparkles className="absolute top-8 right-12 h-3 w-3 auth-sparkle" style={{ animationDelay: '0.5s' }} />
        
        {/* Logo */}
        <div className="flex justify-center -mt-2 mb-1">
          <img 
            src={logo} 
            alt="מזון האושר" 
            className="h-14 w-auto auth-logo-glow"
          />
        </div>

        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg font-display text-primary text-center flex items-center justify-center gap-2">
            {mode === "otp" && <Shield className="h-5 w-5" />}
            {getTitle()}
          </DialogTitle>
        </DialogHeader>

        {mode === "otp" ? (
          <form onSubmit={handleSubmit} className="space-y-4 auth-stagger">
            <p className="text-sm text-center text-muted-foreground">
              שלחנו קוד אימות בן 6 ספרות ל-
              <br />
              <span className="font-medium text-foreground" dir="ltr">{formData.email}</span>
            </p>
            
            <div className="flex justify-center gap-2" dir="ltr" onPaste={handleOtpPaste}>
              {otpCode.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (otpInputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-11 h-12 text-center text-lg font-bold auth-input-luxury"
                  autoFocus={index === 0}
                  disabled={isLockedOut}
                />
              ))}
            </div>

            {errors.otp && (
              <p className="text-[10px] text-destructive text-center">{errors.otp}</p>
            )}

            <div className="flex items-center gap-2 justify-center">
              <Checkbox
                id="rememberDevice"
                checked={rememberDevice}
                onCheckedChange={(checked) => setRememberDevice(checked as boolean)}
              />
              <label htmlFor="rememberDevice" className="text-xs text-muted-foreground flex items-center gap-1 cursor-pointer">
                <Smartphone className="h-3 w-3" />
                זכור את המכשיר הזה
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading || otpCode.join("").length !== 6 || isLockedOut}
              className="w-full h-9 text-sm auth-btn-primary"
              size="sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 ml-1.5 animate-spin relative z-10" />
                  <span className="relative z-10">מאמת...</span>
                </>
              ) : (
                <span className="relative z-10">אמת והמשך</span>
              )}
            </Button>

            <div className="text-center">
              {otpResendTimer > 0 ? (
                <p className="text-xs text-muted-foreground">
                  שלח שוב בעוד {otpResendTimer} שניות
                </p>
              ) : (
                <button
                  type="button"
                  onClick={sendOTP}
                  disabled={isLoading}
                  className="text-xs text-primary hover:underline"
                >
                  שלח קוד חדש
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setMode(pendingAction || "login");
                setOtpSent(false);
                setOtpCode(["", "", "", "", "", ""]);
              }}
              className="w-full text-xs text-muted-foreground hover:underline"
            >
              חזרה
            </button>
          </form>
        ) : (
          <div className="auth-stagger">
            {mode !== "forgot" && (
              <>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleSignIn}
                    disabled={isGoogleLoading || isAppleLoading}
                    className="flex-1 h-9 text-sm gap-2 auth-oauth-btn border-0"
                  >
                    {isGoogleLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <GoogleIcon />
                    )}
                    Google
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAppleSignIn}
                    disabled={isAppleLoading || isGoogleLoading}
                    className="flex-1 h-9 text-sm gap-2 auth-oauth-btn border-0"
                  >
                    {isAppleLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <AppleIcon />
                    )}
                    Apple
                  </Button>
                </div>
                
                <div className="relative my-4 auth-divider">
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-transparent px-3 text-muted-foreground">או</span>
                  </div>
                </div>
              </>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === "register" && (
                <>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium flex items-center gap-1.5 text-foreground/80">
                      <User className="h-3 w-3 text-primary" />
                      שם מלא *
                    </label>
                    <Input
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="ישראל ישראלי"
                      className="text-right h-9 text-sm auth-input-luxury"
                    />
                    {errors.fullName && (
                      <p className="text-[10px] text-destructive">{errors.fullName}</p>
                    )}
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium flex items-center gap-1.5 text-foreground/80">
                      <Phone className="h-3 w-3 text-primary" />
                      טלפון
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="0501234567"
                      className="text-left h-9 text-sm auth-input-luxury"
                      dir="ltr"
                    />
                    {errors.phone && (
                      <p className="text-[10px] text-destructive">{errors.phone}</p>
                    )}
                  </div>
                </>
              )}
              
              <div className="space-y-1.5">
                <label className="block text-xs font-medium flex items-center gap-1.5 text-foreground/80">
                  <Mail className="h-3 w-3 text-primary" />
                  אימייל *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@example.com"
                  className="text-left h-9 text-sm auth-input-luxury"
                  dir="ltr"
                />
                {errors.email && (
                  <p className="text-[10px] text-destructive">{errors.email}</p>
                )}
              </div>
              
              {mode !== "forgot" && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium flex items-center gap-1.5 text-foreground/80">
                    <Lock className="h-3 w-3 text-primary" />
                    סיסמה *
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="לפחות 6 תווים"
                      className="text-left pl-8 h-9 text-sm auth-input-luxury"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
                <div className="flex justify-between items-center">
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
                className="w-full h-9 text-sm auth-btn-primary mt-2"
                size="sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 ml-1.5 animate-spin relative z-10" />
                    <span className="relative z-10">
                      {mode === "login" ? "מתחבר..." : mode === "register" ? "נרשם..." : "שולח..."}
                    </span>
                  </>
                ) : (
                  <span className="relative z-10">
                    {mode === "login" ? "התחברות" : mode === "register" ? "הרשמה" : "שלח קישור לאיפוס"}
                  </span>
                )}
              </Button>
            </form>
            
            <div className="text-center pt-2">
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
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
