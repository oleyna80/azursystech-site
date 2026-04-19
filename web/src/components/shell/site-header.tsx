"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "#business", label: "Для бизнеса" },
  { href: "/ai-automation", label: "Автоматизация и ИИ" },
  { href: "#pricing", label: "Цены" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Контакты" },
];

const CONTACT = {
  whatsappHref: "https://wa.me/33780720994",
};

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const navLinks = useMemo(() => {
    const prefix = pathname === "/" ? "" : "/";
    return NAV_LINKS.map((link) =>
      link.href.startsWith("#") ? { ...link, href: `${prefix}${link.href}` } : link
    );
  }, [pathname]);

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

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-graphite/80 backdrop-blur-xl">
      <div className="container relative mx-auto flex items-center justify-between gap-2 px-4 py-4 md:px-8 md:gap-3">
        <Link href="/" className="group flex items-center gap-2.5 md:gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-teal text-white transition-transform group-hover:scale-105">
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 2 3 7.5v9L12 22l9-5.5v-9L12 2zm0 2.2 6.9 4v7.6L12 19.8l-6.9-4V8.2l6.9-4z"
              />
            </svg>
          </span>
          <span className="text-lg font-extrabold tracking-tight text-white transition-colors group-hover:text-white/80 sm:text-xl md:text-2xl">
            AzurSysTech
          </span>
        </Link>

        <nav aria-label="Основная навигация" className="hidden items-center gap-7 text-sm font-bold text-white/90 [text-shadow:0_1px_1px_rgba(0,0,0,0.25)] lg:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={CONTACT.whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white/10 md:inline-flex"
          >
            WhatsApp
          </a>
          <Link
            href={pathname === "/" ? "#contact" : "/#contact"}
            className="inline-flex rounded-full bg-accent-teal px-4 py-2.5 text-xs font-bold text-white shadow-premium-soft transition-transform active:scale-95 hover:bg-accent-teal/90 sm:px-5 sm:text-sm"
          >
            Оставить заявку
          </Link>
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white transition-colors hover:bg-white/10 lg:hidden"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
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
                WhatsApp
              </a>
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
