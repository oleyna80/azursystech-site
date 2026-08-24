import { describe, expect, it } from "vitest";

import { localizeFooterHref } from "./site-footer";

describe("localizeFooterHref", () => {
  it("localizes the portfolio navigation target", () => {
    expect(localizeFooterHref("/portfolio", "fr")).toBe("/fr/portfolio");
    expect(localizeFooterHref("/portfolio", "ru")).toBe("/ru/portfolio");
    expect(localizeFooterHref("/portfolio", "en")).toBe("/en/portfolio");
  });
});
