# WB-2026-09-19 — Managed Linux Service Landing Page

## Status

Product/content specification only.  
No page implementation, layout code, styling, navigation, sitemap, or deployment changes are part of this documentation commit.

The implementation agent must initialize the normal AzurSysTech Work Block lifecycle from this specification before changing application source.

## Goal

Add a dedicated SEO-oriented commercial landing page for AzurSysTech's managed Linux / VPS administration service.

The service should be positioned as a practical recurring service for:

- small businesses running web applications or websites on a VPS;
- freelance developers who do not want to maintain servers themselves;
- web agencies that need a Linux infrastructure partner for several client servers;
- small SaaS / web-product teams without a dedicated system administrator.

The commercial model is recurring monthly monitoring and maintenance with clearly bounded scope. The entry plan is intentionally narrow; unlimited administration and 24/7 human support are not included.

## Language and rollout

English is the content baseline for the first implementation.

Proposed canonical route:

`/en/managed-linux`

Later phases may add:

- `/fr/managed-linux`
- `/ru/managed-linux`

German and Italian are possible future locales but are explicitly out of scope for the first implementation.

Do not publish hreflang entries for a locale until that localized page actually exists. When FR/RU variants are added, follow the repository's existing canonical/hreflang conventions.

## SEO baseline

**Metadata title**

`Linux VPS Management & Maintenance | AzurSysTech`

**Meta description**

`Managed Linux VPS monitoring, maintenance, updates, backups and Docker/Nginx support for small businesses, developers and web agencies. Plans from €29/month.`

**Primary search intent**

Linux VPS management and recurring Linux server maintenance.

**Supporting terms**

- Linux server management
- VPS maintenance
- Ubuntu server maintenance
- Debian server administration
- Docker server maintenance
- Nginx server management

Use these naturally. Do not keyword-stuff headings or body copy.

The implementation should follow existing AzurSysTech SEO patterns for metadata, canonical URL, structured data, internal links and sitemap inclusion.

## Page content structure

### 1. Hero

**Eyebrow**

`Managed Linux Infrastructure`

**H1**

`Linux VPS management without the overhead of a full-time administrator`

**Lead paragraph**

AzurSysTech monitors, maintains and secures Linux VPS environments for small businesses, developers and web agencies. Start with essential monitoring and add maintenance or hands-on administration as your infrastructure grows.

**Primary CTA**

`Request a server audit`

The CTA should use the existing localized AzurSysTech contact/intake flow rather than introducing a new backend form in this Work Block.

**Secondary CTA**

`Compare plans`

**Technology/support line**

`Ubuntu • Debian • Docker • Nginx • VPS & dedicated servers`

---

### 2. Problem / value section

**H2**

`Keep small server problems from becoming outages`

**Body copy**

A VPS can run quietly for months until a disk fills up, a certificate expires, a backup stops working, a security update is missed or a critical service fails. The service centralizes routine checks and maintenance so the client keeps control of the infrastructure without having to monitor every server manually.

Optional short value points:

- know when a server or critical service is unavailable;
- detect disk, memory, SSL and backup problems early;
- keep routine maintenance predictable;
- escalate non-routine work with a clear scope instead of hiding it inside an unlimited support promise.

---

### 3. Plans and pricing

This is the main commercial section.

Render the three plans as three separate comparison cards/columns on larger screens and a readable stacked sequence on smaller screens. Visual styling is not specified yet; reuse the existing AzurSysTech design language during implementation.

#### Monitor — €29 / month

For a simple VPS where the client mainly needs visibility and early warning.

Included:

- 1 Linux server;
- uptime / HTTP availability monitoring;
- CPU, RAM and disk monitoring;
- critical service checks;
- SSL certificate expiry monitoring;
- backup job status checks when a compatible backup job already exists;
- alerts and operational recommendations;
- monthly server health summary.

Not included:

- routine manual administration time;
- unlimited incident remediation;
- application debugging.

#### Care — €69 / month

For a production VPS that also needs routine Linux maintenance.

Includes everything in **Monitor**, plus:

- routine security updates and patching;
- basic SSH, firewall and server-hardening review;
- basic Nginx and Docker maintenance;
- routine backup configuration checks;
- up to 30 minutes of hands-on administration per month;
- business-hours response for included maintenance work.

#### Managed — €129 / month

For web applications or agency-managed workloads that need more regular operational attention.

Includes everything in **Care**, plus:

- Docker Compose / Nginx application operations within the agreed infrastructure scope;
- scheduled maintenance activities;
- backup and restore coordination;
- up to 90 minutes of hands-on administration per month;
- priority response during business hours;
- concise documentation of material operational changes.

**Pricing notes**

- Monthly prices apply to one standard server unless otherwise agreed.
- Initial audit/onboarding is separate from the recurring monthly fee.
- Storage, hosting-provider charges and third-party services are not included.
- Migrations, major upgrades, recovery after compromise, complex incidents and application development are separate work unless explicitly included in a custom agreement.
- Monitoring may run continuously; the standard plans do not promise a 24/7 human-response SLA.

---

### 4. Supported environments

**H2**

`A focused support scope keeps maintenance predictable`

Initial support baseline:

- Ubuntu 22.04 / 24.04;
- Debian 12;
- VPS and standard dedicated servers;
- systemd;
- Nginx;
- Docker and Docker Compose;
- Let's Encrypt / standard TLS certificates;
- basic PostgreSQL / MySQL operational tasks;
- common VPS providers such as OVHcloud, Hetzner and Scaleway.

Not part of the standard entry scope:

- Kubernetes or complex clusters;
- unsupported legacy operating systems;
- enterprise Active Directory / Exchange environments;
- custom high-availability architectures;
- application-code debugging;
- mail-deliverability engineering;
- 24/7 human incident response.

A custom quote may cover environments outside the standard matrix after technical review.

---

### 5. How it works

**H2**

`From audit to routine maintenance`

Use a simple five-step sequence:

1. **Audit** — review the server, stack, access model and obvious operational risks.
2. **Onboarding** — agree the support scope and connect monitoring/checks.
3. **Monitor** — watch availability, resources, services, certificates and backup signals.
4. **Maintain** — perform the routine work included in the selected plan.
5. **Report / escalate** — summarize server health and quote separately for work outside the agreed scope.

---

### 6. Trust / operating principles

**H2**

`Your server stays under your control`

Content points:

- the client keeps ownership of the hosting account and infrastructure;
- the client retains appropriate administrative access;
- no vendor lock-in is created by the maintenance service;
- repeatable operations should be automated where practical;
- material changes should be documented;
- work outside the subscription scope should be identified before it turns into open-ended support.

Do not add unsupported security guarantees, uptime guarantees, customer results, testimonials or ROI claims.

---

### 7. FAQ

Visible FAQ should contain at least these questions.

**Do I keep root or administrator access?**  
Yes. The service manages agreed operational tasks; it does not require the client to give up ownership or appropriate administrative control of the server.

**Do I need to move my VPS to AzurSysTech?**  
No. The service is intended to work with an existing compatible VPS or dedicated server. Hosting-provider fees remain separate.

**Is support available 24/7?**  
Automated monitoring can run continuously, but the standard plans do not include a 24/7 human-response SLA. Any stronger SLA must be agreed separately.

**What happens when monitoring detects a problem?**  
AzurSysTech reviews the alert. If remediation is included in the selected plan and remaining monthly scope, it can be handled as part of the service. Otherwise the client receives a clear recommendation or separate work proposal.

**Can you manage several servers for a developer or web agency?**  
Yes. Multi-server and agency arrangements should be scoped separately so monitoring, maintenance allowance and responsibilities remain explicit.

**Which Linux distributions do you support?**  
The initial standard support matrix is Ubuntu 22.04/24.04 and Debian 12. Other environments require review before acceptance.

---

### 8. Final CTA

**H2**

`Start with a server audit`

**Body copy**

Share the current VPS provider, Linux distribution, main services and what you want monitored or maintained. AzurSysTech will confirm whether the server fits the standard support scope and which plan is appropriate.

**CTA**

`Request a server audit`

Use the existing contact/intake flow.

## Structured data requirements for implementation

When the page is implemented, use structured data derived from visible content only:

- `WebPage`;
- `Service`;
- `BreadcrumbList`;
- `FAQPage` when the FAQ is visibly rendered;
- an offer/catalog structure for the three visible plans only if it matches the project's existing schema conventions.

Structured data must not introduce claims, prices, guarantees or service details that are absent from the visible page.

## Internal linking

The implemented page should have natural links to relevant existing AzurSysTech surfaces where appropriate, including:

- main contact/intake;
- AI automation service if contextually relevant;
- website / web-application services;
- portfolio/examples.

Existing relevant pages should also gain a contextual internal link back to the managed Linux page only where it improves navigation and SEO. Do not redesign global navigation as part of the first implementation unless separately approved.

## Explicit non-goals for the first implementation

- no customer portal;
- no monitoring dashboard exposed to customers;
- no billing/subscription system;
- no new backend intake API;
- no managed-hosting resale;
- no 24/7 SLA;
- no Kubernetes offer;
- no new visual design system;
- no French, Russian, German or Italian copy in the first content pass;
- no production deployment as part of implementation without separate Owner approval.

## Acceptance criteria for the future implementation

- AC-001: English page exists at the approved localized route and uses the English copy baseline above.
- AC-002: Metadata title, description, H1, canonical and structured data are consistent with visible content.
- AC-003: The three plans are visibly separated and show exactly the approved monthly prices: €29, €69 and €129.
- AC-004: Scope boundaries clearly distinguish monitoring, routine maintenance and separately billed work.
- AC-005: The page explicitly states that standard plans do not include 24/7 human-response SLA.
- AC-006: Supported and excluded environments are visible.
- AC-007: Visible FAQ and FAQ structured data remain in parity.
- AC-008: CTA reuses an existing AzurSysTech contact/intake path; no new backend form is introduced.
- AC-009: The implementation reuses the current AzurSysTech components/design language rather than creating a parallel visual system.
- AC-010: No unsupported testimonials, client outcomes, uptime guarantees, ROI claims or security guarantees are added.
- AC-011: No FR/RU hreflang variant is emitted until the corresponding localized page exists.
- AC-012: The implementation remains a landing-page/SEO change and does not expand into monitoring infrastructure, billing, customer portal or production operations.

## Implementation handoff

Before writing page code, Codex should:

1. read `AGENTS.md`, `PROJECT_MAP.md`, this specification and the current localized service-page implementation patterns;
2. initialize the normal Work Block / plan / tasklist required by the repository;
3. inspect the existing localized service page, metadata, sitemap, structured-data and contact-link patterns;
4. propose the minimal write-set;
5. implement only after the repository write gate is READY.

The implementation branch is:

`feat/managed-linux-service-landing`
