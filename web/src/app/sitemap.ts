import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/portfolio-data";

const BASE_URL = "https://azursystech.fr";
const LOCALES = ["fr", "ru", "en"] as const;

type SitemapEntry = {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
};

const ROUTES: SitemapEntry[] = [
  { path: "/fr", changeFrequency: "monthly", priority: 1.0 },
  { path: "/ru", changeFrequency: "monthly", priority: 0.9 },
  { path: "/en", changeFrequency: "monthly", priority: 0.8 },
  { path: "/fr/ai-automation", changeFrequency: "monthly", priority: 0.8 },
  { path: "/ru/ai-automation", changeFrequency: "monthly", priority: 0.7 },
  { path: "/en/ai-automation", changeFrequency: "monthly", priority: 0.7 },
  { path: "/brief", changeFrequency: "monthly", priority: 0.7 },
  { path: "/data-deletion", changeFrequency: "yearly", priority: 0.3 },
  { path: "/legal", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
];

const PORTFOLIO_ROUTES: SitemapEntry[] = LOCALES.flatMap((locale) => [
  { path: `/${locale}/portfolio`, changeFrequency: "monthly", priority: 0.8 },
  ...getAllSlugs().map((slug) => ({
    path: `/${locale}/portfolio/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  })),
]);

export default function sitemap(): MetadataRoute.Sitemap {
  return [...ROUTES, ...PORTFOLIO_ROUTES].map((route) => ({
    url: `${BASE_URL}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
