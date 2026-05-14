import type {
  IntakeAdminNotificationDraft,
  IntakeBriefDraft,
  IntakeBriefField,
  IntakeConversationState,
  IntakeDecision,
  IntakeLocale,
  IntakeRateLimitBoundary,
  IntakeSafetyFlags,
  NormalizedIntakeMessage,
} from "@/lib/intake/types";

const MAX_INTAKE_TEXT_LENGTH = 1_500;
const MIN_PROBLEM_SIGNAL_LENGTH = 30;
const COMMITMENT_PATTERNS = [
  /\b(?:цен[ауые]|стоимост[ьи]|price|prix|tarif|devis)\b/iu,
  /\b(?:срок(?:и|ов)?|deadline|d[eé]lai|duree|durée)\b/iu,
  /\b(?:стек|stack|framework|technolog(?:y|ie)|технологи[ия])\b/iu,
  /\b(?:запиш(?:ите|и|у|ем)|назнач(?:ьте|им|у)|appointment|rendez-vous|rdv)\b/iu,
  /\b(?:гарантир(?:уйте|у|уем)|promise|promesse)\b/iu,
];

const CITY_PATTERNS = [
  /\b(nice|ницца|cagnes-sur-mer|cagnes|antibes|cannes|monaco|menton|grasse)\b/iu,
  /\b(?:город|ville|commune)\s*[:\-]?\s*([a-zа-яё -]{2,40})/iu,
];

const CONTACT_PATTERNS = [
  /(?:\+|00)\d[\d\s().-]{6,}/u,
  /\b[\w.%+-]+@[\w.-]+\.[a-z]{2,}\b/iu,
  /\b(?:telegram|телеграм|whatsapp|ватсап|email|почта|t[eé]l[ée]phone|телефон)\b/iu,
];

function sanitizeIntakeText(value: string): string {
  return value
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_INTAKE_TEXT_LENGTH);
}

function buildIdempotencyKey(message: NormalizedIntakeMessage): string {
  const providerEventKey =
    message.providerUpdateId ?? message.providerMessageId ?? `${message.conversationKey}:${message.receivedAtUtc}`;
  return `${message.channel}:${providerEventKey}`;
}

function hasCommitmentRequest(text: string): boolean {
  return COMMITMENT_PATTERNS.some((pattern) => pattern.test(text));
}

function hasContactSignal(text: string): boolean {
  return CONTACT_PATTERNS.some((pattern) => pattern.test(text));
}

function hasCitySignal(text: string): boolean {
  return CITY_PATTERNS.some((pattern) => pattern.test(text));
}

function resolveLocale(messageLocale: IntakeLocale, draftLocale?: IntakeLocale): IntakeLocale {
  if (messageLocale !== "unknown") {
    return messageLocale;
  }

  return draftLocale ?? "fr";
}

function getCopy(locale: IntakeLocale) {
  if (locale === "ru") {
    return {
      commitmentDeflection:
        "Я могу помочь только собрать бриф. Цены, сроки, стек и договоренности определяются отдельно после ручного просмотра.",
      askProblem:
        "Коротко опишите задачу: что нужно автоматизировать или какую проблему должен решить ассистент?",
      askContact: "Как удобнее связаться с вами после ручного просмотра брифа?",
      askCity: "В каком городе или регионе это нужно сделать?",
      ready: "Бриф собран для ручного просмотра администратором.",
    };
  }

  return {
    commitmentDeflection:
      "Je peux seulement aider à préparer le brief. Les prix, délais, stack et accords sont définis séparément après une revue manuelle.",
    askProblem:
      "Décrivez brièvement le besoin : que faut-il automatiser ou quel problème l'assistant doit-il résoudre ?",
    askContact: "Quel contact utiliser après la revue manuelle du brief ?",
    askCity: "Dans quelle ville ou région faut-il intervenir ?",
    ready: "Le brief est prêt pour une revue manuelle par l'administrateur.",
  };
}

function resolveBriefDraft(
  message: NormalizedIntakeMessage,
  state: IntakeConversationState | undefined,
): IntakeBriefDraft {
  const text = sanitizeIntakeText(message.text);
  const preferredLanguage = resolveLocale(message.locale, state?.briefDraft?.preferredLanguage);
  const problemStatement =
    state?.briefDraft?.problemStatement ??
    (text.length >= MIN_PROBLEM_SIGNAL_LENGTH ? text : undefined);
  const contactHint =
    state?.briefDraft?.contactHint ??
    (message.clientName ? message.clientName : undefined) ??
    (hasContactSignal(text) ? text : undefined);
  const city = state?.briefDraft?.city ?? (hasCitySignal(text) ? text : undefined);
  const missingFields: IntakeBriefField[] = [];

  if (!problemStatement) {
    missingFields.push("problem_statement");
  }
  if (!contactHint) {
    missingFields.push("contact_hint");
  }
  if (!city) {
    missingFields.push("city");
  }

  return {
    ...(problemStatement ? { problemStatement } : {}),
    ...(contactHint ? { contactHint } : {}),
    ...(city ? { city } : {}),
    preferredLanguage,
    missingFields,
  };
}

function buildFollowup(briefDraft: IntakeBriefDraft, safety: IntakeSafetyFlags): string {
  const copy = getCopy(briefDraft.preferredLanguage);
  const prefix = safety.deflectedCommitment ? `${copy.commitmentDeflection} ` : "";
  const nextMissingField = briefDraft.missingFields[0];

  if (nextMissingField === "problem_statement") {
    return `${prefix}${copy.askProblem}`.trim();
  }
  if (nextMissingField === "contact_hint") {
    return `${prefix}${copy.askContact}`.trim();
  }
  if (nextMissingField === "city") {
    return `${prefix}${copy.askCity}`.trim();
  }

  return `${prefix}${copy.ready}`.trim();
}

function buildAdminNotificationDraft(message: NormalizedIntakeMessage, briefDraft: IntakeBriefDraft): IntakeAdminNotificationDraft {
  const summary = (briefDraft.problemStatement ?? message.text).slice(0, 240);

  return {
    status: "dry_run_pending",
    channel: message.channel,
    conversationKey: message.conversationKey,
    summary,
  };
}

function buildRateLimitBoundary(message: NormalizedIntakeMessage): IntakeRateLimitBoundary {
  return {
    status: "deferred_to_channel_route",
    key: `${message.channel}:${message.senderKey}`,
  };
}

export function runIntakeDryRun(
  message: NormalizedIntakeMessage,
  state?: IntakeConversationState,
): IntakeDecision {
  const idempotencyKey = buildIdempotencyKey(message);
  const duplicateProviderEvent = state?.seenIdempotencyKeys?.includes(idempotencyKey) ?? false;
  const sanitizedMessage: NormalizedIntakeMessage = {
    ...message,
    text: sanitizeIntakeText(message.text),
  };
  const briefDraft = resolveBriefDraft(sanitizedMessage, state);
  const safety: IntakeSafetyFlags = {
    deflectedCommitment: hasCommitmentRequest(sanitizedMessage.text),
    duplicateProviderEvent,
    sanitizedForLogs: true,
  };
  const rateLimit = buildRateLimitBoundary(sanitizedMessage);

  if (duplicateProviderEvent) {
    return {
      action: "duplicate_ignored",
      idempotencyKey,
      assistantReply: null,
      briefDraft,
      safety,
      rateLimit,
    };
  }

  if (briefDraft.missingFields.length > 0 || safety.deflectedCommitment) {
    return {
      action: "ask_followup",
      idempotencyKey,
      assistantReply: buildFollowup(briefDraft, safety),
      briefDraft,
      safety,
      rateLimit,
    };
  }

  return {
    action: "mark_brief_ready",
    idempotencyKey,
    assistantReply: buildFollowup(briefDraft, safety),
    briefDraft,
    safety,
    rateLimit,
    adminNotification: buildAdminNotificationDraft(sanitizedMessage, briefDraft),
    sheetsMirror: {
      status: "dry_run_stub",
      rowUrl: null,
    },
  };
}
