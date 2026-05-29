import { describe, it, expect } from "vitest"
import { HOME_CONTENT } from "./_home-data"

describe("HOME_CONTENT showcase section", () => {
  const locales = ["fr", "ru"] as const

  for (const l of locales) {
    describe(l, () => {
      const copy = HOME_CONTENT[l]

      it("has showcaseDemos array with 6 demos", () => {
        expect(copy.showcaseDemos).toHaveLength(6)
      })

      it("every demo has slug, title, category, demoUrl", () => {
        for (const d of copy.showcaseDemos) {
          expect(d.slug).toBeTruthy()
          expect(d.title).toBeTruthy()
          expect(d.category).toBeTruthy()
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

      it("all demoUrls start with /demo/ and match slug", () => {
        for (const d of copy.showcaseDemos) {
          expect(d.demoUrl).toBe(`/demo/${d.slug}`)
        }
      })
    })
  }
})
