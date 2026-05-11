import crypto from "node:crypto";

import { queryAdminDb, withAdminDbClient } from "@/lib/db/pool";
import { canSchedulePost, isSocialPostStatus, type SocialPostStatus } from "@/modules/social/domain/status";
import type {
  CreateDraftPostInput,
  SchedulePostInput,
  SocialChannel,
  SocialChannelStatus,
  SocialChannelType,
  SocialPost,
  SocialPublishJob,
  SocialPublishJobStatus,
} from "@/modules/social/domain/types";

type SocialChannelRow = {
  id: string;
  type: SocialChannelType;
  status: SocialChannelStatus;
  display_name: string;
  external_account_id: string | null;
  metadata: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
};

type SocialPublishJobRow = {
  id: string;
  post_id: string;
  idempotency_key: string;
  status: SocialPublishJobStatus;
  attempts: number;
  last_error_code: string | null;
  last_error_message: string | null;
  created_at: Date;
  updated_at: Date;
};

type SocialPostRow = {
  id: string;
  channel_id: string;
  status: string;
  content: string;
  media: Record<string, unknown> | null;
  locale: string | null;
  scheduled_at: Date | null;
  published_at: Date | null;
  external_post_id: string | null;
  last_error_code: string | null;
  last_error_message: string | null;
  metadata: Record<string, unknown>;
  created_by: string | null;
  scheduled_by: string | null;
  created_at: Date;
  updated_at: Date;
};

function toIso(value: Date | string | null): string | null {
  if (!value) {
    return null;
  }

  return value instanceof Date ? value.toISOString() : value;
}

function mapChannel(row: SocialChannelRow): SocialChannel {
  return {
    id: row.id,
    type: row.type,
    status: row.status,
    displayName: row.display_name,
    externalAccountId: row.external_account_id,
    metadata: row.metadata ?? {},
    createdAt: toIso(row.created_at) ?? "",
    updatedAt: toIso(row.updated_at) ?? "",
  };
}

function mapPost(row: SocialPostRow): SocialPost {
  const status = isSocialPostStatus(row.status) ? row.status : "draft";

  return {
    id: row.id,
    channelId: row.channel_id,
    status,
    content: row.content,
    media: row.media,
    locale: row.locale,
    scheduledAt: toIso(row.scheduled_at),
    publishedAt: toIso(row.published_at),
    externalPostId: row.external_post_id,
    lastErrorCode: row.last_error_code,
    lastErrorMessage: row.last_error_message,
    metadata: row.metadata ?? {},
    createdBy: row.created_by,
    scheduledBy: row.scheduled_by,
    createdAt: toIso(row.created_at) ?? "",
    updatedAt: toIso(row.updated_at) ?? "",
  };
}

function mapPublishJob(row: SocialPublishJobRow): SocialPublishJob {
  return {
    id: row.id,
    postId: row.post_id,
    idempotencyKey: row.idempotency_key,
    status: row.status,
    attempts: row.attempts,
    lastErrorCode: row.last_error_code,
    lastErrorMessage: row.last_error_message,
    createdAt: toIso(row.created_at) ?? "",
    updatedAt: toIso(row.updated_at) ?? "",
  };
}

export async function upsertSocialChannel(input: {
  type: SocialChannelType;
  displayName: string;
  externalAccountId: string;
  metadata?: Record<string, unknown>;
}): Promise<SocialChannel> {
  const id = crypto.randomUUID();
  const result = await queryAdminDb<SocialChannelRow>(
    `
      INSERT INTO social_channels (
        id,
        type,
        status,
        display_name,
        external_account_id,
        metadata,
        created_at,
        updated_at
      )
      VALUES ($1, $2, 'active', $3, $4, $5::jsonb, now(), now())
      ON CONFLICT (type, external_account_id)
      DO UPDATE SET
        status = 'active',
        display_name = EXCLUDED.display_name,
        metadata = social_channels.metadata || EXCLUDED.metadata,
        updated_at = now()
      RETURNING *
    `,
    [
      id,
      input.type,
      input.displayName,
      input.externalAccountId,
      JSON.stringify(input.metadata ?? {}),
    ],
  );

  return mapChannel(result.rows[0]);
}

export async function listSocialChannels(): Promise<SocialChannel[]> {
  const result = await queryAdminDb<SocialChannelRow>(
    `
      SELECT *
      FROM social_channels
      ORDER BY created_at DESC
    `,
  );

  return result.rows.map(mapChannel);
}

export async function createDraftSocialPost(input: CreateDraftPostInput): Promise<SocialPost> {
  const id = crypto.randomUUID();
  const result = await withAdminDbClient(async (client) => {
    await client.query("BEGIN");

    try {
      const insertResult = await client.query<SocialPostRow>(
        `
          INSERT INTO social_posts (
            id,
            channel_id,
            status,
            content,
            media,
            locale,
            metadata,
            created_by,
            created_at,
            updated_at
          )
          VALUES ($1, $2, 'draft', $3, $4::jsonb, $5, $6::jsonb, $7, now(), now())
          RETURNING *
        `,
        [
          id,
          input.channelId,
          input.content,
          JSON.stringify(input.media ?? null),
          input.locale ?? null,
          JSON.stringify(input.metadata ?? {}),
          input.createdBy ?? null,
        ],
      );

      await client.query(
        `
          INSERT INTO social_events (id, source, external_event_id, event_type, payload, created_at)
          VALUES ($1, 'admin', NULL, 'draft_created', $2::jsonb, now())
        `,
        [
          crypto.randomUUID(),
          JSON.stringify({
            postId: id,
            actor: input.createdBy ?? "owner",
          }),
        ],
      );

      await client.query("COMMIT");
      return insertResult;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  });

  return mapPost(result.rows[0]);
}

export async function getSocialPostById(postId: string): Promise<SocialPost | null> {
  const result = await queryAdminDb<SocialPostRow>(
    `
      SELECT *
      FROM social_posts
      WHERE id = $1
      LIMIT 1
    `,
    [postId],
  );

  return result.rows[0] ? mapPost(result.rows[0]) : null;
}

export async function listSocialPosts(options: {
  status?: SocialPostStatus;
  limit?: number;
} = {}): Promise<SocialPost[]> {
  const limit = Math.min(Math.max(options.limit ?? 50, 1), 100);
  const values: unknown[] = [];
  let whereSql = "";

  if (options.status) {
    values.push(options.status);
    whereSql = "WHERE status = $1";
  }

  values.push(limit);
  const limitPlaceholder = `$${values.length}`;

  const result = await queryAdminDb<SocialPostRow>(
    `
      SELECT *
      FROM social_posts
      ${whereSql}
      ORDER BY created_at DESC
      LIMIT ${limitPlaceholder}
    `,
    values,
  );

  return result.rows.map(mapPost);
}

export async function scheduleSocialPost(input: SchedulePostInput): Promise<SocialPost> {
  const existing = await getSocialPostById(input.postId);

  if (!existing) {
    throw new Error("social_post_not_found");
  }

  if (!canSchedulePost(existing.status)) {
    throw new Error("social_post_status_not_schedulable");
  }

  const result = await withAdminDbClient(async (client) => {
    await client.query("BEGIN");

    try {
      const updateResult = await client.query<SocialPostRow>(
        `
          UPDATE social_posts
          SET
            status = 'scheduled',
            scheduled_at = $2,
            scheduled_by = $3,
            last_error_code = NULL,
            last_error_message = NULL,
            updated_at = now()
          WHERE id = $1
          RETURNING *
        `,
        [input.postId, input.scheduledAt, input.scheduledBy ?? "owner"],
      );

      await client.query(
        `
          INSERT INTO social_events (id, source, external_event_id, event_type, payload, created_at)
          VALUES ($1, 'admin', NULL, 'scheduled', $2::jsonb, now())
        `,
        [
          crypto.randomUUID(),
          JSON.stringify({
            postId: input.postId,
            actor: input.scheduledBy ?? "owner",
            scheduledAt: input.scheduledAt.toISOString(),
          }),
        ],
      );

      await client.query("COMMIT");
      return updateResult;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  });

  return mapPost(result.rows[0]);
}

export async function listDueScheduledPosts(options: { limit?: number } = {}): Promise<SocialPost[]> {
  const limit = Math.min(Math.max(options.limit ?? 10, 1), 25);
  const result = await queryAdminDb<SocialPostRow>(
    `
      SELECT *
      FROM social_posts
      WHERE status = 'scheduled'
        AND scheduled_at IS NOT NULL
        AND scheduled_at <= now()
      ORDER BY scheduled_at ASC, created_at ASC
      LIMIT $1
    `,
    [limit],
  );

  return result.rows.map(mapPost);
}

export async function createPublishJob(input: {
  postId: string;
  idempotencyKey: string;
}): Promise<SocialPublishJob> {
  const id = crypto.randomUUID();
  const result = await queryAdminDb<SocialPublishJobRow>(
    `
      WITH inserted AS (
        INSERT INTO social_publish_jobs (
          id,
          post_id,
          idempotency_key,
          status,
          attempts,
          created_at,
          updated_at
        )
        VALUES ($1, $2, $3, 'pending', 0, now(), now())
        ON CONFLICT (idempotency_key) DO NOTHING
        RETURNING *
      )
      SELECT *
      FROM inserted
      UNION ALL
      SELECT *
      FROM social_publish_jobs
      WHERE idempotency_key = $3
      LIMIT 1
    `,
    [id, input.postId, input.idempotencyKey],
  );

  return mapPublishJob(result.rows[0]);
}
