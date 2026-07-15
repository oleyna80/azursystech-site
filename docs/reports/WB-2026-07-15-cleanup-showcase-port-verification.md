# Verification Report — WB-2026-07-15-cleanup-showcase-port

## Native Verifier result

**UNVERIFIED** — source and type checks pass, but the mandatory localhost
runtime/browser smoke is blocked by the verifier sandbox.

## Checks passed

- `cd web && npm run check:types` — PASS.
- `git diff --check` — PASS.
- The frozen diff changes only the synchronized development fallback from
  `3007` to `3002` in the two approved payload paths.
- Source inspection confirms `??` preserves a defined
  `NEXT_PUBLIC_SHOWCASE_BASE_URL` override.

## Runtime blocker

The Verifier started local `web` and `showcase` dev servers, which reported
ready on ports 3000 and 3002. In the sandbox, localhost `curl` failed with
`Operation not permitted`; the escalated read-only localhost smoke was aborted
before it ran. Therefore no HTTP status, desktop/375px Playwright proof,
console/network scan, or actual link navigation evidence exists.

This is an environment blocker, not a negative source-code verdict. The frozen
evidence is submitted to the Control-Tower-launched independent-readonly-root;
the Work Block remains non-READY unless the formal gate can close it with an
explicit runtime follow-up.

## Formal readonly result

**READY for local code closeout; runtime follow-up remains BLOCKED.**

The separate top-level readonly root returned `FORMAL_VERDICT: READY` in
`/run/codex-verifier-output/WB-2026-07-15-cleanup-showcase-port.txt`. It
confirmed both payload expressions are identical, port 3002 is the showcase
contract, `??` preserves an explicit override, the scoped diff is atomic, and
diff hygiene passes. It explicitly did not claim HTTP, desktop/375px
Playwright, console/network, or navigation proof.

No staging or commit is authorized by this result.

## Owner-authorized localhost/browser follow-up

**READY — `review-degraded:inline-fallback`.** The native Verifier's permitted
retry hung after sandbox socket-policy failure, so the Control Tower ran the
narrowest authorized follow-up without changing the frozen source payload.

- `curl -fsSI --max-time 10 http://localhost:3000/fr` — HTTP 200.
- `curl -fsSI --max-time 10 http://localhost:3000/portfolio` — HTTP 200.
- `curl -fsSI --max-time 10 http://localhost:3002/demo/plomberie` — HTTP 200.
- Playwright desktop: `/portfolio` rendered its Plomberie card; the card opened
  `/portfolio/plomberie`, whose `Voir la démo` link resolved to
  `http://localhost:3002/demo/plomberie` and loaded the showcase content.
- Playwright 375×812: the showcase rendered its header, hero, primary CTA, and
  contact form; the mobile `Demander un devis` CTA reached `#contact` without
  submitting data. Screenshot: `.playwright-cli/page-2026-07-15T14-13-30-989Z.png`
- Console: one non-blocking 404 for `http://localhost:3002/favicon.ico`; no
  other errors or warnings. It is outside the two fallback-origin payload paths.

The independent-readonly-root result remains the formal local-code verdict;
this permitted runtime evidence closes its previously blocked follow-up. No
staging, commit, push, deploy, or deletion occurred.
