CREATE TABLE IF NOT EXISTS intake_leads (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  received_at_utc TIMESTAMPTZ NOT NULL,
  request_id TEXT NOT NULL UNIQUE,
  idempotency_key TEXT NOT NULL UNIQUE,
  dedupe_key TEXT NOT NULL,
  source TEXT NOT NULL,
  status TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  city TEXT NOT NULL,
  segment TEXT NOT NULL,
  service_type TEXT NOT NULL,
  problem_description TEXT NOT NULL,
  device_count TEXT,
  onsite_required TEXT,
  urgency TEXT,
  company_name TEXT,
  business_type TEXT,
  workstation_count TEXT,
  business_needs JSONB,
  business_address TEXT,
  home_device_type JSONB,
  device_state TEXT,
  home_need_type JSONB,
  raw_payload JSONB NOT NULL,
  normalized_payload JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_intake_leads_created_at ON intake_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_intake_leads_status ON intake_leads (status);
CREATE INDEX IF NOT EXISTS idx_intake_leads_source ON intake_leads (source);
CREATE INDEX IF NOT EXISTS idx_intake_leads_phone ON intake_leads (phone);
CREATE INDEX IF NOT EXISTS idx_intake_leads_dedupe_key ON intake_leads (dedupe_key);

CREATE TABLE IF NOT EXISTS intake_lead_events (
  id BIGSERIAL PRIMARY KEY,
  lead_id TEXT NOT NULL REFERENCES intake_leads(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_intake_lead_events_lead_id ON intake_lead_events (lead_id);
CREATE INDEX IF NOT EXISTS idx_intake_lead_events_type ON intake_lead_events (event_type);
CREATE INDEX IF NOT EXISTS idx_intake_lead_events_created_at ON intake_lead_events (created_at DESC);

CREATE TABLE IF NOT EXISTS intake_conversations (
  id TEXT PRIMARY KEY,
  lead_id TEXT REFERENCES intake_leads(id) ON DELETE SET NULL,
  channel TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  summary TEXT,
  last_message_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_intake_conversations_lead_id ON intake_conversations (lead_id);
CREATE INDEX IF NOT EXISTS idx_intake_conversations_channel ON intake_conversations (channel);

CREATE TABLE IF NOT EXISTS intake_conversation_messages (
  id BIGSERIAL PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES intake_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  message_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_intake_conversation_messages_conversation_id ON intake_conversation_messages (conversation_id);
CREATE INDEX IF NOT EXISTS idx_intake_conversation_messages_created_at ON intake_conversation_messages (created_at DESC);
