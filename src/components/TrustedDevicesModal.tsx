import { useState, useEffect } from "react";
import { Smartphone, Trash2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

// Trusted devices storage key
const TRUSTED_DEVICES_KEY = "mazon_haosher_trusted_devices";

interface TrustedDevice {
  email: string;
  deviceId: string;
  trustedUntil: number;
  addedAt: number;
  deviceInfo: string;
}

interface TrustedDevicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

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

const getUserTrustedDevices = (email: string): TrustedDevice[] => {
  const devices = getTrustedDevices();
  return devices.filter(d => d.email === email && d.trustedUntil > Date.now());
};

const removeTrustedDevice = (email: string, deviceId: string) => {
  const devices = getTrustedDevices();
  const filtered = devices.filter(d => !(d.email === email && d.deviceId === deviceId));
  localStorage.setItem(TRUSTED_DEVICES_KEY, JSON.stringify(filtered));
};

const removeAllTrustedDevices = (email: string) => {
  const devices = getTrustedDevices();
  const filtered = devices.filter(d => d.email !== email);
  localStorage.setItem(TRUSTED_DEVICES_KEY, JSON.stringify(filtered));
};

const TrustedDevicesModal = ({ isOpen, onClose, userEmail }: TrustedDevicesModalProps) => {
  const [devices, setDevices] = useState<TrustedDevice[]>([]);

  useEffect(() => {
    if (isOpen && userEmail) {
      setDevices(getUserTrustedDevices(userEmail));
    }
  }, [isOpen, userEmail]);

  const handleRemoveDevice = (deviceId: string) => {
    removeTrustedDevice(userEmail, deviceId);
    setDevices(getUserTrustedDevices(userEmail));
    toast({
      title: "המכשיר הוסר",
      description: "המכשיר לא יזוהה כמהימן בהתחברות הבאה",
    });
  };

  const handleRemoveAllDevices = () => {
    removeAllTrustedDevices(userEmail);
    setDevices([]);
    toast({
      title: "כל המכשירים הוסרו",
      description: "תצטרך לאמת את זהותך בהתחברות הבאה מכל מכשיר",
    });
  };

  const currentDeviceId = getDeviceId();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px] p-4" dir="rtl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg font-display text-primary text-center flex items-center justify-center gap-2">
            <Shield className="h-5 w-5" />
            מכשירים מהימנים
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-center text-muted-foreground">
            מכשירים אלו מדלגים על אימות דו-שלבי
            <br />
            <span className="font-medium text-foreground" dir="ltr">{userEmail}</span>
          </p>
          
          {devices.length === 0 ? (
            <div className="text-center py-8">
              <Smartphone className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                אין מכשירים מהימנים
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                בחר "זכור את המכשיר הזה" בעת ההתחברות הבאה
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {devices.map((device) => {
                const isCurrentDevice = device.deviceId === currentDeviceId;
                const expiresIn = Math.ceil((device.trustedUntil - Date.now()) / (1000 * 60 * 60 * 24));
                
                return (
                  <div 
                    key={device.deviceId} 
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      isCurrentDevice 
                        ? 'bg-accent/10 border-accent/30' 
                        : 'bg-muted/30 border-border hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                        isCurrentDevice ? 'bg-accent/20' : 'bg-primary/10'
                      }`}>
                        <Smartphone className={`h-4 w-4 ${isCurrentDevice ? 'text-accent' : 'text-primary'}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {device.deviceInfo}
                          {isCurrentDevice && (
                            <span className="text-xs text-accent mr-2">(המכשיר הנוכחי)</span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          תקף עוד {expiresIn} ימים
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveDevice(device.deviceId)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          {devices.length > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleRemoveAllDevices}
              className="w-full h-9 text-sm text-destructive border-destructive/30 hover:bg-destructive/10"
            >
              <Trash2 className="h-3.5 w-3.5 ml-1.5" />
              הסר את כל המכשירים
            </Button>
          )}

          <p className="text-[10px] text-center text-muted-foreground">
            הסרת מכשיר תחייב אימות דו-שלבי בהתחברות הבאה ממנו
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrustedDevicesModal;
