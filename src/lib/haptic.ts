/**
 * Trigger a haptic vibration if supported.
 * Silently no-op on unsupported devices (most desktop browsers).
 */
export const haptic = (pattern: number | number[] = 10) => {
  if (typeof window === "undefined") return;
  if ("vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Silent fail
    }
  }
};

export const hapticLight = () => haptic(8);
export const hapticMedium = () => haptic(15);
export const hapticSuccess = () => haptic([10, 30, 10]);
