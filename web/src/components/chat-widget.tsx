"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

import ChatWidget from "@/ChatWidget";
import { createTranslator, readStoredLocale } from "@/i18n";

const SUPPORTED_LOCALES = new Set(["fr", "ru", "en"]);
const ROUTE_LOCALES = new Set(["fr", "ru"]);
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

function resolveRouteLocale(pathname: string): string | null {
  const seg = pathname.split("/")[1];
  return ROUTE_LOCALES.has(seg) ? seg : null;
}

export function ChatWidgetContainer() {
  const pathname = usePathname();
  const runtimeLocale = useSyncExternalStore(
    subscribeToLocaleChanges,
    resolveRuntimeLocale,
    () => FALLBACK_WIDGET_LOCALE,
  );
  const locale = resolveRouteLocale(pathname) ?? runtimeLocale;
  const routeClassName = pathname.endsWith("/ai-automation") ? "route-ai-automation-chat-widget" : undefined;

  return (
    <div className={routeClassName}>
      <ChatWidget locale={locale} t={createTranslator(locale)} />
    </div>
  );
}
