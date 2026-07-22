import { describe, it, expect } from "vitest"
import { buildHomeJsonLd, HOME_CONTENT } from "./_home-data"

describe("HOME_CONTENT showcase section", () => {
  const locales = ["fr", "ru"] as const

  for (const l of locales) {
    describe(l, () => {
      const copy = HOME_CONTENT[l]

      it("has showcaseDemos array with 6 demos", () => {
        expect(copy.showcaseDemos).toHaveLength(6)
      })

      it("every demo has complete showcase card data", () => {
        for (const d of copy.showcaseDemos) {
          expect(d.slug).toBeTruthy()
          expect(d.title).toBeTruthy()
          expect(d.category).toBeTruthy()
          expect(d.siteType).toBeTruthy()
          expect(d.businessFunction).toBeTruthy()
          expect(d.automationBadge).toBeTruthy()
          expect(d.demoUrl).toBeTruthy()
        }
      })

      it("first two demos have 'new' badge", () => {
        expect(copy.showcaseDemos[0].badge).toBe("new")
        expect(copy.showcaseDemos[1].badge).toBe("new")
      })

      it("no duplicate slugs", () => {
        const slugs = copy.showcaseDemos.map((d) => d.slug)
        expect(new Set(slugs).size).toBe(slugs.length)
      })

      it("all demoUrls route to the matching showcase demo", () => {
        for (const d of copy.showcaseDemos) {
          const url = new URL(d.demoUrl, "http://localhost:3000")
          expect(url.pathname).toBe(`/demo/${d.slug}`)
        }
      })
    })
  }
})

describe("HOME_CONTENT English launch content", () => {
  const copy = HOME_CONTENT.en

  it("contains complete native English copy for the visible sections", () => {
    expect(copy.heroTitle).toMatch(/AI automation/i)
    expect(copy.businessTitle).toBeTruthy()
    expect(copy.automationTitle).toBeTruthy()
    expect(copy.pricingItems.length).toBeGreaterThan(0)
    expect(copy.faqs.length).toBeGreaterThan(0)
    expect(copy.showcaseDemos).toEqual([])
  })

  it("publishes English service structured data without obsolete IT repair claims", () => {
    const jsonLd = JSON.stringify(buildHomeJsonLd("en"))

    expect(jsonLd).toContain('"inLanguage":"en"')
    expect(jsonLd).toContain("AI automation")
    expect(jsonLd).not.toMatch(/repair|hardware|wi-?fi|network support|local IT/i)
  })
})
