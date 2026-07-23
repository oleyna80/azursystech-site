# Verification report — WB-2026-07-22 showcase demo test invariant

## Formal verdict

READY — lite, non-sensitive, same-session-degraded.

The Scoped Coder changed only `web/src/app/[locale]/_home-data.test.ts`,
replacing the stale card-slug equality assertion with an explicit mapping that
records `bistrot -> maison-olive`.

Read-only Verifier evidence:

- both French and Russian source cards retain `/demo/maison-olive`;
- `showcase/app/demo/maison-olive/page.tsx` exists;
- `cd web && npx vitest run 'src/app/[locale]/_home-data.test.ts'` passed:
  one file, 12 tests;
- `cd web && npm run check:types` passed;
- scoped `git diff --check` passed.

The test runner emitted non-fatal stream-FD permission warnings before its
successful result. Ambient dirty and untracked paths were excluded from the
scoped diff. This Work Block has no sensitive domain, so the documented
`ct-inline` / `same-session-degraded` verification level is sufficient.
