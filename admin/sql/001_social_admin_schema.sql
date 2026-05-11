-- AZR-004 Admin Phase 1 social automation foundation.
-- Additive schema for the separate admin Next.js project.

CREATE TABLE IF NOT EXISTS social_channels (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  display_name TEXT NOT NULL,
  external_account_id TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT social_channels_type_check
    CHECK (type IN ('facebook_page')),
  CONSTRAINT social_channels_status_check
    CHECK (status IN ('active', 'disabled')),
  CONSTRAINT social_channels_type_external_unique
    UNIQUE (type, external_account_id)
);

CREATE TABLE IF NOT EXISTS social_posts (
  id TEXT PRIMARY KEY,
  channel_id TEXT NOT NULL REFERENCES social_channels(id) ON DELETE RESTRICT,
  status TEXT NOT NULL DEFAULT 'draft',
  content TEXT NOT NULL,
  media JSONB,
  locale TEXT,
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  external_post_id TEXT,
  last_error_code TEXT,
  last_error_message TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by TEXT,
  scheduled_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT social_posts_status_check
    CHECK (status IN ('draft', 'scheduled', 'publishing', 'published', 'failed')),
  CONSTRAINT social_posts_schedule_check
    CHECK (
      (status <> 'scheduled') OR scheduled_at IS NOT NULL
    )
);

CREATE TABLE IF NOT EXISTS social_events (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL,
  external_event_id TEXT,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS social_publish_jobs (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES social_posts(id) ON DELETE CASCADE,
  idempotency_key TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  attempts INTEGER NOT NULL DEFAULT 0,
  last_error_code TEXT,
  last_error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT social_publish_jobs_status_check
    CHECK (status IN ('pending', 'running', 'succeeded', 'failed')),
  CONSTRAINT social_publish_jobs_idempotency_unique
    UNIQUE (idempotency_key)
);

CREATE INDEX IF NOT EXISTS social_posts_status_scheduled_idx
  ON social_posts (status, scheduled_at)
  WHERE status = 'scheduled';

CREATE INDEX IF NOT EXISTS social_posts_channel_created_idx
  ON social_posts (channel_id, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS social_posts_external_post_unique_idx
  ON social_posts (channel_id, external_post_id)
  WHERE external_post_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS social_publish_jobs_post_status_idx
  ON social_publish_jobs (post_id, status);

CREATE INDEX IF NOT EXISTS social_publish_jobs_status_created_idx
  ON social_publish_jobs (status, created_at);

CREATE UNIQUE INDEX IF NOT EXISTS social_events_source_external_unique_idx
  ON social_events (source, external_event_id)
  WHERE external_event_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS social_events_created_idx
  ON social_events (created_at DESC);
