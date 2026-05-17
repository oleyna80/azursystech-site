import { NextResponse } from "next/server";

import type { IntakeConversationState } from "@/lib/intake/types";
import { runTelegramIntakeDryRun } from "@/lib/telegram/dry-run";
import type { TelegramDryRunUpdate } from "@/lib/telegram/intake-adapter";

const MAX_DRY_RUN_BODY_BYTES = 50_000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isDryRunRequest(request: Request): boolean {
  return (
    process.env.NODE_ENV !== "production" &&
    request.headers.get("x-azursystech-dry-run")?.trim().toLowerCase() === "true"
  );
}

function isRequestBodyTooLarge(request: Request): boolean {
  const contentLength = request.headers.get("content-length");
  if (!contentLength) {
    return false;
  }

  const parsed = Number.parseInt(contentLength, 10);
  return Number.isFinite(parsed) && parsed > MAX_DRY_RUN_BODY_BYTES;
}

function extractTelegramUpdate(body: unknown): TelegramDryRunUpdate {
  if (!isRecord(body)) {
    return {};
  }

  const nestedUpdate = body.update;
  if (isRecord(nestedUpdate)) {
    return nestedUpdate as TelegramDryRunUpdate;
  }

  return body as TelegramDryRunUpdate;
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

export async function POST(request: Request) {
  // Local/test-only route: never registers webhooks, sends messages, or calls Telegram.
  if (!isDryRunRequest(request)) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  if (isRequestBodyTooLarge(request)) {
    return NextResponse.json({ error: "Request too large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad Request: invalid payload" }, { status: 400 });
  }

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
