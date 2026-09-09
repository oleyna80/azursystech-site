# Engineering Memory

This directory stores durable `azursystech` engineering memory that future
humans and agents should be able to trust without reading old chat history.

## What Belongs Here

- Architecture, runtime, integration, and delivery decisions that affect future
  Work Blocks.
- Source-of-truth chains for important project questions.
- Temporary exceptions with expiry or review triggers.
- Reproducible setup, verification, and recovery procedures.
- Recurring failure patterns with evidence and future checks.

## What Does Not Belong Here

- Secrets, tokens, credentials, private keys, `.env` values, or unredacted
  client data.
- Raw transcripts or private chain-of-thought.
- One-off task noise.
- Code facts that are easy to verify from the current tree.
- Git history that belongs in `git log`.
- Runtime-specific local memory from Codex, Claude Code, OpenCode,
  Antigravity, Gemini, DeepSeek, IDE state, or handoff queues.

## Authority

Use this directory as a non-authoritative reference after current
task/spec/plan/report files. It records rationale and lessons; it cannot grant
authority or resolve a conflict with current governance:

```text
current Owner instruction and governance/AGENTS.md
approved Work Block, specification, plan, tasklist, and assurance reports
docs/engineering-memory (rationale and lessons only)
memory_bank, runtime logs, generated or external artifacts
```

If an entry here conflicts with current source files or an approved Work Block,
verify the current state and update this directory during closeout.

## Files

- `decision-record-template.md` - copy this shape for durable engineering
  decisions.
- `source-of-truth-chains.md` - map important questions to their highest
  authority.
- `temporary-decisions.md` - track time-boxed exceptions and revisit triggers.
- `reproducibility-log.md` - stable commands and evidence needed by future
  agents.
- `process-feedback-registry.yml` - the single structured sink for evidence-backed
  Work Block process observations; it is advisory and cannot grant systemic
  change authority.
- [AI Video Production Operating Instruction](ai-video-production-operating-instruction.md) - canonical, evidence-gated rules for future Veo/Gemini or other AI-video production and release; its readable non-normative Markdown companion is the [AI Video Generation and Publication Policy](../policies/ai-video-generation-and-publication-policy.md).

## Closeout Rule

At the end of every non-trivial Work Block, classify reusable knowledge:

- `promoted`: update this directory.
- `operational-only`: keep it in `memory_bank/` or reports.
- `not-applicable`: no reusable durable memory was created.

Process Feedback has a separate required closeout classification. Use the
canonical registry for material observations. Each mandatory review dimension
records an explicit `CLEAR` or `FRICTION_OBSERVED` state with evidence; record
`NONE — checked` only when all eight dimensions are `CLEAR`. Reviewers
and Verifiers may flag missed, unsupported, misclassified, or duplicate
feedback, but their reports remain read-only assurance.

## Entries

- [OpenCode Runtime Layer](opencode-runtime-layer.md) — 2026-07-03. opencode-native `.opencode/agents/` (8 subagents) and `.opencode/skills/` (36 skill mirrors) layer; canonical sources, model assignment, topology precedent from WB-001.
