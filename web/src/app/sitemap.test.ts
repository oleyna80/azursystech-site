import { describe, expect, it } from "vitest";

import sitemap from "@/app/sitemap";

describe("sitemap", () => {
  it("includes public page routes and excludes operational endpoints", () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).toEqual(
      expect.arrayContaining([
        "https://azursystech.fr/fr",
        "https://azursystech.fr/ru",
        "https://azursystech.fr/fr/ai-automation",
        "https://azursystech.fr/ru/ai-automation",
        "https://azursystech.fr/about",
        "https://azursystech.fr/ai-automation",
        "https://azursystech.fr/brief",
        "https://azursystech.fr/business",
        "https://azursystech.fr/contact",
        "https://azursystech.fr/data-deletion",
        "https://azursystech.fr/faq",
        "https://azursystech.fr/home",
        "https://azursystech.fr/legal",
        "https://azursystech.fr/pricing",
        "https://azursystech.fr/privacy",
        "https://azursystech.fr/services",
        "https://azursystech.fr/services/new-pc-setup",
        "https://azursystech.fr/services/onsite-support",
        "https://azursystech.fr/services/tpe-setup",
        "https://azursystech.fr/services/wifi-printer",
        "https://azursystech.fr/terms",
      ]),
    );
    expect(urls).not.toContain("https://azursystech.fr/");
    expect(urls).not.toContain("https://azursystech.fr/thank-you");
    expect(urls.some((url) => url.includes("/api/"))).toBe(false);
  });
});
