import { NextResponse } from "next/server";

import {
  IntakeOutboxUnavailableError,
  approveOutboundDraftMessage,
  listPendingOutboundDrafts,
  queueApprovedOutboundMessage,
} from "@/lib/intake/outbox";
import type { OutboundMessageTransitionResult } from "@/lib/intake/persistence";
import { INTAKE_CHANNELS, type IntakeChannel } from "@/lib/intake/types";

const MAX_DRY_RUN_BODY_BYTES = 50_000;

type OutboxAction = "approve" | "queue";
type BadRequest = { ok: false; error: string };

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

function isIntakeChannel(value: string): value is IntakeChannel {
  return (INTAKE_CHANNELS as readonly string[]).includes(value);
}

function parseOptionalChannel(rawChannel: string | null): IntakeChannel | BadRequest | undefined {
  if (!rawChannel) {
    return undefined;
  }

  if (!isIntakeChannel(rawChannel)) {
    return { ok: false, error: "Bad Request: invalid channel" };
  }

  return rawChannel;
}

function parseOptionalLimit(rawLimit: string | null): number | BadRequest | undefined {
  if (!rawLimit) {
    return undefined;
  }

  const parsed = Number.parseInt(rawLimit, 10);
  if (!Number.isSafeInteger(parsed) || String(parsed) !== rawLimit || parsed <= 0) {
    return { ok: false, error: "Bad Request: invalid limit" };
  }

  return parsed;
}

function parseAction(rawAction: unknown): OutboxAction | null {
  return rawAction === "approve" || rawAction === "queue" ? rawAction : null;
}

function isBadRequest(value: unknown): value is BadRequest {
  return isRecord(value) && value.ok === false && typeof value.error === "string";
}

function unavailableResponse() {
  return NextResponse.json(
    {
      ok: false,
      mode: "dry_run",
      error: "Persistence unavailable",
    },
    { status: 503 },
  );
}

function mapOutboxError(error: unknown) {
  if (error instanceof IntakeOutboxUnavailableError) {
    return unavailableResponse();
  }

  const message = error instanceof Error ? error.message : "unknown error";
  console.error("Intake outbox route failure", { message });
  return unavailableResponse();
}

function transitionResponse(result: OutboundMessageTransitionResult) {
  if (result.ok) {
    return NextResponse.json({
      ok: true,
      mode: "dry_run",
      result,
    });
  }

  const status = result.reason === "not_found" ? 404 : 409;
  return NextResponse.json(
    {
      ok: false,
      mode: "dry_run",
      result,
    },
    { status },
  );
}

export async function GET(request: Request) {
  // Local/test-only contract route. Production and normal traffic see a 404.
  if (!isDryRunRequest(request)) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  const url = new URL(request.url);
  const channel = parseOptionalChannel(url.searchParams.get("channel"));
  if (isBadRequest(channel)) {
    return NextResponse.json(channel, { status: 400 });
  }

  const limit = parseOptionalLimit(url.searchParams.get("limit"));
  if (isBadRequest(limit)) {
    return NextResponse.json(limit, { status: 400 });
  }

  try {
    const messages = await listPendingOutboundDrafts({
      ...(channel ? { channel } : {}),
      ...(limit ? { limit } : {}),
    });

    return NextResponse.json({
      ok: true,
      mode: "dry_run",
      messages,
    });
  } catch (error) {
    return mapOutboxError(error);
  }
}

export async function POST(request: Request) {
  // Local/test-only contract route. Production and normal traffic see a 404.
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
    return NextResponse.json({ ok: false, error: "Bad Request: invalid payload" }, { status: 400 });
  }

  if (!isRecord(body)) {
    return NextResponse.json({ ok: false, error: "Bad Request: invalid payload" }, { status: 400 });
  }

  const action = parseAction(body.action);
  const messageId = typeof body.messageId === "string" ? body.messageId.trim() : "";
  if (!action || !messageId) {
    return NextResponse.json({ ok: false, error: "Bad Request: invalid payload" }, { status: 400 });
  }

  try {
    const result =
      action === "approve"
        ? await approveOutboundDraftMessage({ messageId })
        : await queueApprovedOutboundMessage({ messageId });

    return transitionResponse(result);
  } catch (error) {
    return mapOutboxError(error);
  }
}
