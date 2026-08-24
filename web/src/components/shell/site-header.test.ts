import { describe, expect, it } from "vitest";

import { buildLocalizedPath, buildNavLinks } from "./site-header";

describe("buildLocalizedPath", () => {
  it("switches canonical portfolio index and project-detail URLs to the selected locale", () => {
    expect(buildLocalizedPath("/fr/portfolio", "ru")).toBe("/ru/portfolio");
    expect(buildLocalizedPath("/en/portfolio/plomberie", "fr")).toBe("/fr/portfolio/plomberie");
  });

  it("continues to change the path locale for locale-prefixed routes", () => {
    expect(buildLocalizedPath("/en", "ru")).toBe("/ru");
    expect(buildLocalizedPath("/en/services", "fr")).toBe("/fr/services");
  });

  it("uses a localized portfolio link in every header navigation locale", () => {
    for (const locale of ["fr", "ru", "en"] as const) {
      expect(buildNavLinks(locale)).toContainEqual(
        expect.objectContaining({ href: `/${locale}/portfolio` }),
      );
    }
  });
});
