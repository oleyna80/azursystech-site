#!/usr/bin/env python3
"""Deterministic positive and adversarial topology-contract fixtures."""
from __future__ import annotations

import copy
import datetime as dt
import json
import shutil
import sys
import subprocess
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / ".codex" / "scripts"))
from subagent_topology import TopologyError, validate
from lifecycle import candidate_content_identity, validate_closeout_state


NOW = dt.datetime(2026, 9, 9, 21, 30, tzinfo=dt.timezone.utc)


def state(root: Path) -> dict:
    timestamp = NOW.isoformat().replace("+00:00", "Z")
    capability = {"status": "available", "runtime": "codex", "adapter": "codex", "adapter_version": "1", "repository_root": str(root), "probe_event_ref": "probe-1", "verified_at": timestamp}
    bindings = []
    for role in ("critic", "reviewer", "verifier"):
        report = f"docs/reports/{role}.md"
        target = root / report
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text("evidence\n", encoding="utf-8")
        bindings.append({"work_block_id": "WB-test", "role": role, "execution_id": f"execution-{role}", "context_id": f"execution-{role}", "context_id_source": "execution_id", "runtime": "codex", "adapter": "codex", "adapter_version": "1", "source_revision": "abc123", "repository_root": str(root), "branch": "feat/test", "readonly_boundary": "runtime-readonly", "launch_mechanism": "native", "topology_tier": "native-separate-context", "probe_event_ref": "probe-1", "report": report, "status": "READY", "observed_at": timestamp})
    write_set = ["docs/reports/**"]
    frozen_revision = candidate_content_identity(root, write_set)
    for binding in bindings:
        binding["source_revision"] = frozen_revision
    return {"schema_version": 3, "authority_mode": "github_capability", "governance_profile": "Assured", "non_trivial": True, "work_block_id": "WB-test", "subject_branch": "feat/test", "base_commit": "abc123", "write_set": write_set, "frozen_revision": frozen_revision, "critic": {"status": "READY", "verdict": "APPROVE", "report": "docs/reports/critic.md"}, "define_quality": {"required": True, "status": "READY", "requirements_review": "docs/reports/requirements.md", "traceability": "docs/reports/traceability.md", "consistency_analysis": "docs/reports/consistency.md"}, "assurance": {"review": {"required": True, "status": "READY", "verdict": "READY", "report": "docs/reports/reviewer.md", "execution_id": "execution-reviewer"}, "verification": {"required": True, "status": "READY", "verdict": "READY", "report": "docs/reports/verifier.md", "execution_id": "execution-verifier"}, "evaluation": {"required": False, "status": "SKIPPED", "verdict": "", "skip_reason": "not required"}, "drift": {"required": False, "status": "SKIPPED", "verdict": "", "skip_reason": "not required"}}, "subagent_topology": {"policy": "native-separate-context-required", "status": "READY", "capability": capability, "role_bindings": bindings}}


def denied(value: dict, root: Path, phase: str, label: str) -> None:
    try:
        validate(value, phase=phase, root=root, now=NOW)
    except TopologyError:
        return
    raise AssertionError(f"{label}: expected denial")


def denied_closeout(value: dict, root: Path, label: str) -> None:
    try:
        validate_closeout_state(value, "success-closeout", root)
    except ValueError:
        return
    raise AssertionError(f"{label}: expected denial")


def denied_pretool_source_write(value: dict, root: Path) -> None:
    """Exercise the hook's actual Write dispatch and standard deny response."""
    (root / ".agent").mkdir(parents=True, exist_ok=True)
    (root / ".agent" / "active-work-block.json").write_text(
        json.dumps(value), encoding="utf-8"
    )
    (root / "scripts").mkdir(parents=True, exist_ok=True)
    shutil.copy2(
        Path(__file__).resolve().parent / "subagent_topology.py",
        root / "scripts" / "subagent_topology.py",
    )
    subprocess.run(
        ["git", "init", "--initial-branch", "feat/test"],
        cwd=root,
        check=True,
        capture_output=True,
        text=True,
    )
    event = {
        "cwd": str(root),
        "tool_name": "Write",
        "tool_input": {"file_path": "governance/authority.md"},
    }
    result = subprocess.run(
        [sys.executable, str(Path(__file__).resolve().parents[1] / ".codex" / "hooks" / "pre_tool_use_policy.py")],
        cwd=root,
        input=json.dumps(event),
        capture_output=True,
        text=True,
        check=False,
    )
    if result.returncode != 0:
        raise AssertionError(
            "PreToolUse source-write denial must return the standard hook response:\n"
            f"stdout:\n{result.stdout}\nstderr:\n{result.stderr}"
        )
    try:
        response = json.loads(result.stdout)
    except json.JSONDecodeError as exc:
        raise AssertionError(f"PreToolUse denial was not JSON: {result.stdout!r}") from exc
    output = response.get("hookSpecificOutput", {})
    if output.get("permissionDecision") != "deny":
        raise AssertionError(f"PreToolUse invalid topology was not denied: {response!r}")
    if not str(output.get("permissionDecisionReason") or "").startswith(
        "Native subagent topology admission failed:"
    ):
        raise AssertionError(f"PreToolUse denial used the wrong reason: {response!r}")


def main() -> int:
    with tempfile.TemporaryDirectory(prefix="subagent-topology-") as holder:
        root = Path(holder)
        valid = state(root)
        validate(valid, phase="admission", root=root, now=NOW)
        validate(valid, phase="closeout", root=root, now=NOW)
        validate_closeout_state(valid, "success-closeout", root)
        hook_invalid = copy.deepcopy(valid)
        hook_invalid["write_gate"] = {"status": "READY", "opened_at": NOW.isoformat()}
        hook_invalid["specification"] = {"path": "docs/specs/WB-test.md", "revision": "v1"}
        hook_invalid["write_set"] = ["governance/authority.md"]
        hook_invalid["subagent_topology"]["role_bindings"][0]["launch_mechanism"] = "same-session"
        with tempfile.TemporaryDirectory(prefix="pretool-source-write-") as hook_holder:
            denied_pretool_source_write(hook_invalid, Path(hook_holder))
        cases = []
        absent = copy.deepcopy(valid); absent.pop("subagent_topology"); cases.append((absent, "admission", "absent evidence"))
        unknown = copy.deepcopy(valid); unknown["subagent_topology"]["capability"]["status"] = "unknown"; unknown["subagent_topology"].update({"status": "DEGRADED", "degraded_reason": "probe unavailable"}); cases.append((unknown, "admission", "unknown capability"))
        conditional = copy.deepcopy(valid); conditional["subagent_topology"]["capability"]["status"] = "conditional"; conditional["subagent_topology"].update({"status": "DEGRADED", "degraded_reason": "capability is conditional"}); cases.append((conditional, "admission", "conditional capability"))
        unavailable = copy.deepcopy(valid); unavailable["subagent_topology"]["capability"]["status"] = "unavailable"; unavailable["subagent_topology"].update({"status": "DEGRADED", "degraded_reason": "native capability unavailable"}); cases.append((unavailable, "admission", "unavailable capability"))
        failed = copy.deepcopy(unknown); failed["subagent_topology"]["capability"]["status"] = "launch_failed"; cases.append((failed, "admission", "launch failure"))
        reused = copy.deepcopy(valid); reused["subagent_topology"]["role_bindings"][1]["execution_id"] = "execution-critic"; reused["subagent_topology"]["role_bindings"][1]["context_id"] = "execution-critic"; cases.append((reused, "closeout", "reused execution"))
        context_reused = copy.deepcopy(valid); context_reused["subagent_topology"]["role_bindings"][1]["execution_id"] = "execution-reviewer-new"; context_reused["subagent_topology"]["role_bindings"][1]["context_id"] = "execution-critic"; context_reused["subagent_topology"]["role_bindings"][1]["context_id_source"] = "platform_context_id"; cases.append((context_reused, "closeout", "reused context with distinct execution"))
        duplicate = copy.deepcopy(valid); duplicate["subagent_topology"]["role_bindings"][1]["role"] = "critic"; cases.append((duplicate, "closeout", "duplicate role"))
        overclaim = copy.deepcopy(valid); overclaim["subagent_topology"]["role_bindings"][0]["launch_mechanism"] = "same-session"; cases.append((overclaim, "admission", "same-session overclaim"))
        critic_denied = copy.deepcopy(valid); critic_denied["critic"]["status"] = "DEGRADED"; cases.append((critic_denied, "admission", "Critic admission denial"))
        root_mismatch = copy.deepcopy(valid); root_mismatch["subagent_topology"]["capability"]["repository_root"] = str(root.parent / "other"); cases.append((root_mismatch, "admission", "root mismatch"))
        stale = copy.deepcopy(valid); stale["subagent_topology"]["role_bindings"][0]["work_block_id"] = "WB-stale"; cases.append((stale, "admission", "stale Work Block"))
        stale_capability = copy.deepcopy(valid); stale_capability["subagent_topology"]["capability"]["verified_at"] = (NOW - dt.timedelta(hours=25)).isoformat(); cases.append((stale_capability, "admission", "stale capability timestamp"))
        stale_binding = copy.deepcopy(valid); stale_binding["subagent_topology"]["role_bindings"][0]["observed_at"] = (NOW - dt.timedelta(hours=25)).isoformat(); cases.append((stale_binding, "admission", "stale binding timestamp"))
        branch_mismatch = copy.deepcopy(valid); branch_mismatch["subagent_topology"]["role_bindings"][0]["branch"] = "feat/other"; cases.append((branch_mismatch, "admission", "branch mismatch"))
        frozen = copy.deepcopy(valid); frozen["frozen_revision"] = "frozen"; cases.append((frozen, "closeout", "mismatched frozen revision"))
        missing_report = copy.deepcopy(valid); missing_report["subagent_topology"]["role_bindings"][0]["report"] = ""; cases.append((missing_report, "admission", "missing report linkage"))
        traversal = copy.deepcopy(valid); traversal["subagent_topology"]["role_bindings"][0]["report"] = "docs/reports/../escape.md"; cases.append((traversal, "admission", "report traversal"))
        absolute = copy.deepcopy(valid); absolute["subagent_topology"]["role_bindings"][0]["report"] = "/tmp/escape.md"; cases.append((absolute, "admission", "absolute report"))
        outside = root / "outside-report.md"
        outside.write_text("outside\n", encoding="utf-8")
        symlink = root / "docs/reports/symlink.md"
        symlink.symlink_to(outside)
        symlink_escape = copy.deepcopy(valid); symlink_escape["subagent_topology"]["role_bindings"][0]["report"] = "docs/reports/symlink.md"; cases.append((symlink_escape, "admission", "report symlink escape"))
        for value, phase, label in cases:
            denied(value, root, phase, label)
        assurance_report = copy.deepcopy(valid); assurance_report["assurance"]["review"]["report"] = "docs/reports/wrong.md"; denied_closeout(assurance_report, root, "review report mismatch")
        assurance_execution = copy.deepcopy(valid); assurance_execution["assurance"]["verification"]["execution_id"] = "execution-other"; denied_closeout(assurance_execution, root, "verification execution mismatch")
    print("subagent topology matrix: OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
