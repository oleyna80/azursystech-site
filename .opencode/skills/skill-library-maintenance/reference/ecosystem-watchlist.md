# Ecosystem Watchlist

Optional sources discovered by the Owner. This is not an import queue and does
not override the priority catalog. Check an entry only when it matches an
approved project need or an Owner requests a refresh. For GitHub sources,
resolve the relevant default ref to a full SHA during each check. Do not run
upstream installers, configure integrations, or copy content without a
separate approved adaptation Work Block.

This table is discovery metadata only. It intentionally does not assert a
current license, immutable revision, or adaptation right. A source check must
record the resolved full SHA, check date, license evidence at that revision,
local delta, and decision before any recommendation or adaptation claim.
Missing evidence means `unverified` or `license-blocked`, never implicitly safe.

| Source | Type and useful scope | Suggested review | Current disposition |
| --- | --- | --- | --- |
| [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | Skill source; visual direction and frontend design. Local `taste-skill` overlaps its `skills/taste-skill/` path. | Relevant frontend/design work | Track. Reconcile local provenance and delta before calling any difference an update. Reverify revision and license during the scoped check. |
| [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | Skill collection; UI styling, design systems, brand and slides. | Relevant UI/design-system work | Track as a candidate. Review overlap with the local design library; reverify revision and license before adaptation. |
| [obra/superpowers](https://github.com/obra/superpowers) | Methodology and SDLC skill reference. | Framework/process review | Track as a reference. Its plugin, hooks, installers, and autonomous workflows are never adopted by a watchlist check. Reverify revision and license before copying material. |
| [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) | Marketing/CRO/SEO skill collection. | Marketing, ecommerce, or growth project | Track for future use. No baseline import into the core engineering framework; reverify revision, license, and selected-skill scope when reviewed. |
| [charlie947/social-media-skills](https://github.com/charlie947/social-media-skills) | Social-content and creative-production skill collection. | Social-media delivery project | Track for future use. Select individual skills only after content, rights, tool, revision, and license review. |
| [Jakubantalik/transitions.dev](https://github.com/Jakubantalik/transitions.dev) | Motion and transition reference for web applications. | Motion-heavy frontend project | Watch manually. Do not copy until an immutable revision and reusable-license evidence are recorded. |
| [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | Persistent-context runtime integration. | Explicit memory-runtime evaluation | Watch as an integration candidate. Installation, hooks, local data, telemetry, retention, revision, and license require a separate security and configuration review. |
| [upstash/context7](https://github.com/upstash/context7) | Version-aware documentation MCP/CLI integration. | Explicit documentation-tool evaluation | Watch as an integration candidate. MCP/CLI setup, credentials, external data flow, revision, and license remain out of scope for a watchlist-only check. |
| [Claude Finance plugin](https://claude.com/plugins/finance), [Legal plugin](https://claude.com/plugins/legal), [Small Business plugin](https://claude.com/plugins/small-business) | Hosted product capabilities for finance, legal, and small-business tasks. | Owner-requested product review | Manual availability and terms review only. They expose no version-pinned GitHub skill source here, so they are never copied or treated as an update source. |

The Anthropic Skills repository is intentionally absent from this table because
it is already priority source 2 in `priority-sources.md`.
