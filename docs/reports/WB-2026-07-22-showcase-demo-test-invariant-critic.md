# Critic report — WB-2026-07-22 showcase demo test invariant

## Verdict

APPROVE — reconsideration adopted and resolved.

The failure is not a broken URL. `web/src/app/[locale]/_home-data.ts` maps the
French and Russian Bistrot cards to `/demo/maison-olive`, as intentionally
changed by commit `1ed7420`. `/demo/maison-olive` has a dedicated route, while
`/demo/bistrot` has none.

The invariant in `_home-data.test.ts` is therefore stale: it assumes card
identity must equal implementation-route identity. Changing production data
would create a 404. The accepted corrective action is limited to replacing the
test with an explicit route mapping that records the Bistrot-to-Maison-Olive
relationship.

## Scope conditions

- One Scoped Coder may change only `web/src/app/[locale]/_home-data.test.ts`.
- Keep all unrelated contact/chat and dirty worktree paths untouched.
- Verify focused Vitest and typecheck before marking the risk closed.
