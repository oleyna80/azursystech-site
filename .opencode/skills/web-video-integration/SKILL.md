---
name: web-video-integration
description: Plan safe, responsive, accessible integration of approved video assets into websites.
user-invocable: true
argument-hint: "[delivery assets and target component/page]"
---

# Web Video Integration

> **Azursystech authority boundary.** Curated from `agentic-sdlc-framework@49850ff6fa0816bbe7feee2d54af2d792444bb5a` (MIT). **This Work Block is planning-only.** This skill never overrides `AGENTS.md` or the active Work Block and grants no integration, source-write, Bash, asset, provider, or publication authority. Any component/page change or asset delivery requires a future Owner-approved Work Block.

Treat video as progressive enhancement: a page must remain understandable and usable without playback.

## Integration rules for future implementation

- Autoplay backgrounds require `muted`, `playsInline`, and `loop`; do not autoplay meaningful audio.
- Provide a poster matching the opening frame; keep headings, logos, CTAs, prices, and legal text in HTML.
- Preserve contrast through the complete loop, provide a static reduced-motion alternative, avoid initial loading of below-fold video, use responsive selection/separate compositions when needed, never stretch, and retain layout on failure.

## Semantic component contract

Future React/Next implementation should accept desktop WebM/MP4, optional mobile variants, poster, and styling; omit undefined mobile sources in real code. Decorative background video is `aria-hidden`; user-initiated product media has controls and meaningful accessible labels.

```tsx
<video aria-hidden="true" autoPlay muted loop playsInline poster={poster} preload="metadata" className={className}>
  <source media="(max-width: 767px)" src={mobileWebm} type="video/webm" />
  <source media="(max-width: 767px)" src={mobileMp4} type="video/mp4" />
  <source src={desktopWebm} type="video/webm" />
  <source src={desktopMp4} type="video/mp4" />
</video>
```

## Reduced motion and loading

`prefers-reduced-motion: reduce` receives a poster/equivalent static image with no lost information; do not merely slow playback. For heroes, intentionally preload only a chosen format/metadata; for below-fold media, mount or set source near the viewport.

## Future verification

In a separately approved integration Work Block, test desktop/mobile crops, slow network and failure path, reduced motion, mobile autoplay, layout shift, contrast across frames, page weight/loading waterfall, and poster-to-video transition.

Exit when future implementation demonstrates accessible, responsive, fault-tolerant, performance-bounded behavior consistent with the approved storyboard.
