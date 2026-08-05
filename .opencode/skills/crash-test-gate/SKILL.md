---
name: crash-test-gate
description: Verification procedures for local route integrity, navigation, anchor links, 404 behavior, and sitemap validation before committing route/navigation changes. Use when adding, deleting, or modifying pages, routes, header/footer navigation, or sitemap entries.
---

# Crash Test Gate

Procedural guide for validating route integrity, navigation anchors, sitemap routes, and 404 response handling before committing changes that touch site structure.

---

## 1. When to Trigger

Run the Crash Test Gate before `git commit` whenever a Work Block modifies:
- Next.js route files (`app/**/page.tsx`, `app/**/route.ts`)
- Header or footer navigation links
- Sitemap definitions (`app/sitemap.ts`)
- Redirects or URL structure (`next.config.ts`, `middleware.ts`)

---

## 2. Crash Test Checklist

Execute these 5 steps against the active dev server (`http://localhost:3000` or `http://localhost:3002`):

1. **Sitemap Route Verification**:
   - Query all URLs listed in `sitemap.ts` via `curl -sI`:
     ```bash
     curl -sI http://localhost:3000/sitemap.xml
     ```
   - All public routes MUST return `HTTP 200` or `308` (redirect).

2. **Deleted / Legacy Route 404 Check**:
   - Verify that retired or renamed routes return explicit 404:
     ```bash
     curl -sI http://localhost:3000/old-deleted-route
     ```
   - Must return `HTTP 404 Not Found`.

3. **Anchor Link Integrity**:
   - Inspect all header and footer `#anchor` targets referenced in navigation components.
   - Verify that target elements with matching `id="..."` exist on the destination pages.

4. **Automated Test Suite**:
   - Run Vitest for affected route and navigation test files:
     ```bash
     npx vitest run src/app/sitemap.test.ts
     ```

5. **Dev Server Log Inspection**:
   - Verify 0 new unhandled runtime exceptions or React hydration errors appear in dev server logs.

---

## 3. Evidence Recording

Record the crash test verdict in the commit message or closeout report:

```markdown
Crash test: PASSED
- Sitemap routes verified: 200 OK
- Deleted routes: 404 Not Found
- Vitest route tests: 100% passed
```
