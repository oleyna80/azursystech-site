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
   Emits: log rows in period, per-WB event counts, commits, file churn.
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

**4. Git linkage.** Commits in period vs WBs: map by same-day + subject
overlap (heuristic — say so). Flag: WBs with verification READY but no
matching commit (unshipped work), commits with no WB (out-of-process
change — worth a process note, not an accusation).

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

**Recommendation:** <1–2 concrete process adjustments, only if warranted>
```

## Honesty Rules

The log is written by the same agents it measures. Treat `verification:
READY` as a claim, not proof — if a READY has a report file, it is stronger
evidence than a bare entry. Incidents are under-reported by nature; absence
of incidents is weak evidence of a clean sprint. Never inflate: an empty or
thin period is a valid result ("2 WB, both docs — quiet week"), not a
failure to analyze.
