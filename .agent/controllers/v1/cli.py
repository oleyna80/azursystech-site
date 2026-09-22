"""Future v1 lifecycle CLI. Production time always comes from the internal UTC clock."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import stat
import subprocess
from pathlib import Path, PurePosixPath
from typing import Mapping

from .atomic import atomic_write_json
from .canonical import canonical_json_bytes
from .controller import (
    binding_from_manifest,
    manifest_file_identity,
    verify_live_binding,
    verify_live_package,
)
from .errors import TransitionDenied, ValidationError
from .lifecycle import (
    admit_define_revision,
    begin_define_revision,
    finalize_assurance,
    freeze_candidate,
    open_work_block,
    record_role_dispatch,
    refresh_capability,
    reporting_only,
    reporting_only_record,
    resume_execute,
)
from .package import controller_root
from .recovery import recover_inactive


def _object(path: Path) -> dict:
    value = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return value


def _authority_state() -> tuple[Path, Path]:
    root = controller_root()
    state = root / ".agent/active-work-block.json"
    if state.resolve() != state:
        raise ValidationError("authority state must be a non-symlink path in the controller repository")
    return root, state


def _head(root: Path) -> str:
    try:
        result = subprocess.run(
            ["git", "-C", str(root), "rev-parse", "HEAD"],
            check=True,
            capture_output=True,
            text=True,
        )
    except (OSError, subprocess.CalledProcessError) as exc:
        raise ValidationError(f"controller source commit cannot be resolved: {exc}") from exc
    value = result.stdout.strip()
    if len(value) != 40 or any(character not in "0123456789abcdef" for character in value):
        raise ValidationError("controller source commit is not an exact Git SHA-1")
    return value


def _branch(root: Path) -> str:
    try:
        result = subprocess.run(
            ["git", "-C", str(root), "symbolic-ref", "--quiet", "--short", "HEAD"],
            check=True,
            capture_output=True,
            text=True,
        )
    except (OSError, subprocess.CalledProcessError) as exc:
        raise ValidationError(f"subject branch cannot be resolved: {exc}") from exc
    branch = result.stdout.strip()
    if not branch:
        raise ValidationError("admission requires an attached subject branch")
    return branch


def _verify_baseline(root: Path, baseline: object) -> None:
    if not isinstance(baseline, str) or not re.fullmatch(r"[0-9a-f]{40}", baseline):
        raise ValidationError("original baseline must be an exact lower-case Git SHA-1")
    try:
        subprocess.run(
            ["git", "-C", str(root), "cat-file", "-e", f"{baseline}^{{commit}}"],
            check=True,
            capture_output=True,
            text=True,
        )
        subprocess.run(
            ["git", "-C", str(root), "merge-base", "--is-ancestor", baseline, "HEAD"],
            check=True,
            capture_output=True,
            text=True,
        )
    except (OSError, subprocess.CalledProcessError) as exc:
        raise TransitionDenied("original baseline is not an ancestor of admission HEAD") from exc


def _verify_blocker_report(
    root: Path,
    report: str,
    identity: str,
    expected_record: Mapping[str, object],
) -> None:
    relative = PurePosixPath(report)
    if relative.is_absolute() or ".." in relative.parts or relative.parts[:2] != ("docs", "reports"):
        raise ValidationError("blocker report must be a literal repository docs/reports path")
    target = root.joinpath(*relative.parts)
    try:
        metadata = target.lstat()
        payload = target.read_bytes()
    except OSError as exc:
        raise ValidationError(f"blocker report cannot be read: {exc}") from exc
    if not stat.S_ISREG(metadata.st_mode):
        raise ValidationError("blocker report must be a regular file")
    observed = f"sha256:{hashlib.sha256(payload).hexdigest()}"
    if identity != observed:
        raise TransitionDenied("blocker report bytes differ from the supplied durable identity")
    if payload != canonical_json_bytes(dict(expected_record)):
        raise TransitionDenied("blocker report does not contain the exact reporting-only closeout record")


def _verify_open_authority(root: Path, arguments: argparse.Namespace) -> dict:
    manifest, _, _ = verify_live_package(root)
    supplied = _object(arguments.controller_binding)
    source_commit = supplied.get("source_commit")
    activation_record = supplied.get("activation_record")
    if source_commit != _head(root):
        raise TransitionDenied("controller source commit is not the admission HEAD")
    expected = binding_from_manifest(
        manifest,
        source_commit=str(source_commit or ""),
        activation_record=str(activation_record or ""),
        manifest_identity=manifest_file_identity(root / ".agent/controller-manifest.json"),
    ).as_dict()
    if supplied != expected:
        raise TransitionDenied("supplied controller binding differs from live manifest/package authority")
    admission = _object(arguments.admission)
    if Path(str(admission.get("repository_root") or "")).resolve() != root:
        raise TransitionDenied("admission repository root differs from the authority-state root")
    if admission.get("subject_branch") != _branch(root):
        raise TransitionDenied("admission subject branch differs from the attached Git branch")
    _verify_baseline(root, admission.get("original_baseline"))
    return supplied


def _parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="AzurSysTech controller v1 lifecycle")
    commands = parser.add_subparsers(dest="operation", required=True)

    open_command = commands.add_parser("open")
    open_command.add_argument("--admission", type=Path, required=True)
    open_command.add_argument("--controller-binding", type=Path, required=True)
    open_command.add_argument("--critic-binding", type=Path, required=True)
    open_command.add_argument("--capability", type=Path, required=True)

    refresh = commands.add_parser("refresh-capability")
    refresh.add_argument("--evidence", type=Path, required=True)

    dispatch = commands.add_parser("record-dispatch")
    dispatch.add_argument("--binding", type=Path, required=True)

    begin = commands.add_parser("begin-define-revision")
    begin.add_argument("--revision", required=True)
    begin.add_argument("--identity", required=True)

    admit = commands.add_parser("admit-define-revision")
    admit.add_argument("--critic-binding", type=Path, required=True)
    admit.add_argument("--write-set", type=Path, required=True)

    freeze = commands.add_parser("freeze-candidate")
    freeze.add_argument("--attempt-id", required=True)
    freeze.add_argument("--frozen-commit", required=True)
    freeze.add_argument("--frozen-tree", required=True)
    freeze.add_argument("--sealed-manifest", required=True)
    freeze.add_argument("--sealed-manifest-identity", required=True)
    freeze.add_argument("--sealed-surface-identity", required=True)

    finalize = commands.add_parser("finalize-assurance")
    finalize.add_argument("--role", choices=("reviewer", "verifier"), required=True)
    finalize.add_argument("--binding", type=Path, required=True)

    resume = commands.add_parser("resume-execute")
    resume.add_argument("--attempt-id", required=True)

    blocked = commands.add_parser("reporting-only")
    blocked.add_argument("--blocker-report", required=True)
    blocked.add_argument("--blocker-identity", required=True)
    blocked.add_argument("--reason", required=True)

    recover = commands.add_parser("recover-inactive")
    recover.add_argument("--template", type=Path, required=True)
    recover.add_argument("--template-identity", required=True)
    return parser


def transition(arguments: argparse.Namespace, state: Mapping[str, object]) -> dict:
    if arguments.operation == "open":
        return open_work_block(
            state,
            admission=_object(arguments.admission),
            controller_binding=_object(arguments.controller_binding),
            critic_binding=_object(arguments.critic_binding),
            capability=_object(arguments.capability),
        )
    if arguments.operation == "refresh-capability":
        return refresh_capability(state, _object(arguments.evidence))
    if arguments.operation == "record-dispatch":
        return record_role_dispatch(state, dispatch=_object(arguments.binding))
    if arguments.operation == "begin-define-revision":
        return begin_define_revision(state, new_revision=arguments.revision, proposed_identity=arguments.identity)
    if arguments.operation == "admit-define-revision":
        write_set_value = json.loads(arguments.write_set.read_text(encoding="utf-8"))
        if not isinstance(write_set_value, list):
            raise ValueError("--write-set must contain a JSON array")
        return admit_define_revision(
            state,
            critic_binding=_object(arguments.critic_binding),
            write_set=write_set_value,
        )
    if arguments.operation == "freeze-candidate":
        return freeze_candidate(
            state,
            attempt_id=arguments.attempt_id,
            frozen_commit=arguments.frozen_commit,
            frozen_tree=arguments.frozen_tree,
            sealed_manifest=arguments.sealed_manifest,
            sealed_manifest_identity=arguments.sealed_manifest_identity,
            sealed_surface_identity=arguments.sealed_surface_identity,
        )
    if arguments.operation == "finalize-assurance":
        return finalize_assurance(state, role=arguments.role, completed_binding=_object(arguments.binding))
    if arguments.operation == "resume-execute":
        return resume_execute(state, new_attempt_id=arguments.attempt_id)
    if arguments.operation == "reporting-only":
        return reporting_only(
            state,
            blocker_report=arguments.blocker_report,
            blocker_identity=arguments.blocker_identity,
            reason=arguments.reason,
        )
    raise ValueError("unsupported lifecycle operation")


def main() -> int:
    arguments = _parser().parse_args()
    root, state_path = _authority_state()
    if arguments.operation == "recover-inactive":
        verify_live_package(root)
        recover_inactive(
            state_path,
            _object(arguments.template),
            active_authority_known=False,
            expected_template_identity=arguments.template_identity,
        )
        return 0
    state = _object(state_path)
    if arguments.operation == "open":
        binding = _verify_open_authority(root, arguments)
        updated = open_work_block(
            state,
            admission=_object(arguments.admission),
            controller_binding=binding,
            critic_binding=_object(arguments.critic_binding),
            capability=_object(arguments.capability),
        )
        atomic_write_json(state_path, updated)
        return 0
    verify_live_binding(root, state)
    if arguments.operation == "reporting-only":
        expected_record = reporting_only_record(
            state,
            blocker_report=arguments.blocker_report,
            reason=arguments.reason,
        )
        _verify_blocker_report(
            root,
            arguments.blocker_report,
            arguments.blocker_identity,
            expected_record,
        )
    updated = transition(arguments, state)
    atomic_write_json(state_path, updated)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
