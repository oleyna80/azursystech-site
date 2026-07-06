# Verification Report — WB-2026-07-06-hardstop-checkout-fix

Tier: lite | Verdict: READY | Method: dynamic fixture payload tests (CT-run)
Change: `.claude/hooks/hard-stop.sh` destructive-git regex (1 line + comments)

## What changed

1. `git checkout -- .` fragment false-positived on any dot-leading path
   (`git checkout -- .agent/verification-gate.md` was blocked). Replaced with
   bare-dot-token match: `git (checkout|restore) ... .{1,2}/?(\s|$)`.
2. `git restore .` (whole-tree discard) was not blocked at all — closed.
3. Global-opt prefix (`-C`, `--git-dir`, `--work-tree`) before the subcommand
   is now matched.
4. Adjacent pre-existing bug found by regression fixture: `git clean -fd` /
   `-xdf` bypassed `-[^\s]*f\b` (needs trailing f). New token-based match:
   `(-[a-zA-Z]*f[a-zA-Z]*|--force)(\s|$)` — f anywhere in a standalone option
   token; branch names like `feat-fix` do not trigger.

## Test matrix (31/31 PASS, fixture: JSON payload → hook stdin)

### Blocked (DENY)
| Command | Why |
|---|---|
| `git checkout -- .` / `git checkout .` / `git checkout ./` | whole-tree discard |
| `git checkout HEAD -- .` | whole-tree discard from ref |
| `git restore .` / `--worktree .` / `-W .` | whole-tree discard |
| `git restore --staged .` | accepted strictness (only unstages) |
| `git checkout -- . && ls` | compound |
| `git -C /tmp checkout -- .`, `git --git-dir=.git checkout -- .`, `git --work-tree /x restore .` | global-opt prefix |
| `git reset --hard HEAD~1` | regression |
| `git push --force origin main` | regression |
| `git clean -f` / `-fd` / `-xdf` | force-clean (−fd/−xdf newly closed) |

### Allowed (ALLOW)
| Command | Why |
|---|---|
| `git checkout -- .agent/verification-gate.md` | the original false positive; single-file gate-reset ritual |
| `git restore <file>` (single/multiple) | single-file restore |
| `git checkout main` / `-b feat/x` / `-- README.md` | branch/file ops |
| `git add .` / `git status` / `git diff .` | non-destructive |
| `git push origin feat-fix` | `-fix` inside branch name is not an option token |
| `git clean -n` | dry-run |
| `git push origin dev` / `origin main` | plain push handled by dedicated push-block downstream |
| `git commit -F /tmp/msg.txt` | commit ritual |

### Known bypasses (documented, out of regex scope — cooperative control)
| Vector | Note |
|---|---|
| `sh -c '...'` / `bash script.sh` wrappers | hook sees only outer command |
| env-var indirection, subshell obfuscation | text-based control by design |
| `cd /elsewhere && git checkout -- .` in other repo | path-agnostic |

Consistent with existing hook architecture (see critic report
`docs/reports/critic-WB-2026-07-06-hardstop-checkout-fix.md`); expansion-block
rule upstream catches `$()`/backtick smuggling in echo/git-commit segments.

## Checks
- `bash -n .claude/hooks/hard-stop.sh` — syntax OK
- 31/31 fixture cases PASS (suite: scratchpad/hardstop-tests.sh, session c89851a5)
- Critic: SUPPLEMENT (test matrix added — this report), no blockers
