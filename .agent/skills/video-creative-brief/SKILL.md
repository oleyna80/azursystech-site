---
name: video-creative-brief
description: Convert a website, product, brand, or campaign goal into a production-ready short-video brief.
user-invocable: true
argument-hint: "[asset objective and available source media]"
---

# Video Creative Brief

> **Azursystech authority boundary.** Curated from `agentic-sdlc-framework@49850ff6fa0816bbe7feee2d54af2d792444bb5a` (MIT). This skill is planning guidance only in the active Work Block. It never overrides `AGENTS.md` or the active Work Block, and it grants no tool, provider, file, or publication authority.

Create a concise production contract without guessing rights or business intent.

## Required inputs

Capture business objective, placement and viewer action, brand system, source assets and ownership, immutable facts, target formats, duration/loop/audio/autoplay requirements, budget/candidate limit, and approval owner. Do not infer permission from a file being present in the repository.

## Brief format

```yaml
asset_id:
purpose:
business_goal:
placement:
audience:
brand_attributes: []
focal_subject:
source_assets:
  - path:
    role:
    rights_status:
must_preserve: []
must_avoid: []
duration_seconds:
loop:
audio:
motion_intensity:
deliverables:
  - name:
    aspect_ratio:
    viewport:
    subject_zone:
    text_safe_zone:
    target_resolution:
poster_requirement:
candidate_limit:
max_cost:
approval_owner:
```

## Quality rules

- Use observable objectives, one focal subject, and measurable aspect/safe zones.
- Separate immutable facts from stylistic preferences; translate vague qualities into composition, light, material, motion, and pacing.
- For background video, prohibit dialogue, embedded typography, abrupt cuts, and dominant motion unless specifically required.
- For image-to-video, say what may move and what is locked; create separate desktop/mobile deliverables where composition differs.

Prefer measurable constraints, for example:

```yaml
must_preserve:
  - pendant silhouette
  - stone count and placement
  - warm ivory fabric color
motion:
  subject: subtle clockwise rotation under 5 degrees
  camera: slow macro dolly-in
  environment: fabric remains nearly still
```

Avoid an untestable instruction such as `style: make it beautiful and luxurious`.

The brief is ready only when downstream planning can proceed without inventing intent, rights status is explicit, and budget, candidate count, and approval role are bounded.
