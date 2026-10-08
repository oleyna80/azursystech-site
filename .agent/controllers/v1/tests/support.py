"""Fixtures for schema-v2 controller tests."""

from __future__ import annotations

import copy
import subprocess
from pathlib import Path

from v1 import state

BASE = "1" * 40
PLAN = "2" * 40
CANDIDATE = "3" * 40
PROFILE = "4" * 40

INITIATIVE = "docs/changes/sdlc-test"
PLANNING_PATHS = [
    f"{INITIATIVE}/intent.md",
    f"{INITIATIVE}/plan.md",
    f"{INITIATIVE}/spec.md",
    f"{INITIATIVE}/work-blocks/wb-001.md",
]
IMPLEMENTATION = [".agent/controllers/v1/**"]
COORDINATION = [
    f"{INITIATIVE}/**",
    "docs/engineering-memory/**",
]


class Record:
    admission_id = "adm-0123456789abcdef"
    repository = "fixture/repo"
    trigger_class = "manual-owner"
    authority_profile_id = "human-governed"
    authority_profile_revision = PROFILE
    base_ref = "main"
    base_commit = BASE
    subject_branch = "feat/test"


class Resolver:
    def __init__(self, record=None):
        self.record = record or Record()

    def resolve(self, admission_id):
        if admission_id != self.record.admission_id:
            raise KeyError(admission_id)
        return self.record


def opened(current=None):
    return state.open_work_block(
        copy.deepcopy(state.INACTIVE if current is None else current),
        work_block_id="WB-001",
        initiative_ref=INITIATIVE,
        admission_id=Record.admission_id,
        subject_branch=Record.subject_branch,
        base_commit=BASE,
        authority_profile_id=Record.authority_profile_id,
        authority_profile_revision=PROFILE,
        planning_revision=PLAN,
        planning_paths=PLANNING_PATHS,
        implementation_write_set=IMPLEMENTATION,
        coordination_scope=COORDINATION,
    )


def execute():
    return state.critic_result(opened(), "ready")


def assure():
    return state.create_candidate(execute(), CANDIDATE)


def assured():
    item = state.reviewer_result(assure(), "ready")
    return state.verifier_result(item, "ready")


def git(root: Path, *args: str) -> str:
    return subprocess.check_output(["git", "-C", str(root), *args], text=True).strip()


def init_repo(root: Path, branch="feat/test") -> None:
    subprocess.run(["git", "-C", str(root), "init", "-q", "-b", branch], check=True)
    subprocess.run(["git", "-C", str(root), "config", "user.name", "Fixture"], check=True)
    subprocess.run(["git", "-C", str(root), "config", "user.email", "fixture@example.invalid"], check=True)


def commit_all(root: Path, message: str) -> str:
    subprocess.run(["git", "-C", str(root), "add", "-A"], check=True)
    subprocess.run(["git", "-C", str(root), "commit", "-qm", message], check=True)
    return git(root, "rev-parse", "HEAD")
