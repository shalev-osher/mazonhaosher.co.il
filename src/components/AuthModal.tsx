import React, { useState, useRef, useEffect } from "react";
import { Lock, User, Loader2, Eye, EyeOff, Shield, Smartphone, Sparkles } from "lucide-react";
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
import { useLanguage } from "@/contexts/LanguageContext";

// SVG icons with inline styles to prevent Tailwind purging
const MailIconWithGradient = () => (
  <div className="p-2 rounded-full" style={{ background: 'linear-gradient(to bottom right, #3b82f6, #06b6d4)' }}>
    <svg style={{ width: '16px', height: '16px', color: 'white' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  </div>
);

const PhoneIconWithGradient = () => (
  <div className="p-2 rounded-full" style={{ background: 'linear-gradient(to bottom right, #22c55e, #10b981)' }}>
    <svg style={{ width: '16px', height: '16px', color: 'white' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  </div>
);

const PhoneIconSmall = () => (
  <svg style={{ width: '12px', height: '12px' }} className="text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const MailIconSmall = () => (
  <svg style={{ width: '12px', height: '12px' }} className="text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

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

type AuthMode = "login" | "register" | "forgot" | "otp-method" | "otp";

// Device fingerprint helpers
const getDeviceId = (): string => {
  const stored = localStorage.getItem("device_id");
  if (stored) return stored;
  const newId = crypto.randomUUID();
  localStorage.setItem("device_id", newId);
  return newId;
};

const getDeviceInfo = (t: (key: string) => string): string => {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
  if (/Android/.test(ua)) return "Android";
  if (/Mac/.test(ua)) return "Mac";
  if (/Windows/.test(ua)) return "Windows";
  if (/Linux/.test(ua)) return "Linux";
  return t('auth.unknownDevice');
};

const getTrustedDevices = (): TrustedDevice[] => {
  try {
    const data = JSON.parse(localStorage.getItem(TRUSTED_DEVICES_KEY) || "[]");
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
            deviceInfo: "Unknown"
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

const trustDevice = (email: string, t: (key: string) => string) => {
  const devices = getTrustedDevices();
  const deviceId = getDeviceId();
  const existingIndex = devices.findIndex(d => d.email === email && d.deviceId === deviceId);
  
  const newDevice: TrustedDevice = {
    email,
    deviceId,
    trustedUntil: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    addedAt: Date.now(),
    deviceInfo: getDeviceInfo(t)
  };
  
  if (existingIndex >= 0) {
    devices[existingIndex] = newDevice;
  } else {
    devices.push(newDevice);
  }
  
  localStorage.setItem(TRUSTED_DEVICES_KEY, JSON.stringify(devices));
};

// Rate limiting for OTP attempts
const getOtpAttempts = (identifier: string): { count: number; lockedUntil: number | null } => {
  try {
    const data = JSON.parse(sessionStorage.getItem(`otp_attempts_${identifier}`) || "{}");
    return { count: data.count || 0, lockedUntil: data.lockedUntil || null };
  } catch {
    return { count: 0, lockedUntil: null };
  }
};

const incrementOtpAttempts = (identifier: string): boolean => {
  const attempts = getOtpAttempts(identifier);
  const newCount = attempts.count + 1;
  
  if (newCount >= MAX_OTP_ATTEMPTS) {
    sessionStorage.setItem(`otp_attempts_${identifier}`, JSON.stringify({
      count: newCount,
      lockedUntil: Date.now() + LOCKOUT_DURATION
    }));
    return false;
  }
  
  sessionStorage.setItem(`otp_attempts_${identifier}`, JSON.stringify({ count: newCount, lockedUntil: null }));
  return true;
};

const resetOtpAttempts = (identifier: string) => {
  sessionStorage.removeItem(`otp_attempts_${identifier}`);
};

const GoogleIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>((props, ref) => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" ref={ref} {...props}>
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
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" ref={ref} {...props}>
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
));
AppleIcon.displayName = "AppleIcon";

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const { t, isRTL } = useLanguage();
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
  const [otpMethod, setOtpMethod] = useState<"email" | "sms">("email");
  const [verificationPhone, setVerificationPhone] = useState("");
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dynamic validation schemas based on language
  const emailSchema = z.string().email(t('auth.invalidEmail'));
  const passwordSchema = z.string().min(6, t('auth.passwordMin'));
  const phoneSchema = z.string().min(9, t('auth.invalidPhone')).max(15, t('auth.phoneTooLong'));
  const nameSchema = z.string().min(2, t('auth.nameMin')).max(100, t('auth.nameTooLong'));
  const smsPhoneSchema = z.string()
    .min(9, t('auth.invalidPhone'))
    .max(15, t('auth.phoneTooLong'))
    .refine((val) => /^0?5[0-9]{8}$|^\+972[5][0-9]{8}$/.test(val.replace(/[\s-]/g, "")), {
      message: t('auth.israeliPhoneRequired')
    });

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
          resetOtpAttempts(otpMethod === "email" ? formData.email : verificationPhone);
          setRemainingAttempts(MAX_OTP_ATTEMPTS);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lockoutEndTime, formData.email, verificationPhone, otpMethod]);

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
    setOtpMethod("email");
    setVerificationPhone("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        handleClose();
      }
    });

    return () => subscription.unsubscribe();
  }, [isOpen]);

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

  const translateOAuthError = (error: any): string => {
    const msg = error?.message?.toLowerCase() || "";
    if (msg.includes("cancelled") || msg.includes("canceled")) {
      return t('auth.cancelledLogin');
    }
    if (msg.includes("popup closed") || msg.includes("popup_closed")) {
      return t('auth.popupClosed');
    }
    if (msg.includes("network") || msg.includes("fetch")) {
      return t('auth.networkError');
    }
    if (msg.includes("provider is not enabled") || msg.includes("missing oauth secret")) {
      return t('auth.providerNotEnabled');
    }
    return error?.message || t('auth.genericError');
  };

  const getRedirectUri = () => new URL("/", window.location.origin).toString();

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: getRedirectUri(),
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: t('auth.error'),
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
        title: t('auth.error'),
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
        title: t('auth.resetSent'),
        description: t('auth.resetSentDesc'),
      });
      setMode("login");
    } catch (error: any) {
      toast({
        title: t('auth.error'),
        description: error.message || t('auth.genericError'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendEmailOTP = async () => {
    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke("send-otp", {
        body: { email: formData.email, action: "send" },
      });

      if (response.error) throw new Error(response.error.message);
      if (response.data?.error) throw new Error(response.data.error);

      setOtpSent(true);
      setOtpResendTimer(60);
      setMode("otp");
      toast({
        title: t('auth.codeSentEmail'),
        description: t('auth.checkEmailInbox'),
      });
    } catch (error: any) {
      toast({
        title: t('auth.error'),
        description: error.message || t('auth.sendCodeError'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendSmsOTP = async () => {
    const phoneResult = smsPhoneSchema.safeParse(verificationPhone);
    if (!phoneResult.success) {
      setErrors({ verificationPhone: phoneResult.error.errors[0].message });
      return;
    }

    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke("send-sms-otp", {
        body: { phone: verificationPhone, action: "send" },
      });

      if (response.error) throw new Error(response.error.message);
      if (response.data?.error) throw new Error(response.data.error);

      setOtpSent(true);
      setOtpResendTimer(60);
      setMode("otp");
      toast({
        title: t('auth.codeSentSms'),
        description: t('auth.checkSms'),
      });
    } catch (error: any) {
      toast({
        title: t('auth.error'),
        description: error.message || t('auth.sendCodeError'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (): Promise<boolean> => {
    const code = otpCode.join("");
    if (code.length !== 6) {
      setErrors({ otp: t('auth.enter6Digits') });
      return false;
    }

    const identifier = otpMethod === "email" ? formData.email : verificationPhone;
    const attempts = getOtpAttempts(identifier);
    if (attempts.lockedUntil && attempts.lockedUntil > Date.now()) {
      const remainingMinutes = Math.ceil((attempts.lockedUntil - Date.now()) / 60000);
      setErrors({ otp: t('auth.tooManyAttempts').replace('{minutes}', String(remainingMinutes)) });
      setLockoutEndTime(attempts.lockedUntil);
      return false;
    }

    setIsLoading(true);
    try {
      if (otpMethod === "email") {
        const response = await supabase.functions.invoke("send-otp", {
          body: { email: formData.email, action: "verify", code },
        });

        if (response.error) throw new Error(response.error.message);
        if (response.data?.error) throw new Error(response.data.error);
      } else {
        const response = await supabase.functions.invoke("send-sms-otp", {
          body: { phone: verificationPhone, action: "verify", code },
        });

        if (response.error) throw new Error(response.error.message);
        if (response.data?.error) throw new Error(response.data.error);
      }

      resetOtpAttempts(identifier);
      
      if (rememberDevice) {
        trustDevice(formData.email, t);
      }

      return true;
    } catch (error: any) {
      const canContinue = incrementOtpAttempts(identifier);
      const newAttempts = getOtpAttempts(identifier);
      setRemainingAttempts(MAX_OTP_ATTEMPTS - newAttempts.count);
      
      if (!canContinue) {
        setLockoutEndTime(newAttempts.lockedUntil);
        setErrors({ otp: t('auth.tooManyAttempts').replace('{minutes}', '15') });
      } else {
        setErrors({ otp: `${error.message || t('auth.wrongCode')} (${t('auth.attemptsLeft').replace('{count}', String(MAX_OTP_ATTEMPTS - newAttempts.count))})` });
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
          throw new Error(t('auth.wrongCredentials'));
        }
        throw error;
      }
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
          throw new Error(t('auth.emailExists'));
        }
        throw error;
      }
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.rpc("upsert_my_profile", {
          p_phone: formData.phone || "",
          p_full_name: formData.fullName,
        });
      }
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
            title: t('auth.error'),
            description: error.message || t('auth.genericError'),
            variant: "destructive",
          });
        }
      }
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    if (mode === "login" && isDeviceTrusted(formData.email)) {
      setPendingAction("login");
      try {
        await completeAuth();
      } catch (error: any) {
        setPendingAction("login");
        setMode("otp-method");
      }
      return;
    }
    
    setPendingAction(mode as "login" | "register");
    setMode("otp-method");
  };

  const handleOtpMethodSelect = async (method: "email" | "sms") => {
    setOtpMethod(method);
    if (method === "email") {
      await sendEmailOTP();
    }
  };

  const handleSmsVerificationSubmit = async () => {
    await sendSmsOTP();
  };

  const getTitle = () => {
    switch (mode) {
      case "login": return t('auth.loginTitle');
      case "register": return t('auth.registerTitle');
      case "forgot": return t('auth.forgotTitle');
      case "otp-method": return t('auth.chooseOtpMethod') || "בחירת שיטת אימות";
      case "otp": return t('auth.otpTitle');
    }
  };

  const isLockedOut = lockoutEndTime && lockoutEndTime > Date.now();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent variant="luxury" overlayVariant="glass" className="sm:max-w-[400px] p-6" dir={isRTL ? "rtl" : "ltr"}>
        <Sparkles className="absolute top-4 left-12 h-4 w-4 auth-sparkle" />
        <Sparkles className="absolute top-8 right-12 h-3 w-3 auth-sparkle" style={{ animationDelay: '0.5s' }} />
        
        <div className="flex justify-center -mt-2 mb-1">
          <img 
            src={logo} 
            alt={isRTL ? "מזון האושר" : "Mazon HaOsher"} 
            className="h-14 w-auto auth-logo-glow"
          />
        </div>

        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg font-display text-primary text-center flex items-center justify-center gap-2">
            {mode === "otp" && <Shield className="h-5 w-5" />}
            {mode === "otp-method" && <Shield className="h-5 w-5" />}
            {getTitle()}
          </DialogTitle>
        </DialogHeader>

        {mode === "otp-method" ? (
          <div className="space-y-4 auth-stagger">
            <p className="text-sm text-center text-muted-foreground">
              {isRTL ? "איך תרצה לקבל את קוד האימות?" : "How would you like to receive the verification code?"}
            </p>
            
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOtpMethodSelect("email")}
                disabled={isLoading}
                className="w-full h-12 text-sm gap-3 auth-oauth-btn border-2 justify-start px-4"
              >
                <MailIconWithGradient />
                <div className="text-right flex-1">
                  <div className="font-medium">{isRTL ? "קוד למייל" : "Email code"}</div>
                  <div className="text-xs text-muted-foreground" dir="ltr">{formData.email}</div>
                </div>
                {isLoading && otpMethod === "email" && <Loader2 className="h-4 w-4 animate-spin" />}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => setOtpMethod("sms")}
                disabled={isLoading}
                className="w-full h-12 text-sm gap-3 auth-oauth-btn border-2 justify-start px-4"
              >
                <PhoneIconWithGradient />
                <div className="text-right flex-1">
                  <div className="font-medium">{isRTL ? "קוד ב-SMS" : "SMS code"}</div>
                  <div className="text-xs text-muted-foreground">{isRTL ? "הזן מספר טלפון" : "Enter phone number"}</div>
                </div>
              </Button>
            </div>

            {otpMethod === "sms" && (
              <div className="space-y-3 pt-2 border-t border-border">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium flex items-center gap-1.5 text-foreground/80">
                    <PhoneIconSmall />
                    {isRTL ? "מספר טלפון" : "Phone number"}
                  </label>
                  <Input
                    type="tel"
                    value={verificationPhone}
                    onChange={(e) => {
                      setVerificationPhone(e.target.value);
                      setErrors({});
                    }}
                    placeholder="0501234567"
                    className="text-left h-10 text-sm auth-input-luxury"
                    dir="ltr"
                    autoFocus
                  />
                  {errors.verificationPhone && (
                    <p className="text-[10px] text-destructive">{errors.verificationPhone}</p>
                  )}
                </div>
                
                <Button
                  type="button"
                  onClick={handleSmsVerificationSubmit}
                  disabled={isLoading || !verificationPhone}
                  className="w-full h-10 text-sm auth-btn-primary"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                      <span>{isRTL ? "שולח..." : "Sending..."}</span>
                    </>
                  ) : (
                    <span>{isRTL ? "שלח קוד" : "Send code"}</span>
                  )}
                </Button>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setMode(pendingAction || "login");
                setOtpMethod("email");
                setVerificationPhone("");
              }}
              className="w-full text-xs text-muted-foreground hover:underline"
            >
              {t('auth.back')}
            </button>
          </div>
        ) : mode === "otp" ? (
          <form onSubmit={handleSubmit} className="space-y-4 auth-stagger">
            <p className="text-sm text-center text-muted-foreground">
              {isRTL ? "קוד נשלח אל" : "Code sent to"}
              <br />
              <span className="font-medium text-foreground" dir="ltr">
                {otpMethod === "email" ? formData.email : verificationPhone}
              </span>
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
                {t('auth.rememberDevice')}
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading || otpCode.join("").length !== 6 || isLockedOut}
              className="w-full h-10 text-sm auth-btn-primary"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  <span>{t('auth.verifying')}</span>
                </>
              ) : (
                <span>{t('auth.verifyAndContinue')}</span>
              )}
            </Button>

            <div className="text-center">
              {otpResendTimer > 0 ? (
                <p className="text-xs text-muted-foreground">
                  {t('auth.resendIn').replace('{seconds}', String(otpResendTimer))}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => otpMethod === "email" ? sendEmailOTP() : sendSmsOTP()}
                  disabled={isLoading}
                  className="text-xs text-primary hover:underline"
                >
                  {t('auth.resendCode')}
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setMode("otp-method");
                setOtpSent(false);
                setOtpCode(["", "", "", "", "", ""]);
              }}
              className="w-full text-xs text-muted-foreground hover:underline"
            >
              {isRTL ? "שנה שיטת אימות" : "Change verification method"}
            </button>
          </form>
        ) : (
          <div className="auth-stagger">
            {mode !== "forgot" && (
              <>
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleSignIn}
                    disabled={isGoogleLoading || isAppleLoading}
                    className="w-full h-11 text-sm gap-3 auth-oauth-btn border-2"
                  >
                    {isGoogleLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <GoogleIcon />
                    )}
                    {isRTL ? "המשך עם Google" : "Continue with Google"}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAppleSignIn}
                    disabled={isAppleLoading || isGoogleLoading}
                    className="w-full h-11 text-sm gap-3 auth-oauth-btn border-2"
                  >
                    {isAppleLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <AppleIcon />
                    )}
                    {isRTL ? "המשך עם Apple" : "Continue with Apple"}
                  </Button>
                </div>
                
                <div className="relative my-5 auth-divider">
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-transparent px-3 text-muted-foreground">{t('auth.or')}</span>
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
                      {t('auth.fullNameLabel')}
                    </label>
                    <Input
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder={t('auth.fullNamePlaceholder')}
                      className={`h-10 text-sm auth-input-luxury ${isRTL ? 'text-right' : 'text-left'}`}
                    />
                    {errors.fullName && (
                      <p className="text-[10px] text-destructive">{errors.fullName}</p>
                    )}
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium flex items-center gap-1.5 text-foreground/80">
                      <Phone className="h-3 w-3 text-primary" />
                      {t('auth.phoneOptional')}
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="0501234567"
                      className="text-left h-10 text-sm auth-input-luxury"
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
                  {t('auth.emailLabel')}
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@example.com"
                  className="text-left h-10 text-sm auth-input-luxury"
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
                    {t('auth.passwordLabel')}
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder={t('auth.passwordPlaceholder')}
                      className="text-left pl-9 h-10 text-sm auth-input-luxury"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                    {t('auth.forgotPassword')}
                  </button>
                </div>
              )}
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 text-sm auth-btn-primary mt-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    <span>
                      {mode === "login" ? t('auth.loggingIn') : mode === "register" ? t('auth.registering') : t('auth.sendingReset')}
                    </span>
                  </>
                ) : (
                  <span>
                    {mode === "login" ? t('auth.loginBtn') : mode === "register" ? t('auth.registerBtn') : t('auth.sendResetLink')}
                  </span>
                )}
              </Button>
            </form>
            
            <div className="text-center pt-3">
              {mode === "forgot" ? (
                <button
                  onClick={() => {
                    setMode("login");
                    setErrors({});
                  }}
                  className="text-xs text-primary hover:underline"
                >
                  {t('auth.backToLoginLink')}
                </button>
              ) : (
                <p className="text-muted-foreground text-xs">
                  {mode === "login" ? t('auth.noAccount') : t('auth.hasAccount')}
                  {" "}
                  <button
                    onClick={() => {
                      setMode(mode === "login" ? "register" : "login");
                      setErrors({});
                    }}
                    className="text-primary hover:underline font-medium"
                  >
                    {mode === "login" ? t('auth.signupLink') : t('auth.loginLink')}
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
