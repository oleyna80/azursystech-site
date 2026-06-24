import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import {
  getRateLimitKey,
  isAllowedMutationOrigin,
  readJsonWithLimit,
} from "@/lib/api-security";
import { isSqlStorageEnabled } from "@/lib/intake/config";
import type { AgentNextStep, IntakeConversationState } from "@/lib/intake/types";
import { isRateLimitedPersistent } from "@/lib/request-rate-limit";
import { runWebChatIntake } from "@/lib/web-chat/intake";
import { runWebChatIntakeDryRun } from "@/lib/web-chat/dry-run";

const MAX_REQUEST_BODY_BYTES = 50_000;
const MAX_MESSAGE_LENGTH = 1_000;
const MAX_HISTORY_ITEM_LENGTH = 1_000;
const MAX_HISTORY_ITEMS = 12;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_MAX_KEYS = 10_000;
const SUPPORTED_CHAT_LOCALES = ["fr", "ru"] as const;
const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/iu,
  /reveal\s+(the\s+)?system\s+prompt/iu,
  /act\s+as\s+system/iu,
];

type ChatLocale = (typeof SUPPORTED_CHAT_LOCALES)[number];
type ChatRole = "user" | "assistant";
type ChatHistoryItem = {
  role: ChatRole;
  content: string;
};
type ChatUiState = {
  nextStep: AgentNextStep;
  contactFormVisible: boolean;
  briefVisible: boolean;
};

const CHAT_COPY: Record<
  ChatLocale,
  {
    chatUnavailable: string;
    emptyReply: string;
    duplicateFallback: string;
    securityRejection: string;
    rateLimit: string;
  }
> = {
  fr: {
    chatUnavailable:
      "Le chat est temporairement indisponible. Merci d'envoyer votre demande via le formulaire du site.",
    emptyReply:
      "Je peux vous aider a decrire le besoin. Pour etre recontacte, utilisez le formulaire du site.",
    duplicateFallback:
      "J'ai deja pris en compte ce message. Pour etre recontacte, utilisez le formulaire du site.",
    securityRejection:
      "La demande a ete refusee pour des raisons de securite. Reformulez votre question sans instructions systeme.",
    rateLimit: "Trop de messages d'affilee. Merci d'attendre une minute.",
  },
  ru: {
    chatUnavailable:
      "Чат временно недоступен. Пожалуйста, отправьте заявку через форму на сайте.",
    emptyReply:
      "Я могу помочь описать задачу. Чтобы с вами связались, используйте форму на сайте.",
    duplicateFallback:
      "Я уже учел это сообщение. Чтобы с вами связались, используйте форму на сайте.",
    securityRejection:
      "Запрос отклонен по соображениям безопасности. Переформулируйте вопрос без системных инструкций.",
    rateLimit: "Слишком много обращений подряд, пожалуйста, подождите минуту.",
  },
};

function sanitizeConversationContent(value: unknown, maxLength: number): string {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .trim()
    .slice(0, maxLength);
}

function sanitizeLocale(value: unknown): ChatLocale | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  return SUPPORTED_CHAT_LOCALES.includes(normalized as ChatLocale)
    ? (normalized as ChatLocale)
    : null;
}

function detectLocaleFromText(value: string): ChatLocale | null {
  if (!value) {
    return null;
  }

  if (/[а-яё]/iu.test(value)) {
    return "ru";
  }

  if (
    /[àâçéèêëîïôûùüÿæœ]/iu.test(value) ||
    /\b(?:bonjour|bonsoir|salut|merci|besoin|devis|ordinateur|imprimante|réseau|reseau|c[aâ]ble|bureau|comment|pouvez|veuillez|demande|site)\b/iu.test(
      value,
    )
  ) {
    return "fr";
  }

  return null;
}

function resolveChatLocale(explicitLocale: ChatLocale | null, message: string, history: ChatHistoryItem[]) {
  if (explicitLocale) {
    return explicitLocale;
  }

  const userMessages = [
    message,
    ...history
      .filter((item) => item.role === "user")
      .map((item) => item.content)
      .reverse(),
  ];

  for (const candidate of userMessages) {
    const detectedLocale = detectLocaleFromText(candidate);
    if (detectedLocale) {
      return detectedLocale;
    }
  }

  return "fr";
}

function hasPromptInjectionAttempt(message: string): boolean {
  return PROMPT_INJECTION_PATTERNS.some((pattern) => pattern.test(message));
}

function isWebChatDryRunRequest(request: Request): boolean {
  return (
    process.env.NODE_ENV !== "production" &&
    request.headers.get("x-azursystech-dry-run")?.trim().toLowerCase() === "true"
  );
}

function isLiveChatEnabled(): boolean {
  const launchMode = process.env.AI_LAUNCH_MODE?.trim();
  const allowAutonomousOutbound = process.env.AI_ALLOW_AUTONOMOUS_OUTBOUND?.trim().toLowerCase();
  const allowPricingCommitments = process.env.AI_ALLOW_PRICING_COMMITMENTS?.trim().toLowerCase();
  const allowSchedulingPromises = process.env.AI_ALLOW_SCHEDULING_PROMISES?.trim().toLowerCase();

  return (
    launchMode === "limited_live_intake" &&
    allowAutonomousOutbound === "false" &&
    allowPricingCommitments === "false" &&
    allowSchedulingPromises === "false" &&
    isSqlStorageEnabled()
  );
}

function sanitizeHistory(history: unknown): ChatHistoryItem[] {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .map((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        return null;
      }

      const role = item.role;
      if (role !== "user" && role !== "assistant") {
        return null;
      }

      const content = sanitizeConversationContent(item.content, MAX_HISTORY_ITEM_LENGTH);
      if (!content) {
        return null;
      }

      if (hasPromptInjectionAttempt(content)) {
        return null;
      }

      return { role, content };
    })
    .filter((item): item is ChatHistoryItem => item !== null)
    .slice(-MAX_HISTORY_ITEMS);
}

function extractIntakeConversationState(body: { state?: unknown }): IntakeConversationState | undefined {
  if (!body.state || typeof body.state !== "object" || Array.isArray(body.state)) {
    return undefined;
  }

  const state = body.state as { briefDraft?: unknown; seenIdempotencyKeys?: unknown };
  const briefDraft =
    state.briefDraft && typeof state.briefDraft === "object" && !Array.isArray(state.briefDraft)
      ? state.briefDraft
      : undefined;
  const seenIdempotencyKeys = Array.isArray(state.seenIdempotencyKeys)
    ? state.seenIdempotencyKeys.filter((key): key is string => typeof key === "string")
    : undefined;

  return {
    ...(briefDraft ? { briefDraft } : {}),
    ...(seenIdempotencyKeys ? { seenIdempotencyKeys } : {}),
  };
}

function hashForKey(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 48);
}

function resolveLiveConversationKey(request: Request, body: { conversationId?: unknown }): string {
  if (typeof body.conversationId === "string" && body.conversationId.trim()) {
    return `web_chat:${hashForKey(body.conversationId.trim())}`;
  }

  return `web_chat:${hashForKey(getRateLimitKey(request))}`;
}

function buildProviderMessageId(conversationKey: string, message: string, history: ChatHistoryItem[]): string {
  const userTurnCount = history.filter((item) => item.role === "user").length + 1;
  return `web_chat:${hashForKey(`${conversationKey}:${userTurnCount}:${message}`)}`;
}

function buildChatUiState(nextStep: AgentNextStep): ChatUiState {
  return {
    nextStep,
    contactFormVisible: nextStep === "contact_form" || nextStep === "brief" || nextStep === "handoff",
    briefVisible: nextStep === "brief",
  };
}

export async function POST(request: Request) {
  if (!isAllowedMutationOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsedBody = await readJsonWithLimit<unknown>(request, MAX_REQUEST_BODY_BYTES);
  if (!parsedBody.ok) {
    return NextResponse.json(
      { error: parsedBody.reason === "too_large" ? "Request too large" : "Bad Request: invalid payload" },
      { status: parsedBody.reason === "too_large" ? 413 : 400 },
    );
  }
  const body = parsedBody.value;

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Bad Request: invalid payload" }, { status: 400 });
  }

  const isDryRunRequest = isWebChatDryRunRequest(request);
  const keys = Object.keys(body);
  const hasOnlyAllowedKeys = keys.every(
    (key) =>
      key === "message" ||
      key === "history" ||
      key === "locale" ||
      key === "conversationId" ||
      (isDryRunRequest && (key === "conversationKey" || key === "senderKey" || key === "state")),
  );
  if (!hasOnlyAllowedKeys || !keys.includes("message")) {
    return NextResponse.json({ error: "Bad Request: invalid payload" }, { status: 400 });
  }

  const payload = body as { message?: unknown; history?: unknown; locale?: unknown };
  const message = typeof payload.message === "string" ? payload.message.trim() : "";
  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Message must be between 1 and ${MAX_MESSAGE_LENGTH} characters` },
      { status: 400 },
    );
  }

  if ("history" in payload && payload.history !== undefined && !Array.isArray(payload.history)) {
    return NextResponse.json({ error: "Bad Request: invalid payload" }, { status: 400 });
  }

  const history = sanitizeHistory(payload.history);
  const explicitLocale = sanitizeLocale(payload.locale);
  const responseLocale = resolveChatLocale(explicitLocale, message, history);
  const copy = CHAT_COPY[responseLocale];

  if (isDryRunRequest) {
    const dryRunResult = await runWebChatIntakeDryRun({
      message,
      history,
      locale: responseLocale,
      conversationKey:
        typeof (body as { conversationKey?: unknown }).conversationKey === "string"
          ? (body as { conversationKey: string }).conversationKey
          : undefined,
      senderKey:
        typeof (body as { senderKey?: unknown }).senderKey === "string"
          ? (body as { senderKey: string }).senderKey
          : undefined,
      state: extractIntakeConversationState(body as { state?: unknown }),
    });

    if (!dryRunResult.ok) {
      if ("persistence" in dryRunResult) {
        return NextResponse.json(
          {
            ok: false,
            mode: "dry_run",
            error: "Persistence unavailable",
          },
          { status: 503 },
        );
      }

      return NextResponse.json(
        {
          ok: false,
          mode: "dry_run",
          adapter: dryRunResult.adapter,
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      ok: true,
      mode: "dry_run",
      decision: dryRunResult.decision,
    });
  }

  if (!isLiveChatEnabled()) {
    return NextResponse.json({ error: copy.chatUnavailable }, { status: 503 });
  }

  const isRateLimited = await isRateLimitedPersistent({
    scope: "chat",
    key: getRateLimitKey(request),
    maxRequests: RATE_LIMIT_MAX,
    windowMs: RATE_LIMIT_WINDOW_MS,
    maxMemoryKeys: RATE_LIMIT_MAX_KEYS,
  });
  if (isRateLimited) {
    return NextResponse.json({ error: copy.rateLimit }, { status: 429 });
  }

  if (hasPromptInjectionAttempt(message)) {
    return NextResponse.json({ error: copy.securityRejection }, { status: 400 });
  }

  const conversationKey = resolveLiveConversationKey(request, body as { conversationId?: unknown });
  const intakeResult = await runWebChatIntake({
    message,
    history,
    locale: responseLocale,
    conversationKey,
    senderKey: conversationKey,
    providerMessageId: buildProviderMessageId(conversationKey, message, history),
    llmMode: "enabled",
  });

  if (!intakeResult.ok) {
    if ("persistence" in intakeResult) {
      return NextResponse.json({ error: copy.chatUnavailable }, { status: 503 });
    }

    return NextResponse.json({ error: "Bad Request: invalid payload" }, { status: 400 });
  }

  return NextResponse.json({
    reply: intakeResult.decision.assistantReply ?? copy.duplicateFallback ?? copy.emptyReply,
    ui: buildChatUiState(intakeResult.decision.briefDraft.nextStep),
  });
}
