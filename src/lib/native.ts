// Plattform-Helfer: funktioniert im Web und – ohne Refactor – nativ via Capacitor.

type CapacitorGlobal = {
  isNativePlatform?: () => boolean;
  getPlatform?: () => string;
  Plugins?: Record<string, unknown>;
};

function getCapacitor(): CapacitorGlobal | null {
  if (typeof window === "undefined") return null;
  return (window as unknown as { Capacitor?: CapacitorGlobal }).Capacitor ?? null;
}

export function isNativePlatform(): boolean {
  return getCapacitor()?.isNativePlatform?.() === true;
}

export function getPlatform(): "web" | "ios" | "android" {
  const platform = getCapacitor()?.getPlatform?.();
  if (platform === "ios" || platform === "android") return platform;
  return "web";
}

/**
 * Öffnet eine externe URL.
 * Nativ: In-App-Browser (Capacitor Browser Plugin, sofern registriert).
 * Web: neuer Tab.
 */
export async function openExternalUrl(url: string): Promise<void> {
  if (typeof window === "undefined") return;

  const browser = getCapacitor()?.Plugins?.["Browser"] as
    | { open?: (options: { url: string }) => Promise<void> }
    | undefined;

  if (isNativePlatform() && browser?.open) {
    try {
      await browser.open({ url });
      return;
    } catch {
      // Fallback unten
    }
  }

  window.open(url, "_blank", "noopener,noreferrer");
}

/** SSR- und WebView-sicherer Storage-Zugriff. */
export const safeStorage = {
  get(key: string): string | null {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* z. B. Private Mode */
    }
  },
  remove(key: string): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* noop */
    }
  },
};