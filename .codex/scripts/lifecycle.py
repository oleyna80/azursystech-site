#!/usr/bin/env python3
"""Schema v3 local Work Block lifecycle helper.

This helper manages cooperative project-local coordination state. It does not
create security authority. Consequential authority belongs to external GitHub,
OS, workflow, and credential boundaries.
"""
from __future__ import annotations

import argparse
import copy
import datetime as dt
import fnmatch
import hashlib
import json
import os
import subprocess
import tempfile
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))
from subagent_topology import TopologyError, applicable, validate as validate_topology

SCHEMA_VERSION = 3
AUTHORITY_MODE = "github_capability"
DEFAULT_COORDINATION = [
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
EXTERNAL_HARD_STOPS = [
    "protected_default_branch_mutation",
    "destructive",
    "live_infra",
    "live_data",
    "credentials",
    "client_communications",
    "irreversible_publish",
]
ASSURANCE_STATUSES = {"PENDING", "READY", "SKIPPED", "DEGRADED", "BLOCKED"}
ASSURANCE_VERDICTS = {
    "review": {"READY", "CHANGES_REQUIRED", "BLOCKED", "UNVERIFIED"},
    "verification": {"READY", "BLOCKED", "UNVERIFIED"},
    "evaluation": {"READY", "BLOCKED", "UNVERIFIED"},
    "drift": {"ALIGNED", "ALIGNMENT_REQUIRED", "BLOCKED", "UNVERIFIED"},
}
FORMAL_DEFINE_PROFILES = {"Managed", "Assured", "Distributed"}
CANDIDATE_IDENTITY_PREFIX = "content-sha256:"
MUTABLE_CANDIDATE_PATHS = {".agent/active-work-block.json"}


def now() -> str:
    return dt.datetime.now(dt.timezone.utc).isoformat()


def run_git(root: Path, *args: str) -> subprocess.CompletedProcess[str]:
    try:
        return subprocess.run(
            ["git", *args],
            cwd=root,
            text=True,
            capture_output=True,
            check=False,
            timeout=5,
        )
    except (OSError, subprocess.SubprocessError) as exc:
        raise ValueError(f"cannot inspect git state: {exc}") from exc


def git_head(root: Path) -> str:
    result = run_git(root, "rev-parse", "HEAD")
    if result.returncode != 0 or not result.stdout.strip():
        raise ValueError("cannot resolve git HEAD")
    return result.stdout.strip()


def _candidate_path_matches(relative: str, write_set: list[str]) -> bool:
    for raw_pattern in write_set:
        pattern = str(raw_pattern).strip().replace("\\", "/")
        if pattern.startswith("./"):
            pattern = pattern[2:]
        if not pattern:
            continue
        if pattern.endswith("/**"):
            prefix = pattern[:-3].rstrip("/")
            if relative == prefix or relative.startswith(f"{prefix}/"):
                return True
        elif relative == pattern or fnmatch.fnmatchcase(relative, pattern):
            return True
    return False


def candidate_content_identity(root: Path, write_set: list[str] | None) -> str:
    """Return the immutable identity of the approved source candidate.

    Freeze runs before assurance while the worktree may be dirty, so Git HEAD
    is only the base anchor.  The identity covers the current filesystem
    content selected by the approved write-set and excludes only the mutable
    active-state record that freeze itself rewrites.
    """
    if not isinstance(write_set, list) or not write_set:
        raise ValueError("candidate content identity requires a non-empty write set")

    entries: list[tuple[str, bytes, bytes]] = []
    for current, directories, files in os.walk(root, topdown=True, followlinks=False):
        current_path = Path(current)
        directories[:] = [name for name in directories if name != ".git"]
        symlink_directories = [
            name for name in directories if (current_path / name).is_symlink()
        ]
        for name in files + symlink_directories:
            path = current_path / name
            relative = path.relative_to(root).as_posix()
            if relative in MUTABLE_CANDIDATE_PATHS or not _candidate_path_matches(
                relative, write_set
            ):
                continue
            try:
                if path.is_symlink():
                    kind = b"symlink"
                    content = os.readlink(path).encode("utf-8", errors="surrogateescape")
                elif path.is_file():
                    kind = b"file"
                    content = path.read_bytes()
                else:
                    continue
            except OSError as exc:
                raise ValueError(f"cannot read candidate path {relative}: {exc}") from exc
            entries.append((relative, kind, content))

    if not entries:
        raise ValueError("candidate content identity found no write-set files")

    digest = hashlib.sha256()
    for relative, kind, content in sorted(entries):
        path_bytes = relative.encode("utf-8", errors="surrogateescape")
        digest.update(len(path_bytes).to_bytes(8, "big"))
        digest.update(path_bytes)
        digest.update(len(kind).to_bytes(8, "big"))
        digest.update(kind)
        digest.update(len(content).to_bytes(8, "big"))
        digest.update(content)
    return f"{CANDIDATE_IDENTITY_PREFIX}{digest.hexdigest()}"


def validate_candidate_identity(current: dict, root: Path | None) -> None:
    frozen = current.get("frozen_revision")
    if (
        not isinstance(frozen, str)
        or not frozen.startswith(CANDIDATE_IDENTITY_PREFIX)
        or len(frozen) != len(CANDIDATE_IDENTITY_PREFIX) + 64
        or any(character not in "0123456789abcdef" for character in frozen[len(CANDIDATE_IDENTITY_PREFIX) :])
    ):
        raise ValueError(
            "success-closeout requires frozen_revision to be an immutable content-sha256 identity"
        )
    if root is None:
        raise ValueError("success-closeout requires repository root for candidate identity")
    current_identity = candidate_content_identity(root, current.get("write_set"))
    if current_identity != frozen:
        raise ValueError(
            "success-closeout candidate content identity does not match frozen_revision"
        )


def git_branch(root: Path) -> str:
    result = run_git(root, "symbolic-ref", "--quiet", "--short", "HEAD")
    if result.returncode != 0 or not result.stdout.strip():
        raise ValueError("source work requires an attached Git branch; HEAD is detached")
    return result.stdout.strip()


def git_default_branch(root: Path) -> str:
    remote_head = run_git(root, "symbolic-ref", "--quiet", "--short", "refs/remotes/origin/HEAD")
    if remote_head.returncode == 0 and remote_head.stdout.strip():
        value = remote_head.stdout.strip()
        return value.split("/", 1)[1] if value.startswith("origin/") else value

    for candidate in ("main", "master"):
        exists = run_git(root, "show-ref", "--verify", "--quiet", f"refs/heads/{candidate}")
        if exists.returncode == 0:
            return candidate
    return ""


def source_branch(root: Path) -> str:
    branch = git_branch(root)
    default_branch = git_default_branch(root)
    if default_branch and branch == default_branch:
        raise ValueError(
            f"source work cannot open on repository default branch {default_branch!r}; "
            "create/switch to a feature worktree first"
        )
    if not default_branch and branch in {"main", "master"}:
        raise ValueError(
            f"source work cannot open on probable default branch {branch!r}; "
            "create/switch to a feature worktree first"
        )
    return branch


def read(path: Path) -> dict:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"malformed state: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError("state must be object")
    return value


def atomic(path: Path, value: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary: Path | None = None
    try:
        with tempfile.NamedTemporaryFile(
            "w", encoding="utf-8", dir=path.parent, delete=False
        ) as out:
            json.dump(value, out, indent=2, sort_keys=False)
            out.write("\n")
            out.flush()
            os.fsync(out.fileno())
            temporary = Path(out.name)
        os.replace(temporary, path)
        directory = os.open(path.parent, os.O_RDONLY | os.O_DIRECTORY)
        try:
            os.fsync(directory)
        finally:
            os.close(directory)
    finally:
        if temporary is not None and temporary.exists():
            temporary.unlink()


def load_default_state(root: Path) -> dict:
    template = root / ".agent/active-work-block.default.json"
    try:
        value = json.loads(template.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"canonical default template is unavailable or malformed: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError("canonical default template must be an object")
    validate_state(value)
    if value.get("work_block_id") or value.get("subject_branch") or value.get("base_commit"):
        raise ValueError("canonical default template must be inactive")
    if value.get("specification") != {"path": "", "revision": ""}:
        raise ValueError("canonical default template must have an empty specification identity")
    if value.get("write_gate") != {"status": "BLOCKED", "opened_at": None}:
        raise ValueError("canonical default template must have a BLOCKED write gate")
    if value.get("write_set") != []:
        raise ValueError("canonical default template must have an empty write set")
    if value.get("integrations") != {"approved": [], "admission_records": []}:
        raise ValueError("canonical default template must not retain integration admission")
    return value


def default_state(root: Path, reason: str = "coordination") -> dict:
    value = load_default_state(root)
    value["lifecycle_note"] = reason
    return value


def validate_state(value: dict) -> None:
    if value.get("schema_version") != SCHEMA_VERSION:
        raise ValueError(f"state requires schema_version={SCHEMA_VERSION}")
    if value.get("authority_mode") != AUTHORITY_MODE:
        raise ValueError(f"state requires authority_mode={AUTHORITY_MODE}")


def validate_open(args: argparse.Namespace) -> None:
    if not args.work_block_id.strip():
        raise ValueError("open requires a non-empty --work-block-id")
    if not args.specification_path.strip():
        raise ValueError("open requires --specification-path")
    if not args.specification_revision.strip():
        raise ValueError("open requires --specification-revision")
    writes = [value.strip() for value in args.write if value.strip()]
    if not writes:
        raise ValueError("open requires at least one --write path")
    if args.critic_status not in {"READY", "DEGRADED", "FALLBACK", "SKIPPED"}:
        raise ValueError("open requires a resolved Critic status")
    if args.critic_status == "SKIPPED":
        if not args.critic_skip_reason.strip():
            raise ValueError("SKIPPED Critic requires --critic-skip-reason")
    elif args.critic_verdict not in {"APPROVE", "SUPPLEMENT"}:
        raise ValueError("resolved Critic requires APPROVE or SUPPLEMENT verdict")
    if args.governance_profile in FORMAL_DEFINE_PROFILES:
        if args.define_quality_status != "READY":
            raise ValueError(
                f"{args.governance_profile} open requires --define-quality-status READY"
            )
        missing = [
            name
            for name, value in (
                ("--requirements-review", args.requirements_review),
                ("--traceability", args.traceability),
                ("--consistency-analysis", args.consistency_analysis),
            )
            if not value.strip()
        ]
        if missing:
            raise ValueError(
                f"{args.governance_profile} open requires {' '.join(missing)} evidence"
            )


def topology_evidence(args: argparse.Namespace) -> dict | None:
    if not args.non_trivial:
        return None
    try:
        value = json.loads(args.topology_evidence)
    except json.JSONDecodeError as exc:
        raise ValueError("non-trivial open requires valid --topology-evidence JSON") from exc
    if not isinstance(value, dict):
        raise ValueError("non-trivial open requires object --topology-evidence JSON")
    return value


def open_state(root: Path, args: argparse.Namespace, current: dict) -> dict:
    validate_open(args)
    branch = source_branch(root)
    value = default_state(root, "source work opened by Work Block coordination")
    value["work_block_id"] = args.work_block_id.strip()
    value["governance_profile"] = args.governance_profile
    value["specification"] = {
        "path": args.specification_path.strip(),
        "revision": args.specification_revision.strip(),
    }
    value["subject_branch"] = branch
    value["base_commit"] = git_head(root)
    value["define_quality"] = {
        "required": args.governance_profile in FORMAL_DEFINE_PROFILES,
        "status": args.define_quality_status,
        "requirements_review": args.requirements_review.strip(),
        "traceability": args.traceability.strip(),
        "consistency_analysis": args.consistency_analysis.strip(),
    }
    value["write_gate"] = {"status": "READY", "opened_at": now()}
    value["write_set"] = list(dict.fromkeys(v.strip() for v in args.write if v.strip()))
    value["non_trivial"] = args.non_trivial
    evidence = topology_evidence(args)
    if evidence is not None:
        value["subagent_topology"] = evidence
    value["critic"] = {
        "required": True,
        "status": args.critic_status,
        "verdict": args.critic_verdict if args.critic_status != "SKIPPED" else "SKIPPED",
        "report": args.critic_report.strip(),
        "isolation": args.critic_isolation,
        "skip_reason": args.critic_skip_reason.strip(),
    }
    if isinstance(current.get("integrations"), dict):
        value["integrations"] = copy.deepcopy(current["integrations"])
    if isinstance(current.get("coordination_write_set"), list):
        value["coordination_write_set"] = list(current["coordination_write_set"])
    try:
        validate_topology(value, phase="admission", root=root)
    except TopologyError as exc:
        raise ValueError(f"open requires valid native topology evidence: {exc}") from exc
    return value


def blocked_copy(current: dict, reason: str, root: Path) -> dict:
    validate_state(current)
    value = copy.deepcopy(current)
    value["write_gate"] = {"status": "BLOCKED", "opened_at": None}
    value["lifecycle_note"] = reason
    value["frozen_revision"] = candidate_content_identity(root, value.get("write_set"))
    return value


def validate_assurance_role_bindings(current: dict) -> None:
    topology = current.get("subagent_topology")
    assurance = current.get("assurance")
    bindings = topology.get("role_bindings") if isinstance(topology, dict) else None
    if not isinstance(bindings, list) or not isinstance(assurance, dict):
        raise ValueError("success-closeout requires assurance role-binding evidence")
    by_role = {
        item.get("role"): item
        for item in bindings
        if isinstance(item, dict) and isinstance(item.get("role"), str)
    }
    for assurance_name, role in (("review", "reviewer"), ("verification", "verifier")):
        evidence = assurance.get(assurance_name)
        binding = by_role.get(role)
        if not isinstance(evidence, dict) or not isinstance(binding, dict):
            raise ValueError(f"success-closeout requires assurance.{assurance_name} binding")
        for key in ("report", "execution_id"):
            if not isinstance(evidence.get(key), str) or not evidence[key].strip():
                raise ValueError(f"assurance.{assurance_name}.{key} is required")
            if evidence[key] != binding[key]:
                raise ValueError(
                    f"assurance.{assurance_name}.{key} does not match native {role} binding"
                )


def _require_frozen_candidate(current: dict, root: Path) -> None:
    """Require the current filesystem to still be the frozen source candidate."""
    if current.get("write_gate", {}).get("status") != "BLOCKED":
        raise ValueError("Verifier execution requires a frozen BLOCKED write gate")
    validate_candidate_identity(current, root)


def _review_ready_prerequisite(current: dict) -> None:
    """Check the already completed Reviewer evidence before Verifier dispatch."""
    assurance = current.get("assurance")
    review = assurance.get("review") if isinstance(assurance, dict) else None
    if not isinstance(review, dict) or review.get("status") != "READY" or review.get("verdict") != "READY":
        raise ValueError("Verifier execution requires completed assurance.review READY/READY")
    bindings = current.get("subagent_topology", {}).get("role_bindings")
    reviewer = next(
        (item for item in bindings if isinstance(item, dict) and item.get("role") == "reviewer"),
        None,
    ) if isinstance(bindings, list) else None
    if not isinstance(reviewer, dict):
        raise ValueError("Verifier execution requires a completed Reviewer binding")
    for key in ("report", "execution_id"):
        if review.get(key) != reviewer.get(key):
            raise ValueError(f"assurance.review.{key} does not match the Reviewer binding")
    if reviewer.get("status") != "READY" or reviewer.get("topology_tier") != "native-separate-context":
        raise ValueError("Verifier execution requires a READY native-separate-context Reviewer binding")


def _report_file(root: Path, report: str) -> Path:
    """Resolve an authoritative report without allowing path escape."""
    normalized = report.replace("\\", "/")
    parts = normalized.split("/")
    if normalized.startswith("/") or ".." in parts or len(parts) < 3 or parts[:2] != ["docs", "reports"]:
        raise ValueError("verification report must be a safe path under docs/reports")
    candidate = (root / Path(*parts)).resolve()
    reports = (root / "docs" / "reports").resolve()
    try:
        candidate.relative_to(reports)
    except ValueError as exc:
        raise ValueError("verification report resolves outside docs/reports") from exc
    if not candidate.is_file() or not candidate.stat().st_size:
        raise ValueError(f"verification report does not exist or is empty: {report}")
    return candidate


def _report_result(root: Path, report: str, execution_id: str, verdict: str) -> None:
    """Require the authoritative report to bind this execution to its verdict."""
    path = _report_file(root, report)
    expected = f"verification_result: execution_id={execution_id} verdict={verdict}"
    records = [
        line.strip()
        for line in path.read_text(encoding="utf-8").splitlines()
        if line.strip().startswith("verification_result:")
    ]
    if records != [expected]:
        raise ValueError(
            "authoritative verification report must contain exactly one result "
            "record matching the execution ID and requested verdict"
        )


def prepare_verifier_execution(
    current: dict,
    root: Path,
    binding: dict,
    *,
    now: dt.datetime | None = None,
) -> dict:
    """Record native dispatch provenance while the Verifier remains PENDING."""
    validate_state(current)
    if not applicable(current):
        raise ValueError("Verifier execution preparation is only required for applicable Work Blocks")
    _require_frozen_candidate(current, root)
    validate_topology(current, phase="admission", root=root, now=now)
    _review_ready_prerequisite(current)
    topology = current.get("subagent_topology")
    capability = topology.get("capability") if isinstance(topology, dict) else None
    if not isinstance(capability, dict):
        raise ValueError("Verifier execution requires native capability evidence")
    required = {
        "work_block_id": current.get("work_block_id"),
        "role": "verifier",
        "source_revision": current.get("frozen_revision"),
        "repository_root": str(root.resolve()),
        "branch": current.get("subject_branch"),
        "runtime": capability.get("runtime"),
        "adapter": capability.get("adapter"),
        "adapter_version": capability.get("adapter_version"),
        "readonly_boundary": "read-only",
        "launch_mechanism": "native",
        "topology_tier": "native-separate-context",
        "status": "PENDING",
    }
    for key, expected in required.items():
        if binding.get(key) != expected:
            raise ValueError(f"provisional Verifier binding {key} does not match the active frozen candidate")
    if binding.get("execution_id") != binding.get("dispatch_id"):
        raise ValueError("provisional Verifier execution_id must match native dispatch ID")
    if not isinstance(binding.get("report"), str) or not binding["report"].strip():
        raise ValueError("provisional Verifier binding requires an authoritative report path")
    if binding.get("probe_event_ref") != f"native_dispatch:{binding.get('execution_id')}":
        raise ValueError("provisional Verifier binding must use native_dispatch:<execution_id>")
    if binding.get("context_id_source") not in {"platform_context_id", "execution_id"}:
        raise ValueError("provisional Verifier binding context_id_source is invalid")
    if not isinstance(binding.get("context_id"), str) or not binding["context_id"].strip():
        raise ValueError("provisional Verifier binding context_id is required")
    value = copy.deepcopy(current)
    assurance = value["assurance"]["verification"]
    assurance.update({
        "status": "PENDING",
        "verdict": "PENDING",
        "report": binding["report"],
        "execution_id": binding["execution_id"],
        "isolation": "native-separate-context",
    })
    value["subagent_topology"]["role_bindings"].append(copy.deepcopy(binding))
    validate_topology(value, phase="verifier-execution", root=root, now=now)
    return value


def finalize_verifier_execution(
    current: dict,
    root: Path,
    *,
    execution_id: str,
    verdict: str,
    now: dt.datetime | None = None,
) -> dict:
    """Finalize a completed dispatch from the Orchestrator coordination path.

    This cooperative project-local helper deliberately accepts no caller role
    label: a string supplied by a Verifier cannot establish Orchestrator
    authority. Runtime role separation and external controls remain the actual
    authority boundary; the helper only validates the completed dispatch
    provenance and result before applying the coordination transition.
    """
    validate_state(current)
    if verdict not in {"READY", "BLOCKED"}:
        raise ValueError("Verifier finalization verdict must be READY or BLOCKED")
    _require_frozen_candidate(current, root)
    validate_topology(current, phase="verifier-execution", root=root, now=now)
    bindings = current["subagent_topology"]["role_bindings"]
    verifier = next(item for item in bindings if item.get("role") == "verifier")
    if verifier.get("execution_id") != execution_id:
        raise ValueError("finalization execution ID does not match the provisional native dispatch")
    _report_result(root, verifier["report"], execution_id, verdict)
    value = copy.deepcopy(current)
    final_binding = next(item for item in value["subagent_topology"]["role_bindings"] if item.get("role") == "verifier")
    final_binding["status"] = verdict
    verification = value["assurance"]["verification"]
    verification["status"] = verdict
    verification["verdict"] = verdict
    verification["isolation"] = "native-separate-context"
    validate_assurance_role_bindings(value)
    if verdict == "READY":
        validate_topology(value, phase="closeout", root=root, now=now)
    return value


def validate_closeout_state(
    current: dict,
    mode: str,
    root: Path | None = None,
    *,
    now: dt.datetime | None = None,
) -> None:
    validate_state(current)
    assurance = current.get("assurance")
    if not isinstance(assurance, dict):
        raise ValueError("close requires assurance state")

    normalized: dict[str, tuple[bool, str, str]] = {}
    for name in ("review", "verification", "evaluation", "drift"):
        state = assurance.get(name)
        if not isinstance(state, dict):
            raise ValueError(f"close requires assurance.{name} state")
        required = state.get("required") is True
        status = str(state.get("status") or "")
        verdict = str(state.get("verdict") or "")
        skip_reason = str(state.get("skip_reason") or "").strip()
        if status not in ASSURANCE_STATUSES:
            raise ValueError(f"assurance.{name}.status is invalid or missing")
        if status == "PENDING":
            raise ValueError(f"assurance.{name} is still PENDING")
        if status == "SKIPPED":
            if required:
                raise ValueError(f"required assurance.{name} cannot be SKIPPED")
            if not skip_reason:
                raise ValueError(f"skipped assurance.{name} requires skip_reason")
        elif verdict not in ASSURANCE_VERDICTS[name]:
            raise ValueError(f"assurance.{name}.verdict is unresolved or invalid")
        normalized[name] = (required, status, verdict)

    if mode != "success-closeout":
        return

    validate_candidate_identity(current, root)
    try:
        validate_topology(current, phase="closeout", root=root, now=now)
    except TopologyError as exc:
        raise ValueError(f"success-closeout requires valid native topology evidence: {exc}") from exc
    if applicable(current):
        validate_assurance_role_bindings(current)

    define_quality = current.get("define_quality")
    if current.get("governance_profile") in FORMAL_DEFINE_PROFILES:
        if not isinstance(define_quality, dict) or define_quality.get("required") is not True:
            raise ValueError("success-closeout requires formal define_quality state")
        if define_quality.get("status") != "READY" or not all(
            isinstance(define_quality.get(name), str) and define_quality[name].strip()
            for name in ("requirements_review", "traceability", "consistency_analysis")
        ):
            raise ValueError("success-closeout requires READY formal define_quality evidence")

    required_review, review_status, review_verdict = normalized["review"]
    required_verification, verification_status, verification_verdict = normalized[
        "verification"
    ]
    required_evaluation, evaluation_status, evaluation_verdict = normalized["evaluation"]
    required_drift, drift_status, drift_verdict = normalized["drift"]

    if required_review and (review_status != "READY" or review_verdict != "READY"):
        raise ValueError("success-closeout requires assurance.review READY/READY")
    if required_verification and (
        verification_status != "READY" or verification_verdict != "READY"
    ):
        raise ValueError("success-closeout requires assurance.verification READY/READY")
    if required_evaluation and (
        evaluation_status != "READY" or evaluation_verdict != "READY"
    ):
        raise ValueError("success-closeout requires assurance.evaluation READY/READY")
    if required_drift and (drift_status != "READY" or drift_verdict != "ALIGNED"):
        raise ValueError("success-closeout requires assurance.drift READY/ALIGNED")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--state", type=Path, default=Path(".agent/active-work-block.json")
    )
    parser.add_argument("--root", type=Path, default=Path.cwd())
    subparsers = parser.add_subparsers(dest="command", required=True)
    subparsers.add_parser("status")
    prepare = subparsers.add_parser("prepare")
    prepare.add_argument("--reason", default="coordination")

    opening = subparsers.add_parser("open")
    opening.add_argument("--work-block-id", required=True)
    opening.add_argument("--specification-path", required=True)
    opening.add_argument("--specification-revision", required=True)
    opening.add_argument("--write", action="append", default=[])
    opening.add_argument("--governance-profile", default="Controlled")
    opening.add_argument("--critic-status", default="READY")
    opening.add_argument("--critic-verdict", default="APPROVE")
    opening.add_argument("--critic-report", default="")
    opening.add_argument("--critic-isolation", default="same_context")
    opening.add_argument("--critic-skip-reason", default="")
    opening.add_argument("--define-quality-status", choices=("PENDING", "READY"), default="PENDING")
    opening.add_argument("--requirements-review", default="")
    opening.add_argument("--traceability", default="")
    opening.add_argument("--consistency-analysis", default="")
    opening.add_argument("--non-trivial", action="store_true")
    opening.add_argument("--topology-evidence", default="")

    freeze = subparsers.add_parser("freeze")
    freeze.add_argument("--reason", required=True)
    prepare_verifier = subparsers.add_parser("prepare-verifier")
    prepare_verifier.add_argument("--execution-id", required=True)
    prepare_verifier.add_argument("--context-id", required=True)
    prepare_verifier.add_argument(
        "--context-id-source", choices=("platform_context_id", "execution_id"), required=True
    )
    prepare_verifier.add_argument("--report", required=True)
    prepare_verifier.add_argument("--observed-at", default="")
    finalize_verifier = subparsers.add_parser("finalize-verifier")
    finalize_verifier.add_argument("--execution-id", required=True)
    finalize_verifier.add_argument("--verdict", choices=("READY", "BLOCKED"), required=True)
    close = subparsers.add_parser("close")
    close.add_argument("--reason", required=True)
    close.add_argument(
        "--mode", choices=("success-closeout", "reporting-only"), required=True
    )

    args = parser.parse_args()
    root = args.root.resolve()
    state = args.state if args.state.is_absolute() else root / args.state

    if args.command == "status":
        value = read(state)
        validate_state(value)
        print(json.dumps(value, sort_keys=True))
        return 0

    current = read(state) if state.exists() else default_state(root)
    if args.command == "prepare":
        value = default_state(root, args.reason)
    elif args.command == "open":
        validate_state(current)
        value = open_state(root, args, current)
    elif args.command == "freeze":
        value = blocked_copy(current, args.reason, root)
    elif args.command == "prepare-verifier":
        dispatch_id = args.execution_id.strip()
        binding = {
            "execution_id": dispatch_id,
            "dispatch_id": dispatch_id,
            "context_id": args.context_id.strip(),
            "context_id_source": args.context_id_source,
            "report": args.report.strip(),
            "observed_at": args.observed_at.strip() or now(),
        }
        topology = current.get("subagent_topology")
        capability = topology.get("capability") if isinstance(topology, dict) else None
        if not isinstance(capability, dict):
            raise ValueError("prepare-verifier requires native capability evidence")
        binding.update({
            "work_block_id": current.get("work_block_id"),
            "role": "verifier",
            "source_revision": current.get("frozen_revision"),
            "repository_root": str(root.resolve()),
            "branch": current.get("subject_branch"),
            "runtime": capability.get("runtime"),
            "adapter": capability.get("adapter"),
            "adapter_version": capability.get("adapter_version"),
            "readonly_boundary": "read-only",
            "launch_mechanism": "native",
            "topology_tier": "native-separate-context",
            "probe_event_ref": f"native_dispatch:{dispatch_id}",
            "status": "PENDING",
        })
        value = prepare_verifier_execution(current, root, binding)
    elif args.command == "finalize-verifier":
        value = finalize_verifier_execution(
            current,
            root,
            execution_id=args.execution_id.strip(),
            verdict=args.verdict,
        )
    else:
        validate_closeout_state(current, args.mode, root)
        # A terminal closeout must not leave a branch-bound active record behind.
        # The inactive record retains only the closeout classification and the
        # coordination note; a subsequent Work Block must explicitly reopen scope.
        value = default_state(root, args.reason)
        value["closeout_mode"] = args.mode

    atomic(state, value)
    print(json.dumps(value, sort_keys=True))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except ValueError as exc:
        print(f"BLOCKED: {exc}")
        raise SystemExit(2)
