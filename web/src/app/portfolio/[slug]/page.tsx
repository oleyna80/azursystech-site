import { permanentRedirect } from "next/navigation";
import { resolvePortfolioLocale } from "@/lib/portfolio-data";

type PortfolioProjectPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ locale?: string | string[] }>;
};

export function legacyPortfolioProjectDestination(slug: string, locale?: string | string[]) {
  const requestedLocale = Array.isArray(locale) ? locale[0] : locale;
  return `/${resolvePortfolioLocale(requestedLocale)}/portfolio/${slug}`;
}

export default async function LegacyPortfolioProjectPage({
  params,
  searchParams,
}: PortfolioProjectPageProps) {
  const [{ slug }, search] = await Promise.all([params, searchParams]);
  permanentRedirect(legacyPortfolioProjectDestination(slug, search?.locale));
}
