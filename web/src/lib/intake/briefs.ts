import { createHash } from "crypto";

import type {
  BriefFormValues,
  BriefHandoff,
  BriefLocale,
  BriefSubmissionPayload,
} from "@/lib/brief-submit";
import type { IntakeBriefDraft, IntakeBriefField, IntakeChannel, IntakeLocale } from "@/lib/intake/types";

const BRIEF_FORM_IDEMPOTENCY_WINDOW_MS = 10 * 60 * 1000;

export const INTAKE_BRIEF_RECORD_SOURCES = [
  "brief_form",
  "web_chat",
  "telegram",
  "whatsapp",
] as const;
export const INTAKE_BRIEF_RECORD_STATUSES = [
  "draft",
  "submitted",
  "reviewed",
  "archived",
] as const;

export type IntakeBriefRecordSource = (typeof INTAKE_BRIEF_RECORD_SOURCES)[number];
export type IntakeBriefRecordStatus = (typeof INTAKE_BRIEF_RECORD_STATUSES)[number];

export type IntakeBriefDraftSnapshot = {
  problemStatement?: string;
  contactHint?: string;
  city?: string;
  preferredLanguage: IntakeLocale;
  missingFields: IntakeBriefField[];
};

export type SaveIntakeBriefInput = {
  idempotencyKey: string;
  source: IntakeBriefRecordSource;
  status: IntakeBriefRecordStatus;
  locale: BriefLocale | "unknown";
  payload: BriefSubmissionPayload | IntakeBriefDraftSnapshot;
  handoff?: BriefHandoff;
  conversationId?: string;
  leadId?: string;
  summary?: string;
  metadata?: Record<string, unknown>;
  submittedAtUtc?: string;
};

export type SaveIntakeBriefResult = {
  briefId: string;
  status: IntakeBriefRecordStatus;
  inserted: boolean;
};

export type IntakeBriefStore = {
  saveBrief(input: SaveIntakeBriefInput): Promise<SaveIntakeBriefResult>;
};

export class IntakeBriefConversationNotFoundError extends Error {
  constructor(readonly conversationId: string) {
    super("Linked intake conversation not found");
    this.name = "IntakeBriefConversationNotFoundError";
  }
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }

  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`)
    .join(",")}}`;
}

function hashIdempotencyParts(parts: Record<string, unknown>): string {
  return createHash("sha256").update(stableStringify(parts)).digest("hex").slice(0, 32);
}

function resolveWindowBucket(now: Date): number {
  return Math.floor(now.getTime() / BRIEF_FORM_IDEMPOTENCY_WINDOW_MS);
}

export function buildBriefFormIdempotencyKey(input: {
  values: BriefFormValues;
  locale: BriefLocale;
  conversationId?: string;
  now?: Date;
}): string {
  const digest = hashIdempotencyParts({
    source: "brief_form",
    locale: input.locale,
    conversationId: input.conversationId ?? null,
    windowBucket: resolveWindowBucket(input.now ?? new Date()),
    values: input.values,
  });

  return `brief_form:${digest}`;
}

export function buildAgentBriefIdempotencyKey(input: {
  channel: IntakeChannel;
  conversationKey: string;
  decisionIdempotencyKey: string;
}): string {
  const digest = hashIdempotencyParts({
    source: input.channel,
    conversationKey: input.conversationKey,
    decisionIdempotencyKey: input.decisionIdempotencyKey,
    action: "brief_ready",
  });

  return `${input.channel}:brief_ready:${digest}`;
}

export function buildIntakeBriefDraftSnapshot(
  draft: IntakeBriefDraft,
): IntakeBriefDraftSnapshot {
  return {
    ...(draft.problemStatement ? { problemStatement: draft.problemStatement } : {}),
    ...(draft.contactHint ? { contactHint: draft.contactHint } : {}),
    ...(draft.city ? { city: draft.city } : {}),
    preferredLanguage: draft.preferredLanguage,
    missingFields: draft.missingFields,
  };
}
