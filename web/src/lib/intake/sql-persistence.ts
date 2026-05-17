import type { Pool, PoolClient } from "pg";

import {
  INTAKE_ADMIN_NOTIFICATION_STATUSES,
  INTAKE_BRIEF_STATUSES,
  INTAKE_PERSISTENCE_SCHEMA_VERSION,
  INTAKE_SHEETS_MIRROR_STATUSES,
  buildIntakeConversationSnapshot,
  buildIntakeDecisionEventRecord,
  buildIntakeMessageEventRecord,
  buildIntakeOutboundDraftRecord,
  resolveAdminNotificationStatus,
  resolveBriefPersistenceStatus,
  resolveSheetsMirrorStatus,
  type IntakePersistenceStore,
  type IntakeAdminNotificationStatus,
  type IntakeBriefPersistenceStatus,
  type IntakeSheetsMirrorStatus,
  type LoadIntakeConversationInput,
  type PersistIntakeDecisionInput,
  type PersistIntakeDecisionResult,
} from "@/lib/intake/persistence";
import type { IntakeBriefDraft, IntakeConversationState } from "@/lib/intake/types";

type ConversationStateRow = {
  id: string;
  brief_draft: unknown;
};

type IdempotencyKeyRow = {
  idempotency_key: string;
};

type InsertedMessageRow = {
  id: number;
};

type ConversationIdRow = {
  id: string;
};

type ConversationStatusRow = {
  brief_status: string;
  admin_notification_status: string;
  sheets_mirror_status: string;
};

type ExistingMessageRow = ConversationStatusRow & {
  conversation_id: string;
};

function buildConversationId(input: LoadIntakeConversationInput): string {
  return `${input.channel}:${input.conversationKey}`;
}

function parseBriefDraft(value: unknown): IntakeConversationState["briefDraft"] | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }

  const draft = value as Partial<IntakeBriefDraft>;

  return {
    ...(typeof draft.problemStatement === "string"
      ? { problemStatement: draft.problemStatement }
      : {}),
    ...(typeof draft.contactHint === "string" ? { contactHint: draft.contactHint } : {}),
    ...(typeof draft.city === "string" ? { city: draft.city } : {}),
    ...(draft.preferredLanguage === "fr" ||
    draft.preferredLanguage === "ru" ||
    draft.preferredLanguage === "unknown"
      ? { preferredLanguage: draft.preferredLanguage }
      : {}),
  };
}

function toJson(value: unknown): string {
  return JSON.stringify(value ?? {});
}

function toNullableJson(value: unknown): string | null {
  return value === undefined || value === null ? null : JSON.stringify(value);
}

function isBriefStatus(value: string): value is IntakeBriefPersistenceStatus {
  return INTAKE_BRIEF_STATUSES.includes(value as IntakeBriefPersistenceStatus);
}

function isAdminNotificationStatus(value: string): value is IntakeAdminNotificationStatus {
  return INTAKE_ADMIN_NOTIFICATION_STATUSES.includes(
    value as IntakeAdminNotificationStatus,
  );
}

function isSheetsMirrorStatus(value: string): value is IntakeSheetsMirrorStatus {
  return INTAKE_SHEETS_MIRROR_STATUSES.includes(value as IntakeSheetsMirrorStatus);
}

async function rollbackQuietly(client: PoolClient): Promise<void> {
  try {
    await client.query("ROLLBACK");
  } catch {
    // Preserve the original transaction error.
  }
}

export class SqlIntakePersistenceStore implements IntakePersistenceStore {
  constructor(private readonly pool: Pool) {}

  async loadConversationState(
    input: LoadIntakeConversationInput,
  ): Promise<IntakeConversationState | null> {
    const conversationResult = await this.pool.query<ConversationStateRow>(
      `
        SELECT id, brief_draft
        FROM intake_channel_conversations
        WHERE channel = $1 AND conversation_key = $2
        LIMIT 1
      `,
      [input.channel, input.conversationKey],
    );
    const conversation = conversationResult.rows[0];

    if (!conversation) {
      return null;
    }

    const keyResult = await this.pool.query<IdempotencyKeyRow>(
      `
        SELECT idempotency_key
        FROM intake_channel_messages
        WHERE conversation_id = $1 AND direction = 'inbound'
        ORDER BY received_at_utc DESC
        LIMIT 100
      `,
      [conversation.id],
    );
    const seenIdempotencyKeys = keyResult.rows.map((row) => row.idempotency_key);
    const briefDraft = parseBriefDraft(conversation.brief_draft);

    return {
      ...(briefDraft ? { briefDraft } : {}),
      ...(seenIdempotencyKeys.length > 0 ? { seenIdempotencyKeys } : {}),
    };
  }

  async persistDecision(input: PersistIntakeDecisionInput): Promise<PersistIntakeDecisionResult> {
    const client = await this.pool.connect();

    try {
      await client.query("BEGIN");
      const result = await persistDecisionInTransaction(client, input);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await rollbackQuietly(client);
      throw error;
    } finally {
      client.release();
    }
  }
}

export function createSqlIntakePersistenceStore(pool: Pool): IntakePersistenceStore {
  return new SqlIntakePersistenceStore(pool);
}

async function persistDecisionInTransaction(
  client: PoolClient,
  input: PersistIntakeDecisionInput,
): Promise<PersistIntakeDecisionResult> {
  const { message, decision } = input;
  const conversationSnapshot = buildIntakeConversationSnapshot(message, decision);
  const messageRecord = buildIntakeMessageEventRecord(message, decision);
  const decisionRecord = buildIntakeDecisionEventRecord(message, decision);
  const conversationId = buildConversationId(message);
  const fallbackStatuses = resolvePersistenceStatuses(decision);

  const existingMessage = await findExistingMessageByIdempotencyKey(
    client,
    decision.idempotencyKey,
  );

  if (existingMessage) {
    return {
      conversationKey: message.conversationKey,
      idempotencyKey: decision.idempotencyKey,
      insertedMessage: false,
      duplicateProviderEvent: true,
      ...resolveStatusesFromRow(existingMessage, fallbackStatuses),
    };
  }

  if (decision.action === "duplicate_ignored") {
    const currentStatuses = await findConversationStatuses(
      client,
      conversationSnapshot.channel,
      conversationSnapshot.conversationKey,
    );

    return {
      conversationKey: message.conversationKey,
      idempotencyKey: decision.idempotencyKey,
      insertedMessage: false,
      duplicateProviderEvent: true,
      ...(currentStatuses
        ? resolveStatusesFromRow(currentStatuses, fallbackStatuses)
        : fallbackStatuses),
    };
  }

  const persistedConversationId = await ensureConversation(
    client,
    conversationId,
    conversationSnapshot,
  );

  const messageResult = await client.query<InsertedMessageRow>(
    `
      INSERT INTO intake_channel_messages (
        schema_version,
        conversation_id,
        idempotency_key,
        provider_update_id,
        provider_message_id,
        direction,
        role,
        channel,
        author_type,
        status,
        message_text,
        body,
        raw_payload,
        normalized_payload,
        received_at_utc,
        sent_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, 'user', $7, $8, $9, $10, $10, $11::jsonb, $12::jsonb, $13, $13)
      ON CONFLICT (idempotency_key)
      DO NOTHING
      RETURNING id
    `,
    [
      messageRecord.schemaVersion,
      persistedConversationId,
      messageRecord.idempotencyKey,
      messageRecord.providerUpdateId ?? null,
      messageRecord.providerMessageId ?? null,
      messageRecord.direction,
      messageRecord.channel,
      messageRecord.authorType,
      messageRecord.status,
      messageRecord.body,
      toJson(input.rawProviderPayload),
      toJson(messageRecord),
      messageRecord.receivedAtUtc,
    ],
  );
  const messageId = messageResult.rows[0]?.id;
  const insertedMessage = typeof messageId === "number";

  if (!insertedMessage) {
    const currentStatuses = await findConversationStatusesById(
      client,
      persistedConversationId,
    );

    return {
      conversationKey: message.conversationKey,
      idempotencyKey: decision.idempotencyKey,
      insertedMessage: false,
      duplicateProviderEvent: true,
      ...(currentStatuses
        ? resolveStatusesFromRow(currentStatuses, fallbackStatuses)
        : fallbackStatuses),
    };
  }

  await updateConversationSnapshot(client, persistedConversationId, conversationSnapshot);

  await client.query(
    `
      INSERT INTO intake_channel_decisions (
        schema_version,
        conversation_id,
        message_id,
        idempotency_key,
        action,
        brief_status,
        brief_draft,
        safety_flags,
        assistant_reply,
        admin_notification_status,
        admin_notification,
        sheets_mirror_status,
        sheets_mirror
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb, $9, $10, $11::jsonb, $12, $13::jsonb)
    `,
    [
      decisionRecord.schemaVersion,
      persistedConversationId,
      messageId,
      decisionRecord.idempotencyKey,
      decisionRecord.action,
      decisionRecord.briefStatus,
      toJson(decisionRecord.briefDraft),
      toJson(decisionRecord.safetyFlags),
      decisionRecord.assistantReply,
      decisionRecord.adminNotificationStatus,
      toNullableJson(decisionRecord.adminNotification),
      decisionRecord.sheetsMirrorStatus,
      toNullableJson(decisionRecord.sheetsMirror),
    ],
  );

  await insertOutboundDraftMessage(
    client,
    persistedConversationId,
    buildIntakeOutboundDraftRecord(message, decision),
  );

  return {
    conversationKey: message.conversationKey,
    idempotencyKey: decision.idempotencyKey,
    insertedMessage: true,
    duplicateProviderEvent: decision.safety.duplicateProviderEvent,
    ...fallbackStatuses,
  };
}

async function insertOutboundDraftMessage(
  client: PoolClient,
  conversationId: string,
  draftRecord: ReturnType<typeof buildIntakeOutboundDraftRecord>,
): Promise<void> {
  if (!draftRecord) {
    return;
  }

  await client.query(
    `
      INSERT INTO intake_channel_messages (
        schema_version,
        conversation_id,
        idempotency_key,
        direction,
        role,
        channel,
        author_type,
        status,
        message_text,
        body,
        raw_payload,
        normalized_payload,
        received_at_utc
      )
      VALUES ($1, $2, $3, $4, 'assistant', $5, $6, $7, $8, $8, '{}'::jsonb, $9::jsonb, NOW())
      ON CONFLICT (idempotency_key)
      DO NOTHING
    `,
    [
      draftRecord.schemaVersion,
      conversationId,
      draftRecord.idempotencyKey,
      draftRecord.direction,
      draftRecord.channel,
      draftRecord.authorType,
      draftRecord.status,
      draftRecord.body,
      toJson(draftRecord),
    ],
  );
}

function resolvePersistenceStatuses(decision: PersistIntakeDecisionInput["decision"]): {
  briefStatus: IntakeBriefPersistenceStatus;
  adminNotificationStatus: IntakeAdminNotificationStatus;
  sheetsMirrorStatus: IntakeSheetsMirrorStatus;
} {
  return {
    briefStatus: resolveBriefPersistenceStatus(decision),
    adminNotificationStatus: resolveAdminNotificationStatus(decision),
    sheetsMirrorStatus: resolveSheetsMirrorStatus(decision),
  };
}

function resolveStatusesFromRow(
  row: ConversationStatusRow,
  fallback: ReturnType<typeof resolvePersistenceStatuses>,
): ReturnType<typeof resolvePersistenceStatuses> {
  return {
    briefStatus: isBriefStatus(row.brief_status) ? row.brief_status : fallback.briefStatus,
    adminNotificationStatus: isAdminNotificationStatus(row.admin_notification_status)
      ? row.admin_notification_status
      : fallback.adminNotificationStatus,
    sheetsMirrorStatus: isSheetsMirrorStatus(row.sheets_mirror_status)
      ? row.sheets_mirror_status
      : fallback.sheetsMirrorStatus,
  };
}

async function findExistingMessageByIdempotencyKey(
  client: PoolClient,
  idempotencyKey: string,
): Promise<ExistingMessageRow | null> {
  const result = await client.query<ExistingMessageRow>(
    `
      SELECT
        m.conversation_id,
        c.brief_status,
        c.admin_notification_status,
        c.sheets_mirror_status
      FROM intake_channel_messages m
      JOIN intake_channel_conversations c ON c.id = m.conversation_id
      WHERE m.idempotency_key = $1
      LIMIT 1
    `,
    [idempotencyKey],
  );

  return result.rows[0] ?? null;
}

async function findConversationStatuses(
  client: PoolClient,
  channel: string,
  conversationKey: string,
): Promise<ConversationStatusRow | null> {
  const result = await client.query<ConversationStatusRow>(
    `
      SELECT brief_status, admin_notification_status, sheets_mirror_status
      FROM intake_channel_conversations
      WHERE channel = $1 AND conversation_key = $2
      LIMIT 1
    `,
    [channel, conversationKey],
  );

  return result.rows[0] ?? null;
}

async function findConversationStatusesById(
  client: PoolClient,
  conversationId: string,
): Promise<ConversationStatusRow | null> {
  const result = await client.query<ConversationStatusRow>(
    `
      SELECT brief_status, admin_notification_status, sheets_mirror_status
      FROM intake_channel_conversations
      WHERE id = $1
      LIMIT 1
    `,
    [conversationId],
  );

  return result.rows[0] ?? null;
}

async function ensureConversation(
  client: PoolClient,
  conversationId: string,
  conversationSnapshot: ReturnType<typeof buildIntakeConversationSnapshot>,
): Promise<string> {
  const result = await client.query<ConversationIdRow>(
    `
      INSERT INTO intake_channel_conversations (
        id,
        schema_version,
        channel,
        conversation_key,
        sender_key,
        locale,
        brief_status,
        brief_draft,
        admin_notification_status,
        admin_notification,
        sheets_mirror_status,
        sheets_mirror,
        updated_at,
        last_message_at
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, $10::jsonb, $11, $12::jsonb, NOW(), $13
      )
      ON CONFLICT (channel, conversation_key)
      DO NOTHING
      RETURNING id
    `,
    [
      conversationId,
      INTAKE_PERSISTENCE_SCHEMA_VERSION,
      conversationSnapshot.channel,
      conversationSnapshot.conversationKey,
      conversationSnapshot.senderKey,
      conversationSnapshot.locale,
      conversationSnapshot.briefStatus,
      toJson(conversationSnapshot.briefDraft),
      conversationSnapshot.adminNotificationStatus,
      toNullableJson(conversationSnapshot.adminNotification),
      conversationSnapshot.sheetsMirrorStatus,
      toNullableJson(conversationSnapshot.sheetsMirror),
      conversationSnapshot.lastMessageAtUtc,
    ],
  );

  if (result.rows[0]?.id) {
    return result.rows[0].id;
  }

  const existingResult = await client.query<ConversationIdRow>(
    `
      SELECT id
      FROM intake_channel_conversations
      WHERE channel = $1 AND conversation_key = $2
      LIMIT 1
    `,
    [conversationSnapshot.channel, conversationSnapshot.conversationKey],
  );
  const existingConversationId = existingResult.rows[0]?.id;

  if (!existingConversationId) {
    throw new Error("Failed to resolve intake conversation after insert conflict");
  }

  return existingConversationId;
}

async function updateConversationSnapshot(
  client: PoolClient,
  persistedConversationId: string,
  conversationSnapshot: ReturnType<typeof buildIntakeConversationSnapshot>,
): Promise<void> {
  await client.query(
    `
      UPDATE intake_channel_conversations
      SET
        schema_version = $1,
        sender_key = $2,
        locale = $3,
        brief_status = $4,
        brief_draft = $5::jsonb,
        admin_notification_status = $6,
        admin_notification = $7::jsonb,
        sheets_mirror_status = $8,
        sheets_mirror = $9::jsonb,
        updated_at = NOW(),
        last_message_at = $10
      WHERE id = $11
    `,
    [
      INTAKE_PERSISTENCE_SCHEMA_VERSION,
      conversationSnapshot.senderKey,
      conversationSnapshot.locale,
      conversationSnapshot.briefStatus,
      toJson(conversationSnapshot.briefDraft),
      conversationSnapshot.adminNotificationStatus,
      toNullableJson(conversationSnapshot.adminNotification),
      conversationSnapshot.sheetsMirrorStatus,
      toNullableJson(conversationSnapshot.sheetsMirror),
      conversationSnapshot.lastMessageAtUtc,
      persistedConversationId,
    ],
  );
}
