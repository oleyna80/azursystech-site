import { describe, expect, it } from "vitest";

import sitemap from "@/app/sitemap";

describe("sitemap", () => {
  it("includes only canonical public routes and excludes redirects and operational endpoints", () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).toEqual(
      expect.arrayContaining([
        "https://azursystech.fr/fr",
        "https://azursystech.fr/ru",
        "https://azursystech.fr/en",
        "https://azursystech.fr/fr/ai-automation",
        "https://azursystech.fr/ru/ai-automation",
        "https://azursystech.fr/en/ai-automation",
        "https://azursystech.fr/fr/creation-site-internet-nice",
        "https://azursystech.fr/ru/creation-site-internet-nice",
        "https://azursystech.fr/en/creation-site-internet-nice",
        "https://azursystech.fr/brief",
        "https://azursystech.fr/data-deletion",
        "https://azursystech.fr/legal",
        "https://azursystech.fr/privacy",
        "https://azursystech.fr/terms",
      ]),
    );
    expect(urls).not.toContain("https://azursystech.fr/");
    expect(urls).not.toContain("https://azursystech.fr/home");
    expect(urls).not.toContain("https://azursystech.fr/business");
    expect(urls).not.toContain("https://azursystech.fr/contact");
    expect(urls).not.toContain("https://azursystech.fr/about");
    expect(urls).not.toContain("https://azursystech.fr/pricing");
    expect(urls).not.toContain("https://azursystech.fr/faq");
    expect(urls).not.toContain("https://azursystech.fr/thank-you");
    expect(urls).not.toContain("https://azursystech.fr/ai-automation");
    expect(urls.some((url) => url.startsWith("https://azursystech.fr/portfolio"))).toBe(false);
    expect(urls.some((url) => url.includes("/api/"))).toBe(false);

    const niceUrls = urls.filter((url) => url.includes("creation-site-internet-nice"));
    expect(niceUrls).toHaveLength(3);
    expect(new Set(niceUrls).size).toBe(3);
  });

  it("lists every canonical localized portfolio route exactly once without synthetic dates", () => {
    const entries = sitemap();
    const portfolioUrls = entries
      .map((entry) => entry.url)
      .filter((url) => url.includes("/portfolio"));

    expect(portfolioUrls).toHaveLength(21);
    expect(new Set(portfolioUrls).size).toBe(21);
    expect(portfolioUrls).toEqual(
      expect.arrayContaining([
        "https://azursystech.fr/fr/portfolio",
        "https://azursystech.fr/ru/portfolio",
        "https://azursystech.fr/en/portfolio",
        "https://azursystech.fr/fr/portfolio/plomberie",
        "https://azursystech.fr/ru/portfolio/plomberie",
        "https://azursystech.fr/en/portfolio/plomberie",
      ]),
    );
    expect(entries.every((entry) => entry.lastModified === undefined)).toBe(true);
  });

  it("lists every canonical English route", () => {
    const englishUrls = sitemap()
      .map((entry) => entry.url)
      .filter((url) => url.startsWith("https://azursystech.fr/en"));

    expect(englishUrls).toEqual([
      "https://azursystech.fr/en",
      "https://azursystech.fr/en/ai-automation",
      "https://azursystech.fr/en/creation-site-internet-nice",
      "https://azursystech.fr/en/portfolio",
      "https://azursystech.fr/en/portfolio/plomberie",
      "https://azursystech.fr/en/portfolio/salon-beaute",
      "https://azursystech.fr/en/portfolio/bistrot",
      "https://azursystech.fr/en/portfolio/bijoux-artisanaux",
      "https://azursystech.fr/en/portfolio/assurance",
      "https://azursystech.fr/en/portfolio/immobilier",
    ]);
  });
});
