import { permanentRedirect } from "next/navigation";
import { resolvePortfolioLocale } from "@/lib/portfolio-data";

type PortfolioPageProps = {
  searchParams?: Promise<{ locale?: string | string[] }>;
};

export function legacyPortfolioIndexDestination(locale?: string | string[]) {
  const requestedLocale = Array.isArray(locale) ? locale[0] : locale;
  return `/${resolvePortfolioLocale(requestedLocale)}/portfolio`;
}

export default async function LegacyPortfolioPage({ searchParams }: PortfolioPageProps) {
  const search = await searchParams;
  permanentRedirect(legacyPortfolioIndexDestination(search?.locale));
}
