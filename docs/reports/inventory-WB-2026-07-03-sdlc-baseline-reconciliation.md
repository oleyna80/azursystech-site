# Inventory Report — WB-2026-07-03 SDLC Baseline Reconciliation

## Status

Complete for Stage 1 inventory.

Implementation is not started. This report converts the broad candidate globs
from the Work Block into an exact proposed write-set for Owner decision.

## Objective

Inventory the SDLC/control-layer delta between the active `azursystech` product
workspace and the advanced SDLC donor branch, then classify files as `accept`,
`adapt`, `reject`, or `defer`.

## Source of truth decision

- Active product workspace: `/home/azur/Projects/WSL/azursystech`
- Active branch: `main`
- Active HEAD at inventory: `0a73895cf201c265c223dd4d6a9fe377d75436a5`
- Donor/reference workspace:
  `/home/azur/Projects/WSL/azursystech-showcase-demo-templates`
- Donor/reference branch: `origin/feature/showcase-demo-templates`
- Donor status: read-only reference for SDLC/control files
- Branch strategy: no direct merge from donor branch

## Pre-implementation dirty snapshot

Tracked modified files in the active workspace:

```text
.agent/ROSTER.md
.gitignore
AGENTS.md
docs/templates/subagent-mission-brief-template.md
docs/templates/work-block-template.md
scripts/bootstrap.sh
```

Primary untracked SDLC/control groups:

```text
.agent/**
.agentsignore
.codex/**
.codexignore
FILE_REGISTRY.yml
PROJECT_MAP.md
docs/engineering-memory/**
docs/plans/**
docs/reports/**
docs/session-bootstrap.md
docs/templates/*
```

No application source path is proposed for this reconciliation write-set.

## Donor delta summary

The donor branch adds or changes four SDLC groups:

1. Core navigation and control files:
   `AGENTS.md`, `PROJECT_MAP.md`, `FILE_REGISTRY.yml`,
   `docs/session-bootstrap.md`, `.gitignore`, `.agentsignore`,
   `.codexignore`, `.agent/README.md`, `.agent/ROSTER.md`,
   `.agent/workflows/sdd-protocol.md`, gate docs, and safe `.codex` policy
   files.
2. Template layer:
   architecture brief, project agent update, subagent mission brief, Work Block
   template, closeout/report/review/verification templates.
3. Agent skill catalog:
   a large mix of core governance skills, UI/design skills, testing skills, and
   operation-specific skills.
4. Historical plans/reports:
   donor June work blocks and reports that explain the donor evolution but are
   not current product evidence for this workspace.

## Disposition model

### Accept / adapt now

Accept or adapt the core SDLC baseline needed for humans and agents to navigate
the active repository:

```text
AGENTS.md
PROJECT_MAP.md
FILE_REGISTRY.yml
.gitignore
.agentsignore
.codexignore
.agent/README.md
.agent/ROSTER.md
.agent/critic-gate.md
.agent/verification-gate.md
.agent/workflows/sdd-protocol.md
.codex/AGENTS.md
.codex/config.toml.template
.codex/critic.md
.codex/instructions.md
.codex/write-gate.md
.codex/hooks/stage0_write_gate.py
docs/session-bootstrap.md
docs/engineering-memory/README.md
docs/engineering-memory/decision-record-template.md
docs/engineering-memory/reproducibility-log.md
docs/engineering-memory/source-of-truth-chains.md
docs/engineering-memory/temporary-decisions.md
docs/templates/architecture-brief-template.md
docs/templates/closeout-report-template.md
docs/templates/consolidation-report-template.md
docs/templates/critic-report-template.md
docs/templates/project-agent-update-template.md
docs/templates/snapshot-template.md
docs/templates/subagent-mission-brief-template.md
docs/templates/tasklist-template.md
docs/templates/verification-report-template.md
docs/templates/work-block-template.md
scripts/bootstrap.sh
docs/plans/WB-2026-07-03-sdlc-baseline-reconciliation.md
docs/reports/critic-WB-2026-07-03-sdlc-baseline-reconciliation.md
docs/reports/inventory-WB-2026-07-03-sdlc-baseline-reconciliation.md
```

Notes:

- `scripts/bootstrap.sh` is workflow/runtime script control, not ordinary
  documentation.
- `.codex/config.toml.template` may be committed; `.codex/config.toml` remains
  private/local.
- `.codex/AGENTS.md` is local project guidance for Codex policy files only.
- The final implementation must keep provider/model/API settings outside the
  committed base framework.

### Defer

Defer all skill catalog curation to a separate Work Block. The skill tree is
large enough to deserve its own review and secret-placeholder audit.

Candidate future skill-curation scope:

```text
.agent/skills/README.md
.agent/skills/SKILL-CONVENTION.md
.agent/skills/agent-operations-review/**
.agent/skills/architecture-discovery/**
.agent/skills/context-snapshot/**
.agent/skills/critic-review/**
.agent/skills/memory-bank-manager/**
.agent/skills/merge-protocol/**
.agent/skills/orchestrator-log/**
.agent/skills/reviewer/**
.agent/skills/scoped-coder/**
.agent/skills/scoped-commit-guard/**
.agent/skills/security-audit-triage/**
.agent/skills/security-hardening-pass/**
.agent/skills/security-verification-gate/**
.agent/skills/shell-context-guard/**
.agent/skills/ssot-sync-closeout/**
.agent/skills/subagent-mission-brief/**
.agent/skills/systematic-debugging/**
.agent/skills/task-decomposition/**
.agent/skills/technical-discovery/**
.agent/skills/verifier/**
.agent/skills/codex-verification/**
.agent/skills/webapp-testing/**
```

Defer donor-only operational skills until product need is explicit:

```text
.agent/skills/ai-runtime-ops/**
.agent/skills/azursystech-contract-verifier/**
.agent/skills/azursystech-schema-route/**
.agent/skills/brand-guidelines/**
.agent/skills/compose-preflight/**
.agent/skills/contact-drift-audit/**
.agent/skills/copy-review/**
.agent/skills/deploy-readiness-gate/**
.agent/skills/image-to-code-skill/**
.agent/skills/imagegen-frontend-web/**
.agent/skills/index-exclusions-manager/**
.agent/skills/intake-agent-foundation/**
.agent/skills/lead-response-ops/**
.agent/skills/local-seo-ops/**
.agent/skills/nextjs-seo-build-verifier/**
.agent/skills/npm-audit-wsl/**
.agent/skills/social-automation-ops/**
.agent/skills/soft-skill/**
.agent/skills/telegram-webhook-gate/**
.agent/skills/vps-db-tunnel-ops/**
.agent/skills/vps-deploy-recovery/**
.agent/skills/vps-ghcr-credential-rotation/**
.agent/skills/vps-registry-pull-deploy/**
.agent/skills/vps-repo-sync/**
.agent/skills/vps-security-runtime-proof/**
.agent/skills/vps-sql-runtime-proof/**
.agent/skills/wsl-browser-preflight/**
```

Defer heavyweight local tooling or UI/design skill trees:

```text
.agent/skills/brutalist-skill/**
.agent/skills/emil-design-eng/**
.agent/skills/frontend-design/**
.agent/skills/graphify-code-map/**
.agent/skills/handoff-live-smoke/**
.agent/skills/impeccable/**
.agent/skills/mcp-builder/**
.agent/skills/minimalist-skill/**
.agent/skills/output-skill/**
.agent/skills/project-estimation/**
.agent/skills/redesign-skill/**
.agent/skills/skill-creator/**
.agent/skills/taste-skill/**
.agent/skills/theme-factory/**
```

Defer historical donor evidence:

```text
docs/plans/AZR-*.md
docs/plans/WB-2026-06-*.md
docs/plans/agent-backend-architecture-*.md
docs/plans/code-audit-*.md
docs/reports/2026-*.md
docs/reports/AZR-*.md
docs/reports/azr-*.md
docs/reports/code-audit-*.md
docs/reports/critic-WB-2026-06-*.md
docs/reports/external-*.md
docs/reports/inventory-WB-2026-06-*.yml
docs/reports/review-WB-2026-06-*.md
docs/reports/verification-WB-2026-06-*.md
docs/reports/wb-a2-critic.md
```

Defer project-local runtime state:

```text
.claude/**
memory_bank/**
.codex/agents/*.toml
```

Git boundary note: the active repository already contains legacy tracked
runtime files under `.claude/**` and `.agent/skills/impeccable/**`. This Work
Block does not untrack, delete, or curate those paths. It only documents the
target boundary and updates ignore/context rules for future files. Cleanup or
curation of existing tracked runtime payloads requires a separate Owner-approved
Work Block with an exact path list.

### Reject for this Work Block

Reject direct import/commit of:

```text
.env*
secrets
credentials
provider tokens
.codex/config.toml
private Claude settings
local transcripts
caches
build outputs
node_modules
.next
dist
web/**
admin/**
showcase/**
chat/**
SQL/deploy/package/dependency files
```

Reject direct branch merge from `origin/feature/showcase-demo-templates`.

## Checks performed

```text
git status --short --branch
git rev-parse --abbrev-ref HEAD
git rev-parse HEAD
git branch -vv
git diff --name-status origin/main...origin/feature/showcase-demo-templates -- <SDLC paths>
git ls-files --modified -- <SDLC paths>
git ls-files --others --exclude-standard -- <SDLC paths>
git diff --stat -- <tracked SDLC files>
git diff -- AGENTS.md .agent/ROSTER.md .gitignore scripts/bootstrap.sh
bash -n scripts/bootstrap.sh
git diff --check -- <current WB/report plus tracked SDLC files>
test -f FILE_REGISTRY.yml
rg -n <secret/private patterns> <proposed SDLC/docs paths>
```

Results:

- Shell syntax check for `scripts/bootstrap.sh`: pass.
- Whitespace check for currently modified tracked SDLC files and current
  Work Block/report files: pass.
- `FILE_REGISTRY.yml` exists.
- Secret/private scan found policy wording and placeholder examples only; no
  live token/key pattern was identified in the scanned paths.
- App/browser/build checks were not run because app source is out of scope.

## Risks

1. `.gitignore` changes can make many SDLC paths visible at once; later staging
   must use exact pathspecs.
2. Skill catalog import is intentionally deferred because several skills include
   scripts, examples, and placeholder credential wording that should be reviewed
   separately.
3. The target tree is already dirty. This report does not claim the entire tree
   is ready for commit.
4. `scripts/bootstrap.sh` changes are more than docs; they require scoped
   implementation review and verification before commit.

## Recommended next action

Owner decision:

- Approve Stage 2 implementation for the exact `Accept / adapt now` write-set,
  or
- narrow the write-set before implementation.

No commit, push, merge, branch deletion, or direct donor merge should occur
without a separate Owner approval.
