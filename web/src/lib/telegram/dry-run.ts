import { loadIntakeConversationState, persistIntakeDecision } from "@/lib/intake/storage";
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
      persistence: "unavailable";
    }
  | {
      ok: false;
      adapter: TelegramAdapterResult;
    };

export async function runTelegramIntakeDryRun(
  update: TelegramDryRunUpdate,
  state?: IntakeConversationState,
): Promise<TelegramIntakeDryRunResult> {
  const adapter = normalizeTelegramDryRunUpdate(update);

  if (!adapter.ok) {
    return {
      ok: false,
      adapter,
    };
  }

  let conversationState: IntakeConversationState | undefined;
  try {
    conversationState = await loadIntakeConversationState(
      {
        channel: adapter.message.channel,
        conversationKey: adapter.message.conversationKey,
      },
      state,
    );
  } catch {
    return {
      ok: false,
      persistence: "unavailable",
    };
  }

  const decision = runIntakeDryRun(adapter.message, conversationState);

  try {
    await persistIntakeDecision({
      message: adapter.message,
      decision,
      previousState: conversationState,
      rawProviderPayload: update as Record<string, unknown>,
    });
  } catch {
    return {
      ok: false,
      persistence: "unavailable",
    };
  }

  return {
    ok: true,
    decision,
  };
}
