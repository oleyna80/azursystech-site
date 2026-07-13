# SDLC Protocol — Stage Definitions

> Defines the 4-stage pipeline: Plan & Discover, Implement, Verify, Sync & Report.
> Referenced by AGENTS.md § Stage Flow.

---

## Workflow Mapping

Project shorthand maps to the 4-stage SDD pipeline as follows:

| Project workflow | SDD stage |
|---|---|
| Plan / Spec | Stage 0: Plan & Discover |
| Implementation | Stage 1: Implement |
| Review / Verification | Stage 2: Verify |
| Closeout / SSOT Sync / Owner report | Stage 3: Sync & Report |

`.agent/critic-gate.md` and `.agent/verification-gate.md` are evidence
contracts. A runtime may enforce them with hooks, but the policy is valid even
when no mechanical hook script is installed.

## Stage State Machine

```
blocked → ready → in_progress → completed
  ↑                      ↓
  └──────── retry ───────┘
```

States:
- **blocked** — dependency not met, Hard Stop triggered, or Owner approval needed
- **ready** — dependencies cleared, write gate open, ready to execute
- **in_progress** — currently executing
- **completed** — required stage work and evidence are complete; this does not
  imply that verification passed

Track these fields separately:

- **Stage execution state:** `blocked | ready | in_progress | completed`
- **Verification verdict:** `READY | BLOCKED | UNVERIFIED`
- **Stage 3 mode:** `success-closeout | reporting-only`

Only `READY` permits `success-closeout`. `BLOCKED` or `UNVERIFIED` permits
Stage 3 reporting work only: the task remains blocked, corrective action or an
unresolved dependency is recorded, and no promotion, merge, deploy,
release-ready statement, successful closure, or completed task state is allowed.

---

## Stage 0: Plan & Discover

**Owner:** Control Tower
**Write authority:** approved control-layer paths such as `AGENTS.md`,
`PROJECT_MAP.md`, `FILE_REGISTRY.yml`, `.agent/README.md`,
`.agent/ROSTER.md`, `.agent/critic-gate.md`, `.agent/verification-gate.md`,
`.agent/workflows/**`, approved `.agent/skills/**`, safe `.codex/**`
policy/templates/hooks, `docs/session-bootstrap.md`, `scripts/bootstrap.sh`,
`docs/engineering-memory/**`, `docs/plans/**`, `docs/specs/**`,
`docs/tasklist/**`, `docs/templates/**`, and `memory_bank/**`

### Entry Conditions
- Work Block framed by Owner or Control Tower
- Session Start Read Set loaded

### Activities
1. **Parallel Decomposition Matrix** — classify: domains, files, side-effect class, DB mode, hard stops, verification tier
2. **Skill Routing Gate** — check `.agent/ROSTER.md`, match approved or local
   skill files when present, record decisions and unavailable skill files
3. **Subagent Topology** — classify `Subagent-Required` triggers, plan dispatch
4. **Preflight** — output Stage 0 Preflight block: skills, subagent topology, side-effect class, DB mode, hard stops, write gate status
5. **Research** — if needed, launch `solution-architect` for pre-implementation analysis
6. **Critic Review** — launch `critic` agent to independently review Control Tower decisions (scope, skill routing, skip reasons, risk gaps) according to the trigger tables below.
7. **Independent Critic Review** — native Codex Critic is the ordinary read-only gate. Request a second runtime only for an explicit risk trigger (conflicting evidence, high-impact security, or Owner request); record its scope and any degraded result without making Codex MCP a prerequisite.
8. **Plan Approval** — produce plan, get Owner approval if non-trivial
9. **Runtime capacity prerequisite** — for runtime/configuration/infrastructure
   Work Blocks, run `scripts/agent-runtime-doctor.sh` before implementation or
   formal verification. Record every `WARN`/`BLOCKED` result as
   `incident: agent-runtime`; repository policy may diagnose capacity, but only
   an Owner-authorized host action may change host limits.

### Stage 0 Trigger Tables

File-count triggers count planned implementation/write-set files only. Reports,
logs, gates, and other lifecycle evidence artifacts are excluded.

| Critic required when any condition matches | Skip rule |
|---|---|
| 3+ planned implementation files | Owner approval required to skip |
| Side-effect class is production code write or higher | Owner approval required to skip |
| New subagent topology | Owner approval required to skip |
| 2+ matched skills are skipped | Owner approval required to skip |
| Security, auth, payments, DB, deploy, or external provider work | Owner approval required to skip unless listed as no-skip |

No-skip domains are first Work Blocks in authentication/authorization,
payments/billing, database migration, a new service layer, and deploy or
infrastructure. Native Critic is required by the normal trigger table. An
independent second-runtime review is risk-driven and explicitly recorded.

### Exit Conditions
- Write gate: `READY`
- Critic verdict: APPROVE or SUPPLEMENT (if RECONSIDER — re-run Stage 0 with corrections)
- Optional independent second-runtime result recorded when explicitly requested
- `.agent/critic-gate.md` records evidence-backed critic/GPT critic status before source edits
- Plan approved (for non-trivial work)
- All matched skills recorded (used or skipped with reason)

---

## Stage 1: Implement

**Owner:** Scoped Coder (one per write-set)
**Write authority:** Approved write-set only (see File Write Authority in AGENTS.md)

### Entry Conditions
- Write gate: `READY`
- Approved plan or task description
- Approved write-set
- Side-effect class and DB mode classified

### Activities
1. Read plan, task description, AC, relevant code
2. Implement changes within approved write-set
3. Run Pre-Edit Lifecycle Check for recently created files
4. Self-check: scope not expanded, no secret leakage, no Hard Stop triggered
5. Report: `DONE` / `DONE_WITH_CONCERNS` / `NEEDS_CONTEXT` / `BLOCKED`

### Exit Conditions
- All planned changes implemented
- No scope creep
- Report filed with change summary

---

## Stage 2: Verify

**Owner:** Verifier (read-only)
**Write authority:** `docs/reports/*` (verification artifacts only)

### Entry Conditions
- Implementation complete (Stage 1 DONE)
- Verification tier specified (lite/standard/full)

### Verifier Isolation Decision Table

Choose the required isolation before implementation. A native same-session
Verifier shares the parent runtime and is useful for advisory feedback, but it
does not close `READY`. Freeze the implementation diff before launching an
independent root.

| Condition | Required Verifier Isolation | Formal closeout mode |
|---|---|---|
| Quick-fix / non-sensitive, Lite | `same-session-degraded` | `ct-inline` is allowed with `Sensitive Domains: none` |
| Non-sensitive Standard work | `same-session-degraded` or higher | `ct-inline` only at same-session; use a separate root when independent evidence is needed |
| Auth, security, hooks, runtime/config, production-sensitive work | `independent-readonly-root` | Separate top-level readonly Codex root after diff freeze |
| Credentials, live DB, deploy, live infrastructure, external providers | `os-isolated` | Separate OS user/container/equivalent with readonly source, clean `HOME`/Codex config, and no `.env`, SSH, provider, or runtime credentials |

`independent-readonly-root` uses the readonly profile (`read-only` sandbox and
`never` approval) and is a filesystem-write boundary only; it is not proof of
credential or network isolation. `os-isolated` is required when that stronger
boundary matters. The hook validates the declared `Required Verifier Isolation`
and `Verifier Isolation` fields against a closed vocabulary and ordering; it
does not prove the claimed runtime isolation. Control Tower records the launch
evidence in the verification report.

For a Codex independent-readonly-root, Control Tower (not a native subagent)
runs `scripts/run-independent-verifier.sh` after the diff is frozen. The
command requires an Owner-provisioned, mode-`0700` `CODEX_VERIFIER_HOME` with a
readonly profile. The runner must never copy, inspect, print, create, or change
credentials. Its fixture suite is a separate local-mutation test and cannot be
used as formal readonly evidence.

### Activities

#### Lite Tier
- [ ] Changed files match task description
- [ ] No obvious regressions
- [ ] Types pass (`npx tsc --noEmit`)
- [ ] Build succeeds
- [ ] Tests pass

#### Standard Tier (extends Lite)
- [ ] Route contract: URLs return expected status codes
- [ ] Schema contract: field keys, types match spec
- [ ] Anchor targets exist
- [ ] No new dev server errors
- [ ] Security baseline: no secrets, injections, parameterized queries
- [ ] Production Maintainability Standard met

#### Full Tier (extends Standard)
- [ ] STRIDE-lite threat model verified
- [ ] Security review checklist complete
- [ ] `scripts/secret-scan.sh staged` clean
- [ ] `npm audit --omit=dev --audit-level=high` clean
- [ ] Runtime proof via `curl -fsSI`
- [ ] CSP/security headers verified
- [ ] CSRF/origin guard for mutations
- [ ] Codex adversarial review (if Codex installed) — second opinion from GPT model family
- [ ] Consolidation: merge Verifier + Codex findings
- [ ] Runtime/config/infrastructure work: `scripts/agent-runtime-doctor.sh`
  has no `BLOCKED` result; record `WARN` as `incident: agent-runtime`

### Exit Conditions
- Verdict: `READY`, `BLOCKED`, or `UNVERIFIED`
- All blockers documented with file:line evidence
- Verification report written to `docs/reports/`
- GPT verifier second opinion completed or degraded reason recorded when its trigger matched
- `.agent/verification-gate.md` records evidence-backed verifier/GPT verifier status,
  required isolation, actual isolation, and launch evidence before closeout

---

## Merge Protocol (Parallel Agents Only)

**Owner:** Control Tower
**Write authority:** `docs/reports/*`, `memory_bank/*`

> Runs between Stage 2 and Stage 3 when 2+ subagents were dispatched in parallel.
> Skip for single-agent or sequential Work Blocks.

### Entry Conditions
- All parallel subagents completed (or timed out)
- Snapshot exists from pre-dispatch (via `context-snapshot`)

### Activities
1. **Collect** — gather all subagent reports from `docs/reports/` or direct outputs
2. **Deduplicate** — group findings by `file:line`; same finding from multiple agents → one merged entry
3. **Detect conflicts** — same file, different verdicts → apply conflict resolution rules:
   - READY vs ISSUES → ISSUES wins (conservative)
   - ISSUES vs BLOCKED → BLOCKED wins
   - Two different ISSUES on same file → both included
   - Unresolvable contradiction → escalate to Control Tower (hard stop)
4. **Classify** — rate each finding: P0 (must fix) / P1 (should fix) / P2 (might fix) / Accepted
5. **Produce consolidation report** — save to `docs/reports/consolidation-[wb-id]-[stage]-[date].md`
6. **Update logs** — `orchestrator-log.md` + `review-log.md`

### Exit Conditions
- Consolidation report written
- All conflicts resolved or escalated
- BLOCKED verdicts addressed (corrective Work Block or Owner acceptance)
- Consolidation decision: PROCEED / ESCALATE / RERUN

---

## Stage 3: Sync & Report

**Owner:** Control Tower
**Write authority:** `docs/reports/*`, `memory_bank/*`, `docs/tasklist/*`

### Entry Conditions
- Verification evidence complete with verdict `READY`, `BLOCKED`, or `UNVERIFIED`
- If parallel agents were used: consolidation report written, conflicts resolved

### Activities
1. **Classify closeout** — `success-closeout` only for `READY`; otherwise
   `reporting-only`
2. **SSOT Sync** — update tasklist status, memory_bank context/progress/decisions
3. **Crash Test Gate** — if routes changed: run local crash test
4. **Closeout Report** — summarize: what was done, verification result, consolidation (if parallel), risks accepted, follow-ups
5. **Owner Report** — present closeout summary

### Exit Conditions
- Memory bank updated
- Tasklist updated; non-`READY` tasks remain blocked
- Closeout report written
- Owner notified

---

## Quick-Fix Path

Skip Stages 0, 2, 3 only for trivial changes: at most 2 planned
implementation/write-set files, excluding lifecycle evidence, and no logic,
route, schema, API, security, or governance impact.
Flow: Implement (Lite self-check) → Inline sync → Done.
Still applies: Hard Stops, secret scan, no scope expansion.
