# Context

- **Current focus**: Sprint closed. All sprint deliverables deployed and verified in production (azursystech.fr).
- **Completed this sprint**:
  - SEO Architecture: URL-based i18n (`/fr`, `/ru`, `/fr/ai-automation`, `/ru/ai-automation`), sitemap, robots, canonical, hreflang, LocalBusiness/FAQPage/ITService/Organization JSON-LD
  - SEO Sprint 2: FAQPage JSON-LD on homepage, image loading attrs (LCP/CLS), local SEO cities block (Nice, Cagnes-sur-Mer, Antibes, Vence / Alpes-Maritimes)
  - Analytics: GA4 `G-J4Y77YBQMC` integrated in root layout
  - Dependency security: brace-expansion, flatted, picomatch patched; Next.js upgraded `16.2.3 → 16.2.6`
  - Local dev: WSL node_modules repaired (`npm ci` from WSL shell)
  - Tooling: `wsl-browser-preflight` skill created and tested; `nextjs-seo-build-verifier` skill created; `vps-registry-pull-deploy` skill updated with WSL npm isolation rule; `CLAUDE.md` created
- **Working scope**: `web/src/app/[locale]/`, `web/package.json`, `web/package-lock.json`, `web/src/app/layout.tsx`, `.agent/skills/`, `CLAUDE.md`
- **Next step**: GSC sitemap submit + indexing request; SEO Sprint 3 (alt texts, `/ru/ai-automation` FAQPage JSON-LD, html lang fix for /ru via minimal middleware); AZR-004 Facebook Social Automation (paused)
