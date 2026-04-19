"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

import ChatWidget from "@/ChatWidget";
import { createTranslator, readStoredLocale } from "@/i18n";

const SUPPORTED_LOCALES = new Set(["fr", "ru", "en"]);
const FALLBACK_WIDGET_LOCALE = "ru";

function resolveRuntimeLocale(): string {
  if (typeof document === "undefined") {
    return FALLBACK_WIDGET_LOCALE;
  }

  const htmlLocale = document.documentElement.lang?.trim().toLowerCase();
  if (htmlLocale && SUPPORTED_LOCALES.has(htmlLocale)) {
    return htmlLocale;
  }

  const storedLocale = readStoredLocale();
  if (typeof storedLocale === "string" && SUPPORTED_LOCALES.has(storedLocale)) {
    return storedLocale;
  }

  return FALLBACK_WIDGET_LOCALE;
}

function subscribeToLocaleChanges() {
  return () => {};
}

export function ChatWidgetContainer() {
  const pathname = usePathname();
  const locale = useSyncExternalStore(
    subscribeToLocaleChanges,
    resolveRuntimeLocale,
    () => FALLBACK_WIDGET_LOCALE,
  );
  const routeClassName = pathname === "/ai-automation" ? "route-ai-automation-chat-widget" : undefined;

  return (
    <div className={routeClassName}>
      <ChatWidget locale={locale} t={createTranslator(locale)} />
    </div>
  );
}
