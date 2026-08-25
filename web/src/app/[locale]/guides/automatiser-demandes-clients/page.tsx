import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CONTENT, type GuideContent, type PageLocale } from "./_guide-data";

export { CONTENT, type PageLocale } from "./_guide-data";

const BASE_URL = "https://azursystech.fr";
const GUIDE_PATH = "/guides/automatiser-demandes-clients";
const SUPPORTED_LOCALES = ["fr", "ru", "en"] as const;

function isPageLocale(locale: string): locale is PageLocale {
  return SUPPORTED_LOCALES.includes(locale as PageLocale);
}

export function buildBriefHref(locale: PageLocale) {
  return locale === "fr" ? "/brief" : `/brief?locale=${locale}`;
}

export function buildPageLinks(locale: PageLocale, copy: GuideContent) {
  return [
    { href: `/${locale}/creation-site-internet-nice`, label: copy.niceCta },
    { href: `/${locale}/ai-automation`, label: copy.aiCta },
    { href: `/${locale}/portfolio`, label: copy.portfolioCta },
    ...copy.portfolioLinks.map((project) => ({
      href: `/${locale}/portfolio/${project.slug}`,
      label: project.title,
    })),
    { href: buildBriefHref(locale), label: copy.briefCta },
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
      canonical: `${BASE_URL}/${l}${GUIDE_PATH}`,
      languages: {
        fr: `${BASE_URL}/fr${GUIDE_PATH}`,
        ru: `${BASE_URL}/ru${GUIDE_PATH}`,
        en: `${BASE_URL}/en${GUIDE_PATH}`,
        "x-default": `${BASE_URL}/fr${GUIDE_PATH}`,
      },
    },
  };
}

export function buildJsonLd(locale: PageLocale, copy: GuideContent) {
  const canonical = `${BASE_URL}/${locale}${GUIDE_PATH}`;
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
        "@type": "Article",
        "@id": `${canonical}#article`,
        mainEntityOfPage: { "@id": canonical },
        headline: copy.h1,
        description: copy.intro,
        inLanguage: locale,
        author: { "@type": "Organization", name: "AzurSysTech", url: BASE_URL },
        publisher: { "@type": "Organization", name: "AzurSysTech", url: BASE_URL },
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

function GuideList({ items, dark = false }: { items: string[]; dark?: boolean }) {
  return (
    <ul className={`grid gap-4 text-base leading-7 ${dark ? "text-white/78" : "text-graphite/72"}`}>
      {items.map((item) => (
        <li key={item} className="border-b border-current/15 pb-4">{item}</li>
      ))}
    </ul>
  );
}

export default async function AutomatiserDemandesClientsGuidePage({
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

      <section className="bg-graphite text-white">
        <div className="container mx-auto px-4 pb-20 pt-32 md:px-8 md:pb-28 md:pt-44">
          <nav aria-label="Breadcrumb" className="mb-12 text-sm font-semibold text-white/60">
            <Link href={`/${locale}`} className="transition-colors hover:text-white">AzurSysTech</Link>
            <span className="mx-2 text-white/35">/</span>
            <span className="text-white/85">{copy.breadcrumbLabel}</span>
          </nav>
          <div className="max-w-4xl">
            <SectionLabel dark>{copy.eyebrow}</SectionLabel>
            <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight md:text-6xl md:leading-[1.02]">{copy.h1}</h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-white/78 md:text-xl">{copy.intro}</p>
          </div>
        </div>
      </section>

      <section id="en-bref" className="bg-accent-teal py-14 text-white md:py-20">
        <div className="container mx-auto px-4 md:px-8">
          <SectionLabel dark>{copy.briefLabel}</SectionLabel>
          <p className="max-w-4xl text-2xl font-semibold leading-10 md:text-4xl md:leading-[1.18]">{copy.briefText}</p>
        </div>
      </section>

      <section className="bg-base py-20 md:py-28">
        <div className="container mx-auto grid gap-10 px-4 md:grid-cols-[0.7fr_1.3fr] md:px-8">
          <SectionLabel>{copy.fragmentationTitle}</SectionLabel>
          <div className="max-w-3xl space-y-5 text-lg leading-8 text-graphite/72">
            {copy.fragmentationParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </div>
      </section>

      <section className="bg-surface py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-8">
          <SectionLabel>{copy.mapTitle}</SectionLabel>
          <p className="max-w-2xl text-lg leading-8 text-graphite/70">{copy.mapIntro}</p>
          <div className="mt-12 grid gap-7 md:grid-cols-4">
            {copy.mapSteps.map((item, index) => (
              <article key={item.title} className="border-t border-graphite/15 pt-5">
                <span className="text-sm font-bold tracking-[0.18em] text-accent-terra">0{index + 1}</span>
                <h2 className="mt-4 text-2xl font-extrabold">{item.title}</h2>
                <p className="mt-3 text-base leading-7 text-graphite/70">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-graphite py-20 text-white md:py-28">
        <div className="container mx-auto px-4 md:px-8">
          <SectionLabel dark>{copy.workflowTitle}</SectionLabel>
          <p className="max-w-2xl text-lg leading-8 text-white/72">{copy.workflowIntro}</p>
          <div className="mt-12 grid gap-7 md:grid-cols-3">
            {copy.workflowSteps.map((item) => (
              <article key={item.title} className="border-t border-white/15 pt-5">
                <h2 className="text-2xl font-extrabold">{item.title}</h2>
                <p className="mt-3 text-base leading-7 text-white/72">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-base py-20 md:py-28">
        <div className="container mx-auto grid gap-12 px-4 md:grid-cols-2 md:px-8">
          <div>
            <SectionLabel>{copy.noAiTitle}</SectionLabel>
            <h2 className="max-w-xl text-3xl font-extrabold tracking-tight md:text-5xl md:leading-[1.04]">{copy.noAiIntro}</h2>
          </div>
          <GuideList items={copy.noAiPoints} />
        </div>
      </section>

      <section className="bg-surface py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-8">
          <SectionLabel>{copy.aiTitle}</SectionLabel>
          <p className="max-w-3xl text-lg leading-8 text-graphite/70">{copy.aiIntro}</p>
          <div className="mt-12 grid gap-7 md:grid-cols-2">
            {copy.aiUses.map((item) => (
              <article key={item.title} className="border-l-2 border-accent-teal pl-5">
                <h2 className="text-2xl font-extrabold">{item.title}</h2>
                <p className="mt-3 text-base leading-7 text-graphite/70">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-base py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-8">
          <SectionLabel>{copy.exampleTitle}</SectionLabel>
          <p className="max-w-3xl text-lg leading-8 text-graphite/70">{copy.exampleIntro}</p>
          <div className="mt-12 grid gap-7 md:grid-cols-4">
            {copy.exampleSteps.map((item, index) => (
              <article key={item.title} className="border-t border-graphite/15 pt-5">
                <span className="text-sm font-bold tracking-[0.18em] text-accent-terra">0{index + 1}</span>
                <h2 className="mt-4 text-xl font-extrabold">{item.title}</h2>
                <p className="mt-3 text-base leading-7 text-graphite/70">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-graphite py-20 text-white md:py-28">
        <div className="container mx-auto grid gap-12 px-4 md:px-8 md:grid-cols-[0.7fr_1.3fr]">
          <div>
            <SectionLabel dark>{copy.humanTitle}</SectionLabel>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl md:leading-[1.04]">{copy.humanIntro}</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {copy.humanBoundaries.map((item) => (
              <article key={item.title} className="border-t border-white/15 pt-5">
                <h2 className="text-xl font-extrabold">{item.title}</h2>
                <p className="mt-3 text-base leading-7 text-white/72">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-20 md:py-28">
        <div className="container mx-auto grid gap-12 px-4 md:grid-cols-[0.8fr_1.2fr] md:px-8">
          <div>
            <SectionLabel>{copy.privacyTitle}</SectionLabel>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl md:leading-[1.04]">{copy.privacyIntro}</h2>
          </div>
          <GuideList items={copy.privacyPoints} />
        </div>
      </section>

      <section className="bg-base py-20 md:py-28">
        <div className="container mx-auto grid gap-12 px-4 md:grid-cols-[0.7fr_1.3fr] md:px-8">
          <div>
            <SectionLabel>{copy.readinessTitle}</SectionLabel>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl md:leading-[1.04]">{copy.readinessIntro}</h2>
          </div>
          <GuideList items={copy.readinessItems} />
        </div>
      </section>

      <section className="bg-accent-teal py-20 text-white md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <SectionLabel dark>{copy.recommendationTitle}</SectionLabel>
          <p className="max-w-4xl text-2xl font-semibold leading-10 md:text-4xl md:leading-[1.18]">{copy.recommendationText}</p>
        </div>
      </section>

      <section className="bg-surface py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <SectionLabel>{copy.portfolioTitle}</SectionLabel>
              <h2 className="max-w-3xl text-3xl font-extrabold tracking-tight md:text-5xl md:leading-[1.04]">{copy.portfolioIntro}</h2>
            </div>
            <Link href={pageLinks[2].href} className="inline-flex shrink-0 items-center gap-2 text-base font-bold text-accent-teal">{copy.portfolioCta} <span aria-hidden="true">→</span></Link>
          </div>
          <div className="mt-12 grid gap-x-8 gap-y-9 md:grid-cols-2 lg:grid-cols-3">
            {copy.portfolioLinks.map((project) => (
              <Link key={project.slug} href={`/${locale}/portfolio/${project.slug}`} className="group border-t border-graphite/15 pt-5">
                <h3 className="text-2xl font-extrabold">{project.title}</h3>
                <p className="mt-3 text-base leading-7 text-graphite/70">{project.description}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-accent-teal">{copy.portfolioCta} <span aria-hidden="true">→</span></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-base py-20 md:py-28" id="faq">
        <div className="container mx-auto grid gap-12 px-4 md:grid-cols-[0.7fr_1.3fr] md:px-8">
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

      <section className="bg-graphite py-20 text-white md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl md:leading-[1.04]">{copy.finalTitle}</h2>
            <p className="mt-5 text-lg leading-8 text-white/75">{copy.finalText}</p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              <Link href={pageLinks[0].href} className="font-bold text-accent-teal">{copy.niceCta} →</Link>
              <Link href={pageLinks[1].href} className="font-bold text-accent-teal">{copy.aiCta} →</Link>
              <Link href={pageLinks[pageLinks.length - 1].href} className="font-bold text-accent-teal">{copy.briefCta} →</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
