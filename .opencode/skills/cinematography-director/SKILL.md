---
name: cinematography-director
description: Specify camera, framing, lens character, lighting, depth, motion, and continuity for planned video.
user-invocable: true
argument-hint: "[brief, script, or storyboard]"
---

# Cinematography Director

> **Azursystech authority boundary.** Curated from `agentic-sdlc-framework@49850ff6fa0816bbe7feee2d54af2d792444bb5a` (MIT). This skill is planning guidance only in the active Work Block. It never overrides `AGENTS.md` or the active Work Block, and it grants no tool, provider, file, or publication authority.

Convert aesthetic intent into physically coherent shot instructions.

## Shot specification

```yaml
shot_scale:
camera_height:
camera_angle:
lens_character:
depth_of_field:
camera_movement:
movement_speed:
subject_movement:
lighting:
color_temperature:
contrast:
motion_blur:
focus_behavior:
continuity_locks: []
```

## Selection rules

- Use wide for context, medium for relationship, close-up for detail/emotion, and macro for material or texture.
- Use one dominant movement: locked, dolly, truck/track, orbit, tilt/pan, or handheld. Do not stack orbit, zoom, pan, and handheld in one short shot.
- Wider lenses increase edge distortion; longer/macro lenses compress space. Keep the focal plane on the business-critical subject.
- Define lighting direction, softness, contrast, and behavior over time; “cinematic lighting” is not a specification.

When shape matters, prefer locked or shallow-angle motion, restrict rotation, name immutable geometry, and avoid reflective highlights that invent edges. For website backgrounds: slow movement, stable horizon, low-frequency change, no flashing, fast focus pulls, or abrupt exposure, and protected negative space.

Lighting must specify direction, softness, contrast, color temperature, and behavior over time. Extremely shallow depth can conceal artifacts but can destabilize text-safe composition; avoid full orbit without validated multi-view reference material.

Return a compact camera paragraph plus the structured specification. Exit when camera and subject motion are independently understandable, compatible, and appropriate for placement.
