import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/", label: "Главная" },
  { href: "/services", label: "Услуги" },
  { href: "/business", label: "Для бизнеса" },
  { href: "/home", label: "Для дома" },
  { href: "/pricing", label: "Цены" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Контакты" },
];

const LEGAL_LINKS = [
  { href: "/privacy", label: "Политика конфиденциальности" },
  { href: "/legal", label: "Правовая информация" },
];

const CONTACT = {
  phoneDisplay: "+33 7 49 70 54 65",
  phoneHref: "tel:+33749705465",
  whatsappDisplay: "+33 7 49 70 54 65",
  whatsappHref: "https://wa.me/33749705465",
  email: "contact@azursystech.fr",
};

export function SiteFooter() {
  return (
    <footer className="border-t border-[#D8D0C4] bg-[#F6F1E8]">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
        <section>
          <h2 className="text-base font-semibold text-[#1F2A37]">AzurSysTech</h2>
          <p className="mt-3 text-sm leading-6 text-[#1F2A37]/85">
            Локальная IT-помощь для малого бизнеса и частных клиентов в Nice и в зоне до 30 км.
          </p>
          <p className="mt-3 text-sm text-[#1F2A37]/85">Зона обслуживания: Nice + 30 км.</p>
          <div className="mt-4">
            <Link
              href="/contact"
              className="inline-block rounded-lg bg-[#1F6F78] px-4 py-2 text-sm font-semibold text-white hover:bg-[#185A61]"
            >
              Оставить заявку
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-[#1F2A37]/80">Навигация</h2>
          <ul className="mt-3 space-y-2">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-[#1F2A37]/85 hover:text-[#1F2A37]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-[#1F2A37]/80">Правовое</h2>
          <ul className="mt-3 space-y-2">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-[#1F2A37]/85 hover:text-[#1F2A37]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-[#1F2A37]/80">Связь</h2>
          <ul className="mt-3 space-y-2 text-sm text-[#1F2A37]/85">
            <li>
              <a className="hover:text-[#1F2A37]" href={CONTACT.phoneHref}>
                Телефон: {CONTACT.phoneDisplay}
              </a>
            </li>
            <li>
              <a className="hover:text-[#1F2A37]" href={CONTACT.whatsappHref}>
                WhatsApp: {CONTACT.whatsappDisplay}
              </a>
            </li>
            <li>
              <a className="hover:text-[#1F2A37]" href={`mailto:${CONTACT.email}`}>
                Email: {CONTACT.email}
              </a>
            </li>
          </ul>
        </section>
      </div>
    </footer>
  );
}
