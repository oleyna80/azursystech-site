import type {
  IntakeConversationState,
  IntakeLocale,
  NormalizedIntakeMessage,
} from "@/lib/intake/types";

const MAX_WEB_CHAT_TEXT_LENGTH = 1_000;

export type WebChatDryRunInput = {
  message: string;
  locale: IntakeLocale;
  conversationKey?: string;
  senderKey?: string;
  receivedAtUtc?: Date;
  state?: IntakeConversationState;
};

export type WebChatAdapterResult =
  | { ok: true; message: NormalizedIntakeMessage; state?: IntakeConversationState }
  | { ok: false; error: "missing_text" | "invalid_conversation" };

function normalizeWebChatText(value: string): string {
  return value
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_WEB_CHAT_TEXT_LENGTH);
}

function normalizeKey(value: string | undefined, fallback: string): string {
  const normalized = value
    ?.trim()
    .replace(/[^a-z0-9:_-]/giu, "")
    .slice(0, 120);

  return normalized || fallback;
}

export function normalizeWebChatDryRunMessage(
  input: WebChatDryRunInput,
): WebChatAdapterResult {
  const text = normalizeWebChatText(input.message);
  if (!text) {
    return { ok: false, error: "missing_text" };
  }

  const conversationKey = normalizeKey(input.conversationKey, "web_chat:dry_run");
  const senderKey = normalizeKey(input.senderKey, conversationKey);
  if (!conversationKey || !senderKey) {
    return { ok: false, error: "invalid_conversation" };
  }

  return {
    ok: true,
    message: {
      channel: "web_chat",
      conversationKey,
      senderKey,
      receivedAtUtc: (input.receivedAtUtc ?? new Date()).toISOString(),
      text,
      locale: input.locale,
    },
    ...(input.state ? { state: input.state } : {}),
  };
}
