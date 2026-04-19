import { NextResponse } from "next/server";
import { isRateLimitedPersistent } from "@/lib/request-rate-limit";

const REQUEST_TIMEOUT_MS = 15_000;
const MAX_REQUEST_BODY_BYTES = 50_000;
const MAX_MESSAGE_LENGTH = 1_000;
const MAX_REPLY_LENGTH = 2_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_MAX_KEYS = 10_000;
const CHAT_UNAVAILABLE_MESSAGE =
  "Чат временно недоступен. Пожалуйста, отправьте заявку через форму на сайте или напишите в WhatsApp.";
const CTA_MESSAGE = "Оставьте заявку через форму на сайте или напишите в WhatsApp.";
const POLICY_FALLBACK_MESSAGE =
  "Я не могу обещать точные цены, сроки или проактивные действия в чате. Оставьте заявку через форму на сайте или напишите в WhatsApp.";
const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/iu,
  /reveal\s+(the\s+)?system\s+prompt/iu,
  /act\s+as\s+system/iu,
];
const DEFAULT_DEEPSEEK_BASE_URL = "https://api.deepseek.com";
const FORM_CTA_PATTERN = /\bформ(?:а|у|е|ой|ы)\b/iu;
const WHATSAPP_CTA_PATTERN = /\bwhats\s*app\b|\bwhatsapp\b|ватсапп?/iu;
const AUTONOMOUS_OUTBOUND_PATTERNS = [
  /\b(?:я|мы)\s+(?:свяж(?:усь|емся)|позвон(?:ю|им)|напиш(?:у|ем)|отправ(?:лю|им)|вышл(?:ю|ем)|назнач(?:у|им)|запиш(?:у|ем)|заброниру(?:ю|ем)|организу(?:ю|ем)|приед(?:у|ем))\b/iu,
  /\b(?:наш|мой)\s+специалист\s+(?:свяжется|позвонит|приедет|напишет|назначит)\b/iu,
];
const PRICING_COMMITMENT_PATTERNS = [
  /\b(?:точн(?:ая|о)|ровно|фиксированн(?:ая|ую)\s+цен[ау]|гарантир(?:ую|уем)\s+цен[ыу])\b/iu,
  /\b(?:будет|составит|стоит)\s*\d[\d\s.,]*(?:€|eur|евро|\$|usd|доллар(?:ов|а)?|₽|руб(?:\.|лей|ля|ль)?)\b/iu,
];
const SCHEDULING_COMMITMENT_PATTERNS = [
  /\b(?:назнач(?:у|им)|запиш(?:у|ем)|приед(?:у|ем)|будем|начнем|созвонимся|подключимся)\b.{0,40}\b(?:в|на)\s*\d{1,2}[:.]\d{2}\b/iu,
  /\b(?:назнач(?:у|им)|запиш(?:у|ем)|приед(?:у|ем)|будем|начнем)\b.{0,40}\b(?:на\s*)?\d{1,2}[./-]\d{1,2}(?:[./-]\d{2,4})?\b/iu,
  /\b(?:завтра|сегодня|послезавтра)\s+(?:в\s*)?\d{1,2}[:.]\d{2}\b/iu,
];
const LOCAL_DEEPSEEK_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);
const SYSTEM_PROMPT = `Ты роль: IT-специалист компании AzurSysTech из Ниццы (Франция).
Твоя задача помочь пользователю сформулировать его проблему перед тем, как он отправит заявку. Будь кратким, доброжелательным и компетентным.

ПРИНЦИПЫ ОТВЕТА:
1. Кратко, 1-2 предложения, максимум 3.
2. Не обещай точных цен, сроков, выезда или начала работ. Если нужно, говори, что после заявки мы посмотрим описание и уточним детали вручную.
3. В конце предлагай перейти к форме на сайте или написать в WhatsApp, чтобы передать контакты и описание задачи.
4. Отвечай только на русском языке.`;

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function sanitizeReply(reply: string | undefined): string {
  const cleaned = (reply ?? "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .trim();

  if (!cleaned) {
    return "К сожалению, не удалось получить ответ.";
  }

  return cleaned.slice(0, MAX_REPLY_LENGTH);
}

function hasPromptInjectionAttempt(message: string): boolean {
  return PROMPT_INJECTION_PATTERNS.some((pattern) => pattern.test(message));
}

function matchesAnyPattern(value: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(value));
}

function hasForbiddenCommitment(reply: string): boolean {
  return (
    matchesAnyPattern(reply, AUTONOMOUS_OUTBOUND_PATTERNS) ||
    matchesAnyPattern(reply, PRICING_COMMITMENT_PATTERNS) ||
    matchesAnyPattern(reply, SCHEDULING_COMMITMENT_PATTERNS)
  );
}

function hasClearCta(reply: string): boolean {
  return FORM_CTA_PATTERN.test(reply) && WHATSAPP_CTA_PATTERN.test(reply);
}

function ensureCta(reply: string): string {
  if (hasClearCta(reply)) {
    return reply;
  }

  const compact = reply.replace(/\s+/g, " ").trim();
  if (!compact) {
    return CTA_MESSAGE;
  }

  const candidate = `${compact} ${CTA_MESSAGE}`;
  if (candidate.length <= MAX_REPLY_LENGTH) {
    return candidate;
  }

  const maxPrefixLength = Math.max(0, MAX_REPLY_LENGTH - CTA_MESSAGE.length - 1);
  const prefix = compact
    .slice(0, maxPrefixLength)
    .replace(/\s+\S*$/u, "")
    .trim()
    .replace(/[.!?;,:-]+$/u, "");

  return prefix ? `${prefix} ${CTA_MESSAGE}` : CTA_MESSAGE;
}

function enforcePostGenerationPolicy(reply: string): string {
  const guardedReply = hasForbiddenCommitment(reply) ? POLICY_FALLBACK_MESSAGE : reply;
  return sanitizeReply(ensureCta(guardedReply));
}

function isRequestBodyTooLarge(request: Request): boolean {
  const contentLength = request.headers.get("content-length");
  if (!contentLength) {
    return false;
  }

  const parsed = Number.parseInt(contentLength, 10);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return false;
  }

  return parsed > MAX_REQUEST_BODY_BYTES;
}

function isLiveChatEnabled(): boolean {
  const launchMode = process.env.AI_LAUNCH_MODE?.trim();
  const intakeStorageMode = process.env.INTAKE_STORAGE_MODE?.trim().toLowerCase() ?? "legacy";
  const hasDeepseekApiKey = Boolean(process.env.DEEPSEEK_API_KEY?.trim());
  const hasDeepseekBaseUrl = Boolean(getDeepseekChatCompletionsUrl());
  const allowAutonomousOutbound = process.env.AI_ALLOW_AUTONOMOUS_OUTBOUND?.trim().toLowerCase();
  const allowPricingCommitments = process.env.AI_ALLOW_PRICING_COMMITMENTS?.trim().toLowerCase();
  const allowSchedulingPromises = process.env.AI_ALLOW_SCHEDULING_PROMISES?.trim().toLowerCase();

  return (
    launchMode === "limited_live_intake" &&
    allowAutonomousOutbound === "false" &&
    allowPricingCommitments === "false" &&
    allowSchedulingPromises === "false" &&
    intakeStorageMode !== "legacy" &&
    hasDeepseekApiKey &&
    hasDeepseekBaseUrl
  );
}

function getDeepseekChatCompletionsUrl(): string | null {
  const rawBaseUrl = process.env.DEEPSEEK_BASE_URL?.trim() || DEFAULT_DEEPSEEK_BASE_URL;
  const normalizedBaseUrl = rawBaseUrl.endsWith("/") ? rawBaseUrl : `${rawBaseUrl}/`;
  const isProd = process.env.NODE_ENV === "production";

  try {
    const parsedUrl = new URL("chat/completions", normalizedBaseUrl);
    if (parsedUrl.protocol === "https:") {
      return parsedUrl.toString();
    }

    if (parsedUrl.protocol !== "http:") {
      return null;
    }

    if (!isProd && LOCAL_DEEPSEEK_HOSTS.has(parsedUrl.hostname.toLowerCase())) {
      return parsedUrl.toString();
    }

    return null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  if (isRequestBodyTooLarge(request)) {
    return NextResponse.json({ error: "Request too large" }, { status: 413 });
  }

  if (!isLiveChatEnabled()) {
    return NextResponse.json({ error: CHAT_UNAVAILABLE_MESSAGE }, { status: 503 });
  }

  const clientIp = getClientIp(request);
  const isRateLimited = await isRateLimitedPersistent({
    scope: "chat",
    key: clientIp,
    maxRequests: RATE_LIMIT_MAX,
    windowMs: RATE_LIMIT_WINDOW_MS,
    maxMemoryKeys: RATE_LIMIT_MAX_KEYS,
  });
  if (isRateLimited) {
    return NextResponse.json(
      { error: "Слишком много обращений подряд, пожалуйста, подождите минуту." },
      { status: 429 },
    );
  }

  let body: unknown = null;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad Request: invalid payload" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Bad Request: invalid payload" }, { status: 400 });
  }

  const keys = Object.keys(body);
  if (keys.length !== 1 || keys[0] !== "message") {
    return NextResponse.json({ error: "Bad Request: invalid payload" }, { status: 400 });
  }

  const payload = body as { message?: unknown };
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

  if (hasPromptInjectionAttempt(message)) {
    return NextResponse.json(
      { error: "Запрос отклонен по соображениям безопасности. Переформулируйте, пожалуйста, ваш технический вопрос." },
      { status: 400 },
    );
  }

  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  const deepseekChatCompletionsUrl = getDeepseekChatCompletionsUrl();
  if (!apiKey || !deepseekChatCompletionsUrl) {
    return NextResponse.json({ error: CHAT_UNAVAILABLE_MESSAGE }, { status: 503 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(deepseekChatCompletionsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message },
        ],
        max_tokens: 200,
        temperature: 0.3,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      if (response.status === 402) {
        return NextResponse.json({
          reply: "Извините, сервис временно недоступен. Пожалуйста, отправьте заявку через форму на сайте или напишите в WhatsApp.",
        });
      }

      console.error(`Chat upstream error: status=${response.status}`);
      return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 500 });
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const rawReply = sanitizeReply(data.choices?.[0]?.message?.content);
    const reply = enforcePostGenerationPolicy(rawReply);

    return NextResponse.json({ reply });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error("Chat upstream timeout");
      return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 504 });
    }

    console.error("Chat endpoint unexpected error");
    return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 500 });
  } finally {
    clearTimeout(timeout);
  }
}
