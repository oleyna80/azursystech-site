from __future__ import annotations

import copy
import datetime as dt
import hashlib
import tempfile
import unittest
from pathlib import Path

from v1.atomic import atomic_write_bytes
from v1.assurance_gate import require_success_terminal
from v1.canonical import canonical_json_bytes
from v1.clock import fixed_clock
from v1.cli import _verify_blocker_report
from v1.errors import DurabilityUncertain, TransitionDenied, ValidationError
from v1.lifecycle import (
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
from v1.recovery import CANONICAL_INACTIVE_TEMPLATE

from .support import (
    NOW,
    assurance_binding,
    active_state,
    capability,
    controller_binding,
    dispatch,
    frozen_state,
    role_binding,
    ROOT,
    WB,
    BRANCH,
    DEFINE,
)


class LifecycleTests(unittest.TestCase):
    def test_open_requires_complete_canonical_inactive_template(self) -> None:
        near_inactive = copy.deepcopy(CANONICAL_INACTIVE_TEMPLATE)
        near_inactive.pop("define_history")
        admission = {
            "work_block_id": WB,
            "repository_root": ROOT,
            "subject_branch": BRANCH,
            "original_baseline": "0" * 40,
            "define_revision": "define-v1",
            "define_identity": DEFINE,
            "write_set": ["src/**"],
        }
        with self.assertRaises(TransitionDenied):
            open_work_block(
                near_inactive,
                admission=admission,
                controller_binding=controller_binding(),
                critic_binding=role_binding("critic", "APPROVE"),
                capability=capability(),
                clock=fixed_clock(NOW),
            )

    def test_old_critic_is_valid_provenance(self) -> None:
        state = active_state(critic_instant=NOW - dt.timedelta(days=30))
        self.assertEqual(state["critic"]["result"], "APPROVE")

    def test_expired_and_future_capability_deny_new_dispatch(self) -> None:
        state = frozen_state()
        state["capability"] = capability(instant=NOW - dt.timedelta(hours=24, seconds=1))
        with self.assertRaises(TransitionDenied):
            record_role_dispatch(state, dispatch=dispatch("reviewer"), clock=fixed_clock(NOW))
        state["capability"] = capability(instant=NOW + dt.timedelta(minutes=6))
        with self.assertRaises(TransitionDenied):
            record_role_dispatch(state, dispatch=dispatch("reviewer"), clock=fixed_clock(NOW))

    def test_capability_exact_24_hour_boundary_allows_new_dispatch(self) -> None:
        state = frozen_state()
        state["capability"] = capability(instant=NOW - dt.timedelta(hours=24))
        dispatched = record_role_dispatch(
            state, dispatch=dispatch("reviewer"), clock=fixed_clock(NOW)
        )
        self.assertEqual(dispatched["dispatch_history"][-1]["role"], "reviewer")

    def test_capability_requires_complete_runtime_tuple_and_digest(self) -> None:
        for missing in ("context_id_source", "adapter_version", "evidence_identity"):
            incomplete = capability()
            incomplete.pop(missing)
            with self.subTest(missing=missing), self.assertRaises(ValidationError):
                refresh_capability(active_state(), incomplete, clock=fixed_clock(NOW))
        malformed = capability()
        malformed["evidence_identity"] = "sha256:not-a-digest"
        with self.assertRaises(ValidationError):
            refresh_capability(active_state(), malformed, clock=fixed_clock(NOW))

    def test_refresh_preserves_authority_and_history(self) -> None:
        state = active_state()
        before = copy.deepcopy(state)
        refreshed = refresh_capability(
            state,
            capability(instant=NOW + dt.timedelta(hours=1), suffix="new"),
            clock=fixed_clock(NOW + dt.timedelta(hours=1)),
        )
        for key in ("work_block_id", "original_baseline", "controller_binding", "define", "critic"):
            self.assertEqual(refreshed[key], before[key])
        self.assertEqual(refreshed["capability_history"], [before["capability"]])
        self.assertEqual(state, before)

    def test_dispatch_replay_is_denied(self) -> None:
        state = record_role_dispatch(
            frozen_state(), dispatch=dispatch("reviewer"), clock=fixed_clock(NOW)
        )
        with self.assertRaises(TransitionDenied):
            record_role_dispatch(state, dispatch=dispatch("reviewer"), clock=fixed_clock(NOW))

    def test_dispatch_requires_role_phase_and_pending_slot(self) -> None:
        with self.assertRaises(TransitionDenied):
            record_role_dispatch(
                active_state(), dispatch=dispatch("reviewer"), clock=fixed_clock(NOW)
            )
        with self.assertRaises(TransitionDenied):
            record_role_dispatch(
                frozen_state(), dispatch=dispatch("critic"), clock=fixed_clock(NOW)
            )
        completed = frozen_state()
        completed["assurance"]["reviewer"]["status"] = "BLOCKED"
        completed["assurance"]["reviewer"]["result"] = "CHANGES_REQUIRED"
        with self.assertRaises(TransitionDenied):
            record_role_dispatch(
                completed, dispatch=dispatch("reviewer"), clock=fixed_clock(NOW)
            )

    def test_completed_negative_assurance_records_after_capability_expiry(self) -> None:
        state = record_role_dispatch(
            frozen_state(), dispatch=dispatch("reviewer"), clock=fixed_clock(NOW)
        )
        state["capability"] = capability(instant=NOW - dt.timedelta(days=5), suffix="stale")
        updated = finalize_assurance(
            state,
            role="reviewer",
            completed_binding=assurance_binding("reviewer", "CHANGES_REQUIRED"),
            clock=fixed_clock(NOW + dt.timedelta(days=5)),
        )
        self.assertEqual(updated["assurance"]["reviewer"]["result"], "CHANGES_REQUIRED")

    def test_completed_blocked_verifier_records_after_capability_expiry(self) -> None:
        state = record_role_dispatch(
            frozen_state(), dispatch=dispatch("reviewer"), clock=fixed_clock(NOW)
        )
        state = finalize_assurance(
            state,
            role="reviewer",
            completed_binding=assurance_binding("reviewer", "READY"),
            clock=fixed_clock(NOW),
        )
        state = record_role_dispatch(
            state, dispatch=dispatch("verifier"), clock=fixed_clock(NOW)
        )
        state["capability"] = capability(instant=NOW - dt.timedelta(days=5), suffix="stale")
        updated = finalize_assurance(
            state,
            role="verifier",
            completed_binding=assurance_binding("verifier", "BLOCKED"),
            clock=fixed_clock(NOW + dt.timedelta(days=5)),
        )
        self.assertEqual(updated["assurance"]["verifier"]["result"], "BLOCKED")

    def test_resume_requires_new_attempt_and_invalidates_old_assurance(self) -> None:
        state = record_role_dispatch(
            frozen_state(), dispatch=dispatch("reviewer"), clock=fixed_clock(NOW)
        )
        state = finalize_assurance(
            state,
            role="reviewer",
            completed_binding=assurance_binding("reviewer", "CHANGES_REQUIRED"),
            clock=fixed_clock(NOW),
        )
        with self.assertRaises(TransitionDenied):
            resume_execute(state, new_attempt_id="attempt-1", clock=fixed_clock(NOW))
        rework = resume_execute(state, new_attempt_id="attempt-2", clock=fixed_clock(NOW))
        self.assertEqual(rework["candidate"]["attempt_id"], "attempt-2")
        for name, required in (
            ("reviewer", True),
            ("verifier", True),
            ("evaluation", False),
            ("drift", False),
        ):
            self.assertEqual(rework["assurance"][name]["status"], "PENDING")
            self.assertEqual(rework["assurance"][name]["candidate_attempt_id"], "attempt-2")
            self.assertIs(rework["assurance"][name]["required"], required)
        self.assertEqual(rework["assurance_history"][0]["reviewer"]["candidate_attempt_id"], "attempt-1")

    def test_resume_rejects_non_role_negative_and_historical_attempt_reuse(self) -> None:
        state = frozen_state()
        state["assurance"]["evaluation"] = {
            "required": False,
            "status": "BLOCKED",
            "result": "BLOCKED",
            "candidate_attempt_id": "attempt-1",
        }
        with self.assertRaises(TransitionDenied):
            resume_execute(state, new_attempt_id="attempt-2", clock=fixed_clock(NOW))

        state = record_role_dispatch(
            frozen_state(), dispatch=dispatch("reviewer"), clock=fixed_clock(NOW)
        )
        state = finalize_assurance(
            state,
            role="reviewer",
            completed_binding=assurance_binding("reviewer", "CHANGES_REQUIRED"),
            clock=fixed_clock(NOW),
        )
        state["candidate_history"] = [{"attempt_id": "attempt-old", "status": "FROZEN"}]
        with self.assertRaises(TransitionDenied):
            resume_execute(state, new_attempt_id="attempt-old", clock=fixed_clock(NOW))

    def test_repeated_candidate_bytes_do_not_authorize_report_replay(self) -> None:
        state = record_role_dispatch(
            frozen_state(), dispatch=dispatch("reviewer"), clock=fixed_clock(NOW)
        )
        old_report = assurance_binding("reviewer", "CHANGES_REQUIRED")
        state = finalize_assurance(
            state,
            role="reviewer",
            completed_binding=old_report,
            clock=fixed_clock(NOW),
        )
        old_candidate = copy.deepcopy(state["candidate"])
        state = resume_execute(state, new_attempt_id="attempt-2", clock=fixed_clock(NOW))
        state = freeze_candidate(
            state,
            attempt_id="attempt-2",
            frozen_commit=old_candidate["frozen_commit"],
            frozen_tree=old_candidate["frozen_tree"],
            sealed_manifest=old_candidate["sealed_manifest"],
            sealed_manifest_identity=old_candidate["sealed_manifest_identity"],
            sealed_surface_identity=old_candidate["sealed_surface_identity"],
        )
        state = record_role_dispatch(
            state,
            dispatch=dispatch("reviewer", suffix="reviewer-2"),
            clock=fixed_clock(NOW),
        )
        with self.assertRaises(ValidationError):
            finalize_assurance(
                state,
                role="reviewer",
                completed_binding=old_report,
                clock=fixed_clock(NOW),
            )

    def test_freeze_binds_exact_editing_attempt_and_rejects_history_reuse(self) -> None:
        state = active_state()
        state["candidate"] = {"attempt_id": "attempt-2", "status": "EDITING"}
        arguments = {
            "attempt_id": "attempt-2",
            "frozen_commit": "6" * 40,
            "frozen_tree": "7" * 40,
            "sealed_manifest": "manifest.json",
            "sealed_manifest_identity": "sha256:" + "8" * 64,
            "sealed_surface_identity": "sealed-surface-sha256-v1:" + "9" * 64,
        }
        frozen = freeze_candidate(state, **arguments)
        self.assertEqual(frozen["candidate"]["attempt_id"], "attempt-2")
        mismatch = active_state()
        mismatch["candidate"] = {"attempt_id": "attempt-3", "status": "EDITING"}
        with self.assertRaises(TransitionDenied):
            freeze_candidate(mismatch, **arguments)
        historical = active_state()
        historical["candidate_history"] = [{"attempt_id": "attempt-2", "status": "FROZEN"}]
        with self.assertRaises(TransitionDenied):
            freeze_candidate(historical, **arguments)

    def test_define_revision_preserves_fixed_authority_and_invalidates_candidate(self) -> None:
        state = frozen_state()
        revised = begin_define_revision(
            state, new_revision="define-v2", proposed_identity="sha256:" + "b" * 64
        )
        for key in ("work_block_id", "repository_root", "subject_branch", "original_baseline", "controller_binding"):
            self.assertEqual(revised[key], state[key])
        self.assertIsNone(revised["critic"])
        self.assertIsNone(revised["candidate"])
        self.assertIsNone(revised["assurance"])
        self.assertEqual(revised["write_gate"]["status"], "BLOCKED")

    def test_revision_admission_requires_native_critic_topology(self) -> None:
        revised = begin_define_revision(
            frozen_state(), new_revision="define-v2", proposed_identity="sha256:" + "b" * 64
        )
        critic_binding = role_binding("critic", "APPROVE", suffix="revision")
        critic_binding["define_identity"] = revised["define"]["identity"]
        critic_binding["isolation"] = "shared-context"
        with self.assertRaises(TransitionDenied):
            admit_define_revision(
                revised,
                critic_binding=critic_binding,
                write_set=["src/**"],
                clock=fixed_clock(NOW),
            )

    def test_revision_admission_requires_one_exact_recorded_dispatch(self) -> None:
        revised = begin_define_revision(
            frozen_state(), new_revision="define-v2", proposed_identity="sha256:" + "b" * 64
        )
        critic_binding = role_binding("critic", "APPROVE", suffix="revision")
        critic_binding["define_identity"] = revised["define"]["identity"]
        with self.assertRaises(TransitionDenied):
            admit_define_revision(
                revised,
                critic_binding=critic_binding,
                write_set=["src/**"],
                clock=fixed_clock(NOW),
            )
        dispatched = record_role_dispatch(
            revised,
            dispatch=dispatch("critic", suffix="revision"),
            clock=fixed_clock(NOW),
        )
        admitted = admit_define_revision(
            dispatched,
            critic_binding=critic_binding,
            write_set=["src/**"],
            clock=fixed_clock(NOW),
        )
        self.assertEqual(admitted["define"]["status"], "ADMITTED")
        mismatched = copy.deepcopy(critic_binding)
        mismatched["adapter_version"] = "2"
        with self.assertRaises(TransitionDenied):
            admit_define_revision(
                dispatched,
                critic_binding=mismatched,
                write_set=["src/**"],
                clock=fixed_clock(NOW),
            )

    def test_old_define_critic_cannot_be_replayed_into_revision(self) -> None:
        original = frozen_state()
        old_critic = copy.deepcopy(original["critic"])
        revised = begin_define_revision(
            original, new_revision="define-v2", proposed_identity="sha256:" + "b" * 64
        )
        revised = record_role_dispatch(
            revised,
            dispatch=dispatch("critic", suffix="revision"),
            clock=fixed_clock(NOW),
        )
        with self.assertRaises(ValidationError):
            admit_define_revision(
                revised,
                critic_binding=old_critic,
                write_set=["src/**"],
                clock=fixed_clock(NOW),
            )

    def test_reporting_only_resolves_pending_without_success_claims(self) -> None:
        state = frozen_state()
        state["assurance"]["reviewer"] = {
            "required": True,
            "status": "BLOCKED",
            "result": "CHANGES_REQUIRED",
            "candidate_attempt_id": "attempt-1",
        }
        record = reporting_only_record(
            state,
            blocker_report="docs/reports/blocker.md",
            reason="upstream blocker",
        )
        self.assertEqual(record["resolved_assurance"]["reviewer"]["result"], "CHANGES_REQUIRED")
        self.assertEqual(record["resolved_assurance"]["verifier"]["result"], "UNVERIFIED")
        self.assertEqual(record["resolved_assurance"]["evaluation"]["result"], "SKIPPED")
        self.assertEqual(record["resolved_assurance"]["drift"]["result"], "SKIPPED")
        self.assertFalse(record["terminal_authority"]["publication_ready"])
        self.assertEqual(record["authority_snapshot"], state)

        inactive = reporting_only(
            state,
            blocker_report="docs/reports/blocker.md",
            blocker_identity="sha256:" + "c" * 64,
            reason="upstream blocker",
        )
        self.assertEqual(inactive, CANONICAL_INACTIVE_TEMPLATE)

        with self.assertRaises(ValidationError):
            reporting_only(
                state,
                blocker_report="docs/reports/blocker.md",
                blocker_identity="sha256:not-a-digest",
                reason="upstream blocker",
            )

    def test_reporting_only_preserves_ready_reviewer_and_blocked_verifier(self) -> None:
        state = record_role_dispatch(
            frozen_state(), dispatch=dispatch("reviewer"), clock=fixed_clock(NOW)
        )
        state = finalize_assurance(
            state,
            role="reviewer",
            completed_binding=assurance_binding("reviewer", "READY"),
            clock=fixed_clock(NOW),
        )
        state = record_role_dispatch(
            state, dispatch=dispatch("verifier"), clock=fixed_clock(NOW)
        )
        state = finalize_assurance(
            state,
            role="verifier",
            completed_binding=assurance_binding("verifier", "BLOCKED"),
            clock=fixed_clock(NOW),
        )
        record = reporting_only_record(
            state,
            blocker_report="docs/reports/verifier-blocker.json",
            reason="verifier blocked",
        )
        self.assertEqual(record["resolved_assurance"]["reviewer"]["result"], "READY")
        self.assertEqual(record["resolved_assurance"]["verifier"]["result"], "BLOCKED")
        self.assertEqual(record["resolved_assurance"]["evaluation"]["result"], "SKIPPED")
        self.assertEqual(record["resolved_assurance"]["drift"]["result"], "SKIPPED")
        self.assertFalse(record["terminal_authority"]["success"])

    def test_reporting_only_cli_requires_exact_deterministic_record(self) -> None:
        state = frozen_state()
        report = "docs/reports/blocker.json"
        record = reporting_only_record(state, blocker_report=report, reason="upstream blocker")
        payload = canonical_json_bytes(record)
        identity = f"sha256:{hashlib.sha256(payload).hexdigest()}"
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            target = root / report
            target.parent.mkdir(parents=True)
            target.write_bytes(payload)
            _verify_blocker_report(root, report, identity, record)

            tampered = copy.deepcopy(record)
            tampered["result"] = "READY"
            tampered_payload = canonical_json_bytes(tampered)
            target.write_bytes(tampered_payload)
            with self.assertRaises(TransitionDenied):
                _verify_blocker_report(
                    root,
                    report,
                    f"sha256:{hashlib.sha256(tampered_payload).hexdigest()}",
                    record,
                )

            target.write_bytes(payload)
            with self.assertRaises(TransitionDenied):
                _verify_blocker_report(root, report, "sha256:" + "0" * 64, record)

    def test_assurance_finalization_requires_assure_phase_frozen_candidate_and_pending_slot(self) -> None:
        state = record_role_dispatch(
            frozen_state(), dispatch=dispatch("reviewer"), clock=fixed_clock(NOW)
        )
        wrong_phase = copy.deepcopy(state)
        wrong_phase["lifecycle_phase"] = "Execute"
        with self.assertRaises(TransitionDenied):
            finalize_assurance(
                wrong_phase,
                role="reviewer",
                completed_binding=assurance_binding("reviewer", "READY"),
                clock=fixed_clock(NOW),
            )
        not_frozen = copy.deepcopy(state)
        not_frozen["candidate"]["status"] = "EDITING"
        with self.assertRaises(TransitionDenied):
            finalize_assurance(
                not_frozen,
                role="reviewer",
                completed_binding=assurance_binding("reviewer", "READY"),
                clock=fixed_clock(NOW),
            )
        completed_slot = copy.deepcopy(state)
        completed_slot["assurance"]["reviewer"]["status"] = "BLOCKED"
        with self.assertRaises(TransitionDenied):
            finalize_assurance(
                completed_slot,
                role="reviewer",
                completed_binding=assurance_binding("reviewer", "CHANGES_REQUIRED"),
                clock=fixed_clock(NOW),
            )

    def test_atomic_failures_have_distinct_outcomes(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            target = Path(directory) / "state.json"
            target.write_bytes(b"old")

            def before() -> None:
                raise RuntimeError("pre-replace")

            with self.assertRaises(RuntimeError):
                atomic_write_bytes(target, b"new", before_replace=before)
            self.assertEqual(target.read_bytes(), b"old")

            def after() -> None:
                raise RuntimeError("post-replace")

            with self.assertRaises(DurabilityUncertain):
                atomic_write_bytes(target, b"new", after_replace=after)
            self.assertEqual(target.read_bytes(), b"new")

    def test_report_digest_must_be_lower_hex(self) -> None:
        state = record_role_dispatch(
            frozen_state(), dispatch=dispatch("reviewer"), clock=fixed_clock(NOW)
        )
        binding = assurance_binding("reviewer", "READY")
        binding["report_identity"] = "sha256:" + "G" * 64
        with self.assertRaises(ValidationError):
            finalize_assurance(
                state,
                role="reviewer",
                completed_binding=binding,
                clock=fixed_clock(NOW),
            )

    def test_assurance_requires_native_topology_and_exact_dispatch_tuple(self) -> None:
        state = record_role_dispatch(
            frozen_state(), dispatch=dispatch("reviewer"), clock=fixed_clock(NOW)
        )
        non_native = assurance_binding("reviewer", "READY")
        non_native["isolation"] = "shared-context"
        with self.assertRaises(TransitionDenied):
            finalize_assurance(
                state,
                role="reviewer",
                completed_binding=non_native,
                clock=fixed_clock(NOW),
            )
        mismatched = assurance_binding("reviewer", "READY")
        mismatched["launch_mechanism"] = "different-launcher"
        with self.assertRaises(TransitionDenied):
            finalize_assurance(
                state,
                role="reviewer",
                completed_binding=mismatched,
                clock=fixed_clock(NOW),
            )

    def test_future_completed_role_timestamp_fails_closed(self) -> None:
        state = record_role_dispatch(
            frozen_state(), dispatch=dispatch("reviewer"), clock=fixed_clock(NOW)
        )
        future = assurance_binding(
            "reviewer", "CHANGES_REQUIRED", instant=NOW + dt.timedelta(minutes=6)
        )
        with self.assertRaises(ValidationError):
            finalize_assurance(
                state,
                role="reviewer",
                completed_binding=future,
                clock=fixed_clock(NOW),
            )

    def test_success_terminal_requires_exact_candidate_dispatch_and_provenance(self) -> None:
        state = record_role_dispatch(
            frozen_state(), dispatch=dispatch("reviewer"), clock=fixed_clock(NOW)
        )
        state = finalize_assurance(
            state,
            role="reviewer",
            completed_binding=assurance_binding("reviewer", "READY"),
            clock=fixed_clock(NOW),
        )
        state = record_role_dispatch(
            state, dispatch=dispatch("verifier"), clock=fixed_clock(NOW)
        )
        state = finalize_assurance(
            state,
            role="verifier",
            completed_binding=assurance_binding("verifier", "READY"),
            clock=fixed_clock(NOW),
        )
        require_success_terminal(state, clock=fixed_clock(NOW + dt.timedelta(days=30)))
        tampered = copy.deepcopy(state)
        tampered["assurance"]["verifier"]["sealed_surface_identity"] = (
            "sealed-surface-sha256-v1:" + "0" * 64
        )
        with self.assertRaises(TransitionDenied):
            require_success_terminal(tampered, clock=fixed_clock(NOW))


if __name__ == "__main__":
    unittest.main()
