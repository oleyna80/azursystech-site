import { describe, expect, it } from "vitest";

import sitemap from "@/app/sitemap";

describe("sitemap", () => {
  it("includes public page routes and excludes operational endpoints", () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).toEqual(
      expect.arrayContaining([
        "https://azursystech.fr/fr",
        "https://azursystech.fr/ru",
        "https://azursystech.fr/en",
        "https://azursystech.fr/fr/ai-automation",
        "https://azursystech.fr/ru/ai-automation",
        "https://azursystech.fr/en/ai-automation",
        "https://azursystech.fr/ai-automation",
        "https://azursystech.fr/brief",
        "https://azursystech.fr/contact",
        "https://azursystech.fr/data-deletion",
        "https://azursystech.fr/legal",
        "https://azursystech.fr/portfolio",
        "https://azursystech.fr/portfolio/plomberie",
        "https://azursystech.fr/portfolio/salon-beaute",
        "https://azursystech.fr/portfolio/bistrot",
        "https://azursystech.fr/portfolio/bijoux-artisanaux",
        "https://azursystech.fr/portfolio/assurance",
        "https://azursystech.fr/portfolio/comptabilite",
        "https://azursystech.fr/privacy",
        "https://azursystech.fr/terms",
      ]),
    );
    expect(urls).not.toContain("https://azursystech.fr/");
    expect(urls).not.toContain("https://azursystech.fr/home");
    expect(urls).not.toContain("https://azursystech.fr/business");
    expect(urls).not.toContain("https://azursystech.fr/about");
    expect(urls).not.toContain("https://azursystech.fr/pricing");
    expect(urls).not.toContain("https://azursystech.fr/faq");
    expect(urls).not.toContain("https://azursystech.fr/thank-you");
    expect(urls.some((url) => url.includes("/api/"))).toBe(false);
  });

  it("lists only the two approved English launch routes", () => {
    const englishUrls = sitemap()
      .map((entry) => entry.url)
      .filter((url) => url.startsWith("https://azursystech.fr/en"));

    expect(englishUrls).toEqual([
      "https://azursystech.fr/en",
      "https://azursystech.fr/en/ai-automation",
    ]);
  });
});
