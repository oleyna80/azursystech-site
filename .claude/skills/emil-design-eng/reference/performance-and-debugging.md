# Performance Rules & Debugging

Reference from main SKILL.md. Load when optimizing animation performance or debugging issues.

## Performance Rules

### Only animate transform and opacity
These skip layout and paint, running on the GPU. Never animate `padding`, `margin`, `height`, or `width`.

### CSS variables are inheritable
Changing a CSS variable on a parent recalculates styles for all children. Update `transform` directly instead:

```js
// Bad: triggers recalc on all children
element.style.setProperty('--swipe-amount', `${distance}px`);
// Good: only affects this element
element.style.transform = `translateY(${distance}px)`;
```

### Framer Motion hardware acceleration
Shorthand properties (`x`, `y`, `scale`) use `requestAnimationFrame` on the main thread. For GPU acceleration:

```jsx
// NOT hardware accelerated
<motion.div animate={{ x: 100 }} />
// Hardware accelerated
<motion.div animate={{ transform: "translateX(100px)" }} />
```

### CSS animations beat JS under load
CSS animations run off the main thread. Use CSS for predetermined animations; JS for dynamic, interruptible ones.

### Use WAAPI for programmatic CSS animations
```js
element.animate([{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0 0)' }], {
  duration: 1000, fill: 'forwards', easing: 'cubic-bezier(0.77, 0, 0.175, 1)',
});
```

## Debugging Animations

### Slow motion testing
Temporarily increase duration to 2-5x normal, or use browser DevTools animation inspector. Check: color transitions, easing, transform-origin, property sync.

### Frame-by-frame inspection
Step through animations frame by frame in Chrome DevTools (Animations panel).

### Test on real devices
For touch interactions, test on physical devices. Connect phone via USB, visit local dev server by IP. Xcode Simulator is alternative but real hardware is better.

### Review your work the next day
Review animations with fresh eyes. Play in slow motion or frame by frame to spot timing issues.
