const FOOTER_LINKS = [
  { href: "#business", label: "Для бизнеса" },
  { href: "#automation", label: "Автоматизация и ИИ" },
  { href: "#how-it-works", label: "Как мы работаем" },
  { href: "#pricing", label: "Цены" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Контакты" },
];

const LEGAL_LINKS = [
  { href: "/privacy", label: "Политика конфиденциальности" },
  { href: "/legal", label: "Правовая информация" },
  { href: "/terms", label: "Условия оказания услуг" },
];

const CONTACT = {
  phoneDisplay: "+33 7 80 72 09 94",
  phoneHref: "tel:+33780720994",
  whatsappDisplay: "+33 7 80 72 09 94",
  whatsappHref: "https://wa.me/33780720994",
  email: "contact@azursystech.fr",
};

export function SiteFooter() {
  return (
    <footer className="bg-graphite py-16 text-white/66">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid gap-12 border-b border-white/10 pb-10 md:grid-cols-[0.9fr_1.1fr]">
          <div className="max-w-sm">
            <span className="mb-4 block text-2xl font-bold text-white">AzurSysTech</span>
            <p className="text-sm leading-7 text-white/72">
              Локальная техническая помощь для малого бизнеса в Ницце и рядом.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="grid gap-4">
              <h2 className="text-[12px] font-bold uppercase tracking-[0.18em] text-white/92">Навигация</h2>
              <div className="grid gap-3">
                {FOOTER_LINKS.map((link) => (
                  <a key={link.href} href={link.href} className="text-base font-semibold text-white/78 transition-colors hover:text-white">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
            <div className="grid gap-4">
              <h2 className="text-[12px] font-bold uppercase tracking-[0.18em] text-white/92">Документы</h2>
              <div className="grid gap-3">
                {LEGAL_LINKS.map((link) => (
                  <a key={link.href} href={link.href} className="text-base font-semibold text-white/78 transition-colors hover:text-white">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:col-span-2 lg:col-span-1">
              <h2 className="text-[12px] font-bold uppercase tracking-[0.18em] text-white/92">Контакты</h2>
              <div className="grid gap-3 text-base font-semibold text-white/82">
                <a href={CONTACT.phoneHref} className="transition-colors hover:text-white">
                  {CONTACT.phoneDisplay}
                </a>
                <a href={`mailto:${CONTACT.email}`} className="transition-colors hover:text-white">
                  {CONTACT.email}
                </a>
                <a href={CONTACT.whatsappHref} target="_blank" rel="noreferrer" className="transition-colors hover:text-white">
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 pt-8 text-sm font-medium text-white/58 md:flex-row md:items-center md:justify-between">
          <span>&copy; {new Date().getFullYear()} AzurSysTech</span>
          <span>Ницца и до 30 км вокруг</span>
        </div>
      </div>
    </footer>
  );
}
