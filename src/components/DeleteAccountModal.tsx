import { useState } from "react";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
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

const DeleteAccountModal = ({ isOpen, onClose }: DeleteAccountModalProps) => {
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const { logout } = useProfile();

  const CONFIRM_TEXT = "מחק את החשבון";

  const handleDelete = async () => {
    if (confirmText !== CONFIRM_TEXT) {
      toast({
        title: "שגיאה",
        description: "יש להקליד את הטקסט המבוקש כדי לאשר",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("לא מחובר");
      }

      const response = await supabase.functions.invoke("delete-account", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      toast({
        title: "החשבון נמחק",
        description: "להתראות, תמיד אפשר לחזור 🍪",
      });

      // Clear local storage
      localStorage.removeItem("mazon_haosher_trusted_devices");
      localStorage.removeItem("device_id");

      await logout();
      onClose();
    } catch (error: any) {
      console.error("Delete account error:", error);
      toast({
        title: "שגיאה",
        description: error.message || "אירעה שגיאה במחיקת החשבון",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setConfirmText("");
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="bg-background/90 border-destructive/30 text-right" dir="rtl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive text-right">
            <AlertTriangle className="w-5 h-5" />
            מחיקת חשבון
          </AlertDialogTitle>
          <AlertDialogDescription className="text-right space-y-3">
            <p className="text-foreground/80">
              פעולה זו תמחק לצמיתות את החשבון שלך וכל המידע הקשור אליו, כולל:
            </p>
            <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 mr-2">
              <li>פרטי הפרופיל</li>
              <li>היסטוריית הזמנות</li>
              <li>מכשירים מהימנים</li>
            </ul>
            <p className="text-destructive font-medium">
              לא ניתן לשחזר את המידע לאחר המחיקה!
            </p>
            <div className="pt-3">
              <p className="text-sm text-muted-foreground mb-2">
                כדי לאשר, הקלד: <span className="font-semibold text-foreground">{CONFIRM_TEXT}</span>
              </p>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="הקלד כאן לאישור..."
                className="text-right bg-background/50 border-destructive/30 focus:border-destructive"
                dir="rtl"
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row-reverse gap-2">
          <AlertDialogCancel 
            onClick={handleClose}
            className="bg-background/80 border border-primary text-foreground hover:bg-primary/10"
          >
            ביטול
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={confirmText !== CONFIRM_TEXT || isDeleting}
            className="bg-destructive/90 border border-destructive text-destructive-foreground hover:bg-destructive disabled:opacity-50"
          >
            {isDeleting ? (
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
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAccountModal;
