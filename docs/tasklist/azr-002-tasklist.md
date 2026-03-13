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
  Status: todo

- AZR-002-003: Define lead form and CRM/Sheets implementation path
  Owner: Tech Lead
  Priority: P0
  Depends on: AZR-002-001
  Acceptance Criteria:
  - AC1: Form fields and validation source docs are locked
  - AC2: Lead taxonomy and handoff model are implementation-ready
  - AC3: Google Sheets fallback vs CRM path is noted as launch decision area
  Status: todo

- AZR-002-004: Define AI-assisted intake implementation path
  Owner: Tech Lead
  Priority: P1
  Depends on: AZR-002-001
  Acceptance Criteria:
  - AC1: `lead_router` runtime scope is clear
  - AC2: approval and escalation constraints are implementation inputs
  - AC3: AI live-run remains separated from baseline implementation until founder decision
  Status: todo

- AZR-002-005: Define Facebook / GBP linkage requirements
  Owner: Tech Lead
  Priority: P1
  Depends on: AZR-002-002, AZR-002-003
  Acceptance Criteria:
  - AC1: CTA and source-tag linkage points are identified
  - AC2: review/GBP/site relationship is reflected in implementation notes
  - AC3: no conflicting source taxonomy remains in build inputs
  Status: todo

- AZR-002-006: Define deploy and runtime hardening scope
  Owner: Tech Lead
  Priority: P1
  Depends on: AZR-002-002, AZR-002-004
  Acceptance Criteria:
  - AC1: VPS deployment path is identified as implementation-ready
  - AC2: required runtime secrets are listed as launch blockers, not missing architecture
  - AC3: health/runtime verification path is documented
  Status: todo

- AZR-002-007: Prepare handoff to AZR-003 go-live readiness
  Owner: Tech Lead
  Priority: P0
  Depends on: AZR-002-002, AZR-002-003, AZR-002-004, AZR-002-005, AZR-002-006
  Acceptance Criteria:
  - AC1: launch blockers are grouped into go-live readiness package
  - AC2: open decisions are listed clearly for founder resolution
  - AC3: implementation-done vs go-live-done distinction is explicit
  Status: todo
