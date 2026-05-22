DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'chk_intake_leads_status'
  ) THEN
    ALTER TABLE intake_leads
      ADD CONSTRAINT chk_intake_leads_status
      CHECK (status IN ('New'));
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'chk_intake_channel_conversations_status'
  ) THEN
    ALTER TABLE intake_channel_conversations
      ADD CONSTRAINT chk_intake_channel_conversations_status
      CHECK (status IN ('active'));
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'chk_intake_channel_conversations_brief_status'
  ) THEN
    ALTER TABLE intake_channel_conversations
      ADD CONSTRAINT chk_intake_channel_conversations_brief_status
      CHECK (brief_status IN ('collecting', 'ready'));
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'chk_intake_channel_conversations_admin_notification_status'
  ) THEN
    ALTER TABLE intake_channel_conversations
      ADD CONSTRAINT chk_intake_channel_conversations_admin_notification_status
      CHECK (admin_notification_status IN ('not_ready', 'dry_run_pending'));
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'chk_intake_channel_conversations_sheets_mirror_status'
  ) THEN
    ALTER TABLE intake_channel_conversations
      ADD CONSTRAINT chk_intake_channel_conversations_sheets_mirror_status
      CHECK (sheets_mirror_status IN ('not_ready', 'dry_run_stub'));
  END IF;
END $$;
