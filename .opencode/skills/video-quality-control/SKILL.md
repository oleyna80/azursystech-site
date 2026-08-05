---
name: video-quality-control
description: Define review criteria for generated video fidelity, stability, technical validity, composition, accessibility, and rights defects.
user-invocable: true
argument-hint: "[candidate video and approved production artifacts]"
---

# Video Quality Control

> **Azursystech authority boundary.** Curated from `agentic-sdlc-framework@49850ff6fa0816bbe7feee2d54af2d792444bb5a` (MIT). **This Work Block is planning-only.** This skill never overrides `AGENTS.md` or the active Work Block and grants no Bash, `ffprobe`, file-processing, generation, or publication authority. Any candidate processing or inspection requires a future Owner-approved Work Block.

Review against the approved brief, storyboard, prompt locks, and rights report. Attractive output is insufficient.

## Future evidence preparation

In a separately approved execution Work Block, inspect metadata, opening/closing/storyboard frames, contact sheet, normal and frame-by-frame transitions/loop seam, source-reference comparison, and desktop/mobile crops. Do not use OCR as the primary visual review method.

The technical record covers codec/container, dimensions/aspect ratio, duration, frame rate, audio presence, decode errors, file size, first-frame suitability, loop-seam difference, and crop tests.

## Blocking defects

Reject identity/geometry drift, changed object count or structural facts, deformed anatomy/reflections/shadows, pseudo-text/logos/UI, flicker/texture crawling/exposure pumping, unintended cuts/teleportation, storyboard-conflicting camera motion, loss of text safe zone, visible watermark, or unsafe/misleading content.

## Review result

```yaml
candidate:
result: approved | rejected | revise
blocking_findings:
  - code:
    time_range:
    evidence:
    responsible_stage:
non_blocking_findings: []
technical:
  decode:
  dimensions:
  duration:
  audio:
  size:
visual:
  fidelity:
  temporal_stability:
  composition:
  loop:
  text_safe_zone:
rights:
  visible_watermark:
  source_compliance:
recommended_action:
```

Route concept/hierarchy to art direction, constraints to brief, timing to script, composition to storyboard, camera/light to cinematography, ambiguity to prompt, capability to provider route, and corrupt output to generator. Approve only with no blocking findings; taste cannot waive rights or safety blocks.
