export const INTAKE_CHANNELS = ["telegram", "whatsapp", "web_chat"] as const;
export const INTAKE_LOCALES = ["fr", "ru", "unknown"] as const;

export type IntakeChannel = (typeof INTAKE_CHANNELS)[number];
export type IntakeLocale = (typeof INTAKE_LOCALES)[number];

export type NormalizedIntakeMessage = {
  channel: IntakeChannel;
  providerUpdateId?: string;
  providerMessageId?: string;
  conversationKey: string;
  senderKey: string;
  receivedAtUtc: string;
  text: string;
  locale: IntakeLocale;
  clientName?: string;
};

export type IntakeBriefDraft = {
  problemStatement?: string;
  contactHint?: string;
  city?: string;
  diagnosticTurnCount?: number;
  preferredLanguage: IntakeLocale;
  missingFields: IntakeBriefField[];
  contactCtaState: ContactCtaState;
  nextStep: AgentNextStep;
};

export type IntakeBriefField = "problem_statement" | "contact_hint" | "city";
export type AgentNextStep = "clarify" | "contact_form" | "brief" | "handoff";
export type ContactCtaState =
  | "not_offered"
  | "offered"
  | "accepted"
  | "insufficient"
  | "skipped";

export type IntakeConversationState = {
  briefDraft?: Partial<Omit<IntakeBriefDraft, "missingFields">>;
  seenIdempotencyKeys?: string[];
};

export type IntakeSafetyFlags = {
  deflectedCommitment: boolean;
  detectedContactInChat: boolean;
  detectedConfidentialInput: boolean;
  deflectedUnsafeRequest: boolean;
  duplicateProviderEvent: boolean;
  sanitizedForLogs: boolean;
};

export type IntakeRateLimitBoundary = {
  status: "deferred_to_channel_route";
  key: string;
};

export type IntakeAdminNotificationDraft = {
  status: "dry_run_pending";
  channel: IntakeChannel;
  conversationKey: string;
  summary: string;
};

export type IntakeSheetsMirrorDraft = {
  status: "dry_run_stub";
  rowUrl: null;
};

export type IntakeDecision =
  | {
      action: "duplicate_ignored";
      idempotencyKey: string;
      assistantReply: null;
      briefDraft: IntakeBriefDraft;
      safety: IntakeSafetyFlags;
      rateLimit: IntakeRateLimitBoundary;
    }
  | {
      action: "ask_followup" | "mark_brief_ready";
      idempotencyKey: string;
      assistantReply: string;
      briefDraft: IntakeBriefDraft;
      safety: IntakeSafetyFlags;
      rateLimit: IntakeRateLimitBoundary;
      adminNotification?: IntakeAdminNotificationDraft;
      sheetsMirror?: IntakeSheetsMirrorDraft;
    };
