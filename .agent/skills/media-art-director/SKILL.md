---
name: media-art-director
description: Decide whether and how motion should be used for a website or digital product.
user-invocable: true
argument-hint: "[page or visual objective]"
---

# Media Art Director

> **Azursystech authority boundary.** Curated from `agentic-sdlc-framework@49850ff6fa0816bbe7feee2d54af2d792444bb5a` (MIT). This skill is planning guidance only in the active Work Block. It never overrides `AGENTS.md` or the active Work Block, and it grants no tool, provider, file, or publication authority.

Choose the smallest motion medium that communicates the intended message.

## Core decision

| Need | Preferred medium |
| --- | --- |
| Microinteraction or state feedback | CSS, Motion, GSAP, or Rive |
| Interactive vector illustration | Rive or Lottie |
| Existing-element scroll choreography | GSAP or Motion |
| Photorealistic atmosphere or product scene | Generated or filmed video |
| Exact geometry or legally sensitive subject | Controlled photography or 3D first |
| Decorative movement without a message | Static media |

Do not recommend generative video when it competes with the CTA, cannot survive mobile cropping, adds unjustified weight, needs exact factual representation, raises motion density, or makes essential information unavailable to reduced-motion users.

## Direction statement

```yaml
media_decision:
  medium:
  purpose:
  placement:
  focal_subject:
  viewer_action:
  motion_intensity: none | low | medium | high
  desktop_strategy:
  mobile_strategy:
  reduced_motion_strategy:
  expected_value:
  key_risks: []
```

## Composition rules

- Reserve stable negative space for HTML text and controls; keep logos, prices, and legal text outside generated pixels.
- Treat desktop and mobile as separate compositions when cropping loses the subject.
- Prefer calm, low-amplitude background motion and a first frame that works as a poster.
- Do not let camera and subject motion compete at the same intensity.

## Approval criteria

Return `static_or_interactive_alternative` unless the medium fits the communication need, mobile and reduced-motion alternatives are explicit, expected value justifies delivery cost, and rights are not being assumed.
