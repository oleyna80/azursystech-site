ALTER TABLE intake_channel_messages
  ADD COLUMN IF NOT EXISTS channel TEXT,
  ADD COLUMN IF NOT EXISTS author_type TEXT NOT NULL DEFAULT 'client',
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'sent',
  ADD COLUMN IF NOT EXISTS body TEXT,
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS sent_at TIMESTAMPTZ;

UPDATE intake_channel_messages AS messages
SET channel = conversations.channel
FROM intake_channel_conversations AS conversations
WHERE messages.conversation_id = conversations.id
  AND messages.channel IS NULL;

UPDATE intake_channel_messages
SET body = message_text
WHERE body IS NULL;

ALTER TABLE intake_channel_messages
  ALTER COLUMN channel SET NOT NULL,
  ALTER COLUMN body SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'chk_intake_channel_messages_direction'
  ) THEN
    ALTER TABLE intake_channel_messages
      ADD CONSTRAINT chk_intake_channel_messages_direction
      CHECK (direction IN ('inbound', 'outbound'));
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'chk_intake_channel_messages_author_type'
  ) THEN
    ALTER TABLE intake_channel_messages
      ADD CONSTRAINT chk_intake_channel_messages_author_type
      CHECK (author_type IN ('client', 'assistant', 'manager', 'system'));
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'chk_intake_channel_messages_status'
  ) THEN
    ALTER TABLE intake_channel_messages
      ADD CONSTRAINT chk_intake_channel_messages_status
      CHECK (status IN ('draft', 'approved', 'queued', 'sent', 'failed'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_intake_channel_messages_channel
  ON intake_channel_messages (channel);

CREATE INDEX IF NOT EXISTS idx_intake_channel_messages_direction_status
  ON intake_channel_messages (direction, status, created_at DESC);
