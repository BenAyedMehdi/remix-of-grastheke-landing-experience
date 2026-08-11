/**
 * Lightweight, typed event tracking layer.
 *
 * - Pushes to `window.dataLayer` when Google Tag Manager / gtag is present.
 * - Falls back to console logging in development.
 * - Safe to call from any browser context (SSR guards included).
 */

export type AnalyticsEventName =
  | "cooperation_cta_click"
  | "location_cta_click"
  | "location_select"
  | "product_view"
  | "gram_enter_click"
  | "age_gate_verify"
  | "batch_search"
  | "review_submit"
  | "review_vote";

export interface AnalyticsEventProperties {
  cooperation_cta_click: {
    location: string;
    label: string;
  };
  location_select: {
    city: string;
  };
  product_view: {
    slug: string;
    name: string;
  };
  gram_enter_click: {
    source: string;
  };
  age_gate_verify: {
    confirmed: boolean;
  };
  batch_search: {
    query: string;
  };
  review_submit: {
    product_slug: string;
    batch_number?: string;
  };
  review_vote: {
    review_id: string;
    direction: "up" | "down";
  };
}

type DataLayer = {
  push: (args: unknown) => void;
};

declare global {
  interface Window {
    dataLayer?: DataLayer;
    gtag?: (...args: unknown[]) => void;
  }
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function trackEvent<T extends AnalyticsEventName>(
  eventName: T,
  properties: AnalyticsEventProperties[T]
): void {
  if (!isBrowser()) return;

  const payload = {
    event: eventName,
    ...properties,
  };

  // Google Tag Manager / gtag.js
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, properties);
  }

  // Google Tag Manager dataLayer fallback
  if (typeof window.dataLayer?.push === "function") {
    window.dataLayer.push(payload);
  }

  // Development visibility
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log("[analytics]", payload);
  }
}
