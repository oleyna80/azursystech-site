import type { MetadataRoute } from "next";

const BASE_URL = "https://azursystech.fr";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-05-13");
  return [
    {
      url: `${BASE_URL}/fr`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/ru`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/fr/ai-automation`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/ru/ai-automation`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
