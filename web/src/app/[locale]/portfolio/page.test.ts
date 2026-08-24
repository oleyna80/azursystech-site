import { describe, expect, it } from "vitest";

import { generateMetadata, generateStaticParams } from "./page";

describe("localized portfolio index", () => {
  it("generates every supported locale as a static path", () => {
    expect(generateStaticParams()).toEqual([{ locale: "fr" }, { locale: "ru" }, { locale: "en" }]);
  });

  it("uses a self-canonical URL and complete locale alternates", async () => {
    for (const locale of ["fr", "ru", "en"] as const) {
      const metadata = await generateMetadata({ params: Promise.resolve({ locale }) });

      expect(metadata.alternates).toMatchObject({
        canonical: `https://azursystech.fr/${locale}/portfolio`,
        languages: {
          fr: "https://azursystech.fr/fr/portfolio",
          ru: "https://azursystech.fr/ru/portfolio",
          en: "https://azursystech.fr/en/portfolio",
          "x-default": "https://azursystech.fr/fr/portfolio",
        },
      });
    }
  });
});
