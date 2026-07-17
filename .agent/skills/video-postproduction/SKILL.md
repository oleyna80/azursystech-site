---
name: video-postproduction
description: Define post-production and web-delivery criteria for an approved video candidate.
user-invocable: true
argument-hint: "[approved candidate and delivery brief]"
---

# Video Post-production

> **Azursystech authority boundary.** Curated from `agentic-sdlc-framework@49850ff6fa0816bbe7feee2d54af2d792444bb5a` (MIT). **This Work Block is planning-only.** This skill never overrides `AGENTS.md` or the active Work Block and grants no Bash, encoder, file-processing, output-write, or publication authority. Any media processing or delivery creation requires a future Owner-approved Work Block.

Prepare an approved candidate for web delivery without changing approved meaning or hiding defects.

## Future delivery outputs

For a website background, assess the actually required desktop/mobile WebM and MP4 variants, posters, and a delivery manifest; do not create unnecessary formats.

The conventional delivery set is `desktop.webm`, `desktop.mp4`, `mobile.webm`, `mobile.mp4`, `poster-desktop.webp`, `poster-mobile.webp`, and `delivery-manifest.json`; create only variants required by the target browser policy.

## Future processing sequence

Preserve the untouched approved source; trim approved points only; remove autoplay background audio; finish the approved loop; use separate generations when safe crop is not approved; encode required variants; select a stable approved poster; then verify duration, dimensions, decodeability, loop, and size. Record processing operations and output hashes in an approved delivery record.

## Rules

- Never conceal identity/geometry drift, remove visible/invisible watermark/provenance, stretch, or falsely advertise resolution.
- Avoid unnecessary interpolation; keep background audio absent unless controls and brief require it.
- Set a page-specific size budget and report an inability to meet it instead of silently shipping an oversized asset.
- Match the poster to the first rendered state to avoid a visual jump.

## Delivery manifest shape

```json
{
  "source": "",
  "operations": [],
  "outputs": [{"path": "", "container": "", "codec": "", "width": 0, "height": 0, "duration": 0, "bytes": 0, "sha256": ""}],
  "posterFiles": [],
  "loopStrategy": "",
  "audioRemoved": true,
  "verifiedAt": ""
}
```

Exit only after a future approved execution proves delivery files decode, meet dimensions/size budgets, preserve approved content, and have reproducible evidence.
