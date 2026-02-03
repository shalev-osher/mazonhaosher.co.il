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
import { toast } from "@/hooks/use-toast";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "type-confirm" | "confirm" | "otp";

const DeleteAccountModal = ({ isOpen, onClose }: DeleteAccountModalProps) => {
  const [step, setStep] = useState<Step>("type-confirm");
  const [isLoading, setIsLoading] = useState(false);
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [otpResendTimer, setOtpResendTimer] = useState(0);
  const [error, setError] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { logout, user } = useProfile();

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
        title: "שגיאה",
        description: "לא נמצא אימייל משתמש",
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

  const verifyAndDelete = async () => {
    const code = otpCode.join("");
    if (code.length !== 6) {
      setError("יש להזין 6 ספרות");
      return;
    }

    if (!user?.email) {
      setError("לא נמצא אימייל משתמש");
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
        throw new Error("לא מחובר");
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
        title: "החשבון נמחק",
        description: "להתראות, תמיד אפשר לחזור 🍪",
      });

      // Clear local storage
      localStorage.removeItem("mazon_haosher_trusted_devices");
      localStorage.removeItem("device_id");

      await logout();
      handleClose();
    } catch (error: any) {
      console.error("Delete account error:", error);
      setError(error.message || "אירעה שגיאה");
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
      <AlertDialogContent className="bg-background/90 border-destructive/30 text-right max-w-[360px]" dir="rtl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive text-right">
            <AlertTriangle className="w-5 h-5" />
            מחיקת חשבון
          </AlertDialogTitle>
        </AlertDialogHeader>

        {step === "type-confirm" ? (
          <>
            <AlertDialogDescription className="text-right space-y-3">
              <p className="text-foreground/80">
                כדי להמשיך, הקלד <span className="font-bold text-destructive">"מחיקה"</span> בשדה למטה:
              </p>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="הקלד מחיקה"
                className="text-right bg-background/50 border-destructive/30 focus:border-destructive"
                dir="rtl"
              />
            </AlertDialogDescription>
            <AlertDialogFooter className="flex-row-reverse gap-2 mt-4">
              <Button
                variant="outline"
                onClick={handleClose}
                className="bg-background/80 border border-primary text-foreground hover:bg-primary/10"
              >
                ביטול
              </Button>
              <Button
                onClick={() => setStep("confirm")}
                disabled={confirmText !== "מחיקה"}
                className="bg-destructive/90 border border-destructive text-destructive-foreground hover:bg-destructive disabled:opacity-50"
              >
                המשך
              </Button>
            </AlertDialogFooter>
          </>
        ) : step === "confirm" ? (
          <>
            <AlertDialogDescription className="text-right space-y-3">
              <p className="text-foreground/80">
                פעולה זו תמחק לצמיתות את החשבון שלך וכל המידע הקשור אליו, כולל:
              </p>
              <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 mr-2">
                <li>פרטי הפרופיל</li>
                <li>היסטוריית הזמנות</li>
              </ul>
              <p className="text-destructive font-medium">
                לא ניתן לשחזר את המידע לאחר המחיקה!
              </p>
              <div className="pt-2 p-3 bg-muted/30 rounded-lg border border-muted">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  נשלח קוד אימות למייל {user?.email}
                </p>
              </div>
            </AlertDialogDescription>
            <AlertDialogFooter className="flex-row-reverse gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setStep("type-confirm")}
                className="bg-background/80 border border-primary text-foreground hover:bg-primary/10"
              >
                חזור
              </Button>
              <Button
                onClick={sendOTP}
                disabled={isLoading}
                className="bg-destructive/90 border border-destructive text-destructive-foreground hover:bg-destructive"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin ml-2" />
                    שולח קוד...
                  </>
                ) : (
                  <>
                    המשך למחיקה
                    <ArrowRight className="w-4 h-4 mr-2" />
                  </>
                )}
              </Button>
            </AlertDialogFooter>
          </>
        ) : (
          <>
            <AlertDialogDescription className="text-right space-y-4">
              <p className="text-foreground/80">
                הזן את קוד האימות שנשלח למייל שלך:
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
                    שלח שוב בעוד {otpResendTimer} שניות
                  </p>
                ) : (
                  <button
                    onClick={sendOTP}
                    disabled={isLoading}
                    className="text-xs text-primary hover:underline disabled:opacity-50"
                  >
                    שלח קוד חדש
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
                חזור
              </Button>
              <Button
                onClick={verifyAndDelete}
                disabled={isLoading || otpCode.join("").length !== 6}
                className="bg-destructive/90 border border-destructive text-destructive-foreground hover:bg-destructive disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin ml-2" />
                    מוחק...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 ml-2" />
                    מחק לצמיתות
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
