---
name: sprint-analysis
description: Sprint/period analysis over memory_bank/orchestrator-log.md and git history — velocity by Work Blocks, WB outcomes, process quality (critic verdicts, incidents, false-READY), scope creep, WB↔commit linkage. Use whenever the Owner asks to analyze a sprint, week, or period of work, asks "what did we ship", "how did the process go", wants a retro with numbers, or mentions velocity, план/факт, incidents, or scope creep — even without the word "sprint".
user-invocable: true
allowed-tools:
  - Read
  - Bash(bash .agent/skills/sprint-analysis/scripts/*)
  - Bash(git log *)
  - Bash(git diff *)
  - Bash(grep *)
  - Bash(rg *)
  - Bash(cat *)
  - Bash(head *)
  - Bash(tail *)
  - Bash(wc *)
  - Bash(sort *)
  - Bash(ls *)
  - Bash(date *)
---

# sprint-analysis: Work Block Sprint Analytics

> Quantitative + qualitative analysis of a work period. Data sources:
> `memory_bank/orchestrator-log.md` (Work Blocks, verdicts, incidents) and
> git history (commits, churn). Read-only: this skill never edits the log,
> gates, or source; the only write it may produce is a report under
> `docs/reports/` — and only when the Owner asks for a file.

## Authority

Control Tower, inline. No critic gate needed (no repo writes except
gate-exempt `docs/reports/`). Complements `memory-ops`/ops-review: ops-review
digs into operational friction; sprint-analysis measures the sprint.

## Period Selection

- Owner names dates or a WB list → use those.
- "последний спринт", "за неделю", no period → **default: last 7 days**.
- Log entries carry `YYYY-MM-DD` in column 1 — no other timestamps exist, so
  day is the finest granularity.

## Workflow

1. Extract raw data (one call, no context waste):
   `bash .agent/skills/sprint-analysis/scripts/extract.sh [SINCE] [UNTIL]`
   Emits: log rows in period, per-WB event counts, evidence-gap heuristics,
   trailer-first commit linkage, commits, file churn, and a period-end
   repository snapshot.
2. If a WB's story is unclear from counts, read its rows in the extract
   output (they carry full reasons) and, when referenced, the report files
   in `docs/reports/`.
3. Compute the four metric groups below. Where a metric is a judgment call
   (scope creep, WB↔commit mapping), say it is heuristic — do not present
   guesses as facts.
4. Reply in chat using the report template. Write
   `docs/reports/sprint-<UNTIL-date>.md` only if the Owner asks for a file.

## Metric Groups

**1. Velocity & outcomes.** WB count in period; per day. Outcome per WB from
its latest events: `done` (verification READY, or SKIPPED with quick-fix),
`in-flight` (critic/implementation without verification), `abandoned` (no
events after >1 day and no commit). Type mix from WB names and commit
prefixes (feat/fix/docs/chore/ops).

**2. Process quality.** Critic verdict distribution (APPROVE / SUPPLEMENT /
RECONSIDER / SKIPPED — and SKIPPED share); verification tiers used;
`incident:` entries verbatim (these are the most valuable rows in the log);
false-READY or re-verification mentions; DEGRADED events; repeated friction
(same obstacle in 2+ WBs).

**3. Scope creep (heuristic).** Write-set amendments after Stage 0 (entries
mentioning amended/added write-set); WBs spawned by findings of another WB
(fix-WBs created same/next day citing a discovery); critic RECONSIDER
rounds; quick-fixes that grew into full WBs.

**4. Git linkage and evidence gaps.** Use the extractor's `COMMIT LINKAGE`
section as the authoritative first pass. It parses commit trailers with
`git interpret-trailers --parse` and emits stable classes: `trailer`,
`legacy`, `missing`, `malformed-trailer`, and `multiple-valid-trailers`.
Exactly one valid canonical `Work-Block` trailer wins over subject/date or
same-day heuristics. `legacy` IDs are compatibility evidence only; malformed
or multiple valid trailers remain unresolved. Subject/date overlap may be
reported only as secondary heuristic evidence and never as a governance
breach by itself. Read the extractor's evidence-gap section before making a
judgment. Flag WBs with implementation/DONE rows but no verification row,
WBs with verification READY/SKIPPED but weak commit linkage, and commits with
no explicit WB reference as evidence gaps worth a process note, not an
accusation.

**5. Improvement candidates.** When the period exposes repeated friction,
missed evidence, or a clear recurring pattern, surface follow-up candidates
for the Owner. Classify each candidate as one of:
`skill-update`, `skill-create`, `skill-archive`, `agent-prompt`, `template`,
`workflow`, `hook`, or `no-action`. Every candidate must include source
evidence, the problem observed, the proposed change, expected effect, risk,
verification, and disposition. Recommendations are advisory only and do not
authorize changes.

## Report Template (chat)

Keep it scannable — numbers first, then the 2–4 findings that deserve the
Owner's attention. Skip empty sections silently.

```
## Sprint <SINCE>..<UNTIL>

**Velocity:** N WB (X done, Y in-flight, Z abandoned) · M commits · mix: ...

**Process:** critic A/S/R/skip · incidents: N · <one-line quality signal>

**Findings:**
1. <the thing that most deserves attention, with WB/commit refs>
2. ...

**Improvement candidates:** <evidence-backed follow-ups only; each item names
the classification, source evidence, problem, proposed change, expected
effect, risk, verification, and disposition. Recommendations here do not
authorize edits or policy changes.>

**Recommendation:** <1–2 concrete process adjustments, only if warranted>
```

## Honesty Rules

The log is written by the same agents it measures. Treat `verification:
READY` as a claim, not proof — if a READY has a report file, it is stronger
evidence than a bare entry. Incidents are under-reported by nature; absence
of incidents is weak evidence of a clean sprint. Never inflate: an empty or
thin period is a valid result ("2 WB, both docs — quiet week"), not a
failure to analyze.

Evidence-gap sections emitted by the extractor are heuristics, not verdicts.
They are useful smoke alarms: report them as candidates for human review, then
cross-check the relevant WB plan, reports, and commit subjects before saying a
process breach definitely happened. The period-end repository snapshot is
also a caveat: dirty, ahead, unpushed, or unavailable-upstream state limits
evidence completeness but is not an automatic governance breach. Never emit
`READY` when required evidence is missing, unresolved, or contradicted. Use
`UNVERIFIED` when evidence is missing but analysis can continue, `DEGRADED`
for partial evidence with an explicit caveat, and `BLOCKED` when a required
source is unavailable and the result cannot be substantiated.
