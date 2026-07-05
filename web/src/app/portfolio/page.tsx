import type { Metadata } from "next";
import { PortfolioSection } from "@/components/sections/portfolio-section";
import { PORTFOLIO_PROJECTS } from "@/lib/portfolio-data";

const BASE_URL = "https://azursystech.fr";

// Portfolio is French-only: hreflang signals no other language versions exist.
export const metadata: Metadata = {
  title: "Portfolio — Sites web et automatisation | AzurSysTech",
  description:
    "Découvrez nos projets : sites web pour petites entreprises avec vidéo de présentation, fonctionnalités et automatisation des processus métier.",
  alternates: {
    canonical: `${BASE_URL}/portfolio`,
    languages: {
      fr: `${BASE_URL}/portfolio`,
      "x-default": `${BASE_URL}/portfolio`,
    },
  },
};

export default function PortfolioPage() {
  return (
    <main className="bg-[#081120] pt-16 md:pt-20">
      <PortfolioSection
        eyebrow="Portfolio"
        title="Nos réalisations web et automatisation"
        intro="Chaque projet montre un métier, un type de site et les processus métier qu'il permet d'automatiser. Vidéo de présentation et détail des fonctionnalités sur chaque page."
        projects={PORTFOLIO_PROJECTS}
      />
    </main>
  );
}
