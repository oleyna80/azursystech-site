# Critic Report — WB-2026-07-06-hardstop-checkout-fix

**Date:** 2026-07-06  
**Reviewed:** Stage 0 Preflight + hard-stop.sh line 64 + AGENTS.md § Hard Stops + ROSTER.md  
**Verdict:** **SUPPLEMENT — one material issue; recommend dynamic testing in addition to static regex inspection**

---

## Executive Summary

The proposed regex fix correctly addresses the two core problems (false positive on single-file .git-based paths, and bypass via `git restore`). Empirical testing confirms the fix blocks destructive commands and allows legitimate gate-reset operations. However:

1. **Material gap:** The proposed regex still permits two classes of real whole-tree-discard bypasses via git options (`git -C`, `git --git-dir`), which lie outside regex scope but may warrant a supplementary check.
2. **Recommendation:** Add fixture-based payload tests (as noted in Stage 0) to verify the actual command blocks as expected, since regex alone cannot catch option-based bypasses. This is noted in Stage 0 but deserves explicit verification before commit.

The fix is sound for the stated intent (dot-token blocking), and the verification tier (lite + Control Tower fixture tests) is appropriate for a single-line regex change.

---

## Detailed Findings

### 1. Scope & Write-Set

✓ **APPROVE**: Only `.claude/hooks/hard-stop.sh` line 64 (one regex fragment inside the destructive-git control block).  
Clear, minimal, and necessary.

---

### 2. Current Regex Problem (line 64, fragment: `git\s+checkout\s+--\s+\.`)

**Issue A: False Positive on Single-File Paths**

```bash
git checkout -- .agent/verification-gate.md    # CURRENT: ✓ BLOCKS (wrong)
git checkout -- .env                           # CURRENT: ✓ BLOCKS (wrong)
```

The pattern `git\s+checkout\s+--\s+\.` matches **any** path argument starting with a dot (`.`), not just the bare `.` token. This blocked legitimate gate-reset operations (documented ritual per AGENTS.md § Stage 0 decision protocol).

**Issue B: Bypass via `git restore`**

```bash
git restore .                                  # CURRENT: ✗ ALLOWS (bypass)
git restore -- .                               # CURRENT: ✗ ALLOWS (bypass)
```

The `restore` command performs whole-tree discard but is not mentioned in the regex at all. Used today (mentioned in problem statement) — an unblocked destructive operation.

---

### 3. Proposed Regex Analysis

**Pattern:** `git\s+(checkout|restore)(\s+[^&;|]*)?\s+\.{1,2}/?(\s|$)`

**Breakdown:**
- `git\s+(checkout|restore)` — match checkout or restore command
- `(\s+[^&;|]*)?` — optional middle content (refs, options, etc.) but exclude shell operators
- `\s+\.{1,2}/?` — match whole-tree pathspec: bare `.`, `..`, `./`, or `../`
- `(\s|$)` — word boundary (space or end)

**Empirical test results:**

| Command | Should Block | Proposed Match | Status |
|---|---|---|---|
| `git checkout -- .` | ✓ | ✓ | ✓ CORRECT |
| `git checkout -- ..` | ✓ | ✓ | ✓ CORRECT |
| `git checkout -- ./` | ✓ | ✓ | ✓ CORRECT |
| `git restore .` | ✓ | ✓ | ✓ CLOSES BYPASS |
| `git restore -- .` | ✓ | ✓ | ✓ CLOSES BYPASS |
| `git checkout -- .agent/verification-gate.md` | ✗ | ✗ | ✓ FIXES FALSE POS |
| `git checkout -- .env` | ✗ | ✗ | ✓ FIXES FALSE POS |
| `git checkout HEAD -- .` | ✓ | ✓ | ✓ (explicit commit whole-tree discard) |
| `git restore --staged .` | ✓ | ✓ | ⚠ ACCEPTABLE STRICTNESS (only unstages, not destructive) |

**Verdict on regex correctness:** ✓ **SOUND for stated intent** (dot-token blocking).

---

### 4. Risk Assessment — Unaddressed Bypasses

The proposed regex **cannot** block these classes of commands because the git command is not in the expected position:

```bash
git -C /some/path checkout -- .              # PROPOSED: ✗ BYPASS (git -C option)
git --git-dir=.git checkout -- .             # PROPOSED: ✗ BYPASS (git --git-dir)
(cd . && git checkout -- .)                  # Not caught (subshell + parentheses)
GIT_AUTHOR_NAME=x git checkout -- .          # PROPOSED: ✗ (env var prefix)
pushd /path && git checkout -- .             # PROPOSED: ✗ (compound command)
```

**Nature:** These are not regex failures but **architectural limitations** — regex-based block cannot check git options inserted before the subcommand. This is a **known, acceptable looseness** in the current hard-stop architecture (the hook strips only quoted text and echo/commit, then applies regex; it does not parse git option syntax).

**Existing precedent:** The hook already permits bypasses via environment variables and subshell piping in the destructive-filesystem block (line 137) — same looseness.

---

### 5. Verification Tier & Test Strategy

**Tier: LITE** ✓ **DEFENSIBLE**

- Single regex line change in an existing control
- No new domains, no new Hard Stops
- Dynamic payload fixture tests (Control Tower responsibility) can verify the regex match behavior on a curated command list
- No production risk: this is a security gate, not code logic

**Test plan noted in Stage 0:** Pipe JSON payload `{"tool_input":{"command":"git checkout -- .agent/file.md"}}` into hard-stop.sh via stdin, assert `jq .continue == false/true` accordingly.

✓ **APPROVE strategy**, but recommend:
- Fixture tests should include both the false-positive cases (now allowed) and core bypass cases (now blocked)
- Test matrix should cover `checkout HEAD -- .`, `git -C`, `restore --staged` to document acceptable looseness

---

### 6. Subagent Topology & Skill Routing

**Classification: SINGLE_AGENT** ✓ **CORRECT**

Reasoning from Stage 0:
- Scope is one line (too small to brief a scoped coder)
- Verification is payload-based (fixture tests, no architecture/design review needed)
- Control Tower can implement + test inline
- git-safety skill is the control itself (not a matching skill but the target being fixed)

No subagent required. This is correctly routed as a quick-fix.

**Skill routing decision:**

| Skill | Check | Status | Reason |
|---|---|---|---|
| git-safety | "scoped commit, shell-context, merge" | SKIPPED | This change IS the git-safety control; not a consumer of git-safety. Routing check is a self-reference that doesn't apply. |
| security-pass | "verify hardening, pentest findings" | SKIPPED | Lite tier, scope is regex in existing gate. No new hardening surface. Change validates (fixes) the control. |

✓ **APPROVE**: Skip reasons are sound. The change is to the control itself, not work that uses the control.

---

### 7. Decision Quality

**Observations:**

1. **Problem statement is precise:** Identifies the exact regex fragment, the specific false positive (gate-reset ritual), and the actual bypass (restore command). Reproduces today's error.

2. **Proposed fix is justified:** The `(\s+[^&;|]*)?` middle group cleverly handles refs and options without breaking the pathspec boundary (`\.{1,2}/?`). The trade-off (blocking `restore --staged .`) is explicitly noted as acceptable.

3. **Looseness is documented:** Stage 0 acknowledges that `git -C` and similar option-based bypasses are out of scope for regex. This is consistent with the existing hook architecture (environment variables, subshells also slip through).

4. **Test strategy is sound:** Fixture payloads over regex linting is the right approach for a shell hook.

**Risk:** No evidence of rush, breadth-creep, or inadequate justification. The fix is conservative (dot-token only), not trying to solve all bypass classes at once.

✓ **APPROVE decision quality**.

---

## Recommendations

### Must Address (blocking quality)

**None.** The regex fix is materially sound. The false positive is fixed, the core bypass (restore) is closed, and acceptable looseness is documented.

### Should Address (improves robustness)

1. **Fixture test matrix:** When implementing the dynamic tests (noted in Stage 0), include:
   - ✓ Single-file gate-reset cases (now allowed): `.agent/file`, `.env`, `./.env`
   - ✓ Whole-tree cases (now blocked): `.`, `..`, `./`, `../`
   - ✓ Restore bypass (now blocked): `restore .`, `restore -- .`, `restore -f .`
   - ⚠ Edge case (acceptable block): `restore --staged .`
   - ✗ Known bypasses (document as limitation): `git -C /path checkout -- .` (will NOT block)

   This test matrix will serve as inline documentation of what the regex actually covers.

2. **Update hard-stop.sh comment (optional):** The comment above line 64 could note:
   ```bash
   # ── destructive git ops ──────────────────────────────────────────────
   # Blocks: git checkout -- ., git restore ., git reset --hard, force-push, etc.
   # Known bypasses (not regex-detectable): git -C, git --git-dir (option-based).
   # These represent acceptable architectural looseness matching existing hook patterns.
   ```

   This preempts future questions about git-option bypasses.

### Might Consider (optional refinement)

- Consider a follow-up Work Block to harden the hook against option-based bypasses (e.g., by parsing `git --help` or using a git-command AST library). This is lower priority because:
  - Current looseness is consistent with existing patterns (env vars, subshells also leak)
  - An attacker would need shell access to write the command in the first place
  - Regex-based hooks have architectural limits; a future control might use a git config or hook-engine library

---

## Inspection Gaps

None identified. The regex behavior was verified empirically; AGENTS.md Hard Stops context is clear; and the Stage 0 decision rationale is sound.

---

## Conclusion

The proposed regex fix is **correct for the stated intent** and the decision to use SINGLE_AGENT + lite-tier fixture tests is appropriate. The fix closes the two real problems (false positive, restore bypass) without introducing new risks. Known bypasses via git options are within acceptable looseness for the regex-based hook architecture.

**Recommend: Approve, with fixture test matrix documented per "Should Address" #1.**

---

**CRITIC VERDICT: SUPPLEMENT — Add fixture test matrix documentation (recommended in "Should Address" section) before Stage 1 implementation. No blocking issues; the regex fix itself is sound.**
