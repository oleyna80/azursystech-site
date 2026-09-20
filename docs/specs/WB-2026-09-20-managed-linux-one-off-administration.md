# WB-2026-09-20 — Managed Linux One-Off Administration

## Status

Follow-up commercial/product specification.

This specification is intentionally separate from the active Managed Linux landing-page implementation so it does not expand or invalidate the Work Block currently being executed by Codex.

Do not modify the current landing-page implementation solely because this document exists. Apply this specification only in a separately approved follow-up Work Block after the current implementation is reviewed.

## Goal

Define a clear commercial model for manual remediation and one-off Linux administration work that is discovered by monitoring but is not included in the customer's monthly plan allowance.

The model must:

- keep the Monitor plan limited to detection, reporting and recommendations;
- avoid "unlimited administration" expectations;
- provide a simple rate for small manual interventions;
- create a predictable upgrade path from Monitor to Care or Managed;
- require customer approval before billable remediation starts.

## Commercial rate

**One-off administration rate**

`€69 / hour`

### Billing rule for Monitor customers

- Minimum billable intervention: **30 minutes**.
- After the first 30 minutes, bill in **15-minute increments**.
- The expected scope and estimated cost must be confirmed with the customer before work begins.

Examples:

| Actual / billed intervention | Price |
|---|---:|
| Up to 30 minutes | €34.50 |
| 45 minutes | €51.75 |
| 60 minutes | €69.00 |
| 75 minutes | €86.25 |
| 90 minutes | €103.50 |
| 120 minutes | €138.00 |

Do not split one continuous intervention into artificial micro-tasks to increase billing.

### Billing rule for Care and Managed customers

The monthly included hands-on allowance is consumed first:

- Care: up to **30 minutes/month** included.
- Managed: up to **90 minutes/month** included.

After the included monthly allowance is exhausted:

- additional hands-on administration is billed at **€69/hour**;
- bill additional time in **15-minute increments**;
- no new 30-minute minimum is required once a monthly-plan intervention is already in progress;
- material extra work should still be confirmed before exceeding the included allowance.

Unused monthly administration time does not automatically roll over unless a future commercial policy explicitly introduces rollover.

## Monitor plan boundary

Monitor remains a monitoring and recommendation service.

Monitor may:

- detect a problem;
- collect relevant operational evidence;
- estimate impact/severity;
- provide a recommendation;
- propose a remediation intervention with estimated time/cost.

Monitor does **not** automatically include:

- cleanup;
- package or configuration changes;
- service reconfiguration;
- filesystem remediation;
- Docker cleanup;
- manual backup repair;
- database administration;
- incident remediation;
- other hands-on system changes.

Public wording:

> Monitoring identifies issues and provides recommendations. Remediation and manual administration are billed separately.

## Customer approval flow

Before billable remediation begins, provide a concise intervention proposal containing:

1. **Issue found**
2. **Recommended action**
3. **Expected risk / impact if left unresolved**
4. **Estimated intervention time**
5. **Estimated price**
6. **Approval request**

Example:

> **Issue found:** Unused Docker images are consuming approximately 18 GB of disk space.  
> **Recommended action:** Review image/container dependencies and remove images confirmed as unused.  
> **Estimated intervention:** up to 30 minutes.  
> **Estimated price:** €34.50.  
> **Action:** Proceed only after customer approval.

The estimate is not a promise that a hidden complex issue will fit inside the estimate. If the task expands materially, stop at a safe point where practical and obtain approval for the revised scope/cost.

## Example: unused Docker images

Monitoring may report:

- total Docker disk usage;
- reclaimable image space;
- disk-space trend;
- operational recommendation.

The paid intervention may include:

- inspect running and stopped containers;
- inspect Docker Compose deployments;
- identify dangling and unused images;
- determine whether old images are intentionally retained for rollback;
- distinguish images from volumes and other Docker data;
- remove only images confirmed safe to remove;
- verify disk space after cleanup.

Do not treat `docker image prune`, `docker system prune`, or similar destructive cleanup commands as automatic Monitor-plan remediation.

Volumes, databases, persistent application data, and ambiguous rollback artifacts require explicit caution and may increase the scope.

## Relationship to monthly plans

The one-off rate should make plan boundaries commercially coherent:

| Service | Commercial model |
|---|---|
| Monitor | €29/month; detection, monitoring, reporting and recommendations |
| One-off administration | €69/hour; 30-minute minimum for Monitor, then 15-minute increments |
| Care | €69/month; Monitor + up to 30 minutes hands-on administration |
| Managed | €129/month; Care-level operations + up to 90 minutes hands-on administration |

This creates a natural upgrade signal.

Example:

A Monitor customer who repeatedly purchases ~30 minutes of manual administration would pay approximately:

`€29 + €34.50 = €63.50/month`

At that frequency, Care at €69/month becomes a more predictable option because it already includes up to 30 minutes of hands-on administration plus its broader maintenance scope.

Do not automatically move a customer to another plan. Recommend the alternative when repeated usage makes the comparison relevant.

## What counts as hands-on administration

Examples include:

- controlled Docker image cleanup;
- Nginx configuration correction;
- routine systemd/service remediation;
- filesystem/log cleanup after review;
- permission/ownership correction;
- firewall/SSH configuration changes;
- package/configuration remediation;
- simple PostgreSQL/MySQL service administration within the previously approved database boundary;
- backup-job repair or configuration correction;
- other bounded Linux infrastructure changes.

The hourly rate does not expand the supported technology matrix. Unsupported/complex environments still require separate technical review.

## Work that requires a separate quote

The €69/hour intervention model is intended for bounded operational administration.

Use a separate quote or project estimate for work such as:

- migrations;
- major operating-system upgrades;
- major PostgreSQL/MySQL upgrades;
- database schema/data migrations;
- replication, clustering or HA;
- compromise recovery;
- forensic/security investigation;
- substantial performance engineering;
- complex backup/recovery projects;
- application debugging or development;
- architecture redesign;
- large multi-server changes;
- work whose duration/risk cannot reasonably be bounded as a small intervention.

## Emergency and after-hours work

This specification does **not** introduce:

- 24/7 human support;
- guaranteed emergency response;
- an urgent/after-hours surcharge;
- incident-response SLA.

Do not invent an emergency tariff during implementation.

If an urgent/after-hours service is introduced later, define it in a separate commercial specification with response expectations and pricing.

## Future landing-page copy

When this follow-up is implemented, the pricing section should include a concise visible note:

> **Additional hands-on administration: €69/hour. For Monitor, the minimum billable intervention is 30 minutes, then billing continues in 15-minute increments. We confirm the scope and estimated cost before starting work.**

The Monitor card or nearby scope text should also state:

> **Monitoring identifies issues and provides recommendations. Remediation and manual administration are billed separately.**

For Care and Managed, clarify that:

> **Additional administration beyond the included monthly allowance is billed at €69/hour in 15-minute increments.**

Do not overload the three pricing cards with the full billing policy. Detailed examples can live in FAQ or terms/service scope if needed.

## Candidate FAQ additions

**What happens if monitoring finds a problem that needs manual work?**  
AzurSysTech will explain the issue, recommend an action and provide an estimated intervention time and cost. Work begins only after approval when it is outside the included plan scope.

**How is additional administration billed?**  
Additional hands-on administration costs €69/hour. Monitor interventions have a 30-minute minimum and then use 15-minute billing increments. Care and Managed use their included monthly administration allowance first; extra time is billed in 15-minute increments.

## UX / SEO constraints for the follow-up

- The €69/hour rate must be visible text when implemented.
- The 30-minute Monitor minimum and 15-minute billing increment must not be hidden only in tooltips or legal fine print.
- The relationship between monitoring and remediation must be explicit.
- Do not make the pricing section look like unlimited managed support.
- Do not imply that billable intervention is performed automatically without approval.
- Structured data must not introduce intervention prices unless the same price is visible on the page and compatible with the site's existing schema strategy.

## Acceptance criteria for the follow-up implementation

- AC-001: The page visibly states that Monitor detects/reports issues but manual remediation is billed separately.
- AC-002: The one-off administration rate is exactly €69/hour.
- AC-003: Monitor has a 30-minute minimum billable intervention.
- AC-004: Time after the Monitor minimum is billed in 15-minute increments.
- AC-005: Care's included 30 minutes/month is consumed before additional billing.
- AC-006: Managed's included 90 minutes/month is consumed before additional billing.
- AC-007: Additional Care/Managed time is billed at €69/hour in 15-minute increments.
- AC-008: Customer approval is required before out-of-scope billable remediation starts.
- AC-009: Material scope expansion requires a revised estimate/approval.
- AC-010: No emergency/after-hours tariff or 24/7 SLA is introduced.
- AC-011: Complex/project work remains separately quoted.
- AC-012: Docker cleanup is treated as an example of manual remediation, not as an automatically included Monitor action.
- AC-013: Existing service-scope and PostgreSQL/MySQL boundaries remain unchanged.
- AC-014: No production deployment is authorized by this specification.

## Handoff

After the current Managed Linux landing-page Work Block is complete and reviewed:

1. create a separate follow-up Work Block from this specification;
2. inspect the implemented pricing/FAQ layout;
3. apply the smallest content/UI change needed to expose the billing policy;
4. preserve the approved landing-page design language;
5. run the relevant SEO, accessibility, type/lint/build and structured-data checks;
6. do not merge or deploy without the normal Owner-controlled workflow.
