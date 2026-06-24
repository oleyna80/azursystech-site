# Dirty Tree Disposition Draft

- **Work Block:** `WB-2026-06-20-dirty-tree-disposition`
- **Stage:** Implementation / Review-fix
- **Status:** Review K `NEEDS_CHANGES` cycle gap fixed; K re-review, Verification, and Owner decisions pending
- **Coverage:** A 14/100 batches, B 15/63, C 15/32, D 15/25, E 15/17, F metadata 237/237 and content 0/237
- **Authority:** every group below is a proposal; no group is approved to stage or commit.

The canonical path-level manifest is
`docs/reports/inventory-WB-2026-06-20-dirty-tree-disposition.yml`.
It is JSON-compatible YAML for Python stdlib parsing and preserves every B0 raw
path/status/hash/size field.

## Major Findings

1. The baseline contains exactly 237 subjects: 41 tracked modifications and 196 untracked paths; staging was empty at B0.
2. `.claude/settings.json` is private configuration and remains an Owner decision without payload inspection.
3. Thirty-four imported Claude skill-bundle paths lack settled provenance/vendor evidence and remain deferred at high risk.
4. Thirty-one showcase paths and three main-web integration paths form one 34-path cross-domain atomic HOLD for a focused future Work Block. `package-lock.json` and `next-env.d.ts` retain generated-derived semantics and require regenerate-and-compare; inclusion never makes them automatically commit-worthy.
5. The ten-path proxy release unit is atomic and high risk; config, env-example, CI, deploy, proxy, and deployment-runbook paths must not be separated casually.
6. Legal and leads content require Owner decisions and T3 review. AI assets require provenance/schema decisions.
7. `.gitattributes` is first-order portability policy. The env-example ignore conflict and eight untracked executable Python mode decisions remain unresolved.
8. F found one Unicode path, no case or Windows reserved-name collision, maximum path length 77, and no upstream. A literal `coverage/` candidate returned no ignore match (`git check-ignore` exit 1), but it is not in B0 and no existing coverage artifact is claimed; future policy resolution belongs to E2.
9. `root-html-lang-content-mismatch` identifies showcase root HTML language versus rendered-content locale concerns for accessibility and SEO. It is not a filesystem portability marker.

## Control and Dependency Semantics

The B0/C intersection is intentional. `.codex/write-gate.md` remains lifecycle
control. The pre-Work-Block contents of `memory_bank/orchestrator-log.md` and
`memory_bank/external-team-log.md` remain frozen A9 subjects; only new
append-only J2 entries are control writes. Their inventory hashes and sizes
therefore remain B0 snapshot evidence, while the validator intentionally omits
active C paths from B0-C content immutability checks.

The validator is a C-B0 control artifact and is not added to the 237-subject
inventory. Its observed filesystem mode is `0664`; it is untracked, has no Git
index mode, is non-executable, and must remain non-executable unless an
Owner-approved policy change says otherwise.

The inventory's `external_dependencies` registry resolves all 42 dependency
keys that are not one of the 27 declared group names. Every registry record has
a category, resolution owner, expected follow-up Work Block or decision, and
status. All remain `unresolved`. The former C2/C3/D2 internal cycle is replaced
by one `C2D2-showcase-integration-atomic-hold` boundary with only external
gates; no dependency or merged membership confers commit authority.

## Proposed Groups

| Group | Count | Disposition | Dependency / ordering | Tier | Risk |
|---|---:|---|---|---|---|
| A1 agent runtime transition | 8 | proposed portable | consistency review; precedes durable runtime docs | T2 | medium |
| A2 private config | 1 | Owner decision | private boundary; no payload review | T3 | high |
| A3 imported Claude skills | 34 | deferred WB | source, license, vendor, executable-mode provenance | T3 | high |
| A4 current WB control | 1 | generated/derived | retain only as lifecycle evidence | T1 | low |
| A5 Codex runtime | 6 | deferred WB | SDLC runtime consistency and portability review | T3 | high |
| A6 workflow docs | 12 | proposed portable | after runtime consistency; before navigation refresh | T2 | medium |
| A7 feature records | 20 | deferred by feature | owning feature state and archival review | T2 | medium |
| A8 archival reports | 10 | deferred WB | provenance, current-vs-historical authority | T2 | medium |
| A9 memory-bank history | 6 | Owner decision | privacy/history ownership | T3 | high |
| A10 navigation last | 2 | proposed portable | all accepted groups must settle first | T2 | medium |
| B1 strategy SSOT | 7 | proposed portable | strategy consistency first | T2 | medium |
| B2 pivot content | 21 | deferred WB | approved pivot/SSOT | T2 | medium |
| B3 showcase content | 8 | deferred WB | C showcase decision | T2 | medium |
| B4 legal review | 4 | Owner decision | legal review | T3 | high |
| B5 leads review | 7 | Owner decision | privacy/data lifecycle review | T3 | high |
| B6 AI governance | 8 | proposed portable | internal consistency and strategy SSOT | T2 | medium |
| B7 AI assets | 7 | Owner decision | provenance and schema validation | T3 | high |
| B8 AI runs boundary | 1 | Owner decision | generated-output retention policy | T2 | medium |
| C1 showcase strategy | 1 | deferred WB | separate provenance decision | T2 | high |
| C2D2 showcase integration atomic HOLD | 34 | mixed conservative entry dispositions; deferred operational boundary | Owner integration decision, fixes, asset provenance, regenerate-and-compare, T1-T3 | T3 | high |
| D1 web product/privacy | 20 | proposed portable | product/privacy T3 approval | T3 | high |
| D3 chat API security | 1 | deferred WB | security/API T3 | T3 | high |
| D4 web config | 1 | Owner decision | config and runtime T3 | T3 | high |
| E1 proxy release HOLD | 10 | deferred WB | one atomic release/config/deploy unit | T3 | high |
| E2 ignore policy HOLD | 3 | deferred WB | resolve generated/private boundaries first | T3 | high |
| E3 gitattributes | 1 | proposed portable | first-order portability policy | T2 | medium |
| E4 ops provisional | 3 | proposed portable | strategy/product SSOT | T2 | medium |

## Owner Decisions

- Decide whether `.claude/settings.json` remains local/private and confirm no synchronized payload is intended.
- Decide privacy/history treatment for all six `memory_bank/` paths.
- Approve legal content ownership and review path before any B4 portability decision.
- Approve lead-data/privacy semantics before any B5 portability decision.
- Resolve source/license/schema ownership for imported skills and AI assets.
- Decide generated retention for `05_ai/runs/.gitkeep`, showcase generated files, and future coverage-output boundary policy.
- Approve config/runtime treatment for `web/next.config.ts` and the ten-path proxy release unit.
- Resolve executable mode for eight untracked Python files and the `.env.vps.example` ignore-policy conflict.

## Follow-Up Work Blocks

1. Agent runtime consistency and imported-skill provenance.
2. Product strategy SSOT, pivot content, legal, leads, and AI-governance decisions.
3. Showcase atomic repair, asset provenance, generated-file comparison, and T1-T3 verification.
4. Web product/privacy review, showcase integration, chat API security, and web config.
5. Proxy release/config/deploy review, ignore policy, executable modes, and cross-platform `.gitattributes` verification.
6. Historical reports and memory-bank privacy/provenance review, followed by navigation regeneration last.

## Review K Fix

Review K returned `NEEDS_CHANGES` because C2 depended on C3/D2 while C3 and D2
depended back on C2, and the validator did not reject internal cycles. The
operational model now merges the exact 29 C2, 2 C3, and 3 D2 members into
`C2D2-showcase-integration-atomic-hold` (34 paths). Entry-level domain owners
and dispositions remain unchanged. The merged boundary represents one future
focused showcase/main-web integration Work Block and has only unresolved
external gates: Owner integration decision, fixes, asset provenance,
generated-artifact regenerate-and-compare, and T1-T3 verification.

The stdlib validator now builds the internal group graph and rejects a cycle
with its concrete path and remediation text. The current 27-group model is
acyclic. K re-review remains pending; this fix is not Review approval.

## Claude SUPPLEMENT Triage

- **F1 - accepted external coverage limit:** Claude could not read B0 from `/tmp`; no repository copy will be created. The local stdlib validator independently passes against B0 count `237` and hash `7041c3a287c32c3a232dae09af8d304f501dfb274ef0eefd5d500a59efe2b453`. Native Review and Verification must repeat the comparison.
- **F2 - clarified:** B0 and C may intersect. The two logs retain A9 subject history while only new append entries are controls; they remain in B0, A9, and C.
- **F3 - clarified:** the validator is a non-executable `0664` C-B0 control artifact, outside the subject inventory, with an enforced mode policy.
- **F4 - accepted:** all non-group dependency keys now resolve through the structured external dependency registry; referential integrity and status values are validator-enforced.
- **F5 - accepted:** `wrong-root-language` was replaced by `root-html-lang-content-mismatch`, an accessibility/SEO content-locale concern rather than filesystem portability.
- **F6 - clarified:** Claude received the task contents as its prompt but did not separately read the source task path; this is a chain-of-custody limitation, not a repository defect.
- **F7 - noted:** the C1 T2/high combination is internally consistent; no correction is required.
- **F8 - accepted:** the exact `coverage/` metadata probe and E2 routing are recorded without claiming that a coverage artifact exists.

## Residual Risks

The classifications are evidence-based proposals, not commit authority. A-F did
not inspect every subject payload: F inspected metadata only and content coverage
was 0/237. Provenance, privacy, legal, config, runtime, deploy, security, generated
retention, and executable-mode decisions remain unresolved. The Claude audit is
triaged, but its B0 comparison remained unverified. The reported C2/C3/D2 cycle
has been removed and validator enforcement added, subject to K re-review.
Independent Verification and explicit Owner decisions remain pending; no group
is approved to commit.
