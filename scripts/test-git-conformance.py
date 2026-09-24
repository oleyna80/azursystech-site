#!/usr/bin/env python3
"""Positive and negative published-object CI conformance fixtures."""
from __future__ import annotations

import copy
import importlib.util
import json
from pathlib import Path
import shutil
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
HELPERS = ROOT / "scripts/test-github-capability-control-plane.py"
VALIDATOR = ROOT / "scripts/validate-git-conformance.py"

spec = importlib.util.spec_from_file_location("capability_fixtures", HELPERS)
assert spec and spec.loader
helpers = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helpers)


def run(cwd: Path, *args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(list(args), cwd=cwd, text=True, capture_output=True, timeout=30)


def fixture(
    *, terminal: bool = False, source_mutator: object = None,
    child_mutator: object = None, source_message: str = "assured source\n\nWork-Block: WB-036",
    child_message: str = "terminal closeout\n\nWork-Block: WB-036",
) -> tuple[object, Path, str, str]:
    holder, cwd, base = helpers.make_repo()
    shutil.copy2(VALIDATOR, cwd / "scripts/validate-git-conformance.py")
    base_sha = helpers.git(cwd, "rev-parse", "HEAD")
    helpers.git(cwd, "update-ref", "refs/remotes/origin/main", base_sha)
    gate = helpers.ready_gate(base, cwd)
    gate["work_block_id"] = "WB-036"
    gate["governance_profile"] = "Controlled"
    gate["non_trivial"] = False
    gate["subagent_topology"] = None
    gate["define_quality"]["required"] = False
    gate["specification"] = {"path": "docs/specs/WB-036.md", "revision": helpers.TERMINAL_FIXTURE_REVISION}
    gate["write_set"] = ["README.md", ".agent/active-work-block.default.json"]
    gate["write_gate"] = {"status": "BLOCKED", "opened_at": None}
    (cwd / "README.md").write_text("assured fixture source\n", encoding="utf-8")
    gate["frozen_revision"] = helpers.candidate_content_identity(cwd, gate["write_set"])
    for name, execution, context in (
        ("review", "fixture-review-exec", "fixture-review-context"),
        ("verification", "fixture-verifier-exec", "fixture-verifier-context"),
    ):
        record = gate["assurance"][name]
        record.update({
            "work_block_id": "WB-036", "candidate_revision": gate["frozen_revision"],
            "execution_id": execution, "context_id": context,
            "isolation": "separate_context",
        })
        (cwd / record["report"]).write_text(
            helpers.assurance_report(gate, name, gate["frozen_revision"], execution, context, "READY"),
            encoding="utf-8",
        )
    (cwd / gate["critic"]["report"]).write_text(helpers.critic_report(gate), encoding="utf-8")
    helpers.write_gate(cwd, gate)
    helpers.write_terminal_projection(cwd, plan_status="in_progress", tasklist_status="active")
    helpers.write_terminal_projection_maps(cwd, active=True)
    if callable(source_mutator):
        source_mutator(cwd, gate)
    helpers.git(cwd, "add", "README.md", ".agent/active-work-block.json", ".agent/active-work-block.default.json", "docs/reports/critic.md", "docs/reports/review.md", "docs/reports/verification.md", "docs/specs/WB-036.md", "docs/plans/WB-036.md", "docs/tasklist/WB-036.tasklist.md", "FILE_REGISTRY.yml", "PROJECT_MAP.md")
    if (cwd / "bad.bin").exists():
        helpers.git(cwd, "add", "bad.bin")
    if (cwd / ".env.local").exists():
        helpers.git(cwd, "add", ".env.local")
    for name in (".env.production", ".env.vps.example"):
        if (cwd / "docs/reports" / name).exists():
            helpers.git(cwd, "add", "-f", f"docs/reports/{name}")
    helpers.git(cwd, "commit", "-q", "-m", source_message)
    if terminal:
        inactive = copy.deepcopy(base)
        inactive["closeout_mode"] = "success-closeout"
        inactive["lifecycle_note"] = "fixture terminal closeout"
        helpers.write_gate(cwd, inactive)
        helpers.write_terminal_projection(cwd, plan_status="completed", tasklist_status="completed")
        helpers.write_terminal_projection_maps(cwd, active=False)
        if callable(child_mutator):
            child_mutator(cwd)
        helpers.git(cwd, "add", ".agent/active-work-block.json", "docs/plans/WB-036.md", "docs/tasklist/WB-036.tasklist.md", "FILE_REGISTRY.yml", "PROJECT_MAP.md")
        if (cwd / "bad.bin").exists():
            helpers.git(cwd, "add", "bad.bin")
        helpers.git(cwd, "commit", "-q", "-m", child_message)
    return holder, cwd, helpers.git(cwd, "rev-parse", "HEAD"), base_sha


def check(cwd: Path, head: str, *, branch: str = "feature/capability-test", default: str = "main") -> subprocess.CompletedProcess[str]:
    return run(cwd, sys.executable, str(cwd / "scripts/validate-git-conformance.py"),
               "--branch", branch, "--head", head, "--default-branch", default)


def inactive_fixture(*, malformed: bool = False) -> tuple[object, Path, str]:
    holder, cwd, base = helpers.make_repo()
    shutil.copy2(VALIDATOR, cwd / "scripts/validate-git-conformance.py")
    helpers.git(cwd, "switch", "-q", "main")
    helpers.git(cwd, "add", ".agent/active-work-block.default.json")
    helpers.git(cwd, "commit", "-q", "-m", "fixture template")
    anchor = helpers.git(cwd, "rev-parse", "HEAD")
    helpers.git(cwd, "switch", "-q", "feature/capability-test")
    helpers.git(cwd, "merge", "--ff-only", "main")
    helpers.git(cwd, "update-ref", "refs/remotes/origin/main", anchor)
    if malformed:
        (cwd / ".agent/active-work-block.json").write_text("{bad json\n")
    else:
        helpers.write_gate(cwd, base)
    (cwd / "docs/plans/WB-036.md").parent.mkdir(parents=True, exist_ok=True)
    (cwd / "docs/plans/WB-036.md").write_text("coordination fixture\n")
    helpers.git(cwd, "add", ".agent/active-work-block.json", "docs/plans/WB-036.md")
    helpers.git(cwd, "commit", "-q", "-m", "fixture coordination")
    return holder, cwd, helpers.git(cwd, "rev-parse", "HEAD")


def expect(name: str, accepted: bool, **kwargs: object) -> None:
    holder, cwd, head, base = fixture(**kwargs)
    try:
        result = check(cwd, head)
        if (result.returncode == 0) != accepted:
            raise AssertionError(f"{name}: expected {'READY' if accepted else 'BLOCKED'}: {result.stdout}{result.stderr}")
    finally:
        holder.cleanup()


def mutate_gate(cwd: Path, field: str, value: object) -> None:
    path = cwd / ".agent/active-work-block.json"
    gate = json.loads(path.read_text())
    gate[field] = value
    helpers.write_gate(cwd, gate)


def main() -> int:
    cases = [
        ("active source", True, {}),
        ("terminal child", True, {"terminal": True}),
        ("wrong source trailer", False, {"source_message": "assured source\n\nWork-Block: WB-999"}),
        ("duplicate source trailer", False, {"source_message": "assured source\n\nWork-Block: WB-036\nWork-Block: WB-036"}),
        ("missing terminal trailer", False, {"terminal": True, "child_message": "terminal closeout"}),
        ("source scope", False, {"source_mutator": lambda cwd, gate: (cwd / "bad.bin").write_text("outside\n")}),
        ("forbidden source path", False, {"source_mutator": lambda cwd, gate: (cwd / ".env.local").write_text("secret fixture\n")}),
        ("forbidden coordination secret", False, {"source_mutator": lambda cwd, gate: (cwd / "docs/reports/.env.production").write_text("secret fixture\n")}),
        ("allowed coordination example", True, {"source_mutator": lambda cwd, gate: (cwd / "docs/reports/.env.vps.example").write_text("placeholder\n")}),
        ("malformed active state", False, {"source_mutator": lambda cwd, gate: (cwd / ".agent/active-work-block.json").write_text("{bad json\n")}),
        ("stale source identity", False, {"source_mutator": lambda cwd, gate: (cwd / "README.md").write_text("changed after freeze\n")}),
        ("stale assurance", False, {"source_mutator": lambda cwd, gate: mutate_gate(cwd, "assurance", base_assurance_bad(gate))}),
        ("missing verifier report", False, {"source_mutator": lambda cwd, gate: (cwd / "docs/reports/verification.md").write_text("invalid verifier report\n")}),
        ("missing Critic disposition", False, {"source_mutator": lambda cwd, gate: (cwd / "docs/reports/critic.md").write_text("invalid Critic report\n")}),
        ("wrong source branch", False, {"source_mutator": lambda cwd, gate: mutate_gate(cwd, "subject_branch", "feature/other")}),
        ("wrong trusted base", False, {"source_mutator": lambda cwd, gate: mutate_gate(cwd, "base_commit", "0" * 40)}),
        ("terminal source mutation", False, {"terminal": True, "child_mutator": lambda cwd: (cwd / "bad.bin").write_text("outside\n")}),
        ("noncanonical terminal", False, {"terminal": True, "child_mutator": lambda cwd: mutate_gate(cwd, "lifecycle_note", "")}),
    ]
    failures = 0
    for name, accepted, kwargs in cases:
        try:
            expect(name, accepted, **kwargs)
        except Exception as exc:
            failures += 1
            print(f"FAIL {name}: {exc}")
        else:
            print(f"PASS {name}")

    for name, malformed, accepted in (("canonical inactive coordination", False, True), ("malformed inactive coordination", True, False)):
        holder, cwd, head = inactive_fixture(malformed=malformed)
        try:
            result = check(cwd, head)
            if (result.returncode == 0) != accepted:
                failures += 1
                print(f"FAIL {name}: {result.stdout}{result.stderr}")
            else:
                print(f"PASS {name}")
        finally:
            holder.cleanup()

    holder, cwd, head, base = fixture()
    try:
        for name, args in (
            ("event head mismatch", {"head": base}),
            ("event branch mismatch", {"branch": "feature/other"}),
            ("default branch target", {"branch": "main"}),
            ("missing trusted base", {"default": "missing"}),
        ):
            result = check(cwd, args.get("head", head), branch=args.get("branch", "feature/capability-test"), default=args.get("default", "main"))
            if result.returncode == 0:
                failures += 1
                print(f"FAIL {name}: unexpectedly READY")
            else:
                print(f"PASS {name}")
    finally:
        holder.cleanup()

    workflow = (ROOT / ".github/workflows/control-plane-contracts.yml").read_text()
    trigger = workflow.split("permissions:", 1)[0]
    required = ('branches:\n      - "**"', "pull_request:", "fetch-depth: 0", "github.event.pull_request.head.sha || github.sha", "scripts/validate-git-conformance.py")
    if "paths:" in trigger or any(item not in workflow for item in required):
        failures += 1
        print("FAIL workflow trigger/head binding")
    else:
        print("PASS workflow trigger/head binding")
    print(f"PASS={len(cases) + 7 - failures} FAIL={failures}")
    return 1 if failures else 0


def base_assurance_bad(gate: dict) -> dict:
    assurance = copy.deepcopy(gate["assurance"])
    assurance["review"]["candidate_revision"] = "content-sha256:" + "0" * 64
    return assurance


if __name__ == "__main__":
    raise SystemExit(main())
