# Architecture Brief Template

## Stage

_Plan, Spec, Implementation, Review, or Verification._

## Side-effect class

_[read-only | local-docs | production-code | local-test | public-repo | live-infra | live-data | client-facing | destructive]_

## DB action mode

_[none | local_temp | live_readonly | live_migration_apply | runtime_app | emergency_remediation]_

## Objective

_One sentence describing the decision or architecture question._

## Role / Skill

_Architecture Analyst, Backend Analyst, Security Analyst, or other scoped role._

## Expected result

_The concrete artifact or decision this brief must produce._

## Context

_Relevant project state, tickets, tasklists, and constraints._

## Problem statement

_What is unclear, risky, or blocked without this architecture decision._

## Assumptions

_Facts accepted for this brief; mark anything unverified._

## Scope

_What the brief may decide or recommend._

## Out of scope

_What must not be changed or decided in this brief._

## Existing system/repo findings

_Evidence from current files, runtime behavior, or prior decisions._

## Research sources used

_Local docs, code paths, official docs, or external references._

## Options considered

_List viable options with tradeoffs._

## Recommended approach

_State the recommended option and why._

## Recommended stack

_Libraries, services, storage, or runtime components if applicable._

## Architecture boundaries

_Ownership boundaries between frontend, backend, automation, data, and ops._

## Data model / storage model

_Tables, collections, files, retention, and source-of-truth decisions._

## API / integration contracts

_Routes, payloads, events, webhooks, queues, and external systems._

## Security / privacy constraints

_Secrets, auth, PII, logging, rate limits, and approval gates._

## Operational constraints

_Deploy, migrations, rollback, observability, and environment constraints._

## Risks

_Known technical, product, security, or delivery risks._

## Implementation plan

_Small reviewable steps; note approval gates._

## Acceptance criteria

_Observable conditions that prove the architecture was implemented correctly._

## Review evidence

_Review disposition: who reviewed, findings, and whether findings were resolved._

## Verification evidence

_Commands run, results, skipped checks with reasons, and remaining risks._

## Open questions

_Questions that need Owner, product, legal, or runtime confirmation._

## Final result

_Closeout-oriented summary: what was decided, built, or confirmed. Compare with Expected result above._

## Recommended next SDD Work Block

_The next scoped work block if the recommendation is accepted._
