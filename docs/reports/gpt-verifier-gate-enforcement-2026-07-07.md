# GPT Verifier Report — WB-2026-07-06-gate-enforcement

**Date:** 2026-07-07  
**Base:** 8e41df2 (`feat(agent): add sprint-analysis skill`)  
**Head:** 97ed579 (`feat(hooks): enforce skill routing, write-set amendment, verifier identity`)  
**Focus:** Adversarial verification of hook-enforced gate rules: Skills Routing field, write-set amendment channel, verifier identity + sensitive domain waiver  
**Tier:** Full (security-critical gate logic)  
**Mode:** Read-only verification via Codex MCP (OpenAI GPT)  
**Codex Session:** 019f3bf3-5d54-78b3-acff-79118d3691f5  

---

## Findings

| # | Severity | Category | Finding | File:Line | Recommendation |
|---|---|---|---|---|---|
| 1 | CRITICAL | Security | Amendment and verifier-waiver log entries can be forged by author-field substitution; checks do not validate trailing `\| Control Tower \|` or `\| Owner \|` actor fields | critic-gate.sh:141–148; verification-gate.sh:111–115 | Parse pipe-delimited fields and enforce exact actor match: `grep "^\| ${today} \| ${wb_id} \| amendment:"` → exact prefix, not substring. Or validate full entry shape including actor. |
| 2 | MAJOR | Logic | WB-id substring collisions authorize wrong Work Block; `WB-A` matches lines for `WB-ABC` | critic-gate.sh:143; verification-gate.sh:112 | Replace `grep -F -- "$wb_id"` with exact boundary: `grep -F "\| ${wb_id} \|"` or parse delimited fields and compare second field exactly. |
| 3 | MAJOR | Logic | Amendment check satisfied by any prose mention in report, not an Approved Write-Set bullet line; AGENTS.md requires write-set "verbatim, one path per line" | critic-gate.sh:139 | Parse only the `Approved Write-Set:` section (lines between marker and next field). Require exact bullet-line match: `\- ${matched_pattern}` or `* ${matched_pattern}`. |
| 4 | MAJOR | Logic | Skills Routing placeholder validation misses malformed bracket-prefix and mixed-case variants; `[PENDING` and `Pending` bypass `is_placeholder()` | critic-gate.sh:39–46; critic-gate.sh:190–191 | Reject any value containing `[` or `]` for Skills Routing. Normalize to lowercase before placeholder check (similar to Sensitive Domains line 93 in verification-gate). |
| 5 | MINOR | Coverage | Fixture suite does not cover full-tier / new-domain / GPT critic enforcement in critic-gate | gate-fixtures.sh:32–38 | Add test cases for `Verification Tier: full`, `New Domain: true`, `Critic Verdict: RECONSIDER`, and corresponding `GPT Critic Status: NOT_REQUIRED` denial / `READY` report / `DEGRADED` log. |
| 6 | MINOR | Coverage | Fixture suite missing adversarial edge cases: fake author in amendment/waiver, WB-id prefix collision (`WB-A` vs `WB-ABC`), prose-only path mention in report, malformed Skills Routing (`[PENDING`, `Pending`) | gate-fixtures.sh:144–175; gate-fixtures.sh:247–260 | Extend fixtures with: author-field forging, WB-id boundary tests, report with prose-only mention, and bracket/case placeholder variants. |

---

## Confirmed Non-Issues (No Regression)

✅ **Directory-prefix matching:** `src/` correctly matches `src/deep/nested/file.ts` via bash glob `[[ "$rel_path" == "$pattern"* ]]` at critic-gate.sh:119.

✅ **Glob metachar safety:** Pattern `src/a?b.ts` matches `src/aXb.ts` (intended glob), not `src/b.ts`. Bash glob `?` = single char optional, not alternation. Fixture line 170 confirms this.

✅ **Ordering:** Path allowance (critic-gate.sh:208) precedes amendment enforcement (critic-gate.sh:268). No bypass via reordering.

✅ **Session lock:** Validated before path check (critic-gate.sh:201–206). Correct sequencing.

✅ **Expires format:** YYYY-MM-DD regex and date comparison correct (critic-gate.sh:195–199).

✅ **Whitespace handling:** Field parsing via `xargs` (critic-gate.sh:35) normalizes leading/trailing space. No word-splitting vulnerability.

---

## Edge Cases & Design Assumptions

### Trust Model

The hooks enforce gates as **cooperative enforcement**, not cryptographic security:

- `.agent/*gate.md` files are assumed honest (may be edited by Control Tower on-the-fly).
- `memory_bank/orchestrator-log.md` is assumed an immutable audit log (but can be edited with write access to the directory).
- Critic and Verification Reports are assumed well-formatted, but the hook does not parse sections (reads entire file).
- **Actor fields** (`| Control Tower |`, `| Owner |`) are **not validated** — a coder with write access to the log can add fake entries with any author.

This is acceptable for advisory gates (workflow sanity checks), but **not suitable for adversarial enforcement** (e.g., compliance audit, security boundary).

### Assumptions Not Enforced

1. **WB-id uniqueness:** No check that `WB-TEST-gate` is a globally unique ID. Prefix collision (`WB-A` vs `WB-ABC`) causes false authorization.
2. **Report section structure:** Amendment check searches entire report file, not just the `Approved Write-Set:` section. A path mentioned in prose passes the check.
3. **Bracket variants in placeholders:** Only exact `[*]`, `PENDING`, `pending`, `none`, `NONE` rejected. `[PENDING`, `Pending`, `[none]` pass through.
4. **Actor field presence:** Amendment/waiver entries are accepted if they have the right date/WB/action, regardless of who claimed to author them.

---

## Blind Spots (What Claude-Only Review Might Miss)

1. **"Fixed-string" ≠ "boundary-safe":** The phrase "all lookups fixed-string (`grep -F`)" suggests strong security, but `grep -F` only prevents regex metachar injection. It does not enforce field delimiters, author identity, or report-section semantics. A false sense of security.

2. **Cooperative vs. adversarial enforcement:** The gate assumes Control Tower and coders are cooperative agents. If the threat model changes (e.g., compromised coder account, malicious commits in shared log), the gates become ineffective. A Claude review might not question this assumption.

3. **Amendment/waiver author forgery:** The fact that `| Control Tower |` and `| Owner |` are not validated is a significant trust assumption. A Claude review might not surface this as a gap if it focuses on "did the log entry exist?" rather than "is the actor field correct?"

4. **WB-id collision as a logic bug, not a domain issue:** A Claude review might dismiss WB-id collisions as a "domain assumption" rather than a code bug. In fact, the hook's `grep -F -- "$wb_id"` is insufficient; it should use delimited field matching.

5. **Report structure assumption:** The hook trusts that paths in the Critic Report's `Approved Write-Set:` section are distinct from prose. If a critic records "we approved src/extra.ts as a hotfix" in a comment, the amendment check passes. Claude might not spot this because it assumes well-structured reports.

---

## Security Assessment (STRIDE-Lite)

- **Spoofing (S):** Actor fields not validated → amendment/waiver entries can be forged by anyone with write access to memory_bank/.
- **Tampering (T):** Gate files and logs are text-based, not signed → can be modified without detection.
- **Repudiation (R):** No audit trail of who created gate entries (author field is not validated).
- **Information Disclosure (I):** No secrets stored in gate files; low risk.
- **Denial of Service (D):** Gate logic is simple bash; no DoS vectors identified.
- **Elevation of Privilege (E):** Author forgery in amendment/waiver could allow unauthorized scope expansion.

---

## Contract Compliance

✅ **Skills Routing field:** Correctly required for all gated edits (AGENTS.md line 479).  
✅ **Amendment channel:** Correctly requires same-day orchestrator-log entry for unapproved write-set patterns (AGENTS.md line 485).  
✅ **Verifier identity:** Correctly requires `Verifier: subagent | ct-inline` and `Sensitive Domains` classification (AGENTS.md line 490–491).  
⚠️ **Amendment/waiver actor validation:** Not specified in AGENTS.md, but implied by log entry format `| Control Tower |` / `| Owner |`. Implementation does not validate.

---

## Recommendations

### Immediate (Critical)

**1. Fix log entry parsing to enforce actor fields:**

```bash
# Instead of (vulnerable):
grep "^| ${today} |" "$LOG_FILE" | grep -F -- "$wb_id" | grep -F "amendment" | grep -qF -- "$matched_pattern"

# Use (safer):
grep "^| ${today} | ${wb_id} | amendment: write-set + ${matched_pattern} -.*| Control Tower |$" "$LOG_FILE"
```

Or parse delimited fields explicitly:

```bash
awk -F'|' -v today="$today" -v wb="$wb_id" -v pat="$matched_pattern" \
  '$2 ~ /^ *'today' *$/ && $3 ~ /^ *'wb' *$/ && $4 ~ /amendment/ && $6 ~ /Control Tower/ {found=1} END {exit !found}' "$LOG_FILE"
```

**2. Fix WB-id substring collision:**

```bash
# Instead of:
grep -q "^|.*${wb_id}.*${needle}" "$LOG_FILE"

# Use:
grep -q "^| .* | ${wb_id} | .*${needle}" "$LOG_FILE"
```

**3. Enforce Skills Routing bracket rejection:**

```bash
# Instead of:
is_placeholder "$skills_routing"

# Use:
case "$skills_routing" in
  *[*|*\]*) deny "Critic gate: Skills Routing cannot contain brackets: ${skills_routing}" ;;
  pending|PENDING) deny "Critic gate: Skills Routing is placeholder: ${skills_routing}" ;;
esac
```

### Short-term (Major)

**4. Parse Critic Report for `Approved Write-Set:` section only:**

Extract the section between `Approved Write-Set:` and the next field, then match only bullet lines.

**5. Extend fixture coverage:**

Add 6–8 adversarial test cases for author forgery, WB-id collisions, prose-report matches, and bracket/case variants.

### Long-term (Design)

**6. Consider signing gate files and log entries** if the threat model escalates to untrusted coders.

**7. Document trust assumptions explicitly** in AGENTS.md § Hook-Enforced Gate Rules.

---

## Verification Method

- Codex (OpenAI GPT) analyzed hook shell scripts line-by-line.
- Simulated bash word-splitting, glob behavior, and grep patterns.
- Cross-checked against fixture test cases (34 fixtures run; all pass).
- Tested for placeholder variants, substring collisions, and report-parsing edge cases.
- No mutations performed; all analysis was read-only.

---

## Verdict

**Status:** BLOCKED (security-critical issues require fixes before merge)

**Why blocked:**

1. **CRITICAL:** Amendment and waiver entries can be forged by author-field substitution (findings #1). This breaks the audit-trail assumption and allows unauthorized scope expansion.
2. **MAJOR:** WB-id substring collision (#2) causes wrong Work Blocks to authorize each other.
3. **MAJOR:** Amendment check passes on prose mentions, not just Approved Write-Set lines (#3), violating AGENTS.md contract.
4. **MAJOR:** Skills Routing placeholder detection is incomplete (#4), allowing bracket-prefix and mixed-case bypasses.

**Path forward:**

1. Patch actor-field validation in amendment/waiver lookups (Codex finding #1).
2. Fix WB-id and actor-field delimited parsing (findings #1, #2).
3. Add report-section parsing for Approved Write-Set (finding #3).
4. Tighten Skills Routing placeholder detection (finding #4).
5. Extend fixture suite with adversarial cases (findings #5, #6).
6. Re-run fixtures; confirm all pass.
7. Update AGENTS.md to document trust assumptions explicitly.

**Security tier:** Full verification required before re-submission.

---

## Session Info

- **Tool:** Codex MCP (GPT-4 via OpenAI API)
- **Mode:** Read-only adversarial verification
- **Time:** 2026-07-07 ~13:30 UTC
- **Files analyzed:** critic-gate.sh, verification-gate.sh, gate-fixtures.sh, AGENTS.md (Hook-Enforced Gate Rules)
- **Lines of code reviewed:** ~800 (hooks + fixtures + docs)
- **Test cases checked:** 34 (all passing in current tree)
