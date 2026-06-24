import type { Metadata } from "next";
import { cookies } from "next/headers";

import { LOCALE_COOKIE_KEY, resolveLocale } from "@/i18n";
import { ContactPageClient } from "@/components/contact/contact-page-client";

type ContactPageLocale = "fr" | "ru";

const PAGE_META = {
  fr: {
    title: "Contact et demande | AzurSysTech",
    description:
      "Contactez AzurSysTech via le formulaire, WhatsApp, téléphone ou email pour décrire un besoin web, automatisation IA ou support technique.",
  },
  ru: {
    title: "Контакты и заявка | AzurSysTech",
    description:
      "Связаться с AzurSysTech через форму, WhatsApp, телефон или email для сайта, AI-автоматизации или технической задачи.",
  },
} as const satisfies Record<ContactPageLocale, Metadata>;

function resolveContactPageLocale(value?: string | null): ContactPageLocale {
  return resolveLocale(value) === "ru" ? "ru" : "fr";
}

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = resolveContactPageLocale(cookieStore.get(LOCALE_COOKIE_KEY)?.value);

  return PAGE_META[locale];
}

export default async function ContactPage() {
  const cookieStore = await cookies();
  const locale = resolveContactPageLocale(cookieStore.get(LOCALE_COOKIE_KEY)?.value);

  return <ContactPageClient locale={locale} />;
}
