import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { HomeContactSection } from "@/components/sections/home-contact";
import { PortfolioCard } from "@/components/portfolio/portfolio-card";
import { ShowcaseSection } from "@/components/sections/showcase";
import { PORTFOLIO_PROJECTS } from "@/lib/portfolio-data";
import { buildHomeJsonLd, HOME_CONTENT, type HomeLocale } from "./_home-data";

const SUPPORTED_LOCALES = ["fr", "ru", "en"] as const;
const BASE_URL = "https://azursystech.fr";

const META = {
  fr: {
    title: "Automatisation IA et sites web pour petites entreprises à Nice | AzurSysTech",
    description:
      "Sites web, formulaires intelligents et agents IA pour petites entreprises à Nice et dans les environs.",
  },
  ru: {
    title: "AI-автоматизация и сайты для малого бизнеса в Ницце | AzurSysTech",
    description:
      "Сайты, умные формы и AI-агенты для малого бизнеса в Ницце и соседних городах.",
  },
  en: {
    title: "AI automation and websites for small businesses in Nice | AzurSysTech",
    description: "Websites, smart intake forms and AI agents for small businesses in Nice and surrounding areas.",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l: HomeLocale = locale === "ru" || locale === "en" ? locale : "fr";
  return {
    ...META[l],
    alternates: {
      canonical: `${BASE_URL}/${l}`,
      languages: {
        fr: `${BASE_URL}/fr`,
        ru: `${BASE_URL}/ru`,
        en: `${BASE_URL}/en`,
        "x-default": `${BASE_URL}/fr`,
      },
    },
  };
}

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!SUPPORTED_LOCALES.includes(locale as HomeLocale)) notFound();
  const l = locale as HomeLocale;
  const copy = HOME_CONTENT[l];
  const projectHref = l === "fr" ? "/brief" : `/brief?locale=${l}`;

  return (
    <main className="bg-base text-graphite">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildHomeJsonLd(l)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: copy.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />

      {/* Hero */}
      <section className="relative isolate min-h-[100svh] overflow-hidden bg-graphite text-white">
        <img
          src="/hero.png"
          alt={copy.heroTitle}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,18,24,0.92)_0%,rgba(16,24,32,0.75)_45%,rgba(18,26,34,0.25)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_18%,rgba(255,255,255,0.16),transparent_58%)] opacity-70" />

        <div className="container relative z-10 mx-auto flex min-h-[100svh] flex-col justify-end px-4 pb-12 pt-24 md:px-8 md:pb-20 md:pt-36">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3.5 py-2 text-xs font-semibold tracking-[0.18em] text-white/85">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-accent-terra" aria-hidden="true">
                <path fill="currentColor" d="M12 2C8.1 2 5 5.2 5 9.1c0 4.8 6.2 12.1 6.4 12.4a.8.8 0 0 0 1.2 0c.2-.3 6.4-7.6 6.4-12.4C19 5.2 15.9 2 12 2zm0 10.1a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
              </svg>
              {copy.location}
            </div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-white/60">AzurSysTech</p>
            <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-white md:text-6xl md:leading-[0.98]">
              {copy.heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-lg font-medium leading-8 text-white/82">
              {copy.heroIntro}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href={projectHref}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-teal px-7 py-3.5 text-base font-bold text-white shadow-premium-soft transition-transform duration-200 hover:-translate-y-0.5 hover:bg-accent-teal/90 active:scale-95"
              >
                {copy.primaryCta}
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path fill="currentColor" d="M5 11h11.2l-4.6-4.6L13 5l7 7-7 7-1.4-1.4 4.6-4.6H5v-2z" />
                </svg>
              </Link>
              <Link
                href={`/${l}#services`}
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/8 px-7 py-3.5 text-base font-bold text-white transition-all duration-150 ease-out hover:bg-white/12 active:scale-[0.97]"
              >
                {copy.secondaryCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="bg-base py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-accent-teal/90">{copy.businessEyebrow}</p>
              <h2 className="max-w-3xl text-3xl font-extrabold tracking-tight text-graphite md:text-5xl md:leading-[1.02]">{copy.businessTitle}</h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-graphite/72">{copy.businessIntro}</p>
              <div className="mt-10 grid gap-8 border-t border-graphite/10 pt-8 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-graphite/55">{copy.workspaceTitle}</h3>
                  <ul className="space-y-4 text-base font-medium leading-7 text-graphite/80">
                    {copy.workspaceItems.map((item) => (
                      <li key={item} className="flex gap-3 transition duration-300 ease-out md:hover:-translate-y-0.5">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent-teal" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-graphite/55">{copy.networkTitle}</h3>
                  <ul className="space-y-4 text-base font-medium leading-7 text-graphite/80">
                    {copy.networkItems.map((item) => (
                      <li key={item} className="flex gap-3 transition duration-300 ease-out md:hover:-translate-y-0.5">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent-terra" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <Link href={projectHref} className="mt-10 inline-flex items-center gap-2 text-base font-bold text-accent-teal hover:text-graphite">
                {copy.businessCta}
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path fill="currentColor" d="M5 11h11.2l-4.6-4.6L13 5l7 7-7 7-1.4-1.4 4.6-4.6H5v-2z" />
                </svg>
              </Link>
            </div>
            <div className="overflow-hidden rounded-[2rem] bg-surface shadow-premium-soft ring-1 ring-graphite/5">
              <img src="/business.png" alt={copy.businessImageAlt} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Automation */}
      <section id="automation" className="bg-graphite py-20 text-white md:py-28">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-accent-teal/80">{copy.automationEyebrow}</p>
              <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight text-white md:text-5xl md:leading-[1.02]">{copy.automationTitle}</h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">{copy.automationIntro}</p>
              <div className="mt-10 space-y-6 border-t border-white/10 pt-8">
                {copy.automationPoints.map((point) => (
                  <div key={point.title} className="group flex gap-4 rounded-[1.5rem] px-2 py-2 transition duration-300 ease-out md:hover:-translate-y-1 md:hover:scale-[1.03]">
                    <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-accent-teal ring-1 ring-white/10 transition duration-300 ease-out group-hover:scale-110 group-hover:bg-accent-teal group-hover:text-white">
                      <span className="h-2.5 w-2.5 rounded-full bg-current" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{point.title}</h3>
                      <p className="mt-1 max-w-xl text-base leading-7 text-white/60">{point.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href={`/${locale}/ai-automation`}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-bold text-graphite shadow-premium-soft transition-transform duration-150 ease-out active:scale-[0.97] hover:bg-white/90"
                >
                  {copy.automationCta}
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                    <path fill="currentColor" d="M5 11h11.2l-4.6-4.6L13 5l7 7-7 7-1.4-1.4 4.6-4.6H5v-2z" />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 -z-10 translate-x-5 translate-y-5 rounded-[2.5rem] bg-accent-teal/15 blur-2xl" />
              <div className="overflow-hidden rounded-[2rem] bg-white/5 shadow-premium-soft ring-1 ring-white/10 backdrop-blur">
                <img src="/automation-illustration.svg" alt={copy.automationImageAlt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase */}
      <ShowcaseSection
        eyebrow={copy.showcaseEyebrow}
        title={copy.showcaseTitle}
        intro={copy.showcaseIntro}
        demos={copy.showcaseDemos}
      />

      {/* Portfolio teaser */}
      <section id="portfolio" className="border-t border-white/10 bg-[#081120] py-20 text-white md:py-28">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#4f8cff]">{copy.portfolioEyebrow}</p>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl md:leading-[1.02]">{copy.portfolioTitle}</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/68">{copy.portfolioIntro}</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {PORTFOLIO_PROJECTS.slice(0, 3).map((project) => (
              <PortfolioCard key={project.slug} project={project} />
            ))}
          </div>
          <div className="mt-10">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 rounded-full bg-[#4f8cff] px-7 py-3.5 text-base font-bold text-white shadow-premium-soft transition-transform duration-150 ease-out active:scale-[0.97] hover:bg-[#4f8cff]/90"
            >
              {copy.portfolioCta}
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path fill="currentColor" d="M5 11h11.2l-4.6-4.6L13 5l7 7-7 7-1.4-1.4 4.6-4.6H5v-2z" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-graphite py-20 text-white md:py-28">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-14 max-w-2xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-accent-teal/90">{copy.howEyebrow}</p>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl md:leading-[1.02]">{copy.howTitle}</h2>
          </div>
          <div className="grid gap-8 border-t border-white/10 pt-8 md:grid-cols-4">
            {copy.howSteps.map((step) => (
              <div key={step.step} className="border-l border-white/10 pl-5 md:pl-6">
                <div className="mb-5 text-xs font-bold tracking-[0.22em] text-accent-teal">{step.step}</div>
                <h3 className="mb-3 text-xl font-bold">{step.title}</h3>
                <p className="text-base font-medium leading-7 text-white/70">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-graphite/5 bg-surface py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="max-w-xl">
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-accent-terra/90">{copy.pricingEyebrow}</p>
              <h2 className="text-3xl font-extrabold tracking-tight text-graphite md:text-5xl md:leading-[1.02]">{copy.pricingTitle}</h2>
              <p className="mt-6 text-lg leading-8 text-graphite/72">{copy.pricingIntro}</p>
              <Link
                href={projectHref}
                className="mt-8 inline-flex rounded-full bg-graphite px-7 py-3.5 text-base font-bold text-white shadow-premium-soft transition-transform active:scale-95 hover:bg-graphite/90"
              >
                {copy.pricingCta}
              </Link>
              <div className="mt-8 border-t border-graphite/8 pt-5 text-sm font-medium leading-6 text-graphite/55">{copy.pricingNote}</div>
            </div>
            <div className="border-t border-graphite/10">
              {copy.pricingItems.map((item) => (
                <div key={item.title} className="grid gap-2 border-b border-graphite/10 py-7 md:grid-cols-[1fr_auto] md:items-center">
                  <span className="pr-4 text-lg font-bold text-graphite">{item.title}</span>
                  <span className="text-2xl font-extrabold text-accent-teal">{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-base py-20 md:py-28">
        <div className="container mx-auto max-w-3xl px-4 md:px-8">
          <div className="mb-12 text-center">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-accent-teal/90">{copy.faqEyebrow}</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-graphite md:text-4xl md:leading-[1.05]">{copy.faqTitle}</h2>
          </div>
          <div className="mb-10 space-y-4">
            {copy.faqs.map((faq) => (
              <details key={faq.q} className="group rounded-2xl border border-graphite/5 bg-surface shadow-premium-soft [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between rounded-2xl p-6 font-bold text-graphite outline-none transition duration-200 hover:bg-base/40 focus-visible:ring-2 focus-visible:ring-accent-teal focus-visible:ring-offset-2">
                  {faq.q}
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-graphite/50 transition-transform group-open:-rotate-180">
                    <path fill="currentColor" d="M12 15.4 6.3 9.7l1.4-1.4L12 12.6l4.3-4.3 1.4 1.4z" />
                  </svg>
                </summary>
                <div className="mt-2 border-t border-graphite/5 p-6 pt-0 text-graphite/70">{faq.a}</div>
              </details>
            ))}
          </div>
          <div className="flex justify-center">
            <a
              href={`/${l}#contact`}
              className="flex justify-center rounded-full bg-graphite px-6 py-3 text-center font-bold text-white shadow-premium-soft transition-transform active:scale-95 hover:bg-graphite/90"
            >
              {copy.faqCta}
            </a>
          </div>
        </div>
      </section>

      <HomeContactSection locale={l} />
    </main>
  );
}
