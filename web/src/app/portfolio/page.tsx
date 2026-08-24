import type { Metadata } from "next";
import { cookies } from "next/headers";
import { PortfolioSection } from "@/components/sections/portfolio-section";
import {
  getPortfolioProjects,
  resolvePortfolioLocale,
  type PortfolioLocale,
} from "@/lib/portfolio-data";
import { LOCALE_COOKIE_KEY } from "@/i18n";

const BASE_URL = "https://azursystech.fr";

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

type PortfolioPageProps = {
  searchParams?: Promise<{ locale?: string }>;
};

export async function generateMetadata(props: PortfolioPageProps): Promise<Metadata> {
  const cookieStore = await cookies();
  const searchParams = await props.searchParams;
  const locale = resolvePortfolioLocale(
    searchParams?.locale || cookieStore.get(LOCALE_COOKIE_KEY)?.value,
  );
  const copy = COPY[locale];

  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: {
      canonical: `${BASE_URL}/portfolio`,
      languages: {
        fr: `${BASE_URL}/portfolio`,
        ru: `${BASE_URL}/portfolio?locale=ru`,
        en: `${BASE_URL}/portfolio?locale=en`,
        "x-default": `${BASE_URL}/portfolio`,
      },
    },
  };
}

export default async function PortfolioPage(props: PortfolioPageProps) {
  const cookieStore = await cookies();
  const searchParams = await props.searchParams;
  const locale = resolvePortfolioLocale(
    searchParams?.locale || cookieStore.get(LOCALE_COOKIE_KEY)?.value,
  );
  const copy = COPY[locale];
  const projects = getPortfolioProjects(locale);

  return (
    <main className="bg-[#081120] pt-16 md:pt-20">
      <PortfolioSection
        eyebrow={copy.eyebrow}
        title={copy.title}
        intro={copy.intro}
        projects={projects}
        learnMoreLabel={copy.learnMoreLabel}
      />
    </main>
  );
}
