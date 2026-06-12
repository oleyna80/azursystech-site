# CSS Techniques — Transforms, clip-path, Gestures

Reference material from main SKILL.md. Load when implementing specific CSS animation techniques.

## CSS Transform Mastery

### translateY with percentages
Percentage values in `translate()` are relative to the element's own size. Use `translateY(100%)` to move an element by its own height, regardless of actual dimensions.

```css
.drawer-hidden { transform: translateY(100%); }
.toast-enter { transform: translateY(-100%); }
```

### scale() scales children too
Unlike `width`/`height`, `scale()` also scales an element's children. This is a feature, not a bug.

### 3D transforms for depth
`rotateX()`, `rotateY()` with `transform-style: preserve-3d` create real 3D effects.

```css
.wrapper { transform-style: preserve-3d; }
@keyframes orbit {
  from { transform: translate(-50%, -50%) rotateY(0deg) translateZ(72px) rotateY(360deg); }
  to { transform: translate(-50%, -50%) rotateY(360deg) translateZ(72px) rotateY(0deg); }
}
```

### transform-origin
Every element has an anchor point. Default is center. Set it to match where the trigger lives for origin-aware interactions.

## clip-path for Animation

### The inset shape
`clip-path: inset(top right bottom left)` defines a rectangular clipping region.

```css
.hidden { clip-path: inset(0 100% 0 0); }
.visible { clip-path: inset(0 0 0 0); }
.overlay {
  clip-path: inset(0 100% 0 0);
  transition: clip-path 200ms ease-out;
}
.button:active .overlay {
  clip-path: inset(0 0 0 0);
  transition: clip-path 2s linear;
}
```

### Tabs with perfect color transitions
Duplicate the tab list. Style the copy as "active". Clip the copy so only the active tab is visible. Animate the clip on tab change.

### Hold-to-delete pattern
`clip-path: inset(0 100% 0 0)` on colored overlay. On `:active`, transition to `inset(0 0 0 0)` over 2s linear. On release, snap back with 200ms ease-out. Add `scale(0.97)` on button.

### Image reveals on scroll
Start `clip-path: inset(0 0 100% 0)`. Animate to `inset(0 0 0 0)` on viewport entry. Use `IntersectionObserver` or `useInView`.

### Comparison sliders
Overlay two images. Clip top with `clip-path: inset(0 50% 0 0)`. Adjust right inset based on drag position.

## Gesture and Drag Interactions

### Momentum-based dismissal
Calculate velocity: `Math.abs(dragDistance) / elapsedTime`. If > ~0.11, dismiss regardless of distance.

```js
const timeTaken = new Date().getTime() - dragStartTime.current.getTime();
const velocity = Math.abs(swipeAmount) / timeTaken;
if (Math.abs(swipeAmount) >= SWIPE_THRESHOLD || velocity > 0.11) { dismiss(); }
```

### Damping at boundaries
When dragging past natural boundary, apply damping. The more they drag, the less the element moves.

### Pointer capture for drag
Once dragging starts, element captures all pointer events. Ensures dragging continues even if pointer leaves element bounds.

### Multi-touch protection
Ignore additional touch points after initial drag begins.

### Friction instead of hard stops
Allow upward drag with increasing friction rather than preventing it entirely.
