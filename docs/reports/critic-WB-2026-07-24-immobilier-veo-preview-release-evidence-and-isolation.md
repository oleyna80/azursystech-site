# Critic report — Veo Preview release evidence and isolation preflight

**Work Block:** `WB-2026-07-24-immobilier-veo-preview-release-evidence-and-isolation`  
**Role:** Critic / media-rights and verifier-isolation review  
**Verdict:** `SUPPLEMENT` — adopted by Control Tower

## Accepted conclusions

- Current official Google sources support only these limited facts: the exact
  model is Preview, Veo Fast is documented for backend/business use cases, and
  Gemini API paid-service terms include output non-ownership and customer
  responsibility.
- An external Google letter is not categorically required by the canonical
  instruction. A responsible human may make a `CONDITIONALLY_PERMISSIBLE`
  route decision from fresh official evidence plus the complete exact-candidate
  evidence tuple.
- None of those facts establishes exclusivity, copyrightability, indemnity,
  third-party clearance, or compliance of this exact candidate.
- `scripts/run-independent-verifier.sh` provides
  `independent-readonly-root`, not `os-isolated`: it retains the same OS user
  and inherited environment, and neither proves a clean credential-free
  environment nor an isolated source mount.

## Required supplements

1. Write the provider evidence only under the private
   `provider-evidence/**` subtree; keep raw provider artifacts out of Git.
2. Include or explicitly mark unavailable: service/endpoint/version/region/
   account tier, terms revision and retrieval evidence, output-use and
   disclosure rules, retention/training/logging/data residency/ZDR treatment,
   watermark and candidate provenance result, IP-protection eligibility and
   exclusions, safety constraints, and a responsible-human status decision.
3. Record Preview monitoring owner, revalidation triggers, and a migration or
   fallback decision.
4. Do not claim formal release readiness until a credential-free, separate OS
   user/container/equivalent readonly verifier proves `os-isolated`.

## Scope boundary

No provider call, credential/configuration change, media inspection or
transformation, application integration, publication, deploy, staging, commit,
or push is authorized by this report.

## Critic-approved write-set

- `.agent/critic-gate.md`
- `.agent/verification-gate.md`
- `.codex/write-gate.md`
- `docs/tasklist/WB-2026-07-24-immobilier-veo-preview-release-evidence-and-isolation.tasklist.md`
- `docs/reports/critic-WB-2026-07-24-immobilier-veo-preview-release-evidence-and-isolation.md`
- `docs/reports/WB-2026-07-24-immobilier-veo-preview-release-evidence-and-isolation-verification.md`
- `memory_bank/context.md`
- `memory_bank/orchestrator-log.md`
- `memory_bank/progress.md`
- `memory_bank/review-log.md`
- `/home/azur/.local/share/azursystech-private/ai-video-evidence/AST-IMMOBILIER-HERO-VEO31FAST-20260724-01/provider-evidence/**`
- `/home/azur/.local/share/azursystech-private/ai-video-evidence/AST-IMMOBILIER-HERO-VEO31FAST-20260724-01/rights-and-consent/**`
- `/home/azur/.local/share/azursystech-private/ai-video-evidence/AST-IMMOBILIER-HERO-VEO31FAST-20260724-01/release-and-revocation/**`
