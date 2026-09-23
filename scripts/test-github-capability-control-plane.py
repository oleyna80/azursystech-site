#!/usr/bin/env python3
"""Executable contract tests for AzurSysTech schema-v3 GitHub capability authority."""
from __future__ import annotations

import copy
import datetime as dt
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / ".codex" / "scripts"))
from lifecycle import candidate_content_identity

ROOT = Path(__file__).resolve().parents[1]
HARD_STOP = ROOT / ".agent/hooks/hard_stop_policy.py"
CODEX_GATE = ROOT / ".codex/hooks/pre_tool_use_policy.py"
CLAUDE_GATE = ROOT / ".claude/hooks/work_block_gate.py"
CLAUDE_ASSURANCE = ROOT / ".claude/hooks/assurance_gate.py"
LIFECYCLE = ROOT / ".codex/scripts/lifecycle.py"
EVAL_VALIDATOR = ROOT / "scripts/validate-evaluation.py"
DEFAULT_GATE = ROOT / ".agent/active-work-block.default.json"


def run(command: list[str], cwd: Path, *, input_text: str | None = None) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        command,
        cwd=cwd,
        input=input_text,
        text=True,
        capture_output=True,
        check=False,
        timeout=10,
    )


def git(cwd: Path, *args: str) -> str:
    result = run(["git", *args], cwd)
    if result.returncode != 0:
        raise AssertionError(result.stderr or result.stdout)
    return result.stdout.strip()


def event(tool_name: str, cwd: Path, tool_input: dict[str, object]) -> str:
    return json.dumps(
        {"tool_name": tool_name, "cwd": str(cwd), "tool_input": tool_input}
    )


def hook(script: Path, cwd: Path, tool_name: str, tool_input: dict[str, object]) -> subprocess.CompletedProcess[str]:
    return run(
        [sys.executable, str(script)],
        cwd,
        input_text=event(tool_name, cwd, tool_input),
    )


def denied(result: subprocess.CompletedProcess[str]) -> bool:
    text = (result.stdout + result.stderr).lower()
    return "\"permissiondecision\": \"deny\"" in text or '"continue": false' in text or '"decision": "block"' in text


def assert_allow(result: subprocess.CompletedProcess[str], label: str) -> None:
    if result.returncode != 0 or denied(result):
        raise AssertionError(f"{label}: expected ALLOW\nstdout={result.stdout}\nstderr={result.stderr}")


def assert_deny(result: subprocess.CompletedProcess[str], label: str) -> None:
    if result.returncode != 0 or not denied(result):
        raise AssertionError(f"{label}: expected DENY\nstdout={result.stdout}\nstderr={result.stderr}")


def assert_diagnostic(
    result: subprocess.CompletedProcess[str],
    cwd: Path,
    *,
    branch: str,
    work_block_id: str,
) -> None:
    text = result.stdout + result.stderr
    required = [
        f"root={cwd.resolve()}",
        f"branch={branch}",
        "HEAD=",
        f"work_block_id={work_block_id}",
        "command-local cd does not rebind it",
        "Start a new agent session from the intended worktree",
    ]
    missing = [value for value in required if value not in text]
    if missing:
        raise AssertionError(
            f"diagnostic context missing {missing}\nstdout={result.stdout}\nstderr={result.stderr}"
        )


def ready_gate(base: dict[str, object], cwd: Path) -> dict[str, object]:
    value = copy.deepcopy(base)
    value["work_block_id"] = "WB-TEST-GITHUB-CAPABILITY"
    value["governance_profile"] = "Assured"
    value["specification"] = {
        "path": "docs/specs/WB-TEST-GITHUB-CAPABILITY.md",
        "revision": "test-spec-v1",
    }
    value["subject_branch"] = git(cwd, "branch", "--show-current")
    value["base_commit"] = git(cwd, "rev-parse", "HEAD")
    value["write_gate"] = {"status": "READY", "opened_at": "2026-08-12T00:00:00+00:00"}
    value["non_trivial"] = True
    value["critic"] = {
        "required": True,
        "status": "READY",
        "verdict": "APPROVE",
        "report": "docs/reports/critic.md",
        "isolation": "same-session-degraded",
        "skip_reason": "",
    }
    value["assurance"] = {
        "review": {
            "required": True,
            "status": "READY",
            "verdict": "READY",
            "report": "docs/reports/review.md",
            "isolation": "independent-readonly-root",
            "skip_reason": "",
        },
        "verification": {
            "required": True,
            "status": "READY",
            "verdict": "READY",
            "report": "docs/reports/verification.md",
            "isolation": "independent-readonly-root",
            "skip_reason": "",
        },
        "evaluation": value["assurance"]["evaluation"],
        "drift": value["assurance"]["drift"],
    }
    value["write_set"] = ["src/**", "tests/**"]
    value["define_quality"] = {
        "required": True,
        "status": "READY",
        "requirements_review": "docs/reports/requirements.md",
        "traceability": "docs/reports/traceability.md",
        "consistency_analysis": "docs/reports/consistency.md",
    }
    observed_at = dt.datetime.now(dt.timezone.utc).isoformat()
    capability = {
        "runtime": "codex",
        "adapter": "fixture_adapter",
        "adapter_version": "fixture-v1",
        "status": "available",
        "repository_root": str(cwd.resolve()),
        "probe_event_ref": (
            "native_dispatch:fixture-probe-critic,"
            "native_dispatch:fixture-probe-reviewer,"
            "native_dispatch:fixture-probe-verifier"
        ),
        "verified_at": observed_at,
    }
    role_reports = {
        "critic": value["critic"]["report"],
        "reviewer": value["assurance"]["review"]["report"],
        "verifier": value["assurance"]["verification"]["report"],
    }
    role_bindings = []
    for role in ("critic", "reviewer", "verifier"):
        execution_id = f"fixture-{role}-execution"
        role_bindings.append(
            {
                "role": role,
                "work_block_id": value["work_block_id"],
                "execution_id": execution_id,
                "context_id": execution_id,
                "context_id_source": "execution_id",
                "runtime": capability["runtime"],
                "adapter": capability["adapter"],
                "adapter_version": capability["adapter_version"],
                "source_revision": value["base_commit"],
                "repository_root": str(cwd.resolve()),
                "branch": value["subject_branch"],
                "readonly_boundary": "read-only",
                "launch_mechanism": "native",
                "topology_tier": "native-separate-context",
                "probe_event_ref": f"native_dispatch:{execution_id}",
                "report": role_reports[role],
                "status": "READY",
                "observed_at": observed_at,
            }
        )
    value["subagent_topology"] = {
        "policy": "native-separate-context-required",
        "status": "READY",
        "capability": capability,
        "role_bindings": role_bindings,
    }
    return value


def assurance_report(gate: dict[str, object], role: str, revision: str, execution: str, context: str, verdict: str) -> str:
    prefix = "review" if role == "review" else "verification"
    artifact = "reviewer_report" if role == "review" else "verifier_report"
    spec = gate["specification"]
    return (
        f"---\nartifact_type: {artifact}\nwork_block_id: {gate['work_block_id']}\n"
        f"specification: {spec['path']}\nrevision: {spec['revision']}\n"
        f"frozen_candidate: {revision}\nstatus: {verdict}\nverdict: {verdict}\n"
        f"execution_id: {execution}\ncontext_id: {context}\n---\n\n"
        f"{prefix}_result: execution_id={execution} candidate={revision} verdict={verdict}\n"
    )


def critic_report(gate: dict[str, object]) -> str:
    critic = gate["critic"]
    spec = gate["specification"]
    reason = f"skip_reason: {critic['skip_reason']}\n" if critic["status"] == "SKIPPED" else ""
    return (
        f"---\nartifact_type: critic_disposition\nwork_block_id: {gate['work_block_id']}\n"
        f"specification: {spec['path']}\nrevision: {spec['revision']}\n"
        f"frozen_candidate: {gate['frozen_revision']}\nstatus: {critic['status']}\n"
        f"verdict: {critic['verdict']}\n{reason}---\n\nCritic disposition.\n"
    )


def frozen_publication_gate(base: dict[str, object], cwd: Path) -> dict[str, object]:
    value = ready_gate(base, cwd)
    value["governance_profile"] = "Controlled"
    value["non_trivial"] = False
    value["subagent_topology"] = None
    value["define_quality"]["required"] = False
    value["write_set"] = ["README.md"]
    value["write_gate"] = {"status": "BLOCKED", "opened_at": None}
    revision = candidate_content_identity(cwd, value["write_set"])
    value["frozen_revision"] = revision
    (cwd / "docs/reports/critic.md").write_text(critic_report(value), encoding="utf-8")
    for role, report, execution, context in (
        ("review", "docs/reports/review.md", "fixture-review-exec", "fixture-review-context"),
        ("verification", "docs/reports/verification.md", "fixture-verifier-exec", "fixture-verifier-context"),
    ):
        record = value["assurance"][role]
        record.update({
            "work_block_id": value["work_block_id"],
            "candidate_revision": revision,
            "execution_id": execution,
            "context_id": context,
            "report": report,
            "isolation": "separate_context",
        })
        (cwd / report).write_text(assurance_report(value, role, revision, execution, context, "READY"), encoding="utf-8")
    git(cwd, "add", "docs/reports/critic.md", "docs/reports/review.md", "docs/reports/verification.md")
    git(cwd, "commit", "-q", "-m", "fixture assurance reports")
    return value


def write_gate(cwd: Path, value: dict[str, object]) -> None:
    path = cwd / ".agent/active-work-block.json"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2) + "\n", encoding="utf-8")


TERMINAL_FIXTURE_ID = "WB-TEST-GITHUB-CAPABILITY"
TERMINAL_FIXTURE_SPEC = f"docs/specs/{TERMINAL_FIXTURE_ID}.md"
TERMINAL_FIXTURE_PLAN = f"docs/plans/{TERMINAL_FIXTURE_ID}.md"
TERMINAL_FIXTURE_TASKLIST = f"docs/tasklist/{TERMINAL_FIXTURE_ID}.tasklist.md"
TERMINAL_FIXTURE_REVISION = "test-spec-v1"


def terminal_fixture_spec() -> str:
    return f"""---
artifact_type: specification
work_block_id: {TERMINAL_FIXTURE_ID}
revision: {TERMINAL_FIXTURE_REVISION}
status: approved
---

# Terminal fixture specification
"""


def terminal_fixture_plan(status: str) -> str:
    terminal = status == "completed"
    stage = "completed" if terminal else "in_progress"
    review = "READY" if terminal else "PENDING"
    verification = "READY" if terminal else "PENDING"
    drift = "ALIGNED" if terminal else "PENDING"
    closeout = "success-closeout" if terminal else "pending"
    task_status = "completed" if terminal else "active"
    return f"""---
artifact_type: work_block
work_block_id: {TERMINAL_FIXTURE_ID}
specification: {TERMINAL_FIXTURE_SPEC}
revision: {TERMINAL_FIXTURE_REVISION}
status: {status}
process_feedback_required: true
---

# Terminal fixture plan

## Final State

- **Stage State:** {stage}
- **Review Gate:** {review}
- **Verification Verdict:** {verification}
- **Evaluation Verdict:** SKIPPED — fixture
- **Drift Gate:** {drift}
- **Closeout Mode:** {closeout}
- **Task Status:** {task_status}
"""


def terminal_fixture_tasklist(status: str, *, checked: bool = True) -> str:
    mark = "x" if checked else " "
    return f"""---
artifact_type: tasklist
work_block_id: {TERMINAL_FIXTURE_ID}
specification: {TERMINAL_FIXTURE_SPEC}
revision: {TERMINAL_FIXTURE_REVISION}
status: {status}
---

# Terminal fixture task list

- [{mark}] TASK-001 [req=REQ-001] terminal projection invariant
"""


def write_terminal_projection(cwd: Path, *, plan_status: str, tasklist_status: str, checked: bool = True) -> None:
    for path in (TERMINAL_FIXTURE_SPEC, TERMINAL_FIXTURE_PLAN, TERMINAL_FIXTURE_TASKLIST):
        (cwd / path).parent.mkdir(parents=True, exist_ok=True)
    (cwd / TERMINAL_FIXTURE_SPEC).write_text(terminal_fixture_spec(), encoding="utf-8")
    (cwd / TERMINAL_FIXTURE_PLAN).write_text(terminal_fixture_plan(plan_status), encoding="utf-8")
    (cwd / TERMINAL_FIXTURE_TASKLIST).write_text(
        terminal_fixture_tasklist(tasklist_status, checked=checked), encoding="utf-8"
    )


def write_terminal_projection_maps(cwd: Path, *, active: bool) -> None:
    plan = TERMINAL_FIXTURE_PLAN if active else "null"
    completed = "" if active else f"  - {TERMINAL_FIXTURE_PLAN}\n"
    (cwd / "FILE_REGISTRY.yml").write_text(
        f"""migration_state:
  completed_work_blocks:
{completed}  active_work_block: {plan}
""", encoding="utf-8"
    )
    (cwd / "PROJECT_MAP.md").write_text(
        f"""# Fixture project map

<!-- release-state
completed_work_blocks:
{completed}active_work_block: {plan}
-->

```yaml
active_work_block: {plan}
```
""", encoding="utf-8"
    )


def make_repo() -> tuple[tempfile.TemporaryDirectory[str], Path, dict[str, object]]:
    holder = tempfile.TemporaryDirectory(prefix="azursystech-capability-test-")
    cwd = Path(holder.name)
    git(cwd, "init", "-q")
    git(cwd, "config", "user.email", "fixture@example.invalid")
    git(cwd, "config", "user.name", "Fixture")
    (cwd / "README.md").write_text("fixture\n", encoding="utf-8")
    git(cwd, "add", "README.md")
    git(cwd, "commit", "-q", "-m", "fixture base")
    git(cwd, "branch", "-M", "main")
    git(cwd, "switch", "-q", "-c", "feature/capability-test")
    (cwd / ".agent").mkdir(parents=True, exist_ok=True)
    (cwd / "scripts").mkdir()
    (cwd / "scripts/subagent_topology.py").write_text(
        git(ROOT, "show", "HEAD:scripts/subagent_topology.py") + "\n",
        encoding="utf-8",
    )
    reports = cwd / "docs/reports"
    reports.mkdir(parents=True)
    for report in ("critic.md", "review.md", "verification.md"):
        (reports / report).write_text("fixture report\n", encoding="utf-8")
    shutil.copy2(DEFAULT_GATE, cwd / ".agent/active-work-block.default.json")
    base = json.loads(DEFAULT_GATE.read_text(encoding="utf-8"))
    write_gate(cwd, base)
    return holder, cwd, base


def make_terminal_repo(
    *,
    parent_mutator: object = None,
    malformed_parent: bool = False,
    source_mutation: bool = False,
    extra_terminal_path: str = "",
    terminal_mutator: object = None,
) -> tuple[tempfile.TemporaryDirectory[str], Path, str]:
    holder, cwd, base = make_repo()
    parent = ready_gate(base, cwd)
    write_terminal_projection(cwd, plan_status="in_progress", tasklist_status="active")
    write_terminal_projection_maps(cwd, active=True)
    if callable(parent_mutator):
        parent_mutator(parent)
    if malformed_parent:
        (cwd / ".agent/active-work-block.json").write_text("not-json\n", encoding="utf-8")
    else:
        write_gate(cwd, parent)
    git(cwd, "add", "-A")
    git(cwd, "commit", "-q", "-m", "admit assured terminal fixture\n\nWork-Block: WB-TEST-GITHUB-CAPABILITY")

    inactive = copy.deepcopy(base)
    inactive.update(
        {
            "work_block_id": "",
            "specification": {"path": "", "revision": ""},
            "subject_branch": "",
            "base_commit": "",
            "write_set": [],
            "write_gate": {"status": "BLOCKED", "opened_at": None},
            "closeout_mode": "success-closeout",
            "lifecycle_note": "fixture terminal closeout",
        }
    )
    write_gate(cwd, inactive)
    write_terminal_projection(cwd, plan_status="completed", tasklist_status="completed")
    write_terminal_projection_maps(cwd, active=False)
    git(cwd, "add", ".agent/active-work-block.json", TERMINAL_FIXTURE_SPEC, TERMINAL_FIXTURE_PLAN, TERMINAL_FIXTURE_TASKLIST, "FILE_REGISTRY.yml", "PROJECT_MAP.md")
    paths = [".agent/active-work-block.json"]
    if source_mutation:
        (cwd / "src").mkdir()
        (cwd / "src/terminal.py").write_text("source mutation\n", encoding="utf-8")
        git(cwd, "add", "src/terminal.py")
        paths.append("src/terminal.py")
    if extra_terminal_path:
        extra = cwd / extra_terminal_path
        extra.parent.mkdir(parents=True, exist_ok=True)
        extra.write_text("unexpected\n", encoding="utf-8")
        git(cwd, "add", extra_terminal_path)
        paths.append(extra_terminal_path)
    if callable(terminal_mutator):
        terminal_mutator(cwd)
    git(cwd, "add", "-A")
    git(cwd, "commit", "-q", "-m", "close terminal fixture\n\nWork-Block: WB-TEST-GITHUB-CAPABILITY")
    return holder, cwd, "git push origin HEAD:refs/heads/feature/capability-test"


def terminal_extra(path: str) -> object:
    def mutate(cwd: Path) -> None:
        target = cwd / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text("unexpected terminal artifact\n", encoding="utf-8")
    return mutate


def terminal_replace(path: str, old: str, new: str) -> object:
    def mutate(cwd: Path) -> None:
        target = cwd / path
        content = target.read_text(encoding="utf-8")
        if old not in content:
            raise AssertionError(f"fixture replacement not found in {path}: {old!r}")
        target.write_text(content.replace(old, new, 1), encoding="utf-8")
    return mutate


def terminal_append(path: str, text: str) -> object:
    def mutate(cwd: Path) -> None:
        target = cwd / path
        target.write_text(target.read_text(encoding="utf-8") + text, encoding="utf-8")
    return mutate


def terminal_gate_update(updater: object) -> object:
    def mutate(cwd: Path) -> None:
        path = cwd / ".agent/active-work-block.json"
        gate = json.loads(path.read_text(encoding="utf-8"))
        updater(gate)
        write_gate(cwd, gate)
    return mutate


def test_terminal_closeout_publication() -> None:
    exact = "git push origin HEAD:refs/heads/feature/capability-test"
    cases = []
    cases.append((make_terminal_repo(), True, "exact bound plan and tasklist terminal closeout"))
    cases.append((make_terminal_repo(parent_mutator=lambda gate: gate.update(subject_branch="feature/other")), False, "wrong parent subject branch"))
    cases.append((make_terminal_repo(parent_mutator=lambda gate: gate["assurance"]["review"].update(status="PENDING", verdict="PENDING")), False, "parent without READY assurance"))
    cases.append((make_terminal_repo(malformed_parent=True), False, "malformed parent active state"))
    cases.append((make_terminal_repo(source_mutation=True), False, "source mutation in terminal commit"))
    cases.append((make_terminal_repo(extra_terminal_path="docs/notes.txt"), False, "unlisted terminal path"))
    cases.append((make_terminal_repo(terminal_mutator=terminal_extra("docs/plans/other.md")), False, "unrelated plan"))
    cases.append((make_terminal_repo(terminal_mutator=terminal_extra("docs/tasklist/other.tasklist.md")), False, "unrelated tasklist"))
    cases.append((make_terminal_repo(terminal_mutator=terminal_extra("docs/plans/second.md")), False, "extra second plan"))
    cases.append((make_terminal_repo(terminal_mutator=terminal_extra("docs/tasklist/second.tasklist.md")), False, "extra second tasklist"))
    cases.append((make_terminal_repo(terminal_mutator=terminal_extra("docs/plans/test.md")), False, "arbitrary plan path"))
    cases.append((make_terminal_repo(terminal_mutator=terminal_extra("docs/tasklist/test.md")), False, "arbitrary tasklist path"))
    cases.append((make_terminal_repo(terminal_mutator=terminal_replace(TERMINAL_FIXTURE_PLAN, "status: completed", "status: in_progress")), False, "bound plan not completed"))
    cases.append((make_terminal_repo(terminal_mutator=terminal_replace(TERMINAL_FIXTURE_TASKLIST, "status: completed", "status: active")), False, "tasklist still active"))
    cases.append((make_terminal_repo(terminal_mutator=terminal_replace(TERMINAL_FIXTURE_TASKLIST, "- [x] TASK-001", "- [ ] TASK-001")), False, "unchecked required task"))
    cases.append((make_terminal_repo(terminal_mutator=terminal_replace(TERMINAL_FIXTURE_PLAN, f"work_block_id: {TERMINAL_FIXTURE_ID}", "work_block_id: WB-OTHER")), False, "mismatched plan work block id"))
    cases.append((make_terminal_repo(terminal_mutator=terminal_replace(TERMINAL_FIXTURE_TASKLIST, f"work_block_id: {TERMINAL_FIXTURE_ID}", "work_block_id: WB-OTHER")), False, "mismatched tasklist work block id"))
    cases.append((make_terminal_repo(terminal_mutator=terminal_replace(TERMINAL_FIXTURE_PLAN, f"specification: {TERMINAL_FIXTURE_SPEC}", "specification: docs/specs/WB-OTHER.md")), False, "mismatched plan specification"))
    cases.append((make_terminal_repo(terminal_mutator=terminal_replace(TERMINAL_FIXTURE_TASKLIST, f"specification: {TERMINAL_FIXTURE_SPEC}", "specification: docs/specs/WB-OTHER.md")), False, "mismatched tasklist specification"))
    cases.append((make_terminal_repo(terminal_mutator=terminal_replace(TERMINAL_FIXTURE_PLAN, f"revision: {TERMINAL_FIXTURE_REVISION}", "revision: test-spec-v2")), False, "mismatched plan revision"))
    cases.append((make_terminal_repo(terminal_mutator=terminal_replace(TERMINAL_FIXTURE_TASKLIST, f"revision: {TERMINAL_FIXTURE_REVISION}", "revision: test-spec-v2")), False, "mismatched tasklist revision"))
    cases.append((make_terminal_repo(terminal_mutator=terminal_replace("FILE_REGISTRY.yml", "active_work_block: null", "active_work_block: docs/plans/other.md")), False, "child registry remains active"))
    cases.append((make_terminal_repo(terminal_mutator=terminal_replace("PROJECT_MAP.md", "active_work_block: null", "active_work_block: docs/plans/other.md")), False, "child project map remains active"))
    cases.append((make_terminal_repo(terminal_mutator=terminal_append(TERMINAL_FIXTURE_PLAN, "\n- **Review Gate:** BLOCKED\n")), False, "duplicate contradictory final marker"))
    cases.append((make_terminal_repo(terminal_mutator=terminal_append(TERMINAL_FIXTURE_PLAN, "\n## Final State\n\n- **Review Gate:** BLOCKED\n")), False, "duplicate contradictory final state"))
    cases.append((make_terminal_repo(terminal_mutator=terminal_gate_update(lambda gate: gate.update(non_trivial=True))), False, "terminal gate retained non-trivial state"))
    cases.append((make_terminal_repo(terminal_mutator=terminal_gate_update(lambda gate: gate["assurance"]["review"].update(status="READY", verdict="READY"))), False, "terminal gate retained assurance state"))
    cases.append((make_terminal_repo(terminal_mutator=terminal_gate_update(lambda gate: gate.update(subagent_topology={}))), False, "terminal gate retained topology state"))
    cases.append((make_terminal_repo(terminal_mutator=terminal_gate_update(lambda gate: gate["coordination_write_set"].append("docs/plans/**"))), False, "terminal gate widened coordination state"))
    cases.append((make_terminal_repo(terminal_mutator=terminal_gate_update(lambda gate: gate.update(unexpected="value"))), False, "terminal gate retained unknown state"))
    cases.append((make_terminal_repo(terminal_mutator=terminal_append(TERMINAL_FIXTURE_TASKLIST, "\n- [ ] unclassified terminal task\n")), False, "unchecked malformed task item"))
    cases.append((make_terminal_repo(terminal_mutator=terminal_append(TERMINAL_FIXTURE_TASKLIST, "\n- [x] not-a-task terminal item\n")), False, "malformed task identifier"))
    cases.append((make_terminal_repo(parent_mutator=lambda gate: gate.update(write_gate="READY")), False, "typed malformed parent write gate"))
    cases.append((make_terminal_repo(parent_mutator=lambda gate: gate.update(work_block_id="../escape")), False, "unsafe parent work block id"))
    for fixture, expected, label in cases:
        holder, cwd, _fixture_exact = fixture
        try:
            result = hook(HARD_STOP, cwd, "Bash", {"command": exact})
            if expected:
                assert_allow(result, label)
            else:
                assert_deny(result, label)
        finally:
            holder.cleanup()

    holder, cwd, _exact = make_terminal_repo()
    try:
        for command, label in (
            ("git push origin HEAD:refs/heads/feature/capability-test HEAD:refs/heads/second", "terminal multiple refspecs"),
            ("git push -f origin HEAD:refs/heads/feature/capability-test", "terminal force push"),
            ("git push origin --delete feature/capability-test", "terminal delete push"),
            (f"{exact}; echo chained", "terminal chained push"),
            ("env -S 'git push origin HEAD:refs/heads/feature/capability-test'", "terminal wrapper push"),
            ("echo $(git push origin HEAD:refs/heads/feature/capability-test)", "terminal substitution push"),
        ):
            assert_deny(hook(HARD_STOP, cwd, "Bash", {"command": command}), label)
        (cwd / "README.md").write_text("post-terminal\n", encoding="utf-8")
        git(cwd, "add", "README.md")
        git(cwd, "commit", "-q", "-m", "arbitrary post-terminal commit\n\nWork-Block: WB-TEST-GITHUB-CAPABILITY")
        assert_deny(hook(HARD_STOP, cwd, "Bash", {"command": exact}), "second commit after terminal closeout")
    finally:
        holder.cleanup()

    holder, cwd, _exact = make_terminal_repo(
        terminal_mutator=terminal_gate_update(lambda gate: gate.update(non_trivial=True))
    )
    try:
        default_template = cwd / ".agent/active-work-block.default.json"
        default_template.write_text(
            default_template.read_text(encoding="utf-8").replace(
                '"non_trivial": false', '"non_trivial": true', 1
            ),
            encoding="utf-8",
        )
        assert_deny(
            hook(HARD_STOP, cwd, "Bash", {"command": exact}),
            "dirty working-tree template cannot redefine canonical inactive",
        )
    finally:
        holder.cleanup()


def make_parallel_worktrees() -> tuple[
    tempfile.TemporaryDirectory[str], Path, Path, dict[str, object], dict[str, object]
]:
    holder = tempfile.TemporaryDirectory(prefix="azursystech-worktree-binding-test-")
    primary = Path(holder.name) / "primary"
    secondary = Path(holder.name) / "secondary"
    primary.mkdir()
    git(primary, "init", "-q")
    git(primary, "config", "user.email", "fixture@example.invalid")
    git(primary, "config", "user.name", "Fixture")
    (primary / "README.md").write_text("fixture\n", encoding="utf-8")
    git(primary, "add", "README.md")
    git(primary, "commit", "-q", "-m", "fixture base")
    git(primary, "branch", "-M", "main")
    git(primary, "branch", "feature/worktree-one")
    git(primary, "branch", "feature/worktree-two")
    git(primary, "switch", "-q", "feature/worktree-one")
    git(primary, "worktree", "add", "-q", str(secondary), "feature/worktree-two")

    committed_topology = git(ROOT, "show", "HEAD:scripts/subagent_topology.py") + "\n"
    for cwd in (primary, secondary):
        (cwd / "scripts").mkdir()
        (cwd / "scripts/subagent_topology.py").write_text(committed_topology, encoding="utf-8")
        reports = cwd / "docs/reports"
        reports.mkdir(parents=True)
        for report in ("critic.md", "review.md", "verification.md"):
            (reports / report).write_text("fixture report\n", encoding="utf-8")

    base = json.loads(DEFAULT_GATE.read_text(encoding="utf-8"))
    gate_one = ready_gate(base, primary)
    gate_one["work_block_id"] = "WB-TEST-WORKTREE-ONE"
    gate_two = ready_gate(base, secondary)
    gate_two["work_block_id"] = "WB-TEST-WORKTREE-TWO"
    for gate in (gate_one, gate_two):
        for binding in gate["subagent_topology"]["role_bindings"]:
            binding["work_block_id"] = gate["work_block_id"]
    write_gate(primary, gate_one)
    write_gate(secondary, gate_two)
    for cwd in (primary, secondary):
        (cwd / "src").mkdir()
        (cwd / "src/a.txt").write_text("a\n", encoding="utf-8")
    return holder, primary, secondary, gate_one, gate_two


def lifecycle_open(cwd: Path) -> subprocess.CompletedProcess[str]:
    gate = ready_gate(json.loads(DEFAULT_GATE.read_text(encoding="utf-8")), cwd)
    topology = gate["subagent_topology"]
    return run(
        [
            sys.executable,
            str(LIFECYCLE),
            "--root",
            str(cwd),
            "open",
            "--work-block-id",
            "WB-TEST-GITHUB-CAPABILITY",
            "--governance-profile",
            "Assured",
            "--specification-path",
            "docs/plans/test.md",
            "--specification-revision",
            "test-spec-v1",
            "--write",
            "src/**",
            "--non-trivial",
            "--topology-evidence",
            json.dumps(topology),
            "--critic-status",
            "READY",
            "--critic-verdict",
            "APPROVE",
            "--critic-report",
            "docs/reports/critic.md",
            "--critic-isolation",
            "native-separate-context",
            "--define-quality-status",
            "READY",
            "--requirements-review",
            "docs/reports/requirements.md",
            "--traceability",
            "docs/reports/traceability.md",
            "--consistency-analysis",
            "docs/reports/consistency.md",
        ],
        cwd,
    )


def test_default_schema() -> None:
    gate = json.loads(DEFAULT_GATE.read_text(encoding="utf-8"))
    assert gate["schema_version"] == 3
    assert gate["authority_mode"] == "github_capability"
    assert gate["subject_branch"] == ""
    assert "authorization" not in gate
    assert "hard_stop_approvals" not in gate
    assert gate["write_gate"] == {"status": "BLOCKED", "opened_at": None}
    assert "protected_default_branch_mutation" in gate["external_hard_stops"]


def test_lifecycle() -> None:
    holder, cwd, _base = make_repo()
    try:
        result = lifecycle_open(cwd)
        if result.returncode != 0:
            raise AssertionError(f"lifecycle open failed: {result.stdout} {result.stderr}")
        opened = json.loads((cwd / ".agent/active-work-block.json").read_text())
        assert opened["schema_version"] == 3
        assert opened["authority_mode"] == "github_capability"
        assert opened["subject_branch"] == "feature/capability-test"
        assert opened["write_gate"]["status"] == "READY"
        assert opened["non_trivial"] is True
        assert opened["subagent_topology"]["status"] == "READY"
        assert "authorization" not in opened
        assert "hard_stop_approvals" not in opened

        (cwd / "src").mkdir()
        (cwd / "src/fixture.py").write_text("fixture source\n", encoding="utf-8")

        result = run(
            [
                sys.executable,
                str(LIFECYCLE),
                "--root",
                str(cwd),
                "freeze",
                "--reason",
                "fixture freeze",
            ],
            cwd,
        )
        if result.returncode != 0:
            raise AssertionError(f"lifecycle freeze failed: {result.stdout} {result.stderr}")
        frozen = json.loads((cwd / ".agent/active-work-block.json").read_text())
        assert frozen["write_gate"] == {"status": "BLOCKED", "opened_at": None}
    finally:
        holder.cleanup()


def test_lifecycle_managed_define_quality() -> None:
    holder, cwd, _base = make_repo()
    try:
        missing = run(
            [
                sys.executable, str(LIFECYCLE), "--root", str(cwd), "open",
                "--work-block-id", "WB-TEST-MANAGED",
                "--governance-profile", "Managed",
                "--specification-path", "docs/plans/test.md",
                "--specification-revision", "test-spec-v1",
                "--write", "src/**", "--critic-status", "READY",
                "--critic-verdict", "APPROVE",
            ],
            cwd,
        )
        if missing.returncode != 2 or "define-quality-status READY" not in (missing.stdout + missing.stderr):
            raise AssertionError(f"Managed open without Define quality should fail: {missing.stdout} {missing.stderr}")
        ready = run(
            [
                sys.executable, str(LIFECYCLE), "--root", str(cwd), "open",
                "--work-block-id", "WB-TEST-MANAGED",
                "--governance-profile", "Managed",
                "--specification-path", "docs/plans/test.md",
                "--specification-revision", "test-spec-v1",
                "--write", "src/**", "--critic-status", "READY",
                "--critic-verdict", "APPROVE", "--define-quality-status", "READY",
                "--requirements-review", "docs/reports/requirements.md",
                "--traceability", "docs/tasklist/test.md",
                "--consistency-analysis", "docs/reports/consistency.md",
            ],
            cwd,
        )
        if ready.returncode != 0:
            raise AssertionError(f"Managed open with Define quality failed: {ready.stdout} {ready.stderr}")
        gate = json.loads((cwd / ".agent/active-work-block.json").read_text())
        assert gate["define_quality"]["status"] == "READY"
        assert gate["define_quality"]["required"] is True
    finally:
        holder.cleanup()


def test_reporting_only_closeout_inactive_coordination_scope() -> None:
    holder, cwd, _base = make_repo()
    try:
        result = lifecycle_open(cwd)
        if result.returncode != 0:
            raise AssertionError(f"lifecycle open failed: {result.stdout} {result.stderr}")
        active_path = cwd / ".agent/active-work-block.json"
        active = json.loads(active_path.read_text(encoding="utf-8"))
        active["assurance"] = {
            "review": {"required": True, "status": "BLOCKED", "verdict": "BLOCKED", "report": "", "isolation": "unknown", "skip_reason": ""},
            "verification": {"required": True, "status": "BLOCKED", "verdict": "BLOCKED", "report": "", "isolation": "unknown", "skip_reason": ""},
            "evaluation": {"required": False, "status": "SKIPPED", "verdict": "PENDING", "plan": "", "report": "", "rubric_revision": "", "benchmark_revision": "", "isolation": "unknown", "skip_reason": "not required for fixture"},
            "drift": {"required": False, "status": "SKIPPED", "verdict": "PENDING", "report": "", "isolation": "unknown", "skip_reason": "not required for fixture"},
        }
        write_gate(cwd, active)
        result = run(
            [sys.executable, str(LIFECYCLE), "--root", str(cwd), "close", "--mode", "reporting-only", "--reason", "fixture reporting-only closeout"],
            cwd,
        )
        if result.returncode != 0:
            raise AssertionError(f"lifecycle close failed: {result.stdout} {result.stderr}")
        inactive = json.loads(active_path.read_text(encoding="utf-8"))
        assert inactive["work_block_id"] == ""
        assert inactive["specification"] == {"path": "", "revision": ""}
        assert inactive["subject_branch"] == ""
        assert inactive["base_commit"] == ""
        assert inactive["write_set"] == []
        assert inactive["write_gate"] == {"status": "BLOCKED", "opened_at": None}
        assert inactive["closeout_mode"] == "reporting-only"
        assert inactive["coordination_write_set"] == _base["coordination_write_set"]
        assert inactive["coordination_write_set"] == [
            ".agent/active-work-block.json",
            ".agent/critic-gate.md",
            ".agent/verification-gate.md",
            ".codex/write-gate.md",
            "FILE_REGISTRY.yml",
            "PROJECT_MAP.md",
            "docs/plans/**",
            "docs/specs/**",
            "docs/tasklist/**",
            "docs/reports/**",
            "docs/architecture/drafts/**",
            "memory_bank/**",
        ]

        (cwd / "docs/plans").mkdir(parents=True)
        (cwd / "docs/plans/closeout.md").write_text("closeout\n", encoding="utf-8")
        (cwd / "FILE_REGISTRY.yml").write_text("release_state: {}\n", encoding="utf-8")
        (cwd / "PROJECT_MAP.md").write_text("# Project map\n", encoding="utf-8")
        (cwd / "src").mkdir()
        (cwd / "src/a.txt").write_text("source\n", encoding="utf-8")
        git(cwd, "add", "src/a.txt")
        git(cwd, "commit", "-q", "-m", "track fixture source")
        (cwd / "src/a.txt").write_text("changed source\n", encoding="utf-8")
        (cwd / "pathspecs.txt").write_text("src/a.txt\n", encoding="utf-8")
        assert_allow(
            hook(
                CODEX_GATE,
                cwd,
                "apply_patch",
                {"command": "*** Begin Patch\n*** Update File: FILE_REGISTRY.yml\n*** Update File: PROJECT_MAP.md\n*** Update File: docs/plans/closeout.md\n*** End Patch"},
            ),
            "Codex inactive complete coordination write",
        )
        for path in ("FILE_REGISTRY.yml", "PROJECT_MAP.md", "docs/plans/closeout.md"):
            assert_allow(
                hook(CLAUDE_GATE, cwd, "Edit", {"file_path": str(cwd / path)}),
                f"Claude inactive coordination write {path}",
            )
        for gate, edit_tool, source_input, label in (
            (CODEX_GATE, "apply_patch", {"command": "*** Begin Patch\n*** Update File: src/a.txt\n*** End Patch"}, "Codex"),
            (CLAUDE_GATE, "Edit", {"file_path": str(cwd / "src/a.txt")}, "Claude"),
        ):
            assert_deny(hook(gate, cwd, edit_tool, source_input), f"{label} inactive source write")

        git(cwd, "add", "FILE_REGISTRY.yml", "PROJECT_MAP.md", "docs/plans/closeout.md")
        assert_allow(hook(CODEX_GATE, cwd, "Bash", {"command": "git commit -m closeout"}), "Codex inactive coordination commit")
        assert_allow(hook(CLAUDE_GATE, cwd, "Bash", {"command": "git commit -m closeout"}), "Claude inactive coordination commit")
        unsafe_commits = (
            "git commit -a -m closeout",
            "git commit --all -m closeout",
            "git commit -i src/a.txt -m closeout",
            "git commit --include src/a.txt -m closeout",
            "git commit -o src/a.txt -m closeout",
            "git commit --only src/a.txt -m closeout",
            "git commit -m closeout -- src/a.txt",
            "git commit -m closeout --pathspec-from-file=pathspecs.txt",
            "git -C . commit -a -m closeout",
            "git -c color.ui=false commit -m closeout -- src/a.txt",
            "git --exec-path=/usr/lib/git-core commit -a -m closeout",
            "git --no-advice commit -a -m closeout",
            "command git commit -a -m closeout",
            "command -p git commit -a -m closeout",
            "env GIT_EDITOR=: git commit -a -m closeout",
            "env -C . git commit -a -m closeout",
        "env -u GIT_EDITOR git commit -a -m closeout",
        "env --ignore-signal git commit -a -m closeout",
        "env --ignore-signal HUP git commit -a -m closeout",
        "env -S 'git commit -a -m closeout'",
        "env -S'git commit -a -m closeout'",
        "env -S'env -u GIT_EDITOR git commit -a -m closeout'",
        "env --split-string='git commit -a -m closeout'",
        "/usr/bin/git commit -a -m closeout",
        )
        for command in unsafe_commits:
            assert_deny(hook(CODEX_GATE, cwd, "Bash", {"command": command}), f"Codex inactive selector {command}")
            assert_deny(hook(CLAUDE_GATE, cwd, "Bash", {"command": command}), f"Claude inactive selector {command}")
        git(cwd, "reset", "-q")
        git(cwd, "add", "src/a.txt")
        assert_deny(hook(CODEX_GATE, cwd, "Bash", {"command": "git commit -m source"}), "Codex inactive source commit")
        assert_deny(hook(CLAUDE_GATE, cwd, "Bash", {"command": "git commit -m source"}), "Claude inactive source commit")
    finally:
        holder.cleanup()


def test_reporting_only_pending_recovery() -> None:
    holder, cwd, template = make_repo()
    try:
        opened = lifecycle_open(cwd)
        if opened.returncode != 0:
            raise AssertionError(f"lifecycle open failed: {opened.stdout} {opened.stderr}")
        active_path = cwd / ".agent/active-work-block.json"
        before = json.loads(active_path.read_text(encoding="utf-8"))
        assert all(role["status"] == "PENDING" for role in before["assurance"].values())

        command = [sys.executable, str(LIFECYCLE), "--root", str(cwd), "close"]
        missing_reason = run(command + ["--mode", "reporting-only", "--reason", "   "], cwd)
        assert missing_reason.returncode == 2
        assert "non-empty --reason" in missing_reason.stdout
        assert json.loads(active_path.read_text(encoding="utf-8")) == before

        success = run(command + ["--mode", "success-closeout", "--reason", "premature"], cwd)
        assert success.returncode == 2
        assert "assurance.review is still PENDING" in success.stdout
        assert json.loads(active_path.read_text(encoding="utf-8")) == before

        reason = "assurance remains pending; recovery required"
        recovery = run(command + ["--mode", "reporting-only", "--reason", reason], cwd)
        if recovery.returncode != 0:
            raise AssertionError(f"reporting-only recovery failed: {recovery.stdout} {recovery.stderr}")
        inactive = json.loads(active_path.read_text(encoding="utf-8"))
        assert inactive["closeout_mode"] == "reporting-only"
        assert inactive["lifecycle_note"] == reason
        assert inactive["write_gate"] == {"status": "BLOCKED", "opened_at": None}
        assert all(role["status"] == "PENDING" for role in inactive["assurance"].values())
        assert all(role["verdict"] == "PENDING" for role in inactive["assurance"].values())
        for field in ("closeout_mode", "lifecycle_note"):
            inactive.pop(field, None)
            template.pop(field, None)
        assert inactive == template
    finally:
        holder.cleanup()


def test_lifecycle_rejects_default_and_detached() -> None:
    holder, cwd, _base = make_repo()
    try:
        git(cwd, "switch", "-q", "main")
        result = lifecycle_open(cwd)
        if result.returncode != 2 or "default branch" not in (result.stdout + result.stderr):
            raise AssertionError(
                f"lifecycle default-branch open should be BLOCKED\nstdout={result.stdout}\nstderr={result.stderr}"
            )

        git(cwd, "switch", "-q", "feature/capability-test")
        git(cwd, "switch", "-q", "--detach")
        result = lifecycle_open(cwd)
        if result.returncode != 2 or "detached" not in (result.stdout + result.stderr):
            raise AssertionError(
                f"lifecycle detached-HEAD open should be BLOCKED\nstdout={result.stdout}\nstderr={result.stderr}"
            )
    finally:
        holder.cleanup()


def test_hard_stops() -> None:
    holder, cwd, base = make_repo()
    try:
        write_gate(cwd, ready_gate(base, cwd))
        assert_allow(hook(HARD_STOP, cwd, "Bash", {"command": "git commit -m fixture"}), "normal local commit")
        publication = frozen_publication_gate(base, cwd)
        write_gate(cwd, publication)
        exact = "git push origin HEAD:refs/heads/feature/capability-test"
        assert_allow(hook(HARD_STOP, cwd, "Bash", {"command": exact}), "assured exact subject candidate publication")
        supplementary_critic = copy.deepcopy(publication)
        supplementary_critic["critic"]["verdict"] = "SUPPLEMENT"
        (cwd / "docs/reports/critic.md").write_text(critic_report(supplementary_critic), encoding="utf-8")
        git(cwd, "add", "docs/reports/critic.md")
        git(cwd, "commit", "-q", "-m", "fixture Critic supplement")
        write_gate(cwd, supplementary_critic)
        assert_allow(hook(HARD_STOP, cwd, "Bash", {"command": exact}), "accepted Critic supplement")
        attached_gate = copy.deepcopy(publication)
        write_gate(cwd, attached_gate)
        git(cwd, "switch", "-q", "--detach")
        assert_deny(hook(HARD_STOP, cwd, "Bash", {"command": exact}), "detached HEAD")
        git(cwd, "switch", "-q", "feature/capability-test")
        write_gate(cwd, attached_gate)
        assert_allow(hook(HARD_STOP, cwd, "Bash", {"command": "rg 'git push' README.md"}), "quoted publication prose is not a command")
        assert_allow(hook(HARD_STOP, cwd, "Bash", {"command": "printf %s '$(git push origin HEAD:refs/heads/feature/capability-test)'"}), "single-quoted substitution prose is not a command")
        for command, label in (
            ("git push", "bare push"),
            ("git push origin feature/capability-test", "implicit source ref"),
            ("git push origin HEAD:refs/heads/other", "wrong destination branch"),
            ("/usr/bin/git push origin HEAD:refs/heads/main", "absolute Git default-branch push"),
            ("/usr/bin/git push origin HEAD:refs/heads/feature/capability-test", "absolute Git subject push is not literal allowance"),
            ("echo $(git push origin HEAD:refs/heads/feature/capability-test)", "command-substitution Git push"),
            ('echo "$(git push origin HEAD:refs/heads/feature/capability-test)"', "double-quoted command-substitution Git push"),
            ('echo $(g""it push origin HEAD:refs/heads/feature/capability-test)', "quoted-word Git command-substitution push"),
            ("echo $(g$'it' push origin HEAD:refs/heads/feature/capability-test)", "ANSI-C-quoted Git command-substitution push"),
            ("echo `git push origin HEAD:refs/heads/main`", "backtick Git default-branch push"),
            ("echo <(git push origin HEAD:refs/heads/feature/capability-test)", "process-substitution Git push"),
            ("cat >(g\\it push origin HEAD:refs/heads/main)", "escaped Git process-substitution default-branch push"),
            ("printf %s $(date)", "unquoted command substitution is fail-closed"),
            ("git push upstream HEAD:refs/heads/feature/capability-test", "wrong remote"),
            ("git push https://example.invalid/repo HEAD:refs/heads/feature/capability-test", "URL remote"),
            ("git push origin HEAD:refs/heads/feature/capability-test HEAD:refs/heads/second", "multiple refspecs"),
            ("git push --atomic origin HEAD:refs/heads/feature/capability-test", "atomic push"),
            ("env GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=remote.origin.pushurl GIT_CONFIG_VALUE_0=https://example.invalid git push origin HEAD:refs/heads/feature/capability-test", "environment-overridden origin push"),
            ("git -c remote.origin.pushurl=https://example.invalid push origin HEAD:refs/heads/feature/capability-test", "Git global-option origin push"),
            (f"{exact}; ssh prod.example systemctl restart app", "exact push chained with ssh"),
            (f"{exact} && gh pr merge 12 --squash", "exact push chained with merge"),
            (f"{exact}; kubectl apply -f deployment.yml", "exact push chained with deploy"),
            (f"{exact} && gh api repos/o/r/actions/workflows/x/dispatches --method POST", "exact push chained with GitHub API mutation"),
        ):
            assert_deny(hook(HARD_STOP, cwd, "Bash", {"command": command}), label)
        pending_review = copy.deepcopy(publication)
        pending_review["assurance"]["review"]["status"] = "PENDING"
        pending_review["assurance"]["review"]["verdict"] = "PENDING"
        write_gate(cwd, pending_review)
        assert_deny(hook(HARD_STOP, cwd, "Bash", {"command": exact}), "review pending")
        pending_verification = copy.deepcopy(publication)
        pending_verification["assurance"]["verification"]["status"] = "PENDING"
        pending_verification["assurance"]["verification"]["verdict"] = "PENDING"
        write_gate(cwd, pending_verification)
        assert_deny(hook(HARD_STOP, cwd, "Bash", {"command": exact}), "verification pending")
        pending_critic = copy.deepcopy(publication)
        pending_critic["critic"]["status"] = "PENDING"
        pending_critic["critic"]["verdict"] = "PENDING"
        write_gate(cwd, pending_critic)
        assert_deny(hook(HARD_STOP, cwd, "Bash", {"command": exact}), "critic pending")
        wrong_subject = copy.deepcopy(publication)
        wrong_subject["subject_branch"] = "feature/other"
        write_gate(cwd, wrong_subject)
        assert_deny(hook(HARD_STOP, cwd, "Bash", {"command": exact}), "subject binding mismatch")
        missing_subject = copy.deepcopy(publication)
        missing_subject["subject_branch"] = ""
        write_gate(cwd, missing_subject)
        assert_deny(hook(HARD_STOP, cwd, "Bash", {"command": exact}), "empty subject branch")
        write_gate(cwd, publication)
        assert_deny(hook(HARD_STOP, cwd, "Bash", {"command": "git push origin HEAD:main"}), "default branch push")
        git(cwd, "update-ref", "refs/remotes/origin/trunk", "HEAD")
        git(cwd, "symbolic-ref", "refs/remotes/origin/HEAD", "refs/remotes/origin/trunk")
        assert_deny(hook(HARD_STOP, cwd, "Bash", {"command": "git push origin HEAD:refs/heads/trunk"}), "configured default branch push")
        assert_deny(hook(HARD_STOP, cwd, "Bash", {"command": "git push -f origin HEAD:refs/heads/feature/capability-test"}), "short force push")
        assert_deny(hook(HARD_STOP, cwd, "Bash", {"command": "git push --force origin HEAD:refs/heads/feature/capability-test"}), "force push")
        assert_deny(hook(HARD_STOP, cwd, "Bash", {"command": "git push --force-with-lease origin HEAD:refs/heads/feature/capability-test"}), "force-with-lease push")
        assert_deny(hook(HARD_STOP, cwd, "Bash", {"command": "git push --force-with-lease=refs/heads/feature/capability-test origin HEAD:refs/heads/feature/capability-test"}), "force-with-lease value push")
        assert_deny(hook(HARD_STOP, cwd, "Bash", {"command": "git push origin +HEAD:refs/heads/feature/capability-test"}), "leading plus refspec push")
        assert_deny(hook(HARD_STOP, cwd, "Bash", {"command": "git push origin --delete old-branch"}), "remote branch deletion")
        assert_deny(hook(HARD_STOP, cwd, "Bash", {"command": "git push origin --mirror"}), "mirror push")
        assert_deny(hook(HARD_STOP, cwd, "Bash", {"command": "git push origin --all"}), "all-branches push")
        assert_deny(hook(HARD_STOP, cwd, "Bash", {"command": "git push origin --prune"}), "prune push")
        assert_deny(hook(HARD_STOP, cwd, "Bash", {"command": "git push --tags origin"}), "tag publication")
        assert_deny(hook(HARD_STOP, cwd, "Bash", {"command": "docker push ghcr.io/example/app:tag"}), "image publication")
        assert_deny(hook(HARD_STOP, cwd, "Bash", {"command": "ssh prod.example systemctl restart app"}), "live ssh")
        assert_deny(hook(HARD_STOP, cwd, "Bash", {"command": "rm -rf build"}), "recursive rm")
    finally:
        holder.cleanup()


def test_frozen_publication_evidence() -> None:
    holder, cwd, base = make_repo()
    try:
        publication = frozen_publication_gate(base, cwd)
        exact = "git push origin HEAD:refs/heads/feature/capability-test"

        def check(mutator: object, label: str) -> None:
            gate = copy.deepcopy(publication)
            mutator(gate)
            write_gate(cwd, gate)
            assert_deny(hook(HARD_STOP, cwd, "Bash", {"command": exact}), label)

        write_gate(cwd, publication)
        assert_allow(hook(HARD_STOP, cwd, "Bash", {"command": exact}), "baseline frozen publication")
        check(lambda g: g["assurance"]["review"].update(status="PENDING", verdict="PENDING"), "Reviewer PENDING")
        check(lambda g: g["assurance"]["verification"].update(status="PENDING", verdict="PENDING"), "Verifier PENDING")
        check(lambda g: g["assurance"]["review"].update(candidate_revision="content-sha256:" + "0" * 64), "Reviewer candidate A")
        check(lambda g: g["assurance"]["verification"].update(candidate_revision="content-sha256:" + "0" * 64), "Verifier candidate A")
        check(lambda g: g["assurance"]["review"].update(context_id="fixture-verifier-context"), "shared assurance context")
        check(lambda g: g["assurance"]["review"].update(report="docs/reports/missing.md"), "missing Reviewer report")
        check(lambda g: g["critic"].update(report=""), "missing Critic report")
        check(lambda g: g["critic"].update(report="docs/reports/review.md"), "wrong Critic report")
        check(lambda g: g["specification"].update(revision="wrong-revision"), "wrong specification revision")
        check(lambda g: g["critic"].update(status="SKIPPED", verdict="SKIPPED", skip_reason=""), "unreasoned Critic skip")
        check(lambda g: g["critic"].update(status="DEGRADED", verdict="FALLBACK"), "degraded Critic")
        check(lambda g: g["critic"].update(status="READY", verdict="FALLBACK"), "fallback Critic")
        check(lambda g: g["write_gate"].update(status="READY"), "unfrozen write gate")

        write_gate(cwd, publication)
        review_path = cwd / "docs/reports/review.md"
        original_review = review_path.read_text(encoding="utf-8")
        review_path.write_text(original_review.replace("revision: test-spec-v1", "revision: stale-spec"), encoding="utf-8")
        assert_deny(hook(HARD_STOP, cwd, "Bash", {"command": exact}), "uncommitted Reviewer report")
        git(cwd, "add", "docs/reports/review.md")
        git(cwd, "commit", "-q", "-m", "fixture stale Reviewer report")
        assert_deny(hook(HARD_STOP, cwd, "Bash", {"command": exact}), "stale Reviewer report metadata")
        review_path.write_text(original_review, encoding="utf-8")
        git(cwd, "add", "docs/reports/review.md")
        git(cwd, "commit", "-q", "-m", "fixture restored Reviewer report")

        critic_path = cwd / "docs/reports/critic.md"
        original_critic = critic_path.read_text(encoding="utf-8")
        critic_path.write_text(original_critic.replace(f"frozen_candidate: {publication['frozen_revision']}", "frozen_candidate: content-sha256:" + "0" * 64), encoding="utf-8")
        git(cwd, "add", "docs/reports/critic.md")
        git(cwd, "commit", "-q", "-m", "fixture stale Critic report")
        assert_deny(hook(HARD_STOP, cwd, "Bash", {"command": exact}), "stale Critic report metadata")
        critic_path.write_text(original_critic, encoding="utf-8")
        git(cwd, "add", "docs/reports/critic.md")
        git(cwd, "commit", "-q", "-m", "fixture restored Critic report")

        skipped = copy.deepcopy(publication)
        skipped["critic"].update(status="SKIPPED", verdict="SKIPPED", skip_reason="Owner-authorized bounded recovery")
        (cwd / "docs/reports/critic.md").write_text(critic_report(skipped), encoding="utf-8")
        write_gate(cwd, skipped)
        assert_deny(hook(HARD_STOP, cwd, "Bash", {"command": exact}), "uncommitted Critic skip")
        git(cwd, "add", "docs/reports/critic.md")
        git(cwd, "commit", "-q", "-m", "fixture Critic skip")
        write_gate(cwd, skipped)
        assert_allow(hook(HARD_STOP, cwd, "Bash", {"command": exact}), "reasoned Critic skip")

        (cwd / "README.md").write_text("source changed after freeze\n", encoding="utf-8")
        write_gate(cwd, publication)
        assert_deny(hook(HARD_STOP, cwd, "Bash", {"command": exact}), "source changed after freeze")
    finally:
        holder.cleanup()


def test_controlled_assurance_rework() -> None:
    holder, cwd, base = make_repo()
    try:
        gate = ready_gate(base, cwd)
        gate["governance_profile"] = "Controlled"
        gate["non_trivial"] = False
        gate["subagent_topology"] = None
        gate["write_set"] = ["README.md"]
        for role in ("review", "verification"):
            gate["assurance"][role] = copy.deepcopy(base["assurance"][role])
            gate["assurance"][role]["required"] = True
        write_gate(cwd, gate)

        def transition(*args: str, allowed: bool = True) -> dict[str, object]:
            result = run([sys.executable, str(LIFECYCLE), "--root", str(cwd), *args], cwd)
            if (result.returncode == 0) != allowed:
                raise AssertionError(f"lifecycle {'expected success' if allowed else 'expected denial'}: {args}: {result.stdout} {result.stderr}")
            return json.loads((cwd / ".agent/active-work-block.json").read_text(encoding="utf-8"))

        frozen_a = transition("freeze", "--reason", "candidate A")
        assert frozen_a["assurance"]["review"]["status"] == "PENDING"
        transition("prepare-verifier", "--execution-id", "v-early", "--context-id", "v-early", "--context-id-source", "execution_id", "--report", "docs/reports/verification.md", allowed=False)
        transition("prepare-reviewer", "--execution-id", "r-a", "--context-id", "ctx-a", "--report", "docs/reports/review.md")
        (cwd / "docs/reports/review.md").write_text(
            assurance_report(frozen_a, "review", frozen_a["frozen_revision"], "r-a", "ctx-a", "CHANGES_REQUIRED"),
            encoding="utf-8",
        )
        rework = transition("finalize-reviewer", "--execution-id", "r-a", "--verdict", "CHANGES_REQUIRED")
        assert rework["write_gate"]["status"] == "READY" and "frozen_revision" not in rework
        assert rework["assurance"]["review"]["status"] == "PENDING"
        transition("finalize-reviewer", "--execution-id", "r-a", "--verdict", "READY", allowed=False)
        (cwd / "README.md").write_text("candidate B\n", encoding="utf-8")
        frozen_b = transition("freeze", "--reason", "candidate B")
        assert frozen_b["frozen_revision"] != frozen_a["frozen_revision"]
        transition("prepare-reviewer", "--execution-id", "r-b", "--context-id", "ctx-b", "--report", "docs/reports/review.md")
        (cwd / "docs/reports/review.md").write_text(
            assurance_report(frozen_b, "review", frozen_a["frozen_revision"], "r-b", "ctx-b", "READY"),
            encoding="utf-8",
        )
        transition("finalize-reviewer", "--execution-id", "r-b", "--verdict", "READY", allowed=False)
        (cwd / "docs/reports/review.md").write_text(
            assurance_report(frozen_b, "review", frozen_b["frozen_revision"], "r-b", "ctx-b", "READY"),
            encoding="utf-8",
        )
        reviewed = transition("finalize-reviewer", "--execution-id", "r-b", "--verdict", "READY")
        assert reviewed["assurance"]["review"]["status"] == "READY"
        transition("prepare-verifier", "--execution-id", "v-b", "--context-id", "ctx-v", "--context-id-source", "platform_context_id", "--report", "docs/reports/verification.md")
        (cwd / "docs/reports/verification.md").write_text(
            assurance_report(frozen_b, "verification", frozen_b["frozen_revision"], "v-b", "ctx-v", "BLOCKED"),
            encoding="utf-8",
        )
        blocked = transition("finalize-verifier", "--execution-id", "v-b", "--verdict", "BLOCKED")
        assert blocked["write_gate"]["status"] == "READY" and "frozen_revision" not in blocked
        assert blocked["assurance"]["review"]["status"] == "PENDING"
        transition("prepare-verifier", "--execution-id", "v-stale", "--context-id", "ctx-stale", "--context-id-source", "execution_id", "--report", "docs/reports/verification.md", allowed=False)
        frozen_c = transition("freeze", "--reason", "candidate C")
        assert frozen_c["assurance"]["verification"]["status"] == "PENDING"
    finally:
        holder.cleanup()


def test_codex_scope() -> None:
    holder, cwd, base = make_repo()
    try:
        gate = ready_gate(base, cwd)
        write_gate(cwd, gate)
        (cwd / "src").mkdir()
        (cwd / "tests").mkdir()
        (cwd / "src/a.txt").write_text("a\n")
        (cwd / "tests/a.txt").write_text("a\n")

        assert_allow(
            hook(
                CODEX_GATE,
                cwd,
                "apply_patch",
                {"command": "*** Begin Patch\n*** Update File: src/a.txt\n*** End Patch"},
            ),
            "apply_patch in write-set",
        )
        result = hook(
            CODEX_GATE,
            cwd,
            "apply_patch",
            {"command": "*** Begin Patch\n*** Update File: src/a.txt\n*** Move to: forbidden/a.txt\n*** End Patch"},
        )
        assert_deny(result, "apply_patch Move to outside write-set")
        assert_diagnostic(
            result,
            cwd,
            branch="feature/capability-test",
            work_block_id="WB-TEST-GITHUB-CAPABILITY",
        )
        assert_deny(
            hook(
                CODEX_GATE,
                cwd,
                "Bash",
                {"command": "touch src/a.txt && touch forbidden/b.txt"},
            ),
            "complex mutating Bash",
        )
        assert_allow(hook(CODEX_GATE, cwd, "Bash", {"command": "git status --short"}), "read-only Bash")
        assert_allow(hook(CODEX_GATE, cwd, "Bash", {"command": "chmod +x src/a.txt"}), "in-scope chmod target")
        assert_allow(hook(CLAUDE_GATE, cwd, "Bash", {"command": "chmod +x src/a.txt"}), "Claude in-scope chmod target")

        git(cwd, "add", "src/a.txt")
        assert_allow(hook(CODEX_GATE, cwd, "Bash", {"command": "git commit -m inside"}), "staged in-scope commit")
        git(cwd, "reset", "-q")
        (cwd / "forbidden.txt").write_text("no\n")
        git(cwd, "add", "forbidden.txt")
        assert_deny(hook(CODEX_GATE, cwd, "Bash", {"command": "git commit -m outside"}), "staged out-of-scope commit")
    finally:
        holder.cleanup()


def test_codex_coordination_commit_scope() -> None:
    holder, cwd, base = make_repo()
    try:
        gate = ready_gate(base, cwd)
        write_gate(cwd, gate)
        (cwd / ".agent/critic-gate.md").write_text("critic\n", encoding="utf-8")
        git(cwd, "add", ".agent/critic-gate.md")
        assert_allow(
            hook(CODEX_GATE, cwd, "Bash", {"command": "git commit -m coordination"}),
            "staged hidden coordination commit",
        )
    finally:
        holder.cleanup()


def test_binding_mismatch_coordination_and_repair() -> None:
    holder, cwd, base = make_repo()
    try:
        gate = ready_gate(base, cwd)
        gate["subject_branch"] = "feature/other-worktree"
        write_gate(cwd, gate)
        (cwd / "src").mkdir()
        (cwd / "src/a.txt").write_text("a\n", encoding="utf-8")

        codex_source = hook(
            CODEX_GATE,
            cwd,
            "apply_patch",
            {"command": "*** Begin Patch\n*** Update File: src/a.txt\n*** End Patch"},
        )
        assert_deny(codex_source, "Codex stale gate source write")
        assert_diagnostic(
            codex_source,
            cwd,
            branch="feature/capability-test",
            work_block_id="WB-TEST-GITHUB-CAPABILITY",
        )

        claude_source = hook(
            CLAUDE_GATE,
            cwd,
            "Edit",
            {"file_path": str(cwd / "src/a.txt")},
        )
        assert_deny(claude_source, "Claude stale gate source write")
        assert_diagnostic(
            claude_source,
            cwd,
            branch="feature/capability-test",
            work_block_id="WB-TEST-GITHUB-CAPABILITY",
        )

        codex_coordination = hook(
            CODEX_GATE,
            cwd,
            "apply_patch",
            {"command": "*** Begin Patch\n*** Add File: docs/plans/test.md\n*** End Patch"},
        )
        assert_deny(codex_coordination, "Codex stale gate coordination write")
        claude_coordination = hook(
            CLAUDE_GATE,
            cwd,
            "Edit",
            {"file_path": str(cwd / ".agent/critic-gate.md")},
        )
        assert_deny(claude_coordination, "Claude stale gate coordination write")

        (cwd / ".agent/critic-gate.md").write_text("critic\n", encoding="utf-8")
        git(cwd, "add", ".agent/critic-gate.md")
        stale_codex_commit = hook(CODEX_GATE, cwd, "Bash", {"command": "git commit -m coordination"})
        assert_deny(stale_codex_commit, "Codex stale gate coordination commit")
        assert_diagnostic(
            stale_codex_commit,
            cwd,
            branch="feature/capability-test",
            work_block_id="WB-TEST-GITHUB-CAPABILITY",
        )
        stale_claude_commit = hook(CLAUDE_GATE, cwd, "Bash", {"command": "git commit -m coordination"})
        assert_deny(stale_claude_commit, "Claude stale gate coordination commit")
        git(cwd, "reset", "-q")

        assert_allow(
            hook(
                CODEX_GATE,
                cwd,
                "apply_patch",
                {"command": "*** Begin Patch\n*** Update File: .agent/active-work-block.json\n*** End Patch"},
            ),
            "Codex active gate repair",
        )
        assert_allow(
            hook(
                CLAUDE_GATE,
                cwd,
                "Edit",
                {"file_path": str(cwd / ".agent/active-work-block.json")},
            ),
            "Claude active gate repair",
        )

        missing = copy.deepcopy(gate)
        missing["subject_branch"] = ""
        write_gate(cwd, missing)
        assert_deny(
            hook(
                CODEX_GATE,
                cwd,
                "apply_patch",
                {"command": "*** Begin Patch\n*** Update File: src/a.txt\n*** End Patch"},
            ),
            "Codex missing subject_branch",
        )
        assert_deny(
            hook(CLAUDE_GATE, cwd, "Edit", {"file_path": str(cwd / "src/a.txt")}),
            "Claude missing subject_branch",
        )

        attached = ready_gate(base, cwd)
        write_gate(cwd, attached)
        git(cwd, "switch", "-q", "--detach")
        codex_detached = hook(
            CODEX_GATE,
            cwd,
            "apply_patch",
            {"command": "*** Begin Patch\n*** Update File: src/a.txt\n*** End Patch"},
        )
        assert_deny(codex_detached, "Codex detached HEAD")
        assert_diagnostic(
            codex_detached,
            cwd,
            branch="<detached>",
            work_block_id="WB-TEST-GITHUB-CAPABILITY",
        )
        claude_detached = hook(
            CLAUDE_GATE,
            cwd,
            "Edit",
            {"file_path": str(cwd / "src/a.txt")},
        )
        assert_deny(claude_detached, "Claude detached HEAD")
    finally:
        holder.cleanup()


def test_parallel_worktree_isolation() -> None:
    holder, primary, secondary, gate_one, _gate_two = make_parallel_worktrees()
    try:
        for cwd, work_block_id in (
            (primary, "WB-TEST-WORKTREE-ONE"),
            (secondary, "WB-TEST-WORKTREE-TWO"),
        ):
            assert_allow(
                hook(
                    CODEX_GATE,
                    cwd,
                    "apply_patch",
                    {"command": "*** Begin Patch\n*** Update File: src/a.txt\n*** End Patch"},
                ),
                f"Codex matching gate in {cwd.name}",
            )
            assert_allow(
                hook(CLAUDE_GATE, cwd, "Edit", {"file_path": str(cwd / "src/a.txt")}),
                f"Claude matching gate in {cwd.name}",
            )
            assert work_block_id in (cwd / ".agent/active-work-block.json").read_text()

        write_gate(secondary, gate_one)
        codex_stale = hook(
            CODEX_GATE,
            secondary,
            "apply_patch",
            {"command": "*** Begin Patch\n*** Update File: src/a.txt\n*** End Patch"},
        )
        assert_deny(codex_stale, "Codex cross-worktree stale gate")
        assert_diagnostic(
            codex_stale,
            secondary,
            branch="feature/worktree-two",
            work_block_id="WB-TEST-WORKTREE-ONE",
        )
        claude_stale = hook(
            CLAUDE_GATE,
            secondary,
            "Edit",
            {"file_path": str(secondary / "src/a.txt")},
        )
        assert_deny(claude_stale, "Claude cross-worktree stale gate")
        assert_diagnostic(
            claude_stale,
            secondary,
            branch="feature/worktree-two",
            work_block_id="WB-TEST-WORKTREE-ONE",
        )
    finally:
        holder.cleanup()


def test_claude_scope_and_closeout() -> None:
    holder, cwd, base = make_repo()
    try:
        gate = ready_gate(base, cwd)
        write_gate(cwd, gate)
        (cwd / "src").mkdir()
        (cwd / "src/a.txt").write_text("a\n")
        assert_allow(
            hook(CLAUDE_GATE, cwd, "Edit", {"file_path": str(cwd / "src/a.txt")}),
            "Claude in-scope Edit",
        )
        outside = hook(CLAUDE_GATE, cwd, "Edit", {"file_path": str(cwd / "forbidden.txt")})
        assert_deny(outside, "Claude out-of-scope Edit")
        assert_diagnostic(
            outside,
            cwd,
            branch="feature/capability-test",
            work_block_id="WB-TEST-GITHUB-CAPABILITY",
        )

        (cwd / "docs/reports").mkdir(parents=True, exist_ok=True)
        (cwd / "docs/reports/review.md").write_text("review\n")
        (cwd / "docs/reports/verification.md").write_text("verification\n")
        (cwd / "scripts").mkdir(exist_ok=True)
        shutil.copy2(EVAL_VALIDATOR, cwd / "scripts/validate-evaluation.py")

        gate["write_gate"] = {"status": "BLOCKED", "opened_at": None}
        gate["assurance"] = {
            "review": {
                "required": True,
                "status": "READY",
                "verdict": "READY",
                "report": "docs/reports/review.md",
                "isolation": "independent-readonly-root",
                "skip_reason": "",
            },
            "verification": {
                "required": True,
                "status": "READY",
                "verdict": "READY",
                "report": "docs/reports/verification.md",
                "isolation": "independent-readonly-root",
                "skip_reason": "",
            },
            "evaluation": {
                "required": False,
                "status": "SKIPPED",
                "verdict": "PENDING",
                "plan": "",
                "report": "",
                "rubric_revision": "",
                "benchmark_revision": "",
                "isolation": "unknown",
                "skip_reason": "deterministic control-plane migration",
            },
            "drift": {
                "required": False,
                "status": "SKIPPED",
                "verdict": "PENDING",
                "report": "",
                "isolation": "unknown",
                "skip_reason": "no separate drift gate required for fixture",
            },
        }
        gate["closeout_mode"] = "success-closeout"
        write_gate(cwd, gate)
        result = run([sys.executable, str(CLAUDE_ASSURANCE)], cwd, input_text=json.dumps({"cwd": str(cwd)}))
        assert_allow(result, "Claude assurance closeout")

        broken = copy.deepcopy(gate)
        broken["assurance"]["verification"]["status"] = "PENDING"
        broken["assurance"]["verification"]["verdict"] = "PENDING"
        write_gate(cwd, broken)
        result = run([sys.executable, str(CLAUDE_ASSURANCE)], cwd, input_text=json.dumps({"cwd": str(cwd)}))
        assert_deny(result, "Claude unresolved verification blocks closeout")
    finally:
        holder.cleanup()


def test_candidate_diff_check() -> None:
    base_branch = os.environ.get("GITHUB_BASE_REF", "").strip()
    if base_branch:
        base_ref = f"refs/remotes/origin/{base_branch}"
        fetched = run(
            [
                "git",
                "fetch",
                "--no-tags",
                "--depth=1",
                "origin",
                f"{base_branch}:{base_ref}",
            ],
            ROOT,
        )
        if fetched.returncode != 0:
            raise AssertionError(
                f"cannot fetch PR base for git diff --check: {fetched.stderr or fetched.stdout}"
            )
    else:
        base_ref = ""
        for candidate in ("origin/main", "main", "origin/master", "master"):
            resolved = run(["git", "rev-parse", "--verify", candidate], ROOT)
            if resolved.returncode == 0:
                base_ref = candidate
                break
        if not base_ref:
            raise AssertionError("cannot resolve repository base for git diff --check")

    checked = run(["git", "diff", "--check", base_ref, "HEAD"], ROOT)
    if checked.returncode != 0:
        raise AssertionError(
            f"git diff --check failed for {base_ref}..HEAD:\n{checked.stdout}{checked.stderr}"
        )


def test_opencode_posture() -> None:
    config = json.loads((ROOT / "opencode.json").read_text(encoding="utf-8"))
    bash = config["permission"]["bash"]
    assert bash["git commit*"] == "allow"
    assert bash["git push origin HEAD:refs/heads/*"] == "allow"
    assert bash["git push*"] == "deny"
    assert bash["git reset --hard*"] == "deny"
    assert bash["git clean*"] == "deny"


TESTS = [
    test_default_schema,
    test_lifecycle,
    test_lifecycle_managed_define_quality,
    test_reporting_only_closeout_inactive_coordination_scope,
    test_reporting_only_pending_recovery,
    test_lifecycle_rejects_default_and_detached,
    test_hard_stops,
    test_frozen_publication_evidence,
    test_controlled_assurance_rework,
    test_terminal_closeout_publication,
    test_codex_scope,
    test_codex_coordination_commit_scope,
    test_binding_mismatch_coordination_and_repair,
    test_parallel_worktree_isolation,
    test_claude_scope_and_closeout,
    test_candidate_diff_check,
    test_opencode_posture,
]


def main() -> int:
    failures = 0
    for test in TESTS:
        try:
            test()
        except Exception as exc:  # fixture runner intentionally reports all failures
            failures += 1
            print(f"FAIL {test.__name__}: {exc}")
        else:
            print(f"PASS {test.__name__}")
    print(f"PASS={len(TESTS) - failures} FAIL={failures}")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
