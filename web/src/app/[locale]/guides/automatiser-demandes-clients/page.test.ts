import { describe, expect, it } from "vitest";

import { CONTENT } from "./_guide-data";
import { buildBriefHref, buildJsonLd, buildPageLinks, generateMetadata } from "./page";

const LOCALES = ["fr", "ru", "en"] as const;

describe("automatiser-demandes-clients guide", () => {
  it("uses the required French title and H1", async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ locale: "fr" }) });

    expect(metadata.title).toBe("Automatiser les demandes clients d'une TPE : guide pratique | AzurSysTech");
    expect(CONTENT.fr.h1).toBe("Comment automatiser les demandes clients d'une petite entreprise ?");
  });

  it("binds every locale to reciprocal self-canonical alternates", async () => {
    for (const locale of LOCALES) {
      const metadata = await generateMetadata({ params: Promise.resolve({ locale }) });
      expect(metadata.alternates).toMatchObject({
        canonical: "https://azursystech.fr/" + locale + "/guides/automatiser-demandes-clients",
        languages: {
          fr: "https://azursystech.fr/fr/guides/automatiser-demandes-clients",
          ru: "https://azursystech.fr/ru/guides/automatiser-demandes-clients",
          en: "https://azursystech.fr/en/guides/automatiser-demandes-clients",
          "x-default": "https://azursystech.fr/fr/guides/automatiser-demandes-clients",
        },
      });
    }
  });

  it("keeps the content contract complete in every locale", () => {
    for (const locale of LOCALES) {
      const copy = CONTENT[locale];
      expect(copy.briefText.trim()).not.toBe("");
      expect(copy.mapSteps).toHaveLength(4);
      expect(copy.workflowSteps.map((step) => step.title)).toHaveLength(6);
      expect(copy.noAiPoints).toHaveLength(5);
      expect(copy.aiUses).toHaveLength(4);
      expect(copy.exampleSteps).toHaveLength(4);
      expect(copy.humanBoundaries).toHaveLength(5);
      expect(copy.privacyPoints).toHaveLength(4);
      expect(copy.readinessItems).toHaveLength(7);
      expect(copy.portfolioLinks).toHaveLength(6);
      expect(copy.faqs).toHaveLength(5);
    }
  });

  it("emits WebPage, Article, BreadcrumbList and FAQPage with source parity", () => {
    for (const locale of LOCALES) {
      const copy = CONTENT[locale];
      const graph = buildJsonLd(locale, copy)["@graph"];
      const canonical = "https://azursystech.fr/" + locale + "/guides/automatiser-demandes-clients";

      expect(graph.map((node) => node["@type"])).toEqual(["WebPage", "Article", "BreadcrumbList", "FAQPage"]);
      expect(graph[0]).toMatchObject({ "@id": canonical, url: canonical, name: copy.h1, description: copy.intro, inLanguage: locale });
      expect(graph[1]).toMatchObject({ "@id": canonical + "#article", headline: copy.h1, description: copy.intro, inLanguage: locale });
      expect(graph[3].mainEntity).toEqual(copy.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })));
    }
  });

  it("links to the localised commercial, AI, portfolio and brief flows", () => {
    for (const locale of LOCALES) {
      const hrefs = buildPageLinks(locale, CONTENT[locale]).map((link) => link.href);
      expect(hrefs).toContain("/" + locale + "/creation-site-internet-nice");
      expect(hrefs).toContain("/" + locale + "/ai-automation");
      expect(hrefs).toContain("/" + locale + "/portfolio");
      expect(hrefs).toContain(buildBriefHref(locale));
      for (const project of CONTENT[locale].portfolioLinks) {
        expect(hrefs).toContain("/" + locale + "/portfolio/" + project.slug);
      }
    }
  });

  it("does not introduce unsupported commercial claims", () => {
    expect(JSON.stringify(CONTENT)).not.toMatch(/\b(ROI|testimonial|guarantee|guaranteed|hours saved|conversion|client results|customer outcomes)\b/i);
  });
});
