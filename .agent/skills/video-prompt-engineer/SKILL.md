---
name: video-prompt-engineer
description: Translate approved planning artifacts into model-ready video prompts and constraints.
user-invocable: true
argument-hint: "[approved production artifacts and target provider]"
---

# Video Prompt Engineer

> **Azursystech authority boundary.** Curated from `agentic-sdlc-framework@49850ff6fa0816bbe7feee2d54af2d792444bb5a` (MIT). This skill is planning guidance only in the active Work Block. It never overrides `AGENTS.md` or the active Work Block, and it grants no tool, provider, file, or publication authority.

Produce prompts from approved creative decisions; do not invent a new direction here.

## Prompt order

Use subject/immutable identity, permitted action, environment/material, shot and composition, camera, lens/focus/lighting, timing, continuity/loop, exclusions, then format constraints. With a reference image, describe motion rather than re-describing it, because re-description can replace locked details.

## Prompt package

```yaml
mode: text-to-video | image-to-video | first-last-frame | video-to-video
positive_prompt:
negative_constraints:
reference_files: []
locked_elements: []
allowed_motion:
camera:
duration:
aspect_ratio:
seed_policy:
provider_parameters: {}
```

## Constraints and adaptation

Use observable exclusions relevant to the shot: no added objects, pseudo-text, logo mutation, extra anatomy, geometry change, shake, flicker, exposure pumping, scene cut, or crop into safe zone. Keep the provider-neutral prompt separate from any future provider request.

For image-to-video, preserve a supplied reference and describe only its permitted motion. For example: “Preserve the supplied pendant exactly. Over six seconds, add a very slow macro dolly-in while the pendant rotates clockwise by less than five degrees. Keep the stone count, silhouette, chain attachment, ivory fabric, and left-side negative space unchanged.” Do not replace this with a generic re-description that causes locked details to drift.

Before a future approved provider execution, inspect supported durations/aspects, negative-prompt and reference limitations, seed support, moderation behavior, and parameter grammar. This skill performs no provider inspection or call in this Work Block.

Exit when storyboard, camera, duration, and loop agree and every immutable element appears in the lock list.
