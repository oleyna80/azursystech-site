# WB-2026-07-22 — Showcase demo test invariant

## Objective

Remove the false full-suite failure caused by a test that assumes each home
card slug is also its showcase route slug. Preserve the accepted Bistrot card
target, `/demo/maison-olive`.

## Decision

`bistrot` is a portfolio/card identity used for its icon and editorial copy.
Its available showcase implementation is Maison Olive. Commit `1ed7420`
intentionally changed both French and Russian demo URLs to `maison-olive`.
The route `/demo/bistrot` does not exist, so changing the application data to
make the prior test pass would create a broken link.

## Approved scope

- Replace only the stale test equality assertion with an explicit card-slug to
  showcase-route mapping, including `bistrot -> maison-olive`.
- Prove the focused tests and typecheck pass.
- Record the Critic and verification evidence in the scoped tasklist/report
  files.

## Excluded scope

No showcase route or registry, source content data, visual component, contact
form, chat, provider, database, deployment, commit, or push changes.

## Acceptance criteria

1. Both French and Russian Bistrot cards keep `/demo/maison-olive`.
2. The test validates the intentional route mapping rather than a false
   slug-equality invariant.
3. The focused test file and TypeScript check pass.
