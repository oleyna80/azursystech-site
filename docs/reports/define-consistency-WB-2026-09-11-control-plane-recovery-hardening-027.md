---
artifact_type: define_consistency
work_block_id: WB-2026-09-11-control-plane-recovery-hardening-027
revision: terminal-publication-reconciliation-r2
status: READY
---

# Define consistency — control-plane recovery hardening

- Specification, plan, tasklist, and traceability use the same Work Block ID
  and `terminal-publication-reconciliation-r2` revision.
- The successor branch and baseline are identical across the plan and active
  operational rebind.
- The corrective source write-set is explicitly limited to the existing
  recovery surfaces plus `.agent/hooks/hard_stop_policy.py` and its focused
  GitHub-capability regression test; coordination artifacts remain separate.
- Terminal publication derives exactly one plan and one tasklist from the
  active parent Work Block identity and rejects unrelated or arbitrary paths.
- The plan preserves all hard stops and does not authorize predecessor repair,
  topology-source edits, publication, merge, deployment, or cleanup.
- Define quality: READY. No unresolved scope, architecture, authority, or
  acceptance contradiction was found.
