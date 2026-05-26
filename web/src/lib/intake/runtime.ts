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
const MAX_DIAGNOSTIC_TURNS_BEFORE_CONTACT_CTA = 2;
const MIN_DIAGNOSTIC_SIGNAL_LENGTH = 8;

const COMMITMENT_PATTERNS = [
  /(?:цен[ауые]|стоимост[ьи]|price|prix|tarif|devis)/iu,
  /(?:сколько\s+(?:будет\s+)?сто(?:ит|ить)?|сто(?:ит|ить))/iu,
  /(?:срок(?:и|ов)?|deadline|d[eé]lai|duree|durée)/iu,
  /\b(?:стек|stack|framework|technolog(?:y|ie)|технологи[ия])\b/iu,
  /\b(?:запиш(?:ите|и|у|ем)|назнач(?:ьте|им|у)|appointment|rendez-vous|rdv)\b/iu,
  /\b(?:гарантир(?:уйте|у|уем)|promise|promesse)\b/iu,
];

const CONTACT_PATTERNS = [
  /(?:\+|00)\d[\d\s().-]{6,}/u,
  /\b[\w.%+-]+@[\w.-]+\.[a-z]{2,}\b/iu,
  /(?:мой|моя|me joindre|contactez|contact\s+me|write\s+me|напишите|свяжитесь).{0,40}(?:telegram|телеграм|whatsapp|ватсап|email|почта|e-mail|t[eé]l[ée]phone|телефон)/iu,
];

const CONFIDENTIAL_PATTERNS = [
  /(?:парол[ья]|password|mot\s+de\s+passe|secret|token|api\s*key|ключ\s+api)/iu,
  /\b(?:iban|bic|swift|карта|card\s+number|num[eé]ro\s+de\s+carte)\b/iu,
  /\b(?:паспорт|passport|ssn|social\s+security|num[eé]ro\s+de\s+s[eé]curit[eé])\b/iu,
];

const UNSAFE_REQUEST_PATTERNS = [
  /(?:сер[аы]я|нелегальн|обход\s+закона|отмыв|скам|фрод|fraud|scam|illegal|ill[eé]gal|blanchiment)/iu,
  /(?:спам|spam|mass\s+dm|массов(?:ая|ую)\s+рассылк|phishing|фишинг|взлом|hack|piratage)/iu,
];

const CITY_PATTERNS = [
  /\b(nice|ницца|cagnes-sur-mer|cagnes|antibes|cannes|monaco|menton|grasse)\b/iu,
  /\b(?:город|ville|commune)\s*[:\-]?\s*([a-zа-яё -]{2,40})/iu,
];

function sanitizeIntakeText(value: string): string {
  return value
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_INTAKE_TEXT_LENGTH);
}

function redactSensitiveText(value: string): string {
  return sanitizeIntakeText(value)
    .replace(/\b[\w.%+-]+@[\w.-]+\.[a-z]{2,}\b/giu, "[contact]")
    .replace(/(?:\+|00)\d[\d\s().-]{6,}/gu, "[contact]")
    .replace(/\b(?:парол[ья]|password|mot\s+de\s+passe|secret|token|api\s*key|ключ\s+api)\b/giu, "[sensitive]");
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
  return text.includes("[contact]") || CONTACT_PATTERNS.some((pattern) => pattern.test(text));
}

function hasConfidentialSignal(text: string): boolean {
  return text.includes("[sensitive]") || CONFIDENTIAL_PATTERNS.some((pattern) => pattern.test(text));
}

function hasUnsafeRequestSignal(text: string): boolean {
  return UNSAFE_REQUEST_PATTERNS.some((pattern) => pattern.test(text));
}

function hasCitySignal(text: string): boolean {
  return CITY_PATTERNS.some((pattern) => pattern.test(text));
}

function hasUsefulProblemSignal(text: string): boolean {
  if (text.length < MIN_PROBLEM_SIGNAL_LENGTH) {
    return false;
  }

  return /(?:ai|ии|автоматизац|автоматизир|бизнес|заявк|клиент|процесс|обработ|сайт|crm|telegram|телеграм|email|менеджер|demande|client|process|site|outil|canal|automat|automatis|leads?|requests?)/iu.test(
    text,
  );
}

function hasMeaningfulDiagnosticSignal(text: string): boolean {
  const normalized = text.toLowerCase().trim();
  if (normalized.length < MIN_DIAGNOSTIC_SIGNAL_LENGTH) {
    return false;
  }

  if (
    /^(?:здравствуйте|привет|добрый день|добрый вечер|bonjour|bonsoir|salut|hello|hi)[!. ]*$/iu.test(
      normalized,
    )
  ) {
    return false;
  }

  if (
    /^(?:ничем|не знаю|пока не знаю|не уверен|не уверена|aucune idee|je ne sais pas|pas encore|nothing|not sure)[!. ]*$/iu.test(
      normalized,
    )
  ) {
    return false;
  }

  return /(?:ai|ии|автоматизац|автоматизир|бизнес|компан|заявк|клиент|процесс|сайт|crm|telegram|телеграм|whatsapp|ватсап|email|канал|demande|client|process|site|outil|canal|automat|automatis|business|leads?|requests?)/iu.test(
    normalized,
  );
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
        "Стоимость и сроки зависят от задачи; специалист сможет уточнить это после заявки. В чате я не называю цену, сроки и не обещаю решение.",
      privacyNotice:
        "Пожалуйста, не указывайте в чате контакты, пароли, токены, финансовые данные или другую конфиденциальную информацию. Для связи используйте контактную форму.",
      unsafeDeflection:
        "С серыми или нелегальными задачами мы не работаем. Если речь о легальной AI-автоматизации бизнес-процессов, опишите бизнес и процесс, который хотите улучшить.",
      askBusiness:
        "Чем занимается ваш бизнес и какой процесс вы хотите автоматизировать в первую очередь?",
      askProcessAndChannels:
        "Какие каналы или системы уже есть: сайт, CRM, Telegram, email или другие рабочие инструменты?",
      contactFormCta:
        "Этого достаточно для первого шага. Заполните контактную форму: там можно оставить имя и удобный канал связи.",
      briefCta:
        "Контактную форму лучше заполнить отдельно. Если хотите, дальше я помогу сформулировать необязательный бриф: чем занимается бизнес, что автоматизировать и какие каналы уже используются.",
    };
  }

  return {
    commitmentDeflection:
      "Le prix et les delais dependent du besoin ; un specialiste pourra les preciser apres la demande. Dans le chat, je ne donne pas de prix, de delais ni de promesse de solution.",
    privacyNotice:
      "Merci de ne pas indiquer dans le chat vos contacts, mots de passe, tokens, donnees financieres ou autres informations confidentielles. Utilisez le formulaire de contact pour etre recontacte.",
    unsafeDeflection:
      "Nous ne travaillons pas sur des activites grises ou illegales. Si votre demande concerne une automatisation IA legale de processus business, decrivez l'activite et le processus a ameliorer.",
    askBusiness:
      "Quelle est votre activite, et quel processus souhaitez-vous automatiser en premier ?",
    askProcessAndChannels:
      "Quels canaux ou outils utilisez-vous deja : site web, CRM, Telegram, email ou autres outils de travail ?",
    contactFormCta:
      "C'est suffisant pour une premiere etape. Remplissez le formulaire de contact : vous pourrez y laisser votre nom et le canal de contact prefere.",
    briefCta:
      "Le formulaire de contact doit etre rempli separement. Si vous le souhaitez, je peux maintenant vous aider a formuler un brief optionnel : activite, processus a automatiser et canaux deja utilises.",
  };
}

function resolveBriefDraft(
  message: NormalizedIntakeMessage,
  state: IntakeConversationState | undefined,
  safety: Pick<
    IntakeSafetyFlags,
    "detectedContactInChat" | "detectedConfidentialInput" | "deflectedUnsafeRequest"
  >,
): IntakeBriefDraft {
  const text = redactSensitiveText(message.text);
  const preferredLanguage = resolveLocale(message.locale, state?.briefDraft?.preferredLanguage);
  const previousDiagnosticTurnCount = state?.briefDraft?.diagnosticTurnCount ?? 0;
  const previousContactCtaState = state?.briefDraft?.contactCtaState ?? "not_offered";
  const currentHasProblemSignal =
    hasUsefulProblemSignal(text) &&
    !safety.detectedConfidentialInput &&
    !safety.deflectedUnsafeRequest;
  const currentHasDiagnosticSignal =
    hasMeaningfulDiagnosticSignal(text) &&
    !safety.detectedConfidentialInput &&
    !safety.deflectedUnsafeRequest;
  const problemStatement =
    state?.briefDraft?.problemStatement ?? (currentHasProblemSignal ? text : undefined);
  const contactHint = state?.briefDraft?.contactHint ?? (message.clientName ? message.clientName : undefined);
  const city = state?.briefDraft?.city ?? (hasCitySignal(text) ? text : undefined);
  const diagnosticTurnCount =
    problemStatement || previousContactCtaState !== "not_offered"
      ? previousDiagnosticTurnCount
      : currentHasDiagnosticSignal
        ? Math.min(previousDiagnosticTurnCount + 1, MAX_DIAGNOSTIC_TURNS_BEFORE_CONTACT_CTA)
        : previousDiagnosticTurnCount;
  const missingFields: IntakeBriefField[] = [];

  if (!problemStatement) {
    missingFields.push("problem_statement");
  }

  const shouldOfferContactForm =
    safety.detectedContactInChat ||
    safety.detectedConfidentialInput ||
    (diagnosticTurnCount >= MAX_DIAGNOSTIC_TURNS_BEFORE_CONTACT_CTA && previousContactCtaState === "not_offered") ||
    (Boolean(problemStatement) && previousContactCtaState === "not_offered");
  const nextStep =
    previousContactCtaState === "offered" || previousContactCtaState === "accepted"
      ? "brief"
      : shouldOfferContactForm
        ? "contact_form"
        : "clarify";
  const contactCtaState =
    nextStep === "contact_form" && previousContactCtaState === "not_offered"
      ? "offered"
      : previousContactCtaState;

  return {
    ...(problemStatement ? { problemStatement } : {}),
    ...(contactHint ? { contactHint } : {}),
    ...(city ? { city } : {}),
    diagnosticTurnCount,
    preferredLanguage,
    missingFields,
    contactCtaState,
    nextStep,
  };
}

function buildFollowup(briefDraft: IntakeBriefDraft, safety: IntakeSafetyFlags): string {
  const copy = getCopy(briefDraft.preferredLanguage);
  const prefix = [
    safety.deflectedUnsafeRequest ? copy.unsafeDeflection : "",
    safety.deflectedCommitment ? copy.commitmentDeflection : "",
    safety.detectedContactInChat || safety.detectedConfidentialInput ? copy.privacyNotice : "",
  ]
    .filter(Boolean)
    .join(" ");

  const nextMessage =
    briefDraft.nextStep === "contact_form"
      ? copy.contactFormCta
      : briefDraft.nextStep === "brief"
        ? copy.briefCta
        : (briefDraft.diagnosticTurnCount ?? 0) >= MAX_DIAGNOSTIC_TURNS_BEFORE_CONTACT_CTA
          ? copy.askProcessAndChannels
          : copy.askBusiness;

  return `${prefix} ${nextMessage}`.replace(/\s+/g, " ").trim();
}

function buildAdminNotificationDraft(
  message: NormalizedIntakeMessage,
  briefDraft: IntakeBriefDraft,
): IntakeAdminNotificationDraft {
  const summary = (briefDraft.problemStatement ?? redactSensitiveText(message.text)).slice(0, 240);

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
  const safety: IntakeSafetyFlags = {
    deflectedCommitment: hasCommitmentRequest(sanitizedMessage.text),
    detectedContactInChat: hasContactSignal(sanitizedMessage.text),
    detectedConfidentialInput: hasConfidentialSignal(sanitizedMessage.text),
    deflectedUnsafeRequest: hasUnsafeRequestSignal(sanitizedMessage.text),
    duplicateProviderEvent,
    sanitizedForLogs: true,
  };
  const briefDraft = resolveBriefDraft(sanitizedMessage, state, safety);
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

  if (
    briefDraft.missingFields.length > 0 ||
    briefDraft.nextStep === "contact_form" ||
    safety.deflectedCommitment ||
    safety.detectedContactInChat ||
    safety.detectedConfidentialInput ||
    safety.deflectedUnsafeRequest
  ) {
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
