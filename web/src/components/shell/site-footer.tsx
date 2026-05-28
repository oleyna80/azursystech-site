"use client";

import { usePathname } from "next/navigation";

type FooterLocale = "fr" | "ru";
const LOCALE_SLUGS = new Set(["fr", "ru"]);

const CONTACT = {
  phoneDisplay: "+33 7 80 72 09 94",
  phoneHref: "tel:+33780720994",
  whatsappDisplay: "WhatsApp",
  whatsappHref: "https://wa.me/33780720994",
  email: "contact@azursystech.fr",
};

const FOOTER_COPY = {
  fr: {
    about: "Assistance informatique locale pour petites entreprises et particuliers à Nice et dans les environs.",
    navigationTitle: "Navigation",
    documentsTitle: "Documents",
    contactTitle: "Contact",
    serviceArea: "Nice et jusqu'à 30 km autour",
    links: [
      { href: "/#business", label: "Pour les entreprises" },
      { href: "/ai-automation", label: "Automatisation et IA" },
      { href: "/brief", label: "Brief" },
      { href: "/#how-it-works", label: "Comment nous travaillons" },
      { href: "/pricing", label: "Tarifs" },
      { href: "/faq", label: "FAQ" },
      { href: "/#contact", label: "Contact" },
    ],
    legalLinks: [
      { href: "/privacy", label: "Politique de confidentialité" },
      { href: "/legal", label: "Mentions légales" },
      { href: "/terms", label: "Conditions de service" },
    ],
  },
  ru: {
    about: "Локальная техническая помощь для малого бизнеса и частных клиентов в Ницце и рядом.",
    navigationTitle: "Навигация",
    documentsTitle: "Документы",
    contactTitle: "Контакты",
    serviceArea: "Ницца и до 30 км вокруг",
    links: [
      { href: "/#business", label: "Для бизнеса" },
      { href: "/ai-automation", label: "Автоматизация и ИИ" },
      { href: "/brief", label: "Бриф" },
      { href: "/#how-it-works", label: "Как мы работаем" },
      { href: "/pricing", label: "Цены" },
      { href: "/faq", label: "FAQ" },
      { href: "/#contact", label: "Контакты" },
    ],
    legalLinks: [
      { href: "/privacy", label: "Политика конфиденциальности" },
      { href: "/legal", label: "Правовая информация" },
      { href: "/terms", label: "Условия оказания услуг" },
    ],
  },
} as const;

function getLocaleFromPath(pathname: string): FooterLocale | null {
  const seg = pathname.split("/")[1];
  return LOCALE_SLUGS.has(seg) ? (seg as FooterLocale) : null;
}

function localizeFooterHref(href: string, locale: FooterLocale) {
  if (href.startsWith("/#")) {
    return `/${locale}${href.slice(1)}`;
  }

  if (href === "/ai-automation") {
    return `/${locale}/ai-automation`;
  }

  return href;
}

export function SiteFooter({ locale }: { locale: FooterLocale }) {
  const pathname = usePathname();
  const activeLocale = getLocaleFromPath(pathname) ?? locale;
  const copy = FOOTER_COPY[activeLocale];

  return (
    <footer className="bg-graphite py-16 text-white/66">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid gap-12 border-b border-white/10 pb-10 md:grid-cols-[0.9fr_1.1fr]">
          <div className="max-w-sm">
            <span className="mb-4 block text-2xl font-bold text-white">AzurSysTech</span>
            <p className="text-sm leading-7 text-white/72">{copy.about}</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="grid gap-4">
              <h2 className="text-[12px] font-bold uppercase tracking-[0.18em] text-white/92">{copy.navigationTitle}</h2>
              <div className="grid gap-3">
                {copy.links.map((link) => {
                  const href = localizeFooterHref(link.href, activeLocale);
                  return (
                    <a key={href} href={href} className="text-base font-semibold text-white/78 transition-colors hover:text-white">
                      {link.label}
                    </a>
                  );
                })}
              </div>
            </div>
            <div className="grid gap-4">
              <h2 className="text-[12px] font-bold uppercase tracking-[0.18em] text-white/92">{copy.documentsTitle}</h2>
              <div className="grid gap-3">
                {copy.legalLinks.map((link) => (
                  <a key={link.href} href={link.href} className="text-base font-semibold text-white/78 transition-colors hover:text-white">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:col-span-2 lg:col-span-1">
              <h2 className="text-[12px] font-bold uppercase tracking-[0.18em] text-white/92">{copy.contactTitle}</h2>
              <div className="grid gap-3 text-base font-semibold text-white/82">
                <a href={CONTACT.phoneHref} className="transition-colors hover:text-white">
                  {CONTACT.phoneDisplay}
                </a>
                <a href={`mailto:${CONTACT.email}`} className="transition-colors hover:text-white">
                  {CONTACT.email}
                </a>
                <a href={CONTACT.whatsappHref} target="_blank" rel="noreferrer" className="transition-colors hover:text-white">
                  {CONTACT.whatsappDisplay}
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 pt-8 text-sm font-medium text-white/58 md:flex-row md:items-center md:justify-between">
          <span>&copy; {new Date().getFullYear()} AzurSysTech</span>
          <span>{copy.serviceArea}</span>
        </div>
      </div>
    </footer>
  );
}
