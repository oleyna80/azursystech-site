"""Fixture-only controller states; never reads or writes the live SSOT."""

import copy

from v1 import evidence, state

TREE = "a" * 40
CANDIDATE = "b" * 40
NOW = "2030-01-02T12:00:00+00:00"
LATER = "2030-01-02T12:01:00+00:00"
VERIFIER_AT = "2030-01-02T12:02:00+00:00"
VERIFIER_DONE = "2030-01-02T12:03:00+00:00"
SNAP = {"tree": TREE, "branch": "feat/test", "status": ""}


def opened():
    return state.open_work_block(copy.deepcopy(state.INACTIVE), work_block_id="WB-TEST",
                                 subject_branch="feat/test", subject_revision="r1",
                                 write_set=[".agent/controllers/v1/**"], controller_tree=TREE)


def capable(phase="DEFINE"):
    item = opened()
    if phase != "DEFINE":
        item = critic_approved(item)
        if phase == "ASSURE":
            item = state.freeze_candidate(item, CANDIDATE)
    return evidence.refresh_capability(item, {
        "probe_id": "probe-1", "observed_at": NOW, "status": "available",
    })


def dispatch_record(item, role, session):
    active = item["active"]
    repository = {**SNAP, "tree": active["candidate_id"] if role != "critic" else TREE}
    return {
        "work_block_id": active["work_block_id"], "role": role,
        "subject_revision": active["subject_revision"],
        "candidate_id": None if role == "critic" else active["candidate_id"],
        "session_id": session, "runtime": "codex", "isolation_method": "separate_session",
        "dispatched_at": VERIFIER_AT if role == "verifier" else NOW,
        "capability_probe_id": "probe-1",
        "capability_observed_at": NOW, "pre_repository": copy.deepcopy(repository),
        "pre_control_surface": copy.deepcopy(SNAP),
    }


def result(item, role, verdict, session):
    dispatch = dispatch_record(item, role, session)
    item = evidence.dispatch(item, dispatch)
    completed = {
        **dispatch, "verdict": verdict,
        "completed_at": VERIFIER_DONE if role == "verifier" else LATER,
        "report_path": f"reports/{session}.md", "findings": [],
        "post_repository": copy.deepcopy(dispatch["pre_repository"]),
        "post_control_surface": copy.deepcopy(SNAP),
    }
    return evidence.record_result(item, completed)


def critic_approved(item):
    item = evidence.refresh_capability(item, {
        "probe_id": "probe-1", "observed_at": NOW, "status": "available",
    })
    item = result(item, "critic", "APPROVE", "critic-1")
    return state.approve_define(item)


def assured():
    item = capable("ASSURE")
    item = result(item, "reviewer", "READY", "reviewer-1")
    item = result(item, "verifier", "READY", "verifier-1")
    return item
