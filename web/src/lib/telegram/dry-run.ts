import { loadIntakeConversationState, persistIntakeDecision } from "@/lib/intake/storage";
import { runIntakeDryRun } from "@/lib/intake/runtime";
import type { IntakeConversationState, IntakeDecision } from "@/lib/intake/types";
import {
  normalizeTelegramDryRunUpdate,
  normalizeTelegramUpdate,
  type TelegramAdapterResult,
  type TelegramDryRunUpdate,
  type TelegramUpdate,
} from "@/lib/telegram/intake-adapter";

type TelegramAdapterErrorResult = Extract<TelegramAdapterResult, { ok: false }>;

type TelegramIntakeResult =
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
      adapter: TelegramAdapterErrorResult;
    };

export type TelegramIntakeDryRunResult = TelegramIntakeResult;
export type TelegramIntakeLiveReceiveResult = TelegramIntakeResult;

async function runTelegramIntake(
  adapter: TelegramAdapterResult,
  rawProviderPayload: TelegramUpdate,
  state?: IntakeConversationState,
): Promise<TelegramIntakeResult> {
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
    const persistence = await persistIntakeDecision({
      message: adapter.message,
      decision,
      previousState: conversationState,
      rawProviderPayload: rawProviderPayload as Record<string, unknown>,
    });

    if (persistence.status === "failed_open_dual") {
      return {
        ok: false,
        persistence: "unavailable",
      };
    }
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

export async function runTelegramIntakeDryRun(
  update: TelegramDryRunUpdate,
  state?: IntakeConversationState,
): Promise<TelegramIntakeDryRunResult> {
  return runTelegramIntake(normalizeTelegramDryRunUpdate(update), update, state);
}

export async function runTelegramIntakeLiveReceive(
  update: TelegramUpdate,
): Promise<TelegramIntakeLiveReceiveResult> {
  return runTelegramIntake(
    normalizeTelegramUpdate(update, new Date(), { requirePrivateChat: true }),
    update,
  );
}
