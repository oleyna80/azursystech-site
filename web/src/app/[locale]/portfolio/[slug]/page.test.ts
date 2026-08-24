import { describe, expect, it } from "vitest";

import { generateMetadata, generateStaticParams } from "./page";

describe("localized portfolio project", () => {
  it("generates every existing slug for every supported locale", () => {
    const paths = generateStaticParams();

    expect(paths).toHaveLength(18);
    expect(paths).toContainEqual({ locale: "fr", slug: "plomberie" });
    expect(paths).toContainEqual({ locale: "ru", slug: "plomberie" });
    expect(paths).toContainEqual({ locale: "en", slug: "plomberie" });
  });

  it("uses matching self-canonical and alternate URLs for the localized slug", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "ru", slug: "plomberie" }),
    });

    expect(metadata.alternates).toMatchObject({
      canonical: "https://azursystech.fr/ru/portfolio/plomberie",
      languages: {
        fr: "https://azursystech.fr/fr/portfolio/plomberie",
        ru: "https://azursystech.fr/ru/portfolio/plomberie",
        en: "https://azursystech.fr/en/portfolio/plomberie",
        "x-default": "https://azursystech.fr/fr/portfolio/plomberie",
      },
    });
  });
});
