import type { MetadataRoute } from "next";

const BASE_URL = "https://azursystech.fr";
const LAST_MODIFIED = new Date("2026-05-31");

type SitemapEntry = {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
};

const ROUTES: SitemapEntry[] = [
  { path: "/fr", changeFrequency: "monthly", priority: 1.0 },
  { path: "/ru", changeFrequency: "monthly", priority: 0.9 },
  { path: "/fr/ai-automation", changeFrequency: "monthly", priority: 0.8 },
  { path: "/ru/ai-automation", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/ai-automation", changeFrequency: "monthly", priority: 0.7 },
  { path: "/brief", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
  { path: "/data-deletion", changeFrequency: "yearly", priority: 0.3 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.5 },
  { path: "/legal", changeFrequency: "yearly", priority: 0.3 },
  { path: "/portfolio", changeFrequency: "monthly", priority: 0.8 },
  { path: "/portfolio/plomberie", changeFrequency: "monthly", priority: 0.7 },
  { path: "/portfolio/salon-beaute", changeFrequency: "monthly", priority: 0.7 },
  { path: "/portfolio/bistrot", changeFrequency: "monthly", priority: 0.7 },
  { path: "/portfolio/bijoux-artisanaux", changeFrequency: "monthly", priority: 0.7 },
  { path: "/portfolio/assurance", changeFrequency: "monthly", priority: 0.7 },
  { path: "/portfolio/comptabilite", changeFrequency: "monthly", priority: 0.7 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.7 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
