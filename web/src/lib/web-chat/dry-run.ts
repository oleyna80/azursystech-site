import { runIntakeDryRun } from "@/lib/intake/runtime";
import type { IntakeDecision } from "@/lib/intake/types";
import {
  normalizeWebChatDryRunMessage,
  type WebChatAdapterResult,
  type WebChatDryRunInput,
} from "@/lib/web-chat/intake-adapter";

export type WebChatIntakeDryRunResult =
  | {
      ok: true;
      decision: IntakeDecision;
    }
  | {
      ok: false;
      adapter: WebChatAdapterResult;
    };

export function runWebChatIntakeDryRun(
  input: WebChatDryRunInput,
): WebChatIntakeDryRunResult {
  const adapter = normalizeWebChatDryRunMessage(input);

  if (!adapter.ok) {
    return {
      ok: false,
      adapter,
    };
  }

  return {
    ok: true,
    decision: runIntakeDryRun(adapter.message, adapter.state),
  };
}
