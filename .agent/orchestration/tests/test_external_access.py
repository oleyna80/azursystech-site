import dataclasses
import sys
import unittest
from pathlib import Path

AGENT_ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(AGENT_ROOT))

from controllers.v1 import cli
from orchestration.external_access import (
    ExternalAccessDenied,
    ExternalImportBroker,
    ExternalImportGrant,
)
from orchestration.runner import Orchestrator, RoleResult
from orchestration.tests.support import (
    OrchestrationRepo,
    ScriptedRoles,
    SimulatedDelivery,
)


class ExternalAccessTests(unittest.TestCase):
    def setUp(self):
        self.fx = OrchestrationRepo()
        self.external = Path(self.fx.temp.name) / "old-project" / ".claude" / "skills"
        self.external.mkdir(parents=True)
        self.foo = self.external / "foo"
        self.foo.mkdir()
        (self.foo / "SKILL.md").write_text("skill foo\n", encoding="utf-8")
        (self.foo / "helper.txt").write_text("helper\n", encoding="utf-8")

    def tearDown(self):
        self.fx.cleanup()

    def _grant(self, destination_scope=(".claude/skills/**",)):
        return ExternalImportGrant.create(
            grant_id="ext-skills",
            source_root=self.external,
            destination_scope=destination_scope,
        )

    def test_direct_grant_construction_cannot_request_write_mode(self):
        with self.assertRaises(ExternalAccessDenied):
            ExternalImportGrant(
                grant_id="ext-write",
                source_root=self.external,
                destination_scope=(".claude/skills/**",),
                mode="write",
            )

    def test_read_view_lists_and_reads_without_import_api(self):
        broker = ExternalImportBroker(self.fx.root, [self._grant()])
        view = broker.read_view()
        self.assertEqual(
            view.list_files("ext-skills"),
            ("foo/SKILL.md", "foo/helper.txt"),
        )
        self.assertEqual(
            view.read_text("ext-skills", "foo/SKILL.md"),
            "skill foo\n",
        )
        self.assertFalse(hasattr(view, "import_file"))
        self.assertFalse(hasattr(view, "import_tree"))
        self.assertFalse(hasattr(view, "_broker"))

    def test_granted_external_read_succeeds_without_mutation_authority(self):
        grant = self._grant()
        broker = ExternalImportBroker(self.fx.root, [grant])
        self.assertEqual(
            broker.read_bytes("ext-skills", "foo/SKILL.md"),
            b"skill foo\n",
        )
        self.assertFalse(hasattr(broker, "write_external"))
        self.assertFalse(hasattr(broker, "delete_external"))
        self.assertEqual(
            (self.foo / "SKILL.md").read_text(encoding="utf-8"),
            "skill foo\n",
        )

    def test_ungranted_sibling_source_is_denied(self):
        sibling = Path(self.fx.temp.name) / "project-b"
        sibling.mkdir()
        secret = sibling / "secret.txt"
        secret.write_text("secret\n", encoding="utf-8")
        broker = ExternalImportBroker(self.fx.root, [self._grant()])
        with self.assertRaises(ExternalAccessDenied):
            broker.read_bytes("ext-skills", secret)

    def test_symlink_escape_outside_granted_root_is_denied(self):
        outside = Path(self.fx.temp.name) / "outside"
        outside.mkdir()
        (outside / "secret.txt").write_text("secret\n", encoding="utf-8")
        (self.external / "escape").symlink_to(outside, target_is_directory=True)
        broker = ExternalImportBroker(self.fx.root, [self._grant()])
        with self.assertRaises(ExternalAccessDenied):
            broker.read_bytes("ext-skills", "escape/secret.txt")

    def test_grant_is_frozen_and_broker_has_no_runtime_widening_api(self):
        grant = self._grant()
        with self.assertRaises(dataclasses.FrozenInstanceError):
            grant.source_root = Path("/tmp")  # type: ignore[misc]
        broker = ExternalImportBroker(self.fx.root, [grant])
        self.assertFalse(hasattr(broker, "add_grant"))
        self.assertEqual(tuple(item.grant_id for item in broker.grants()), ("ext-skills",))

    def test_recursive_import_rejects_symlink_directory_even_when_target_is_inside_grant(self):
        real = self.external / "real"
        real.mkdir()
        (real / "inside.txt").write_text("inside\n", encoding="utf-8")
        (self.external / "linked").symlink_to(real, target_is_directory=True)
        broker = ExternalImportBroker(self.fx.root, [self._grant()])
        with self.assertRaises(ExternalAccessDenied):
            broker.list_files("ext-skills")

    def test_destination_parent_symlink_escape_is_denied(self):
        outside = Path(self.fx.temp.name) / "destination-outside"
        outside.mkdir()
        link_parent = self.fx.root / ".claude"

        grant = self._grant()
        broker = ExternalImportBroker(self.fx.root, [grant])
        base = ScriptedRoles(self.fx)

        class SymlinkDestinationRoles:
            def run(inner_self, role, context):
                if role != "coder":
                    return base.run(role, context)
                link_parent.symlink_to(outside, target_is_directory=True)
                try:
                    with self.assertRaises(ExternalAccessDenied):
                        context.external_access.import_file(
                            "ext-skills",
                            "foo/SKILL.md",
                            ".claude/skills/foo/SKILL.md",
                        )
                    self.assertFalse((outside / "skills/foo/SKILL.md").exists())
                finally:
                    link_parent.unlink()
                base._coder(context)
                return RoleResult("coder", "DONE")

        runner = Orchestrator(
            self.fx.dispatcher,
            SymlinkDestinationRoles(),
            delivery_executor=SimulatedDelivery(),
            external_access=broker,
        )
        result = runner.run(
            self.fx.root,
            self.fx.request(
                "manual-owner",
                admission_id="adm-destlink001",
            ),
            self.fx.spec(implementation_write_set=("src/**", ".claude/skills/**")),
            branch_protection_resolver=lambda _remote, _branch: False,
        )
        self.assertEqual(result.status, "OWNER_DECISION_REQUIRED")
        self.assertFalse((outside / "skills/foo/SKILL.md").exists())

    def test_import_tree_reaches_only_admitted_implementation_destination(self):
        grant = self._grant()
        broker = ExternalImportBroker(self.fx.root, [grant])
        base = ScriptedRoles(self.fx)

        class ImportingRoles:
            def run(inner_self, role, context):
                if role != "coder":
                    return base.run(role, context)
                self.assertIs(context.external_access, broker)
                imported = context.external_access.import_tree(
                    "ext-skills",
                    "foo",
                    ".claude/skills/foo",
                )
                self.assertEqual(
                    imported,
                    (
                        ".claude/skills/foo/SKILL.md",
                        ".claude/skills/foo/helper.txt",
                    ),
                )
                base._commit(context, "import external skill")
                return RoleResult("coder", "DONE")

        runner = Orchestrator(
            self.fx.dispatcher,
            ImportingRoles(),
            delivery_executor=SimulatedDelivery(),
            external_access=broker,
        )
        result = runner.run(
            self.fx.root,
            self.fx.request(
                "manual-owner",
                admission_id="adm-import00001",
            ),
            self.fx.spec(
                implementation_write_set=(".claude/skills/**",),
            ),
            branch_protection_resolver=lambda _remote, _branch: False,
        )
        self.assertEqual(result.status, "OWNER_DECISION_REQUIRED")
        self.assertEqual(result.required_capability, "merge")
        self.assertEqual(
            (self.fx.root / ".claude/skills/foo/SKILL.md").read_text(
                encoding="utf-8"
            ),
            "skill foo\n",
        )
        self.assertEqual(
            (self.foo / "SKILL.md").read_text(encoding="utf-8"),
            "skill foo\n",
        )
        self.assertEqual(cli.status(self.fx.root)["lifecycle_state"], "INACTIVE")

    def test_granted_source_cannot_write_to_non_wb_destination(self):
        grant = self._grant()
        broker = ExternalImportBroker(self.fx.root, [grant])
        base = ScriptedRoles(self.fx)

        class WrongDestinationRoles:
            def run(inner_self, role, context):
                if role != "coder":
                    return base.run(role, context)
                with self.assertRaises(ExternalAccessDenied):
                    context.external_access.import_file(
                        "ext-skills",
                        "foo/SKILL.md",
                        ".claude/skills/foo/SKILL.md",
                    )
                self.assertFalse(
                    (self.fx.root / ".claude/skills/foo/SKILL.md").exists()
                )
                base._coder(context)
                return RoleResult("coder", "DONE")

        runner = Orchestrator(
            self.fx.dispatcher,
            WrongDestinationRoles(),
            delivery_executor=SimulatedDelivery(),
            external_access=broker,
        )
        result = runner.run(
            self.fx.root,
            self.fx.request(
                "manual-owner",
                admission_id="adm-nonwb00001",
            ),
            self.fx.spec(implementation_write_set=("src/**",)),
            branch_protection_resolver=lambda _remote, _branch: False,
        )
        self.assertEqual(result.status, "OWNER_DECISION_REQUIRED")

    def test_wb_write_scope_does_not_override_grant_destination_scope(self):
        grant = self._grant(destination_scope=(".claude/skills/**",))
        broker = ExternalImportBroker(self.fx.root, [grant])
        base = ScriptedRoles(self.fx)

        class GrantScopeRoles:
            def run(inner_self, role, context):
                if role != "coder":
                    return base.run(role, context)
                with self.assertRaises(ExternalAccessDenied):
                    context.external_access.import_file(
                        "ext-skills",
                        "foo/SKILL.md",
                        "src/copied-skill.md",
                    )
                base._coder(context)
                return RoleResult("coder", "DONE")

        runner = Orchestrator(
            self.fx.dispatcher,
            GrantScopeRoles(),
            delivery_executor=SimulatedDelivery(),
            external_access=broker,
        )
        result = runner.run(
            self.fx.root,
            self.fx.request(
                "manual-owner",
                admission_id="adm-grantscope1",
            ),
            self.fx.spec(
                implementation_write_set=("src/**", ".claude/skills/**"),
            ),
            branch_protection_resolver=lambda _remote, _branch: False,
        )
        self.assertEqual(result.status, "OWNER_DECISION_REQUIRED")
        self.assertFalse((self.fx.root / "src/copied-skill.md").exists())

    def test_non_coder_roles_receive_read_only_external_view(self):
        broker = ExternalImportBroker(self.fx.root, [self._grant()])
        base = ScriptedRoles(self.fx)
        seen = []

        class InspectingRoles:
            def run(inner_self, role, context):
                if role in {"planner", "critic", "reviewer", "verifier", "closeout"}:
                    self.assertIsNotNone(context.external_access)
                    self.assertFalse(hasattr(context.external_access, "import_file"))
                    self.assertEqual(
                        context.external_access.read_text(
                            "ext-skills", "foo/SKILL.md"
                        ),
                        "skill foo\n",
                    )
                    seen.append(role)
                if role == "coder":
                    self.assertTrue(hasattr(context.external_access, "import_file"))
                return base.run(role, context)

        runner = Orchestrator(
            self.fx.dispatcher,
            InspectingRoles(),
            delivery_executor=SimulatedDelivery(),
            external_access=broker,
        )
        result = runner.run(
            self.fx.root,
            self.fx.request(
                "manual-owner",
                admission_id="adm-readview001",
            ),
            self.fx.spec(),
            branch_protection_resolver=lambda _remote, _branch: False,
        )
        self.assertEqual(result.status, "OWNER_DECISION_REQUIRED")
        self.assertTrue({"planner", "critic", "reviewer", "verifier", "closeout"}.issubset(seen))

    def test_external_broker_bound_to_other_worktree_is_rejected(self):
        other = OrchestrationRepo()
        try:
            broker = ExternalImportBroker(other.root, [])
            runner = Orchestrator(
                self.fx.dispatcher,
                ScriptedRoles(self.fx),
                delivery_executor=SimulatedDelivery(),
                external_access=broker,
            )
            from orchestration.runner import OrchestrationBlocked

            with self.assertRaises(OrchestrationBlocked):
                runner.run(
                    self.fx.root,
                    self.fx.request(
                        "manual-owner",
                        admission_id="adm-wrongbroker1",
                    ),
                    self.fx.spec(),
                    branch_protection_resolver=lambda _remote, _branch: False,
                )
        finally:
            other.cleanup()


if __name__ == "__main__":
    unittest.main()
