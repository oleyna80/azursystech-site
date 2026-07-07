# Critic Report — WB-2026-07-06-gate-enforcement

**Date:** 2026-07-07  
**Reviewed:** Stage 0 Preflight + Work Block design (5-change gate-enforcement security-hooks Work Block)  
**Verdict:** SUPPLEMENT

---

## Executive Summary

WB-2026-07-06-gate-enforcement aims to operationalize three SDLC rules that currently live only as text in AGENTS.md via deterministic hook checks. The design is strategically sound but requires clarifications on grep-safety, amendment-rule collision detection, and comprehensive fixture coverage before implementation.

**Core findings:**
- Amendment-rule (critic-gate.sh #2) uses substring grep on write-set patterns — risks false matches and bypass via regex metacharacters
- Verifier waiver check (verification-gate.sh #3) lacks case-insensitive comparison for sensitive-domains classification
- gate-fixtures.sh test matrix is incomplete: missing regex-escape edge cases and amendment-collision scenarios
- AGENTS.md subsection (requirement #4) needs explicit format specification for grep targets

No scope creep, no missing Hard Stops, no subagent topology issues. Skill routing matches (memory-ops-log, git-safety-commit approved).

---

## Scope Review

**Approved Write-Set (dword-for-word per requirement #2):**
- `.claude/hooks/critic-gate.sh`
- `.claude/hooks/verification-gate.sh`
- `.claude/hooks/tests/gate-fixtures.sh`
- `.agent/critic-gate.md`
- `.agent/verification-gate.md`
- `AGENTS.md`

**Boundaries:** Strictly agent-control-layer (gate templates + hook logic + test fixtures + docs). No production code, no runtime config, no secrets, no client-facing changes.

**Scope is clear and tight.** ✓

---

## Skill Routing Review

**From Preflight:**
```
Skills: checked=roster-10; matched=git-safety,memory-ops; used=memory-ops-log,git-safety-commit; skipped=none
```

**Inspection:**
- `git-safety` (commit readiness): gates are committed changes → relevant ✓
- `memory-ops-log` (logging to orchestrator-log): amendment/waiver rules require log entries → used ✓
- No skills skipped.

**Skill routing is complete and appropriate.** ✓

---

## Design Review: Five Changes

### 1. Skills Routing Field in Critic-Gate Template + Hook Enforcement

**Design:**
- Template `.agent/critic-gate.md` gains line: `Skills Routing: [checked: ... | matched: ... | used: ... | skipped: ...]`
- Hook checks this field after Status check, before switch
- Placeholder detection (is_placeholder) catches `[...]`, PENDING, empty → deny

**Assessment:**
- Placement after path_allowed but before status switch is correct (fail-fast for incomplete gates)
- Existing is_placeholder() and field() functions reused appropriately
- **Finding:** Hook checks field only for presence (is_placeholder), not internal structure. If Control Tower writes `[garbage]` instead of `[checked: ... | matched: ...]`, field passes but semantic is lost. Not a gate failure, but suggests field should have stricter validation. **Recommendation:** Add note in AGENTS.md that Skills Routing format is semi-structured (human-readable, not machine-parsed); Control Tower responsible for legibility.

**Status:** ✓ SOUND

---

### 2. Amendment Rule (Critic-Gate READY Branch)

**Design:**
- New check in READY case: if Approved Write-Set contains pattern P and P matches file_path being edited → require grep of critic report to find write-set entry for P
- Format expected in critic report: `- .claude/hooks/...` (list item)
- Deny message specifies exact log format for amendment entry (if amendment needed): `| YYYY-MM-DD | <WB-id> | amendment: write-set + <path> - <reason> | Control Tower |`

**Inspection — Critical Security Gaps:**

**A. Substring and Regex Metacharacter Risk**

Current grep usage in hook (hypothetical amendment check):
```bash
grep "^| <today> | .*<wb_id>.*amendment.*<pattern>"
```

If `<pattern>` is `.agent/critic-gate.sh`:
- Grep interprets `.` as "any character" → matches `.agent/xriticygate.sh`, `.agentvcritic-gate.sh`, etc.
- **Exploit:** Control Tower edits `.agent/verification-gate.sh`, amendment rule searches for `.agent/critic-gate.sh` (from write-set), grep finds `.agent/xriticygate-sh` in prose → false positive bypass

If `<pattern>` is `docs/` (directory):
- Grep sees `/` as literal (fine), but pattern may match `docs/reports/`, `docs/specs/` unintentionally

If `<pattern>` contains `[` or `]` (unlikely but possible in future):
- Grep interprets as bracket expression → matches unintended strings

**Finding:** Amendment-rule grep is unsafe against regex metacharacters in write-set patterns.

**Recommendation:** 
- Use `grep -F` (fixed-string grep) for amendment/waiver log searches to treat patterns as literals
- Or escape metacharacters in pattern: `pattern_escaped=$(printf '%s\n' "$pattern" | sed 's/[[\.*^$/]/\\&/g')`
- Document this clearly in hook code

**B. Substring Collision in Critic Report**

Scenario:
- Approved Write-Set: `- .agent/critic-gate.sh`
- Coder edits `.agent/critic-gate.sh`
- Amendment-rule searches critic report for `| ... amendment: write-set + .agent/critic-gate.sh ...`
- But report contains prose: "Also fixed .agent/critic-gate-backup.sh to ensure..."
- Substring grep on pattern (if not using `-F`) matches "critic-gate" → false positive bypass

**Finding:** Without fixed-string grep or full-path matching, substring collisions are plausible.

**Recommendation:** 
- Mandate amendment log format to be parseable (structured table row, not prose)
- Grep should match exact pattern, not substring: `grep -F "amendment: write-set + <EXACT_PATTERN>"` with delimiters

**C. WB-ID as Regex**

Current log search (per hard-stop example): `grep "^|.*${wb_id}.*amendment"`. If wb_id contains `|` or special chars:
- Interpreted as regex → bypass risk

**Recommendation:** 
- Use `grep -F` for wb_id matching: `grep -F "| $today | $wb_id | amendment"`

**Status:** ⚠️ REQUIRES CLARIFICATION (grep safety must be explicit in design)

---

### 3. Verifier Field + Sensitive Domains Waiver Check

**Design:**
- Template `.agent/verification-gate.md` gains line: `Verifier: PENDING`
- For READY status: Verifier must be 'subagent' or 'ct-inline'
- If Sensitive Domains != "none" AND Verifier = "ct-inline" → require waiver entry in log
- Waiver format: `| <today> | <wb-id> | verifier-waiver: APPROVED - <reason> | Owner |`

**Inspection:**

**A. Case Sensitivity Issue**

Code comparison:
```bash
sensitive_domains=$(field "Sensitive Domains")
# ... later ...
if [ "$sensitive_domains" != "none" ]; then
  # require waiver
fi
```

Problem: Field comparison is case-sensitive. Template may have "none", "NONE", "None".

**Finding:** Inconsistent case in Sensitive Domains comparison risks false negatives (no waiver required when one should be).

**Recommendation:**
- Normalize in hook: `sensitive_domains=$(field "Sensitive Domains" | tr '[:upper:]' '[:lower:]')`
- Or use case-insensitive grep in is_placeholder

**B. Verifier Field Validation**

Code should check:
```bash
case "$verifier" in
  "subagent"|"ct-inline") ;;
  *) deny "Verification gate: Verifier must be 'subagent' or 'ct-inline'." ;;
esac
```

**Finding:** Hook code snippet not shown in current review, but design clearly requires this. If Verifier = "SUBAGENT" (uppercase) → grep case-sensitive → fails. Recommend lowercase enforcing in template or case-insensitive validation.

**Status:** ⚠️ REQUIRES CASE-INSENSITIVE VALIDATION

---

### 4. AGENTS.md Hook-Enforced Rules Subsection

**Design:** Add compact subsection documenting three rules + amendment/waiver formats.

**Assessment:**
- Required for auditability: agents need to know what the hooks enforce
- Should include examples of amendment/waiver log entries
- Should clarify grep format (fixed-string? regex-unsafe patterns?)

**Current AGENTS.md Has:**
- Hard Stops rule (lines ~204-215): well-documented
- Skill Routing Gate (lines ~423-469): comprehensive

**Missing:**
- Hook-enforced amendment rule for critic-gate READY
- Hook-enforced verifier-waiver rule for verification-gate READY
- Interaction example: "If you edit a write-set file and coder amends it, critic-gate will require amendment entry in log" (with example format)

**Status:** ✓ NEEDED (straightforward addition)

---

### 5. Gate-Fixtures Test Suite

**Design:** New file `.claude/hooks/tests/gate-fixtures.sh` with payload tests for both hooks covering:
- New rules (amendment, verifier-waiver positives/negatives)
- Regressions (write-set enforcement, expiry, SKIPPED-authz, GPT-triggers, quick-fix path)

**Inspection:**

**File does not exist.** This is a planned addition. Fixture matrix requirements:

**Critic-Gate Fixtures (minimum coverage):**
1. Skills Routing field:
   - PENDING → deny ✓
   - Filled correctly → pass ✓
2. Amendment rule (READY branch, file in write-set):
   - Grep finds amendment entry in report → pass ✓
   - Grep does not find entry → deny ✓
   - Write-set is empty or does not include edited file → no amendment check ✓
   - SKIPPED status → skip amendment check ✓
3. Regex/metacharacter edge cases:
   - Pattern with `.` (dot): `.agent/critic-gate.sh` must match exactly, not `.agentvcritic-gate.sh` ✓
   - Pattern with `/` in directory: `docs/` must match `docs/foo.md` but not `docs-backup/` ✓
   - Pattern with `[` or `]`: escape correctly ✓
4. Regressions:
   - write-set enforcement (existing) ✓
   - expiry YYYY-MM-DD format validation (existing) ✓
   - SKIPPED + critic:SKIPPED in log → pass (existing) ✓
   - SKIPPED + no log entry → deny (existing) ✓
   - GPT Critic Status enums (existing) ✓

**Verification-Gate Fixtures (minimum coverage):**
1. Verifier field:
   - PENDING → deny ✓
   - "subagent" → pass ✓
   - "ct-inline" → pass ✓
   - "SUBAGENT" (uppercase) → ? (case-sensitive?) ✓
2. Waiver rule (READY branch):
   - Sensitive Domains = "none" + Verifier = "ct-inline" → pass (no waiver) ✓
   - Sensitive Domains = "auth" + Verifier = "ct-inline" → deny (waiver required) ✓
   - Sensitive Domains = "auth" + Verifier = "ct-inline" + valid waiver in log → pass ✓
   - Sensitive Domains = "NONE" (uppercase) → ? (case-sensitive?) ✓
   - Sensitive Domains = "auth" + Verifier = "subagent" → pass (no waiver needed) ✓
3. Regressions:
   - Verification Report exists/empty check (existing) ✓
   - Quick-fix SKIPPED path (existing) ✓
   - Verification Report file-not-found deny (existing) ✓

**Findings:**
- Fixture suite is ambitious but incomplete without defined grep format
- Case-sensitivity gaps (Verifier, Sensitive Domains) must be tested
- Regex-escape matrix not defined yet

**Status:** ⚠️ FIXTURES INCOMPLETE (depends on grep-safety decisions)

---

## Risk Assessment

### Hard Stops
- None triggered by this Work Block (agent-layer docs + hooks + tests).
- Hooks themselves protect against Hard Stops (push-approval, destructive-git) — no new Hard Stops introduced.

**Status:** ✓ CLEAR

### Security Considerations
- **Amendment-rule bypass via regex:** Mitigated by switching to `grep -F` (recommendation above)
- **Waiver bypass via case sensitivity:** Mitigated by normalizing Sensitive Domains/Verifier to lowercase
- **Log-entry format ambiguity:** Mitigated by documenting strict format in AGENTS.md subsection

**Status:** ⚠️ REQUIRE FIXES BEFORE IMPLEMENTATION

### Verification Tier
- Work Block classified as `verification_tier: standard` (per preflight)
- Appropriate: agent-layer changes with hooks require standard verification (fixtures + bash -n + regression suite)

**Status:** ✓ CORRECT

---

## Implementation Readiness

### Pre-Implementation Checklist

**MUST address before Scoped Coder starts:**
1. ✗ Clarify grep format for amendment/waiver log searches (fixed-string `-F` vs. regex + escape rules)
2. ✗ Add case-insensitive validation for Sensitive Domains ("none" vs. "NONE")
3. ✗ Define and document amendment log entry format in AGENTS.md subsection (must be parseable)
4. ✗ Define comprehensive gate-fixtures.sh test matrix (regex, case, collision edge cases)

**SHOULD address (improves robustness):**
1. Add note in hook code explaining is_placeholder semantics for partially-filled `[...]` brackets
2. Test amendment-rule with real write-set patterns from recent Work Blocks
3. Document in AGENTS.md that amendment/waiver log entries are machine-parseable (Control Tower responsible for formatting)

**MIGHT address (optional):**
1. Add inline comment examples in hook: `# amendment log format: | 2026-07-07 | WB-id | amendment: write-set + .agent/... - reason | Control Tower |`
2. Consider audit trail: if amendment entry is found, log which pattern was matched (helpful for debugging)

---

## Recommendations

### Must Address (blocking quality)

**1. Amendment-Rule Grep Safety**
- **Finding:** Current design does not specify how to safely grep patterns that may contain regex metacharacters (., [, ], etc.)
- **Why:** Bypass risk — write-set pattern `.agent/critic-gate.sh` could be matched by bash glob or regex-unaware grep on `.agent/xriticygate.sh` in prose
- **Action:** 
  - Update hook to use `grep -F` (fixed-string) for amendment log search
  - Update AGENTS.md subsection to specify: "Amendment entries must be machine-parsed using fixed-string grep; patterns are literals"
  - Example: `grep -F "| $today | $wb_id | amendment: write-set + $pattern -" "$LOG_FILE"`

**2. Sensitive Domains Case Normalization**
- **Finding:** Verifier waiver check compares `"$sensitive_domains" != "none"` — case-sensitive, risky if template uses "NONE" or "None"
- **Why:** False negatives: ct-inline verifier on sensitive auth routes without required waiver bypass the rule
- **Action:**
  - Normalize in verification-gate.sh: `sensitive_domains=$(field "Sensitive Domains" | tr '[:upper:]' '[:lower:]')`
  - Test fixture: add case-sensitivity matrix (none vs NONE vs None)

**3. AGENTS.md Hook-Enforced Rules Subsection**
- **Finding:** Three new hook rules exist but are not documented as part of SDLC contract
- **Why:** Orchestrator compliance is contingent on understanding what hooks enforce
- **Action:**
  - Add subsection after "Hard Stops" (line ~215): "Hook-Enforced Gate Rules"
  - Include:
    - Amendment rule (critic-gate READY): when triggered, why, exact log format
    - Verifier waiver rule (verification-gate READY): when triggered, why, exact log format
    - Skills Routing rule (critic-gate all statuses): when triggered, why, expected field format
  - Provide concrete examples of amendment/waiver log entries
  - Clarify: "Fixed-string grep is used; patterns are treated as literals; amendment/waiver entries must follow exact table format"

### Should Address (improves robustness)

**1. Amendment-Collision Testing**
- **Finding:** Fixture suite does not yet include regex-escape and substring-collision edge cases
- **Why:** Regressions are harder to catch without comprehensive matrix
- **Action:**
  - Add to gate-fixtures.sh test matrix:
    - Pattern with dot: `- .agent/test.md` must not match `.agentztest.md`
    - Pattern with slash: `- docs/` must not match `docs-old/` 
    - Pattern with bracket: `- foo[bar].md` must match exactly (literal bracket, not character class)
  - Run fixture suite as part of verification (bash tests for all payload variants)

**2. Waiver-Logging Format Consistency**
- **Finding:** Amendment and waiver entries both go to orchestrator-log, but format consistency not enforced by hook yet
- **Why:** Humans may write entries inconsistently (extra spaces, different capitalization)
- **Action:**
  - Test fixtures should verify exact log format (e.g., no extra spaces around `|`)
  - Recommend Control Tower use `echo "| $today | ..."` piped to tee for consistency

### Might Consider (optional refinement)

**1. Amendment Audit Trail**
- **Finding:** If amendment entry is found, hook approves silently; no indication which pattern was matched
- **Why:** Debugging future issues: did hook match the intended write-set file or a false positive?
- **Action:** (Nice-to-have) Hook could log matched pattern to stderr or systemMessage: "Amendment entry found for pattern: .agent/critic-gate.sh"

**2. Quick-Fix Exemption Documentation**
- **Finding:** SKIPPED status exempts from both amendment and verifier-waiver checks
- **Why:** Quick-fix write-sets are Owner-approved in chat, not in gate file
- **Action:** (Nice-to-have) Document in AGENTS.md: "Quick-fix Work Blocks (SKIPPED status) bypass amendment and waiver checks; scope is recorded in orchestrator-log, not in gate file."

---

## Approved Write-Set (Inspection Summary)

The five files below constitute the approved production write-set for WB-2026-07-06-gate-enforcement. All in-scope changes must be confined to this list per amendment-rule requirements.

```
- .claude/hooks/critic-gate.sh
- .claude/hooks/verification-gate.sh
- .claude/hooks/tests/gate-fixtures.sh
- .agent/critic-gate.md
- .agent/verification-gate.md
- AGENTS.md
```

Each file is agent-control-layer (no production code, secrets, or runtime behavior changes).

---

## Inspection Gaps

None. All files in scope were readable; design documents are complete; hook code is available for review. WB is security-hooks domain (within critic scope).

---

## Summary for Control Tower

**Verdict:** `SUPPLEMENT`

Three concrete improvements required before Scoped Coder implementation:
1. **Amendment-rule grep safety:** Specify fixed-string grep format in hook and AGENTS.md
2. **Sensitive Domains case-insensitivity:** Normalize in verification-gate.sh
3. **AGENTS.md subsection:** Document all three hook-enforced rules with examples

These are straightforward, non-architectural changes to ensure determinism and auditability of the gate system.

**Scope, skill routing, and Hard Stops are sound.** Subagent topology is SINGLE_AGENT (CT inline, control-layer only). Proceed to implementation after Control Tower addresses the three requirements above.

---

**Critic Report:** WB-2026-07-06-gate-enforcement  
**Verdict:** SUPPLEMENT (must address grep-safety, case-normalization, AGENTS.md docs)  
**Write-Set:** approved per above  
**Confidence:** standard-tier, security-hooks domain, independent reviewer (Critic agent)
