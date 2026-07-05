# Skill Directory Convention — scripts/, references/, assets/

Standard structure for portable `skills/<name>/` directories.

Runtime install locations:

- `.claude/skills/<name>/` for Claude Code.
- `.agent/skills/<name>/` as the project-neutral routing mirror.

Both locations use the same directory shape. The structure enables progressive
disclosure: only `SKILL.md` loads into context by default; subdirectories are
loaded on demand.

## Directory Layout

```
skills/<skill-name>/
├── SKILL.md              # Lean: triggers, core workflow, routing rules. < 500 lines.
├── scripts/              # Executable code (bash, node, python)
│   ├── context.mjs       # example: project context gatherer
│   └── ...
├── reference/            # Additional documentation loaded on demand
│   ├── appendices.md     # example: install commands, canonical sources
│   ├── code-skeletons.md # example: canonical implementation patterns
│   └── ...
└── assets/               # Images, templates, data files
    ├── og-template.png   # example: OG image template
    └── ...
```

## When to Use Each

### `scripts/` — Executable Code

**Use when:**
- The skill needs to gather runtime context (git status, project files, env state)
- The skill needs to transform data (parse, generate, validate)
- The skill has repeatable setup steps that can be scripted
- The skill needs to detect project state before deciding what to do

**Rules:**
- Scripts are executed via `Bash(node scripts/*)` or `Bash(bash scripts/*)` — they don't consume context
- Script output is read by the agent, not the script itself making decisions
- Scripts should be idempotent and exit 0 on success
- Scripts must NOT modify source code, config, or env — gather/transform only
- Keep scripts small (< 200 lines) and single-purpose

**Examples:**
```
impeccable/scripts/context.mjs      # reads PRODUCT.md, DESIGN.md → structured output
impeccable/scripts/context-signals.mjs # reads git state, dev server → JSON signals
impeccable/scripts/palette.mjs      # generates brand seed color
impeccable/scripts/detect.mjs       # scans local files for quality/slop patterns
```

**Naming:** `<verb>.mjs` or `<verb>.sh` — `detect.mjs`, `validate.sh`, `generate.mjs`

### `reference/` — Additional Documentation

**Use when:**
- The skill has catalogs/checklists that are consulted, not memorized
- The skill has detailed code skeletons that are copy-pasted, not read every time
- The skill has vendor-specific install commands or canonical doc links
- The skill has example interpretations showing how rules apply
- The skill has exhaustive lists of forbidden patterns (AI tells, anti-patterns)

**Rules:**
- Reference files are loaded via `Read` when the agent needs that specific information
- Reference files are NEVER loaded automatically — SKILL.md must explicitly say "Read `reference/foo.md` when..."
- One topic per file — no multi-topic reference files
- Reference files have no frontmatter — they are plain markdown
- Reference files must not contain workflow instructions — those stay in SKILL.md

**What stays in SKILL.md (NOT reference):**
- Core workflow / execution order
- Routing rules (which command triggers what)
- Decision frameworks (if X then Y)
- Configuration dials that are set every time
- Hard stops and authority boundaries

**What goes to reference/ (YES):**
- Catalogs (pattern names, component types, theme presets)
- Checklists (pre-flight, validation, clarity)
- Code skeletons (canonical implementations)
- Appendices (install commands, canonical sources, API references)
- Examples (worked scenarios showing how rules apply)
- Anti-pattern catalogs (AI tells, forbidden patterns)

**Examples from this project:**
```
taste-skill/reference/
├── ai-tells.md            # forbidden visual/typography/layout patterns
├── appendices.md          # install commands + canonical doc links
├── code-skeletons.md      # GSAP/Motion canonical implementations
├── pattern-vocabulary.md  # hero/nav/layout/card pattern catalog
└── preflight-checklist.md # 60+ item pre-ship checklist

theme-factory/reference/
└── preset-themes.md       # 6 curated DemoTheme objects

imagegen-frontend-web/reference/
├── anti-slop.md           # forbidden image generation patterns
├── clarity-checklist.md   # 21-point pre-output checklist
├── components.md          # 8 signature component guidelines
├── examples.md            # 3 worked interpretation examples
└── site-packs.md          # 4/8/12-section templates

emil-design-eng/reference/
├── css-techniques.md      # transforms, clip-path, gestures
└── performance-and-debugging.md  # GPU acceleration, debugging methods

image-to-code-skill/reference/
├── variation-engine.md    # combinatorial design choices catalog
├── anti-slop.md           # forbidden patterns
└── reference-data.md      # site packs + clarity checklist + examples
```

### `assets/` — Images, Templates, Data Files

**Use when:**
- The skill needs template files (OG images, document templates, config templates)
- The skill references static data (font lists, color palettes, icon maps)
- The skill produces or consumes binary artifacts

**Rules:**
- Assets are Read (images via Read tool, data files as text) or written by scripts
- Assets must not contain secrets, tokens, or credentials
- Keep assets small — large binaries should be generated, not stored
- Templates should use placeholder syntax (`{{VAR}}`) for substitution

**Examples:**
```
brand-guidelines/assets/
└── og-template.png        # OG image template with brand colors

theme-factory/assets/
└── font-fallback.json     # fallback font metrics for approved fonts
```

## Progressive Disclosure Contract

The SKILL.md frontmatter tells the runtime when to load the skill. The body tells the agent what to do. Reference files, scripts, and assets are loaded on demand — never automatically.

**Correct pattern in SKILL.md:**
```markdown
## Section Name

> **Reference:** [`reference/foo.md`](reference/foo.md) — what this contains and when to load it.
```

**Script invocation pattern:**
```markdown
## Setup
Run `node .claude/skills/<name>/scripts/context.mjs` once per session.
If it prints X, do Y.
```

**Bad (reference loaded unconditionally):**
```markdown
## Section Name

Read `reference/foo.md` for the full catalog.  ← No! This forces every invocation to read it.
```

## Migration Guide

For existing skills:

1. **Identify heavy sections** — any section > 40 lines that is a catalog, checklist, or example
2. **Extract to reference/** — create `<topic>.md`, copy content verbatim
3. **Replace in SKILL.md** — one-line reference with `> **Reference:** ...` and a one-sentence description of what it contains and when to load it
4. **Add scripts/** — only if the skill has repeatable setup/gather steps that can be scripted
5. **Add assets/** — only if the skill needs templates or static data files
6. **Verify** — SKILL.md should be < 500 lines after extraction

## Validation Checklist

- [ ] SKILL.md is < 500 lines (if > 500, more can be extracted)
- [ ] Every `reference/*.md` is referenced by SKILL.md
- [ ] No reference file contains workflow instructions
- [ ] Scripts are idempotent and exit 0
- [ ] No secrets in assets or scripts
- [ ] `allowed-tools` in SKILL.md covers script execution if needed
