---
name: npm-audit-wsl
description: Safe npm audit review and two-step patch procedure for AzurSysTech web project in WSL. Use when npm audit reports vulnerabilities and you need to classify, patch safely, and verify without breaking the build.
---

# Skill: npm Audit Review & Safe Patch (WSL)

## Objective
Classify npm audit findings by runtime impact, apply safe patches without breaking the build, and document false positives.

## Preconditions
- WSL shell (bash/zsh via nvm). Never run npm from PowerShell/CMD against WSL paths.
- `npm ci` has been run successfully from WSL shell.
- No uncommitted app code changes are pending.

## Workflow

### Phase 1 — Read-only Audit Report
1. Run `npm audit` and capture full output.
2. For each vulnerability, classify:
   - **Dev-only**: transitive from `eslint`, `typescript-eslint`, `@next/eslint-plugin-next` etc. → not in Docker image, not in production.
   - **Build-time**: used only during `next build` (e.g. `postcss`) → in Docker build stage, not in runtime image.
   - **Production runtime**: direct dependency (`next`, `react`, `pg` etc.) → in running container.
3. Run `npm audit fix --dry-run` to see what would change.
4. Flag any fix that would cross a SemVer major version or downgrade a package.
5. **Do not apply any fix at this stage.**

### Phase 2 — Safe Dev-only Patch
1. Run `npm audit fix` (without `--force`).
2. Verify `git diff web/package.json` is unchanged (only `package-lock.json`).
3. Verify `git diff web/package-lock.json` shows only expected version bumps.
4. Run `npm run check:types` → exit 0.
5. Run `npm run build` → exit 0.
6. Commit: `fix(deps): patch dev-only audit vulnerabilities (<list packages>)`

### Phase 3 — Runtime/Build Dependency Upgrade (if needed)
1. Run `npm install <package>@<safe-version>` (not `--force`).
2. Verify `git diff web/package.json` shows only the target package version change.
3. Run `npm run check:types` → exit 0.
4. Run `npm run build` → exit 0.
5. Commit: `fix(deps): upgrade <package> to <version> (security patch)`

## Known False Positives

| Advisory | Package | Situation | Action |
|---|---|---|---|
| GHSA-qx2v-qp2m-jg93 | `postcss` bundled in `next/node_modules/postcss` | next@16.2.6 is safe but npm advisory range not yet updated. `fix --force` would downgrade to `next@9.3.3` | Ignore. Document in `decisions.md` ADR-006 |

## Guardrails
- **Never run `npm audit fix --force`** if it would downgrade a major runtime dependency or cross SemVer major.
- Do not upgrade unrelated packages.
- Do not edit app code unless strictly required by the upgrade.
- Always verify typecheck + build after each step before committing.

## Handoff
- **Success condition**: `npm run check:types` and `npm run build` pass. Commits are separate per step. Remaining advisories are documented if false positive.
- **Next**: deploy via `vps-registry-pull-deploy` skill.
- **Hard stop**: 🔴 deploy always requires Owner approval.
