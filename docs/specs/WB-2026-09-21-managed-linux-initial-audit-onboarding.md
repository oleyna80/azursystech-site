# WB-2026-09-21 — Managed Linux Initial Audit & Onboarding

## Status

Follow-up commercial/product specification.

This specification is intentionally separate from the active Managed Linux landing-page implementation. It must not expand or invalidate the Work Block currently being executed by Codex.

Apply this specification only in a separate approved follow-up Work Block after the current landing-page implementation is reviewed.

## Goal

Define two related but distinct services:

1. **Initial Linux VPS Audit** — a standalone diagnostic service for a customer who wants to understand the current state of one Linux server.
2. **Standard Onboarding** — the setup work required to bring one standard server into an AzurSysTech Managed Linux subscription.

The commercial model should avoid charging the customer twice for the same initial assessment.

## Commercial pricing

### Initial Linux VPS Audit

**€79 one-time / standard server**

The audit may be purchased independently without a monthly subscription.

### Standard Onboarding

**€79 one-time / standard server**

Onboarding applies when a customer starts Monitor, Care or Managed service.

### No double charge rule

When a customer starts a subscription directly:

- the initial diagnostic review is part of the onboarding process;
- the customer pays the **€79 onboarding fee only**;
- do not charge a separate €79 audit fee in addition to onboarding.

When a customer first purchases the standalone €79 audit and later starts a subscription:

- do not charge the standard €79 onboarding fee again if:
  - the server has not materially changed since the audit;
  - the environment still fits the standard support matrix;
  - onboarding remains standard and does not require materially new investigation or remediation.

If the server has materially changed or onboarding becomes non-standard, provide a revised quote before work begins.

## Initial Linux VPS Audit scope

The standalone audit is primarily diagnostic and read-only.

The audit should collect enough evidence to produce a useful server-health assessment without automatically changing the system.

### Standard audit checks

For one standard Linux server, inspect where technically applicable:

- operating-system version and support status;
- uptime and reboot state;
- CPU usage and load;
- RAM and swap usage;
- disk usage;
- inode usage;
- major filesystem pressure;
- running processes;
- failed systemd services;
- critical services;
- package/security update status;
- SSH configuration baseline;
- firewall status and obvious exposure;
- listening ports;
- TLS/SSL certificate status;
- Nginx service/configuration baseline;
- Docker / Docker Compose state;
- Docker disk usage;
- unused/dangling Docker images where identifiable;
- backup-job status when a compatible backup process already exists;
- PostgreSQL/MySQL service health within the approved basic database-service boundary;
- obvious operational/security risks visible from standard system evidence.

The audit should not imply a penetration test, forensic investigation, compliance audit, or application-code review.

## Audit output

Deliver a concise:

**Server Health Report + prioritized recommendations**

The report should classify findings by practical priority.

Suggested categories:

### Critical

Problems requiring prompt attention because they create a significant availability, security or recoverability risk.

Example:

> Backup job has not completed successfully for 9 days.

### Recommended

Issues that should be corrected but are not necessarily immediate incidents.

Example:

> Approximately 18 GB of Docker images appear reclaimable after dependency review.

### Observation

Useful findings that do not currently require action.

Example:

> Ubuntu security updates are pending.

The report should distinguish:

- evidence;
- finding;
- likely impact;
- recommended next action.

Do not present uncertain observations as confirmed faults.

## Audit does not include remediation

The €79 audit does **not** automatically include system changes.

Examples of work that is outside the audit fee:

- Docker cleanup;
- package installation/removal;
- configuration changes;
- firewall/SSH changes;
- Nginx correction;
- backup repair;
- database administration;
- service remediation;
- application debugging;
- filesystem cleanup;
- other hands-on Linux changes.

When remediation is recommended, use the approved one-off administration commercial model.

Reference specification:

`docs/specs/WB-2026-09-20-managed-linux-one-off-administration.md`

Standard bounded remediation rate:

- €69/hour;
- Monitor intervention minimum: 30 minutes;
- after the minimum: 15-minute increments;
- customer approval required before billable remediation begins.

Example:

> **Issue found:** Unused Docker images are consuming approximately 18 GB of disk space.  
> **Recommended action:** Review dependencies and remove images confirmed as unused.  
> **Estimated intervention:** up to 30 minutes.  
> **Estimated price:** €34.50.  
> **Action:** Proceed only after customer approval.

## Standard onboarding scope

Onboarding converts one compatible server into an actively managed server under Monitor, Care or Managed.

For a standard server, onboarding may include:

- confirm supported operating system and environment;
- confirm agreed plan and support boundary;
- establish or verify administrative access;
- configure or verify SSH-key access;
- create the required service account/access model where appropriate;
- add the server to the internal inventory;
- document basic server identity and stack;
- configure monitoring;
- configure health checks;
- configure alerting destinations;
- configure SSL/certificate monitoring where applicable;
- configure critical-service checks;
- configure resource monitoring;
- connect backup-job monitoring where compatible;
- establish a baseline of the server's current state;
- document material operational notes required for recurring maintenance;
- verify that the monitoring/alerting path works.

Onboarding is not an excuse to perform unlimited remediation.

If onboarding discovers issues that require manual repair outside the plan/onboarding scope, stop and quote those separately.

## Standard vs non-standard onboarding

The €79 onboarding fee is intended for one standard server within the published support matrix.

Examples of non-standard onboarding that require technical review or a separate quote:

- multiple servers requiring coordinated setup;
- complex network topology;
- unusual access constraints;
- unsupported or legacy Linux distributions;
- Kubernetes;
- HA/clustered systems;
- replication/clustered databases;
- complex backup topology;
- complex firewall/VPN architecture;
- compromised server;
- major pre-existing operational instability;
- migration work;
- application redevelopment.

## Relationship to monthly plans

Commercial model:

| Service | Price |
|---|---:|
| Initial Linux VPS Audit | €79 one-time / standard server |
| Standard Onboarding | €79 one-time / standard server |
| Monitor | €29/month |
| Care | €69/month |
| Managed | €129/month |
| Additional hands-on administration | €69/hour |

### Subscription-start examples

**Customer wants only a diagnostic**

- Initial Linux VPS Audit: €79
- No monthly subscription required.

**Customer starts Monitor directly**

- Standard Onboarding: €79
- Monitor: €29/month
- No separate audit fee.

**Customer buys audit first, then subscribes**

If the server has not materially changed and standard onboarding remains straightforward:

- Initial Audit already paid: €79
- Standard Onboarding: €0 additional
- Start selected monthly plan.

This policy is intended to make the audit a low-risk entry point rather than a duplicated setup charge.

## Public landing-page copy

When implemented in the follow-up Work Block, use concise wording near pricing or the CTA.

### Audit copy

> **Initial Linux VPS Audit — €79 one-time**  
> A diagnostic review of one standard Linux server, including system health, resources, services, updates, network exposure, TLS, Docker, backups and basic database-service checks. You receive a prioritized Server Health Report with recommended next actions.

### Onboarding copy

> **Standard onboarding — €79 per server**  
> Includes the initial server review, access setup, monitoring, health checks, alerting, baseline documentation and connection to the selected Managed Linux plan.

### No double-charge copy

> If you start a subscription directly, the initial audit is included in onboarding. If you already purchased the standalone audit and the server has not materially changed, standard onboarding is not charged again.

### Audit boundary copy

> The audit identifies issues and recommends next actions. Remediation and configuration changes are billed separately unless included in the selected monthly plan.

## Candidate FAQ additions

**What is included in the €79 Linux VPS audit?**  
The audit reviews the health of one standard Linux server, including operating-system state, resources, services, updates, SSH/firewall exposure, TLS, Nginx, Docker, backup status and basic PostgreSQL/MySQL service health where applicable. You receive a prioritized Server Health Report.

**Does the audit include fixing the problems it finds?**  
No. The audit is diagnostic. If remediation is needed, AzurSysTech provides a recommended action and estimated cost before billable work begins.

**Do I pay both the audit and onboarding fees?**  
No. If you start a subscription directly, the audit is part of the €79 onboarding process. If you already purchased the standalone audit and the server has not materially changed, standard onboarding is not charged again.

**What is included in onboarding?**  
Standard onboarding covers the initial server review, access setup, inventory, monitoring, health checks, alerting, baseline documentation and connection to the selected plan.

## UX / SEO constraints for the follow-up

- The €79 audit price must be visible text.
- The €79 onboarding price must be visible text.
- The no-double-charge rule must be explicit.
- Do not imply that the audit includes remediation.
- Do not imply that onboarding includes unlimited cleanup or repair.
- The audit output should be described as a `Server Health Report` with prioritized recommendations.
- The audit and onboarding should be distinguishable as separate services while remaining commercially connected.
- Structured data must not expose prices or services that are absent from visible content.

## Acceptance criteria for the follow-up implementation

- AC-001: Standalone Initial Linux VPS Audit is priced at exactly €79 one-time per standard server.
- AC-002: Standard Onboarding is priced at exactly €79 one-time per standard server.
- AC-003: A customer starting a subscription directly is not charged both audit and onboarding.
- AC-004: A previously purchased audit removes the standard onboarding fee when the server has not materially changed and onboarding remains standard.
- AC-005: The audit is diagnostic and does not automatically authorize remediation.
- AC-006: Audit output is a Server Health Report with prioritized recommendations.
- AC-007: The audit scope includes Docker disk usage and unused-image detection where technically identifiable.
- AC-008: Remediation found during audit follows the approved €69/hour one-off administration model.
- AC-009: Standard onboarding includes access, inventory, monitoring, health checks, alerting and baseline documentation.
- AC-010: Non-standard/complex onboarding requires technical review or separate quote.
- AC-011: Existing Monitor/Care/Managed prices and hands-on allowances remain unchanged.
- AC-012: No 24/7 SLA, emergency tariff, penetration test, forensic service or unlimited remediation is introduced.
- AC-013: PostgreSQL/MySQL work remains within the previously approved basic database-service boundary.
- AC-014: No production deployment is authorized by this specification.

## Handoff

After the current Managed Linux landing-page implementation is complete and reviewed:

1. open a separate follow-up Work Block from this specification;
2. inspect the implemented pricing, CTA and FAQ surfaces;
3. apply the smallest content/UI change needed to expose Audit + Onboarding clearly;
4. coordinate this follow-up with the separate one-off-administration specification;
5. preserve the approved landing-page design language;
6. run relevant SEO, accessibility, type/lint/build and structured-data checks;
7. do not merge or deploy without the normal Owner-controlled workflow.
