## Verifier Report

**Tier:** standard (same-session-degraded advisory verification)
**Work Block:** `WB-2026-07-20-immobilier-demo-review-remediation`
**Verdict:** READY

### Scope and files

**Written:** this report only.

**Read (approved implementation):**

- `showcase/components/immobilier/{ContactForm,ContactPage,Gallery,SiteShell,AgencePage,PropertyPage}.tsx`
- `showcase/components/immobilier/{contact,agency,property,shell}.module.css`
- `showcase/components/immobilier/{data,types}.ts`
- `showcase/app/demo/immobilier/icon.svg`

**Read (immediate dependencies):** `showcase/components/immobilier/{HomePage.tsx,home.module.css,gallery.module.css}`, `showcase/app/demo/immobilier/[lang]/layout.tsx`, and the two local video assets below. `HomePage.tsx`, `home.module.css`, `hero-loop.mp4`, `.od-skills/`, media assets, and the other dirty/untracked paths are ambient/out of scope and are not attributed to this Work Block.

### Checks

- [PASS] Type contract — `npm run check:types` in `showcase` completed: `next typegen && tsc --noEmit` with route types generated successfully.
- [PASS] Diff whitespace — `git diff --check` returned clean.
- [PASS] Approved application scope — modified remediation paths are all in the approved application write-set. The approved new `icon.svg` is untracked; unrelated dirty `HomePage.tsx`, `home.module.css`, `hero-loop.mp4`, `.od-skills/`, `.artifacts/`, media, control-layer, and historical-document paths were not changed by this verifier and are excluded from this verdict.
- [PASS] Contact activation semantics — static source scan found no `tel:` or `mailto:` in immobilier TS/TSX. Browser checks found zero `a[href^=tel], a[href^=mailto]` on FR/EN homepage, catalogue, sale, rent, property, contact, and agency pages. Agency renders both the displayed phone/email as non-links.
- [PASS] Contact disclosure and local-only validation — desktop FR Contact snapshot shows `Démo uniquement` and the no-transmission/no-human-reply notice before the first field. Empty submit rendered three required-field alerts and focused the name field; valid submit rendered the `role=status` demo status. Network request listings before/after each submit contained no non-static request.
- [PASS] Desktop route/render contract — at 1440×1000, browser navigated FR and EN `/`, `/catalogue`, `/vente`, `/location`, `/bien/appartement-cimiez-nice`, and `/contact`: each response was `200`, contained one `main` and expected `h1`, with no console errors. FR/EN `/agence` also returned `200`, rendered displayed contact details, and had zero activated telephone/email links.
- [PASS] Mobile route/render contract — at 375×812, the same twelve FR/EN routes each returned `200`, contained the expected `h1` and `main`, raised no console errors, and had no horizontal overflow.
- [PASS] Gallery focus containment and return focus — FR property gallery primary opener: opening focused `Fermer la galerie`; `Shift+Tab` moved to `Photo 3`, `Tab` returned to `Fermer la galerie`; ArrowRight/ArrowLeft changed the counter `1 sur 3` → `2 sur 3` → `1 sur 3`; Escape closed the dialog and restored focus to the primary opener. Repeated from secondary thumbnail: reverse/forward Tab remained in dialog controls and Escape restored to `Ouvrir la galerie … 2 sur 3` (the actual secondary opener).
- [PASS] Localized accessibility semantics — FR snapshot exposes wordmark accessible name `Atelier Rivage — accueil`, dialog group `Photos du bien`, and buttons `Photo 1..3`. EN browser check found wordmark `Atelier Rivage — home`, group `Property photos`, localized Close/Previous/Next/Photo labels, and zero `tablist`/`tab` roles.
- [PASS] Route icon and metadata — `curl -fsSI http://localhost:3010/demo/immobilier/icon.svg` returned `200` and `Content-Type: image/svg+xml`. Runtime FR and EN document metadata each contains `/demo/immobilier/icon.svg?icon.…svg`.
- [PASS] Hero runtime and reduced motion — normal desktop FR runtime: `video.currentSrc` is `http://localhost:3010/videos/hero-part2.mp4`, `readyState=4`, `paused=false`, `muted=true`, `autoplay=true`; its request returned local `206 Partial Content`. At 375px with emulated reduced motion, the media query matched, the video computed `display:none`, and the `/demo/immobilier/hero.jpg` fallback image was loaded.
- [PASS] Local media trace evidence — SHA-256: `showcase/public/videos/hero-part2.mp4` = `cde737008c53aa63ab229d1be4e930091d70281440bc2327f6f4622bf9176680`; `showcase/public/demo/immobilier/hero-kling-demo.mp4` = `66dffbe19076fab09b62d081048386d4d9e10de70793133249d3de5000b3f1e5`. Current browser source is the former (`/videos/hero-part2.mp4`). This is technical local evidence only; no provenance/rights conclusion is made.

### Warnings (non-blocking)

- This is a same-session-degraded native verifier result and therefore advisory only. The required independent readonly-root verifier remains the formal closeout gate.
- `docs/reports/WB-2026-07-20-immobilier-demo-review-remediation-traceability.md` was not present when checked. Control Tower owns that separate append-only record; it must carry the local path, hashes, prior-claim reference, current source, date, and explicit no-rights conclusion before formal Work Block closeout.

### Follow-up

Control Tower: preserve this evidence, finalize the traceability/gate records, freeze the approved diff, then run the prescribed independent readonly-root verifier. No staging, commit, push, deploy, provider, or media mutation was performed.

### Formal closeout

- [PASS] Independent readonly-root verifier — the Owner-authorized frozen
  21-path patch (SHA-256
  `11eb83f5402a5a624848c0893b37f748b6f8a277b3cea0812005a98ed0e6565f`)
  returned `FORMAL_VERDICT: READY`. It confirmed exact Critic write-set
  containment, destination blobs, reverse patch validation, scoped whitespace,
  static-contact/client-only-form semantics, gallery keyboard behavior,
  localized accessibility strings, favicon, technical-only traceability, and
  absence of dependencies, configuration, or media binaries.
- [PASS] Historical boundary — the previous global-worktree `BLOCKED` result is
  retained as historical evidence; this formal verdict closes only the frozen
  approved payload and does not attribute ambient hero/media changes.

Formal evidence:
`/run/codex-verifier-output/immobilier-demo-review-remediation-patch-v2.txt`.
No staging, commit, push, deploy, provider, or media mutation was performed.
