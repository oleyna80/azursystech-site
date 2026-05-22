import crypto from "node:crypto";

import { NextResponse } from "next/server";

import { readJsonWithLimit } from "@/lib/api-security";
import type { IntakeConversationState } from "@/lib/intake/types";
import {
  runTelegramIntakeDryRun,
  runTelegramIntakeLiveReceive,
} from "@/lib/telegram/dry-run";
import type { TelegramUpdate } from "@/lib/telegram/intake-adapter";
import {
  getTelegramWebhookReceiveConfigFromEnv,
  getTelegramWebhookReceiveReadinessStatus,
} from "@/lib/telegram/sender";

const MAX_TELEGRAM_WEBHOOK_BODY_BYTES = 50_000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isDryRunRequest(request: Request): boolean {
  return (
    process.env.NODE_ENV !== "production" &&
    request.headers.get("x-azursystech-dry-run")?.trim().toLowerCase() === "true"
  );
}

function extractTelegramUpdate(body: unknown): TelegramUpdate {
  if (!isRecord(body)) {
    return {};
  }

  const nestedUpdate = body.update;
  if (isRecord(nestedUpdate)) {
    return nestedUpdate as TelegramUpdate;
  }

  return body as TelegramUpdate;
}

function extractConversationState(body: unknown): IntakeConversationState | undefined {
  if (!isRecord(body) || !isRecord(body.state)) {
    return undefined;
  }

  const briefDraft = isRecord(body.state.briefDraft) ? body.state.briefDraft : undefined;
  const rawSeenKeys = body.state.seenIdempotencyKeys;
  const seenIdempotencyKeys = Array.isArray(rawSeenKeys)
    ? rawSeenKeys.filter((key): key is string => typeof key === "string")
    : undefined;

  return {
    ...(briefDraft ? { briefDraft } : {}),
    ...(seenIdempotencyKeys ? { seenIdempotencyKeys } : {}),
  };
}

function notFound(): NextResponse {
  return NextResponse.json({ error: "Not Found" }, { status: 404 });
}

function timingSafeEqualText(left: string, right: string): boolean {
  const leftDigest = crypto.createHash("sha256").update(left).digest();
  const rightDigest = crypto.createHash("sha256").update(right).digest();
  return crypto.timingSafeEqual(leftDigest, rightDigest);
}

function isTelegramSecretValid(request: Request, expectedSecret: string): boolean {
  const providedSecret = request.headers.get("x-telegram-bot-api-secret-token")?.trim();
  const normalizedExpectedSecret = expectedSecret.trim();
  if (!providedSecret || !normalizedExpectedSecret) {
    return false;
  }

  return timingSafeEqualText(providedSecret, normalizedExpectedSecret);
}

async function handleDryRunWebhook(request: Request) {
  const parsed = await readJsonWithLimit(request, MAX_TELEGRAM_WEBHOOK_BODY_BYTES);
  if (!parsed.ok) {
    return NextResponse.json(
      { error: parsed.reason === "too_large" ? "Request too large" : "Invalid payload" },
      { status: parsed.reason === "too_large" ? 413 : 400 },
    );
  }

  const body = parsed.value;
  const result = await runTelegramIntakeDryRun(
    extractTelegramUpdate(body),
    extractConversationState(body),
  );

  if (!result.ok) {
    if ("persistence" in result) {
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
        adapter: result.adapter,
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    mode: "dry_run",
    decision: result.decision,
  });
}

async function handleLiveWebhook(request: Request) {
  if (process.env.NODE_ENV !== "production") {
    return notFound();
  }

  const config = getTelegramWebhookReceiveConfigFromEnv();
  const readiness = getTelegramWebhookReceiveReadinessStatus(config);
  if (!readiness.ok || !config.webhookSecret || !isTelegramSecretValid(request, config.webhookSecret)) {
    return notFound();
  }

  const parsed = await readJsonWithLimit(request, MAX_TELEGRAM_WEBHOOK_BODY_BYTES);
  if (!parsed.ok) {
    return NextResponse.json(
      { ok: false, error: parsed.reason === "too_large" ? "Request too large" : "Invalid payload" },
      { status: parsed.reason === "too_large" ? 413 : 400 },
    );
  }

  const result = await runTelegramIntakeLiveReceive(extractTelegramUpdate(parsed.value));

  if (!result.ok) {
    if ("persistence" in result) {
      return NextResponse.json({ ok: false, error: "Persistence unavailable" }, { status: 503 });
    }

    if (
      result.adapter.error === "unsupported_update" ||
      result.adapter.error === "missing_text"
    ) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    return NextResponse.json({ ok: false, error: "Bad Request" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

export function GET() {
  return notFound();
}

export async function POST(request: Request) {
  // This endpoint only receives Telegram updates; it never registers webhooks or sends messages.
  if (isDryRunRequest(request)) {
    return handleDryRunWebhook(request);
  }

  return handleLiveWebhook(request);
}
