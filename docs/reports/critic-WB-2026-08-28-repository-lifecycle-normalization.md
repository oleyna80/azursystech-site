# Critic report — WB-2026-08-28-repository-lifecycle-normalization

**Mode:** native subagent, read-only.
**Verdict:** SUPPLEMENT — adopted before implementation.

The Critic required the migration contract to be made operational rather than
only adding `migration_state`: normalize the historical completed plan, add its
canonical closeout record, and provide the missing fixture and workflow. It
also rejected ancestry-only deletion classification. The implementation adopts
both supplements: the validator is now backed by deterministic regression and
CI workflow assets, and the branch audit uses evidence classes with explicit
preservation and investigation states. No cleanup action was authorized.

`critic-review` skill was unavailable in this checkout; native Critic output is
the recorded independent review input.

## Follow-on operational active-record P1

**Mode:** native subagent, read-only.
**Verdict:** SUPPLEMENT — adopted before the corrective implementation.

The Critic confirmed that the release contract had to cross-check the operational
JSON without inventing a second active-plan-path field. The correction therefore
resolves the canonical registry/Project Map plan, compares its frontmatter Work
Block identity with the JSON identity, validates the declared specification path,
and fails closed for missing, malformed, or stale operational state. Disposable
real-validator fixtures cover matching state, both mismatch directions, and
missing/malformed/stale state. Fresh local assurance is required after this
correction; no external authority is implied.
