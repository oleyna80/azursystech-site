---
name: azursystech-schema-route
description: Build schema-bound AzurSysTech website routes where docs, frontend form, assistant behavior, submit API, payload shape, validation, mobile UX, and SSOT closeout must stay aligned. Use for new routes like `/brief`, schema-backed forms, AI-assisted intake pages, or any feature that crosses `02_website`, `03_leads`, `05_ai`, and `web`.
---

# AzurSysTech Schema Route

Use this skill when a route is driven by project docs and needs a shared contract across UI, assistant, and backend.

## Read First

1. `AGENTS.md`
2. `memory_bank/context.md`
3. `memory_bank/progress.md`
4. `memory_bank/decisions.md`
5. The route-specific docs in `02_website/`, `03_leads/`, and `05_ai/`
6. Current implementation patterns in `web/src/app`, `web/src/components`, and `web/src/lib`

## Workflow

1. Produce a synthesis before code:
   - what the route is;
   - what it collects or does;
   - what the helper/assistant may do;
   - what is explicitly out of scope;
   - the minimum shippable version.
2. Split implementation by contract boundary:
   - shared schema/validation/payload module in `web/src/lib/<feature>.ts`;
   - route/page and client form components;
   - optional deterministic assistant/helper module;
   - submit API endpoint if needed.
3. Make the shared schema the single frontend/backend contract.
   - Do not duplicate field definitions in UI-only files.
   - UI field option values must be the same canonical values validated by the API.
   - UI validation may wrap shared validation, but must not redefine required logic separately.
4. Keep helper behavior deterministic for MVP unless the task explicitly requires live model calls.
   - Field explanations and examples belong in a helper map.
   - Assistant must not promise price, timing, fit, integrations, or final architecture.
5. Add submit behavior that returns a structured payload.
   - Include `schema_version`, `source`, `route`, `locale`, `created_at`, raw/normalized data, metadata, and human-readable handoff.
   - Do not force a new schema into an incompatible existing intake model.
6. Validate before closeout per `sdd-protocol.md § Check Suite → Tier Full`.
7. Update SSOT:
   - `memory_bank/progress.md`
   - relevant `docs/tasklist/*`
   - `memory_bank/decisions.md` only if a real architectural/runtime decision was made.

## Contract Rules

- Schema wins over UI convenience.
- A required schema field cannot be satisfied by an optional note field.
- `other` fields are allowed only as explicit helper/extension fields and must be named predictably, for example `<field>_other`.
- Assistant telemetry is optional; do not block submit on assistant usage.
- A successful user message must not imply project acceptance, guaranteed callback timing, price, timeline, or implementation fit.

## Common Failure Pattern To Check

- UI imports local `brief-types.ts` or similar while API imports another schema file.
- Select options display Russian labels but submit Russian labels where API expects canonical enum values.
- API returns `{ success: true }` while UI expects `{ status: "success" }`.
- Mobile helper starts expanded and competes with the form.
- A note field substitutes for a required selection.
- Build passes but browser submit fails because local CORS allowlist does not include the dev port.

## Handoff
- **Success condition**: route реализован, shared schema единая, все проверки из шага 6 пройдены.
- **Next**: azursystech-contract-verifier
- **Auto-proceed**: 🟢 YES
- **Hard stop**: NO
