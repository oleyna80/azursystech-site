import type { Pool, PoolClient } from "pg";

import {
  INTAKE_CHANNELS,
  type IntakeBriefDraft,
  type IntakeChannel,
  type IntakeConversationState,
} from "@/lib/intake/types";
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
  type IntakeOutboxMessage,
  type IntakeOutboxStore,
  type IntakeAdminNotificationStatus,
  type IntakeBriefPersistenceStatus,
  type IntakeSheetsMirrorStatus,
  type ListPendingOutboundDraftsInput,
  type ListQueuedOutboundMessagesInput,
  type LoadIntakeConversationInput,
  type MarkOutboundMessageFailedInput,
  type MarkOutboundMessageSentInput,
  type OutboundMessageTransitionResult,
  type PersistIntakeDecisionInput,
  type PersistIntakeDecisionResult,
  type TransitionOutboundMessageInput,
} from "@/lib/intake/persistence";

type ConversationStateRow = {
  id: string;
  brief_draft: unknown;
};

type IdempotencyKeyRow = {
  idempotency_key: string;
};

type InsertedMessageRow = {
  id: string;
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

type OutboxMessageRow = {
  message_id: string;
  conversation_id: string;
  idempotency_key: string;
  provider_message_id: string | null;
  direction: string;
  channel: string;
  author_type: string;
  status: string;
  body: string;
  created_at_utc: Date;
  approved_at_utc: Date | null;
  sent_at_utc: Date | null;
  conversation_key: string;
  sender_key: string;
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

function isIntakeChannel(value: string): value is IntakeChannel {
  return (INTAKE_CHANNELS as readonly string[]).includes(value);
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

export class SqlIntakeOutboxStore implements IntakeOutboxStore {
  constructor(private readonly pool: Pool) {}

  async listPendingOutboundDrafts(
    input: ListPendingOutboundDraftsInput = {},
  ): Promise<IntakeOutboxMessage[]> {
    const limit = normalizeOutboxLimit(input.limit);
    const params: Array<string | number> = [];
    const channelFilter = input.channel ? "AND m.channel = $2" : "";

    params.push(limit);
    if (input.channel) {
      params.push(input.channel);
    }

    const result = await this.pool.query<OutboxMessageRow>(
      `
        SELECT
          m.id::text AS message_id,
          m.conversation_id,
          m.idempotency_key,
          m.provider_message_id,
          m.direction,
          m.channel,
          m.author_type,
          m.status,
          m.body,
          m.created_at AS created_at_utc,
          m.approved_at AS approved_at_utc,
          m.sent_at AS sent_at_utc,
          c.conversation_key,
          c.sender_key
        FROM intake_channel_messages m
        JOIN intake_channel_conversations c ON c.id = m.conversation_id
        WHERE m.direction = 'outbound'
          AND m.author_type = 'assistant'
          AND m.status = 'draft'
          ${channelFilter}
        ORDER BY m.created_at ASC
        LIMIT $1
      `,
      params,
    );

    return result.rows.map(toOutboxMessage);
  }

  async approveOutboundDraftMessage(
    input: TransitionOutboundMessageInput,
  ): Promise<OutboundMessageTransitionResult> {
    return transitionOutboundMessage(this.pool, input.messageId, {
      fromStatus: "draft",
      toStatus: "approved",
      alreadyStatus: "approved",
      transition: "approved",
      alreadyTransition: "already_approved",
      timestampColumn: "approved_at",
    });
  }

  async queueApprovedOutboundMessage(
    input: TransitionOutboundMessageInput,
  ): Promise<OutboundMessageTransitionResult> {
    return transitionOutboundMessage(this.pool, input.messageId, {
      fromStatus: "approved",
      toStatus: "queued",
      alreadyStatus: "queued",
      transition: "queued",
      alreadyTransition: "already_queued",
    });
  }

  async listQueuedOutboundMessages(
    input: ListQueuedOutboundMessagesInput = {},
  ): Promise<IntakeOutboxMessage[]> {
    const limit = normalizeOutboxLimit(input.limit);
    const params: Array<string | number> = [];
    const channelFilter = input.channel ? "AND m.channel = $2" : "";

    params.push(limit);
    if (input.channel) {
      params.push(input.channel);
    }

    const result = await this.pool.query<OutboxMessageRow>(
      `
        SELECT
          m.id::text AS message_id,
          m.conversation_id,
          m.idempotency_key,
          m.provider_message_id,
          m.direction,
          m.channel,
          m.author_type,
          m.status,
          m.body,
          m.created_at AS created_at_utc,
          m.approved_at AS approved_at_utc,
          m.sent_at AS sent_at_utc,
          c.conversation_key,
          c.sender_key
        FROM intake_channel_messages m
        JOIN intake_channel_conversations c ON c.id = m.conversation_id
        WHERE m.direction = 'outbound'
          AND m.author_type = 'assistant'
          AND m.status = 'queued'
          AND m.provider_message_id IS NULL
          ${channelFilter}
        ORDER BY m.created_at ASC
        LIMIT $1
      `,
      params,
    );

    return result.rows.map(toOutboxMessage);
  }

  async markOutboundMessageSent(
    input: MarkOutboundMessageSentInput,
  ): Promise<OutboundMessageTransitionResult> {
    return transitionOutboundMessage(this.pool, input.messageId, {
      fromStatus: "queued",
      toStatus: "sent",
      alreadyStatus: "sent",
      transition: "sent",
      alreadyTransition: "already_sent",
      timestampColumn: "sent_at",
      providerMessageId: input.providerMessageId,
    });
  }

  async markOutboundMessageFailed(
    input: MarkOutboundMessageFailedInput,
  ): Promise<OutboundMessageTransitionResult> {
    return transitionOutboundMessage(this.pool, input.messageId, {
      fromStatus: "queued",
      toStatus: "failed",
      alreadyStatus: "failed",
      transition: "failed",
      alreadyTransition: "already_failed",
    });
  }
}

export function createSqlIntakeOutboxStore(pool: Pool): IntakeOutboxStore {
  return new SqlIntakeOutboxStore(pool);
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
  const insertedMessage = typeof messageId === "string" && messageId.length > 0;

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

function normalizeOutboxLimit(limit: number | undefined): number {
  if (typeof limit !== "number" || !Number.isFinite(limit)) {
    return 50;
  }

  return Math.min(Math.max(Math.trunc(limit), 1), 100);
}

function toUtcIsoString(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function toNullableUtcIsoString(value: Date | string | null): string | null {
  return value === null ? null : toUtcIsoString(value);
}

function toOutboxMessage(row: OutboxMessageRow): IntakeOutboxMessage {
  if (row.direction !== "outbound") {
    throw new Error(`Unexpected intake outbox direction: ${row.direction}`);
  }

  if (
    row.author_type !== "assistant" &&
    row.author_type !== "manager" &&
    row.author_type !== "system"
  ) {
    throw new Error(`Unexpected intake outbox author type: ${row.author_type}`);
  }

  if (
    row.status !== "draft" &&
    row.status !== "approved" &&
    row.status !== "queued" &&
    row.status !== "sent" &&
    row.status !== "failed"
  ) {
    throw new Error(`Unexpected intake outbox status: ${row.status}`);
  }

  if (!isIntakeChannel(row.channel)) {
    throw new Error(`Unexpected intake outbox channel: ${row.channel}`);
  }

  return {
    messageId: row.message_id,
    conversationId: row.conversation_id,
    channel: row.channel,
    conversationKey: row.conversation_key,
    senderKey: row.sender_key,
    idempotencyKey: row.idempotency_key,
    ...(row.provider_message_id ? { providerMessageId: row.provider_message_id } : {}),
    direction: row.direction,
    authorType: row.author_type,
    status: row.status,
    body: row.body,
    createdAtUtc: toUtcIsoString(row.created_at_utc),
    approvedAtUtc: toNullableUtcIsoString(row.approved_at_utc),
    sentAtUtc: toNullableUtcIsoString(row.sent_at_utc),
  };
}

type TransitionOptions = {
  fromStatus: "draft" | "approved" | "queued";
  toStatus: "approved" | "queued" | "sent" | "failed";
  alreadyStatus: "approved" | "queued" | "sent" | "failed";
  transition: "approved" | "queued" | "sent" | "failed";
  alreadyTransition:
    | "already_approved"
    | "already_queued"
    | "already_sent"
    | "already_failed";
  timestampColumn?: "approved_at" | "sent_at";
  providerMessageId?: string;
};

async function transitionOutboundMessage(
  pool: Pool,
  messageId: string,
  options: TransitionOptions,
): Promise<OutboundMessageTransitionResult> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const current = await findOutboxMessageByIdForUpdate(client, messageId);
    if (!current) {
      await client.query("COMMIT");
      return { ok: false, reason: "not_found" };
    }

    if (current.status === options.alreadyStatus) {
      await client.query("COMMIT");
      return {
        ok: true,
        transition: options.alreadyTransition,
        message: toOutboxMessage(current),
      };
    }

    if (current.status !== options.fromStatus) {
      await client.query("COMMIT");
      return {
        ok: false,
        reason: "invalid_transition",
        currentStatus: toOutboxMessage(current).status,
        message: toOutboxMessage(current),
      };
    }

    const updated = await updateOutboxMessageStatus(client, messageId, options);
    await client.query("COMMIT");

    return {
      ok: true,
      transition: options.transition,
      message: toOutboxMessage(updated),
    };
  } catch (error) {
    await rollbackQuietly(client);
    throw error;
  } finally {
    client.release();
  }
}

async function findOutboxMessageByIdForUpdate(
  client: PoolClient,
  messageId: string,
): Promise<OutboxMessageRow | null> {
  const result = await client.query<OutboxMessageRow>(
    `
      SELECT
        m.id::text AS message_id,
        m.conversation_id,
        m.idempotency_key,
        m.provider_message_id,
        m.direction,
        m.channel,
        m.author_type,
        m.status,
        m.body,
        m.created_at AS created_at_utc,
        m.approved_at AS approved_at_utc,
        m.sent_at AS sent_at_utc,
        c.conversation_key,
        c.sender_key
      FROM intake_channel_messages m
      JOIN intake_channel_conversations c ON c.id = m.conversation_id
      WHERE m.id = $1
        AND m.direction = 'outbound'
        AND m.author_type = 'assistant'
      FOR UPDATE
    `,
    [messageId],
  );

  return result.rows[0] ?? null;
}

async function updateOutboxMessageStatus(
  client: PoolClient,
  messageId: string,
  options: TransitionOptions,
): Promise<OutboxMessageRow> {
  const timestampAssignment =
    options.timestampColumn === "approved_at"
      ? ", approved_at = COALESCE(approved_at, NOW())"
      : options.timestampColumn === "sent_at"
        ? ", sent_at = COALESCE(sent_at, NOW())"
        : "";
  const providerMessageAssignment = options.providerMessageId
    ? ", provider_message_id = COALESCE(provider_message_id, $3)"
    : "";

  const result = await client.query<OutboxMessageRow>(
    `
      UPDATE intake_channel_messages
      SET status = $2${timestampAssignment}${providerMessageAssignment}
      WHERE id = $1
      RETURNING
        id::text AS message_id,
        conversation_id,
        idempotency_key,
        provider_message_id,
        direction,
        channel,
        author_type,
        status,
        body,
        created_at AS created_at_utc,
        approved_at AS approved_at_utc,
        sent_at AS sent_at_utc,
        (
          SELECT conversation_key
          FROM intake_channel_conversations
          WHERE id = intake_channel_messages.conversation_id
        ) AS conversation_key,
        (
          SELECT sender_key
          FROM intake_channel_conversations
          WHERE id = intake_channel_messages.conversation_id
        ) AS sender_key
    `,
    options.providerMessageId
      ? [messageId, options.toStatus, options.providerMessageId]
      : [messageId, options.toStatus],
  );

  const updated = result.rows[0];
  if (!updated) {
    throw new Error("Failed to update intake outbox message status");
  }

  return updated;
}
