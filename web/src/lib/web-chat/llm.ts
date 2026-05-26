import type { AgentNextStep, IntakeDecision, NormalizedIntakeMessage } from "@/lib/intake/types";
import type { WebChatConversationItem } from "@/lib/web-chat/intake-adapter";

const DEFAULT_DEEPSEEK_BASE_URL = "https://api.deepseek.com";
const DEFAULT_DEEPSEEK_MODEL = "deepseek-chat";
const LLM_TIMEOUT_MS = 8_000;
const MAX_LLM_REPLY_LENGTH = 1_200;
const MAX_LLM_HISTORY_ITEMS = 12;
const MAX_LLM_HISTORY_ITEM_LENGTH = 900;

type LlmChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type WebChatLlmInput = {
  message: NormalizedIntakeMessage;
  decision: Extract<IntakeDecision, { assistantReply: string }>;
  history: WebChatConversationItem[];
};

export type WebChatLlmResult =
  | { ok: true; reply: string; provider: "deepseek" }
  | { ok: false; reason: "disabled" | "provider_error" | "unsafe_output" | "empty_output" };

function sanitizeLlmText(value: string, maxLength: number): string {
  return value
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function redactLlmContext(value: string): string {
  return sanitizeLlmText(value, MAX_LLM_HISTORY_ITEM_LENGTH)
    .replace(/\b[\w.%+-]+@[\w.-]+\.[a-z]{2,}\b/giu, "[contact]")
    .replace(/(?:\+|00)\d[\d\s().-]{6,}/gu, "[contact]")
    .replace(
      /(?:парол[ья]|password|mot\s+de\s+passe|secret|token|api\s*key|ключ\s+api)\s*[:=]?\s*[^,.;\s]*/giu,
      "[sensitive]",
    )
    .replace(/\b(?:iban|bic|swift|passport|ssn)\s*[:=]?\s*[^,.;\s]*/giu, "[sensitive]");
}

function getProviderConfig():
  | { ok: true; apiKey: string; endpoint: string; model: string }
  | { ok: false } {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false };
  }

  const baseUrl = (process.env.DEEPSEEK_BASE_URL?.trim() || DEFAULT_DEEPSEEK_BASE_URL).replace(/\/+$/u, "");

  return {
    ok: true,
    apiKey,
    endpoint: `${baseUrl}/chat/completions`,
    model: process.env.DEEPSEEK_CHAT_MODEL?.trim() || DEFAULT_DEEPSEEK_MODEL,
  };
}

function describeNextStep(nextStep: AgentNextStep): string {
  switch (nextStep) {
    case "contact_form":
      return "You may softly offer the contact form link /contact if it fits the answer.";
    case "brief":
      return "You may offer the optional brief link /brief and help the client phrase brief fields.";
    case "handoff":
      return "Keep the answer short and route the client to the contact form /contact.";
    case "clarify":
    default:
      return "Continue the conversation with one concise diagnostic question before pushing forms.";
  }
}

function buildSystemPrompt(input: WebChatLlmInput): string {
  const locale = input.message.locale === "ru" ? "Russian" : "French";
  const draft = input.decision.briefDraft;
  const knownProblem = draft.problemStatement ? redactLlmContext(draft.problemStatement) : "not known yet";
  const safetyNotes = [
    input.decision.safety.deflectedCommitment ? "The user asked about price, timeline, stack, or guarantees." : "",
    input.decision.safety.detectedContactInChat ? "The user pasted contact data; do not repeat it." : "",
    input.decision.safety.detectedConfidentialInput ? "The user pasted confidential data; warn not to share it in chat." : "",
    input.decision.safety.deflectedUnsafeRequest ? "The user asked about gray, illegal, spam, fraud, or hacking activity." : "",
  ]
    .filter(Boolean)
    .join(" ");

  return [
    "You are the AzurSysTech AI intake assistant for AI automation of business processes.",
    `Reply in ${locale}.`,
    "Your job is to hold a natural conversation, clarify the business, the process to automate, existing website/CRM/Telegram/WhatsApp/email channels, and the preferred communication path.",
    "The client may ask questions while filling the contact form or the optional brief. Help them phrase what to write, give simple examples, and explain fields at a high level.",
    "Do not collect contact details in chat. Tell the client to use the contact form for name, Telegram, phone, or email.",
    "Do not ask for or repeat passwords, tokens, API keys, payment data, legal IDs, private documents, or other confidential data.",
    "Do not provide prices, deadlines, guarantees, technology stack commitments, legal advice, or final solutions. Say that details depend on the task and a specialist will clarify after the request.",
    "Do not work with gray, illegal, spam, fraud, hacking, or evasion requests. Deflect briefly and ask only about legal business-process automation.",
    "Keep the reply concise: 2-5 short sentences. Ask at most one question unless the user explicitly asks for a checklist.",
    `Backend-approved next step: ${draft.nextStep}. ${describeNextStep(draft.nextStep)}`,
    `Known problem statement: ${knownProblem}.`,
    safetyNotes ? `Safety context: ${safetyNotes}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildWebChatLlmMessages(input: WebChatLlmInput): LlmChatMessage[] {
  const context = input.history
    .slice(-MAX_LLM_HISTORY_ITEMS)
    .map((item) => ({
      role: item.role,
      content: redactLlmContext(item.content),
    }))
    .filter((item) => item.content);

  return [
    { role: "system", content: buildSystemPrompt(input) },
    ...context,
    {
      role: "user",
      content: redactLlmContext(input.message.text),
    },
  ];
}

function isUnsafeAssistantOutput(reply: string): boolean {
  const normalized = reply.toLowerCase();

  if (/(?:\b\d{2,6}\s?(?:€|eur|euro|руб|rub|usd|\$)\b|от\s+\d{2,6}\s?(?:€|eur|евро|руб)|a partir de\s+\d{2,6})/iu.test(reply)) {
    return true;
  }

  if (/(?:сделаем|готово|запустим|livrerons|livraison|ready|done).{0,24}(?:за|dans|in)\s+\d+\s+(?:дн|день|дня|недел|jours?|semaines?|weeks?)/iu.test(reply)) {
    return true;
  }

  if (/(?:гарантирую|гарантируем|guarantee|garanti|garantissons|promise|promis)/iu.test(reply)) {
    return true;
  }

  if (
    /(?:напишите|оставьте|укажите|пришлите|envoyez|indiquez|laissez|send|share).{0,80}(?:телефон|phone|email|e-mail|telegram|телеграм|whatsapp|ватсап|парол|password|token|api\s*key|iban|card|карта)/iu.test(
      normalized,
    ) &&
    !/(?:форм[ауы]|formulaire|form|поле|champ|\/contact|brief|\/brief)/iu.test(normalized)
  ) {
    return true;
  }

  return false;
}

export async function generateWebChatLlmReply(input: WebChatLlmInput): Promise<WebChatLlmResult> {
  const config = getProviderConfig();
  if (!config.ok) {
    return { ok: false, reason: "disabled" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), LLM_TIMEOUT_MS);

  try {
    const response = await fetch(config.endpoint, {
      method: "POST",
      headers: {
        authorization: `Bearer ${config.apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        messages: buildWebChatLlmMessages(input),
        temperature: 0.3,
        max_tokens: 450,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      return { ok: false, reason: "provider_error" };
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: unknown } }>;
    };
    const reply = sanitizeLlmText(String(payload.choices?.[0]?.message?.content ?? ""), MAX_LLM_REPLY_LENGTH);
    if (!reply) {
      return { ok: false, reason: "empty_output" };
    }

    if (isUnsafeAssistantOutput(reply)) {
      return { ok: false, reason: "unsafe_output" };
    }

    return { ok: true, reply, provider: "deepseek" };
  } catch {
    return { ok: false, reason: "provider_error" };
  } finally {
    clearTimeout(timeout);
  }
}
