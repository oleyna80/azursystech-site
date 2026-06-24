import { describe, expect, it } from "vitest";
import {
  buildExpiredCookieHeaders,
  buildGoogleAnalyticsScriptSource,
  getGoogleAnalyticsCookieNames,
  isAnalyticsConsentChoice,
} from "./analytics-consent";

describe("analytics-consent", () => {
  it("accepts only explicit analytics consent choices", () => {
    expect(isAnalyticsConsentChoice("accepted")).toBe(true);
    expect(isAnalyticsConsentChoice("rejected")).toBe(true);
    expect(isAnalyticsConsentChoice("pending")).toBe(false);
    expect(isAnalyticsConsentChoice(null)).toBe(false);
  });

  it("builds the Google Analytics script source safely", () => {
    expect(buildGoogleAnalyticsScriptSource("G-TEST 123")).toBe(
      "https://www.googletagmanager.com/gtag/js?id=G-TEST%20123",
    );
  });

  it("detects Google Analytics cookies without touching unrelated cookies", () => {
    expect(getGoogleAnalyticsCookieNames("_ga=1; session=abc; _ga_TEST=2; _gid=3; theme=dark")).toEqual([
      "_ga",
      "_ga_TEST",
      "_gid",
    ]);
  });

  it("builds expired cookie headers for host and root domains", () => {
    expect(buildExpiredCookieHeaders(["_ga"], "www.azursystech.fr")).toEqual([
      "_ga=; Max-Age=0; path=/; SameSite=Lax",
      "_ga=; Max-Age=0; path=/; SameSite=Lax; domain=www.azursystech.fr",
      "_ga=; Max-Age=0; path=/; SameSite=Lax; domain=.azursystech.fr",
    ]);
  });
});
