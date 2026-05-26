import { loadIntakeConversationState, persistIntakeDecision } from "@/lib/intake/storage";
import { runIntakeDryRun } from "@/lib/intake/runtime";
import type { IntakeDecision } from "@/lib/intake/types";
import {
  normalizeWebChatMessage,
  type WebChatAdapterResult,
  type WebChatIntakeInput,
} from "@/lib/web-chat/intake-adapter";

export type WebChatIntakeResult =
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

export async function runWebChatIntake(input: WebChatIntakeInput): Promise<WebChatIntakeResult> {
  const adapter = normalizeWebChatMessage(input);

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
    const persistence = await persistIntakeDecision({
      message: adapter.message,
      decision,
      previousState: conversationState,
      rawProviderPayload: {
        message: adapter.message.text,
        locale: adapter.message.locale,
        conversationKey: adapter.message.conversationKey,
        senderKey: adapter.message.senderKey,
        providerUpdateId: adapter.message.providerUpdateId,
        providerMessageId: adapter.message.providerMessageId,
      },
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
