# critic Memory

## grep-unsafe-amendment-rules

**Type:** blind-spot  
**Summary:** Amendment/waiver log searches vulnerable to regex metacharacters and substring collisions without fixed-string grep.

WB-2026-07-06-gate-enforcement introduced amendment and waiver rules using grep to find entries in orchestrator-log. Current design is unsafe:
- Pattern `.agent/critic-gate.sh` interpreted as regex → matches `.agentvcritic-gate.sh`, etc.
- Substring collision: write-set `docs/` matches prose "docs-backup/" → false positive bypass
- Special chars `[`, `]`, `|` break grep parsing

**Prior incident:** WB-2026-07-06-push-approval-channel had block-order vulnerability (approval check before force-push block). Same bypass pattern.

**Solution:** Use `grep -F` (fixed-string) for all orchestrator-log searches.

**How to apply:** When reviewing hook designs that parse orchestrator-log:
1. Check if grep uses `-F` flag
2. Flag as security finding if not
3. Test fixtures must include regex-metacharacter edge cases

---

## hook-gate-validation-gaps

**Type:** blind-spot  
**Summary:** Gate field validation lacks case-insensitive comparisons for enums (Sensitive Domains, Verifier, Critic Verdict).

WB-2026-07-06-gate-enforcement added case-sensitive enum validation: `[ "$sensitive_domains" != "none" ]` fails on "NONE", "None". This creates false-negative waiver-bypass risk.

Gate files are human-edited by Control Tower. Either:
- Normalize case in hooks (recommended for amendment/waiver checks), OR
- Enforce strict template formatting (template-reset ritual)

**Solution:** Case-normalize before validation: `field "Sensitive Domains" | tr '[:upper:]' '[:lower:]'`

**How to apply:** When reviewing gate hook additions:
1. Check all enum field comparisons
2. Ask: "Could case variation cause false negatives or false positives?"
3. Recommend case-normalization for external-facing fields (Control Tower types by hand)
4. Test fixtures must include uppercase/mixed-case variants
