import { NextResponse } from "next/server";
import { isRateLimitedPersistent } from "@/lib/request-rate-limit";

const REQUEST_TIMEOUT_MS = 15_000;
const MAX_REQUEST_BODY_BYTES = 50_000;
const MAX_MESSAGE_LENGTH = 1_000;
const MAX_REPLY_LENGTH = 2_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_MAX_KEYS = 10_000;
const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/iu,
  /reveal\s+(the\s+)?system\s+prompt/iu,
  /act\s+as\s+system/iu,
];
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

export async function POST(request: Request) {
  if (isRequestBodyTooLarge(request)) {
    return NextResponse.json({ error: "Request too large" }, { status: 413 });
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
  if (!apiKey) {
    console.error("Chat API misconfigured: missing DEEPSEEK_API_KEY");
    return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 500 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
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
    const reply = sanitizeReply(data.choices?.[0]?.message?.content);

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
