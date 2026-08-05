---
name: short-video-scriptwriter
description: Write visual beat scripts for short website videos, loops, product reveals, and generated clips.
user-invocable: true
argument-hint: "[creative brief]"
---

# Short Video Scriptwriter

> **Azursystech authority boundary.** Curated from `agentic-sdlc-framework@49850ff6fa0816bbe7feee2d54af2d792444bb5a` (MIT). This skill is planning guidance only in the active Work Block. It never overrides `AGENTS.md` or the active Work Block, and it grants no tool, provider, file, or publication authority.

Write for visible change over time; do not turn a six-second loop into a conventional screenplay.

## Script types

Choose `ambient_loop`, `product_reveal`, `feature_demonstration`, `brand_moment`, `transition`, or `micro_narrative`. Use two to four beats, each with time range, visible action, camera behavior, continuity requirement, and purpose.

## Loop architecture

Choose one: `return` (end returns to opening), `ping_pong_safe`, `continuous`, or `hidden_cut` during occlusion, blur, or uniform motion. Do not rely on an abrupt endpoint to be fixed later.

Example beat sequence: `0.0–1.5` establishes a readable product and nearly static camera; `1.5–4.5` uses one slow macro dolly while rotation remains under five degrees; `4.5–6.0` settles light and motion toward the opening pose for a seamless loop.

## Writing rules

- One observable principal action per shot; independently specify product and camera motion.
- Make the first frame usable as a poster, name immovable elements, and use restrained autoplay pacing.
- Avoid dialogue, audio, embedded typography, logos, prices, and UI unless the approved brief explicitly requires them.

## Deliverable

```yaml
script_type:
duration_seconds:
opening_state:
beats:
  - time:
    visible_action:
    camera:
    continuity:
    purpose:
closing_state:
loop_strategy:
audio_notes:
```

Exit when every second has a purpose, the loop is explicit, and no beat asks a model to guess what must remain unchanged.
