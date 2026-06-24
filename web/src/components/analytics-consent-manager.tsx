"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createTranslator } from "@/i18n";
import {
  ANALYTICS_CONSENT_SETTINGS_EVENT,
  ANALYTICS_CONSENT_STORAGE_KEY,
  type AnalyticsConsentChoice,
  buildExpiredCookieHeaders,
  buildGoogleAnalyticsScriptSource,
  getGoogleAnalyticsCookieNames,
  GOOGLE_ANALYTICS_ID,
  isAnalyticsConsentChoice,
} from "@/lib/analytics-consent";

type ConsentLocale = "fr" | "ru";

type GtagCommand = "js" | "config" | "consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: [GtagCommand, Date | string, Record<string, unknown>?]) => void;
  }
}

function setGoogleAnalyticsDisabled(disabled: boolean) {
  (window as unknown as Record<string, boolean>)[`ga-disable-${GOOGLE_ANALYTICS_ID}`] = disabled;
}

function readStoredConsent(): AnalyticsConsentChoice | null {
  try {
    const value = window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
    return isAnalyticsConsentChoice(value) ? value : null;
  } catch {
    return null;
  }
}

function persistConsent(choice: AnalyticsConsentChoice) {
  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, choice);
  } catch {
    // Keep the site usable if storage is unavailable.
  }
}

function clearAnalyticsCookies() {
  const names = getGoogleAnalyticsCookieNames(document.cookie);
  for (const expiredCookie of buildExpiredCookieHeaders(names, window.location.hostname)) {
    document.cookie = expiredCookie;
  }
}

function loadGoogleAnalytics() {
  setGoogleAnalyticsDisabled(false);

  if (document.querySelector(`script[data-azursystech-analytics="${GOOGLE_ANALYTICS_ID}"]`)) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args) {
      window.dataLayer?.push(args);
    };

  window.gtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "granted",
  });
  window.gtag("js", new Date());
  window.gtag("config", GOOGLE_ANALYTICS_ID, { anonymize_ip: true });

  const script = document.createElement("script");
  script.async = true;
  script.src = buildGoogleAnalyticsScriptSource();
  script.dataset.azursystechAnalytics = GOOGLE_ANALYTICS_ID;
  document.head.appendChild(script);
}

export function AnalyticsConsentManager({ locale }: { locale: ConsentLocale }) {
  const [choice, setChoice] = useState<AnalyticsConsentChoice | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const t = useMemo(() => createTranslator(locale), [locale]);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      const storedChoice = readStoredConsent();
      setChoice(storedChoice);
      setIsOpen(storedChoice === null);
    }, 0);

    return () => window.clearTimeout(timerId);
  }, []);

  useEffect(() => {
    const handleOpenSettings = () => setIsOpen(true);

    window.addEventListener(ANALYTICS_CONSENT_SETTINGS_EVENT, handleOpenSettings);
    return () => window.removeEventListener(ANALYTICS_CONSENT_SETTINGS_EVENT, handleOpenSettings);
  }, []);

  useEffect(() => {
    if (choice === "accepted") {
      loadGoogleAnalytics();
      return;
    }

    if (choice === "rejected") {
      setGoogleAnalyticsDisabled(true);
      window.gtag?.("consent", "update", {
        ad_storage: "denied",
        analytics_storage: "denied",
      });
      clearAnalyticsCookies();
    }
  }, [choice]);

  const handleChoice = useCallback((nextChoice: AnalyticsConsentChoice) => {
    persistConsent(nextChoice);
    setChoice(nextChoice);
    setIsOpen(false);
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <section
      aria-label={t("consent.eyebrow")}
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-graphite/10 bg-white/95 px-4 py-4 shadow-[0_-18px_50px_rgba(31,42,55,0.16)] backdrop-blur md:px-8"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-teal">{t("consent.eyebrow")}</p>
          <h2 className="mt-1 text-lg font-extrabold text-graphite">{t("consent.title")}</h2>
          <p className="mt-2 text-sm leading-6 text-graphite/72">
            {t("consent.descriptionPrefix")}
            <Link href="/privacy" className="font-bold text-accent-teal underline-offset-4 hover:underline">
              {t("common.privacyPolicy")}
            </Link>
            {t("consent.descriptionSuffix")}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row md:shrink-0">
          <button
            type="button"
            onClick={() => handleChoice("rejected")}
            className="rounded-full border border-graphite/15 px-5 py-3 text-sm font-bold text-graphite transition-colors hover:bg-graphite/5"
          >
            {t("consent.rejectButton")}
          </button>
          <button
            type="button"
            onClick={() => handleChoice("accepted")}
            className="rounded-full bg-accent-teal px-5 py-3 text-sm font-bold text-white shadow-premium-soft transition-colors hover:bg-accent-teal/90"
          >
            {t("consent.acceptButton")}
          </button>
        </div>
      </div>
    </section>
  );
}
