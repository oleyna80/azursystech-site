import { describe, expect, it } from "vitest";

import { portfolioProjectHref } from "./portfolio-card";

describe("portfolioProjectHref", () => {
  it("uses a canonical locale-path detail URL", () => {
    expect(portfolioProjectHref("fr", "plomberie")).toBe("/fr/portfolio/plomberie");
    expect(portfolioProjectHref("ru", "plomberie")).toBe("/ru/portfolio/plomberie");
    expect(portfolioProjectHref("en", "plomberie")).toBe("/en/portfolio/plomberie");
  });
});
