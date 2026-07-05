# WB-2026-07-06-push-approval-channel

Owner request: when Owner says "push" in chat, Control Tower should be able to push without a manual `!` step, while keeping the Hard Stop for unapproved pushes.

## Design

- `hard-stop.sh`, push-to-origin-main block: before denying, check `memory_bank/orchestrator-log.md` for a same-day Owner approval entry: a line starting with `| <today YYYY-MM-DD> |` containing `push: APPROVED` and ending with `| Owner |`. If present → allow (exit 0); else deny as now, with the deny message extended to document the channel ("Owner may approve via orchestrator-log entry: push: APPROVED").
- Scope of the unlock: ONLY the plain `git push origin main` block. The destructive-git block (force push, `+ref`, deletion pushes, reset --hard) stays unconditional — approval does NOT unlock it.
- Validity: same calendar day (solo-Owner trust model, consistent with existing `critic: SKIPPED` / `verification: SKIPPED` log-approval semantics; Control Tower records the entry only upon explicit Owner instruction in chat).
- Docs: AGENTS.md Hard Stops section — one line documenting the channel; memory-ops Gate Lifecycle — one line (record approval entry before pushing).

## Write-set

- .claude/hooks/hard-stop.sh
- AGENTS.md
- .agent/skills/memory-ops/SKILL.md
- docs/reports/
- docs/plans/

## Verification (lite)

Payload tests: push denied without entry; allowed with today's `push: APPROVED ... | Owner |` entry; force-push (`git push -f`, `git push origin +main`) denied even with entry; entry dated yesterday does not unlock; unrelated command passes; bash -n.

## Revision 2 (after critic RECONSIDER, 2026-07-06)

1. **Block order fix (critical):** destructive-git block moves ABOVE the push-to-origin-main block in hard-stop.sh, so force/`+ref`/deletion pushes are denied before the approval branch is ever reached. Belt-and-suspenders: the approval branch additionally re-checks the command for `-f`/`--force`/`+` and denies if present.
2. **Hardened approval entry format:** dedicated log row `| YYYY-MM-DD | push-approval | push: APPROVED origin main - <reason> | Owner |`. Hook grep anchors on line start: `^\| <today> \| push-approval \| push: APPROVED` — the literal `push-approval` WB-column prevents collisions with narrative log lines that merely mention approval text. Rule: no other log entries may use `push-approval` as WB id (documented in memory-ops).
3. **Verification tier upgraded to standard.** Added tests: force-push with valid approval → deny; `push origin +main` with approval → deny; yesterday-dated approval → deny; same-day narrative entry mentioning approval text in another WB's description column → deny; correct same-day entry → allow.
4. **Trust model documented in AGENTS.md:** the channel is a cooperative control (prevents pushes without recorded Owner instruction; not cryptographic; Control Tower records the entry only on explicit Owner instruction in chat).
5. grep -P requirement noted in hook comment (already used elsewhere in the script).
