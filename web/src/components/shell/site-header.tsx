import Link from "next/link";

import { OpenChatButton } from "@/components/open-chat-button";

const NAV_LINKS = [
  { href: "/", label: "Главная" },
  { href: "/services", label: "Услуги" },
  { href: "/business", label: "Для бизнеса" },
  { href: "/home", label: "Для дома" },
  { href: "/pricing", label: "Цены" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Контакты" },
];

const CONTACT = {
  whatsappDisplay: "+33 7 49 70 54 65",
  whatsappHref: "https://wa.me/33749705465",
};

export function SiteHeader() {
  return (
    <header className="border-b border-[#D8D0C4] bg-[#FFFDFC]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <Link href="/" className="text-lg font-semibold text-[#1F2A37]">
            AzurSysTech
          </Link>
          <p className="text-xs text-[#1F2A37]/70">IT-помощь в Nice и рядом</p>
        </div>

        <nav aria-label="Основная навигация" className="hidden items-center gap-5 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-[#1F2A37]/85 hover:text-[#1F2A37]">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={CONTACT.whatsappHref}
            className="hidden rounded-lg border border-[#C96F4A] bg-[#FFF3EE] px-3 py-2 text-sm font-semibold text-[#8A4A2F] hover:bg-[#FBE8DF] sm:inline-block"
          >
            WhatsApp
          </a>
          <OpenChatButton className="hidden rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2 text-sm font-semibold text-[#1F2A37] hover:bg-[#F6F1E8] sm:inline-block">
            Открыть чат
          </OpenChatButton>
          <Link
            href="/contact"
            className="rounded-lg bg-[#1F6F78] px-4 py-2 text-sm font-semibold text-white hover:bg-[#185A61]"
          >
            Оставить заявку
          </Link>
        </div>
      </div>

      <div className="border-t border-[#D8D0C4] bg-[#FFFDFC] lg:hidden">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap gap-x-4 gap-y-2 px-4 py-3 sm:px-6 lg:px-8">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-[#1F2A37]/85 hover:text-[#1F2A37]">
              {link.label}
            </Link>
          ))}
          <a href={CONTACT.whatsappHref} className="text-sm font-medium text-[#8A4A2F] underline">
            WhatsApp: {CONTACT.whatsappDisplay}
          </a>
          <OpenChatButton className="text-sm font-medium text-[#1F2A37]/85 underline">
            Открыть чат
          </OpenChatButton>
        </div>
      </div>
    </header>
  );
}
