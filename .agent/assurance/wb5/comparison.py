"""Executable semantic comparison contract for WB-005.

The corpus is declarative evidence. This module owns the independently executable
replacement probes and the frozen baseline contract each scenario must bind.
"""

from __future__ import annotations

import json
import subprocess
import tempfile
from dataclasses import dataclass
from pathlib import Path
from types import SimpleNamespace

from controllers.v1 import consequential, events, gitfacts, policy, state
from orchestration.admission import AdmissionRecord
from orchestration.registry import SQLiteAdmissionRegistry


@dataclass(frozen=True, slots=True)
class ComparisonContract:
    legacy_result: str
    classification: str
    accepted_requirement_ref: dict[str, str]
    security_relaxation_authorization_ref: dict[str, str] | None = None


def _ref(path: str, contains: str) -> dict[str, str]:
    return {"path": path, "contains": contains}


CONTRACTS: dict[str, ComparisonContract] = {
    "PREWB-PLANNING-ADMITTED": ComparisonContract(
        "DENY_SOURCE_WRITE_WHEN_CANONICAL_INACTIVE",
        "INTENTIONAL_CHANGE",
        _ref(
            "docs/architecture/sdlc-simplification-v1-state-event-contract.md",
            "an admitted run with missing local state or canonical INACTIVE receives planning-only authority",
        ),
        _ref(
            "docs/architecture/sdlc-simplification-v1-state-event-contract.md",
            "an admitted run with missing local state or canonical INACTIVE receives planning-only authority",
        ),
    ),
    "ACTIVE-STRUCTURED-IN-SCOPE": ComparisonContract(
        "ALLOW",
        "EQUIVALENT",
        _ref(
            "docs/architecture/sdlc-simplification-v1-implementation-design.md",
            "Structured write tools should be checked directly against",
        ),
    ),
    "ACTIVE-STRUCTURED-OUTSIDE-SCOPE": ComparisonContract(
        "DENY",
        "EQUIVALENT",
        _ref(
            "docs/architecture/sdlc-simplification-v1-state-event-contract.md",
            "defines implementation mutation authority",
        ),
    ),
    "PROTECTED-POLICY-WRITE": ComparisonContract(
        "DENY",
        "EQUIVALENT",
        _ref(
            "docs/architecture/sdlc-simplification-v1-state-event-contract.md",
            "Ordinary Work Blocks cannot include `.agent/policies/**`",
        ),
    ),
    "DEFAULT-BRANCH-COMMIT": ComparisonContract(
        "DENY",
        "EQUIVALENT",
        _ref(
            "docs/architecture/sdlc-simplification-v1-implementation-design.md",
            "Git hooks enforce invariants for which Git has authoritative facts",
        ),
    ),
    "EXACT-SUBJECT-PUBLICATION": ComparisonContract(
        "ALLOW_ONLY_AFTER_EXACT_ASSURANCE",
        "INTENTIONAL_CHANGE",
        _ref(
            "docs/architecture/sdlc-simplification-v1-implementation-design.md",
            "exact non-force subject-branch publication may be autonomous only after required assurance",
        ),
    ),
    "FORCE-PUSH": ComparisonContract(
        "DENY",
        "EQUIVALENT",
        _ref(
            "docs/architecture/sdlc-simplification-v1-implementation-design.md",
            "exact non-force subject-branch publication",
        ),
    ),
    "OPAQUE-BASH-SCOPE-INFERENCE": ComparisonContract(
        "LEGACY_HOOK_PARSES_SHELL_TEXT_FOR_WRITE_SCOPE",
        "REMOVED_OR_TRANSFERRED_LEGACY_MECHANISM",
        _ref(
            "docs/architecture/sdlc-simplification-v1-implementation-design.md",
            "The replacement must not use a lightweight bespoke shell parser as a security boundary.",
        ),
    ),
    "STOP-ASSURANCE-MUTATION-GATE": ComparisonContract(
        "STOP_HOOK_REQUIRES_ASSURANCE_CLOSEOUT_STATE",
        "REMOVED_OR_TRANSFERRED_LEGACY_MECHANISM",
        _ref(
            "docs/architecture/sdlc-simplification-v1-implementation-design.md",
            "Stop/session hooks may report unresolved work but must never require lifecycle mutation",
        ),
    ),
    "SUBAGENT-CONTEXT": ComparisonContract(
        "ADVISORY_CONTEXT_FROM_SCHEMA3_GATE",
        "INTENTIONAL_CHANGE",
        _ref(
            "docs/architecture/sdlc-simplification-v1-implementation-design.md",
            "Subagent-start hooks may provide context but do not grant authority.",
        ),
    ),
    "POST-PUBLICATION-MERGE-AUTHORITY": ComparisonContract(
        "OWNER_HARD_STOP_OUTSIDE_CONTROLLER",
        "INTENTIONAL_CHANGE",
        _ref(
            "docs/architecture/sdlc-simplification-v1-autonomous-orchestration.md",
            "The Orchestrator cannot convert subject-branch publication authority into merge authority.",
        ),
    ),
    "TERMINAL-ADMISSION-AUTHORITY": ComparisonContract(
        "NO_EXPLICIT_ACTIVE_ADMISSION_INDEX",
        "INTENTIONAL_CHANGE",
        _ref(
            "docs/architecture/sdlc-simplification-v1-autonomous-orchestration.md",
            "The external trusted admission registry owns the detailed envelope keyed by `admission_id`.",
        ),
    ),
}


def replacement_test_id(identifier: str) -> str:
    if identifier not in CONTRACTS:
        raise KeyError(identifier)
    return f"probe:{identifier}"


def _event(kind: str, *, branch="feat/compare", paths=(), facts=None, root="/tmp/compare"):
    source = "git" if kind.startswith("git_") else "codex"
    return events.Event(
        1,
        source,
        kind,
        root,
        branch,
        tuple(paths),
        facts or {},
    )


def _execute_state() -> dict:
    opened = state.open_work_block(
        None,
        work_block_id="WB-999",
        initiative_ref="docs/changes/compare",
        admission_id="adm-compare0001",
        subject_branch="feat/compare",
        base_commit="a" * 40,
        authority_profile_id="human-governed",
        authority_profile_revision="b" * 40,
        planning_revision="c" * 40,
        planning_paths=["docs/changes/compare/intent.md"],
        implementation_write_set=["src/**"],
        coordination_scope=["docs/changes/compare/**"],
    )
    return state.critic_result(opened, "ready")


def _probe_pre_wb_planning(_root: Path) -> str:
    admission = SimpleNamespace(
        admission_id="adm-compare0001",
        repository="fixture/repo",
        subject_branch="feat/compare",
        base_commit="a" * 40,
    )
    planning = policy.evaluate(
        _event(
            "structured_write",
            paths=("docs/changes/compare/intent.md",),
        ),
        None,
        admission=admission,
        repository_id="fixture/repo",
    )
    source = policy.evaluate(
        _event("structured_write", paths=("src/app.py",)),
        None,
        admission=admission,
        repository_id="fixture/repo",
    )
    if not planning.allowed or source.allowed:
        raise AssertionError("pre-WB replacement planning authority probe failed")
    return "ALLOW_PLANNING_ONLY_WITH_EXACT_ACTIVE_ADMISSION"


def _probe_active_in_scope(_root: Path) -> str:
    result = policy.evaluate(
        _event("structured_write", paths=("src/app.py",)),
        _execute_state(),
    )
    if not result.allowed:
        raise AssertionError("in-scope structured write was denied")
    return "ALLOW"


def _probe_active_outside_scope(_root: Path) -> str:
    result = policy.evaluate(
        _event("structured_write", paths=("outside.txt",)),
        _execute_state(),
    )
    if result.allowed:
        raise AssertionError("outside-scope structured write was allowed")
    return "DENY"


def _probe_protected_policy(_root: Path) -> str:
    result = policy.evaluate(
        _event(
            "structured_write",
            paths=(".agent/policies/admission-rules.json",),
        ),
        _execute_state(),
    )
    if result.allowed or result.code != "COMMIT_FORBIDDEN_PATH":
        raise AssertionError("protected policy surface was not denied")
    return "DENY"


def _probe_default_branch_commit(_root: Path) -> str:
    result = policy.evaluate(
        _event(
            "git_pre_commit",
            branch="main",
            paths=("src/app.py",),
            facts={"head_sha": "d" * 40},
        ),
        _execute_state(),
        default_branch="main",
    )
    if result.allowed or result.code != "COMMIT_DEFAULT_BRANCH_DENIED":
        raise AssertionError("default-branch commit was not denied")
    return "DENY"


def _git(root: Path, *args: str) -> str:
    return subprocess.run(
        ["git", "-C", str(root), *args],
        check=True,
        capture_output=True,
        text=True,
    ).stdout.strip()


def _probe_exact_subject_publication(_root: Path) -> str:
    with tempfile.TemporaryDirectory(prefix="wb5-comparison-push-") as temp:
        root = Path(temp)
        _git(root, "init", "-q", "-b", "feat/compare")
        _git(root, "config", "user.name", "WB5 Comparison")
        _git(root, "config", "user.email", "wb5@example.invalid")
        (root / "candidate.txt").write_text("candidate\n", encoding="utf-8")
        _git(root, "add", "candidate.txt")
        _git(root, "commit", "-qm", "candidate")
        head = _git(root, "rev-parse", "HEAD")

        opened = state.open_work_block(
            None,
            work_block_id="WB-999",
            initiative_ref="docs/changes/compare",
            admission_id="adm-compare0002",
            subject_branch="feat/compare",
            base_commit=head,
            authority_profile_id="human-governed",
            authority_profile_revision=head,
            planning_revision=head,
            planning_paths=["docs/changes/compare/intent.md"],
            implementation_write_set=["src/**"],
            coordination_scope=["docs/changes/compare/**"],
        )
        execute = state.critic_result(opened, "ready")
        assure = state.create_candidate(execute, head)
        ready = state.reviewer_result(assure, "ready")
        ready = state.verifier_result(ready, "ready")
        event = _event(
            "git_pre_push",
            root=str(root),
            facts={
                "remote_name": "origin",
                "local_ref": "refs/heads/feat/compare",
                "local_sha": head,
                "remote_ref": "refs/heads/feat/compare",
                "remote_sha": gitfacts.ZERO_SHA,
            },
        )
        allowed = policy.evaluate(
            event,
            ready,
            default_branch="main",
            subject_branch_is_protected=False,
        )
        unknown = policy.evaluate(
            event,
            ready,
            default_branch="main",
            subject_branch_is_protected=None,
        )
        not_ready = policy.evaluate(
            event,
            assure,
            default_branch="main",
            subject_branch_is_protected=False,
        )
        if not allowed.allowed or unknown.allowed or not_ready.allowed:
            raise AssertionError("exact subject publication predicates are inconsistent")
    return "ALLOW_ONLY_AFTER_EXACT_ASSURANCE_AND_TRUSTED_PLATFORM_FACTS"


def _probe_force_push(_root: Path) -> str:
    result = consequential.evaluate_command(
        "git push --force origin HEAD:refs/heads/feat/compare"
    )
    if result.allowed:
        raise AssertionError("force push was not denied")
    return "DENY"


def _probe_opaque_bash(_root: Path) -> str:
    result = consequential.evaluate_command("printf x > src/app.py")
    if not result.allowed:
        raise AssertionError("replacement inferred structured authority from opaque Bash")
    return "NO_STRUCTURED_AUTHORITY_INFERRED_FROM_BASH_TEXT"


def _patch_postimage(root: Path, path: str) -> bytes:
    text = (root / ".agent/assurance/wb5/cutover.patch").read_text(encoding="utf-8")
    marker = f"diff --git a/{path} b/{path}\n"
    if marker not in text:
        raise AssertionError(f"cutover patch lacks {path}")
    section = text.split(marker, 1)[1]
    if "\ndiff --git " in section:
        section = section.split("\ndiff --git ", 1)[0]
    if "\n@@ " not in section:
        raise AssertionError(f"cutover patch lacks hunk for {path}")
    hunk = section.split("\n@@ ", 1)[1]
    hunk = hunk.split("\n", 1)[1]
    output: list[str] = []
    for line in hunk.splitlines():
        if line.startswith("+") and not line.startswith("+++"):
            output.append(line[1:])
    return ("\n".join(output) + "\n").encode("utf-8")


def _probe_stop_gate(root: Path) -> str:
    payload = json.loads(_patch_postimage(root, ".claude/settings.json"))
    hooks = payload.get("hooks")
    if not isinstance(hooks, dict) or "Stop" in hooks:
        raise AssertionError("replacement cutover retains Stop lifecycle authority")
    return "NO_LIFECYCLE_AUTHORITY_IN_STOP_HOOK"


def _probe_subagent_context(_root: Path) -> str:
    result = policy.evaluate(
        _event("subagent_context"),
        _execute_state(),
    )
    if result.decision != "ADVISORY":
        raise AssertionError("subagent context is not advisory")
    return "ADVISORY_CONTEXT_FROM_CONTROLLER_V1_STATE"


def _probe_post_publication_merge(root: Path) -> str:
    raw = json.loads(
        (root / ".agent/policies/autonomy-profiles.json").read_text(encoding="utf-8")
    )
    profile = raw["profiles"]["human-governed"]
    if "merge" in profile["capabilities"] or "merge" not in profile["requires_owner"]:
        raise AssertionError("human-governed profile grants autonomous merge")
    return "PINNED_PROFILE_PLUS_OWNER_OR_PLATFORM_BOUNDARY"


def _probe_terminal_admission(_root: Path) -> str:
    with tempfile.TemporaryDirectory(prefix="wb5-comparison-registry-") as temp:
        registry = SQLiteAdmissionRegistry(Path(temp) / "registry.sqlite3")
        record = AdmissionRecord(
            admission_id="adm-compare0003",
            repository="fixture/repo",
            trigger_class="manual-owner",
            authority_profile_id="human-governed",
            authority_profile_revision="a" * 40,
            base_ref="main",
            base_commit="b" * 40,
            subject_branch="feat/compare-terminal",
        )
        registry.put(record)
        registry.terminalize(record.admission_id, "REVOKED")
        if registry.is_active(record.admission_id):
            raise AssertionError("terminal admission remains active")
        if registry.owner_authorized(record.admission_id, "merge", "c" * 40):
            raise AssertionError("terminal admission still grants Owner-authorized capability")
    return "TERMINAL_ADMISSION_CANNOT_GRANT_FUTURE_AUTHORITY"


PROBES = {
    "PREWB-PLANNING-ADMITTED": _probe_pre_wb_planning,
    "ACTIVE-STRUCTURED-IN-SCOPE": _probe_active_in_scope,
    "ACTIVE-STRUCTURED-OUTSIDE-SCOPE": _probe_active_outside_scope,
    "PROTECTED-POLICY-WRITE": _probe_protected_policy,
    "DEFAULT-BRANCH-COMMIT": _probe_default_branch_commit,
    "EXACT-SUBJECT-PUBLICATION": _probe_exact_subject_publication,
    "FORCE-PUSH": _probe_force_push,
    "OPAQUE-BASH-SCOPE-INFERENCE": _probe_opaque_bash,
    "STOP-ASSURANCE-MUTATION-GATE": _probe_stop_gate,
    "SUBAGENT-CONTEXT": _probe_subagent_context,
    "POST-PUBLICATION-MERGE-AUTHORITY": _probe_post_publication_merge,
    "TERMINAL-ADMISSION-AUTHORITY": _probe_terminal_admission,
}


def probe_replacement(root: Path, identifier: str) -> str:
    try:
        probe = PROBES[identifier]
    except KeyError as exc:
        raise AssertionError(f"no executable comparison probe: {identifier}") from exc
    return probe(Path(root).resolve())
