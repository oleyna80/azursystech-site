# DESIGN.md Template

> Template status: reference only. Copy this content to a project's approved
> `DESIGN.md` path only when the active Work Block authorizes creation or
> migration of a design-system artifact. Remove instructional comments and
> placeholders that do not apply.

```markdown
---
version: alpha
name: "<Design system name>"
description: "<One sentence describing the product/design system>"

# Omit categories only when the absence is intentional and worth documenting.
# omitted:
#   - section: rounded
#     reason: "The interface intentionally uses square geometry only."

colors:
  primary: "#000000"
  surface: "#FFFFFF"
  on-surface: "#111111"
  # Add only real project tokens. Keep existing project names when established.

typography:
  body:
    fontFamily: "<Body family and fallbacks>"
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.5
  # Add display/label/data roles only when the project actually uses them.

spacing:
  sm: 0.5rem
  md: 1rem
  lg: 2rem

rounded:
  sm: 0.25rem
  md: 0.5rem

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    padding: 1rem
---

# Design System: <Name>

## Overview

**Specific reference:** <A concrete object, environment, publication, tool,
material culture, or other precise reference that carries the intended design
world. Avoid generic adjective bundles such as "modern, premium, clean".>

<Who uses this interface, what register it belongs to, how dense or spacious it
should feel, and what emotional/functional character must remain stable across
screens. Explain the relationship to any existing brand or product system.>

<If this file was extracted from an existing implementation, state the source
paths and the approved reconciliation direction: `implementation_drives_extraction`,
`design_md_drives_implementation`, or temporary `bidirectional_reconciliation`.>

## Colors

<Explain the palette as a system. State where each important color belongs and
where it must not appear. Reference frontmatter tokens when useful.>

- **Primary** `{colors.primary}` — <role and rationale>.
- **Surface** `{colors.surface}` — <role and rationale>.
- **On Surface** `{colors.on-surface}` — <role and rationale>.

## Typography

<Describe the typography character and hierarchy. Explain why each family/role
fits this product and which contexts use it.>

- **Body** `{typography.body}` — <usage and constraints>.

## Layout

<Describe layout strategy, density, max-width/grid behavior, spacing rhythm,
responsive intent, and important alignment/grouping rules.>

## Elevation & Depth

<State whether hierarchy comes from shadows, borders, tonal layers, overlap, or
another method. If the system is deliberately flat, say how depth is expressed
instead.>

## Shapes

<Describe corner, container, control, and geometry language. Explain any places
where a different shape is intentionally reserved for a specific meaning.>

## Components

<Describe the visual/interaction rules for recurring components. Use project
component names where they already exist rather than inventing a second naming
system. Include important hover/focus/selected/error/disabled states.>

### Primary Button

- Background: `{colors.primary}`
- Text: `{colors.surface}`
- Radius: `{rounded.sm}`
- <Other behavior/rationale>

## Do's and Don'ts

- **Do** <specific rule that preserves the intended design character>.
- **Do** <specific rule that preserves usability or consistency>.
- **Don't** <named anti-pattern or anti-reference>.
- **Don't** <specific misuse of a token/component/layout rule>.

## Motion

<!-- Optional custom section. Preserve project-specific sections even when a
consumer does not understand them. Remove this section if motion is irrelevant. -->

<Describe motion character, duration/easing conventions, state-transition jobs,
and reduced-motion behavior when relevant.>
```

## Reconciliation Checklist

Before an extracted or seeded file becomes authoritative for design decisions:

- identify the existing token/component sources;
- record whether `DESIGN.md` drives implementation or documents it;
- resolve conflicting exact values instead of maintaining both indefinitely;
- confirm prose and token values describe the same system;
- preserve project-specific sections and naming;
- confirm higher product, accessibility, brand, and architecture requirements
  remain satisfied;
- obtain the approval/assurance required by the active Work Block.

## Interoperability Note

This template follows the section ordering and token concepts of the open Google
`DESIGN.md` `alpha` format reviewed at
`google-labs-code/design.md@9bf8eae67128b6cc55ad9bf86665767deb4c11cd`.
The Agentic SDLC Framework does not require Google tooling, Stitch, MCP, or a
remote design provider to use this template.
