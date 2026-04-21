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

const FIELD_LABELS: Record<BriefAssistantFieldKey, string> = {
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
};

const BASE_GUARDRAILS = [
  "Не указывайте цену, сроки или обещание точного соответствия в этом поле.",
  "Для первого брифа не нужно вставлять лишние чувствительные данные.",
  "Сфокусируйтесь на одном процессе и одном основном узком месте.",
];

const FIELD_GUIDANCE: Partial<Record<BriefAssistantFieldKey, Omit<BriefAssistantGuidance, "fieldLabel" | "guardrails" | "stepHint">>> = {
  company_name: {
    title: "Как заполнить поле",
    explanation: "Укажите название бизнеса, компании или проекта, под которым вы работаете.",
    answerStructure: [
      "Название компании или проекта.",
      "Если бренда пока нет, укажите рабочее название.",
      "Не усложняйте классификацию.",
    ],
    draftExample: "AzurSysTech / Studio Nova / LocalFix.",
    shortFollowUp: "Если отдельного бренда нет, можно указать название компании.",
  },
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
  current_owner_of_process: {
    title: "Как заполнить поле",
    explanation: "Укажите, кто сейчас отвечает за этот процесс или первый контакт.",
    answerStructure: [
      "Должность или роль человека.",
      "Если отвечают несколько людей, назовите основного.",
      "Можно без фамилий.",
    ],
    draftExample: "Менеджер по продажам / администратор / владелец бизнеса.",
    shortFollowUp: "Для первого брифа достаточно роли, а не полного оргчарта.",
  },
  current_tools: {
    title: "Как заполнить поле",
    explanation: "Коротко перечислите основные инструменты, если они реально помогают понять процесс.",
    answerStructure: [
      "CRM, таблица, почта, WhatsApp, сайт или внутренняя система.",
      "Назовите только главное.",
      "Не перегружайте поле списком всех сервисов.",
    ],
    draftExample: "WhatsApp, Google Sheets и email.",
    shortFollowUp: "Инструменты нужны для контекста, а не для полной техкарты.",
  },
  preferred_start_mode: {
    title: "Как заполнить поле",
    explanation: "Выберите самый комфортный первый шаг, а не весь будущий проект.",
    answerStructure: [],
    draftExample: "Сначала короткий вводный разбор или обсуждение пилота.",
    shortFollowUp: "Для первого контакта обычно достаточно мягкого стартового режима.",
  },
  contact_name: {
    title: "Как заполнить поле",
    explanation: "Укажите имя человека, с которым можно обсудить бриф.",
    answerStructure: ["Имя и, если нужно, фамилия.", "Можно указать контактное лицо проекта."],
    draftExample: "Анна / Иван Петров.",
    shortFollowUp: "Если проект ведёт не владелец, укажите ответственное контактное лицо.",
  },
  contact_email: {
    title: "Как заполнить поле",
    explanation: "Укажите рабочий email для обратной связи.",
    answerStructure: ["Один актуальный email.", "Без лишних адресов, если это не нужно."],
    draftExample: "hello@company.com",
    shortFollowUp: "Проверьте, что адрес рабочий и без ошибок.",
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
  preferred_contact_method: {
    title: "Как заполнить поле",
    explanation: "Выберите канал, через который вам удобнее получить ответ.",
    answerStructure: ["Email, телефон, WhatsApp или другой удобный канал."],
    draftExample: "WhatsApp",
    shortFollowUp: "Если не принципиально, можно оставить самый удобный канал связи.",
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
};

const DEFAULT_FIELD_GUIDANCE: Omit<BriefAssistantGuidance, "fieldLabel"> = {
  title: "Как заполнить поле",
  explanation: "Укажите только то, что помогает понять задачу и следующий шаг.",
  answerStructure: [
    "Коротко и по делу.",
    "Один факт, пример или ограничение.",
    "Без лишней технической детализации.",
  ],
  draftExample: "Опишите поле коротко: кто участвует, что происходит сейчас и что должно стать понятнее после ответа.",
  shortFollowUp: "Если ответ уже есть, его достаточно просто привести в более короткий и ясный вид.",
  guardrails: BASE_GUARDRAILS,
  stepHint: "Подсказка по полю",
};

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
  ].some((phrase) => normalized === phrase || normalized.startsWith(`${phrase} `));
}

function getStepHint(fieldLabel: string, stepTitle?: string): string {
  if (stepTitle) {
    return `Сейчас шаг: ${stepTitle}. Поле: ${fieldLabel}.`;
  }

  return `Сейчас поле: ${fieldLabel}.`;
}

export function getBriefAssistantGuidance(params: {
  fieldKey?: string | null;
  fieldValue?: string | null;
  stepTitle?: string;
}): BriefAssistantGuidance {
  const normalizedKey = normalizeFieldKey(params.fieldKey);
  const fieldLabel = normalizedKey ? FIELD_LABELS[normalizedKey] : "выбранное поле";
  const baseGuidance = normalizedKey ? FIELD_GUIDANCE[normalizedKey] : undefined;
  const value = normalizeValue(params.fieldValue);
  const isLowSignal = value.length > 0 && isLowSignalAnswer(value);

  const guidance: BriefAssistantGuidance = {
    fieldLabel,
    title: baseGuidance?.title ?? DEFAULT_FIELD_GUIDANCE.title,
    explanation: baseGuidance?.explanation ?? DEFAULT_FIELD_GUIDANCE.explanation,
    answerStructure: baseGuidance?.answerStructure ?? DEFAULT_FIELD_GUIDANCE.answerStructure,
    draftExample: baseGuidance?.draftExample ?? DEFAULT_FIELD_GUIDANCE.draftExample,
    shortFollowUp: baseGuidance?.shortFollowUp ?? DEFAULT_FIELD_GUIDANCE.shortFollowUp,
    guardrails: BASE_GUARDRAILS,
    stepHint: getStepHint(fieldLabel, params.stepTitle),
  };

  if (!normalizedKey) {
    return {
      ...guidance,
      title: "Как лучше заполнить поле",
    };
  }

  if (isLowSignal) {
    return {
      ...guidance,
      shortFollowUp:
        "Сейчас ответ выглядит слишком общим. Добавьте 1–2 предложения, чтобы стало понятнее, что именно происходит.",
    };
  }

  if (value.length > 0) {
    return {
      ...guidance,
      shortFollowUp: baseGuidance?.shortFollowUp ?? "Этого уже достаточно для поля. Можно идти дальше по форме.",
    };
  }

  return guidance;
}

export function getBriefInlineHelpGuidance(params: {
  fieldKey?: string | null;
  fieldValue?: string | null;
  stepTitle?: string;
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
