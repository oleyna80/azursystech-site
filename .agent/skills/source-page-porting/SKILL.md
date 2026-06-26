---
name: source-page-porting
description: Port an existing HTML/CSS/JS page or local static site into a live Next.js showcase/demo route. Use when migrating source pages into azursystech showcase, preserving visual fidelity, route isolation, asset hygiene, scroll behavior, and dirty-tree safety without copying agent configs, secrets, build output, or unrelated project files.
---

# Source Page Porting

Use this skill to migrate a real source page into a live showcase route. Prefer a native React/CSS implementation over embedding screenshots or blindly copying a whole source project.

## Preflight

1. Read the target project instructions and active Work Block.
2. Run `git status --short --branch` and record unrelated dirty files before editing.
3. Identify the source page entrypoint, CSS files, JS files, images, fonts, and icons.
4. Exclude source agent files, memory files, private config, `.env`, secrets, build output, dependency folders, and deployment artifacts.
5. Define the first slice narrowly. For a multi-page site, start with one page and preserve non-migrated links as future target routes.

## Scope Pattern

Use a dedicated static route when fidelity matters or when the generic demo renderer would force the source page into the wrong shape.

For azursystech showcase pages:

- Put the page under `showcase/app/demo/<slug>/`.
- Put shared page-specific components under `showcase/components/<slug>/`.
- Put assets under a non-overlapping namespace such as `showcase/public/demo/<slug>-site/`.
- Add a stable route marker such as `data-<slug>-route="static-homepage"` for verification.
- Do not edit existing dirty demo-kit files unless the Owner explicitly expands scope.

## Porting Workflow

1. Extract the source structure section by section: header, hero, navigation, content bands, CTAs, footer, and visible interactions.
2. Extract design tokens into local CSS variables or a scoped token module.
3. Rebuild markup as React components with semantic links and buttons.
4. Rewrite source JS behavior as React state/effects only when the behavior is visible in the migrated slice.
5. Copy only required assets into the target public namespace.
6. Convert source internal links to future target paths. Do not keep localhost or filesystem links.
7. Keep above-the-fold critical text independent from scroll reveal state. Do not wrap hero copy, logo, or primary navigation in IntersectionObserver-based reveal components.
8. Use reveal/scroll animation only for non-critical lower sections, and make it one-way visible after first intersection.

## Fidelity Checks

Compare against the source page in a browser, not only by reading code.

Check at minimum:

- logo, menu labels, dropdowns, hero text, CTAs, and first viewport composition
- desktop and mobile widths
- scroll down and back to top
- header text contrast over the hero
- viewport overflow
- loaded images and asset paths
- console errors
- route marker presence
- neighboring showcase demo still works

If text disappears after scrolling back up, inspect computed `opacity`, `transform`, wrapper classes, and header link colors. Remove reveal wrappers from critical first-viewport text before adding more CSS.

## Verification Commands

Adapt commands to the local project layout.

```bash
git status --short --branch
git diff --check
npm run lint
npm run check:types
npm run build
curl -fsSI http://localhost:<port>/demo/<slug>
curl -fsSI http://localhost:<port>/demo/<neighbor-demo>
```

Use Playwright or a browser MCP for visual smoke:

- screenshot desktop page
- screenshot mobile page
- run scroll down/up and inspect critical text opacity
- check console errors
- verify mobile body width equals viewport width

## Stop Conditions

Stop and ask the Owner before:

- broadening from one page to a full site
- changing package files, dependencies, build config, env/config, database, deploy, or secrets
- editing unrelated dirty files
- importing source project control/agent/private files
- implementing form submission or backend behavior that was not approved
- committing or pushing

## Closeout

Record:

- source path and target route
- files created or modified
- assets copied
- source behaviors intentionally rebuilt
- deferred links and unmigrated pages
- checks run and results
- visual limitations
- unrelated dirty files left untouched
