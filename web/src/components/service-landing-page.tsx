import Link from "next/link";

type ServiceLandingFaqItem = {
  question: string;
  answer: string;
};

type ServiceLandingPageProps = {
  routeLabel: string;
  title: string;
  subtitle: string;
  audience: string[];
  situations: string[];
  helpItems: string[];
  whyItems: string[];
  pricingItems: string[];
  pricingNote: string;
  faq: ServiceLandingFaqItem[];
  ctaPrimaryLabel: string;
  ctaSecondaryLabel: string;
};

export function ServiceLandingPage({
  routeLabel,
  title,
  subtitle,
  audience,
  situations,
  helpItems,
  whyItems,
  pricingItems,
  pricingNote,
  faq,
  ctaPrimaryLabel,
  ctaSecondaryLabel,
}: ServiceLandingPageProps) {
  return (
    <main className="bg-[#F6F1E8] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1F6F78]">{routeLabel}</p>
          <h1 className="mt-4 max-w-4xl font-serif text-3xl text-[#1F2A37] sm:text-4xl">{title}</h1>
          <p className="mt-4 max-w-4xl text-base leading-7 text-[#1F2A37]/90">{subtitle}</p>
          <p className="mt-4 text-sm text-[#1F2A37]/75">Выезд и поддержка в Nice и в зоне до 30 км.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-lg bg-[#1F6F78] px-5 py-3 text-sm font-semibold text-white hover:bg-[#185A61]"
            >
              {ctaPrimaryLabel}
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-5 py-3 text-sm font-semibold text-[#1F2A37] hover:bg-[#F6F1E8]"
            >
              {ctaSecondaryLabel}
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">Для кого эта услуга</h2>
          <ul className="mt-5 grid gap-3 text-[#1F2A37]/90 sm:grid-cols-2">
            {audience.map((item) => (
              <li key={item} className="rounded-lg border border-[#D8D0C4] p-4">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">Типичные ситуации</h2>
          <ul className="mt-5 grid gap-3 text-[#1F2A37]/90 sm:grid-cols-2">
            {situations.map((item) => (
              <li key={item} className="rounded-lg border border-[#D8D0C4] p-4">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">С чем помогает AzurSysTech</h2>
          <ul className="mt-5 grid gap-3 text-[#1F2A37]/90 sm:grid-cols-2">
            {helpItems.map((item) => (
              <li key={item} className="rounded-lg border border-[#D8D0C4] p-4">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">Почему такой формат удобен</h2>
          <ul className="mt-5 grid gap-3 text-[#1F2A37]/90 sm:grid-cols-2">
            {whyItems.map((item) => (
              <li key={item} className="rounded-lg border border-[#D8D0C4] p-4">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">Цены и формат оценки</h2>
          <ul className="mt-5 grid gap-3 text-[#1F2A37]/90">
            {pricingItems.map((item) => (
              <li key={item} className="rounded-lg border border-[#D8D0C4] p-4">
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-[#1F2A37]/75">{pricingNote}</p>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">Короткий FAQ</h2>
          <div className="mt-5 grid gap-4">
            {faq.map((item) => (
              <article key={item.question} className="rounded-xl border border-[#D8D0C4] p-5">
                <h3 className="font-semibold text-[#1F2A37]">{item.question}</h3>
                <p className="mt-2 text-sm leading-6 text-[#1F2A37]/90">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#D8D0C4] bg-[#FFFDFC] p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F2A37]">Следующий шаг</h2>
          <p className="mt-3 max-w-4xl text-[#1F2A37]/90">
            Опишите задачу на странице контактов. Это помогает быстро определить формат работ без
            лишних обещаний и перегруженных технических деталей.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-lg bg-[#1F6F78] px-5 py-3 text-sm font-semibold text-white hover:bg-[#185A61]"
            >
              {ctaPrimaryLabel}
            </Link>
            <Link
              href="/services"
              className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] px-5 py-3 text-sm font-semibold text-[#1F2A37] hover:bg-[#F6F1E8]"
            >
              Вернуться ко всем услугам
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
