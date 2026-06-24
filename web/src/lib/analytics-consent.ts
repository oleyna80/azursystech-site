export const ANALYTICS_CONSENT_STORAGE_KEY = "azursystech.analyticsConsent";
export const ANALYTICS_CONSENT_SETTINGS_EVENT = "azursystech:analytics-consent-settings";
export const GOOGLE_ANALYTICS_ID = "G-J4Y77YBQMC";

export type AnalyticsConsentChoice = "accepted" | "rejected";

export function isAnalyticsConsentChoice(value: unknown): value is AnalyticsConsentChoice {
  return value === "accepted" || value === "rejected";
}

export function buildGoogleAnalyticsScriptSource(measurementId = GOOGLE_ANALYTICS_ID) {
  const encodedId = encodeURIComponent(measurementId);
  return `https://www.googletagmanager.com/gtag/js?id=${encodedId}`;
}

export function getGoogleAnalyticsCookieNames(cookieHeader: string): string[] {
  return cookieHeader
    .split(";")
    .map((part) => part.trim().split("=")[0])
    .filter((name) => name === "_ga" || name === "_gid" || name === "_gat" || name.startsWith("_ga_"));
}

export function buildExpiredCookieHeaders(cookieNames: string[], hostname: string): string[] {
  const domainParts = hostname.split(".").filter(Boolean);
  const rootDomain = domainParts.length > 1 ? `.${domainParts.slice(-2).join(".")}` : "";
  const domains = Array.from(new Set(["", hostname ? `; domain=${hostname}` : "", rootDomain ? `; domain=${rootDomain}` : ""]));

  return cookieNames.flatMap((name) =>
    domains.map((domain) => `${name}=; Max-Age=0; path=/; SameSite=Lax${domain}`),
  );
}

export function openAnalyticsConsentSettings() {
  window.dispatchEvent(new Event(ANALYTICS_CONSENT_SETTINGS_EVENT));
}
