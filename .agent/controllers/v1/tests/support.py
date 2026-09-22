from __future__ import annotations

import copy
import datetime as dt

from v1.clock import UTC, fixed_clock, render_utc
from v1.lifecycle import open_work_block
from v1.recovery import CANONICAL_INACTIVE_TEMPLATE

NOW = dt.datetime(2030, 1, 2, 12, 0, tzinfo=UTC)
ROOT = "/repo/wb"
WB = "WB-TEST-001"
BRANCH = "feat/test"
DEFINE = "sha256:" + "d" * 64


def capability(*, instant: dt.datetime = NOW, suffix: str = "cap") -> dict:
    return {
        "status": "available",
        "work_block_id": WB,
        "repository_root": ROOT,
        "execution_id": f"execution-{suffix}",
        "context_id": f"context-{suffix}",
        "context_id_source": "runtime",
        "runtime": "codex",
        "adapter": "native-runtime",
        "adapter_version": "1",
        "evidence_identity": "sha256:" + "e" * 64,
        "verified_at": render_utc(instant),
    }


def role_binding(
    role: str,
    result: str,
    *,
    instant: dt.datetime = NOW,
    suffix: str | None = None,
    attempt: str | None = None,
) -> dict:
    label = suffix or role
    value = {
        "role": role,
        "work_block_id": WB,
        "define_identity": DEFINE,
        "execution_id": f"execution-{label}",
        "context_id": f"context-{label}",
        "context_id_source": "runtime",
        "isolation": "native-separate-context",
        "launch_mechanism": "native-runtime-subagent",
        "repository_root": ROOT,
        "branch": BRANCH,
        "runtime": "codex",
        "adapter": "native-runtime",
        "adapter_version": "1",
        "report": f"docs/reports/{label}.md",
        "report_identity": "sha256:" + "a" * 64,
        "result": result,
        "observed_at": render_utc(instant),
    }
    if attempt is not None:
        value["candidate_attempt_id"] = attempt
    return value


def dispatch(role: str, *, suffix: str | None = None) -> dict:
    label = suffix or role
    return {
        "role": role,
        "execution_id": f"execution-{label}",
        "context_id": f"context-{label}",
        "context_id_source": "runtime",
        "isolation": "native-separate-context",
        "launch_mechanism": "native-runtime-subagent",
        "runtime": "codex",
        "adapter": "native-runtime",
        "adapter_version": "1",
    }


def controller_binding() -> dict:
    return {
        "generation": "v1",
        "source_commit": "1" * 40,
        "package_identity": "sealed-surface-sha256-v1:" + "2" * 64,
        "policy_identity": "sha256:" + "3" * 64,
        "activation_record": "sha256:" + "4" * 64,
        "manifest_identity": "sha256:" + "5" * 64,
    }


def active_state(*, critic_instant: dt.datetime = NOW) -> dict:
    inactive = copy.deepcopy(CANONICAL_INACTIVE_TEMPLATE)
    admission = {
        "work_block_id": WB,
        "repository_root": ROOT,
        "subject_branch": BRANCH,
        "original_baseline": "0" * 40,
        "define_revision": "define-v1",
        "define_identity": DEFINE,
        "write_set": ["src/**"],
    }
    return open_work_block(
        inactive,
        admission=admission,
        controller_binding=controller_binding(),
        critic_binding=role_binding("critic", "APPROVE", instant=critic_instant),
        capability=capability(),
        clock=fixed_clock(NOW),
    )


def frozen_state(attempt: str = "attempt-1") -> dict:
    state = active_state()
    state["candidate"] = {
        "attempt_id": attempt,
        "frozen_commit": "6" * 40,
        "frozen_tree": "7" * 40,
        "sealed_manifest": "manifest.json",
        "sealed_manifest_identity": "sha256:" + "8" * 64,
        "sealed_surface_identity": "sealed-surface-sha256-v1:" + "9" * 64,
        "status": "FROZEN",
    }
    state["assurance"] = {
        "reviewer": {"required": True, "status": "PENDING", "candidate_attempt_id": attempt},
        "verifier": {"required": True, "status": "PENDING", "candidate_attempt_id": attempt},
        "evaluation": {"required": False, "status": "PENDING", "candidate_attempt_id": attempt},
        "drift": {"required": False, "status": "PENDING", "candidate_attempt_id": attempt},
    }
    state["lifecycle_phase"] = "Assure"
    state["write_gate"] = {"status": "BLOCKED", "opened_at": None}
    return state


def assurance_binding(
    role: str,
    result: str,
    *,
    attempt: str = "attempt-1",
    instant: dt.datetime = NOW,
) -> dict:
    binding = role_binding(role, result, attempt=attempt, instant=instant)
    binding.update(copy.deepcopy(frozen_state(attempt)["candidate"]))
    binding.pop("attempt_id", None)
    binding.pop("status", None)
    return binding
