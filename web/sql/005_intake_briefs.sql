CREATE TABLE IF NOT EXISTS intake_briefs (
  id TEXT PRIMARY KEY,
  schema_version TEXT NOT NULL DEFAULT 'brief.v1',
  idempotency_key TEXT NOT NULL,
  source TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'submitted',
  locale TEXT NOT NULL DEFAULT 'fr',
  conversation_id TEXT REFERENCES intake_channel_conversations(id) ON DELETE SET NULL,
  lead_id TEXT REFERENCES intake_leads(id) ON DELETE SET NULL,
  payload JSONB NOT NULL,
  handoff JSONB NOT NULL DEFAULT '{}'::jsonb,
  summary TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'uq_intake_briefs_idempotency_key'
  ) THEN
    ALTER TABLE intake_briefs
      ADD CONSTRAINT uq_intake_briefs_idempotency_key UNIQUE (idempotency_key);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'chk_intake_briefs_schema_version'
  ) THEN
    ALTER TABLE intake_briefs
      ADD CONSTRAINT chk_intake_briefs_schema_version
      CHECK (schema_version = 'brief.v1');
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'chk_intake_briefs_source'
  ) THEN
    ALTER TABLE intake_briefs
      ADD CONSTRAINT chk_intake_briefs_source
      CHECK (source IN ('brief_form', 'web_chat', 'telegram', 'whatsapp'));
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'chk_intake_briefs_status'
  ) THEN
    ALTER TABLE intake_briefs
      ADD CONSTRAINT chk_intake_briefs_status
      CHECK (status IN ('draft', 'submitted', 'reviewed', 'archived'));
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'chk_intake_briefs_locale'
  ) THEN
    ALTER TABLE intake_briefs
      ADD CONSTRAINT chk_intake_briefs_locale
      CHECK (locale IN ('fr', 'ru', 'unknown'));
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'chk_intake_briefs_payload_object'
  ) THEN
    ALTER TABLE intake_briefs
      ADD CONSTRAINT chk_intake_briefs_payload_object
      CHECK (jsonb_typeof(payload) = 'object');
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'chk_intake_briefs_handoff_object'
  ) THEN
    ALTER TABLE intake_briefs
      ADD CONSTRAINT chk_intake_briefs_handoff_object
      CHECK (jsonb_typeof(handoff) = 'object');
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'chk_intake_briefs_metadata_object'
  ) THEN
    ALTER TABLE intake_briefs
      ADD CONSTRAINT chk_intake_briefs_metadata_object
      CHECK (jsonb_typeof(metadata) = 'object');
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_intake_briefs_status
  ON intake_briefs (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_intake_briefs_conversation_id
  ON intake_briefs (conversation_id);

CREATE INDEX IF NOT EXISTS idx_intake_briefs_lead_id
  ON intake_briefs (lead_id);

CREATE INDEX IF NOT EXISTS idx_intake_briefs_source
  ON intake_briefs (source);
