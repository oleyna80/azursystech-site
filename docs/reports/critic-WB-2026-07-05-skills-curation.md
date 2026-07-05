# Critic Report — WB-2026-07-05-skills-curation

Date: 2026-07-05
Verdict: SUPPLEMENT

## MUST (accepted, plan amended)
1. Model aliases undefined → resolved: `sonnet`/`opus`/`haiku` are native Claude Code agent-frontmatter values resolved by the harness; one-line note added to AGENTS.md model routing section.
2. Deletion list not itemized in write-set → plan amended with explicit Delete list (critic-review, reviewer, verifier, scoped-coder skill dirs) + ROSTER rows removal.
3. design-direction merge risks trigger loss → plan amended: merged SKILL.md must carry an explicit trigger table (style adjectives → reference file), reference index, union of allowed-tools, example invocations.

## SHOULD (accepted)
- Sequencing/SSOT drift between two coders → resolved by single consolidated commit by Control Tower after verifier passes (no per-coder commits).
- AGENTS.md mention of scoped-commit-guard → coder A updates mention to git-safety.
- Merged frontmatter pre-validation → verifier checks; coders instructed to output merged SKILL.md frontmatter in their reports.

## Might consider (noted)
- skill-creator/mcp-builder provenance: vendor skills, no local customization found; archive note added.
- Post-curation gate timing check: ROSTER one-pager target ≤1 page, subjective 30s scan.

Risk table: design merge HIGH (mitigated by trigger table), security merge MEDIUM (phase modes), memory-ops MEDIUM (mode docs), git-safety LOW.
