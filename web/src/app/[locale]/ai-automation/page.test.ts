import { describe, expect, it } from "vitest";

import { buildJsonLd, CONTENT, generateMetadata } from "./page";

describe("English AI automation route", () => {
  it("uses the English canonical and approved language alternates", async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ locale: "en" }) });

    expect(metadata.alternates).toMatchObject({
      canonical: "https://azursystech.fr/en/ai-automation",
      languages: {
        fr: "https://azursystech.fr/fr/ai-automation",
        ru: "https://azursystech.fr/ru/ai-automation",
        en: "https://azursystech.fr/en/ai-automation",
        "x-default": "https://azursystech.fr/fr/ai-automation",
      },
    });
  });

  it("uses English JSON-LD and WhatsApp as its sole conversion channel", () => {
    const jsonLd = JSON.stringify(buildJsonLd("en", CONTENT.en));

    expect(jsonLd).toContain('"inLanguage":"en"');
    expect(jsonLd).toContain("https://wa.me/33780720994");
    expect(jsonLd).not.toContain("/contact");
  });

});
