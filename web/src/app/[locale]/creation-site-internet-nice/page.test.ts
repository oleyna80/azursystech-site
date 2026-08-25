import { describe, expect, it } from "vitest";

import { CONTENT } from "./_creation-site-data";
import { buildBriefHref, buildJsonLd, buildPageLinks, generateMetadata } from "./page";

const LOCALES = ["fr", "ru", "en"] as const;

describe("creation-site-internet-nice page", () => {
  it("uses the required French title and H1", async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ locale: "fr" }) });

    expect(metadata.title).toBe("Création de site internet à Nice pour TPE & artisans | AzurSysTech");
    expect(CONTENT.fr.h1).toBe("Création de site internet à Nice pour petites entreprises");
  });

  it("binds every locale to the reciprocal canonical contract", async () => {
    for (const locale of LOCALES) {
      const metadata = await generateMetadata({ params: Promise.resolve({ locale }) });
      expect(metadata.alternates).toMatchObject({
        canonical: `https://azursystech.fr/${locale}/creation-site-internet-nice`,
        languages: {
          fr: "https://azursystech.fr/fr/creation-site-internet-nice",
          ru: "https://azursystech.fr/ru/creation-site-internet-nice",
          en: "https://azursystech.fr/en/creation-site-internet-nice",
          "x-default": "https://azursystech.fr/fr/creation-site-internet-nice",
        },
      });
    }
  });

  it("keeps visible localized content complete", () => {
    for (const locale of LOCALES) {
      const copy = CONTENT[locale];
      expect(copy.h1).not.toBe(copy.h1.toLowerCase());
      expect(copy.types).toHaveLength(3);
      expect(copy.functions).toHaveLength(3);
      expect(copy.intakePoints).toHaveLength(4);
      expect(copy.audiences).toHaveLength(4);
      expect(copy.portfolioLinks).toHaveLength(6);
      expect(copy.process).toHaveLength(4);
      expect(copy.pricing.map((item) => item.price)).toEqual(
        locale === "fr"
          ? ["à partir de 400 €", "à partir de 600 €", "à partir de 600 €", "à partir de 800 €"]
          : locale === "ru"
            ? ["от 400 €", "от 600 €", "от 600 €", "от 800 €"]
            : ["from 400 €", "from 600 €", "from 600 €", "from 800 €"],
      );
      for (const value of [copy.intro, copy.areaText, copy.finalIntro, ...copy.faqs.flatMap((faq) => [faq.q, faq.a])]) {
        expect(value.trim()).not.toBe("");
      }
    }
  });

  it("emits four schema types with FAQ parity and the current canonical", () => {
    for (const locale of LOCALES) {
      const copy = CONTENT[locale];
      const jsonLd = buildJsonLd(locale, copy);
      const graph = jsonLd["@graph"];
      const canonical = `https://azursystech.fr/${locale}/creation-site-internet-nice`;
      expect(graph.map((node) => node["@type"])).toEqual(["WebPage", "Service", "BreadcrumbList", "FAQPage"]);
      expect(graph[0]).toMatchObject({ "@id": canonical, url: canonical, name: copy.h1, description: copy.intro });
      expect(graph[1]).toMatchObject({ "@id": `${canonical}#service`, url: canonical, name: copy.h1, areaServed: copy.areaText });
      const faqPage = graph[3];
      expect(faqPage.mainEntity).toEqual(copy.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })));
    }
  });

  it("exposes localized discovery links to portfolio, examples, AI and brief", () => {
    for (const locale of LOCALES) {
      const links = buildPageLinks(locale, CONTENT[locale]);
      const hrefs = links.map((link) => link.href);
      expect(hrefs).toContain(`/${locale}/portfolio`);
      expect(hrefs).toContain(`/${locale}/ai-automation`);
      expect(hrefs).toContain(buildBriefHref(locale));
      for (const project of CONTENT[locale].portfolioLinks) {
        expect(hrefs).toContain(`/${locale}/portfolio/${project.slug}`);
      }
    }
  });

  it("does not introduce prohibited commercial claims", () => {
    const pageCopy = JSON.stringify(CONTENT);
    expect(pageCopy).not.toMatch(/\b(ROI|testimonial|guarantee|ranking)\b/i);
  });
});
