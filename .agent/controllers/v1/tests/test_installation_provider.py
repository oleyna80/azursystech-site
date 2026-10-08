import json
import os
import subprocess
import tempfile
import unittest
from pathlib import Path
from unittest import mock

from v1.errors import StopAndPreserve, ValidationError
from v1.installation import (
    CONFIG_RELATIVE,
    config_path,
    load,
    write_bootstrap_config,
)
from v1.providers import GitHubCliBranchProtectionResolver


class InstallationProviderTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name) / "repo"
        self.root.mkdir()
        subprocess.run(["git", "-C", str(self.root), "init", "-q", "-b", "main"], check=True)
        self.registry = Path(self.temp.name) / "trusted" / "registry.sqlite3"
        self.registry.parent.mkdir()
        self.path = write_bootstrap_config(
            self.root,
            repository="fixture/repo",
            registry_path=self.registry,
        )

    def tearDown(self):
        self.temp.cleanup()

    def test_valid_config_is_git_common_dir_bound_and_strict(self):
        config = load(self.root)
        self.assertEqual(config.repository, "fixture/repo")
        self.assertEqual(config.registry_path, self.registry)
        self.assertEqual(config.remote, "origin")
        self.assertEqual(config.provider_kind, "github-cli")
        self.assertEqual(config_path(self.root), self.root / ".git" / CONFIG_RELATIVE)
        self.assertEqual(self.path.stat().st_mode & 0o777, 0o600)

    def test_environment_and_subject_tree_cannot_override_authority_config(self):
        subject = self.root / "installation.json"
        subject.write_text(
            json.dumps({
                "schema_version": 1,
                "repository": "evil/repo",
                "registry_path": str(self.root / "evil.sqlite3"),
                "remote": "evil",
                "branch_protection_provider": {"kind": "github-cli"},
            }),
            encoding="utf-8",
        )
        with mock.patch.dict(
            os.environ,
            {
                "AZURSYSTECH_REPOSITORY": "evil/repo",
                "AZURSYSTECH_REGISTRY": str(self.root / "evil.sqlite3"),
            },
        ):
            config = load(self.root)
        self.assertEqual(config.repository, "fixture/repo")
        self.assertEqual(config.registry_path, self.registry)

    def test_symlink_hardlink_and_broad_permissions_fail_closed(self):
        original = self.path.read_bytes()

        self.path.unlink()
        target = Path(self.temp.name) / "outside-config.json"
        target.write_bytes(original)
        target.chmod(0o600)
        self.path.symlink_to(target)
        with self.assertRaises(StopAndPreserve):
            load(self.root)

        self.path.unlink()
        target2 = Path(self.temp.name) / "outside-hardlink.json"
        target2.write_bytes(original)
        target2.chmod(0o600)
        os.link(target2, self.path)
        with self.assertRaises(StopAndPreserve):
            load(self.root)

        self.path.unlink()
        self.path.write_bytes(original)
        self.path.chmod(0o644)
        with self.assertRaises(StopAndPreserve):
            load(self.root)

    def test_unknown_config_fields_fail_closed(self):
        raw = json.loads(self.path.read_text(encoding="utf-8"))
        raw["override"] = "no"
        self.path.write_text(json.dumps(raw), encoding="utf-8")
        self.path.chmod(0o600)
        with self.assertRaises(ValidationError):
            load(self.root)

    def _classic_payload(self, patterns=(), *, errors=None):
        payload = {
            "data": {
                "repository": {
                    "branchProtectionRules": {
                        "nodes": [{"pattern": value} for value in patterns],
                        "pageInfo": {"hasNextPage": False},
                    }
                }
            }
        }
        if errors is not None:
            payload["errors"] = errors
        return subprocess.CompletedProcess(
            ["gh"], 0,
            stdout=json.dumps(payload) + "\n",
            stderr="",
        )

    def test_branch_protection_provider_allows_absent_branch_with_no_applicable_rules(self):
        config = load(self.root)
        resolver = GitHubCliBranchProtectionResolver(config)
        rules = subprocess.CompletedProcess(["gh"], 0, stdout="[]\n", stderr="")
        with mock.patch(
            "v1.providers.subprocess.run",
            side_effect=[rules, self._classic_payload(("main",))],
        ) as call:
            self.assertFalse(resolver("origin", "feat/example"))
        commands = [item.args[0] for item in call.call_args_list]
        self.assertIn(
            "repos/fixture/repo/rules/branches/feat%2Fexample",
            commands[0],
        )
        self.assertEqual(commands[1][:3], ["gh", "api", "graphql"])

    def test_branch_protection_provider_denies_applicable_ruleset(self):
        config = load(self.root)
        resolver = GitHubCliBranchProtectionResolver(config)
        rules = subprocess.CompletedProcess(
            ["gh"], 0, stdout='[{"type":"creation"}]\n', stderr=""
        )
        with mock.patch("v1.providers.subprocess.run", return_value=rules):
            self.assertTrue(resolver("origin", "feat/example"))

    def test_branch_protection_provider_denies_matching_classic_rule(self):
        config = load(self.root)
        resolver = GitHubCliBranchProtectionResolver(config)
        rules = subprocess.CompletedProcess(["gh"], 0, stdout="[]\n", stderr="")
        with mock.patch(
            "v1.providers.subprocess.run",
            side_effect=[rules, self._classic_payload(("feat/*",))],
        ):
            self.assertTrue(resolver("origin", "feat/example"))

    def test_branch_protection_provider_fails_closed_on_unsupported_classic_pattern(self):
        config = load(self.root)
        resolver = GitHubCliBranchProtectionResolver(config)
        rules = subprocess.CompletedProcess(["gh"], 0, stdout="[]\n", stderr="")
        with mock.patch(
            "v1.providers.subprocess.run",
            side_effect=[rules, self._classic_payload(("feat/**",))],
        ):
            self.assertTrue(resolver("origin", "feat/example"))

    def test_branch_protection_provider_rejects_json_array_graphql_payload(self):
        config = load(self.root)
        resolver = GitHubCliBranchProtectionResolver(config)
        rules = subprocess.CompletedProcess(["gh"], 0, stdout="[]\n", stderr="")
        malformed_graphql = subprocess.CompletedProcess(
            ["gh"], 0, stdout="[]\n", stderr=""
        )
        with mock.patch(
            "v1.providers.subprocess.run",
            side_effect=[rules, malformed_graphql],
        ):
            with self.assertRaises(StopAndPreserve):
                resolver("origin", "feat/example")

    def test_branch_protection_provider_rejects_graphql_error_envelope(self):
        config = load(self.root)
        resolver = GitHubCliBranchProtectionResolver(config)
        rules = subprocess.CompletedProcess(["gh"], 0, stdout="[]\n", stderr="")
        graphql = self._classic_payload(
            (),
            errors=[
                {
                    "type": "FORBIDDEN",
                    "message": "Resource not accessible by integration",
                }
            ],
        )
        with mock.patch(
            "v1.providers.subprocess.run",
            side_effect=[rules, graphql],
        ):
            with self.assertRaises(StopAndPreserve):
                resolver("origin", "feat/example")

    def test_branch_protection_provider_accepts_explicit_feature_unavailable_as_no_rulesets(self):
        config = load(self.root)
        resolver = GitHubCliBranchProtectionResolver(config)
        unavailable = subprocess.CalledProcessError(
            1,
            ["gh"],
            stderr=(
                "gh: Upgrade to GitHub Pro or make this repository public "
                "to enable this feature (HTTP 403)"
            ),
        )
        with mock.patch(
            "v1.providers.subprocess.run",
            side_effect=[unavailable, self._classic_payload(())],
        ):
            self.assertFalse(resolver("origin", "feat/example"))

    def test_branch_protection_provider_fails_closed_on_unknown_cli_failure(self):
        config = load(self.root)
        resolver = GitHubCliBranchProtectionResolver(config)
        with mock.patch(
            "v1.providers.subprocess.run",
            side_effect=subprocess.CalledProcessError(
                1, ["gh"], stderr="gh: authentication failed (HTTP 401)"
            ),
        ):
            with self.assertRaises(StopAndPreserve):
                resolver("origin", "feat/example")


if __name__ == "__main__":
    unittest.main()
