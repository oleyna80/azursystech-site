# Verification - WB-2026-07-11 Plomberie Design Refresh

## Verdict

`READY`

## Tier

`full`

## Checks

- `npm run check:types`: PASS.
- `npm run lint`: PASS with zero errors and nine pre-existing unrelated warnings.
- `git diff --check`: PASS.
- Write-set audit: PASS; implementation changes are limited to the nine approved route files.
- Source readability audit: PASS; no route source line exceeds 240 characters.
- Route smoke at `http://localhost:3002/demo/plomberie`: HTTP 200.
- Responsive browser checks at `1440x900`, `1024x768`, and `390x844`: PASS; no horizontal overflow.
- Navigation anchors, telephone and email links: PASS.
- Demo form: PASS; local reset/status behavior and no external submission request.
- Documentary images: PASS; both remote image requests returned image content and crops remained coherent.
- Keyboard focus and reduced-motion behavior: PASS.
- Mobile fixed controls: PASS; the CTA and shared return control do not intersect.
- Browser errors: no uncaught route errors or new route console errors.

## Evidence

- `/tmp/plomberie-reverify-1440x900.png`
- `/tmp/plomberie-reverify-1024x768.png`
- `/tmp/plomberie-reverify-390x844.png`
- `/tmp/plomberie-reverify-390x844-method.png`

## Owner Feedback Correction

After the initial READY verdict, Owner visual inspection found that the hero image occupied only part of its media zone. The image percentage height depended on a container with `min-height` rather than a definite height. The route CSS was corrected so the image absolutely fills the positioned media container while retaining `object-fit: cover`.

Focused re-verification returned `READY`:

- Desktop `1440x900`: media zone and image both measured `568.09x608px`, with zero position and dimension deltas.
- Mobile `390x844`: media zone and image both measured `358x320px`, with zero position and dimension deltas.
- Hero note remained visible and contained.
- No horizontal overflow or fixed-control overlap was introduced.
- Image loaded at natural dimensions `1800x1200`.
- `git diff --check -- showcase/components/plomberie/home.module.css`: PASS.

Additional screenshots:

- `/tmp/plomberie-hero-fill-1440x900.png`
- `/tmp/plomberie-hero-zone-1440x900.png`
- `/tmp/plomberie-hero-mobile-note-visible.png`

## Services CTA Correction

Owner visual inspection requested removal of the small arrow links from secondary service rows and a stronger action for `01 Priorite / Depannage urgent`. The secondary rows were converted to informational content only, while the priority action became a full-width white button with a retained arrow.

Focused re-verification returned `READY`:

- Desktop `1440x1000`: priority CTA measured `472x51px`; white background, dark-teal text, and arrow were visible.
- Mobile `390x844`: priority CTA measured `310x51px`; the services layout remained balanced.
- Services `02-06`: zero links and no empty action column.
- Focus: visible `3px` outline; activation reached `#request`.
- No horizontal overflow, overlap, clipping, or suspicious responsive gaps.
- `npm run lint`: PASS with zero errors and nine pre-existing unrelated warnings.
- `git diff --check`: PASS.

Additional screenshots:

- `/tmp/plomberie-services-1440x1000.png`
- `/tmp/plomberie-services-390x844.png`

## Avis Carousel Correction

Owner visual inspection identified that the Avis section contained only one testimonial. The section now uses a manual, non-autoplay carousel with three explicitly labelled demonstration reviews, previous/next controls, a visible counter, and wrap-around navigation.

Focused verification initially found that the shared fixed `Retour` control overlapped the mobile next button. The carousel controls were moved clear of that fixed control, and re-verification returned `READY`:

- All three reviews are reachable; exactly one quote is rendered at a time.
- Next navigation cycles `1 -> 2 -> 3 -> 1`; previous navigation wraps `1 -> 3`.
- No autoplay occurred during the timed observation.
- Mobile `390x844`: overlap with `Retour` is `0px`; center hit-testing reaches both carousel buttons.
- Desktop `1440x1000`: controls, wrap-around, counter, and layout remain correct.
- Keyboard focus is visible; no horizontal overflow or new console errors were introduced.
- `npm run lint`: PASS with zero errors and nine pre-existing unrelated warnings.
- `git diff --check`: PASS.

Additional screenshots:

- `/tmp/plomberie-avis-reverify-390x844.png`
- `/tmp/plomberie-avis-reverify-1440x1000.png`

## Avis Marquee Follow-up

The Owner subsequently requested that Avis become a separate running-line module representing reviews that could be sourced from Google Maps. The manual carousel was replaced by a full-width CSS marquee with five distinct demonstration reviews and one `aria-hidden` duplicate set for the seamless loop. No Google credentials, provider configuration, network integration, or backend surface were introduced.

- Desktop `1440x1000`: the review track moves continuously, remains contained by the section, and the page has no horizontal overflow.
- Mobile `390x844`: cards remain legible, the marquee stays within the viewport, and the shared fixed `Retour` control does not cover an interactive review control.
- Hover and keyboard focus pause the animation through the shared track state.
- With `prefers-reduced-motion: reduce`, animation is `none`, the duplicate set is hidden, and the five-card set remains reachable through horizontal scrolling (`390px` client width, `1856px` scroll width).
- The accessible region and each review identify the source as an `Apercu de demonstration Google Maps`, avoiding a false claim of live synchronization.
- Browser console has no route-specific errors; the only error remains the pre-existing shared `/favicon.ico` 404.
- `npm run lint`: PASS with zero errors and nine pre-existing unrelated warnings.

Evidence:

- `output/playwright/plomberie-avis-desktop.png`
- `output/playwright/plomberie-avis-mobile.png`

## Residual Risks

- A shared favicon request returns 404; this is pre-existing and outside the route-local write-set.
- CSP and global response-header hardening belong to the shared showcase application, not this Work Block.
- The second documentary image could receive LCP prioritization in a future performance-focused Work Block.
- Live Google Maps review synchronization remains a separate integration requiring an approved API/provider design, private credentials, caching, moderation, and failure-state handling.
- The branch was already ahead of `origin/main`, and unrelated dirty files remain in the worktree.

## Verification Boundary

Verification was read-only. No files, dependencies, configuration, external services, commits, pushes, or deployments were changed by the Verifier.
