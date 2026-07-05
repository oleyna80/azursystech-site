# Reproducibility Log

Stable commands and procedures for future agents. Prefer scoped checks matching
the Work Block; do not run production/deploy commands without explicit Owner
approval.

## Agentic SDLC Layer

```bash
scripts/bootstrap.sh
bash -n scripts/bootstrap.sh
git status --short --branch
git diff --check
```

## Website Checks

```bash
cd web
npm run lint
npm run test:ci
npm run check:types
npm run build
npm run check:security
```

Combined website CI:

```bash
cd web
npm run check:ci
```

## Admin Checks

```bash
cd admin
npm run lint
npm run check:types
npm run build
npm run check:security
```

Combined admin CI:

```bash
cd admin
npm run check:ci
```

## Showcase Checks

```bash
cd showcase
npm run lint
npm run check:types
npm run build
```

## Secret Boundary Checks

Before staging or committing, inspect:

```bash
git status --short
git diff --name-only
git diff --check
```

Never stage `.env*`, credentials, provider tokens, private keys, caches,
`node_modules`, `.next`, build output, or local runtime state.
