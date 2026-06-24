"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LOCALE_COOKIE_KEY } from "@/i18n";

type HeaderLocale = "fr" | "ru";

const CONTACT = {
  whatsappHref: "https://wa.me/33780720994",
};

const LOCALE_OPTIONS: HeaderLocale[] = ["fr", "ru"];
const LOCALE_SLUGS = new Set(["fr", "ru"]);
const COOKIE_BACKED_ROUTES = ["/brief"] as const;

function getLocaleFromPath(pathname: string): HeaderLocale | null {
  const seg = pathname.split("/")[1];
  return LOCALE_SLUGS.has(seg) ? (seg as HeaderLocale) : null;
}

function buildLocalizedPath(pathname: string, next: HeaderLocale): string {
  const segs = pathname.split("/");
  if (LOCALE_SLUGS.has(segs[1])) {
    segs[1] = next;
    return segs.join("/") || `/${next}`;
  }
  if (COOKIE_BACKED_ROUTES.includes(pathname as (typeof COOKIE_BACKED_ROUTES)[number])) {
    return pathname;
  }
  return `/${next}`;
}

const HEADER_COPY = {
  fr: {
    navAriaLabel: "Navigation principale",
    menuOpenLabel: "Ouvrir le menu",
    menuCloseLabel: "Fermer le menu",
    whatsappCta: "WhatsApp",
    submitCta: "Décrire un projet",
  },
  ru: {
    navAriaLabel: "Основная навигация",
    menuOpenLabel: "Открыть меню",
    menuCloseLabel: "Закрыть меню",
    whatsappCta: "WhatsApp",
    submitCta: "Описать проект",
  },
} as const;

function buildNavLinks(locale: HeaderLocale) {
  const t = {
    fr: { automation: "Automatisation IA", websites: "Sites web", services: "Services", faq: "FAQ", contact: "Contact" },
    ru: { automation: "AI-автоматизация", websites: "Сайты", services: "Услуги", faq: "FAQ", contact: "Контакты" },
  }[locale];
  return [
    { href: `/${locale}#automation`, label: t.automation },
    { href: `/${locale}#websites`, label: t.websites },
    { href: `/${locale}#services`, label: t.services },
    { href: `/${locale}#faq`, label: t.faq },
    { href: `/${locale}#contact`, label: t.contact },
  ];
}

export function SiteHeader({ initialLocale }: { initialLocale: HeaderLocale }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const routeLocale = getLocaleFromPath(pathname);
  const [locale, setLocale] = useState<HeaderLocale>(routeLocale ?? initialLocale);
  const copy = HEADER_COPY[locale];
  const navLinks = useMemo(() => buildNavLinks(locale), [locale]);

  useEffect(() => {
    setLocale(routeLocale ?? initialLocale);
  }, [routeLocale, initialLocale]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };

    const handleHashChange = () => {
      setIsMenuOpen(false);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleLocaleChange = (nextLocale: HeaderLocale) => {
    if (nextLocale === locale) return;
    setLocale(nextLocale);
    setIsMenuOpen(false);
    // Persist as UX preference cookie
    // eslint-disable-next-line react-hooks/immutability
    document.cookie = `${LOCALE_COOKIE_KEY}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    // Navigate to localized version of current page or refresh cookie-backed pages.
    const nextPath = buildLocalizedPath(pathname, nextLocale);
    if (nextPath === pathname) {
      router.refresh();
      return;
    }
    router.push(nextPath);
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-graphite/80 backdrop-blur-xl">
      <div className="container relative mx-auto flex flex-wrap items-center justify-between gap-2 gap-y-2 px-4 py-4 md:gap-3 md:px-8">
        <Link href={`/${locale}`} className="group flex items-center gap-2.5 md:gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-teal text-white transition-transform group-hover:scale-105">
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 2 3 7.5v9L12 22l9-5.5v-9L12 2zm0 2.2 6.9 4v7.6L12 19.8l-6.9-4V8.2l6.9-4z"
              />
            </svg>
          </span>
          <span className="text-base font-extrabold tracking-tight text-white transition-colors group-hover:text-white/80 sm:text-xl md:text-2xl">
            AzurSysTech
          </span>
        </Link>

        <nav
          aria-label={copy.navAriaLabel}
          className="hidden items-center gap-7 text-sm font-bold text-white/90 [text-shadow:0_1px_1px_rgba(0,0,0,0.25)] lg:flex"
        >
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden rounded-full border border-white/10 bg-white/5 p-1 sm:inline-flex">
            {LOCALE_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleLocaleChange(option)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] transition-colors ${
                  locale === option ? "bg-white text-graphite" : "text-white/72 hover:text-white"
                }`}
                aria-pressed={locale === option}
              >
                {option}
              </button>
            ))}
          </div>
          <a
            href={CONTACT.whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white/10 md:inline-flex"
          >
            {copy.whatsappCta}
          </a>
          <Link
            href="/brief"
            className="inline-flex rounded-full bg-accent-teal px-4 py-2.5 text-xs font-bold text-white shadow-premium-soft transition-transform active:scale-95 hover:bg-accent-teal/90 sm:px-5 sm:text-sm"
          >
            {copy.submitCta}
          </Link>
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white transition-colors hover:bg-white/10 lg:hidden"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? copy.menuCloseLabel : copy.menuOpenLabel}
          >
            {isMenuOpen ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3z"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path fill="currentColor" d="M4 7h16v2H4V7zm0 6h16v2H4v-2zm0 6h16v2H4v-2z" />
              </svg>
            )}
          </button>
        </div>

        {isMenuOpen ? (
          <div className="absolute left-4 right-4 top-full mt-3 rounded-[1.5rem] border border-white/15 bg-graphite/95 p-4 shadow-[0_24px_80px_rgba(10,16,22,0.45)] backdrop-blur-xl lg:hidden">
            <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 p-1">
              {LOCALE_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleLocaleChange(option)}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] transition-colors ${
                    locale === option ? "bg-white text-graphite" : "text-white/72 hover:text-white"
                  }`}
                  aria-pressed={locale === option}
                >
                  {option}
                </button>
              ))}
            </div>
            <nav className="flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="border-b border-white/10 py-3 text-sm font-bold text-white [text-shadow:0_1px_1px_rgba(0,0,0,0.35)] transition-colors last:border-b-0 hover:text-white/85"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={CONTACT.whatsappHref}
                target="_blank"
                rel="noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/[0.08] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-white/[0.12]"
              >
                {copy.whatsappCta}
              </a>
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
