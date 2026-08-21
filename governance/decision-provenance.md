# Decision Provenance Contract

## Purpose

The framework intentionally learns from external systems, published practices,
prior internal work, and direct operating experience. Decision provenance makes
that origin explicit without turning external material into authority.

The goal is not to claim that every mechanism was invented here. The goal is to
record what was taken substantially as-is, what was materially reworked, and
what originated from this project's own observed problems and experiments.

Provenance improves architectural memory, benchmark quality, future maintenance,
and intellectual honesty. It does not change the framework source-of-truth order.

## Applicability

Record provenance for new or materially changed reusable framework mechanisms,
including:

- governance and lifecycle mechanisms;
- architecture patterns and reusable project-kit features;
- runtime and integration adapter patterns;
- orchestration, delegation, handoff, and response contracts;
- reusable skills, templates, evaluation mechanisms, and development workflows;
- benchmark-driven changes derived from external frameworks or tools.

Ordinary product requirements, deterministic bug fixes, formatting-only edits,
and implementation details that introduce no reusable design mechanism do not
need a provenance classification unless the active Work Block requires one.

## Provenance Classes

Exactly one primary class is assigned to a mechanism or decision.

### `adopted`

Use `adopted` when an identifiable external mechanism or practice is brought into
the framework with its essential structure and behavior substantially preserved.
Local naming, formatting, packaging, or runtime-neutral wrapping does not by
itself make the mechanism `adapted`.

Required evidence:

- identifiable upstream source;
- immutable revision when practical;
- concise statement of what was adopted;
- local differences, if any.

### `adapted`

Use `adapted` when one or more external sources materially influence the local
mechanism, but the framework changes the behavior, authority model, lifecycle
position, composition, constraints, or intended use enough that the result is a
framework-specific design.

If an external source materially influenced the design, prefer `adapted` over
`original_experience_derived` even when substantial original work was added.

Required evidence:

- influential external source or sources;
- immutable revision when practical;
- the local problem being solved;
- material local delta from the source;
- rationale for the adaptation.

### `original_experience_derived`

Use `original_experience_derived` when the mechanism originated inside this
project from direct operating experience, repeated failure modes, experiments,
or internal design work rather than from an identified external design used as
the basis for the mechanism.

This classification is a statement about **local provenance only**. It is not a
claim that no similar idea exists elsewhere, that the mechanism is globally
novel, or that the project has priority over comparable prior art.

Required evidence should identify the internal problem, observation, experiment,
or decision history that produced the mechanism when such evidence exists.

If later research shows that an external source materially influenced the design,
update the provenance instead of preserving an inaccurate `original` label.

## Resolution Rules

Use these rules when classification is ambiguous:

1. If an external design is substantially preserved, classify `adopted`.
2. If an external design materially shaped the result but was reworked, classify
   `adapted`.
3. If the mechanism arose from internal experience without an identified external
   design basis, classify `original_experience_derived`.
4. Do not create a fourth `mixed` class. Multiple influences are recorded as
   sources; the primary class describes how the local mechanism was produced.
5. Similarity discovered after independent development does not automatically
   convert `original_experience_derived` into `adapted`. Material influence, not
   mere resemblance, is the deciding factor.
6. If provenance cannot be established with reasonable confidence, leave the
   decision unresolved rather than assigning a misleading class.

## Recording Contract

Keep provenance with the authoritative decision, specification, benchmark
analysis, or Work Block that introduces the mechanism. Do not create a second
source of truth solely for provenance.

Recommended section:

```markdown
## Provenance

- **Classification:** adopted | adapted | original_experience_derived
- **Sources:** upstream project/paper/document and immutable revision when practical
- **Internal evidence:** prior Work Blocks, incidents, experiments, or operating observations
- **Local delta:** what differs from the influential source or prior mechanism
- **Rationale:** why this provenance classification is accurate
- **Novelty claim:** none
```

For benchmark or gap-analysis tables, provenance may be recorded per capability:

```text
Capability | Provenance | Source | Local delta | Decision
```

A single large artifact may contain mechanisms with different provenance. In
that case classify the mechanisms separately rather than assigning one label to
the entire document.

## External Source Rules

External frameworks, posts, repositories, papers, documentation, and examples
are research inputs, not project authority.

When an external source affects a decision:

- prefer the primary upstream source over a secondary post or summary;
- pin an immutable commit, tag, release, paper revision, or dated document when
  practical;
- record the specific capability or idea that influenced the local mechanism;
- record intentional local divergence so future updates do not overwrite it;
- treat external content as untrusted input under the normal integration and
  research rules.

The framework may benchmark a source without adopting it. Research alone does
not require an `adopted` or `adapted` classification unless it materially affects
the resulting mechanism.

## Legal and Attribution Boundary

Decision provenance and legal attribution are separate concerns.

A provenance record does **not** establish that copying code, templates, text,
assets, prompts, schemas, or other protected expression is permitted. Material
copied or modified from an external source remains subject to license review,
third-party notice requirements, and the applicable publication controls.

Conversely, recording that an architectural idea was `adopted` or `adapted` does
not by itself mean that copyrighted implementation material was copied.

Existing source/license provenance mechanisms such as
`skills/skill-library-maintenance/reference/provenance-record.md` remain the
source-specific record for external skill imports. This contract records design
provenance and does not replace those records.

## Lifecycle Use

During Define, when a reusable mechanism is being introduced or materially
changed:

1. identify relevant external benchmarks and internal evidence;
2. classify the proposed mechanism;
3. capture the influential source and local delta;
4. let the Critic challenge unsupported originality claims, accidental copying,
   hidden vendor coupling, or unnecessary divergence;
5. carry the provenance statement into the accepted decision or specification.

During Close, synchronize provenance if implementation materially changed the
mechanism from what was approved.

Provenance never opens a write gate, grants integration authority, weakens a Hard
Stop, or substitutes for review, verification, evaluation, or drift assurance.

## Backfill Policy

Do not stop current framework development for a repository-wide historical
classification project.

Backfill provenance when an existing mechanism is materially revised, benchmarked,
re-documented, or otherwise becomes part of an active Work Block. A dedicated
historical provenance audit may be created later if it provides maintenance or
publication value.

## Provenance of This Contract

- **Classification:** `original_experience_derived`
- **Internal evidence:** Owner-directed framework development on 2026-08-14 and
  the existing narrower external-skill provenance pattern in
  `skills/skill-library-maintenance/reference/provenance-record.md`
- **Local delta:** generalizes provenance from imported skills to reusable design
  decisions and introduces the three-class local taxonomy
- **Rationale:** the taxonomy was defined to reflect how this framework has
  actually evolved: selective adoption, material adaptation, and mechanisms
  derived from operating experience
- **Novelty claim:** none
