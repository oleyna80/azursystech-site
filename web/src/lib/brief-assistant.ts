import type { BriefLocale } from "@/lib/brief-submit";

export const BRIEF_ASSISTANT_CRITICAL_FIELDS = [
  "main_goal",
  "main_problem",
  "desired_result",
  "current_process_description",
  "main_bottleneck",
  "human_approval_required",
  "what_must_not_happen",
] as const;

export const BRIEF_ASSISTANT_ALL_FIELDS = [
  ...BRIEF_ASSISTANT_CRITICAL_FIELDS,
  "company_name",
  "website_url",
  "business_type",
  "target_market",
  "team_size",
  "priority_use_case",
  "why_now",
  "current_channels",
  "current_owner_of_process",
  "current_tools",
  "sensitive_data_or_constraints",
  "preferred_start_mode",
  "timeline_priority",
  "budget_range",
  "contact_name",
  "contact_email",
  "contact_phone_or_whatsapp",
  "preferred_contact_method",
] as const;

export type BriefAssistantFieldKey = (typeof BRIEF_ASSISTANT_ALL_FIELDS)[number];

export const BRIEF_INLINE_HELP_KEEP_FIELDS = [
  "main_goal",
  "main_problem",
  "desired_result",
  "current_process_description",
  "main_bottleneck",
  "human_approval_required",
  "sensitive_data_or_constraints",
  "what_must_not_happen",
] as const satisfies readonly BriefAssistantFieldKey[];

export const BRIEF_INLINE_HELP_SIMPLIFY_FIELDS = [
  "business_type",
  "priority_use_case",
  "why_now",
  "current_channels",
  "preferred_start_mode",
  "budget_range",
  "contact_phone_or_whatsapp",
] as const satisfies readonly BriefAssistantFieldKey[];

const BRIEF_INLINE_HELP_FIELDS = [
  ...BRIEF_INLINE_HELP_KEEP_FIELDS,
  ...BRIEF_INLINE_HELP_SIMPLIFY_FIELDS,
] as const satisfies readonly BriefAssistantFieldKey[];

export type BriefAssistantGuidance = {
  fieldLabel: string;
  title: string;
  explanation: string;
  answerStructure: string[];
  draftExample: string;
  shortFollowUp?: string;
  guardrails: string[];
  stepHint: string;
};

type GuidanceSeed = Omit<BriefAssistantGuidance, "fieldLabel" | "guardrails" | "stepHint">;

const FIELD_LABELS = {
  fr: {
    company_name: "Nom de l’entreprise / du projet",
    website_url: "Site web",
    business_type: "Type d’activité",
    target_market: "Marché / zone géographique",
    team_size: "Taille de l’équipe",
    priority_use_case: "Scénario prioritaire",
    why_now: "Pourquoi maintenant",
    main_goal: "Objectif principal de l’automatisation",
    main_problem: "Problème principal aujourd’hui",
    desired_result: "Résultat attendu",
    current_process_description: "Description du processus actuel",
    current_channels: "Canaux d’entrée",
    current_owner_of_process: "Qui gère aujourd’hui",
    current_tools: "Outils actuels",
    main_bottleneck: "Principal goulot",
    human_approval_required: "Où le contrôle humain reste nécessaire",
    sensitive_data_or_constraints: "Contraintes et données sensibles",
    what_must_not_happen: "Ce qu’il ne faut pas autoriser",
    preferred_start_mode: "Mode de démarrage préféré",
    timeline_priority: "Urgence / priorité",
    budget_range: "Ordre de budget",
    contact_name: "Nom du contact",
    contact_email: "Email du contact",
    contact_phone_or_whatsapp: "Téléphone ou WhatsApp",
    preferred_contact_method: "Canal de réponse préféré",
  },
  ru: {
    company_name: "Название компании / проекта",
    website_url: "Сайт компании",
    business_type: "Тип бизнеса",
    target_market: "Основной рынок / география",
    team_size: "Размер команды",
    priority_use_case: "Приоритетный сценарий",
    why_now: "Почему сейчас",
    main_goal: "Главная цель автоматизации",
    main_problem: "Главная проблема сейчас",
    desired_result: "Желаемый результат",
    current_process_description: "Описание текущего процесса",
    current_channels: "Каналы входа",
    current_owner_of_process: "Кто сейчас отвечает",
    current_tools: "Текущие инструменты",
    main_bottleneck: "Основное узкое место",
    human_approval_required: "Где нужен контроль человека",
    sensitive_data_or_constraints: "Ограничения и чувствительные данные",
    what_must_not_happen: "Что нельзя допускать",
    preferred_start_mode: "Предпочтительный старт",
    timeline_priority: "Срочность / приоритет",
    budget_range: "Бюджетный ориентир",
    contact_name: "Имя для связи",
    contact_email: "Email для связи",
    contact_phone_or_whatsapp: "Телефон или WhatsApp",
    preferred_contact_method: "Предпочтительный канал связи",
  },
} as const satisfies Record<BriefLocale, Record<BriefAssistantFieldKey, string>>;

const BASE_GUARDRAILS = {
  fr: [
    "N’indiquez pas de prix, de délais ni de promesse ferme dans ce champ.",
    "Pour le premier brief, inutile d’ajouter des données sensibles non nécessaires.",
    "Concentrez-vous sur un seul processus et un seul goulot principal.",
  ],
  ru: [
    "Не указывайте цену, сроки или обещание точного соответствия в этом поле.",
    "Для первого брифа не нужно вставлять лишние чувствительные данные.",
    "Сфокусируйтесь на одном процессе и одном основном узком месте.",
  ],
} as const satisfies Record<BriefLocale, string[]>;

const DEFAULT_FIELD_GUIDANCE = {
  fr: {
    title: "Comment remplir ce champ",
    explanation: "Indiquez seulement ce qui aide à comprendre la tâche et le prochain pas.",
    answerStructure: [
      "Soyez court et concret.",
      "Ajoutez un fait, un exemple ou une contrainte.",
      "Évitez les détails techniques inutiles.",
    ],
    draftExample:
      "Décrivez brièvement qui intervient, ce qui se passe aujourd’hui et ce qui doit devenir plus simple.",
    shortFollowUp:
      "Si la réponse existe déjà, il suffit souvent de la reformuler de manière plus courte et plus claire.",
  },
  ru: {
    title: "Как заполнить поле",
    explanation: "Укажите только то, что помогает понять задачу и следующий шаг.",
    answerStructure: [
      "Коротко и по делу.",
      "Один факт, пример или ограничение.",
      "Без лишней технической детализации.",
    ],
    draftExample:
      "Опишите поле коротко: кто участвует, что происходит сейчас и что должно стать понятнее после ответа.",
    shortFollowUp:
      "Если ответ уже есть, его достаточно просто привести в более короткий и ясный вид.",
  },
} as const satisfies Record<BriefLocale, GuidanceSeed>;

const FIELD_GUIDANCE = {
  fr: {
    business_type: {
      title: "Comment remplir ce champ",
      explanation: "Choisissez l’option la plus proche de votre activité, sans chercher une classification parfaite.",
      answerStructure: [],
      draftExample: "entreprise de services locale / e-commerce / cabinet / agence",
      shortFollowUp: "L’objectif est de comprendre le contexte, pas d’obtenir une taxonomie parfaite.",
    },
    priority_use_case: {
      title: "Comment remplir ce champ",
      explanation: "Choisissez le scénario qu’il est le plus utile d’automatiser en premier.",
      answerStructure: [],
      draftExample: "demandes venant du site / premier traitement via messageries / routage des demandes",
      shortFollowUp: "S’il y a plusieurs scénarios, choisissez d’abord le plus utile pour l’entreprise.",
    },
    why_now: {
      title: "Comment remplir ce champ",
      explanation: "Expliquez brièvement ce qui a changé ou pourquoi attendre devient gênant.",
      answerStructure: [],
      draftExample: "Le volume de demandes a augmenté et le traitement manuel ralentit déjà les réponses.",
      shortFollowUp: "Une seule raison claire suffit.",
    },
    current_channels: {
      title: "Comment remplir ce champ",
      explanation: "Cochez seulement les canaux réellement utilisés aujourd’hui.",
      answerStructure: [],
      draftExample: "Site, WhatsApp et email.",
      shortFollowUp: "Cela aide à comprendre d’où part le premier contact.",
    },
    preferred_start_mode: {
      title: "Comment remplir ce champ",
      explanation: "Choisissez le premier pas le plus confortable, pas tout le projet futur.",
      answerStructure: [],
      draftExample: "D’abord un cadrage court ou une discussion de pilote.",
      shortFollowUp: "Pour un premier contact, un démarrage simple est souvent suffisant.",
    },
    budget_range: {
      title: "Comment remplir ce champ",
      explanation: "Donnez un ordre de budget seulement s’il existe déjà ; sinon, c’est un état normal.",
      answerStructure: [],
      draftExample: "d’abord un audit / jusqu’à 1 000 € / je préfère en discuter",
      shortFollowUp: "Ce champ sert seulement à calibrer le prochain pas.",
    },
    contact_phone_or_whatsapp: {
      title: "Comment remplir ce champ",
      explanation: "Indiquez un seul numéro si c’est vraiment le moyen le plus simple pour vous joindre.",
      answerStructure: [],
      draftExample: "+33 7 80 72 09 94",
      shortFollowUp: "Si l’email suffit, ce champ peut rester vide.",
    },
    main_goal: {
      title: "Comment remplir ce champ",
      explanation: "Décrivez un seul processus que vous voulez automatiser en premier.",
      answerStructure: [
        "Quel processus doit être amélioré en premier.",
        "Pourquoi ce processus est prioritaire maintenant.",
        "Ce qui doit devenir plus simple ensuite.",
      ],
      draftExample:
        "Automatiser le premier traitement des demandes du site : collecter les informations de base, clarifier les détails et transmettre un résumé structuré.",
      shortFollowUp: "S’il y a plusieurs processus, choisissez-en un seul pour démarrer.",
    },
    main_problem: {
      title: "Comment remplir ce champ",
      explanation: "Décrivez où se perdent aujourd’hui du temps, des demandes ou de la visibilité.",
      answerStructure: [
        "Ce qui bloque le plus aujourd’hui.",
        "À quel endroit cela se produit.",
        "Quel impact cela a sur l’équipe ou sur le client.",
      ],
      draftExample:
        "Les demandes arrivent par plusieurs canaux, l’équipe repose toujours les mêmes questions et certaines demandes sont traitées trop tard.",
      shortFollowUp: "Décrivez le problème en termes de pertes métier, pas seulement d’outils.",
    },
    desired_result: {
      title: "Comment remplir ce champ",
      explanation: "Décrivez le résultat attendu, pas l’architecture.",
      answerStructure: [
        "Ce qui doit aller plus vite.",
        "Ce qui doit devenir plus clair.",
        "À quoi ressemble un bon résultat pour l’équipe et le client.",
      ],
      draftExample:
        "Les demandes sont regroupées, qualifiées puis transmises à une personne avec une synthèse courte.",
      shortFollowUp: "Le résultat doit être formulé en termes pratiques et métier.",
    },
    current_process_description: {
      title: "Comment remplir ce champ",
      explanation: "Décrivez le processus en étapes simples : d’où vient la demande, qui répond et ce qui se passe ensuite.",
      answerStructure: [
        "D’où vient la demande.",
        "Qui répond aujourd’hui.",
        "Où l’information part ensuite.",
        "À quel moment cela commence à bloquer.",
      ],
      draftExample:
        "La demande arrive depuis le site ou WhatsApp, un collaborateur la lit, pose des questions de clarification puis la transmet au bon interlocuteur.",
      shortFollowUp: "Pas besoin de schéma technique détaillé ; une suite d’étapes claires suffit.",
    },
    main_bottleneck: {
      title: "Comment remplir ce champ",
      explanation: "Isolez un seul point du processus qui bloque le plus.",
      answerStructure: [
        "Où se situe le goulot.",
        "Pourquoi il freine le travail.",
        "Ce qui se répète le plus à cet endroit.",
      ],
      draftExample:
        "Le principal blocage se situe au premier tri des messages : beaucoup de clarifications répétitives et pas de transmission structurée.",
      shortFollowUp: "Concentrez-vous sur un seul goulot principal.",
    },
    human_approval_required: {
      title: "Comment remplir ce champ",
      explanation:
        "Indiquez les étapes où une personne doit obligatoirement valider la décision : prix, délais, réponse finale, engagement client.",
      answerStructure: [
        "Ce qui ne doit pas partir automatiquement.",
        "Ce qu’une personne doit confirmer.",
        "Où une validation reste nécessaire avant l’envoi.",
      ],
      draftExample:
        "Une personne doit valider le prix, les délais, les réponses non standard et toute action qui change le statut du client.",
      shortFollowUp: "En cas de doute, gardez un contrôle humain sur les décisions commerciales.",
    },
    sensitive_data_or_constraints: {
      title: "Comment remplir ce champ",
      explanation:
        "Mentionnez uniquement les contraintes qui ont un impact réel sur les données, les accès ou les actions autorisées.",
      answerStructure: [
        "Quelles données sont sensibles.",
        "Quelles limites existent sur le stockage, l’accès ou le transfert.",
        "Quelles règles internes ne doivent pas être contournées.",
      ],
      draftExample:
        "Il y a des données personnelles clients, l’accès aux échanges est limité à l’équipe commerciale et certains documents ne doivent pas sortir des outils internes.",
      shortFollowUp: "S’il y a peu de contraintes, 1 ou 2 points majeurs suffisent.",
    },
    what_must_not_happen: {
      title: "Comment remplir ce champ",
      explanation: "Indiquez ce que vous ne voulez surtout pas confier à l’automatisation.",
      answerStructure: [
        "Ce qui ne doit pas être fait automatiquement.",
        "Quelles données ne doivent pas être transmises.",
        "Quelles promesses ne doivent jamais être faites.",
      ],
      draftExample:
        "L’agent ne doit pas promettre un prix ou un délai, envoyer des messages sans validation ni manipuler des données sensibles sans nécessité.",
      shortFollowUp: "Ce champ fixe les limites de sécurité de l’automatisation.",
    },
  },
  ru: {
    business_type: {
      title: "Как заполнить поле",
      explanation: "Выберите самый близкий вариант, не пытаясь идеально классифицировать бизнес.",
      answerStructure: [],
      draftExample: "локальная сервисная компания / e-commerce / кабинет / агентство",
      shortFollowUp: "Сейчас важнее практическая близость, а не идеальная классификация.",
    },
    priority_use_case: {
      title: "Как заполнить поле",
      explanation: "Выберите тот сценарий, который полезнее автоматизировать первым.",
      answerStructure: [],
      draftExample: "обработка заявок с сайта / первичный приём из мессенджеров / маршрутизация обращений",
      shortFollowUp: "Если сценариев несколько, выбирайте первый по бизнес-ценности.",
    },
    why_now: {
      title: "Как заполнить поле",
      explanation: "Коротко поясните, что изменилось и почему откладывать уже неудобно.",
      answerStructure: [],
      draftExample: "Поток обращений вырос, и ручная обработка уже тормозит ответы и продажи.",
      shortFollowUp: "Достаточно одной ясной причины или одного триггера.",
    },
    current_channels: {
      title: "Как заполнить поле",
      explanation: "Отметьте реальные каналы, через которые уже приходят обращения.",
      answerStructure: [],
      draftExample: "Сайт, WhatsApp и входящие письма.",
      shortFollowUp: "Это помогает понять, где именно начинается первый контакт.",
    },
    preferred_start_mode: {
      title: "Как заполнить поле",
      explanation: "Выберите самый комфортный первый шаг, а не весь будущий проект.",
      answerStructure: [],
      draftExample: "Сначала короткий вводный разбор или обсуждение пилота.",
      shortFollowUp: "Для первого контакта обычно достаточно мягкого стартового режима.",
    },
    budget_range: {
      title: "Как заполнить поле",
      explanation: "Дайте ориентир только если он уже есть; если нет, это тоже нормальный ответ.",
      answerStructure: [],
      draftExample: "сначала нужен аудит / до 1 000 € / предпочитаю обсудить",
      shortFollowUp: "Поле нужно для калибровки следующего шага, а не для жёсткого коммита.",
    },
    contact_phone_or_whatsapp: {
      title: "Как заполнить поле",
      explanation: "Оставьте один номер, если по нему правда удобно быстро связаться.",
      answerStructure: [],
      draftExample: "+33 7 80 72 09 94",
      shortFollowUp: "Если удобнее только email, это поле можно не заполнять.",
    },
    main_goal: {
      title: "Как заполнить поле",
      explanation: "Укажите один главный процесс, который вы хотите автоматизировать первым.",
      answerStructure: [
        "Что именно хотите автоматизировать первым.",
        "Почему этот процесс важен сейчас.",
        "Что должно стать проще после изменений.",
      ],
      draftExample:
        "Автоматизировать первый контакт по заявкам с сайта: собрать обращение, уточнить базовые детали и передать его дальше уже в структурированном виде.",
      shortFollowUp: "Если процессов несколько, выберите один первый.",
    },
    main_problem: {
      title: "Как заполнить поле",
      explanation: "Опишите, где сейчас теряются время, заявки или управляемость.",
      answerStructure: [
        "Что именно сейчас тормозит.",
        "Где это проявляется.",
        "К чему это приводит для команды или клиента.",
      ],
      draftExample:
        "Заявки приходят из нескольких каналов, сотрудники вручную задают одни и те же вопросы, а часть обращений теряется или отвечает слишком долго.",
      shortFollowUp: "Старайтесь описывать проблему через бизнес-потери, а не через инструменты.",
    },
    desired_result: {
      title: "Как заполнить поле",
      explanation: "Опишите не инструмент, а результат, который вы хотите получить на выходе.",
      answerStructure: [
        "Что должно стать быстрее.",
        "Что должно стать понятнее.",
        "Как выглядит хороший исход для команды и клиента.",
      ],
      draftExample:
        "Обращения собираются в одну структуру, проходят первичную оценку и уходят человеку уже с краткой сводкой.",
      shortFollowUp: "Лучше описывать результат в практических словах, без архитектуры.",
    },
    current_process_description: {
      title: "Как заполнить поле",
      explanation: "Опишите процесс простыми шагами: откуда приходит обращение, кто отвечает, что происходит дальше.",
      answerStructure: [
        "Откуда приходит обращение.",
        "Кто сейчас отвечает.",
        "Куда попадает информация дальше.",
        "Где процесс начинает тормозить.",
      ],
      draftExample:
        "Сначала обращение приходит из сайта или WhatsApp, потом его вручную читает сотрудник, задаёт уточняющие вопросы и передаёт дальше.",
      shortFollowUp: "Не нужно рисовать глубокую техсхему, достаточно понятной последовательности шагов.",
    },
    main_bottleneck: {
      title: "Как заполнить поле",
      explanation: "Выберите одно место, где процесс сейчас тормозит сильнее всего.",
      answerStructure: [
        "Где именно узкое место.",
        "Почему оно мешает.",
        "Что там повторяется чаще всего.",
      ],
      draftExample:
        "Сильнее всего тормозит первичный разбор входящих сообщений: много повторяющихся уточнений и нет единого маршрута передачи.",
      shortFollowUp: "Сосредоточьтесь на одном узком месте, а не на всех трудностях сразу.",
    },
    human_approval_required: {
      title: "Как заполнить поле",
      explanation:
        "Укажите, где решение обязательно должен подтверждать человек: например, цена, сроки, финальный ответ клиенту.",
      answerStructure: [
        "Какие действия нельзя делать автоматически.",
        "Что обязательно подтверждает человек.",
        "Где нужен контроль перед отправкой.",
      ],
      draftExample:
        "Человек должен подтверждать цену, сроки, нестандартные ответы и любые действия, которые меняют статус клиента.",
      shortFollowUp: "Если сомневаетесь, лучше поставить человека на все коммерчески значимые решения.",
    },
    sensitive_data_or_constraints: {
      title: "Как заполнить поле",
      explanation: "Перечислите только те ограничения, которые реально влияют на хранение данных, доступы или допустимые действия.",
      answerStructure: [
        "Какие данные считаются чувствительными.",
        "Где есть ограничения по хранению, доступу или передаче.",
        "Какие внутренние правила нельзя нарушать.",
      ],
      draftExample:
        "Есть персональные данные клиентов, доступ к переписке только у менеджеров, а документы нельзя передавать во внешние сервисы без согласования.",
      shortFollowUp: "Если ограничений немного, достаточно 1-2 самых важных пунктов.",
    },
    what_must_not_happen: {
      title: "Как заполнить поле",
      explanation: "Напишите, какие действия вы точно не хотите отдавать автоматизации.",
      answerStructure: [
        "Что нельзя делать автоматически.",
        "Какие данные не передавать.",
        "Какие обещания не давать.",
      ],
      draftExample:
        "Агент не должен обещать цену или сроки, отправлять сообщения без проверки и работать с чувствительными данными без необходимости.",
      shortFollowUp: "Это поле помогает удержать безопасные границы автоматизации.",
    },
  },
} as const satisfies Record<BriefLocale, Partial<Record<BriefAssistantFieldKey, GuidanceSeed>>>;

function normalizeFieldKey(fieldKey?: string | null): BriefAssistantFieldKey | null {
  if (!fieldKey) {
    return null;
  }

  return (BRIEF_ASSISTANT_ALL_FIELDS as readonly string[]).includes(fieldKey)
    ? (fieldKey as BriefAssistantFieldKey)
    : null;
}

function normalizeValue(value?: string | null): string {
  return value?.trim() ?? "";
}

function isInlineHelpField(fieldKey: BriefAssistantFieldKey): boolean {
  return (BRIEF_INLINE_HELP_FIELDS as readonly string[]).includes(fieldKey);
}

function isSimplifiedInlineHelpField(fieldKey: BriefAssistantFieldKey): boolean {
  return (BRIEF_INLINE_HELP_SIMPLIFY_FIELDS as readonly string[]).includes(fieldKey);
}

function isLowSignalAnswer(value: string): boolean {
  const normalized = value.toLowerCase();
  if (normalized.length < 18) {
    return true;
  }

  return [
    "не знаю",
    "пока не знаю",
    "без разницы",
    "любая",
    "любой",
    "нужно всё",
    "хочу ai",
    "je ne sais pas",
    "pas encore",
    "peu importe",
    "tout",
    "ia",
  ].some((phrase) => normalized === phrase || normalized.startsWith(`${phrase} `));
}

function getStepHint(locale: BriefLocale, fieldLabel: string, stepTitle?: string): string {
  if (stepTitle) {
    return locale === "fr"
      ? `Étape actuelle : ${stepTitle}. Champ : ${fieldLabel}.`
      : `Сейчас шаг: ${stepTitle}. Поле: ${fieldLabel}.`;
  }

  return locale === "fr" ? `Champ actuel : ${fieldLabel}.` : `Сейчас поле: ${fieldLabel}.`;
}

export function getBriefAssistantGuidance(params: {
  fieldKey?: string | null;
  fieldValue?: string | null;
  stepTitle?: string;
  locale?: BriefLocale;
}): BriefAssistantGuidance {
  const locale = params.locale ?? "ru";
  const normalizedKey = normalizeFieldKey(params.fieldKey);
  const localeGuidance = FIELD_GUIDANCE[locale] as Partial<Record<BriefAssistantFieldKey, GuidanceSeed>>;
  const fieldLabel = normalizedKey ? FIELD_LABELS[locale][normalizedKey] : locale === "fr" ? "champ sélectionné" : "выбранное поле";
  const baseGuidance = normalizedKey ? localeGuidance[normalizedKey] : undefined;
  const defaultGuidance = DEFAULT_FIELD_GUIDANCE[locale];
  const value = normalizeValue(params.fieldValue);
  const isLowSignal = value.length > 0 && isLowSignalAnswer(value);

  const guidance: BriefAssistantGuidance = {
    fieldLabel,
    title: baseGuidance?.title ?? defaultGuidance.title,
    explanation: baseGuidance?.explanation ?? defaultGuidance.explanation,
    answerStructure: baseGuidance?.answerStructure ?? defaultGuidance.answerStructure,
    draftExample: baseGuidance?.draftExample ?? defaultGuidance.draftExample,
    shortFollowUp: baseGuidance?.shortFollowUp ?? defaultGuidance.shortFollowUp,
    guardrails: BASE_GUARDRAILS[locale],
    stepHint: getStepHint(locale, fieldLabel, params.stepTitle),
  };

  if (!normalizedKey) {
    return {
      ...guidance,
      title: locale === "fr" ? "Comment mieux remplir ce champ" : "Как лучше заполнить поле",
    };
  }

  if (isLowSignal) {
    return {
      ...guidance,
      shortFollowUp:
        locale === "fr"
          ? "La réponse paraît encore trop générale. Ajoutez 1 ou 2 phrases pour préciser ce qui se passe réellement."
          : "Сейчас ответ выглядит слишком общим. Добавьте 1–2 предложения, чтобы стало понятнее, что именно происходит.",
    };
  }

  if (value.length > 0) {
    return {
      ...guidance,
      shortFollowUp:
        baseGuidance?.shortFollowUp ??
        (locale === "fr"
          ? "Cela suffit déjà pour ce champ. Vous pouvez continuer."
          : "Этого уже достаточно для поля. Можно идти дальше по форме."),
    };
  }

  return guidance;
}

export function getBriefInlineHelpGuidance(params: {
  fieldKey?: string | null;
  fieldValue?: string | null;
  stepTitle?: string;
  locale?: BriefLocale;
}): BriefAssistantGuidance | null {
  const normalizedKey = normalizeFieldKey(params.fieldKey);
  if (!normalizedKey || !isInlineHelpField(normalizedKey)) {
    return null;
  }

  const guidance = getBriefAssistantGuidance(params);
  if (!isSimplifiedInlineHelpField(normalizedKey)) {
    return guidance;
  }

  return {
    ...guidance,
    answerStructure: [],
  };
}
