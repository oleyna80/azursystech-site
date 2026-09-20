# WB-2026-09-19 — Managed Linux Service Landing Page

## Status

Product/content specification only.  
No page implementation, layout code, styling, navigation, sitemap, or deployment changes are part of this documentation commit.

The implementation agent must initialize the normal AzurSysTech Work Block lifecycle from this specification before changing application source.

## Goal

Add a dedicated SEO-oriented commercial landing page for AzurSysTech's managed Linux / VPS administration service.

The service should be positioned as a practical recurring service for:

- small businesses running web applications or websites on a VPS;
- freelance developers who do not want routine server maintenance to consume development time;
- web agencies that need a Linux infrastructure partner for several client servers;
- small SaaS / web-product teams without a dedicated system administrator.

The commercial model is recurring monthly monitoring and maintenance with clearly bounded scope. The entry plan is intentionally narrow; unlimited administration and 24/7 human support are not included.

## Language and rollout

English is the content baseline for the first implementation.

Approved initial canonical route:

`/en/managed-linux`

Later phases may add:

- `/fr/managed-linux`
- `/ru/managed-linux`

German and Italian are possible future locales but are explicitly out of scope for the first implementation.

Do not publish hreflang entries for a locale until that localized page actually exists. When FR/RU variants are added, follow the repository's existing canonical/hreflang conventions.

## SEO and AI retrieval principles

The page must be understandable from ordinary server-rendered HTML without relying on images, hover states, carousels, client-only tabs, or collapsed content for essential commercial facts.

Within the first 300–500 words, a visitor or agent should be able to determine:

- what the service is;
- who it is for;
- the starting price;
- the supported Linux/platform baseline;
- the difference between monitoring and hands-on administration;
- that standard plans do not include a 24/7 human-response SLA;
- that the client keeps ownership/control of the infrastructure.

Use direct factual language. Prefer statements such as:

- `Monitor costs €29 per server per month.`
- `Care includes up to 30 minutes of hands-on administration per month.`
- `Managed includes up to 90 minutes of hands-on administration per month.`
- `Standard plans do not include a 24/7 human-response SLA.`
- `The client keeps ownership and appropriate administrative control of the server.`

Do not hide important scope or price information only inside decorative badges or graphics.

Use one H1, then a logical H2/H3 hierarchy with no skipped heading levels.

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

The implementation should follow existing AzurSysTech patterns for metadata, canonical URL, structured data, internal links and sitemap inclusion.

## Approved heading hierarchy

```text
H1 Linux VPS Management for Small Businesses, Developers and Web Agencies

H2 Service at a glance

H2 What we manage on your Linux server

H2 Linux VPS management plans
  H3 Monitor
  H3 Care
  H3 Managed

H2 Who this service is for
  H3 Small businesses
  H3 Freelance developers
  H3 Web agencies
  H3 Small SaaS teams

H2 Supported Linux environments

H2 How Linux server management works
  H3 Server audit
  H3 Onboarding
  H3 Monitoring
  H3 Maintenance
  H3 Reporting and escalation

H2 You keep control of your infrastructure

H2 What the monthly plans do not include

H2 Frequently asked questions

H2 Request a Linux server audit
```

## Page content structure

### 1. Hero

**Eyebrow**

`Managed Linux Infrastructure`

**H1**

`Linux VPS Management for Small Businesses, Developers and Web Agencies`

**Lead statement**

`Monitoring, security updates, backups, Nginx and Docker support for Ubuntu and Debian servers — from €29 per server/month.`

**Supporting paragraph**

AzurSysTech provides recurring Linux VPS monitoring and maintenance for small businesses, developers and web agencies. Start with essential monitoring and add routine maintenance or hands-on administration as the infrastructure grows.

**Primary CTA**

`Request a server audit`

The CTA should use the existing localized AzurSysTech contact/intake flow rather than introducing a new backend form in this Work Block.

**Secondary CTA**

`Compare plans`

**Technology/support line**

`Ubuntu • Debian • Docker • Nginx • VPS & dedicated servers`

---

### 2. Service at a glance

**H2**

`Service at a glance`

Render as a compact factual summary in ordinary HTML.

Required facts:

- **Starting price:** €29 / server / month
- **Platforms:** Ubuntu 22.04 / 24.04, Debian 12
- **Stack:** Nginx, Docker, Docker Compose, systemd
- **Service type:** remote monitoring and maintenance
- **Human 24/7 SLA:** not included in standard plans
- **Server ownership:** remains with the client

This block should remain readable as plain text even without CSS.

---

### 3. What we manage

**H2**

`What we manage on your Linux server`

**Intro copy**

AzurSysTech provides recurring monitoring and maintenance for Linux VPS and standard dedicated servers. The service focuses on operating-system and infrastructure health rather than application development.

**Visible scope list**

- server availability;
- CPU, memory, disk and resource usage;
- critical system services;
- SSL certificate expiry;
- Linux security updates;
- SSH and firewall configuration;
- Nginx;
- Docker and Docker Compose;
- backup-job status;
- basic PostgreSQL/MySQL service operations.

**Mandatory scope statement**

`The service focuses on infrastructure operations. Application bugs and software-development work are outside the standard monthly plans.`

---

### 4. Linux VPS management plans

**H2**

`Linux VPS management plans`

**Intro copy**

Choose monitoring only, routine maintenance, or a broader managed-server plan. Prices below apply to one standard server per month.

Render the plans as three separate semantic `article` blocks/cards on larger screens and as a readable stacked sequence on smaller screens. Visual styling is not specified yet; reuse the existing AzurSysTech design language during implementation.

#### Monitor

**Price**

`€29 / server / month`

**Positioning**

For servers that mainly need continuous visibility and early warning.

**Included**

- 1 Linux server;
- uptime / HTTP availability monitoring;
- CPU, RAM and disk monitoring;
- critical service checks;
- SSL certificate expiry monitoring;
- backup job status checks when a compatible backup job already exists;
- alerts and operational recommendations;
- monthly server health summary.

**Mandatory explicit sentence**

`Monitor costs €29 per server per month. Hands-on administration is not included.`

#### Care

**Price**

`€69 / server / month`

**Positioning**

For production servers that need routine Linux maintenance.

**Includes everything in Monitor, plus**

- routine security updates and patching;
- basic SSH, firewall and server-hardening review;
- basic Nginx maintenance;
- basic Docker maintenance;
- routine backup configuration checks;
- up to 30 minutes of hands-on administration per month;
- business-hours response for included maintenance work.

**Mandatory explicit sentence**

`Care includes up to 30 minutes of hands-on administration per month.`

#### Managed

**Price**

`€129 / server / month`

**Positioning**

For web applications and agency-managed infrastructure that requires more regular operational attention.

**Includes everything in Care, plus**

- Docker Compose / Nginx application infrastructure operations within the agreed infrastructure scope;
- scheduled maintenance activities;
- backup and restore coordination;
- up to 90 minutes of hands-on administration per month;
- priority response during business hours;
- concise documentation of material operational changes.

**Mandatory explicit sentence**

`Managed includes up to 90 minutes of hands-on administration per month.`

**Pricing notes shown directly below the three plans**

- Monthly prices apply to one standard server unless otherwise agreed.
- Initial audit/onboarding is separate from the recurring monthly fee.
- Storage, hosting-provider charges and third-party services are not included.
- Migrations, major upgrades, recovery after compromise, complex incidents and application development are separate work unless explicitly included in a custom agreement.
- Monitoring may run continuously; the standard plans do not promise a 24/7 human-response SLA.

---

### 5. Who this service is for

**H2**

`Who this service is for`

**Intro copy**

The service is designed for teams that need reliable Linux operations but do not need, or do not want to hire, a full-time system administrator.

#### Small businesses

Your website, business application or internal tool runs on a VPS, but nobody is responsible for routine Linux maintenance, monitoring and updates.

#### Freelance developers

You build and deploy applications but want to keep server maintenance, certificates, backups and routine incidents from consuming development time.

#### Web agencies

You manage several client websites or applications and need a recurring Linux infrastructure partner for standard VPS environments.

#### Small SaaS teams

You operate a small production environment and need monitoring, maintenance and occasional administration without building an internal infrastructure team.

---

### 6. Supported Linux environments

**H2**

`Supported Linux environments`

**Intro copy**

The standard service is intentionally focused on common Linux web-server environments. A narrow support matrix keeps maintenance predictable and reduces operational risk.

**Standard support**

- Ubuntu 22.04 and 24.04;
- Debian 12;
- VPS and standard dedicated servers;
- systemd;
- Nginx;
- Docker and Docker Compose;
- Let's Encrypt and standard TLS certificates;
- basic PostgreSQL/MySQL service operations for standard single-server / single-instance deployments;
- common hosting providers such as OVHcloud, Hetzner and Scaleway.

**Requires separate review**

- Kubernetes;
- high-availability clusters;
- legacy or unsupported Linux distributions;
- complex database architectures;
- replication and clustering;
- enterprise Active Directory / Exchange environments;
- mail infrastructure;
- custom HA or failover architectures.

**Scope note**

Environments outside the standard matrix can still be considered, but only after technical review.

### PostgreSQL / MySQL scope boundary

Public wording should use **basic PostgreSQL / MySQL service operations**, not a broad promise such as `PostgreSQL/MySQL support`.

The standard scope is database-service operation at the infrastructure layer, initially limited to standard single-server / single-instance PostgreSQL or MySQL/MariaDB deployments.

**Monitor may include**

- database service availability checks;
- relevant disk/resource monitoring;
- backup-job status checks when a compatible backup process already exists.

**Care may include, within the included 30 minutes of hands-on administration**

- basic database-service log inspection during an infrastructure incident;
- controlled database-service restart when appropriate;
- routine package/security updates that do not require a major database migration;
- basic configuration review;
- simple database/user/permission administration;
- checks of an existing logical backup procedure.

**Managed may include, within the included 90 minutes of hands-on administration**

- the Care database-service operations above;
- backup/restore coordination within the agreed infrastructure scope;
- more regular database-service operational attention.

**Quoted separately / requires separate review**

- SQL query optimization;
- index design and application performance tuning;
- schema design or schema/data migrations;
- major PostgreSQL/MySQL version upgrades;
- replication, clustering and high-availability setups;
- PgBouncer, ProxySQL, Patroni, Galera or similar architecture work;
- point-in-time-recovery architecture;
- large database migrations;
- corruption or data recovery;
- forensic investigation;
- application-specific database debugging.

**Public summary copy**

`Basic PostgreSQL/MySQL service operations are available within the agreed plan scope. Advanced DBA work, query optimization, schema changes, major version upgrades, replication, clustering and data recovery are quoted separately.`

**Mandatory explicit sentence**

`Database service administration covers routine infrastructure operations. Query optimization, schema changes, major version upgrades, replication, clustering and data recovery are quoted separately.`

A restore request must not be treated as an unlimited included operation merely because a backup exists; complex restore or recovery work is separately scoped unless explicitly covered.

---

### 7. How Linux server management works

**H2**

`How Linux server management works`

**Intro copy**

The service follows a simple operating model so responsibilities remain clear from the beginning.

#### Server audit

We review the operating system, hosting environment, running services, current access model, update status, monitoring gaps and obvious operational risks.

#### Onboarding

We agree the support scope, document the server baseline and configure the monitoring and maintenance access required for the selected plan.

#### Monitoring

Availability, resources, critical services, certificates and backup signals are monitored where technically applicable.

#### Maintenance

Routine work included in the selected plan is performed according to the agreed scope and available monthly administration allowance.

#### Reporting and escalation

You receive clear information about server health and material issues. Work outside the subscription scope is identified separately before additional work begins.

---

### 8. You keep control of your infrastructure

**H2**

`You keep control of your infrastructure`

**Intro copy**

Managed maintenance should reduce operational work without taking ownership of the infrastructure away from the client.

**Content points**

- your hosting account remains in your name;
- you retain appropriate administrator or root access;
- you are not required to migrate to AzurSysTech hosting;
- no proprietary lock-in is introduced;
- material operational changes are documented;
- repeatable maintenance tasks are automated where practical;
- work outside the subscription is identified separately.

**Mandatory explicit sentence**

`The client keeps ownership and appropriate administrative control of the server.`

Do not add unsupported security guarantees, uptime guarantees, customer results, testimonials or ROI claims.

---

### 9. What the monthly plans do not include

**H2**

`What the monthly plans do not include`

**Intro copy**

The monthly plans cover clearly defined infrastructure operations. Work outside that boundary is quoted separately.

**Excluded from the standard plans**

- application-code debugging;
- feature development;
- migrations unless agreed separately;
- major operating-system or application upgrades;
- query optimization and application-level database tuning;
- schema migrations and advanced database administration;
- major PostgreSQL/MySQL upgrades;
- replication, clustering or HA database architecture;
- data corruption recovery;
- incident recovery after compromise;
- forensic or security investigation;
- unlimited manual support;
- third-party hosting, storage or software costs;
- 24/7 human-response SLA.

**Mandatory explicit sentence**

`Standard plans do not include a 24/7 human-response SLA.`

---

### 10. Frequently asked questions

**H2**

`Frequently asked questions`

The visible FAQ should contain at least these questions and answers.

**What is included in Linux VPS management?**  
Depending on the selected plan, the service covers monitoring, resource checks, critical services, SSL certificates, backup-job status, Linux updates and selected Nginx, Docker and database-service operations. Hands-on administration is limited by the selected plan.

**How much does Linux server management cost?**  
Monitor costs €29 per server per month, Care costs €69 per server per month, and Managed costs €129 per server per month. Initial audit/onboarding and work outside the monthly plan are quoted separately.

**Do I keep root or administrator access to my server?**  
Yes. You keep ownership and appropriate administrative control of the server.

**Do I need to move my VPS to AzurSysTech?**  
No. The service is intended to work with your existing compatible VPS or dedicated server.

**Which Linux distributions do you support?**  
The standard support matrix starts with Ubuntu 22.04/24.04 and Debian 12. Other environments require technical review.

**Do you manage Docker and Nginx?**  
Yes. Basic Nginx, Docker and Docker Compose operations are included according to the selected plan and agreed infrastructure scope.

**Do you manage PostgreSQL or MySQL?**  
Basic PostgreSQL/MySQL service operations can be included in Care and Managed plans within the available administration time. Advanced DBA work, query optimization, schema changes, major upgrades, replication, clustering and data recovery are handled separately.

**Is support available 24/7?**  
Automated monitoring can run continuously, but standard plans do not include a 24/7 human-response SLA.

**Can you manage multiple servers for a developer or agency?**  
Yes. Multi-server and agency arrangements are scoped separately so responsibilities, monitoring coverage and administration allowances remain clear.

---

### 11. Final CTA

**H2**

`Request a Linux server audit`

**Body copy**

Tell us your VPS provider, Linux distribution, main services and what you want monitored or maintained. AzurSysTech will confirm whether the server fits the standard support scope and which plan is appropriate.

**CTA**

`Request a server audit`

Use the existing contact/intake flow.

## Semantic HTML requirements

The implementation should preserve semantic structure rather than using generic decorative containers for all content.

Preferred shape:

```text
<main>
  <section> Hero
    <h1>
  <section> Service at a glance
    <h2>
  <section> What we manage
    <h2>
  <section> Pricing
    <h2>
    <article> Monitor
    <article> Care
    <article> Managed
  <section> Who this is for
    <h2>
    <h3> persona headings
  <section> Supported environments
    <h2>
  <section> How it works
    <h2>
    <h3> process-step headings
  <section> Control / trust
    <h2>
  <section> Exclusions
    <h2>
  <section> FAQ
    <h2>
  <section> CTA
    <h2>
</main>
```

Essential facts must be present as text in the rendered HTML.

## Structured data requirements for implementation

When the page is implemented, use structured data derived from visible content only.

Primary graph:

- `WebPage`;
- `Service`;
- `BreadcrumbList`.

For the three plans, use an `Offer` / `OfferCatalog` structure only if it matches the project's existing schema conventions and exactly mirrors the visible plan names, prices and scope.

Visible FAQ may also be represented as `FAQPage` only when it remains in exact parity with the rendered questions and answers. Do not rely on FAQ rich-result eligibility as a core SEO strategy.

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
- no AI-only hidden content;
- no separate AI-specific copy that differs from visible human-facing content;
- no French, Russian, German or Italian copy in the first content pass;
- no production deployment as part of implementation without separate Owner approval.

## Acceptance criteria for the future implementation

- AC-001: English page exists at `/en/managed-linux` and uses the approved English content baseline.
- AC-002: Metadata title, description, H1, canonical and structured data are consistent with visible content.
- AC-003: The first 300–500 words make the service type, audience, starting price, supported baseline, scope boundary, server ownership and lack of standard 24/7 human SLA unambiguous.
- AC-004: The three plans are visibly separated and show exactly the approved monthly prices: €29, €69 and €129.
- AC-005: The page contains the explicit factual plan sentences for Monitor, Care and Managed.
- AC-006: Scope boundaries clearly distinguish monitoring, routine maintenance, hands-on administration and separately billed work.
- AC-007: The page explicitly states that standard plans do not include a 24/7 human-response SLA.
- AC-008: Supported and separate-review environments are visible.
- AC-009: PostgreSQL/MySQL wording is limited to basic database-service operations; advanced DBA/application database work is explicitly outside the standard monthly plans.
- AC-010: Visible FAQ and any FAQ structured data remain in parity.
- AC-011: CTA reuses an existing AzurSysTech contact/intake path; no new backend form is introduced.
- AC-012: The implementation reuses the current AzurSysTech components/design language rather than creating a parallel visual system.
- AC-013: No unsupported testimonials, client outcomes, uptime guarantees, ROI claims or security guarantees are added.
- AC-014: No FR/RU hreflang variant is emitted until the corresponding localized page exists.
- AC-015: Essential pricing and service-scope facts are ordinary rendered text, not image-only, hover-only, carousel-only or client-only content.
- AC-016: One H1 and a valid H2/H3 hierarchy are maintained.
- AC-017: The implementation remains a landing-page/SEO change and does not expand into monitoring infrastructure, billing, customer portal or production operations.

## Implementation handoff

Before writing page code, Codex should:

1. read `AGENTS.md`, `PROJECT_MAP.md`, `PRODUCT.md`, this specification, `docs/plans/WB-2026-09-19-managed-linux-service-design-brief.md`, and the current localized service-page implementation patterns;
2. initialize the normal Work Block / plan / tasklist required by the repository;
3. inspect the existing localized service page, metadata, sitemap, structured-data and contact-link patterns;
4. propose the minimal write-set;
5. preserve semantic HTML and server-rendered essential content;
6. implement only after the repository write gate is READY.

The implementation branch is:

`feat/managed-linux-service-landing`
