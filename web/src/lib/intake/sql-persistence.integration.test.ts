import { Pool } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import type { SaveIntakeBriefInput } from "@/lib/intake/briefs";
import type { PersistIntakeDecisionInput } from "@/lib/intake/persistence";
import {
  createSqlIntakeBriefStore,
  createSqlIntakePersistenceStore,
} from "@/lib/intake/sql-persistence";

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

  beforeAll(async () => {
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
        channel: "telegram",
        conversationKey: "r1-smoke-conversation",
        senderKey: "telegram:user:1",
        receivedAtUtc: "2026-05-24T12:05:00.000Z",
        text: "Need automation for incoming requests.",
        locale: "fr",
      },
      decision: {
        action: "mark_brief_ready",
        idempotencyKey: "telegram:r1-smoke:1",
        assistantReply: "Merci, je peux transmettre ces elements.",
        briefDraft: {
          problemStatement: "Need automation for incoming requests.",
          contactHint: "owner@example.com",
          city: "Paris",
          preferredLanguage: "fr",
          missingFields: [],
          contactCtaState: "accepted",
          nextStep: "brief",
        },
        safety: {
          deflectedCommitment: false,
          duplicateProviderEvent: false,
          sanitizedForLogs: true,
        },
        rateLimit: {
          status: "deferred_to_channel_route",
          key: "telegram:r1-smoke-conversation",
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
        WHERE source = 'telegram'
      `,
    );
    const countsResult = await pool.query<{ count: string }>(
      `
        SELECT COUNT(*)::text AS count
        FROM intake_briefs
        WHERE source = 'telegram'
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
      source: "telegram",
      payload_problem: "Need automation for incoming requests.",
    });
    expect(briefResult.rows[0]?.conversation_id).toBeTruthy();
  });
});
