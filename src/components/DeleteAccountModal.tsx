import { useState, useRef, useEffect } from "react";
import { Trash2, AlertTriangle, Loader2, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/contexts/ProfileContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "type-confirm" | "confirm" | "otp";

const DeleteAccountModal = ({ isOpen, onClose }: DeleteAccountModalProps) => {
  const { t, isRTL, language } = useLanguage();
  const [step, setStep] = useState<Step>("type-confirm");
  const [isLoading, setIsLoading] = useState(false);
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [otpResendTimer, setOtpResendTimer] = useState(0);
  const [error, setError] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { logout, user } = useProfile();

  const deleteWord = language === 'he' ? 'מחיקה' : 'delete';

  // Timer for resend OTP
  useEffect(() => {
    if (otpResendTimer > 0) {
      const timer = setTimeout(() => setOtpResendTimer(otpResendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpResendTimer]);

  const sendOTP = async () => {
    if (!user?.email) {
      toast({
        title: t('general.error'),
        description: t('deleteAccount.noEmail'),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const response = await supabase.functions.invoke("send-otp", {
        body: { email: user.email, action: "send" },
      });

      if (response.error) throw new Error(response.error.message);
      if (response.data?.error) throw new Error(response.data.error);

      setStep("otp");
      setOtpResendTimer(60);
      toast({
        title: t('deleteAccount.codeSent'),
        description: t('deleteAccount.checkEmail'),
      });
    } catch (error: any) {
      toast({
        title: t('general.error'),
        description: error.message || t('general.error'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAndDelete = async () => {
    const code = otpCode.join("");
    if (code.length !== 6) {
      setError(t('deleteAccount.enter6Digits'));
      return;
    }

    if (!user?.email) {
      setError(t('deleteAccount.noEmail'));
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      // Verify OTP first
      const verifyResponse = await supabase.functions.invoke("send-otp", {
        body: { email: user.email, action: "verify", code },
      });

      if (verifyResponse.error) throw new Error(verifyResponse.error.message);
      if (verifyResponse.data?.error) throw new Error(verifyResponse.data.error);

      // OTP verified, now delete account
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error(t('general.error'));
      }

      const deleteResponse = await supabase.functions.invoke("delete-account", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (deleteResponse.error) {
        throw new Error(deleteResponse.error.message);
      }

      if (deleteResponse.data?.error) {
        throw new Error(deleteResponse.data.error);
      }

      toast({
        title: t('deleteAccount.deleted'),
        description: t('deleteAccount.goodbye'),
      });

      // Clear local storage
      localStorage.removeItem("mazon_haosher_trusted_devices");
      localStorage.removeItem("device_id");

      await logout();
      handleClose();
    } catch (error: any) {
      console.error("Delete account error:", error);
      setError(error.message || t('general.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otpCode];
    newOtp[index] = value.slice(-1);
    setOtpCode(newOtp);
    setError("");

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

  const handleClose = () => {
    setStep("type-confirm");
    setOtpCode(["", "", "", "", "", ""]);
    setError("");
    setOtpResendTimer(0);
    setConfirmText("");
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="bg-background border-destructive/30 max-w-[360px] z-[100]" dir={isRTL ? "rtl" : "ltr"}>
        <AlertDialogHeader>
          <AlertDialogTitle className={`flex items-center gap-2 text-destructive ${isRTL ? 'text-right' : 'text-left'}`}>
            <AlertTriangle className="w-5 h-5" />
            {t('deleteAccount.title')}
          </AlertDialogTitle>
        </AlertDialogHeader>

        {step === "type-confirm" ? (
          <>
            <AlertDialogDescription className={`${isRTL ? 'text-right' : 'text-left'} space-y-3`}>
              <p className="text-foreground/80">
                {t('deleteAccount.typeConfirm')} <span className="font-bold text-destructive">"{deleteWord}"</span> {language === 'he' ? 'בשדה למטה:' : 'in the field below:'}
              </p>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={t('deleteAccount.typePlaceholder')}
                className={`${isRTL ? 'text-right' : 'text-left'} bg-background/50 border-destructive/30 focus:border-destructive`}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </AlertDialogDescription>
            <AlertDialogFooter className="flex-row-reverse gap-2 mt-4">
              <Button
                variant="outline"
                onClick={handleClose}
                className="bg-background/80 border border-primary text-foreground hover:bg-primary/10"
              >
                {t('deleteAccount.cancel')}
              </Button>
              <Button
                onClick={() => setStep("confirm")}
                disabled={confirmText !== deleteWord}
                className="bg-destructive/90 border border-destructive text-destructive-foreground hover:bg-destructive disabled:opacity-50"
              >
                {t('deleteAccount.continue')}
              </Button>
            </AlertDialogFooter>
          </>
        ) : step === "confirm" ? (
          <>
            <AlertDialogDescription className={`${isRTL ? 'text-right' : 'text-left'} space-y-3`}>
              <p className="text-foreground/80">
                {t('deleteAccount.warning')}
              </p>
              <ul className={`list-disc ${isRTL ? 'list-inside mr-2' : 'list-inside ml-2'} text-muted-foreground text-sm space-y-1`}>
                <li>{t('deleteAccount.profileData')}</li>
                <li>{t('deleteAccount.orderHistory')}</li>
              </ul>
              <p className="text-destructive font-medium">
                {t('deleteAccount.noRecover')}
              </p>
              <div className="pt-2 p-3 bg-muted/30 rounded-lg border border-muted">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {t('deleteAccount.sendCode')} {user?.email}
                </p>
              </div>
            </AlertDialogDescription>
            <AlertDialogFooter className="flex-row-reverse gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setStep("type-confirm")}
                className="bg-background/80 border border-primary text-foreground hover:bg-primary/10"
              >
                {t('deleteAccount.back')}
              </Button>
              <Button
                onClick={sendOTP}
                disabled={isLoading}
                className="bg-destructive/90 border border-destructive text-destructive-foreground hover:bg-destructive"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin ml-2" />
                    {t('deleteAccount.sendingCode')}
                  </>
                ) : (
                  <>
                    {t('deleteAccount.continueDelete')}
                    <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                  </>
                )}
              </Button>
            </AlertDialogFooter>
          </>
        ) : (
          <>
            <AlertDialogDescription className={`${isRTL ? 'text-right' : 'text-left'} space-y-4`}>
              <p className="text-foreground/80">
                {t('deleteAccount.enterCode')}
              </p>
              
              {/* OTP Input */}
              <div className="flex justify-center gap-2" dir="ltr">
                {otpCode.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (otpInputRefs.current[index] = el)}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={handleOtpPaste}
                    maxLength={1}
                    className="w-10 h-12 text-center text-lg font-bold bg-background/50 border-destructive/30 focus:border-destructive"
                  />
                ))}
              </div>

              {error && (
                <p className="text-destructive text-sm text-center">{error}</p>
              )}

              {/* Resend Timer */}
              <div className="text-center">
                {otpResendTimer > 0 ? (
                  <p className="text-xs text-muted-foreground">
                    {t('deleteAccount.resendIn').replace('{seconds}', String(otpResendTimer))}
                  </p>
                ) : (
                  <button
                    onClick={sendOTP}
                    disabled={isLoading}
                    className="text-xs text-primary hover:underline disabled:opacity-50"
                  >
                    {t('deleteAccount.resend')}
                  </button>
                )}
              </div>
            </AlertDialogDescription>
            <AlertDialogFooter className="flex-row-reverse gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setStep("confirm")}
                className="bg-background/80 border border-primary text-foreground hover:bg-primary/10"
              >
                {t('deleteAccount.back')}
              </Button>
              <Button
                onClick={verifyAndDelete}
                disabled={isLoading || otpCode.join("").length !== 6}
                className="bg-destructive/90 border border-destructive text-destructive-foreground hover:bg-destructive disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin ml-2" />
                    {t('deleteAccount.deleting')}
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 ml-2" />
                    {t('deleteAccount.deletePermanently')}
                  </>
                )}
              </Button>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAccountModal;
