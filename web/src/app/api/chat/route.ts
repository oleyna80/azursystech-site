import { NextResponse } from "next/server";
import { isRateLimitedPersistent } from "@/lib/request-rate-limit";
import { isSqlStorageEnabled } from "@/lib/intake/config";
import type { IntakeConversationState } from "@/lib/intake/types";
import { runWebChatIntakeDryRun } from "@/lib/web-chat/dry-run";

const REQUEST_TIMEOUT_MS = 15_000;
const MAX_REQUEST_BODY_BYTES = 50_000;
const MAX_MESSAGE_LENGTH = 1_000;
const MAX_HISTORY_ITEM_LENGTH = 1_000;
const MAX_HISTORY_ITEMS = 6;
const MAX_REPLY_LENGTH = 2_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_MAX_KEYS = 10_000;
const FORCED_CTA_USER_TURN_THRESHOLD = 5;
const SUPPORTED_CHAT_LOCALES = ["fr", "ru"] as const;
const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/iu,
  /reveal\s+(the\s+)?system\s+prompt/iu,
  /act\s+as\s+system/iu,
];
const DEFAULT_DEEPSEEK_BASE_URL = "https://api.deepseek.com";
const FORM_CTA_PATTERN = /\b(?:форм(?:а|у|е|ой|ы)|formulair(?:e|es))\b/iu;
const WHATSAPP_CTA_PATTERN = /\bwhats\s*app\b|\bwhatsapp\b|ватсапп?/iu;
const CTA_REFERENCE_PATTERN =
  /\b(?:форм(?:а|у|е|ой|ы)|formulair(?:e|es)|заяв(?:к[ауеиой]|ка|ку)|demand(?:e|es)|site|сайт(?:е|а)?|whats\s*app|whatsapp|ватсапп?)\b/iu;
const LEADING_GREETING_PATTERN =
  /^(?:здравствуйте|добрый\s+день|добрый\s+вечер|привет(?:ствую)?|bonjour|bonsoir|salut)\s*[!.,:\-–—]?\s*/iu;
const SHORT_CORRECTION_PATTERN =
  /^(?:нет\b|не\b|не\s+так\b|не\s+это\b|по\s+кабелю\b|на\s+пк\b|на\s+комп(?:ьютер)?\b|через\s+пк\b|через\s+комп(?:ьютер)?\b|non\b|pas\s+comme\s+ça\b|en\s+c[aâ]ble\b|sur\s+pc\b|sur\s+ordinateur\b|via\s+pc\b|via\s+ordinateur\b)/iu;
const OVERCONFIDENT_RECONSTRUCTION_PATTERN =
  /\b(?:вы\s+хотите|значит|то\s+есть|для\s+этого\s+нужно|будет\s+подключен|будет\s+доступен|принтер\s+будет|vous\s+voulez|donc|c['’]est-[àa]-dire|pour\s+cela\s+il\s+faut|sera\s+connect[ée]|sera\s+disponible|l['’]imprimante\s+sera)\b/iu;
const FABRICATED_LINK_PATTERN =
  /(вот\s+ссылка\s+на\s+форму\s*:?\s*\[[^\]]+\]|voici\s+le\s+lien\s+du\s+formulaire\s*:?\s*\[[^\]]+\]|\[[^\]]*(?:ссыл|lien)[^\]]*\])/iu;
const OVERPROMISE_PATTERN =
  /\b(?:оперативно\s+свяж(?:емся|усь|утся)|подготов(?:им|ить)\s+(?:точное\s+)?предложение|коммерческ(?:ое|ого)\s+предложени[ея]|nous\s+vous\s+recontacterons\s+rapidement|prépar(?:erons|er)\s+(?:une\s+)?(?:offre|proposition)\s+(?:précise|commerciale))\b/iu;
const AUTONOMOUS_OUTBOUND_PATTERNS = [
  /\b(?:я|мы)\s+(?:свяж(?:усь|емся)|позвон(?:ю|им)|напиш(?:у|ем)|отправ(?:лю|им)|вышл(?:ю|ем)|назнач(?:у|им)|запиш(?:у|ем)|заброниру(?:ю|ем)|организу(?:ю|ем)|приед(?:у|ем))\b/iu,
  /\b(?:наш|мой)\s+специалист\s+(?:свяжется|позвонит|приедет|напишет|назначит)\b/iu,
  /\b(?:je|nous)\s+(?:vous\s+)?(?:recontacterai|recontacterons|appellerai|appellerons|écrirai|écrirons|enverrai|enverrons|planifierai|planifierons|organiserai|organiserons|viendrai|viendrons)\b/iu,
  /\b(?:notre|mon)\s+spécialiste\s+(?:vous\s+)?(?:recontactera|appellera|écrira|viendra|planifiera)\b/iu,
];
const PRICING_COMMITMENT_PATTERNS = [
  /\b(?:точн(?:ая|о)|ровно|фиксированн(?:ая|ую)\s+цен[ау]|гарантир(?:ую|уем)\s+цен[ыу])\b/iu,
  /\b(?:будет|составит|стоит)\s*\d[\d\s.,]*(?:€|eur|евро|\$|usd|доллар(?:ов|а)?|₽|руб(?:\.|лей|ля|ль)?)\b/iu,
  /\b(?:prix\s+exact|prix\s+fixe|tarif\s+garanti|co[uû]tera?)\b/iu,
  /\b(?:sera|co[uû]tera?)\s*\d[\d\s.,]*(?:€|eur|euros?)\b/iu,
];
const SCHEDULING_COMMITMENT_PATTERNS = [
  /\b(?:назнач(?:у|им)|запиш(?:у|ем)|приед(?:у|ем)|будем|начнем|созвонимся|подключимся)\b.{0,40}\b(?:в|на)\s*\d{1,2}[:.]\d{2}\b/iu,
  /\b(?:назнач(?:у|им)|запиш(?:у|ем)|приед(?:у|ем)|будем|начнем)\b.{0,40}\b(?:на\s*)?\d{1,2}[./-]\d{1,2}(?:[./-]\d{2,4})?\b/iu,
  /\b(?:завтра|сегодня|послезавтра)\s+(?:в\s*)?\d{1,2}[:.]\d{2}\b/iu,
  /\b(?:je|nous)\s+(?:vous\s+)?(?:planifierai|planifierons|fixerai|fixerons|viendrai|viendrons|commencerai|commencerons)\b.{0,40}\b(?:à|le)\s*\d{1,2}[:.]\d{2}\b/iu,
  /\b(?:je|nous)\s+(?:vous\s+)?(?:planifierai|planifierons|fixerai|fixerons|viendrai|viendrons)\b.{0,40}\b(?:le\s*)?\d{1,2}[./-]\d{1,2}(?:[./-]\d{2,4})?\b/iu,
  /\b(?:demain|aujourd['’]hui|apr[eè]s-demain)\s+(?:à\s*)?\d{1,2}[:.]\d{2}\b/iu,
];
const LOCAL_DEEPSEEK_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);
type ChatLocale = (typeof SUPPORTED_CHAT_LOCALES)[number];
type ChatRole = "user" | "assistant";
type ChatHistoryItem = {
  role: ChatRole;
  content: string;
};

const CHAT_COPY: Record<
  ChatLocale,
  {
    chatUnavailable: string;
    emptyReply: string;
    cta: string;
    policyFallback: string;
    reviewFallback: string;
    securityRejection: string;
    rateLimit: string;
    upstream402: string;
    printerNetworkClarification: string;
    printerClarification: string;
    genericClarification: string;
    languageInstruction: string;
  }
> = {
  fr: {
    chatUnavailable:
      "Le chat est temporairement indisponible. Merci d'envoyer votre demande via le formulaire du site ou sur WhatsApp.",
    emptyReply: "Désolé, je n'ai pas pu générer une réponse.",
    cta: "Laissez une courte demande via le formulaire du site ou écrivez sur WhatsApp.",
    policyFallback:
      "Je ne peux pas promettre des prix exacts, des délais précis ou des actions proactives dans le chat. Laissez une courte demande via le formulaire du site ou écrivez sur WhatsApp.",
    reviewFallback:
      "Après la demande, nous regarderons la description et préciserons les détails manuellement. Laissez une courte demande via le formulaire du site ou écrivez sur WhatsApp.",
    securityRejection:
      "La demande a été refusée pour des raisons de sécurité. Reformulez votre question technique. Si vous préférez, laissez une courte demande via le formulaire du site ou écrivez sur WhatsApp.",
    rateLimit: "Trop de messages d'affilée. Merci d'attendre une minute.",
    upstream402:
      "Désolé, le service est temporairement indisponible. Merci d'envoyer votre demande via le formulaire du site ou sur WhatsApp.",
    printerNetworkClarification:
      "Précisez, s'il vous plaît : faut-il connecter l'imprimante par câble à un seul PC avec partage, ou doit-elle fonctionner comme imprimante réseau directement pour tous les ordinateurs ?",
    printerClarification:
      "Précisez, s'il vous plaît : faut-il connecter l'imprimante à un seul PC ou doit-elle être accessible directement depuis tous les ordinateurs ?",
    genericClarification:
      "Précisez, s'il vous plaît, comment cette connexion doit être organisée exactement.",
    languageInstruction:
      "CRITIQUE : réponds uniquement en français. N'écris pas en russe si l'utilisateur écrit en français.",
  },
  ru: {
    chatUnavailable:
      "Чат временно недоступен. Пожалуйста, отправьте заявку через форму на сайте или напишите в WhatsApp.",
    emptyReply: "К сожалению, не удалось получить ответ.",
    cta: "Оставьте короткую заявку через форму на сайте или напишите в WhatsApp.",
    policyFallback:
      "Я не могу обещать точные цены, сроки или проактивные действия в чате. Оставьте короткую заявку через форму на сайте или напишите в WhatsApp.",
    reviewFallback:
      "После заявки мы посмотрим описание и уточним детали вручную. Оставьте короткую заявку через форму на сайте или напишите в WhatsApp.",
    securityRejection:
      "Запрос отклонен по соображениям безопасности. Переформулируйте, пожалуйста, ваш технический вопрос. Если удобнее, оставьте короткую заявку через форму на сайте или напишите в WhatsApp.",
    rateLimit: "Слишком много обращений подряд, пожалуйста, подождите минуту.",
    upstream402:
      "Извините, сервис временно недоступен. Пожалуйста, отправьте заявку через форму на сайте или напишите в WhatsApp.",
    printerNetworkClarification:
      "Уточните, пожалуйста: принтер нужно подключить кабелем к одному ПК и открыть общий доступ, или он должен работать как сетевой принтер напрямую для всех компьютеров?",
    printerClarification:
      "Уточните, пожалуйста: принтер нужно подключить к одному ПК или он должен быть доступен всем компьютерам напрямую?",
    genericClarification:
      "Уточните, пожалуйста, как именно должна быть устроена эта схема подключения?",
    languageInstruction:
      "CRITIQUE : отвечай только на русском языке. Не переключайся на французский, если пользователь пишет по-русски.",
  },
};

const BASE_SYSTEM_PROMPT = `Ты роль: IT-специалист компании AzurSysTech из Ниццы (Франция).
Твоя задача помочь пользователю сформулировать его проблему перед тем, как он отправит заявку. Будь кратким, доброжелательным и компетентным.

ПРИНЦИПЫ ОТВЕТА:
1. Кратко, 1-2 предложения, максимум 3.
2. Не обещай точных цен, сроков, выезда или начала работ. Если нужно, говори, что после заявки мы посмотрим описание и уточним детали вручную.
3. Учитывай предыдущие сообщения в текущем диалоге и не теряй активную тему.
4. Не перескакивай на другой сценарий, если пользователь явно не сменил тему.
5. Не начинай каждый ответ с приветствия. Сразу переходи к сути вопроса.
6. Если данных еще мало, задай один следующий полезный уточняющий вопрос. Не повторяй уже известные факты.
7. Если пользователь отвечает коротко, неполно, противоречиво или двусмысленно, не достраивай схему сам и не делай сильных выводов.
8. В таких случаях формулируй нейтральный уточняющий вопрос. Не подменяй уточнение уже установленным фактом.
9. Используй формулировки уровня: "Правильно ли я понимаю..." только если уверенность действительно высокая. Если уверенности нет, спроси нейтрально: "Как именно...", "Речь о...", "Нужно ли... или ...?"
10. Не придумывай и не вставляй вымышленные ссылки, URL или плейсхолдеры вида "[ссылка на форму]". Если пользователь просит ссылку, просто направь его к форме заявки на сайте или к WhatsApp без фальшивого URL.
11. Не обещай "оперативно свяжемся", "подготовим предложение" или другие коммерческие/временные обещания. Вместо этого говори: после заявки мы посмотрим описание и уточним детали вручную.
12. Не добавляй форму и WhatsApp в каждом ответе. Предлагай заявку или WhatsApp, когда контекст уже понятен или пользователь явно готов передать задачу.
13. Следуй указанию по языку ответа ниже и не переключайся самовольно на другой язык.`;

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function sanitizeReply(reply: string | undefined, locale: ChatLocale): string {
  const cleaned = (reply ?? "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .trim();

  if (!cleaned) {
    return CHAT_COPY[locale].emptyReply;
  }

  return cleaned.slice(0, MAX_REPLY_LENGTH);
}

function sanitizeConversationContent(value: unknown, maxLength: number): string {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .trim()
    .slice(0, maxLength);
}

function sanitizeLocale(value: unknown): ChatLocale | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  return SUPPORTED_CHAT_LOCALES.includes(normalized as ChatLocale)
    ? (normalized as ChatLocale)
    : null;
}

function detectLocaleFromText(value: string): ChatLocale | null {
  if (!value) {
    return null;
  }

  if (/[а-яё]/iu.test(value)) {
    return "ru";
  }

  if (
    /[àâçéèêëîïôûùüÿæœ]/iu.test(value) ||
    /\b(?:bonjour|bonsoir|salut|merci|besoin|devis|ordinateur|imprimante|réseau|reseau|c[aâ]ble|bureau|comment|pouvez|veuillez|demande|site)\b/iu.test(
      value,
    )
  ) {
    return "fr";
  }

  return null;
}

function resolveChatLocale(explicitLocale: ChatLocale | null, message: string, history: ChatHistoryItem[]) {
  if (explicitLocale) {
    return explicitLocale;
  }

  const userMessages = [
    message,
    ...history
      .filter((item) => item.role === "user")
      .map((item) => item.content)
      .reverse(),
  ];

  for (const candidate of userMessages) {
    const detectedLocale = detectLocaleFromText(candidate);
    if (detectedLocale) {
      return detectedLocale;
    }
  }

  return "fr";
}

function buildSystemPrompt(locale: ChatLocale): string {
  return `${BASE_SYSTEM_PROMPT}

УКАЗАНИЕ ПО ЯЗЫКУ:
${CHAT_COPY[locale].languageInstruction}`;
}

function hasPromptInjectionAttempt(message: string): boolean {
  return PROMPT_INJECTION_PATTERNS.some((pattern) => pattern.test(message));
}

function matchesAnyPattern(value: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(value));
}

function hasForbiddenCommitment(reply: string): boolean {
  return (
    matchesAnyPattern(reply, AUTONOMOUS_OUTBOUND_PATTERNS) ||
    matchesAnyPattern(reply, PRICING_COMMITMENT_PATTERNS) ||
    matchesAnyPattern(reply, SCHEDULING_COMMITMENT_PATTERNS)
  );
}

function hasFabricatedLink(reply: string): boolean {
  return FABRICATED_LINK_PATTERN.test(reply);
}

function hasOverpromise(reply: string): boolean {
  return OVERPROMISE_PATTERN.test(reply);
}

function hasClearCta(reply: string): boolean {
  return FORM_CTA_PATTERN.test(reply) && WHATSAPP_CTA_PATTERN.test(reply);
}

function stripLeadingGreeting(reply: string): string {
  return reply.replace(LEADING_GREETING_PATTERN, "").trim();
}

function stripTrailingCtaSentence(reply: string): string {
  const sentences = reply
    .split(/(?<=[.!?])\s+/u)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  while (sentences.length > 0) {
    const lastSentence = sentences[sentences.length - 1] ?? "";
    const mentionsFormOrWhatsapp =
      CTA_REFERENCE_PATTERN.test(lastSentence) || WHATSAPP_CTA_PATTERN.test(lastSentence);
    const looksLikeAction =
      /\b(?:остав(?:ьте|ить)|перейд(?:ите|и)|напиш(?:ите|ите нам|ите в)|отправ(?:ьте|ить)|переда(?:йте|ть)|заполн(?:ите|ить)|laissez|laisser|remplissez|remplir|écrivez|écrire|envoyez|envoyer|ouvrez|ouvrir|passez|passer)\b/iu.test(
        lastSentence,
      );

    if (!mentionsFormOrWhatsapp || !looksLikeAction) {
      break;
    }

    sentences.pop();
  }

  return sentences.join(" ").trim();
}

function normalizeReply(reply: string): string {
  const withoutGreeting = stripLeadingGreeting(reply);
  const withoutTrailingCta = stripTrailingCtaSentence(withoutGreeting);
  return withoutTrailingCta || withoutGreeting || reply;
}

function ensureCta(reply: string, locale: ChatLocale): string {
  const normalizedReply = normalizeReply(reply);
  if (hasClearCta(normalizedReply)) {
    return normalizedReply;
  }

  const ctaMessage = CHAT_COPY[locale].cta;

  const compact = normalizedReply.replace(/\s+/g, " ").trim();
  if (!compact) {
    return ctaMessage;
  }

  const candidate = `${compact} ${ctaMessage}`;
  if (candidate.length <= MAX_REPLY_LENGTH) {
    return candidate;
  }

  const maxPrefixLength = Math.max(0, MAX_REPLY_LENGTH - ctaMessage.length - 1);
  const prefix = compact
    .slice(0, maxPrefixLength)
    .replace(/\s+\S*$/u, "")
    .trim()
    .replace(/[.!?;,:-]+$/u, "");

  return prefix ? `${prefix} ${ctaMessage}` : ctaMessage;
}

function enforcePostGenerationPolicy(reply: string, forceCta: boolean, locale: ChatLocale): string {
  const copy = CHAT_COPY[locale];
  const guardedReply = hasForbiddenCommitment(reply)
    ? copy.policyFallback
    : hasFabricatedLink(reply) || hasOverpromise(reply)
      ? copy.reviewFallback
      : reply;
  const sanitizedGuardedReply = sanitizeReply(guardedReply, locale);

  if (guardedReply === copy.policyFallback || guardedReply === copy.reviewFallback) {
    return sanitizeReply(ensureCta(sanitizedGuardedReply, locale), locale);
  }

  const normalizedReply = sanitizeReply(normalizeReply(sanitizedGuardedReply), locale);
  if (!forceCta) {
    return normalizedReply;
  }

  return sanitizeReply(ensureCta(normalizedReply, locale), locale);
}

function isRequestBodyTooLarge(request: Request): boolean {
  const contentLength = request.headers.get("content-length");
  if (!contentLength) {
    return false;
  }

  const parsed = Number.parseInt(contentLength, 10);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return false;
  }

  return parsed > MAX_REQUEST_BODY_BYTES;
}

function isWebChatDryRunRequest(request: Request): boolean {
  return (
    process.env.NODE_ENV !== "production" &&
    request.headers.get("x-azursystech-dry-run")?.trim().toLowerCase() === "true"
  );
}

function isLiveChatEnabled(): boolean {
  const launchMode = process.env.AI_LAUNCH_MODE?.trim();
  const hasDeepseekApiKey = Boolean(process.env.DEEPSEEK_API_KEY?.trim());
  const hasDeepseekBaseUrl = Boolean(getDeepseekChatCompletionsUrl());
  const allowAutonomousOutbound = process.env.AI_ALLOW_AUTONOMOUS_OUTBOUND?.trim().toLowerCase();
  const allowPricingCommitments = process.env.AI_ALLOW_PRICING_COMMITMENTS?.trim().toLowerCase();
  const allowSchedulingPromises = process.env.AI_ALLOW_SCHEDULING_PROMISES?.trim().toLowerCase();

  return (
    launchMode === "limited_live_intake" &&
    allowAutonomousOutbound === "false" &&
    allowPricingCommitments === "false" &&
    allowSchedulingPromises === "false" &&
    isSqlStorageEnabled() &&
    hasDeepseekApiKey &&
    hasDeepseekBaseUrl
  );
}

function getDeepseekChatCompletionsUrl(): string | null {
  const rawBaseUrl = process.env.DEEPSEEK_BASE_URL?.trim() || DEFAULT_DEEPSEEK_BASE_URL;
  const normalizedBaseUrl = rawBaseUrl.endsWith("/") ? rawBaseUrl : `${rawBaseUrl}/`;
  const isProd = process.env.NODE_ENV === "production";

  try {
    const parsedUrl = new URL("chat/completions", normalizedBaseUrl);
    if (parsedUrl.protocol === "https:") {
      return parsedUrl.toString();
    }

    if (parsedUrl.protocol !== "http:") {
      return null;
    }

    if (!isProd && LOCAL_DEEPSEEK_HOSTS.has(parsedUrl.hostname.toLowerCase())) {
      return parsedUrl.toString();
    }

    return null;
  } catch {
    return null;
  }
}

function sanitizeHistory(history: unknown): ChatHistoryItem[] {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .map((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        return null;
      }

      const role = item.role;
      if (role !== "user" && role !== "assistant") {
        return null;
      }

      const content = sanitizeConversationContent(item.content, MAX_HISTORY_ITEM_LENGTH);
      if (!content) {
        return null;
      }

      return { role, content };
    })
    .filter((item): item is ChatHistoryItem => item !== null)
    .slice(-MAX_HISTORY_ITEMS);
}

function extractIntakeConversationState(body: { state?: unknown }): IntakeConversationState | undefined {
  if (!body.state || typeof body.state !== "object" || Array.isArray(body.state)) {
    return undefined;
  }

  const state = body.state as { briefDraft?: unknown; seenIdempotencyKeys?: unknown };
  const briefDraft =
    state.briefDraft && typeof state.briefDraft === "object" && !Array.isArray(state.briefDraft)
      ? state.briefDraft
      : undefined;
  const seenIdempotencyKeys = Array.isArray(state.seenIdempotencyKeys)
    ? state.seenIdempotencyKeys.filter((key): key is string => typeof key === "string")
    : undefined;

  return {
    ...(briefDraft ? { briefDraft } : {}),
    ...(seenIdempotencyKeys ? { seenIdempotencyKeys } : {}),
  };
}

function isShortCorrectiveMessage(message: string): boolean {
  return message.length <= 80 && SHORT_CORRECTION_PATTERN.test(message);
}

function looksOverconfidentForCorrection(reply: string): boolean {
  return OVERCONFIDENT_RECONSTRUCTION_PATTERN.test(reply);
}

function buildClarifyingReply(
  message: string,
  history: ChatHistoryItem[],
  locale: ChatLocale,
): string | null {
  const combinedContext = [...history, { role: "user" as const, content: message }]
    .map((item) => item.content.toLowerCase())
    .join(" ");

  const mentionsPrinter =
    /\bпринтер\b/u.test(combinedContext) ||
    /\bпечат/u.test(combinedContext) ||
    /\bimprimante\b/u.test(combinedContext) ||
    /\bimpress/i.test(combinedContext);
  const mentionsPc =
    /\bпк\b/u.test(combinedContext) ||
    /\bкомп(?:ьютер)?/u.test(combinedContext) ||
    /\bноутбук/u.test(combinedContext) ||
    /\bpc\b/u.test(combinedContext) ||
    /\bordinateur\b/u.test(combinedContext);
  const mentionsNetwork =
    /\bсетев/u.test(combinedContext) ||
    /\bсеть\b/u.test(combinedContext) ||
    /\bréseau\b/u.test(combinedContext) ||
    /\breseau\b/u.test(combinedContext);
  const mentionsCable =
    /\bкабел/u.test(combinedContext) ||
    /\bethernet\b/u.test(combinedContext) ||
    /\bc[aâ]ble\b/u.test(combinedContext);
  const copy = CHAT_COPY[locale];

  if (mentionsPrinter && mentionsPc && (mentionsNetwork || mentionsCable)) {
    return copy.printerNetworkClarification;
  }

  if (mentionsPrinter && mentionsPc) {
    return copy.printerClarification;
  }

  return copy.genericClarification;
}

function applyAmbiguityGuardrail(
  reply: string,
  message: string,
  history: ChatHistoryItem[],
  forceCta: boolean,
  locale: ChatLocale,
): string {
  if (!isShortCorrectiveMessage(message)) {
    return enforcePostGenerationPolicy(reply, forceCta, locale);
  }

  if (!looksOverconfidentForCorrection(reply)) {
    return enforcePostGenerationPolicy(reply, forceCta, locale);
  }

  const replacement = buildClarifyingReply(message, history, locale);
  return enforcePostGenerationPolicy(replacement ?? reply, forceCta, locale);
}

export async function POST(request: Request) {
  if (isRequestBodyTooLarge(request)) {
    return NextResponse.json({ error: "Request too large" }, { status: 413 });
  }

  const clientIp = getClientIp(request);
  let body: unknown = null;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad Request: invalid payload" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Bad Request: invalid payload" }, { status: 400 });
  }

  const isDryRunRequest = isWebChatDryRunRequest(request);
  const keys = Object.keys(body);
  const hasOnlyAllowedKeys = keys.every(
    (key) =>
      key === "message" ||
      key === "history" ||
      key === "locale" ||
      (isDryRunRequest && (key === "conversationKey" || key === "senderKey" || key === "state")),
  );
  if (!hasOnlyAllowedKeys || !keys.includes("message")) {
    return NextResponse.json({ error: "Bad Request: invalid payload" }, { status: 400 });
  }

  const payload = body as { message?: unknown; history?: unknown; locale?: unknown };
  const message = typeof payload.message === "string" ? payload.message.trim() : "";
  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Message must be between 1 and ${MAX_MESSAGE_LENGTH} characters` },
      { status: 400 },
    );
  }

  if ("history" in payload && payload.history !== undefined && !Array.isArray(payload.history)) {
    return NextResponse.json({ error: "Bad Request: invalid payload" }, { status: 400 });
  }

  const history = sanitizeHistory(payload.history);
  const explicitLocale = sanitizeLocale(payload.locale);
  const responseLocale = resolveChatLocale(explicitLocale, message, history);
  const copy = CHAT_COPY[responseLocale];

  if (isDryRunRequest) {
    const dryRunResult = await runWebChatIntakeDryRun({
      message,
      locale: responseLocale,
      conversationKey:
        typeof (body as { conversationKey?: unknown }).conversationKey === "string"
          ? (body as { conversationKey: string }).conversationKey
          : undefined,
      senderKey:
        typeof (body as { senderKey?: unknown }).senderKey === "string"
          ? (body as { senderKey: string }).senderKey
          : undefined,
      state: extractIntakeConversationState(body as { state?: unknown }),
    });

    if (!dryRunResult.ok) {
      if ("persistence" in dryRunResult) {
        return NextResponse.json(
          {
            ok: false,
            mode: "dry_run",
            error: "Persistence unavailable",
          },
          { status: 503 },
        );
      }

      return NextResponse.json(
        {
          ok: false,
          mode: "dry_run",
          adapter: dryRunResult.adapter,
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      ok: true,
      mode: "dry_run",
      decision: dryRunResult.decision,
    });
  }

  if (!isLiveChatEnabled()) {
    return NextResponse.json({ error: copy.chatUnavailable }, { status: 503 });
  }

  const isRateLimited = await isRateLimitedPersistent({
    scope: "chat",
    key: clientIp,
    maxRequests: RATE_LIMIT_MAX,
    windowMs: RATE_LIMIT_WINDOW_MS,
    maxMemoryKeys: RATE_LIMIT_MAX_KEYS,
  });
  if (isRateLimited) {
    return NextResponse.json({ error: copy.rateLimit }, { status: 429 });
  }

  if (hasPromptInjectionAttempt(message)) {
    return NextResponse.json({ error: copy.securityRejection }, { status: 400 });
  }

  const userTurnCount = history.filter((item) => item.role === "user").length + 1;
  const forceCta = userTurnCount >= FORCED_CTA_USER_TURN_THRESHOLD;

  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  const deepseekChatCompletionsUrl = getDeepseekChatCompletionsUrl();
  if (!apiKey || !deepseekChatCompletionsUrl) {
    return NextResponse.json({ error: copy.chatUnavailable }, { status: 503 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(deepseekChatCompletionsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: buildSystemPrompt(responseLocale) },
          ...history,
          { role: "user", content: message },
        ],
        max_tokens: 200,
        temperature: 0.3,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      if (response.status === 402) {
        return NextResponse.json({
          reply: copy.upstream402,
        });
      }

      console.error(`Chat upstream error: status=${response.status}`);
      return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 500 });
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const rawReply = sanitizeReply(data.choices?.[0]?.message?.content, responseLocale);
    const reply = applyAmbiguityGuardrail(
      rawReply,
      message,
      history,
      forceCta,
      responseLocale,
    );

    return NextResponse.json({ reply });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error("Chat upstream timeout");
      return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 504 });
    }

    console.error("Chat endpoint unexpected error");
    return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 500 });
  } finally {
    clearTimeout(timeout);
  }
}
