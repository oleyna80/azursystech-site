import { NextResponse } from "next/server";

const REQUEST_TIMEOUT_MS = 15_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const SYSTEM_PROMPT = `Ты роль: IT-специалист компании AzurSysTech из Ниццы (Франция).
Твоя задача помочь пользователю сформулировать его проблему перед тем, как он отправит заявку. Будь кратким, доброжелательным и компетентным.

ПРИНЦИПЫ ОТВЕТА:
1. Кратко, 1-2 предложения, максимум 3.
2. Не обещай точных цен, сроков, выезда или начала работ. Если нужно, говори, что после заявки мы посмотрим описание и уточним детали вручную.
3. В конце предлагай перейти к форме на сайте или написать в WhatsApp, чтобы передать контакты и описание задачи.
4. Отвечай только на русском языке.`;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function isRateLimited(request: Request) {
  const clientIp = getClientIp(request);
  const now = Date.now();
  const existing = rateLimitStore.get(clientIp);

  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(clientIp, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  if (existing.count >= RATE_LIMIT_MAX) {
    return true;
  }

  existing.count += 1;
  rateLimitStore.set(clientIp, existing);
  return false;
}

export async function POST(request: Request) {
  if (isRateLimited(request)) {
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

  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) {
    console.error("DEEPSEEK_API_KEY is missing");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
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

      console.error("DeepSeek API error. Status:", response.status);
      return NextResponse.json({ error: "Failed to communicate with AI provider" }, { status: 500 });
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const reply = data.choices?.[0]?.message?.content || "К сожалению, не удалось получить ответ.";

    return NextResponse.json({ reply });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error("DeepSeek API timed out (AbortError)");
      return NextResponse.json({ error: "AI request timeout" }, { status: 504 });
    }

    console.error("Chat endpoint error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    clearTimeout(timeout);
  }
}
