import { runIntakeDryRun } from "@/lib/intake/runtime";
import type { IntakeConversationState, IntakeDecision } from "@/lib/intake/types";
import {
  normalizeTelegramDryRunUpdate,
  type TelegramAdapterResult,
  type TelegramDryRunUpdate,
} from "@/lib/telegram/intake-adapter";

export type TelegramIntakeDryRunResult =
  | {
      ok: true;
      decision: IntakeDecision;
    }
  | {
      ok: false;
      adapter: TelegramAdapterResult;
    };

export function runTelegramIntakeDryRun(
  update: TelegramDryRunUpdate,
  state?: IntakeConversationState,
): TelegramIntakeDryRunResult {
  const adapter = normalizeTelegramDryRunUpdate(update);

  if (!adapter.ok) {
    return {
      ok: false,
      adapter,
    };
  }

  return {
    ok: true,
    decision: runIntakeDryRun(adapter.message, state),
  };
}
