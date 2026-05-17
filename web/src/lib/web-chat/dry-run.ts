import { loadIntakeConversationState, persistIntakeDecision } from "@/lib/intake/storage";
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
      persistence: "unavailable";
    }
  | {
      ok: false;
      adapter: WebChatAdapterResult;
    };

export async function runWebChatIntakeDryRun(
  input: WebChatDryRunInput,
): Promise<WebChatIntakeDryRunResult> {
  const adapter = normalizeWebChatDryRunMessage(input);

  if (!adapter.ok) {
    return {
      ok: false,
      adapter,
    };
  }

  let conversationState = adapter.state;
  try {
    conversationState = await loadIntakeConversationState(
      {
        channel: adapter.message.channel,
        conversationKey: adapter.message.conversationKey,
      },
      adapter.state,
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
      rawProviderPayload: {
        message: input.message,
        locale: input.locale,
        conversationKey: input.conversationKey,
        senderKey: input.senderKey,
      },
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
