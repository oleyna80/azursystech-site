# AZR-002 Tasklist

Status: IN_PROGRESS

## Tasks

- AZR-002-001: Lock implementation source-of-truth set
  Owner: Tech Lead
  Priority: P0
  Depends on: none
  Acceptance Criteria:
  - AC1: Core source-of-truth docs across `00_strategy` to `06_seo` are enumerated
  - AC2: Management layer and memory bank are referenced as priority inputs
  - AC3: Build scope and launch blockers are separated
  Status: done

- AZR-002-002: Define website MVP implementation queue
  Owner: Tech Lead
  Priority: P0
  Depends on: AZR-002-001
  Acceptance Criteria:
  - AC1: Core pages for first implementation queue are listed
  - AC2: Page/build scope maps to `site-architecture`, `wireframes`, and brand docs
  - AC3: Out-of-scope items are explicit
  Status: done

- AZR-002-003: Define lead form and CRM implementation path
  Owner: Tech Lead
  Priority: P0
  Depends on: AZR-002-001
  Acceptance Criteria:
  - AC1: Form fields and validation source docs are locked
  - AC2: Lead taxonomy and handoff model are implementation-ready
  - AC3: launch CRM destination is explicit and implementation-ready
  Status: done

- AZR-002-004: Define AI-assisted intake implementation path
  Owner: Tech Lead
  Priority: P1
  Depends on: AZR-002-001
  Acceptance Criteria:
  - AC1: `lead_router` runtime scope is clear
  - AC2: approval and escalation constraints are implementation inputs
  - AC3: AI live-run remains separated from baseline implementation until founder decision
  Status: done

- AZR-002-005: Define Facebook / GBP linkage requirements
  Owner: Tech Lead
  Priority: P1
  Depends on: AZR-002-002, AZR-002-003
  Acceptance Criteria:
  - AC1: CTA and source-tag linkage points are identified
  - AC2: review/GBP/site relationship is reflected in implementation notes
  - AC3: no conflicting source taxonomy remains in build inputs
  Status: done

- AZR-002-006: Define deploy and runtime hardening scope
  Owner: Tech Lead
  Priority: P1
  Depends on: AZR-002-002, AZR-002-004
  Acceptance Criteria:
  - AC1: VPS deployment path is identified as implementation-ready
  - AC2: required runtime secrets are listed as launch blockers, not missing architecture
  - AC3: health/runtime verification path is documented
  Status: done

- AZR-002-007: Prepare handoff to AZR-003 go-live readiness
  Owner: Tech Lead
  Priority: P0
  Depends on: AZR-002-002, AZR-002-003, AZR-002-004, AZR-002-005, AZR-002-006
  Acceptance Criteria:
  - AC1: launch blockers are grouped into go-live readiness package
  - AC2: open decisions are listed clearly for founder resolution
  - AC3: implementation-done vs go-live-done distinction is explicit
  Status: done

- AZR-002-008: Implement MVP contact page in `web/`
  Owner: RooCode
  Priority: P0
  Depends on: AZR-002-002, AZR-002-003
  Acceptance Criteria:
  - AC1: route `/contact` exists in `web/src/app/contact/page.tsx`
  - AC2: sections match implementation map
  - AC3: form contract includes segment branching and honeypot anti-spam field
  - AC4: public contact values match launch SSOT
  Status: done

- AZR-002-009: Implement app shell and homepage skeleton
  Owner: RooCode
  Priority: P0
  Depends on: AZR-002-002, AZR-002-008
  Acceptance Criteria:
  - AC1: shared site shell exists for MVP routes
  - AC2: homepage sections match implementation map
  - AC3: source docs are mapped into public-facing homepage UI without internal wording drift
  - AC4: current `/contact` route remains compatible with shared shell
  Status: done

- AZR-002-010: Implement MVP legal routes `/legal` and `/privacy`
  Owner: RooCode
  Priority: P0
  Depends on: AZR-002-009
  Acceptance Criteria:
  - AC1: routes `/legal` and `/privacy` exist and build in `web/`
  - AC2: sections follow `02_website/legal-pages.md`
  - AC3: public copy is clean and Russian-first
  - AC4: footer links to `/legal` and `/privacy` are valid in shared shell
  - AC5: no invented legal/company/process data beyond current SSOT
  Status: done

- AZR-002-011: Implement MVP `/services` route
  Owner: RooCode
  Priority: P0
  Depends on: AZR-002-010
  Acceptance Criteria:
  - AC1: route `/services` exists and builds in `web/`
  - AC2: services are grouped in a business-first way
  - AC3: pricing presentation follows documented `from / depends on scope` logic
  - AC4: CTA to `/contact` is visible
  - AC5: current app shell remains consistent
  Status: done

- AZR-002-012: Implement MVP `/business` route
  Owner: RooCode
  Priority: P0
  Depends on: AZR-002-011
  Acceptance Criteria:
  - AC1: route `/business` exists and builds in `web/`
  - AC2: section order follows implementation map (hero, problems, setup, use cases, offers, how we work, CTA, FAQ)
  - AC3: page copy is Russian-first, practical, local, and business-first for TPE
  - AC4: practical support emphasis includes postes de travail, Wi-Fi, réseau local, imprimantes, dossiers partagés, intervention sur site
  - AC5: pricing framing uses only `от` / `по запросу` / `зависит от объёма задачи`
  - AC6: primary CTAs lead to `/contact` and shared shell compatibility is preserved
  Status: done

- AZR-002-013: Implement MVP `/home` route for particuliers
  Owner: RooCode
  Priority: P1
  Depends on: AZR-002-012
  Acceptance Criteria:
  - AC1: route `/home` exists and builds in `web/`
  - AC2: section order follows implementation map (hero, typical home-user problems, main services, prices from, how to request help, home FAQ, CTA)
  - AC3: page copy is Russian-first, calm, reassuring, practical, and non-enterprise for home users
  - AC4: home services include only MVP-documented scope (diagnostics, new PC, Wi‑Fi, printer, software install, optimization/upgrade, simple data transfer)
  - AC5: pricing framing uses only `от` / `по запросу` / `зависит от объёма задачи`
  - AC6: key CTAs lead to `/contact` and shared shell compatibility is preserved
  Status: done

- AZR-002-014: Lock MVP visual direction and design contract
  Owner: Tech Lead
  Priority: P0
  Depends on: AZR-002-009
  Acceptance Criteria:
  - AC1: approved visual direction is fixed as implementation baseline
  - AC2: palette, typography, layout rules, and image strategy are documented
  - AC3: future frontend work can reference a stable visual contract without requiring Figma
  Status: done

- AZR-002-015: Implement MVP chat widget shell and safe launch entry
  Owner: RooCode
  Priority: P1
  Depends on: AZR-002-009, AZR-002-014
  Acceptance Criteria:
  - AC1: chat widget shell exists as a secondary conversion layer in `web/`
  - AC2: public copy makes the widget clearly intake-only and launch-safe
  - AC3: widget does not imply autonomous outbound, pricing commitments, or scheduling promises
  - AC4: widget failure or disablement does not block primary contact paths (`/contact`, phone, WhatsApp, email)
  - AC5: implementation stays compatible with future `site -> n8n -> HubSpot` integration
  Status: done

- AZR-002-016: Implement MVP `/pricing` route as trust-oriented pricing entry page
  Owner: RooCode
  Priority: P1
  Depends on: AZR-002-013, AZR-002-014
  Acceptance Criteria:
  - AC1: route `/pricing` exists in `web/src/app/pricing/page.tsx` and builds in `web/`
  - AC2: section structure follows pricing entry scope (hero, pricing logic, business entry, home entry, price factors, included/not included, estimate flow, final CTA)
  - AC3: business pricing block is shown before home-user pricing block
  - AC4: pricing framing uses only `от` / `по запросу` / `зависит от объёма задачи`
  - AC5: all page CTAs lead to `/contact`
  - AC6: visual direction follows ADR-015 `Local Professional` constraints
  Status: done

- AZR-002-017: Implement MVP `/faq` route as full FAQ page
  Owner: RooCode
  Priority: P1
  Depends on: AZR-002-016
  Acceptance Criteria:
  - AC1: route `/faq` exists in `web/src/app/faq/page.tsx` and builds in `web/`
  - AC2: page structure follows implementation map (intro, grouped FAQ list, final CTA block)
  - AC3: FAQ items are sourced only from `01_brand/faq.md` without invented commitments
  - AC4: page remains useful for both business and home-user audiences while keeping business relevance visible
  - AC5: all FAQ route CTAs lead to `/contact`
  - AC6: visual direction follows ADR-015 `Local Professional` with mobile-readable density
  Status: done

- AZR-002-018: Focused visual consistency pass for MVP routes and shell
  Owner: RooCode
  Priority: P1
  Depends on: AZR-002-015, AZR-002-017
  Acceptance Criteria:
  - AC1: visual pass limited to shared shell, `/`, `/services`, `/business`, `/home`, `/pricing`, `/faq`, `/contact`, and chat widget shell
  - AC2: spacing rhythm, card/container style, heading hierarchy, and CTA hierarchy are aligned to `Local Professional`
  - AC3: no route/content contract drift and no new conversion logic introduced
  - AC4: chat widget stays secondary, non-intrusive, and does not imply autonomous behavior
  - AC5: build validation passes in `web/`
  Status: done

- AZR-002-019: Close post-review micro-fixes after visual consistency pass
  Owner: RooCode
  Priority: P1
  Depends on: AZR-002-018
  Acceptance Criteria:
  - AC1: internal/dev wording removed from homepage short-form block
  - AC2: route-path token removed from home FAQ user-facing copy
  - AC3: home route container rhythm aligned to shared `max-w-6xl` baseline
  - AC4: no section structure or conversion logic changes
  - AC5: build validation passes in `web/`
  Status: done

- AZR-002-020: Implement MVP `/thank-you` route as safe post-submit handoff page
  Owner: RooCode
  Priority: P1
  Depends on: AZR-002-008, AZR-002-019
  Acceptance Criteria:
  - AC1: route `/thank-you` exists in `web/src/app/thank-you/page.tsx` and builds in `web/`
  - AC2: page structure includes confirmation hero, short next-step block, fallback contact methods, and CTA block
  - AC3: public copy is Russian-first, calm, reassuring, and does not promise pricing/timing/dispatch guarantees
  - AC4: fallback channels are explicitly visible (`/contact`, phone, WhatsApp, email)
  - AC5: page does not imply autonomous AI actions or final AI decisions
  - AC6: visual direction follows ADR-015 `Local Professional` without over-celebratory style
  Status: done

- AZR-002-021: Implement safe site-side submit path for `/contact`
  Owner: RooCode
  Priority: P0
  Depends on: AZR-002-008, AZR-002-020
  Acceptance Criteria:
  - AC1: fake-submit stub removed from `web/src/app/contact/page.tsx`
  - AC2: server-side submit handler added in `web/` with contract validation and honeypot handling
  - AC3: submit payload uses only documented lead fields + `source=website_form` + default status `New`
  - AC4: `/thank-you` navigation happens only on true submit success from site-side layer
  - AC5: unconfigured/failed integration path shows honest fallback message with phone/WhatsApp/email/`/contact`
  - AC6: implementation keeps explicit integration boundary for future `site -> n8n -> HubSpot` without inventing final external contract
  - AC7: validation includes build + local submit-path checks for validation error, integration not ready, and honeypot spam branch
  Status: done

- AZR-002-022: Follow-up fix for external-contract drift in contact submit boundary
  Owner: RooCode
  Priority: P0
  Depends on: AZR-002-021
  Acceptance Criteria:
  - AC1: hard-coded external contract assumptions removed from `web/src/app/api/contact/submit/route.ts` (`AZURSYSTECH_CONTACT_SUBMIT_URL`, `AZURSYSTECH_CONTACT_SUBMIT_TOKEN`, `Authorization: Bearer ...`)
  - AC2: provisional integration boundary remains explicit and does not invent final webhook/auth/property contract before SSOT approval
  - AC3: site-side validation + payload assembly path remains intact for `/contact` submit flow
  - AC4: API returns honest `integration_not_ready` when final external contract is not configured/fixed in SSOT (no fake success)
  - AC5: redirect to `/thank-you` remains gated by real `success` status only; fallback UX on `/contact` remains intact for non-success statuses
  - AC6: no expansion into analytics/runtime/autonomous logic
  - AC7: validation includes `npm run build` and a minimal local submit check confirming `integration_not_ready`
  Status: done

- AZR-002-023: Lock final integration contract for `site -> n8n -> HubSpot`
  Owner: Integration Stream
  Priority: P0
  Depends on: AZR-002-021, AZR-002-022
  Acceptance Criteria:
  - AC1: canonical contract spec exists in `docs/specs/azr-002-site-n8n-hubspot-contract.md`
  - AC2: endpoint, auth, payload mapping, and response semantics are explicitly documented
  - AC3: undocumented critical points are marked `BLOCKER` instead of being invented
  - AC4: contract stays compatible with current provisional boundary in `web/src/app/api/contact/submit/route.ts`
  - AC5: contract preserves launch-safe submit semantics and HubSpot-only CRM baseline
  Status: done
  Approved transport baseline:
  - endpoint path `/webhook/azursystech/contact-submit`
  - method `POST`
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`
  - `X-Contract-Version: 1`
  - `X-Idempotency-Key: <uuid-v4>`
  - timeout `10s`
  - retry `0` from website transport layer
  - response schemas fixed for `accepted`, `temporary_failure`, and `rejected`
  Closure note:
  - `AZR-002-023` is closed as a transport-baseline approval pass
  - current site route may still return `integration_not_ready` until runtime adapter/config is implemented
  - full HubSpot object/property mapping remains follow-up outside this task's transport decision
  Handoff artifact (2026-03-15): `docs/reports/AZR-002-023-integrationlead-to-vps-n8n.md` prepared for VPS/n8n verification pass with exact-value-only return format
  Next action: hand the approved `v1` transport contract to the VPS/n8n stream for configuration against these exact values without enabling the live workflow

- AZR-002-024: Implement site runtime adapter for approved `v1` contact submit transport
  Owner: Codex
  Priority: P0
  Depends on: AZR-002-023
  Acceptance Criteria:
  - AC1: `web/src/app/api/contact/submit/route.ts` sends `POST` JSON requests to the approved webhook path when runtime env is configured
  - AC2: request uses `Authorization`, `X-Contract-Version`, and `X-Idempotency-Key` headers from the approved `v1` contract
  - AC3: missing runtime env keeps route in honest `integration_not_ready` state
  - AC4: upstream success is recognized only from `200 {"status":"accepted","request_id":"..."}`; all other upstream outcomes stay non-success
  - AC5: required env names are documented in `.env.vps.example` and deploy docs without exposing secret values
  Status: done
  Validation:
  - `npm run check:types`
  - `npm run build`
  Closure note:
  - runtime adapter is implemented in `web/src/app/api/contact/submit/route.ts`
  - route still remains launch-safe because outbound submit is disabled unless runtime env is explicitly configured
  Next action: hand the env contract and approved webhook settings to the VPS/n8n stream for configuration against the fixed `v1` adapter

- AZR-002-025: Lock HubSpot MVP property mapping in SSOT
  Owner: Tech Lead (control layer)
  Priority: P0
  Depends on: AZR-002-023
  Acceptance Criteria:
  - AC1: Contact/Deal object model locked with exact HubSpot internal names and field types
  - AC2: all dropdown enum values aligned with site payload (`contact-submit.ts`) and canonical taxonomy (`lead-taxonomy.md`)
  - AC3: Note format for segment-specific overflow fields is defined
  - AC4: CRM stream proposal corrections documented in contract spec
  - AC5: decision recorded as ADR-017
  Status: done
  Closure note:
  - mapping locked in `docs/specs/azr-002-site-n8n-hubspot-contract.md` section 7
  - 5 corrections applied to CRM stream proposal (service_type values, urgency values, lead_source values, device_count type, onsite_required type)
  - `memory_bank/decisions.md` updated with ADR-017
  Next action: CRM agent to verify/create exact properties in HubSpot with these internal names; VPS/n8n stream to build workflow against locked mapping
