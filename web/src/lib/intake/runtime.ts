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
  /(?:сколько\s+(?:это\s+)?(?:займ[её]т|занимает|времени)|сколько\s+времени)/iu,
  /(?:когда|через\s+сколько).{0,80}(?:свяж(?:ется|етесь|емся)|ответ(?:ит|ите|им)|готов[оы]?|запуст(?:ите|им|ят)|начн(?:ете|ёте|ем|ём))/iu,
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

function hasAutomationIntentSignal(text: string): boolean {
  return /(?:ai|ии|автоматизац|автоматизир|чат-?бот|заявк|лид|lead|crm|интеграц|процесс|воронк|квалификац|pipeline|workflow|automat|automatis|requests?|demandes?)/iu.test(
    text,
  );
}

function hasServiceIntentSignal(text: string): boolean {
  return /(?:обслуживан|поддержк|сопровожд|консультац|консультир|отвечать\s+на\s+вопрос|ответы\s+на\s+вопрос|service\s+client|support|assistance|maintenance|accompagnement|wi[\s-]?fi|вай[\s-]?фай|wifi|r[eé]seau|локальн(?:ая|ую|ой)?\s+сет|принтер|imprimante|выездн(?:ая|ую|ой)?\s+помощ|intervention\s+sur\s+site|onsite|poste\s+de\s+travail|рабоч(?:ее|ие|их)\s+мест)/iu.test(
    text,
  );
}

function hasUsefulProblemSignal(text: string): boolean {
  if (text.length < MIN_PROBLEM_SIGNAL_LENGTH) {
    return false;
  }

  return hasAutomationIntentSignal(text) || hasServiceIntentSignal(text);
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

  return /(?:ai|ии|автоматизац|автоматизир|бизнес|компан|заявк|клиент|процесс|сайт|crm|telegram|телеграм|whatsapp|ватсап|email|канал|wi[\s-]?fi|вай[\s-]?фай|wifi|принтер|локальн(?:ая|ую|ой)?\s+сет|кафе|настро(?:ить|йка|ить)|demande|client|process|site|outil|canal|r[eé]seau|imprimante|caf[eé]|automat|automatis|business|leads?|requests?)/iu.test(
    normalized,
  );
}

function hasBriefGuidanceSignal(text: string): boolean {
  return /(?:бриф|brief|что\s+(?:писать|указать|заполнить)|как\s+(?:описать|сформулировать|заполнить)|помогите\s+(?:с\s+)?(?:описать|сформулировать)|que\s+(?:mettre|indiquer|ecrire)|comment\s+(?:decrire|formuler|remplir))/iu.test(
    text,
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
        "Коротко уточните, какой вопрос хотите решить: обслуживание клиентов, сбор заявок или автоматизация процесса?",
      askProcessAndChannels:
        "Что важнее на первом этапе: отвечать клиентам, собирать заявки или автоматизировать внутренний процесс?",
      contactFormCta:
        "По такому вопросу лучше начать с контактной формы. Нажмите ссылку в чате или откройте раздел «Контакты» в меню сайта.",
      briefCta:
        "Для задачи автоматизации можно выбрать удобный путь: оставить контакт через форму или заполнить необязательный бриф. В брифе можно описать бизнес, процесс и текущие инструменты.",
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
      "Precisez brievement le sujet a traiter : service client, collecte de demandes ou automatisation d'un processus ?",
    askProcessAndChannels:
      "Qu'est-ce qui compte d'abord : repondre aux clients, collecter des demandes ou automatiser un processus interne ?",
    contactFormCta:
      "Pour ce type de question, commencez par le formulaire de contact. Cliquez sur le lien dans le chat ou ouvrez la rubrique Contact dans le menu du site.",
    briefCta:
      "Pour une demande d'automatisation, vous pouvez choisir : laisser un contact via le formulaire ou remplir le brief optionnel. Le brief peut decrire l'activite, le processus et les outils actuels.",
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
  const currentHasAutomationIntent =
    hasAutomationIntentSignal(text) &&
    !safety.detectedConfidentialInput &&
    !safety.deflectedUnsafeRequest;
  const currentHasServiceIntent =
    hasServiceIntentSignal(text) &&
    !currentHasAutomationIntent &&
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
    currentHasServiceIntent ||
    (diagnosticTurnCount >= MAX_DIAGNOSTIC_TURNS_BEFORE_CONTACT_CTA &&
      previousContactCtaState === "not_offered" &&
      !currentHasAutomationIntent);
  const shouldKeepContactFormVisible =
    previousContactCtaState === "offered" || previousContactCtaState === "accepted";
  const shouldOfferAutomationChoice =
    currentHasAutomationIntent &&
    !safety.detectedContactInChat &&
    !safety.detectedConfidentialInput &&
    !safety.deflectedUnsafeRequest;
  const shouldOfferBrief =
    shouldOfferAutomationChoice ||
    (shouldKeepContactFormVisible &&
      hasBriefGuidanceSignal(text) &&
      !safety.detectedContactInChat &&
      !safety.detectedConfidentialInput &&
      !safety.deflectedUnsafeRequest);
  const nextStep =
    shouldOfferBrief
      ? "brief"
      : shouldOfferContactForm || shouldKeepContactFormVisible
        ? "contact_form"
        : "clarify";
  const contactCtaState =
    (nextStep === "contact_form" || nextStep === "brief") && previousContactCtaState === "not_offered"
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
  const requestedBriefGuidance = hasBriefGuidanceSignal(sanitizedMessage.text);

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
    (briefDraft.nextStep === "brief" && !requestedBriefGuidance) ||
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
