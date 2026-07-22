import { describe, expect, it } from "vitest";

import { buildHomeJsonLd } from "./_home-data";
import { generateMetadata } from "./page";

describe("English home metadata", () => {
  it("uses the English canonical and only the approved locale alternates", async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ locale: "en" }) });

    expect(metadata.alternates).toMatchObject({
      canonical: "https://azursystech.fr/en",
      languages: {
        fr: "https://azursystech.fr/fr",
        ru: "https://azursystech.fr/ru",
        en: "https://azursystech.fr/en",
        "x-default": "https://azursystech.fr/fr",
      },
    });
  });

  it("marks its structured data as English", () => {
    const service = buildHomeJsonLd("en")["@graph"][0];

    expect(service).toMatchObject({ inLanguage: "en", availableLanguage: "English" });
  });
});
