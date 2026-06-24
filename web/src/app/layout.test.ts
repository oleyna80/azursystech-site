import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("root layout analytics consent", () => {
  it("does not load Google Analytics directly before client consent", () => {
    const source = readFileSync(new URL("./layout.tsx", import.meta.url), "utf8");

    expect(source).not.toContain("googletagmanager.com/gtag/js");
    expect(source).not.toContain("gtag('config'");
    expect(source).toContain("AnalyticsConsentManager");
  });
});
