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
from subagent_topology import TopologyError, _utc, validate
from lifecycle import candidate_content_identity, validate_closeout_state


NOW = dt.datetime(2026, 9, 9, 21, 30, tzinfo=dt.timezone.utc)


def contract_documents(root: Path) -> None:
    """Reject stale topology prose without rejecting explicit degraded fallback."""
    paths = {
        "roster": root / ".agent/ROSTER.md",
        "agents": root / ".codex/AGENTS.md",
        "instructions": root / ".codex/instructions.md",
        "critic": root / ".codex/critic.md",
        "runtime": root / "runtimes/codex/README.md",
    }
    text = {name: path.read_text(encoding="utf-8") for name, path in paths.items()}

    forbidden = {
        "instructions": ("AGENTS.md -> Multi-Agent Default",),
        "agents": (
            "the installed\n  `.agent/skills/critic-review/SKILL.md`",
            "The Orchestrator may assign read-only scoped subagents within an approved objective.",
        ),
        "critic": ("Preferred for non-trivial Work Blocks when subagents are available",),
        "runtime": (
            "| Critic | `.codex/agents/critic.toml`",
            "├── agents/",
            "3. Review `.codex/agents/`,",
        ),
    }
    for name, phrases in forbidden.items():
        for phrase in phrases:
            if phrase in text[name]:
                raise AssertionError(f"{name} retains stale topology prose: {phrase}")

    required = {
        "roster": (
            "`critic-review` is not an assumed installed project skill.",
            "native Critic, Reviewer, and Verifier bindings",
        ),
        "agents": (
            "separate native read-only Critic context",
            "separate native read-only Reviewer and Verifier contexts",
            "never\n  satisfies required assurance or admission",
            "`unavailable`,\n  `conditional`, `unknown`, or `launch_failed`",
            "A skip never overrides the required\n  native topology",
            "the Orchestrator MUST assign required separate native\n  read-only Critic, Reviewer, and Verifier contexts",
        ),
        "instructions": (
            "separate native read-only Critic",
            "separate native read-only Reviewer and Verifier contexts",
            "never satisfies required assurance or admission",
            "Genuinely trivial work only:",
            "never overrides non-trivial `Managed`/`Assured` topology",
        ),
        "critic": (
            "Required for applicable non-trivial `Managed`/`Assured` Work Blocks",
            "same-session review",
            "`READY` assurance, or admission evidence",
            "The canonical topology also requires separate native Reviewer and Verifier",
            "defer to canonical degraded/blocked",
            "does not replace a required native Critic",
        ),
        "runtime": (
            "optional user/global runtime profile",
            "no `.codex/agents/*.toml` profiles are",
            "installed by this project",
            "do not pin models, reasoning, or",
            "providers in repository governance",
            "`unavailable`, `conditional`, `unknown`, or `launch_failed` remains an explicit",
            "`DEGRADED`/`BLOCKED` outcome. Same-context, manual, and inline passes may be",
            "recorded as advisory evidence, but never satisfy required assurance or",
            "successful closeout. They do not upgrade the required native topology",
            "`independent-readonly-root`/`os-isolated` isolation tier",
        ),
    }
    for name, phrases in required.items():
        for phrase in phrases:
            if phrase not in text[name]:
                raise AssertionError(f"{name} is missing required topology prose: {phrase}")


def state(root: Path) -> dict:
    timestamp = NOW.isoformat().replace("+00:00", "Z")
    capability = {"status": "available", "runtime": "codex", "adapter": "codex", "adapter_version": "1", "repository_root": str(root), "probe_event_ref": "native_dispatch:probe-critic,native_dispatch:probe-reviewer,native_dispatch:probe-verifier", "verified_at": timestamp}
    bindings = []
    for role in ("critic", "reviewer", "verifier"):
        report = f"docs/reports/{role}.md"
        target = root / report
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text("evidence\n", encoding="utf-8")
        execution_id = f"assurance-{role}"
        bindings.append({"work_block_id": "WB-test", "role": role, "execution_id": execution_id, "context_id": execution_id, "context_id_source": "execution_id", "runtime": "codex", "adapter": "codex", "adapter_version": "1", "source_revision": "abc123", "repository_root": str(root), "branch": "feat/test", "readonly_boundary": "runtime-readonly", "launch_mechanism": "native", "topology_tier": "native-separate-context", "probe_event_ref": f"native_dispatch:{execution_id}", "report": report, "status": "READY", "observed_at": timestamp})
    write_set = ["docs/reports/**"]
    frozen_revision = candidate_content_identity(root, write_set)
    bindings[0]["source_revision"] = "abc123"
    for binding in bindings[1:]:
        binding["source_revision"] = frozen_revision
    return {"schema_version": 3, "authority_mode": "github_capability", "governance_profile": "Assured", "non_trivial": True, "work_block_id": "WB-test", "subject_branch": "feat/test", "base_commit": "abc123", "write_set": write_set, "frozen_revision": frozen_revision, "critic": {"status": "READY", "verdict": "APPROVE", "report": "docs/reports/critic.md"}, "define_quality": {"required": True, "status": "READY", "requirements_review": "docs/reports/requirements.md", "traceability": "docs/reports/traceability.md", "consistency_analysis": "docs/reports/consistency.md"}, "assurance": {"review": {"required": True, "status": "READY", "verdict": "READY", "report": "docs/reports/reviewer.md", "execution_id": "assurance-reviewer"}, "verification": {"required": True, "status": "READY", "verdict": "READY", "report": "docs/reports/verifier.md", "execution_id": "assurance-verifier"}, "evaluation": {"required": False, "status": "SKIPPED", "verdict": "", "skip_reason": "not required"}, "drift": {"required": False, "status": "SKIPPED", "verdict": "", "skip_reason": "not required"}}, "subagent_topology": {"policy": "native-separate-context-required", "status": "READY", "capability": capability, "role_bindings": bindings}}


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


def denied_closeout_source_revision(value: dict, root: Path, role: str) -> None:
    """Prove closeout rejects the phase-aware binding revision, not the candidate."""
    expected = f"role binding {role}.source_revision does not match active Work Block"
    try:
        validate(value, phase="closeout", root=root, now=NOW)
    except TopologyError as exc:
        if str(exc) != expected:
            raise AssertionError(
                f"{role} source revision used the wrong closeout denial: {exc}"
            ) from exc
    else:
        raise AssertionError(f"{role} source revision: expected direct closeout denial")
    try:
        validate_closeout_state(value, "success-closeout", root)
    except ValueError as exc:
        expected_closeout = f"success-closeout requires valid native topology evidence: {expected}"
        if str(exc) != expected_closeout:
            raise AssertionError(
                f"{role} source revision used the wrong success-closeout denial: {exc}"
            ) from exc
    else:
        raise AssertionError(f"{role} source revision: expected success-closeout denial")


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
    contract_documents(Path(__file__).resolve().parents[1])
    for timestamp, expected in (
        ("2026-09-09T21:30:00Z", NOW),
        ("2026-09-09T21:30:00+00:00", NOW),
        ("2026-09-09T21:30:00.123456Z", NOW.replace(microsecond=123456)),
        ("2026-09-09T21:30:00.123456+00:00", NOW.replace(microsecond=123456)),
    ):
        if _utc(timestamp, "timestamp") != expected:
            raise AssertionError(f"canonical UTC timestamp was not preserved: {timestamp}")
    for timestamp in (
        "2026-09-09 21:30:00Z",
        "20260909T213000Z",
        "2026-09-09T21:30:00,123Z",
        "2026-09-09T21:30:00",
        "2026-09-09T22:30:00+01:00",
        "2026-09-09T20:30:00-01:00",
        "2026-09-09T21:30:00-00:00",
    ):
        try:
            _utc(timestamp, "timestamp")
        except TopologyError:
            pass
        else:
            raise AssertionError(f"non-canonical RFC3339 UTC timestamp was accepted: {timestamp}")
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
        runtime_mismatch = copy.deepcopy(valid); runtime_mismatch["subagent_topology"]["role_bindings"][0]["runtime"] = "other"; cases.append((runtime_mismatch, "admission", "capability runtime tuple mismatch"))
        adapter_mismatch = copy.deepcopy(valid); adapter_mismatch["subagent_topology"]["role_bindings"][0]["adapter"] = "other"; cases.append((adapter_mismatch, "admission", "capability adapter tuple mismatch"))
        adapter_version_mismatch = copy.deepcopy(valid); adapter_version_mismatch["subagent_topology"]["role_bindings"][0]["adapter_version"] = "other"; cases.append((adapter_version_mismatch, "admission", "capability adapter-version tuple mismatch"))
        for reference, label in (("", "empty role dispatch reference"), ("dispatch:assurance-critic", "non-native role dispatch reference"), ("native_dispatch:", "malformed role dispatch reference"), ("native_dispatch:assurance-critic,native_dispatch:other", "multi-value role dispatch reference")):
            invalid_reference = copy.deepcopy(valid); invalid_reference["subagent_topology"]["role_bindings"][0]["probe_event_ref"] = reference; cases.append((invalid_reference, "admission", label))
        for ledger, label in (("", "empty aggregate probe ledger"), ("probe-critic", "non-native aggregate probe ledger"), ("native_dispatch:", "malformed aggregate probe ledger"), ("native_dispatch:probe-critic,native_dispatch:probe-critic", "duplicate aggregate probe ledger"), ("native_dispatch:probe-critic", "one-entry aggregate probe ledger"), ("native_dispatch:probe-critic,native_dispatch:probe-reviewer", "two-entry aggregate probe ledger"), ("native_dispatch:probe-critic,native_dispatch:probe-reviewer,native_dispatch:probe-verifier,native_dispatch:probe-extra", "surplus aggregate probe ledger")):
            invalid_ledger = copy.deepcopy(valid); invalid_ledger["subagent_topology"]["capability"]["probe_event_ref"] = ledger; cases.append((invalid_ledger, "admission", label))
        probe_reused = copy.deepcopy(valid); probe_reused["subagent_topology"]["role_bindings"][0]["execution_id"] = "probe-critic"; probe_reused["subagent_topology"]["role_bindings"][0]["context_id"] = "probe-critic"; probe_reused["subagent_topology"]["role_bindings"][0]["probe_event_ref"] = "native_dispatch:probe-critic"; cases.append((probe_reused, "admission", "aggregate probe reused as assurance execution"))
        reused = copy.deepcopy(valid); reused["subagent_topology"]["role_bindings"][1]["execution_id"] = "assurance-critic"; reused["subagent_topology"]["role_bindings"][1]["context_id"] = "assurance-critic"; reused["subagent_topology"]["role_bindings"][1]["probe_event_ref"] = "native_dispatch:assurance-critic"; cases.append((reused, "closeout", "reused execution"))
        context_reused = copy.deepcopy(valid); context_reused["subagent_topology"]["role_bindings"][1]["execution_id"] = "execution-reviewer-new"; context_reused["subagent_topology"]["role_bindings"][1]["context_id"] = "assurance-critic"; context_reused["subagent_topology"]["role_bindings"][1]["probe_event_ref"] = "native_dispatch:execution-reviewer-new"; context_reused["subagent_topology"]["role_bindings"][1]["context_id_source"] = "platform_context_id"; cases.append((context_reused, "closeout", "reused context with distinct execution"))
        duplicate = copy.deepcopy(valid); duplicate["subagent_topology"]["role_bindings"][1]["role"] = "critic"; cases.append((duplicate, "closeout", "duplicate role"))
        overclaim = copy.deepcopy(valid); overclaim["subagent_topology"]["role_bindings"][0]["launch_mechanism"] = "same-session"; cases.append((overclaim, "admission", "same-session overclaim"))
        critic_denied = copy.deepcopy(valid); critic_denied["critic"]["status"] = "DEGRADED"; cases.append((critic_denied, "admission", "Critic admission denial"))
        critic_report_mismatch = copy.deepcopy(valid); critic_report_mismatch["critic"]["report"] = "docs/reports/other-critic.md"; cases.append((critic_report_mismatch, "admission", "Critic report mismatch at admission"))
        root_mismatch = copy.deepcopy(valid); root_mismatch["subagent_topology"]["capability"]["repository_root"] = str(root.parent / "other"); cases.append((root_mismatch, "admission", "root mismatch"))
        stale = copy.deepcopy(valid); stale["subagent_topology"]["role_bindings"][0]["work_block_id"] = "WB-stale"; cases.append((stale, "admission", "stale Work Block"))
        stale_capability = copy.deepcopy(valid); stale_capability["subagent_topology"]["capability"]["verified_at"] = (NOW - dt.timedelta(hours=25)).isoformat(); cases.append((stale_capability, "admission", "stale capability timestamp"))
        stale_binding = copy.deepcopy(valid); stale_binding["subagent_topology"]["role_bindings"][0]["observed_at"] = (NOW - dt.timedelta(hours=25)).isoformat(); cases.append((stale_binding, "admission", "stale binding timestamp"))
        branch_mismatch = copy.deepcopy(valid); branch_mismatch["subagent_topology"]["role_bindings"][0]["branch"] = "feat/other"; cases.append((branch_mismatch, "admission", "branch mismatch"))
        frozen = copy.deepcopy(valid); frozen["frozen_revision"] = "frozen"
        for binding in frozen["subagent_topology"]["role_bindings"][1:]:
            binding["source_revision"] = "frozen"
        reviewer_source_revision = copy.deepcopy(valid)
        reviewer_source_revision["subagent_topology"]["role_bindings"][1]["source_revision"] = "wrong-frozen-revision"
        denied_closeout_source_revision(reviewer_source_revision, root, "reviewer")
        verifier_source_revision = copy.deepcopy(valid)
        verifier_source_revision["subagent_topology"]["role_bindings"][2]["source_revision"] = "wrong-frozen-revision"
        denied_closeout_source_revision(verifier_source_revision, root, "verifier")
        missing_report = copy.deepcopy(valid); missing_report["subagent_topology"]["role_bindings"][0]["report"] = ""; cases.append((missing_report, "admission", "missing report linkage"))
        traversal = copy.deepcopy(valid); traversal["subagent_topology"]["role_bindings"][0]["report"] = "docs/reports/../escape.md"; cases.append((traversal, "admission", "report traversal"))
        absolute = copy.deepcopy(valid); absolute["subagent_topology"]["role_bindings"][0]["report"] = "/tmp/escape.md"; cases.append((absolute, "admission", "absolute report"))
        outside = root / "outside-report.md"
        outside.write_text("outside\n", encoding="utf-8")
        symlink = root / "docs/reports/symlink.md"
        symlink.symlink_to(outside)
        symlink_escape = copy.deepcopy(valid); symlink_escape["subagent_topology"]["role_bindings"][0]["report"] = "docs/reports/symlink.md"; cases.append((symlink_escape, "admission", "report symlink escape"))
        reviewer_report_mismatch = copy.deepcopy(valid); reviewer_report_mismatch["assurance"]["review"]["report"] = "docs/reports/other-reviewer.md"; cases.append((reviewer_report_mismatch, "closeout", "Reviewer report mismatch at closeout"))
        verifier_report_mismatch = copy.deepcopy(valid); verifier_report_mismatch["assurance"]["verification"]["report"] = "docs/reports/other-verifier.md"; cases.append((verifier_report_mismatch, "closeout", "Verifier report mismatch at closeout"))
        for value, phase, label in cases:
            denied(value, root, phase, label)
        denied_closeout(frozen, root, "mismatched frozen revision")
        assurance_report = copy.deepcopy(valid); assurance_report["assurance"]["review"]["report"] = "docs/reports/wrong.md"; denied_closeout(assurance_report, root, "review report mismatch")
        assurance_execution = copy.deepcopy(valid); assurance_execution["assurance"]["verification"]["execution_id"] = "execution-other"; denied_closeout(assurance_execution, root, "verification execution mismatch")
    print("subagent topology matrix: OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
