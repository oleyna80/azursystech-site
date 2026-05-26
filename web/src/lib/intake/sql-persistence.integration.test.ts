import { Pool } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import type { SaveIntakeBriefInput } from "@/lib/intake/briefs";
import { closeIntakeDatabasePoolForTests } from "@/lib/intake/config";
import type { PersistIntakeDecisionInput } from "@/lib/intake/persistence";
import {
  createSqlIntakeBriefStore,
  createSqlIntakePersistenceStore,
} from "@/lib/intake/sql-persistence";
import { runWebChatIntake } from "@/lib/web-chat/intake";

const databaseUrl = process.env.INTAKE_SQL_INTEGRATION_DATABASE_URL;
const runIntegration = databaseUrl ? describe : describe.skip;

const baseBriefInput = {
  idempotencyKey: "brief_form:r1-smoke",
  source: "brief_form",
  status: "submitted",
  locale: "fr",
  payload: {
    preferredLanguage: "fr",
    missingFields: ["contact_hint"],
  },
  metadata: {
    smoke: "r1",
  },
  submittedAtUtc: "2026-05-24T12:00:00.000Z",
} satisfies SaveIntakeBriefInput;

runIntegration("SqlIntake persistence integration", () => {
  let pool: Pool;
  let previousDatabaseUrl: string | undefined;
  let previousStorageMode: string | undefined;

  beforeAll(async () => {
    previousDatabaseUrl = process.env.DATABASE_URL;
    previousStorageMode = process.env.INTAKE_STORAGE_MODE;
    process.env.DATABASE_URL = databaseUrl;
    process.env.INTAKE_STORAGE_MODE = "sql_primary";

    pool = new Pool({ connectionString: databaseUrl });
    await pool.query(`
      TRUNCATE
        intake_briefs,
        intake_channel_decisions,
        intake_channel_messages,
        intake_channel_conversations
      RESTART IDENTITY CASCADE
    `);
  });

  afterAll(async () => {
    await pool.end();
    await closeIntakeDatabasePoolForTests();
    if (previousDatabaseUrl === undefined) {
      delete process.env.DATABASE_URL;
    } else {
      process.env.DATABASE_URL = previousDatabaseUrl;
    }
    if (previousStorageMode === undefined) {
      delete process.env.INTAKE_STORAGE_MODE;
    } else {
      process.env.INTAKE_STORAGE_MODE = previousStorageMode;
    }
  });

  it("persists brief form submissions idempotently and rejects missing conversations", async () => {
    const store = createSqlIntakeBriefStore(pool);

    const inserted = await store.saveBrief(baseBriefInput);
    const duplicate = await store.saveBrief(baseBriefInput);

    expect(inserted).toMatchObject({
      status: "submitted",
      inserted: true,
    });
    expect(duplicate).toEqual({
      ...inserted,
      inserted: false,
    });

    await expect(
      store.saveBrief({
        ...baseBriefInput,
        idempotencyKey: "brief_form:missing-conversation",
        conversationId: "conversation:missing",
      }),
    ).rejects.toMatchObject({
      name: "IntakeBriefConversationNotFoundError",
      conversationId: "conversation:missing",
    });
  });

  it("persists an agent-created draft brief inside the decision transaction", async () => {
    const store = createSqlIntakePersistenceStore(pool);
    const input = {
      message: {
        channel: "web_chat",
        conversationKey: "r1-smoke-conversation",
        senderKey: "web_chat:user:1",
        receivedAtUtc: "2026-05-24T12:05:00.000Z",
        text: "Need automation for incoming requests.",
        locale: "fr",
      },
      decision: {
        action: "mark_brief_ready",
        idempotencyKey: "web_chat:r1-smoke:1",
        assistantReply: "Merci, je peux transmettre ces elements.",
        briefDraft: {
          problemStatement: "Need automation for incoming requests.",
          city: "Paris",
          preferredLanguage: "fr",
          missingFields: [],
          contactCtaState: "accepted",
          nextStep: "brief",
        },
        safety: {
          deflectedCommitment: false,
          detectedContactInChat: false,
          detectedConfidentialInput: false,
          deflectedUnsafeRequest: false,
          duplicateProviderEvent: false,
          sanitizedForLogs: true,
        },
        rateLimit: {
          status: "deferred_to_channel_route",
          key: "web_chat:r1-smoke-conversation",
        },
      },
    } satisfies PersistIntakeDecisionInput;

    const firstResult = await store.persistDecision(input);
    const duplicateResult = await store.persistDecision(input);
    const briefResult = await pool.query<{
      status: string;
      source: string;
      conversation_id: string | null;
      payload_problem: string | null;
    }>(
      `
        SELECT status, source, conversation_id, payload->>'problemStatement' AS payload_problem
        FROM intake_briefs
        WHERE source = 'web_chat'
      `,
    );
    const countsResult = await pool.query<{ count: string }>(
      `
        SELECT COUNT(*)::text AS count
        FROM intake_briefs
        WHERE source = 'web_chat'
      `,
    );

    expect(firstResult).toMatchObject({
      insertedMessage: true,
      duplicateProviderEvent: false,
      briefStatus: "ready",
    });
    expect(duplicateResult).toMatchObject({
      insertedMessage: false,
      duplicateProviderEvent: true,
      briefStatus: "ready",
    });
    expect(countsResult.rows[0]?.count).toBe("1");
    expect(briefResult.rows[0]).toMatchObject({
      status: "draft",
      source: "web_chat",
      payload_problem: "Need automation for incoming requests.",
    });
    expect(briefResult.rows[0]?.conversation_id).toBeTruthy();
  });

  it("persists SQL-backed web-chat turns with restored diagnostic state and redacted raw input", async () => {
    const conversationKey = "web-chat-sql-two-turn";
    const senderKey = "web-chat-sql-user";

    const firstTurn = await runWebChatIntake({
      message: "Здравствуйте",
      locale: "ru",
      conversationKey,
      senderKey,
      providerMessageId: "web-chat-sql-two-turn:1",
    });
    const secondTurn = await runWebChatIntake({
      message: "Пока не знаю",
      locale: "ru",
      conversationKey,
      senderKey,
      providerMessageId: "web-chat-sql-two-turn:2",
    });
    const privateTurn = await runWebChatIntake({
      message: "Мой email dmitrii@example.com, пароль hunter2, телефон +33 7 80 72 09 94",
      locale: "ru",
      conversationKey: "web-chat-sql-redacted",
      senderKey: "web-chat-sql-redacted-user",
      providerMessageId: "web-chat-sql-redacted:1",
    });

    expect(firstTurn).toMatchObject({
      ok: true,
      decision: {
        briefDraft: {
          diagnosticTurnCount: 1,
          nextStep: "clarify",
        },
      },
    });
    expect(secondTurn).toMatchObject({
      ok: true,
      decision: {
        briefDraft: {
          diagnosticTurnCount: 2,
          contactCtaState: "offered",
          nextStep: "contact_form",
        },
      },
    });
    expect(privateTurn).toMatchObject({
      ok: true,
      decision: {
        safety: {
          detectedContactInChat: true,
          detectedConfidentialInput: true,
        },
      },
    });

    const redactedResult = await pool.query<{
      body: string;
      raw_message: string | null;
    }>(
      `
        SELECT m.body, m.raw_payload->>'message' AS raw_message
        FROM intake_channel_messages m
        JOIN intake_channel_conversations c ON c.id = m.conversation_id
        WHERE c.conversation_key = 'web-chat-sql-redacted'
          AND m.direction = 'inbound'
        LIMIT 1
      `,
    );
    const redactedRow = redactedResult.rows[0];

    expect(redactedRow?.body).toContain("[contact]");
    expect(redactedRow?.body).toContain("[sensitive]");
    expect(redactedRow?.body).not.toContain("dmitrii@example.com");
    expect(redactedRow?.body).not.toContain("hunter2");
    expect(redactedRow?.raw_message).toContain("[contact]");
    expect(redactedRow?.raw_message).toContain("[sensitive]");
    expect(redactedRow?.raw_message).not.toContain("dmitrii@example.com");
    expect(redactedRow?.raw_message).not.toContain("hunter2");
  });
});
