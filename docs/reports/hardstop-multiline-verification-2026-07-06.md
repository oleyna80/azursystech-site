# Verification Report — WB-2026-07-06-hardstop-multiline-fix

Tier: lite | Verdict: READY | Method: dynamic fixture payload tests (CT-run)
Change: `.claude/hooks/hard-stop.sh` — quote-aware newline normalization;
new committed suite `.claude/hooks/tests/hard-stop-fixtures.sh`

## What changed

Both `tr '\n' ' '` pipelines (expansion-block check + `clean_cmd` builder)
replaced by one shared `norm_cmd` (perl state machine, quote-aware):

- newline **outside** quotes → `;` (it is a command separator)
- newline **inside** single/double quotes → space (it is text; multi-line
  quoted expansions stay inside one echo/git-commit segment)
- backslash+newline (continuation) → space

Fixes:
1. **False positive closed:** multi-line inline scripts where `$(...)` on a
   later line landed inside an earlier `echo` segment → deny. Now segments
   end at line boundaries.
2. **Real bypass closed:** `echo done<NL>rm -rf ./build` returned ALLOW —
   the unquoted-echo sed strip swallowed the next line. Verified DENY now.

## Test matrix (42/42 PASS)

### Multi-line bypasses closed (DENY)
| Payload | Guard |
|---|---|
| `echo done` ⏎ `rm -rf ./build` | destructive-fs |
| `echo ok` ⏎ `git reset --hard` | destructive-git |
| `git commit -m "a` ⏎ `$(rm -rf /)"` | expansion block (quoted NL stays in segment) |
| `echo foo \` ⏎ `$(x)` | expansion block (continuation joined) |

### Multi-line false positives fixed (ALLOW)
| Payload | Was |
|---|---|
| `echo SYNTAX_OK` ⏎ `out=$(jq -n 1)` ⏎ `echo "ok"` | deny (session-blocked case) |
| `echo start` ⏎ `for i in $(seq 3); …` | deny |
| function body with `$(date)` after `echo ready` | deny |

### Regressions (single-line, from WB-hardstop-checkout-fix)
31 destructive-git/expansion cases re-run unchanged: whole-tree
checkout/restore deny, dotfile-path checkout/restore allow, clean -fd/-xdf
deny, `feat-fix` branch allow, `git commit -m "$(…)"` deny, plain
echo/commit allow. Full list in the suite file.

### Known accepted strictness / pre-existing limits
| Vector | Status |
|---|---|
| heredoc body line starting with `rm ` etc. | new strictness: denies (deny-leaning; use Write tool) |
| process substitution `<(…)`, `sh -c` wrappers, env indirection | pre-existing, out of scope (cooperative control) |
| `$'…'` ANSI-C quoting | treated as single-quoted — conservative, no new bypass (critic-verified) |
| CRLF payloads | `\r` literal, `\n` normalized — patterns still match (critic-verified) |

## Checks
- `bash -n .claude/hooks/hard-stop.sh` — syntax OK
- `bash .claude/hooks/tests/hard-stop-fixtures.sh` → 42/42 PASS, EXIT=0
- Live: hook active on every Bash call this session — git status/add/commit
  flows unaffected during and after the change
- Normalizer standalone unit tests: 8/8 (scratchpad, session c89851a5)
- Critic: APPROVE — no new bypasses (report
  `docs/reports/critic-WB-2026-07-06-hardstop-multiline-fix.md`)
