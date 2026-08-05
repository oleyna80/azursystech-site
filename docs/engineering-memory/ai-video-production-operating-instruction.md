# AI Video Production Operating Instruction

**Status:** active, evidence-gated operating rule
**Research snapshot:** 2026-07-25
**Applies to:** future AI-video planning, generation, editing, integration,
and production release, including a possible Gemini API/Veo route.

The readable Markdown companion, [AI Video Generation and Publication Policy](../policies/ai-video-generation-and-publication-policy.md), is non-normative. This Markdown instruction is canonical; the companion does not authorize provider access, paid generation, or public release.

## Rule of interpretation

Do not describe AI-generated video as “unrestricted”, “rights-free forever”,
“exclusive”, or legally cleared merely because a provider says it does not
claim ownership of original output. That statement does **not** establish
copyrightability, exclusivity, clearance of third-party rights, a right to use
a trademark/person/voice/source asset, or a legal indemnity for the planned
use.

This instruction is an operational control, not legal advice and not an
authorization to use an API key, enter a provider account, spend money,
generate/download media, edit a video, or publish it. A future approved Work
Block supplies that authority.

`Preview` is a lifecycle, compatibility, stability, and availability signal;
by itself it neither grants nor removes commercial-use or public-release
eligibility. Until fresh evidence covers the exact provider, route, service,
model, terms, billing tier, and intended use, its status is
`NEEDS_PROVIDER_CONFIRMATION`. `GA` status or eligibility for an indemnity
programme likewise does not create universal output rights, exclusivity, or
legal clearance.

## Non-negotiable production statuses

| Status | Meaning | Generation | Public production release |
|---|---|---:|---:|
| `BLOCKED` | Input rights, required consent, final QC, human release decision, or a hard prohibition is missing, failed, or unresolved. | No | No |
| `NEEDS_PROVIDER_CONFIRMATION` | Exact provider-route or terms evidence is unknown, contradictory, expired, or unresolved for preview, contract, region, account tier, watermark, or rights-protection status. | No paid call | No |
| `CONDITIONALLY_PERMISSIBLE` | The exact route has current evidence and every input/right/consent condition is satisfied. | Only in a separately approved execution Work Block | Only after the exact-candidate release gate |
| `RELEASE_APPROVED` | A human approved one exact final candidate after all checks. This is not a universal legal guarantee. | N/A | Yes, for that candidate and stated release only |

Unknown, contradictory, or expired **provider-route** evidence is
`NEEDS_PROVIDER_CONFIRMATION`; it blocks a billable generation request and a
release and is never handled by switching to another provider silently.
Missing input rights, required consent, final QC, or human release decision is
`BLOCKED`.

## Current Google research conclusion

The following is a dated research snapshot, not a substitute for the exact
contract that applies on the day of a future request or release.

| Route | 2026-07-25 policy status | Why | Required next evidence |
|---|---|---|---|
| Gemini Developer API Veo with a Gemini API key (Paid Tier) | `CONDITIONALLY_PERMISSIBLE` after fresh exact-route evidence | Google's official Gemini API Terms state that Google does not claim ownership of original generated content. That is not an assignment, and it does not promise copyrightability, exclusivity, indemnity, or absence of third-party claims. `Preview` is a lifecycle signal, not a commercial prohibition. An individual Google letter is not required. | Paid billing invoice/receipt, exact model identifier and endpoint, current Google Gemini API Terms evidence, prompt lineage, input rights, focused final QC, SynthID/provenance record where available, and human exact-candidate release decision. |
| Paid GA Veo route through Google Cloud (Vertex AI) | `CONDITIONALLY_PERMISSIBLE` | Google’s Cloud terms treat generated output as Customer Data and list an output-indemnity framework for eligible paid GA services/models, with material exclusions. | Exact service and GA model eligibility, project/billing contract, region, terms revision, indemnity-list entry, exclusions, data handling, and release evidence. |
| Free/consumer/unknown-tier path or one with undocumented commercial terms | `BLOCKED` for client/confidential/rights-sensitive material | No evidence that the actual route satisfies the project’s evidence and data-use conditions. | A new approved provider-evidence decision; do not upload sensitive source material meanwhile. |

For the Gemini API, paid-service data handling and no-training claims are not
the same thing as Zero Data Retention, and do not by themselves authorize
sensitive inputs. A future Work Block must verify the actual eligible service
and configuration; do not infer ZDR from a paid account.

## Provider evidence tuple

Before paid generation and again before release, retain a redacted,
date-stamped decision covering all of the following:

1. provider and legal service name;
2. exact model identifier, endpoint/API, version/status (GA, preview, beta),
   region, and account/billing tier;
3. official terms/documentation URLs, their effective/revision date, and the
   date checked;
4. commercial/output-use statement, non-ownership wording, and any required
   attribution or restriction;
5. training, retention, logging, and data-residency treatment for the exact
   tier/feature;
6. visible watermark and provenance/SynthID treatment;
7. IP protection or indemnity scope and every relevant exclusion;
8. provider safety/use-policy constraints; and
9. an explicit `BLOCKED`, `NEEDS_PROVIDER_CONFIRMATION`, or
   `CONDITIONALLY_PERMISSIBLE` decision made by the responsible human.

For a preview route, the tuple must also record the model-status source and
date checked, compatibility/availability impact, change-monitoring owner,
revalidation trigger, and migration or fallback decision. Preview status is
not a substitute for any other gate and does not turn an otherwise unresolved
commercial or public use into an internal-only classification.

Freshness is **at most 30 calendar days**, and must be renewed sooner when a
model/API/terms/pricing/watermark/region/account-tier change occurs, a provider
notice arrives, a new source asset is introduced, a different intended use is
chosen, or immediately before public production release. A stale entry is not
grandfathered.

## Input rights and consent gate

Before a request, record sufficient evidence—not secrets or raw private
files—that the project may use every input for the intended territory, channel,
duration, and commercial purpose.

- Confirm ownership or license of images, video, music, fonts, product media,
  and every supplied reference asset.
- Obtain documented consent/model releases for identifiable people, voices,
  likenesses, and any biometric or personal data; do not use minors or
  sensitive contexts without the required legal review and consent.
- Do not use third-party trademarks, logos, product packaging, protected
  characters, or living-artist imitation unless the rights/approval basis is
  documented for the exact use. Avoid synthetic endorsements or impersonation.
- Do not represent a synthetic scene as documentary footage or a real human
  statement in a misleading way.
- Keep customer/private inputs out of an unapproved provider route. A paid
  account alone does not prove that the input treatment is appropriate.

Any unresolved item is `BLOCKED`; escalate to the Owner and, where material,
legal/procurement review instead of guessing.

## Future execution and media-handling flow

Each generation is a separate, approved execution Work Block. It must name the
candidate count and cost ceiling, source set, provider route, final purpose,
storage area, and responsible human. Credentials stay in approved secret
management and are never printed, committed, copied into prompts, manifests,
tasklists, reports, screenshots, or logs.

1. Verify the current provider evidence tuple and input-rights/consent gate.
2. Create a redacted request record before a paid call; verify configuration
   without displaying values and estimate cost against the approved limit.
3. Submit only the approved bounded candidates. Persist opaque request IDs and
   cost/result metadata; do not retry an ambiguous billable request or change
   provider/candidate count automatically.
4. Download only approved results into the approved candidate/quarantine area.
   Validate basic file integrity and send candidates to quality/rights review.
5. Document every transformation and every externally sourced postproduction
   input. Editing does not cure unclear source rights or provider status.
6. Keep SynthID/provenance intact where the provider embeds it. Never strip,
   hide, evade, or claim that provenance proves legal clearance.

## Private per-video evidence package

Use the repository-safe skeleton in
[docs/templates/ai-video-evidence-package](../templates/ai-video-evidence-package/README.md)
only to create a private, access-controlled, per-video evidence package outside
Git and the repository. It records an auditable internal authorization and
traceability chain; it is not proof of all external facts and does not provide
legal clearance.

The private package must link authorization/request references, intended use,
the provider route/model/status and current-terms evidence, preview lifecycle
controls where applicable, opaque prompt/parameter/operation references,
timestamps, input-rights/consent references, original and release hashes,
transformations, provenance/SynthID results, QA, exact-candidate approval,
release/revocation state, and retention/access evidence. Actual private
evidence, source/generated media, consent records, and raw provider material
remain in approved private storage, never in Git.

Never include API keys, authorization headers, signed URLs, account/project
identifiers, raw request/response bodies, private prompts, personal data,
consent documents, source/generated media, thumbnails, contact sheets, or
media bytes in the template, manifest, or repository evidence.

### Controlled private-evidence helper

`scripts/ai-video-private-evidence.sh` is a narrow local helper for a single
small, redacted record. Its production destination is fixed outside the
repository, requires root, and accepts no runtime destination override.
It accepts only an approved package identifier, category, and direct
`/tmp/*.record` input, preserving each validated record name below its category
so multiple immutable records are possible. It creates package directories with
mode `0700` and records with mode `0600`.
It rejects traversal, symlinks, media-like inputs, sensitive markers, and any
replacement of an existing record. It prints a status only, never record
content. The helper is traceability control, not provider authorization,
rights clearance, legal advice, or release authority.

### OS-isolated integrity attestation

OS-isolated attestation is required only when the approved Work Block or its
declared verifier-isolation tier requires it. It is a technical integrity
control, not a universal legal prerequisite for every low-risk release.

For a Work Block that requires `os-isolated` verification, the Owner may first
approve `scripts/provision-os-isolated-verifier.sh --apply`. The default
`--check` path is non-mutating. Provisioning creates only the dedicated
`azursystech-verifier` nologin system account and its root-owned clean
hierarchy. `scripts/run-os-isolated-verifier.sh` then requires root, copies a
fixed safe allowlist into a root-owned readonly snapshot, and runs only fixed
coreutils under `env -i` as that account. It does not run repository code,
Codex, network, provider, credential, or media operations; a missing condition
returns `BLOCKED` and never falls back to same-user verification.

Its bounded hash attestation proves only that the enumerated snapshot was read
under that process boundary. It is not legal clearance, a review of media
content, an output-rights decision, or automatic release approval. A paid or
Preview provider service does not change those limits.

## Exact-candidate release gate

A responsible human approves the **exact final file**—not merely a concept,
prompt, or a previous candidate—by matching its hash/opaque candidate ID,
release channels, intended territory/term, and completed checks:

- provider evidence is still current and matches the exact route;
- input rights and consent evidence matches the exact candidate;
- output has passed technical/quality review and the planned edits are logged;
- required attribution/disclosure is present;
- provenance/watermark policy is respected; and
- release copy does not falsely imply human capture, endorsement, exclusivity,
  or legal certainty.

If any evidence changes after approval, the status reverts to
`NEEDS_PROVIDER_CONFIRMATION` or `BLOCKED` until re-approved. Rejected,
quarantined, or source candidates must not be published accidentally.

### Compact low-risk per-video release decision

For an approximately 8-second, text-only asset with no real people,
third-party assets, brands, music, or claim of documentary capture, a
responsible human may make a compact per-video decision after the exact route
has fresh evidence. The private record must bind:

1. the paid provider route, exact model/endpoint, and terms-check date;
2. a safe text-only prompt reference and declaration that no third-party or
   personal inputs were supplied;
3. focused final QC for visible logos, people, misleading realism, unwanted
   pseudo-text, audio, and material defects;
4. the opaque provider operation reference and SHA-256 of the exact final
   file;
5. the responsible human's decision, limited to the stated channel, territory,
   and term; and
6. a disclosure decision that does not present the asset as real footage.

This is a proportionate business-risk decision and traceability record. It is
not a legal guarantee, copyright determination, exclusivity promise,
indemnity, or proof that no third party can bring a claim.

## Official-source baseline (recheck before use)

- [Gemini API Additional Terms](https://ai.google.dev/gemini-api/terms) — API
  responsibilities, output non-ownership statement, paid-service data terms,
  and prohibited-use obligations.
- [Veo in the Gemini API](https://ai.google.dev/gemini-api/docs/veo) — current
  model-status documentation, two-day server retention, and SynthID
  provenance/watermark information.
- [Google Cloud Service Specific Terms](https://cloud.google.com/terms/service-terms)
  — generated-output treatment and the conditional IP indemnity framework.
- [Generative AI Indemnified Services](https://cloud.google.com/terms/generative-ai-indemnified-services)
  — service/model eligibility must match the exact paid GA route.
- [Gemini API Zero Data Retention](https://ai.google.dev/gemini-api/docs/zdr)
  — separate ZDR eligibility/control requirements.
- [Google Generative AI Prohibited Use Policy](https://policies.google.com/terms/generative-ai/use-policy)
  — privacy, IP, personal-data, impersonation, and deceptive-use boundaries.

Use the currently applicable official or signed contract at the time of action.
If it differs from this snapshot, the current contract prevails and the action
is blocked until the evidence tuple and approval are refreshed.
