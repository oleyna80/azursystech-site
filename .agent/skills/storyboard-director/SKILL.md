---
name: storyboard-director
description: Turn a short-video brief and script into shot-level composition instructions.
user-invocable: true
argument-hint: "[brief and visual beat script]"
---

# Storyboard Director

> **Azursystech authority boundary.** Curated from `agentic-sdlc-framework@49850ff6fa0816bbe7feee2d54af2d792444bb5a` (MIT). This skill is planning guidance only in the active Work Block. It never overrides `AGENTS.md` or the active Work Block, and it grants no tool, provider, file, or publication authority.

Define visual states that generation and review can compare as evidence.

## When mandatory

Create a storyboard for multiple beats, controlled first/last frames, responsive compositions, fixed geometry or identity, protected HTML safe zones, transitions, occlusion, or loop seams.

## Frame plan

```yaml
shot_id:
time_range:
frame_role: opening | key | transition | closing
shot_scale:
camera_position:
camera_movement:
subject_position:
subject_action:
foreground:
background:
lighting_state:
text_safe_zone:
continuity_locks: []
allowed_changes: []
forbidden_changes: []
reference_asset:
```

## Composition and responsive rules

- Use stable left/right/center and percentage vocabulary; separate subject and text-safe zones.
- Keep factual detail away from crop-sensitive edges; preserve horizon, architecture, product count, topology, and screen direction when relevant.
- Keep loop opening/closing frames structurally compatible; image-to-video starts from the source unless the brief says otherwise.
- Specify subject anchor, safe zone, scale, permitted crop, and whether separate mobile generation is required; never blindly crop desktop.

Do not allow unexplained object entrances/exits. For factual fidelity, preserve horizon, architecture, product count, and topology. For every format, identify the opening and closing frame, allowed and forbidden changes, and the review frames to extract.

Deliver a shot table, opening/closing specifications, continuity locks, responsive variants, and target review frames. A reviewer must be able to identify drift without interpreting vague artistic language.
