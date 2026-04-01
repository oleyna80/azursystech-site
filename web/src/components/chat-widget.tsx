"use client";

import { useEffect, useState } from "react";

import ChatWidget from "@/ChatWidget";
import { createTranslator, readStoredLocale } from "@/i18n";

const SUPPORTED_LOCALES = new Set(["fr", "ru", "en"]);
const FALLBACK_WIDGET_LOCALE = "ru";

function resolveRuntimeLocale(): string {
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

export function ChatWidgetContainer() {
  const [locale, setLocale] = useState(FALLBACK_WIDGET_LOCALE);

  useEffect(() => {
    setLocale(resolveRuntimeLocale());
  }, []);

  return <ChatWidget locale={locale} t={createTranslator(locale)} />;
}
