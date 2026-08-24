import { describe, expect, it } from "vitest";

import { buildLocalizedPath } from "./site-header";

describe("buildLocalizedPath", () => {
  it("preserves portfolio index and project-detail URLs when changing the locale", () => {
    for (const locale of ["fr", "ru", "en"] as const) {
      expect(buildLocalizedPath("/portfolio", locale)).toBe("/portfolio");
      expect(buildLocalizedPath("/portfolio/plomberie", locale)).toBe("/portfolio/plomberie");
    }
  });

  it("continues to change the path locale for locale-prefixed routes", () => {
    expect(buildLocalizedPath("/en", "ru")).toBe("/ru");
    expect(buildLocalizedPath("/en/services", "fr")).toBe("/fr/services");
  });
});
