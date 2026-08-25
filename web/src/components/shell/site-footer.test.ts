import { describe, expect, it } from "vitest";

import { localizeFooterHref } from "./site-footer";

describe("localizeFooterHref", () => {
  it("localizes the portfolio navigation target", () => {
    expect(localizeFooterHref("/portfolio", "fr")).toBe("/fr/portfolio");
    expect(localizeFooterHref("/portfolio", "ru")).toBe("/ru/portfolio");
    expect(localizeFooterHref("/portfolio", "en")).toBe("/en/portfolio");
  });

  it("localizes the Nice website-creation navigation target", () => {
    expect(localizeFooterHref("/creation-site-internet-nice", "fr")).toBe("/fr/creation-site-internet-nice");
    expect(localizeFooterHref("/creation-site-internet-nice", "ru")).toBe("/ru/creation-site-internet-nice");
    expect(localizeFooterHref("/creation-site-internet-nice", "en")).toBe("/en/creation-site-internet-nice");
  });
});
