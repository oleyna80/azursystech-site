import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/telegram/dry-run", () => ({
  runTelegramIntakeDryRun: vi.fn(async () => ({
    ok: true as const,
    mode: "dry_run" as const,
    decision: { action: "archive", reason: "test" },
  })),
  runTelegramIntakeLiveReceive: vi.fn(async () => ({
    ok: true as const,
  })),
}));

import { POST } from "./route";
import { runTelegramIntakeLiveReceive } from "@/lib/telegram/dry-run";

afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});

function buildOversizedJsonBody(approxBytes: number): string {
  const pad = "x".repeat(Math.max(0, approxBytes - 50));
  return JSON.stringify({ update_id: 1, message: { text: pad, chat: { id: 1, type: "private" } } });
}

describe("POST /api/telegram/webhook", () => {
  it("returns 413 for oversized body without content-length", async () => {
    vi.stubEnv("NODE_ENV", "test");

    const body = buildOversizedJsonBody(55_000);
    const response = await POST(
      new Request("https://azursystech.fr/api/telegram/webhook", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-azursystech-dry-run": "true",
        },
        body,
      }),
    );

    expect(response.status).toBe(413);
  });

  it("returns 413 for oversized dry-run body with wrong content-length", async () => {
    vi.stubEnv("NODE_ENV", "test");

    const body = buildOversizedJsonBody(55_000);
    const response = await POST(
      new Request("https://azursystech.fr/api/telegram/webhook", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "content-length": "100",
          "x-azursystech-dry-run": "true",
        },
        body,
      }),
    );

    expect(response.status).toBe(413);
  });

  it("rejects live webhook requests with a missing or wrong secret before intake", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("TELEGRAM_WEBHOOK_RECEIVE_ENABLED", "true");
    vi.stubEnv("TELEGRAM_WEBHOOK_SECRET", "expected-secret");

    const response = await POST(
      new Request("https://azursystech.fr/api/telegram/webhook", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-telegram-bot-api-secret-token": "wrong",
        },
        body: JSON.stringify({
          update_id: 1,
          message: { text: "hello", chat: { id: 1, type: "private" }, from: { id: 2 } },
        }),
      }),
    );

    expect(response.status).toBe(404);
    expect(runTelegramIntakeLiveReceive).not.toHaveBeenCalled();
  });

  it("accepts live webhook requests with the exact configured secret", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("TELEGRAM_WEBHOOK_RECEIVE_ENABLED", "true");
    vi.stubEnv("TELEGRAM_WEBHOOK_SECRET", "expected-secret");

    const response = await POST(
      new Request("https://azursystech.fr/api/telegram/webhook", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-telegram-bot-api-secret-token": "expected-secret",
        },
        body: JSON.stringify({
          update_id: 1,
          message: { text: "hello", chat: { id: 1, type: "private" }, from: { id: 2 } },
        }),
      }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(runTelegramIntakeLiveReceive).toHaveBeenCalledTimes(1);
  });
});
