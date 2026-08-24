import { describe, expect, it } from "vitest";
import {
  getAllSlugs,
  getPortfolioProjects,
  getProject,
  resolvePortfolioLocale,
} from "./portfolio-data";

describe("portfolio-data multi-language support", () => {
  it("resolves locales with fallback to fr", () => {
    expect(resolvePortfolioLocale("fr")).toBe("fr");
    expect(resolvePortfolioLocale("ru")).toBe("ru");
    expect(resolvePortfolioLocale("en")).toBe("en");
    expect(resolvePortfolioLocale("de")).toBe("fr");
    expect(resolvePortfolioLocale(null)).toBe("fr");
    expect(resolvePortfolioLocale(undefined)).toBe("fr");
  });

  it("returns 6 projects for all supported locales", () => {
    const frProjects = getPortfolioProjects("fr");
    const ruProjects = getPortfolioProjects("ru");
    const enProjects = getPortfolioProjects("en");

    expect(frProjects).toHaveLength(6);
    expect(ruProjects).toHaveLength(6);
    expect(enProjects).toHaveLength(6);

    expect(getAllSlugs()).toHaveLength(6);
  });

  it("provides complete English content without Cyrillic characters", () => {
    const enProjects = getPortfolioProjects("en");
    const cyrillicPattern = /[\u0400-\u04FF]/;

    for (const project of enProjects) {
      expect(project.title).not.toMatch(cyrillicPattern);
      expect(project.shortDescription).not.toMatch(cyrillicPattern);
      expect(project.review.intro).not.toMatch(cyrillicPattern);

      for (const cap of project.review.capabilities) {
        expect(cap).not.toMatch(cyrillicPattern);
      }
      for (const auto of project.review.automationPoints) {
        expect(auto).not.toMatch(cyrillicPattern);
      }
      for (const tag of project.tags) {
        expect(tag).not.toMatch(cyrillicPattern);
      }
    }
  });

  it("provides complete Russian content with valid Cyrillic strings", () => {
    const ruProjects = getPortfolioProjects("ru");
    const cyrillicPattern = /[\u0400-\u04FF]/;

    for (const project of ruProjects) {
      expect(project.shortDescription).toMatch(cyrillicPattern);
      expect(project.review.intro).toMatch(cyrillicPattern);
    }
  });

  it("retrieves individual project by slug and locale", () => {
    const frPlomberie = getProject("plomberie", "fr");
    const ruPlomberie = getProject("plomberie", "ru");
    const enPlomberie = getProject("plomberie", "en");

    expect(frPlomberie?.title).toBe("Plomberie Pro");
    expect(ruPlomberie?.title).toBe("Сантехника Про");
    expect(enPlomberie?.title).toBe("Plumbing Pro");

    expect(getProject("non-existent")).toBeUndefined();
  });
});
