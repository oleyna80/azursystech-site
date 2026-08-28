# Repository branch lifecycle audit — 2026-08-28

**Scope:** read-only operational snapshot for the next Owner-controlled cleanup
decision. It is not a deletion instruction and is not canonical release state.

Source snapshot: `origin` advertised 16 heads; `gh pr list --state open`
returned no records. Because grafted/disconnected history makes ancestry
non-authoritative, classifications use observed branch ownership, PR association,
local checkout preservation, and explicit Owner preservation intent.

| Remote branch | Class | Basis / required next decision |
| --- | --- | --- |
| `main` | KEEP | Default branch. |
| `baseline/azursystech-441b134d` | KEEP | Explicit preservation baseline. |
| `codex/media-production-skills-curation` | RECOVER_INTENT | Explicit recovery-intent branch; no deletion. |
| `feat/creation-site-internet-nice` | ACTIVE | Dirty canonical checkout is attached; preserve. |
| `wb/2026-08-25-shared-analysis-surface` | ACTIVE | Retained clean local repair checkout exists; decide its local disposition first. |
| `agent/showcase-production-multizone-github` | INVESTIGATE | Registered linked worktree exists; classify its owner/disposition before remote action. |
| `feat/showcase-links-and-immobilier-fix` | INVESTIGATE | No associated PR in snapshot. |
| `feat/web-development` | INVESTIGATE | No associated PR in snapshot. |
| `sync/agentic-sdlc-framework` | INVESTIGATE | No associated PR in snapshot. |
| `agent/github-capability-authority-migration` | SAFE_REMOTE_DELETE | Associated merged PR #12; no preservation exception observed. |
| `feat/automatiser-demandes-clients-guide` | SAFE_REMOTE_DELETE | Associated merged PR #19; only a prunable missing registration remains. |
| `feat/english-translation` | SAFE_REMOTE_DELETE | Associated merged PR #15; no local checkout observed. |
| `feat/technical-seo-multilingual-integrity` | SAFE_REMOTE_DELETE | Associated merged PR #16; no local checkout observed. |
| `fix/worktree-ssot-binding` | SAFE_REMOTE_DELETE | Associated merged PR #18; no local checkout observed. |
| `hotfix/deploy-ssh-action` | SAFE_REMOTE_DELETE | Associated merged PR #9; no local checkout observed. |
| `infra/vps-runtime-consolidation` | SAFE_REMOTE_DELETE | Associated merged PR #8; no local checkout observed. |

`SAFE_REMOTE_DELETE` is a recommendation only: before any Owner-approved
deletion, refresh the branch SHA and PR association, inspect for a local
checkout or recovery dependency, and obtain exact remote-deletion authority.
