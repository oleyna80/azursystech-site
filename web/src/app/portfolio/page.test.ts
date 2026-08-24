import { describe, expect, it } from "vitest";

import { legacyPortfolioIndexDestination } from "./page";

describe("legacy portfolio index redirect", () => {
  it("redirects valid locale query variants to the matching canonical path", () => {
    expect(legacyPortfolioIndexDestination("fr")).toBe("/fr/portfolio");
    expect(legacyPortfolioIndexDestination("ru")).toBe("/ru/portfolio");
    expect(legacyPortfolioIndexDestination("en")).toBe("/en/portfolio");
  });

  it("falls back to French and discards invalid legacy locale values", () => {
    expect(legacyPortfolioIndexDestination()).toBe("/fr/portfolio");
    expect(legacyPortfolioIndexDestination("de")).toBe("/fr/portfolio");
    expect(legacyPortfolioIndexDestination(["ru", "en"])).toBe("/ru/portfolio");
  });
});
