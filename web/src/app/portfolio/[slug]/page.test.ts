import { describe, expect, it } from "vitest";

import { legacyPortfolioProjectDestination } from "./page";

describe("legacy portfolio project redirect", () => {
  it("preserves the slug while redirecting to a canonical locale path", () => {
    expect(legacyPortfolioProjectDestination("plomberie", "ru")).toBe(
      "/ru/portfolio/plomberie",
    );
  });

  it("uses French for absent or invalid legacy locale values", () => {
    expect(legacyPortfolioProjectDestination("plomberie")).toBe("/fr/portfolio/plomberie");
    expect(legacyPortfolioProjectDestination("plomberie", "de")).toBe(
      "/fr/portfolio/plomberie",
    );
  });
});
