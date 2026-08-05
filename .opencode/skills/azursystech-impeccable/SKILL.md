---
name: azursystech-impeccable
description: Project-local OpenCode wrapper for Impeccable frontend craft guidance. Use for frontend UX critique, polish, hardening, layout, typography, accessibility, responsive behavior, or visual quality passes in AzurSysTech.
---

# Skill: AzurSysTech Impeccable Wrapper

## Purpose

Expose Impeccable frontend craft guidance through project-local OpenCode skill
routing without colliding with the vendor `.claude/skills/impeccable` skill.

## When to Use

- Broad frontend or site structure changes.
- UX critique, visual polish, layout, typography, motion, accessibility, or
  responsive review.
- Public website pages where brand perception matters.
- Pre-ship frontend hardening after a sizeable UI/content diff.

## Workflow

1. Read `.claude/skills/impeccable/SKILL.md`.
2. Follow its setup exactly, including `PRODUCT.md` context.
3. For AzurSysTech, `PRODUCT.md` is the project context register and uses the
   `brand` register unless a later approved product note says otherwise.
4. Prefer a concrete Impeccable command over a generic invocation:
   - `critique` for UX/design review;
   - `polish` for final visual quality;
   - `harden` for i18n, edge cases, and production readiness;
   - `layout`, `typeset`, or `clarify` for narrow fixes.
5. Do not duplicate vendor skill content here. If the vendor skill changes,
   this wrapper should continue to point to the canonical source.

## Constraints

- This wrapper does not expand file authority, approved scope, dependency
  authority, browser/runtime authority, or Hard Stop boundaries.
- Do not run browser, network, deploy, or production actions unless the current
  Work Block explicitly approves them.
- If the vendor skill requires a missing project context file, create or update
  it only inside an approved documentation/frontend scope.

## Output

- Impeccable command or mode used.
- Project context files read.
- UI risks found.
- Changes made or recommendations if read-only.
- Verification performed or skipped with reason.

## Handoff

- **Success condition**: frontend quality guidance is applied through the
  project-local routing path while preserving the vendor skill as source.
- **Next**: `frontend-design`, `nextjs-seo-build-verifier`, or visual browser
  verification when the Work Block scope allows it.
- **Auto-proceed**: 🟢 YES inside approved frontend/design scope.
- **Hard stop**: 🔴 YES before deploy, live runtime, production data, new
  dependencies, or write actions outside approved scope.
