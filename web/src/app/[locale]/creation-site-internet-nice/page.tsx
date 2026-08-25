import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createElement } from "react";

import { CONTENT, type CreationSiteContent, type PageLocale } from "./_creation-site-data";

export { CONTENT, type PageLocale } from "./_creation-site-data";

const BASE_URL = "https://azursystech.fr";
const SUPPORTED_LOCALES = ["fr", "ru", "en"] as const;

function isPageLocale(locale: string): locale is PageLocale {
  return SUPPORTED_LOCALES.includes(locale as PageLocale);
}

export function buildBriefHref(locale: PageLocale) {
  return locale === "fr" ? "/brief" : `/brief?locale=${locale}`;
}

export function buildPageLinks(locale: PageLocale, copy: CreationSiteContent) {
  return [
    { href: `/${locale}/portfolio`, label: copy.portfolioTitle },
    ...copy.portfolioLinks.map((project) => ({
      href: `/${locale}/portfolio/${project.slug}`,
      label: project.title,
    })),
    { href: `/${locale}/ai-automation`, label: copy.automationCta },
    { href: `/${locale}/guides/automatiser-demandes-clients`, label: copy.guideCta },
    { href: buildBriefHref(locale), label: copy.finalCta },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l: PageLocale = isPageLocale(locale) ? locale : "fr";
  return {
    ...CONTENT[l].meta,
    alternates: {
      canonical: `${BASE_URL}/${l}/creation-site-internet-nice`,
      languages: {
        fr: `${BASE_URL}/fr/creation-site-internet-nice`,
        ru: `${BASE_URL}/ru/creation-site-internet-nice`,
        en: `${BASE_URL}/en/creation-site-internet-nice`,
        "x-default": `${BASE_URL}/fr/creation-site-internet-nice`,
      },
    },
  };
}

export function buildJsonLd(locale: PageLocale, copy: CreationSiteContent) {
  const canonical = `${BASE_URL}/${locale}/creation-site-internet-nice`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": canonical,
        url: canonical,
        name: copy.h1,
        description: copy.intro,
        inLanguage: locale,
        isPartOf: { "@id": BASE_URL },
      },
      {
        "@type": "Service",
        "@id": `${canonical}#service`,
        name: copy.h1,
        serviceType: copy.eyebrow,
        description: copy.intro,
        provider: { "@type": "Organization", name: "AzurSysTech", url: BASE_URL },
        areaServed: copy.areaText,
        url: canonical,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "AzurSysTech",
            item: `${BASE_URL}/${locale}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: copy.breadcrumbLabel,
            item: canonical,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: copy.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
    ],
  };
}

function SectionLabel({ children, dark = false }: { children: string; dark?: boolean }) {
  return (
    <p className={`mb-4 text-sm font-bold uppercase tracking-[0.18em] ${dark ? "text-accent-teal/80" : "text-accent-teal/90"}`}>
      {children}
    </p>
  );
}

function LinkArrow() {
  return <span aria-hidden="true" className="text-accent-teal transition-transform group-hover:translate-x-1">→</span>;
}

function GuideLink({ locale, label }: { locale: PageLocale; label: string }) {
  return createElement(Link, {
    href: `/${locale}/guides/automatiser-demandes-clients`,
    className: "group mt-4 inline-flex items-center gap-2 text-base font-bold text-accent-teal",
  }, `${label} →`);
}

export default async function CreationSiteInternetNicePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isPageLocale(locale)) notFound();
  const copy = CONTENT[locale];
  const pageLinks = buildPageLinks(locale, copy);

  return (
    <main className="bg-base text-graphite">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(locale, copy)) }} />

      <section className="relative isolate overflow-hidden bg-graphite text-white">
        <img src="/business.png" alt={copy.h1} loading="eager" fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(12,18,24,0.98)_0%,rgba(16,24,32,0.86)_55%,rgba(18,26,34,0.58)_100%)]" />
        <div className="container relative z-10 mx-auto px-4 pb-20 pt-32 md:px-8 md:pb-28 md:pt-44">
          <nav aria-label="Breadcrumb" className="mb-12 text-sm font-semibold text-white/60">
            <Link href={`/${locale}`} className="transition-colors hover:text-white">AzurSysTech</Link>
            <span className="mx-2 text-white/35">/</span>
            <span className="text-white/85">{copy.breadcrumbLabel}</span>
          </nav>
          <div className="max-w-4xl">
            <SectionLabel dark>{copy.eyebrow}</SectionLabel>
            <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-white md:text-6xl md:leading-[1.02]">{copy.h1}</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/78 md:text-xl">{copy.intro}</p>
            <Link href={buildBriefHref(locale)} className="mt-9 inline-flex items-center gap-2 rounded-full bg-accent-teal px-7 py-3.5 text-base font-bold text-white shadow-premium-soft transition-transform hover:-translate-y-0.5 hover:bg-accent-teal/90 active:scale-95">
              {copy.primaryCta} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-base py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <SectionLabel>{copy.typesTitle}</SectionLabel>
              <h2 className="max-w-xl text-3xl font-extrabold tracking-tight md:text-5xl md:leading-[1.04]">{copy.typesIntro}</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {copy.types.map((item) => (
                <article key={item.title} className="border-t border-graphite/15 pt-5">
                  <h3 className="text-xl font-extrabold">{item.title}</h3>
                  <p className="mt-3 text-base leading-7 text-graphite/70">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-8">
          <SectionLabel>{copy.functionsTitle}</SectionLabel>
          <div className="grid gap-8 md:grid-cols-3">
            {copy.functions.map((item, index) => (
              <article key={item.title} className="border-t border-graphite/15 pt-5">
                <span className="text-sm font-bold tracking-[0.18em] text-accent-terra">0{index + 1}</span>
                <h2 className="mt-5 text-2xl font-extrabold">{item.title}</h2>
                <p className="mt-3 text-base leading-7 text-graphite/70">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-graphite py-20 text-white md:py-28" id="intake">
        <div className="container mx-auto grid gap-12 px-4 md:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionLabel dark>{copy.intakeTitle}</SectionLabel>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl md:leading-[1.04]">{copy.intakeIntro}</h2>
          </div>
          <ul className="grid gap-5 text-lg leading-8 text-white/78">
            {copy.intakePoints.map((item) => <li key={item} className="border-b border-white/10 pb-5">{item}</li>)}
          </ul>
        </div>
      </section>

      <section className="bg-base py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-8">
          <SectionLabel>{copy.audienceTitle}</SectionLabel>
          <p className="max-w-2xl text-lg leading-8 text-graphite/70">{copy.audienceIntro}</p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {copy.audiences.map((item) => (
              <article key={item.title} className="border-l-2 border-accent-teal pl-5">
                <h2 className="text-2xl font-extrabold">{item.title}</h2>
                <p className="mt-2 text-base leading-7 text-graphite/70">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-20 md:py-28" id="portfolio">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <SectionLabel>{copy.portfolioTitle}</SectionLabel>
              <h2 className="max-w-3xl text-3xl font-extrabold tracking-tight md:text-5xl md:leading-[1.04]">{copy.portfolioIntro}</h2>
            </div>
            <Link href={`/${locale}/portfolio`} className="group inline-flex shrink-0 items-center gap-2 text-base font-bold text-accent-teal hover:text-graphite">{copy.portfolioTitle} <LinkArrow /></Link>
          </div>
          <div className="mt-12 grid gap-x-8 gap-y-9 md:grid-cols-2 lg:grid-cols-3">
            {pageLinks.slice(1, 7).map((item, index) => {
              const project = copy.portfolioLinks[index];
              return (
                <Link key={item.href} href={item.href} className="group border-t border-graphite/15 pt-5">
                  <span className="text-sm font-bold tracking-[0.18em] text-accent-terra">0{index + 1}</span>
                  <h3 className="mt-4 text-2xl font-extrabold">{item.label}</h3>
                  <p className="mt-2 text-base leading-7 text-graphite/70">{project.description}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-accent-teal">{copy.portfolioTitle} <LinkArrow /></span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-base py-20 md:py-28" id="process">
        <div className="container mx-auto px-4 md:px-8">
          <SectionLabel>{copy.processTitle}</SectionLabel>
          <div className="grid gap-8 md:grid-cols-4">
            {copy.process.map((step) => (
              <article key={step.number} className="border-t border-graphite/15 pt-5">
                <span className="text-sm font-bold tracking-[0.18em] text-accent-terra">{step.number}</span>
                <h2 className="mt-5 text-xl font-extrabold">{step.title}</h2>
                <p className="mt-3 text-base leading-7 text-graphite/70">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-20 md:py-28" id="pricing">
        <div className="container mx-auto grid gap-12 px-4 md:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionLabel>{copy.pricingTitle}</SectionLabel>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl md:leading-[1.04]">{copy.pricingIntro}</h2>
            <p className="mt-6 text-base leading-7 text-graphite/65">{copy.pricingNote}</p>
          </div>
          <div className="divide-y divide-graphite/15 border-y border-graphite/15">
            {copy.pricing.map((item) => (
              <div key={item.title} className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-lg font-semibold">{item.title}</span>
                <span className="shrink-0 text-lg font-extrabold text-accent-teal">{item.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-graphite py-20 text-white md:py-28" id="automation">
        <div className="container mx-auto grid gap-12 px-4 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <SectionLabel dark>{copy.automationTitle}</SectionLabel>
            <h2 className="max-w-3xl text-3xl font-extrabold tracking-tight md:text-5xl md:leading-[1.04]">{copy.automationIntro}</h2>
          </div>
          <div>
            <ul className="space-y-4 text-base leading-7 text-white/75">
              {copy.automationPoints.map((item) => <li key={item} className="border-b border-white/10 pb-4">{item}</li>)}
            </ul>
            <Link href={`/${locale}/ai-automation`} className="group mt-8 inline-flex items-center gap-2 text-base font-bold text-accent-teal">{copy.automationCta} <LinkArrow /></Link>
            {createElement(GuideLink, { locale, label: copy.guideCta })}
          </div>
        </div>
      </section>

      <section className="bg-base py-20 md:py-28" id="area">
        <div className="container mx-auto grid gap-10 px-4 md:px-8 md:grid-cols-[0.6fr_1.4fr]">
          <SectionLabel>{copy.areaTitle}</SectionLabel>
          <p className="max-w-3xl text-2xl font-semibold leading-10 text-graphite/78 md:text-4xl md:leading-[1.18]">{copy.areaText}</p>
        </div>
      </section>

      <section className="bg-surface py-20 md:py-28" id="faq">
        <div className="container mx-auto grid gap-12 px-4 md:px-8 lg:grid-cols-[0.7fr_1.3fr]">
          <SectionLabel>{copy.faqTitle}</SectionLabel>
          <div className="divide-y divide-graphite/15 border-y border-graphite/15">
            {copy.faqs.map((faq) => (
              <details key={faq.q} className="group py-5">
                <summary className="cursor-pointer list-none pr-8 text-lg font-bold marker:hidden">{faq.q}</summary>
                <p className="mt-3 max-w-2xl text-base leading-7 text-graphite/70">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-accent-teal py-20 text-white md:py-24" id="contact">
        <div className="container mx-auto flex flex-col justify-between gap-8 px-4 md:px-8 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl md:leading-[1.04]">{copy.finalTitle}</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/82">{copy.finalIntro}</p>
          </div>
          <Link href={buildBriefHref(locale)} className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-7 py-3.5 text-base font-bold text-graphite transition-transform hover:-translate-y-0.5 active:scale-95">{copy.finalCta} <span aria-hidden="true" className="ml-2">→</span></Link>
        </div>
      </section>
    </main>
  );
}
