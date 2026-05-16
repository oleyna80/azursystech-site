import type {
  IntakeAdminNotificationDraft,
  IntakeBriefDraft,
  IntakeConversationState,
  IntakeDecision,
  IntakeSheetsMirrorDraft,
  NormalizedIntakeMessage,
} from "@/lib/intake/types";

export const INTAKE_PERSISTENCE_SCHEMA_VERSION = "intake.persistence.v1" as const;

export const INTAKE_BRIEF_STATUSES = ["collecting", "ready"] as const;
export const INTAKE_ADMIN_NOTIFICATION_STATUSES = [
  "not_ready",
  "dry_run_pending",
] as const;
export const INTAKE_SHEETS_MIRROR_STATUSES = [
  "not_ready",
  "dry_run_stub",
] as const;

export type IntakeBriefPersistenceStatus = (typeof INTAKE_BRIEF_STATUSES)[number];
export type IntakeAdminNotificationStatus =
  (typeof INTAKE_ADMIN_NOTIFICATION_STATUSES)[number];
export type IntakeSheetsMirrorStatus = (typeof INTAKE_SHEETS_MIRROR_STATUSES)[number];

export type IntakeConversationIdentity = {
  channel: NormalizedIntakeMessage["channel"];
  conversationKey: string;
  senderKey: string;
};

export type IntakeConversationSnapshot = IntakeConversationIdentity & {
  schemaVersion: typeof INTAKE_PERSISTENCE_SCHEMA_VERSION;
  locale: NormalizedIntakeMessage["locale"];
  briefStatus: IntakeBriefPersistenceStatus;
  briefDraft: IntakeBriefDraft;
  adminNotificationStatus: IntakeAdminNotificationStatus;
  adminNotification?: IntakeAdminNotificationDraft;
  sheetsMirrorStatus: IntakeSheetsMirrorStatus;
  sheetsMirror?: IntakeSheetsMirrorDraft;
  lastMessageAtUtc: string;
};

export type IntakeMessageEventRecord = IntakeConversationIdentity & {
  schemaVersion: typeof INTAKE_PERSISTENCE_SCHEMA_VERSION;
  idempotencyKey: string;
  providerUpdateId?: string;
  providerMessageId?: string;
  receivedAtUtc: string;
  text: string;
  decisionAction: IntakeDecision["action"];
  assistantReply: string | null;
};

export type IntakeDecisionEventRecord = IntakeConversationIdentity & {
  schemaVersion: typeof INTAKE_PERSISTENCE_SCHEMA_VERSION;
  idempotencyKey: string;
  action: IntakeDecision["action"];
  briefStatus: IntakeBriefPersistenceStatus;
  briefDraft: IntakeBriefDraft;
  safetyFlags: IntakeDecision["safety"];
  assistantReply: string | null;
  adminNotificationStatus: IntakeAdminNotificationStatus;
  adminNotification?: IntakeAdminNotificationDraft;
  sheetsMirrorStatus: IntakeSheetsMirrorStatus;
  sheetsMirror?: IntakeSheetsMirrorDraft;
};

export type PersistIntakeDecisionInput = {
  message: NormalizedIntakeMessage;
  decision: IntakeDecision;
  previousState?: IntakeConversationState;
  rawProviderPayload?: Record<string, unknown>;
};

export type PersistIntakeDecisionResult = {
  conversationKey: string;
  idempotencyKey: string;
  insertedMessage: boolean;
  duplicateProviderEvent: boolean;
  briefStatus: IntakeBriefPersistenceStatus;
  adminNotificationStatus: IntakeAdminNotificationStatus;
  sheetsMirrorStatus: IntakeSheetsMirrorStatus;
};

export type LoadIntakeConversationInput = {
  channel: NormalizedIntakeMessage["channel"];
  conversationKey: string;
};

export type IntakePersistenceStore = {
  loadConversationState(
    input: LoadIntakeConversationInput,
  ): Promise<IntakeConversationState | null>;
  persistDecision(input: PersistIntakeDecisionInput): Promise<PersistIntakeDecisionResult>;
};

function getAdminNotification(
  decision: IntakeDecision,
): IntakeAdminNotificationDraft | undefined {
  return "adminNotification" in decision ? decision.adminNotification : undefined;
}

function getSheetsMirror(decision: IntakeDecision): IntakeSheetsMirrorDraft | undefined {
  return "sheetsMirror" in decision ? decision.sheetsMirror : undefined;
}

export function resolveBriefPersistenceStatus(
  decision: IntakeDecision,
): IntakeBriefPersistenceStatus {
  return decision.action === "mark_brief_ready" ? "ready" : "collecting";
}

export function resolveAdminNotificationStatus(
  decision: IntakeDecision,
): IntakeAdminNotificationStatus {
  return getAdminNotification(decision)?.status ?? "not_ready";
}

export function resolveSheetsMirrorStatus(
  decision: IntakeDecision,
): IntakeSheetsMirrorStatus {
  return getSheetsMirror(decision)?.status ?? "not_ready";
}

export function buildIntakeConversationSnapshot(
  message: NormalizedIntakeMessage,
  decision: IntakeDecision,
): IntakeConversationSnapshot {
  const adminNotification = getAdminNotification(decision);
  const sheetsMirror = getSheetsMirror(decision);

  return {
    schemaVersion: INTAKE_PERSISTENCE_SCHEMA_VERSION,
    channel: message.channel,
    conversationKey: message.conversationKey,
    senderKey: message.senderKey,
    locale: decision.briefDraft.preferredLanguage,
    briefStatus: resolveBriefPersistenceStatus(decision),
    briefDraft: decision.briefDraft,
    adminNotificationStatus: resolveAdminNotificationStatus(decision),
    ...(adminNotification ? { adminNotification } : {}),
    sheetsMirrorStatus: resolveSheetsMirrorStatus(decision),
    ...(sheetsMirror ? { sheetsMirror } : {}),
    lastMessageAtUtc: message.receivedAtUtc,
  };
}

export function buildIntakeMessageEventRecord(
  message: NormalizedIntakeMessage,
  decision: IntakeDecision,
): IntakeMessageEventRecord {
  return {
    schemaVersion: INTAKE_PERSISTENCE_SCHEMA_VERSION,
    channel: message.channel,
    conversationKey: message.conversationKey,
    senderKey: message.senderKey,
    idempotencyKey: decision.idempotencyKey,
    ...(message.providerUpdateId ? { providerUpdateId: message.providerUpdateId } : {}),
    ...(message.providerMessageId ? { providerMessageId: message.providerMessageId } : {}),
    receivedAtUtc: message.receivedAtUtc,
    text: message.text,
    decisionAction: decision.action,
    assistantReply: decision.assistantReply,
  };
}

export function buildIntakeDecisionEventRecord(
  message: NormalizedIntakeMessage,
  decision: IntakeDecision,
): IntakeDecisionEventRecord {
  const adminNotification = getAdminNotification(decision);
  const sheetsMirror = getSheetsMirror(decision);

  return {
    schemaVersion: INTAKE_PERSISTENCE_SCHEMA_VERSION,
    channel: message.channel,
    conversationKey: message.conversationKey,
    senderKey: message.senderKey,
    idempotencyKey: decision.idempotencyKey,
    action: decision.action,
    briefStatus: resolveBriefPersistenceStatus(decision),
    briefDraft: decision.briefDraft,
    safetyFlags: decision.safety,
    assistantReply: decision.assistantReply,
    adminNotificationStatus: resolveAdminNotificationStatus(decision),
    ...(adminNotification ? { adminNotification } : {}),
    sheetsMirrorStatus: resolveSheetsMirrorStatus(decision),
    ...(sheetsMirror ? { sheetsMirror } : {}),
  };
}
