import { useEffect, useState } from "react";

/**
 * Detects whether the device/connection prefers reduced effects:
 * - prefers-reduced-motion
 * - Save-Data header (navigator.connection.saveData)
 * - Low battery (<20% and not charging)
 *
 * When `lowPower` is true, components should disable expensive animations,
 * blur, particles, and large background images.
 */
interface NavigatorConnectionLike {
  saveData?: boolean;
  effectiveType?: string;
}

interface BatteryManagerLike {
  level: number;
  charging: boolean;
  addEventListener: (type: string, listener: () => void) => void;
  removeEventListener: (type: string, listener: () => void) => void;
}

export const usePerformanceMode = () => {
  const [lowPower, setLowPower] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let cancelled = false;
    let battery: BatteryManagerLike | null = null;
    const update = () => {
      if (cancelled) return;
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const conn = (navigator as Navigator & {
        connection?: NavigatorConnectionLike;
      }).connection;
      const saveData = !!conn?.saveData;
      const slow =
        conn?.effectiveType === "slow-2g" || conn?.effectiveType === "2g";
      const lowBat =
        battery !== null && !battery.charging && battery.level < 0.2;
      setLowPower(reducedMotion || saveData || slow || lowBat);
    };

    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    motionMq.addEventListener?.("change", update);

    const navWithBattery = navigator as Navigator & {
      getBattery?: () => Promise<BatteryManagerLike>;
    };
    if (typeof navWithBattery.getBattery === "function") {
      navWithBattery.getBattery().then((b) => {
        if (cancelled) return;
        battery = b;
        b.addEventListener("levelchange", update);
        b.addEventListener("chargingchange", update);
        update();
      }).catch(() => update());
    } else {
      update();
    }

    return () => {
      cancelled = true;
      motionMq.removeEventListener?.("change", update);
      if (battery) {
        battery.removeEventListener("levelchange", update);
        battery.removeEventListener("chargingchange", update);
      }
    };
  }, []);

  return lowPower;
};
