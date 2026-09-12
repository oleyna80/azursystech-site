---
artifact_type: capability_probe
work_block_id: WB-2026-09-11-control-plane-recovery-hardening-027
revision: recovery-successor-r1
status: READY
---

# Native capability preflight — recovery successor

Three bounded native, read-only explorer contexts completed successfully.
Each observed the exact successor root, branch, and baseline HEAD and reported
no file or Git mutation.

| Probe | Execution/context ID | Dispatch reference | Runtime | Adapter | Version | Result |
|---|---|---|---|---|---|---|
| 1 | `01a09510-2125-77b1-a59e-f39f9d2c0842` | `native_dispatch:01a09510-2125-77b1-a59e-f39f9d2c0842` | runtime-provided | multi_agent_v1 | runtime-provided | READY |
| 2 | `01a09510-21b3-7160-a1e3-f7cd03647704` | `native_dispatch:01a09510-21b3-7160-a1e3-f7cd03647704` | runtime-provided | multi_agent_v1 | runtime-provided | READY |
| 3 | `01a09510-2241-7cf1-96e7-3f0d28ba8db8` | `native_dispatch:01a09510-2241-7cf1-96e7-3f0d28ba8db8` | runtime-provided | multi_agent_v1 | runtime-provided | READY |

Observed in all probes:

```text
root   /tmp/azursystech-wb-control-plane-recovery-hardening-027-r1
branch feat/control-plane-recovery-hardening-027-r1
HEAD   7c19720422d317ac36286691d540a966e3620fc0
```

Selected topology policy: `native-separate-context-required` for required
Critic, Reviewer, and Verifier roles. Native contexts are role-separated; this
does not claim OS/filesystem isolation. Required role bindings are added only
after their separate dispatches and candidate identity are available.
