# Source-of-Truth Chains

Use this file to prevent project drift. Each row answers: where should a future
agent look first when `azursystech` has conflicting information?

| Question / Domain | Highest Authority | Supporting Sources | Operational Evidence | Last Verified |
|---|---|---|---|---|
| Agent operating contract | `AGENTS.md` | `PROJECT_MAP.md`, `FILE_REGISTRY.yml`, `.agent/ROSTER.md` | Work Block closeouts in `docs/plans/**` | 2026-07-03 |
| Work Block scope and acceptance | Current approved `docs/plans/**` Work Block | `docs/templates/work-block-template.md`, `AGENTS.md` | Verification evidence in the Work Block or `docs/reports/**` | 2026-07-03 |
| Durable engineering memory | `docs/engineering-memory/README.md` and related entries | `docs/session-bootstrap.md`, `FILE_REGISTRY.yml` | Closeout classifications in Work Blocks | 2026-07-03 |
| Operational session state | `memory_bank/context.md` after bootstrap creates it | `memory_bank/progress.md`, `memory_bank/decisions.md` | Direct file inspection; promote durable items to `docs/engineering-memory/` | 2026-07-03 |
| Production website behavior | `web/src/**` and `web/README.md` | `web/package.json`, `Dockerfile`, `docker-compose.vps.yml` | `cd web && npm run check:ci` or scoped checks | 2026-07-03 |
| Internal admin behavior | `admin/src/**` and `admin/package.json` | `Dockerfile.admin`, admin SQL files | `cd admin && npm run check:ci` or scoped checks | 2026-07-03 |
| Showcase/portfolio behavior | `showcase/app/**`, `showcase/components/**`, `showcase/demos/**` | `showcase/package.json`, design briefs or approved screenshots | `cd showcase && npm run lint && npm run check:types && npm run build` when relevant | 2026-07-03 |
| Deployment/VPS operations | Approved deployment Work Block plus `scripts/**`, `docker-compose.vps.yml`, `nginx.proxy.conf` | `.github/workflows/**`, README deployment notes | Explicit Owner approval and command logs | 2026-07-03 |
| Secrets and environment values | Real environment/secret store outside Git | `.env.vps.example`, README notes | Never commit live values; verify with `git status` and diff inspection | 2026-07-03 |
| Skill directory locations | `.agent/skills/` (canonical, runtime-neutral) | `.opencode/skills/` (opencode native-load mirror), `.claude/skills/` (Claude Code runtime-local with executable assets) | Folder `name:` must match frontmatter `name`; .opencode/skills/ is re-synced from .agent/skills/ in skill-curation Work Blocks | 2026-07-03 |
| Subagent definitions (opencode) | `.opencode/agents/*.md` (opencode frontmatter) | `.claude/agents/*.md` (Claude Code source), `.agent/ROSTER.md` (routing table) | Models assigned in agent frontmatter; Authority model: AGENTS.md File Write Authority | 2026-07-03 |

Add rows only for domains that future agents repeatedly need to resolve.
