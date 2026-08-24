import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortfolioSection } from "@/components/sections/portfolio-section";
import {
  getPortfolioProjects,
  resolvePortfolioLocale,
  type PortfolioLocale,
} from "@/lib/portfolio-data";

const BASE_URL = "https://azursystech.fr";
const SUPPORTED_LOCALES = ["fr", "ru", "en"] as const;

const COPY: Record<
  PortfolioLocale,
  {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    intro: string;
    learnMoreLabel: string;
  }
> = {
  fr: {
    metaTitle: "Portfolio — Sites web et automatisation | AzurSysTech",
    metaDescription:
      "Découvrez nos projets : sites web pour petites entreprises avec vidéo de présentation, fonctionnalités et automatisation des processus métier.",
    eyebrow: "Portfolio",
    title: "Nos réalisations web et automatisation",
    intro:
      "Chaque projet montre un métier, un type de site et les processus métier qu'il permet d'automatiser. Vidéo de présentation et détail des fonctionnalités sur chaque page.",
    learnMoreLabel: "En savoir plus",
  },
  ru: {
    metaTitle: "Портфолио — Сайты и автоматизация | AzurSysTech",
    metaDescription:
      "Наши проекты: сайты для малого бизнеса с видеообзорами, разбором функций и автоматизацией бизнес-процессов.",
    eyebrow: "Портфолио",
    title: "Наши проекты: сайты и автоматизация",
    intro:
      "Каждый проект показывает нишу, тип сайта и бизнес-процессы, которые он автоматизирует. На странице каждого проекта — видеообзор и разбор функций.",
    learnMoreLabel: "Подробнее",
  },
  en: {
    metaTitle: "Portfolio — Websites & Automation | AzurSysTech",
    metaDescription:
      "Explore our projects: websites for small businesses with video walkthroughs, feature breakdowns, and workflow automation.",
    eyebrow: "Portfolio",
    title: "Our Projects: Websites & Automation",
    intro:
      "Each project showcases an industry, website architecture, and the automated workflows it powers. Every page includes a video review and detailed feature breakdown.",
    learnMoreLabel: "Learn more",
  },
};

function canonicalPortfolioUrl(locale: PortfolioLocale) {
  return `${BASE_URL}/${locale}/portfolio`;
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!SUPPORTED_LOCALES.includes(locale as PortfolioLocale)) return {};

  const l = locale as PortfolioLocale;
  const copy = COPY[l];
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: {
      canonical: canonicalPortfolioUrl(l),
      languages: {
        fr: canonicalPortfolioUrl("fr"),
        ru: canonicalPortfolioUrl("ru"),
        en: canonicalPortfolioUrl("en"),
        "x-default": canonicalPortfolioUrl("fr"),
      },
    },
  };
}

export default async function PortfolioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!SUPPORTED_LOCALES.includes(locale as PortfolioLocale)) notFound();

  const l = resolvePortfolioLocale(locale);
  const copy = COPY[l];
  const projects = getPortfolioProjects(l);

  return (
    <main className="bg-[#081120] pt-16 md:pt-20">
      <PortfolioSection
        locale={l}
        eyebrow={copy.eyebrow}
        title={copy.title}
        intro={copy.intro}
        projects={projects}
        learnMoreLabel={copy.learnMoreLabel}
      />
    </main>
  );
}
