CREATE TABLE IF NOT EXISTS intake_channel_conversations (
  id TEXT PRIMARY KEY,
  schema_version TEXT NOT NULL DEFAULT 'intake.persistence.v1',
  channel TEXT NOT NULL,
  conversation_key TEXT NOT NULL,
  sender_key TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'unknown',
  status TEXT NOT NULL DEFAULT 'active',
  brief_status TEXT NOT NULL DEFAULT 'collecting',
  brief_draft JSONB NOT NULL DEFAULT '{}'::jsonb,
  admin_notification_status TEXT NOT NULL DEFAULT 'not_ready',
  admin_notification JSONB,
  sheets_mirror_status TEXT NOT NULL DEFAULT 'not_ready',
  sheets_mirror JSONB,
  lead_id TEXT REFERENCES intake_leads(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_message_at TIMESTAMPTZ,
  UNIQUE (channel, conversation_key)
);

CREATE INDEX IF NOT EXISTS idx_intake_channel_conversations_channel
  ON intake_channel_conversations (channel);
CREATE INDEX IF NOT EXISTS idx_intake_channel_conversations_status
  ON intake_channel_conversations (status);
CREATE INDEX IF NOT EXISTS idx_intake_channel_conversations_brief_status
  ON intake_channel_conversations (brief_status);
CREATE INDEX IF NOT EXISTS idx_intake_channel_conversations_updated_at
  ON intake_channel_conversations (updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_intake_channel_conversations_lead_id
  ON intake_channel_conversations (lead_id);

CREATE TABLE IF NOT EXISTS intake_channel_messages (
  id BIGSERIAL PRIMARY KEY,
  schema_version TEXT NOT NULL DEFAULT 'intake.persistence.v1',
  conversation_id TEXT NOT NULL REFERENCES intake_channel_conversations(id) ON DELETE CASCADE,
  idempotency_key TEXT NOT NULL UNIQUE,
  provider_update_id TEXT,
  provider_message_id TEXT,
  direction TEXT NOT NULL,
  role TEXT NOT NULL,
  message_text TEXT NOT NULL,
  raw_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  normalized_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  received_at_utc TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_intake_channel_messages_conversation_id
  ON intake_channel_messages (conversation_id);
CREATE INDEX IF NOT EXISTS idx_intake_channel_messages_received_at
  ON intake_channel_messages (received_at_utc DESC);
CREATE INDEX IF NOT EXISTS idx_intake_channel_messages_provider_update_id
  ON intake_channel_messages (provider_update_id);
CREATE INDEX IF NOT EXISTS idx_intake_channel_messages_provider_message_id
  ON intake_channel_messages (provider_message_id);

CREATE TABLE IF NOT EXISTS intake_channel_decisions (
  id BIGSERIAL PRIMARY KEY,
  schema_version TEXT NOT NULL DEFAULT 'intake.persistence.v1',
  conversation_id TEXT NOT NULL REFERENCES intake_channel_conversations(id) ON DELETE CASCADE,
  message_id BIGINT REFERENCES intake_channel_messages(id) ON DELETE SET NULL,
  idempotency_key TEXT NOT NULL,
  action TEXT NOT NULL,
  brief_status TEXT NOT NULL DEFAULT 'collecting',
  brief_draft JSONB NOT NULL DEFAULT '{}'::jsonb,
  safety_flags JSONB NOT NULL DEFAULT '{}'::jsonb,
  assistant_reply TEXT,
  admin_notification_status TEXT NOT NULL DEFAULT 'not_ready',
  admin_notification JSONB,
  sheets_mirror_status TEXT NOT NULL DEFAULT 'not_ready',
  sheets_mirror JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_intake_channel_decisions_conversation_id
  ON intake_channel_decisions (conversation_id);
CREATE INDEX IF NOT EXISTS idx_intake_channel_decisions_message_id
  ON intake_channel_decisions (message_id);
CREATE INDEX IF NOT EXISTS idx_intake_channel_decisions_idempotency_key
  ON intake_channel_decisions (idempotency_key);
CREATE INDEX IF NOT EXISTS idx_intake_channel_decisions_created_at
  ON intake_channel_decisions (created_at DESC);
