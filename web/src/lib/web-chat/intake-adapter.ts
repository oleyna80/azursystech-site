import type {
  IntakeConversationState,
  IntakeLocale,
  NormalizedIntakeMessage,
} from "@/lib/intake/types";

const MAX_WEB_CHAT_TEXT_LENGTH = 1_000;

export type WebChatIntakeInput = {
  message: string;
  locale: IntakeLocale;
  history?: WebChatConversationItem[];
  conversationKey?: string;
  senderKey?: string;
  providerUpdateId?: string;
  providerMessageId?: string;
  receivedAtUtc?: Date;
  state?: IntakeConversationState;
  llmMode?: "disabled" | "enabled";
};
export type WebChatDryRunInput = WebChatIntakeInput;

export type WebChatConversationItem = {
  role: "user" | "assistant";
  content: string;
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

function redactWebChatStoredText(value: string): string {
  return normalizeWebChatText(value)
    .replace(/\b[\w.%+-]+@[\w.-]+\.[a-z]{2,}\b/giu, "[contact]")
    .replace(/(?:\+|00)\d[\d\s().-]{6,}/gu, "[contact]")
    .replace(
      /(?:парол[ья]|password|mot\s+de\s+passe|secret|token|api\s*key|ключ\s+api)\s*[:=]?\s*[^,.;\s]*/giu,
      "[sensitive]",
    )
    .replace(/\b(?:iban|bic|swift|passport|ssn)\s*[:=]?\s*[^,.;\s]*/giu, "[sensitive]")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeKey(value: string | undefined, fallback: string): string {
  const normalized = value
    ?.trim()
    .replace(/[^a-z0-9:_-]/giu, "")
    .slice(0, 120);

  return normalized || fallback;
}

function normalizeOptionalKey(value: string | undefined): string | undefined {
  const normalized = normalizeKey(value, "");
  return normalized || undefined;
}

export function normalizeWebChatMessage(input: WebChatIntakeInput): WebChatAdapterResult {
  const text = redactWebChatStoredText(input.message);
  if (!text) {
    return { ok: false, error: "missing_text" };
  }

  const conversationKey = normalizeKey(input.conversationKey, "web_chat:dry_run");
  const senderKey = normalizeKey(input.senderKey, conversationKey);
  const providerUpdateId = normalizeOptionalKey(input.providerUpdateId);
  const providerMessageId = normalizeOptionalKey(input.providerMessageId);
  if (!conversationKey || !senderKey) {
    return { ok: false, error: "invalid_conversation" };
  }

  return {
    ok: true,
    message: {
      channel: "web_chat",
      ...(providerUpdateId ? { providerUpdateId } : {}),
      ...(providerMessageId ? { providerMessageId } : {}),
      conversationKey,
      senderKey,
      receivedAtUtc: (input.receivedAtUtc ?? new Date()).toISOString(),
      text,
      locale: input.locale,
    },
    ...(input.state ? { state: input.state } : {}),
  };
}

export function normalizeWebChatDryRunMessage(input: WebChatDryRunInput): WebChatAdapterResult {
  return normalizeWebChatMessage(input);
}
