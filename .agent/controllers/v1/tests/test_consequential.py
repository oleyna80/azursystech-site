import unittest

from v1.consequential import evaluate_command


class ConsequentialGuardTests(unittest.TestCase):
    def test_guard_denies_external_consequential_operations(self):
        for command in (
            "git push --force origin main",
            "terraform apply",
            "kubectl delete pod production",
            "docker push example/image:latest",
            "gh pr merge 42",
            "psql prod -c 'DROP TABLE clients'",
            "rotate api secret",
            "twilio send message",
        ):
            with self.subTest(command=command):
                self.assertFalse(evaluate_command(command).allowed)

    def test_guard_does_not_own_lifecycle_or_normal_subject_publication(self):
        for command in (
            "python scripts/sdlc-v1-bridge.py trusted-open --payload '{}'",
            "python scripts/sdlc-v1-bridge.py trusted-publish",
            "git push origin HEAD:refs/heads/feat/example",
            "git commit -m 'implementation'",
        ):
            with self.subTest(command=command):
                result = evaluate_command(command)
                self.assertTrue(result.allowed)
                self.assertEqual(result.code, "CONSEQUENTIAL_GUARD_CLEAR")


if __name__ == "__main__":
    unittest.main()
