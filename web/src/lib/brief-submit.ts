import { resolveLocale } from "@/i18n";

export const BRIEF_SCHEMA_VERSION = "brief.v1" as const;
export const BRIEF_SOURCE = "brief_form" as const;
export const BRIEF_ROUTE = "/brief" as const;

export type BriefLocale = "fr" | "ru";

export function resolveBriefLocale(value?: string | null): BriefLocale {
  return resolveLocale(value ?? undefined) === "ru" ? "ru" : "fr";
}

const BRIEF_BUSINESS_TYPES = [
  "local_service_company",
  "small_office_cabinet",
  "ecommerce",
  "retail_store",
  "agency_studio",
  "consultant_expert_business",
  "other",
] as const;

const BRIEF_PRIORITY_USE_CASES = [
  "website_leads",
  "messenger_intake",
  "qualification",
  "customer_support",
  "routing",
  "follow_up",
  "document_workflow",
  "other",
] as const;

const BRIEF_CURRENT_CHANNELS = [
  "website_form",
  "website_chat",
  "whatsapp",
  "facebook_instagram",
  "email",
  "phone",
  "crm",
  "marketplace",
  "other",
] as const;

const BRIEF_APPROVAL_STAGES = [
  "first_response",
  "qualification",
  "handoff_to_work",
  "price_quote",
  "deadlines_booking",
  "documents",
  "final_client_reply",
  "not_sure",
] as const;

const BRIEF_START_MODES = [
  "audit_review",
  "pilot_one_process",
  "ai_agent_incoming_requests",
  "ai_agent_customer_requests",
  "document_automation",
  "discovery_call_only",
  "not_sure",
] as const;

const BRIEF_TIMELINE_PRIORITIES = ["asap", "2_4_weeks", "1_3_months", "exploring"] as const;

const BRIEF_BUDGET_RANGES = [
  "no_budget_yet",
  "audit_first",
  "up_to_1000",
  "1000_3000",
  "3000_10000",
  "10000_plus",
  "prefer_to_discuss",
] as const;

const BRIEF_TEAM_SIZES = ["1", "2_5", "6_10", "11_25", "25_plus"] as const;

const BRIEF_CONTACT_METHODS = ["email", "whatsapp", "phone", "meeting", "no_matter"] as const;

export type BriefBusinessType = (typeof BRIEF_BUSINESS_TYPES)[number];
export type BriefPriorityUseCase = (typeof BRIEF_PRIORITY_USE_CASES)[number];
export type BriefCurrentChannel = (typeof BRIEF_CURRENT_CHANNELS)[number];
export type BriefApprovalStage = (typeof BRIEF_APPROVAL_STAGES)[number];
export type BriefStartMode = (typeof BRIEF_START_MODES)[number];
export type BriefTimelinePriority = (typeof BRIEF_TIMELINE_PRIORITIES)[number];
export type BriefBudgetRange = (typeof BRIEF_BUDGET_RANGES)[number];
export type BriefTeamSize = (typeof BRIEF_TEAM_SIZES)[number];
export type BriefPreferredContactMethod = (typeof BRIEF_CONTACT_METHODS)[number];

type BriefOption = {
  value: string;
  label: string;
};

export type BriefFieldType = "text" | "textarea" | "url" | "email" | "select" | "multi_select";

export type BriefFieldDefinition = {
  key: BriefFieldKey;
  label: string;
  type: BriefFieldType;
  required: boolean;
  helperText: string;
  placeholder?: string;
  example?: string;
  assistantTrigger?: boolean;
  options?: BriefOption[];
  allowOther?: boolean;
  otherFieldKey?: string;
  otherPlaceholder?: string;
  notesFieldKey?: string;
  notesPlaceholder?: string;
};

export type BriefStepDefinition = {
  id: string;
  title: string;
  shortDescription: string;
  fields: BriefFieldDefinition[];
};

export type BriefValidationIssue = {
  field: string;
  message: string;
};

export type BriefFormValues = {
  company_name: string;
  website_url: string;
  business_type: BriefBusinessType | "";
  business_type_other: string;
  target_market: string;
  team_size: BriefTeamSize | "";
  main_goal: string;
  main_problem: string;
  desired_result: string;
  priority_use_case: BriefPriorityUseCase | "";
  priority_use_case_other: string;
  why_now: string;
  current_process_description: string;
  current_channels: BriefCurrentChannel[];
  current_channels_other: string;
  current_owner_of_process: string;
  main_bottleneck: string;
  current_tools: string;
  human_approval_required: BriefApprovalStage[];
  human_approval_required_notes: string;
  sensitive_data_or_constraints: string;
  what_must_not_happen: string;
  preferred_start_mode: BriefStartMode | "";
  timeline_priority: BriefTimelinePriority | "";
  budget_range: BriefBudgetRange | "";
  contact_name: string;
  contact_email: string;
  contact_phone_or_whatsapp: string;
  preferred_contact_method: BriefPreferredContactMethod | "";
};

export type BriefValueKey = keyof BriefFormValues;
export type BriefFieldKey = BriefValueKey;

export type BriefSubmissionMetadata = {
  ai_assist_used: boolean;
  assistant_interaction_count: number;
};

export type BriefSubmissionPayload = {
  schema_version: typeof BRIEF_SCHEMA_VERSION;
  source: typeof BRIEF_SOURCE;
  route: typeof BRIEF_ROUTE;
  locale: BriefLocale;
  created_at: string;
  brief: BriefFormValues;
  metadata: BriefSubmissionMetadata;
  crm_handoff: BriefHandoff;
};

export type BriefHandoff = {
  company_name: string;
  business_type: string;
  main_goal: string;
  main_problem: string;
  desired_result: string;
  priority_use_case: string;
  current_process_description: string;
  current_channels: string;
  main_bottleneck: string;
  human_approval_required: string;
  what_must_not_happen: string;
  preferred_start_mode: string;
  timeline_priority: string;
  budget_range: string;
  contact: {
    name: string;
    email: string;
    phone?: string;
    preferred_contact_method?: string;
  };
  recommended_next_step: "discovery_call" | "audit" | "pilot_discussion" | "request_more_info" | "out_of_scope_review";
  summary: string;
};

export type BriefSubmitRequestBody = {
  values?: unknown;
  locale?: unknown;
  ai_assist_used?: unknown;
  assistant_interaction_count?: unknown;
};

export type BriefSubmitApiResult =
  | { success: true; message: string; payload: BriefSubmissionPayload; handoff: BriefHandoff }
  | { success: false; message: string; issues: BriefValidationIssue[] };

type BriefValidationResult =
  | { kind: "ok"; values: BriefFormValues }
  | { kind: "validation_error"; issues: BriefValidationIssue[] };

type BriefFieldRule = {
  key: BriefFieldKey;
  required: boolean;
  minLength?: number;
  maxLength?: number;
};

function createBriefFields(locale: BriefLocale): Record<BriefFieldKey, BriefFieldDefinition> {
  if (locale === "fr") {
    return {
      company_name: {
        key: "company_name",
        label: "Nom de l’entreprise / du projet",
        type: "text",
        required: true,
        helperText: "Indiquez le nom de l’entreprise, du service ou du projet.",
        placeholder: "AzurSysTech",
        example: "AzurSysTech",
      },
      website_url: {
        key: "website_url",
        label: "Site web",
        type: "text",
        required: false,
        helperText: "Vous pouvez laisser vide s’il n’y a pas encore de site. Un simple domaine suffit, par exemple azursystech.fr.",
        placeholder: "azursystech.fr",
        example: "azursystech.fr",
      },
      business_type: {
        key: "business_type",
        label: "Type d’activité",
        type: "select",
        required: true,
        helperText: "Choisissez la catégorie la plus proche de votre activité.",
        assistantTrigger: true,
        options: [
          { value: "local_service_company", label: "Entreprise de services locale" },
          { value: "small_office_cabinet", label: "Petit bureau / cabinet" },
          { value: "ecommerce", label: "E-commerce" },
          { value: "retail_store", label: "Commerce / magasin" },
          { value: "agency_studio", label: "Agence / studio" },
          { value: "consultant_expert_business", label: "Consultant / activité d’expertise" },
          { value: "other", label: "Autre" },
        ],
        allowOther: true,
        otherFieldKey: "business_type_other",
        otherPlaceholder: "Décrivez brièvement l’activité",
      },
      target_market: {
        key: "target_market",
        label: "Marché / zone géographique",
        type: "text",
        required: false,
        helperText: "Vous pouvez indiquer un pays, une région ou plusieurs marchés.",
        placeholder: "France, UE",
        example: "France, UE",
      },
      team_size: {
        key: "team_size",
        label: "Taille de l’équipe",
        type: "select",
        required: false,
        helperText: "S’il n’y a pas de chiffre exact, choisissez la fourchette la plus proche.",
        options: [
          { value: "1", label: "1" },
          { value: "2_5", label: "2–5" },
          { value: "6_10", label: "6–10" },
          { value: "11_25", label: "11–25" },
          { value: "25_plus", label: "25+" },
        ],
      },
      main_goal: {
        key: "main_goal",
        label: "Quel processus voulez-vous automatiser en premier ?",
        type: "textarea",
        required: true,
        helperText: "Décrivez un seul processus prioritaire à améliorer en premier.",
        placeholder: "Je veux automatiser le premier traitement des demandes qui arrivent depuis le site et WhatsApp.",
        example: "Je veux automatiser le premier traitement des demandes qui arrivent depuis le site et WhatsApp.",
        assistantTrigger: true,
      },
      main_problem: {
        key: "main_problem",
        label: "Quel est aujourd’hui le principal problème ?",
        type: "textarea",
        required: true,
        helperText: "Indiquez où vous perdez du temps, de la visibilité ou des demandes.",
        placeholder: "Les demandes arrivent par plusieurs canaux, une partie se perd et l’équipe répète toujours les mêmes questions.",
        example: "Les demandes arrivent par plusieurs canaux, une partie se perd et l’équipe répète toujours les mêmes questions.",
        assistantTrigger: true,
      },
      desired_result: {
        key: "desired_result",
        label: "Quel résultat concret voulez-vous obtenir ?",
        type: "textarea",
        required: true,
        helperText: "Décrivez le résultat métier attendu, pas la stack technique.",
        placeholder: "Je veux que les demandes soient regroupées, qualifiées puis transmises avec un résumé court.",
        example: "Je veux que les demandes soient regroupées, qualifiées puis transmises avec un résumé court.",
        assistantTrigger: true,
      },
      priority_use_case: {
        key: "priority_use_case",
        label: "Quel scénario est le plus important maintenant ?",
        type: "select",
        required: true,
        helperText: "S’il y a plusieurs scénarios, choisissez le premier pas le plus utile.",
        assistantTrigger: true,
        options: [
          { value: "website_leads", label: "Demandes venant du site" },
          { value: "messenger_intake", label: "Premier traitement depuis le chat / les messageries" },
          { value: "qualification", label: "Qualification initiale de la demande" },
          { value: "customer_support", label: "Support client sur les questions récurrentes" },
          { value: "routing", label: "Routage des demandes" },
          { value: "follow_up", label: "Relances et rappels" },
          { value: "document_workflow", label: "Flux documentaire standardisé" },
          { value: "other", label: "Autre" },
        ],
        allowOther: true,
        otherFieldKey: "priority_use_case_other",
        otherPlaceholder: "Décrivez brièvement le scénario",
      },
      why_now: {
        key: "why_now",
        label: "Pourquoi traiter ce sujet maintenant ?",
        type: "textarea",
        required: false,
        helperText: "Ce champ est facultatif, mais il aide à comprendre l’urgence.",
        placeholder: "Le volume de demandes a augmenté et le traitement manuel ralentit déjà les ventes.",
        example: "Le volume de demandes a augmenté et le traitement manuel ralentit déjà les ventes.",
      },
      current_process_description: {
        key: "current_process_description",
        label: "Comment ce processus fonctionne-t-il aujourd’hui ?",
        type: "textarea",
        required: true,
        helperText: "Décrivez le flux en étapes simples : d’où vient la demande, qui répond, ce qui se passe ensuite.",
        placeholder: "Le client remplit le formulaire du site ou écrit sur WhatsApp, puis un collaborateur clarifie les détails et reporte tout dans un tableau.",
        example: "Le client remplit le formulaire du site ou écrit sur WhatsApp, puis un collaborateur clarifie les détails et reporte tout dans un tableau.",
        assistantTrigger: true,
      },
      current_channels: {
        key: "current_channels",
        label: "Par quels canaux arrivent aujourd’hui les demandes et messages ?",
        type: "multi_select",
        required: true,
        helperText: "Sélectionnez tous les canaux réellement utilisés aujourd’hui.",
        assistantTrigger: true,
        options: [
          { value: "website_form", label: "Site / formulaire" },
          { value: "website_chat", label: "Chat sur le site" },
          { value: "whatsapp", label: "WhatsApp" },
          { value: "facebook_instagram", label: "Facebook / Instagram" },
          { value: "email", label: "Email" },
          { value: "phone", label: "Téléphone" },
          { value: "crm", label: "CRM" },
          { value: "marketplace", label: "Marketplace" },
          { value: "other", label: "Autre" },
        ],
        allowOther: true,
        otherFieldKey: "current_channels_other",
        otherPlaceholder: "Précisez l’autre canal",
      },
      current_owner_of_process: {
        key: "current_owner_of_process",
        label: "Qui gère ce processus aujourd’hui ?",
        type: "text",
        required: false,
        helperText: "Vous pouvez indiquer un rôle plutôt qu’un nom précis.",
        placeholder: "Dirigeant, manager ou administrateur",
        example: "Manager commercial et dirigeant",
      },
      main_bottleneck: {
        key: "main_bottleneck",
        label: "Où se situe aujourd’hui le principal goulot ?",
        type: "textarea",
        required: true,
        helperText: "Essayez d’isoler un point critique principal, pas toute la liste des problèmes.",
        placeholder: "Le plus gros blocage se situe au premier traitement : il faut poser manuellement les mêmes questions à chaque demande.",
        example: "Le plus gros blocage se situe au premier traitement : il faut poser manuellement les mêmes questions à chaque demande.",
        assistantTrigger: true,
      },
      current_tools: {
        key: "current_tools",
        label: "Quels outils ou systèmes utilisez-vous déjà ?",
        type: "textarea",
        required: false,
        helperText: "Une liste simple suffit : site, tableaux, CRM, messageries.",
        placeholder: "Site, Google Sheets, WhatsApp, CRM",
        example: "Site, Google Sheets, WhatsApp, CRM",
      },
      human_approval_required: {
        key: "human_approval_required",
        label: "À quelles étapes le contrôle humain reste obligatoire ?",
        type: "multi_select",
        required: true,
        helperText: "Ce champ aide à distinguer ce qui peut être automatisé et ce qui doit rester validé par une personne.",
        assistantTrigger: true,
        options: [
          { value: "first_response", label: "Premier message" },
          { value: "qualification", label: "Qualification de la demande" },
          { value: "handoff_to_work", label: "Transmission au travail" },
          { value: "price_quote", label: "Prix / proposition commerciale" },
          { value: "deadlines_booking", label: "Délais / prise de rendez-vous" },
          { value: "documents", label: "Documents" },
          { value: "final_client_reply", label: "Réponse finale au client" },
          { value: "not_sure", label: "Je ne suis pas sûr" },
        ],
        notesFieldKey: "human_approval_required_notes",
        notesPlaceholder: "Vous pouvez préciser brièvement où un contrôle manuel reste nécessaire et pourquoi.",
      },
      sensitive_data_or_constraints: {
        key: "sensitive_data_or_constraints",
        label: "Y a-t-il des données sensibles, des contraintes ou des particularités à respecter ?",
        type: "textarea",
        required: false,
        helperText: "S’il existe des contraintes liées aux données, au pays d’hébergement ou aux documents internes, indiquez-les ici.",
        placeholder: "Par exemple : données personnelles clients, informations financières, documents internes.",
        example: "Par exemple : données personnelles clients, informations financières, documents internes.",
      },
      what_must_not_happen: {
        key: "what_must_not_happen",
        label: "Qu’est-ce qui ne doit surtout pas se produire dans cette automatisation ?",
        type: "textarea",
        required: true,
        helperText: "Par exemple : l’agent ne doit pas promettre un prix, un délai ou répondre sans validation.",
        placeholder: "Par exemple : il ne faut pas envoyer de message sans vérification, ni modifier le CRM sans validation.",
        example: "Il ne faut pas envoyer de message sans vérification et il ne faut pas modifier le CRM sans validation.",
        assistantTrigger: true,
      },
      preferred_start_mode: {
        key: "preferred_start_mode",
        label: "Par quoi voulez-vous commencer ?",
        type: "select",
        required: true,
        helperText: "En cas d’hésitation, le plus sûr est souvent un audit, un pilote ou un court échange d’introduction.",
        options: [
          { value: "audit_review", label: "Audit et cadrage du processus" },
          { value: "pilot_one_process", label: "Pilote sur un seul processus" },
          { value: "ai_agent_incoming_requests", label: "Agent IA pour les demandes entrantes" },
          { value: "ai_agent_customer_requests", label: "Agent IA pour les demandes clients" },
          { value: "document_automation", label: "Automatisation documentaire" },
          { value: "discovery_call_only", label: "Seulement un appel d’introduction pour l’instant" },
          { value: "not_sure", label: "Je ne suis pas sûr" },
        ],
        assistantTrigger: true,
      },
      timeline_priority: {
        key: "timeline_priority",
        label: "À quel point est-ce urgent pour vous ?",
        type: "select",
        required: false,
        helperText: "Vous pouvez choisir un repère, même si la date n’est pas encore fixée.",
        options: [
          { value: "asap", label: "Le plus vite possible" },
          { value: "2_4_weeks", label: "Dans les 2 à 4 prochaines semaines" },
          { value: "1_3_months", label: "Dans les 1 à 3 prochains mois" },
          { value: "exploring", label: "Je regarde simplement les options" },
        ],
      },
      budget_range: {
        key: "budget_range",
        label: "Avez-vous un ordre de budget ?",
        type: "select",
        required: false,
        helperText: "Ce champ est facultatif. S’il n’y a pas encore de budget, c’est normal.",
        options: [
          { value: "no_budget_yet", label: "Pas encore de budget" },
          { value: "audit_first", label: "Il faut d’abord un audit" },
          { value: "up_to_1000", label: "Jusqu’à 1 000 €" },
          { value: "1000_3000", label: "1 000–3 000 €" },
          { value: "3000_10000", label: "3 000–10 000 €" },
          { value: "10000_plus", label: "10 000 €+" },
          { value: "prefer_to_discuss", label: "Je préfère en discuter" },
        ],
      },
      contact_name: {
        key: "contact_name",
        label: "Nom",
        type: "text",
        required: true,
        helperText: "Le nom de la personne avec qui poursuivre l’échange.",
        placeholder: "Jean",
        example: "Jean",
      },
      contact_email: {
        key: "contact_email",
        label: "Email",
        type: "email",
        required: true,
        helperText: "Canal principal pour la suite.",
        placeholder: "jean@example.com",
        example: "jean@example.com",
      },
      contact_phone_or_whatsapp: {
        key: "contact_phone_or_whatsapp",
        label: "Téléphone / WhatsApp",
        type: "text",
        required: false,
        helperText: "Vous pouvez indiquer un seul numéro s’il convient pour l’appel et pour WhatsApp.",
        placeholder: "+33 7 80 72 09 94",
        example: "+33 7 80 72 09 94",
      },
      preferred_contact_method: {
        key: "preferred_contact_method",
        label: "Quel canal préférez-vous pour la réponse ?",
        type: "select",
        required: false,
        helperText: "Si vous n’avez pas de préférence, choisissez « Peu importe ».",
        options: [
          { value: "email", label: "Email" },
          { value: "whatsapp", label: "WhatsApp" },
          { value: "phone", label: "Téléphone" },
          { value: "meeting", label: "Appel / meeting" },
          { value: "no_matter", label: "Peu importe" },
        ],
      },
      business_type_other: {
        key: "business_type_other",
        label: "Précision sur le type d’activité",
        type: "text",
        required: false,
        helperText: "À remplir si vous avez choisi « Autre ».",
        placeholder: "Décrivez brièvement l’activité",
      },
      priority_use_case_other: {
        key: "priority_use_case_other",
        label: "Précision sur le scénario",
        type: "text",
        required: false,
        helperText: "À remplir si vous avez choisi « Autre ».",
        placeholder: "Décrivez brièvement le scénario",
      },
      current_channels_other: {
        key: "current_channels_other",
        label: "Autre canal",
        type: "text",
        required: false,
        helperText: "À remplir si vous avez choisi « Autre ».",
        placeholder: "Précisez l’autre canal",
      },
      human_approval_required_notes: {
        key: "human_approval_required_notes",
        label: "Commentaire sur le contrôle humain",
        type: "textarea",
        required: false,
        helperText: "Vous pouvez expliquer brièvement où un contrôle manuel reste nécessaire.",
        placeholder: "Par exemple : le premier message peut être automatisé, mais le prix et les délais doivent être validés par une personne.",
        example: "Le premier message peut être automatisé, mais le prix et les délais doivent être validés par une personne.",
      },
    };
  }

  return {
    company_name: {
      key: "company_name",
      label: "Название компании / проекта",
      type: "text",
      required: true,
      helperText: "Укажите, как называется бизнес или проект.",
      placeholder: "AzurSysTech",
      example: "AzurSysTech",
    },
    website_url: {
      key: "website_url",
      label: "Сайт компании",
      type: "text",
      required: false,
      helperText: "Можно оставить пустым, если сайта ещё нет. Достаточно домена, например azursystech.fr.",
      placeholder: "azursystech.fr",
      example: "azursystech.fr",
    },
    business_type: {
      key: "business_type",
      label: "Тип бизнеса",
      type: "select",
      required: true,
      helperText: "Выберите наиболее близкий тип бизнеса.",
      assistantTrigger: true,
      options: [
        { value: "local_service_company", label: "Локальная сервисная компания" },
        { value: "small_office_cabinet", label: "Небольшой офис / кабинет" },
        { value: "ecommerce", label: "E-commerce" },
        { value: "retail_store", label: "Розница / магазин" },
        { value: "agency_studio", label: "Агентство / студия" },
        { value: "consultant_expert_business", label: "Консультант / экспертный бизнес" },
        { value: "other", label: "Другое" },
      ],
      allowOther: true,
      otherFieldKey: "business_type_other",
      otherPlaceholder: "Кратко опишите тип бизнеса",
    },
    target_market: {
      key: "target_market",
      label: "Основной рынок / география",
      type: "text",
      required: false,
      helperText: "Можно указать страну, регион или несколько рынков.",
      placeholder: "Франция, ЕС",
      example: "Франция, ЕС",
    },
    team_size: {
      key: "team_size",
      label: "Размер команды",
      type: "select",
      required: false,
      helperText: "Если точного числа нет, выберите ближайший диапазон.",
      options: [
        { value: "1", label: "1" },
        { value: "2_5", label: "2–5" },
        { value: "6_10", label: "6–10" },
        { value: "11_25", label: "11–25" },
        { value: "25_plus", label: "25+" },
      ],
    },
    main_goal: {
      key: "main_goal",
      label: "Что вы хотите автоматизировать в первую очередь?",
      type: "textarea",
      required: true,
      helperText: "Опишите один главный процесс, который нужно улучшить первым.",
      placeholder: "Хочу автоматизировать первичную обработку заявок с сайта и WhatsApp.",
      example: "Хочу автоматизировать первичную обработку заявок с сайта и WhatsApp.",
      assistantTrigger: true,
    },
    main_problem: {
      key: "main_problem",
      label: "Какая проблема сейчас ощущается сильнее всего?",
      type: "textarea",
      required: true,
      helperText: "Укажите, где сейчас теряется время, управляемость или заявки.",
      placeholder: "Заявки приходят из разных каналов, часть теряется, а сотрудники тратят много времени на одинаковые уточнения.",
      example: "Заявки приходят из разных каналов, часть теряется, а сотрудники тратят много времени на одинаковые уточнения.",
      assistantTrigger: true,
    },
    desired_result: {
      key: "desired_result",
      label: "Какой результат вы хотите получить на выходе?",
      type: "textarea",
      required: true,
      helperText: "Опишите результат через бизнес-эффект, а не через стек.",
      placeholder: "Чтобы обращения автоматически собирались в одну структуру, оценивались и передавались дальше с краткой сводкой.",
      example: "Чтобы обращения автоматически собирались в одну структуру, оценивались и передавались дальше с краткой сводкой.",
      assistantTrigger: true,
    },
    priority_use_case: {
      key: "priority_use_case",
      label: "Какой сценарий сейчас самый важный?",
      type: "select",
      required: true,
      helperText: "Если есть несколько сценариев, выберите главный первый шаг.",
      assistantTrigger: true,
      options: [
        { value: "website_leads", label: "Обработка заявок с сайта" },
        { value: "messenger_intake", label: "Первичный приём из чата / мессенджеров" },
        { value: "qualification", label: "Первичная оценка запроса" },
        { value: "customer_support", label: "Клиентская поддержка по типовым вопросам" },
        { value: "routing", label: "Маршрутизация обращений" },
        { value: "follow_up", label: "Повторные касания и напоминания" },
        { value: "document_workflow", label: "Шаблонный документооборот" },
        { value: "other", label: "Другое" },
      ],
      allowOther: true,
      otherFieldKey: "priority_use_case_other",
      otherPlaceholder: "Кратко опишите сценарий",
    },
    why_now: {
      key: "why_now",
      label: "Почему вы хотите заняться этим сейчас?",
      type: "textarea",
      required: false,
      helperText: "Это поле не обязательное, но помогает понять срочность запроса.",
      placeholder: "Количество обращений выросло, и ручная обработка уже тормозит продажи.",
      example: "Количество обращений выросло, и ручная обработка уже тормозит продажи.",
    },
    current_process_description: {
      key: "current_process_description",
      label: "Как этот процесс выглядит сейчас?",
      type: "textarea",
      required: true,
      helperText: "Опишите процесс простыми шагами: откуда приходит запрос, кто отвечает, что происходит дальше.",
      placeholder: "Клиент оставляет заявку на сайте или пишет в WhatsApp, потом менеджер вручную уточняет детали и переносит всё в таблицу.",
      example: "Клиент оставляет заявку на сайте или пишет в WhatsApp, потом менеджер вручную уточняет детали и переносит всё в таблицу.",
      assistantTrigger: true,
    },
    current_channels: {
      key: "current_channels",
      label: "Через какие каналы сейчас приходят заявки и обращения?",
      type: "multi_select",
      required: true,
      helperText: "Выберите все реальные каналы, которые уже работают сейчас.",
      assistantTrigger: true,
      options: [
        { value: "website_form", label: "Сайт / форма" },
        { value: "website_chat", label: "Чат на сайте" },
        { value: "whatsapp", label: "WhatsApp" },
        { value: "facebook_instagram", label: "Facebook / Instagram" },
        { value: "email", label: "Email" },
        { value: "phone", label: "Телефон" },
        { value: "crm", label: "CRM" },
        { value: "marketplace", label: "Маркетплейс" },
        { value: "other", label: "Другое" },
      ],
      allowOther: true,
      otherFieldKey: "current_channels_other",
      otherPlaceholder: "Укажите другой канал",
    },
    current_owner_of_process: {
      key: "current_owner_of_process",
      label: "Кто сейчас обрабатывает этот процесс?",
      type: "text",
      required: false,
      helperText: "Можно указать роль, а не конкретное имя.",
      placeholder: "Владелец бизнеса, менеджер или администратор",
      example: "Менеджер и владелец бизнеса",
    },
    main_bottleneck: {
      key: "main_bottleneck",
      label: "Где сейчас самый узкий участок процесса?",
      type: "textarea",
      required: true,
      helperText: "Помогите выделить одно основное узкое место, а не весь список проблем.",
      placeholder: "На этапе первого ответа и сбора информации: нужно вручную задавать одни и те же вопросы.",
      example: "На этапе первого ответа и сбора информации: нужно вручную задавать одни и те же вопросы.",
      assistantTrigger: true,
    },
    current_tools: {
      key: "current_tools",
      label: "Какие системы или инструменты уже используются сейчас?",
      type: "textarea",
      required: false,
      helperText: "Достаточно базового перечисления: сайт, таблицы, CRM, мессенджеры.",
      placeholder: "Сайт, Google Sheets, WhatsApp, CRM",
      example: "Сайт, Google Sheets, WhatsApp, CRM",
    },
    human_approval_required: {
      key: "human_approval_required",
      label: "На каких этапах обязательно нужен контроль человека?",
      type: "multi_select",
      required: true,
      helperText: "Это поле помогает понять, где автоматизация допустима, а где нужен контроль человека.",
      assistantTrigger: true,
      options: [
        { value: "first_response", label: "Первый ответ" },
        { value: "qualification", label: "Оценка запроса" },
        { value: "handoff_to_work", label: "Передача в работу" },
        { value: "price_quote", label: "Цена / коммерческое предложение" },
        { value: "deadlines_booking", label: "Сроки / запись" },
        { value: "documents", label: "Документы" },
        { value: "final_client_reply", label: "Финальный ответ клиенту" },
        { value: "not_sure", label: "Не уверен" },
      ],
      notesFieldKey: "human_approval_required_notes",
      notesPlaceholder: "Можно коротко пояснить, где нужен ручной контроль и почему.",
    },
    sensitive_data_or_constraints: {
      key: "sensitive_data_or_constraints",
      label: "Есть ли чувствительные данные, ограничения или особенности, которые нужно учитывать?",
      type: "textarea",
      required: false,
      helperText: "Если есть ограничения по данным, стране хранения или внутренним документам, укажите их здесь.",
      placeholder: "Например: персональные данные клиентов, финансовая информация, внутренние документы.",
      example: "Например: персональные данные клиентов, финансовая информация, внутренние документы.",
    },
    what_must_not_happen: {
      key: "what_must_not_happen",
      label: "Чего точно не должно происходить в такой автоматизации?",
      type: "textarea",
      required: true,
      helperText: "Например: агент не должен обещать цену, сроки или писать без проверки.",
      placeholder: "Например: нельзя отправлять сообщения без проверки, нельзя менять CRM без подтверждения.",
      example: "Нельзя отправлять сообщения без проверки и нельзя менять CRM без подтверждения.",
      assistantTrigger: true,
    },
    preferred_start_mode: {
      key: "preferred_start_mode",
      label: "С чего вы хотите начать?",
      type: "select",
      required: true,
      helperText: "Если не уверены, безопаснее выбрать аудит, пилот или короткий вводный звонок.",
      options: [
        { value: "audit_review", label: "Аудит и разбор процесса" },
        { value: "pilot_one_process", label: "Пилот на одном процессе" },
        { value: "ai_agent_incoming_requests", label: "ИИ-агент для обработки заявок" },
        { value: "ai_agent_customer_requests", label: "ИИ-агент для клиентских обращений" },
        { value: "document_automation", label: "Автоматизация документооборота" },
        { value: "discovery_call_only", label: "Пока нужен только вводный звонок" },
        { value: "not_sure", label: "Не уверен" },
      ],
      assistantTrigger: true,
    },
    timeline_priority: {
      key: "timeline_priority",
      label: "Насколько срочно вы хотите начать?",
      type: "select",
      required: false,
      helperText: "Можно выбрать ориентир, даже если дата пока не точная.",
      options: [
        { value: "asap", label: "Как можно скорее" },
        { value: "2_4_weeks", label: "В ближайшие 2–4 недели" },
        { value: "1_3_months", label: "В ближайшие 1–3 месяца" },
        { value: "exploring", label: "Просто изучаю варианты" },
      ],
    },
    budget_range: {
      key: "budget_range",
      label: "Есть ли ориентир по бюджету?",
      type: "select",
      required: false,
      helperText: "Поле опциональное. Если пока без бюджета, это нормально.",
      options: [
        { value: "no_budget_yet", label: "Пока без бюджета" },
        { value: "audit_first", label: "Сначала нужен аудит" },
        { value: "up_to_1000", label: "До 1 000 €" },
        { value: "1000_3000", label: "1 000–3 000 €" },
        { value: "3000_10000", label: "3 000–10 000 €" },
        { value: "10000_plus", label: "10 000 €+" },
        { value: "prefer_to_discuss", label: "Предпочитаю обсудить" },
      ],
    },
    contact_name: {
      key: "contact_name",
      label: "Имя",
      type: "text",
      required: true,
      helperText: "Имя человека, с которым можно продолжить обсуждение.",
      placeholder: "Иван",
      example: "Иван",
    },
    contact_email: {
      key: "contact_email",
      label: "Email",
      type: "email",
      required: true,
      helperText: "Главный канал для follow-up.",
      placeholder: "ivan@example.com",
      example: "ivan@example.com",
    },
    contact_phone_or_whatsapp: {
      key: "contact_phone_or_whatsapp",
      label: "Телефон / WhatsApp",
      type: "text",
      required: false,
      helperText: "Можно указать один номер, если он удобен и для звонка, и для WhatsApp.",
      placeholder: "+33 7 80 72 09 94",
      example: "+33 7 80 72 09 94",
    },
    preferred_contact_method: {
      key: "preferred_contact_method",
      label: "Как с вами удобнее связаться?",
      type: "select",
      required: false,
      helperText: "Если нет предпочтения, можно выбрать «Не важно».",
      options: [
        { value: "email", label: "Email" },
        { value: "whatsapp", label: "WhatsApp" },
        { value: "phone", label: "Телефон" },
        { value: "meeting", label: "Созвон / meeting" },
        { value: "no_matter", label: "Не важно" },
      ],
    },
    business_type_other: {
      key: "business_type_other",
      label: "Уточнение типа бизнеса",
      type: "text",
      required: false,
      helperText: "Заполните, если в типе бизнеса выбрано «Другое».",
      placeholder: "Кратко опишите тип бизнеса",
    },
    priority_use_case_other: {
      key: "priority_use_case_other",
      label: "Уточнение сценария",
      type: "text",
      required: false,
      helperText: "Заполните, если в сценарии выбрано «Другое».",
      placeholder: "Кратко опишите сценарий",
    },
    current_channels_other: {
      key: "current_channels_other",
      label: "Другой канал",
      type: "text",
      required: false,
      helperText: "Заполните, если в каналах выбрано «Другое».",
      placeholder: "Укажите другой канал",
    },
    human_approval_required_notes: {
      key: "human_approval_required_notes",
      label: "Комментарий к ручному контролю",
      type: "textarea",
      required: false,
      helperText: "Можно коротко пояснить, где именно нужен ручной контроль.",
      placeholder: "Например: первый ответ можно автоматизировать, но цену и сроки должен подтверждать человек.",
      example: "Первый ответ можно автоматизировать, но цену и сроки должен подтверждать человек.",
    },
  };
}

export function getBriefFields(locale: BriefLocale = "ru"): Record<BriefFieldKey, BriefFieldDefinition> {
  return createBriefFields(locale);
}

export const BRIEF_FIELDS: Record<BriefFieldKey, BriefFieldDefinition> = getBriefFields("ru");

const BRIEF_FIELD_RULES: BriefFieldRule[] = [
  { key: "company_name", required: true, minLength: 2, maxLength: 120 },
  { key: "website_url", required: false, maxLength: 400 },
  { key: "business_type", required: true },
  { key: "target_market", required: false, maxLength: 120 },
  { key: "team_size", required: false },
  { key: "main_goal", required: true, minLength: 15, maxLength: 2000 },
  { key: "main_problem", required: true, minLength: 15, maxLength: 2000 },
  { key: "desired_result", required: true, minLength: 15, maxLength: 2000 },
  { key: "priority_use_case", required: true },
  { key: "why_now", required: false, minLength: 8, maxLength: 2000 },
  { key: "current_process_description", required: true, minLength: 15, maxLength: 2500 },
  { key: "current_channels", required: true },
  { key: "current_owner_of_process", required: false, maxLength: 120 },
  { key: "main_bottleneck", required: true, minLength: 15, maxLength: 2000 },
  { key: "current_tools", required: false, maxLength: 2000 },
  { key: "human_approval_required", required: true },
  { key: "sensitive_data_or_constraints", required: false, maxLength: 2000 },
  { key: "what_must_not_happen", required: true, minLength: 15, maxLength: 2000 },
  { key: "preferred_start_mode", required: true },
  { key: "timeline_priority", required: false },
  { key: "budget_range", required: false },
  { key: "contact_name", required: true, minLength: 2, maxLength: 120 },
  { key: "contact_email", required: true, maxLength: 254 },
  { key: "contact_phone_or_whatsapp", required: false, maxLength: 60 },
  { key: "preferred_contact_method", required: false },
];

export function getBriefSteps(locale: BriefLocale = "ru"): BriefStepDefinition[] {
  const fields = getBriefFields(locale);

  if (locale === "fr") {
    return [
      {
        id: "business-context",
        title: "Entreprise et contexte",
        shortDescription: "Contexte rapide sur l’entreprise et le marché.",
        fields: [
          fields.company_name,
          fields.website_url,
          fields.business_type,
          fields.target_market,
          fields.team_size,
        ],
      },
      {
        id: "goal-and-problem",
        title: "Objectif et problème",
        shortDescription: "Ce qu’il faut automatiser et pourquoi.",
        fields: [
          fields.main_goal,
          fields.main_problem,
          fields.desired_result,
          fields.priority_use_case,
          fields.why_now,
        ],
      },
      {
        id: "current-process",
        title: "Processus actuel",
        shortDescription: "Comment cela fonctionne aujourd’hui et où se trouve le blocage.",
        fields: [
          fields.current_process_description,
          fields.current_channels,
          fields.current_owner_of_process,
          fields.main_bottleneck,
        ],
      },
      {
        id: "constraints-and-control",
        title: "Contraintes et contrôle",
        shortDescription: "Outils utilisés, limites et validation humaine.",
        fields: [
          fields.current_tools,
          fields.human_approval_required,
          fields.human_approval_required_notes,
          fields.sensitive_data_or_constraints,
          fields.what_must_not_happen,
        ],
      },
      {
        id: "launch-and-contact",
        title: "Démarrage et contact",
        shortDescription: "Quel prochain pas vous convient et comment vous recontacter.",
        fields: [
          fields.preferred_start_mode,
          fields.timeline_priority,
          fields.budget_range,
          fields.contact_name,
          fields.contact_email,
          fields.contact_phone_or_whatsapp,
          fields.preferred_contact_method,
        ],
      },
    ];
  }

  return [
    {
      id: "business-context",
      title: "О компании / бизнесе",
      shortDescription: "Краткий контекст по компании и рынку.",
      fields: [
        fields.company_name,
        fields.website_url,
        fields.business_type,
        fields.target_market,
        fields.team_size,
      ],
    },
    {
      id: "goal-and-problem",
      title: "О задаче и цели автоматизации",
      shortDescription: "Что нужно автоматизировать и зачем.",
      fields: [
        fields.main_goal,
        fields.main_problem,
        fields.desired_result,
        fields.priority_use_case,
        fields.why_now,
      ],
    },
    {
      id: "current-process",
      title: "О текущем процессе",
      shortDescription: "Как всё устроено сейчас и где возникает узкое место.",
      fields: [
        fields.current_process_description,
        fields.current_channels,
        fields.current_owner_of_process,
        fields.main_bottleneck,
      ],
    },
    {
      id: "constraints-and-control",
      title: "Системы, ограничения и контроль",
      shortDescription: "Какие инструменты используются и где нужен человек.",
      fields: [
        fields.current_tools,
        fields.human_approval_required,
        fields.human_approval_required_notes,
        fields.sensitive_data_or_constraints,
        fields.what_must_not_happen,
      ],
    },
    {
      id: "launch-and-contact",
      title: "Запуск и контакт",
      shortDescription: "Какой следующий шаг нужен и как удобнее связаться.",
      fields: [
        fields.preferred_start_mode,
        fields.timeline_priority,
        fields.budget_range,
        fields.contact_name,
        fields.contact_email,
        fields.contact_phone_or_whatsapp,
        fields.preferred_contact_method,
      ],
    },
  ];
}

export const BRIEF_STEPS: BriefStepDefinition[] = getBriefSteps("ru");

const BRIEF_COPY = {
  fr: {
    validation: {
      selectAtLeastOneChannel: "Sélectionnez au moins un canal",
      enterEmail: "Indiquez un email",
      fillRequiredField: "Remplissez le champ obligatoire",
      enterCompanyName: "Indiquez le nom de l’entreprise ou du projet",
      addMoreDetails: "Ajoutez un peu plus de détails",
      invalidPhone: "Vérifiez le numéro de téléphone",
      answerTooLong: "Réponse trop longue",
      selectValueFromList: "Choisissez une valeur dans la liste",
      specifyBusinessType: "Précisez le type d’activité",
      specifyUseCase: "Précisez le scénario",
      specifyOtherChannel: "Précisez l’autre canal",
      selectAtLeastOneStage: "Sélectionnez au moins une étape",
      invalidEmailFormat: "Vérifiez le format de l’email",
      invalidPhoneFormat: "Vérifiez le format du téléphone",
      invalidUrlFormat: "Vérifiez le format de l’URL",
      invalidDataFormat: "Format de données incorrect",
    },
    handoff: {
      notSpecified: "Non indiqué",
      labels: {
        company: "Entreprise",
        businessType: "Type d’activité",
        goal: "Objectif",
        problem: "Problème",
        result: "Résultat",
        useCase: "Scénario",
        currentProcess: "Processus actuel",
        channels: "Canaux",
        bottleneck: "Goulot",
        humanControl: "Contrôle humain",
        forbidden: "À ne pas faire",
        nextStep: "Prochaine étape",
      },
    },
  },
  ru: {
    validation: {
      selectAtLeastOneChannel: "Выберите хотя бы один канал",
      enterEmail: "Укажите email",
      fillRequiredField: "Заполните обязательное поле",
      enterCompanyName: "Укажите название компании или проекта",
      addMoreDetails: "Добавьте немного больше деталей",
      invalidPhone: "Проверьте номер телефона",
      answerTooLong: "Слишком длинный ответ",
      selectValueFromList: "Выберите значение из списка",
      specifyBusinessType: "Уточните тип бизнеса",
      specifyUseCase: "Уточните сценарий",
      specifyOtherChannel: "Уточните другой канал",
      selectAtLeastOneStage: "Выберите хотя бы один этап",
      invalidEmailFormat: "Проверьте формат email",
      invalidPhoneFormat: "Проверьте формат телефона",
      invalidUrlFormat: "Проверьте формат URL",
      invalidDataFormat: "Некорректный формат данных",
    },
    handoff: {
      notSpecified: "Не указано",
      labels: {
        company: "Компания",
        businessType: "Тип бизнеса",
        goal: "Цель",
        problem: "Проблема",
        result: "Результат",
        useCase: "Сценарий",
        currentProcess: "Текущий процесс",
        channels: "Каналы",
        bottleneck: "Узкое место",
        humanControl: "Контроль человека",
        forbidden: "Что не должно происходить",
        nextStep: "Следующий шаг",
      },
    },
  },
} as const;

function getBriefCopy(locale: BriefLocale) {
  return BRIEF_COPY[locale];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toTrimmedString(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function toTrimmedStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => toTrimmedString(item)).filter((item) => item.length > 0);
}

function isOneOf<T extends readonly string[]>(value: string, options: T): value is T[number] {
  return (options as readonly string[]).includes(value);
}

function isSoftUrl(value: string): boolean {
  if (!value) {
    return false;
  }

  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    try {
      const parsed = new URL(`https://${value}`);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  }
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function hasPhoneLikeShape(value: string): boolean {
  return value.length >= 6 && /\d/.test(value);
}

function hasMinLength(value: string, minLength: number): boolean {
  return value.trim().length >= minLength;
}

function pickEnumValue<T extends readonly string[]>(value: unknown, options: T): T[number] | "" {
  const trimmed = toTrimmedString(value);
  return isOneOf(trimmed, options) ? trimmed : "";
}

function validateCommonFields(
  values: Record<string, unknown>,
  fieldKeys: BriefFieldKey[],
  locale: BriefLocale,
): BriefValidationIssue[] {
  const issues: BriefValidationIssue[] = [];
  const fieldKeySet = new Set(fieldKeys);
  const copy = getBriefCopy(locale).validation;

  for (const rule of BRIEF_FIELD_RULES) {
    if (!fieldKeySet.has(rule.key)) {
      continue;
    }

    const fieldValue = values[rule.key];
    const trimmed = typeof fieldValue === "string" ? fieldValue.trim() : "";

    if (rule.required) {
      if (rule.key === "current_channels") {
        if (!Array.isArray(fieldValue) || toTrimmedStringArray(fieldValue).length === 0) {
          issues.push({
            field: rule.key,
            message: copy.selectAtLeastOneChannel,
          });
          continue;
        }
      } else if (rule.key === "human_approval_required") {
        continue;
      } else if (rule.key === "contact_email") {
        if (!trimmed) {
          issues.push({ field: rule.key, message: copy.enterEmail });
          continue;
        }
      } else if (!trimmed) {
        issues.push({
          field: rule.key,
          message: rule.key === "company_name" ? copy.enterCompanyName : copy.fillRequiredField,
        });
        continue;
      }
    }

    if (trimmed && rule.minLength && trimmed.length < rule.minLength) {
      issues.push({
        field: rule.key,
        message: rule.key === "contact_phone_or_whatsapp" ? copy.invalidPhone : copy.addMoreDetails,
      });
      continue;
    }

    if (trimmed && rule.maxLength && trimmed.length > rule.maxLength) {
      issues.push({
        field: rule.key,
        message: copy.answerTooLong,
      });
    }
  }

  return issues;
}

function normalizeBriefValues(values: BriefValuesInput): BriefFormValues {
  const businessType = pickEnumValue(values.business_type, BRIEF_BUSINESS_TYPES);
  const teamSize = pickEnumValue(values.team_size, BRIEF_TEAM_SIZES);
  const priorityUseCase = pickEnumValue(values.priority_use_case, BRIEF_PRIORITY_USE_CASES);
  const preferredStartMode = pickEnumValue(values.preferred_start_mode, BRIEF_START_MODES);
  const timelinePriority = pickEnumValue(values.timeline_priority, BRIEF_TIMELINE_PRIORITIES);
  const budgetRange = pickEnumValue(values.budget_range, BRIEF_BUDGET_RANGES);
  const preferredContactMethod = pickEnumValue(values.preferred_contact_method, BRIEF_CONTACT_METHODS);

  return {
    company_name: toTrimmedString(values.company_name),
    website_url: toTrimmedString(values.website_url),
    business_type: businessType,
    business_type_other: toTrimmedString(values.business_type_other),
    target_market: toTrimmedString(values.target_market),
    team_size: teamSize,
    main_goal: toTrimmedString(values.main_goal),
    main_problem: toTrimmedString(values.main_problem),
    desired_result: toTrimmedString(values.desired_result),
    priority_use_case: priorityUseCase,
    priority_use_case_other: toTrimmedString(values.priority_use_case_other),
    why_now: toTrimmedString(values.why_now),
    current_process_description: toTrimmedString(values.current_process_description),
    current_channels: toTrimmedStringArray(values.current_channels).filter((item): item is BriefCurrentChannel =>
      isOneOf(item, BRIEF_CURRENT_CHANNELS),
    ),
    current_channels_other: toTrimmedString(values.current_channels_other),
    current_owner_of_process: toTrimmedString(values.current_owner_of_process),
    main_bottleneck: toTrimmedString(values.main_bottleneck),
    current_tools: toTrimmedString(values.current_tools),
    human_approval_required: toTrimmedStringArray(values.human_approval_required).filter(
      (item): item is BriefApprovalStage => isOneOf(item, BRIEF_APPROVAL_STAGES),
    ),
    human_approval_required_notes: toTrimmedString(values.human_approval_required_notes),
    sensitive_data_or_constraints: toTrimmedString(values.sensitive_data_or_constraints),
    what_must_not_happen: toTrimmedString(values.what_must_not_happen),
    preferred_start_mode: preferredStartMode,
    timeline_priority: timelinePriority,
    budget_range: budgetRange,
    contact_name: toTrimmedString(values.contact_name),
    contact_email: toTrimmedString(values.contact_email),
    contact_phone_or_whatsapp: toTrimmedString(values.contact_phone_or_whatsapp),
    preferred_contact_method: preferredContactMethod,
  };
}

function validateEnumField<T extends readonly string[]>(
  field: string,
  value: string,
  allowed: T,
  issues: BriefValidationIssue[],
  locale: BriefLocale,
) {
  if (value && !isOneOf(value, allowed)) {
    issues.push({ field, message: getBriefCopy(locale).validation.selectValueFromList });
  }
}

function validateBriefBusinessType(values: BriefFormValues, issues: BriefValidationIssue[], locale: BriefLocale) {
  validateEnumField("business_type", values.business_type, BRIEF_BUSINESS_TYPES, issues, locale);
  if (values.business_type === "other" && !hasMinLength(values.business_type_other, 2)) {
    issues.push({ field: "business_type_other", message: getBriefCopy(locale).validation.specifyBusinessType });
  }
}

function validateBriefPriorityUseCase(values: BriefFormValues, issues: BriefValidationIssue[], locale: BriefLocale) {
  validateEnumField("priority_use_case", values.priority_use_case, BRIEF_PRIORITY_USE_CASES, issues, locale);
  if (values.priority_use_case === "other" && !hasMinLength(values.priority_use_case_other, 2)) {
    issues.push({ field: "priority_use_case_other", message: getBriefCopy(locale).validation.specifyUseCase });
  }
}

function validateBriefCurrentChannels(values: BriefFormValues, issues: BriefValidationIssue[], locale: BriefLocale) {
  if (values.current_channels.includes("other") && !hasMinLength(values.current_channels_other, 2)) {
    issues.push({ field: "current_channels_other", message: getBriefCopy(locale).validation.specifyOtherChannel });
  }
}

function validateBriefHumanApproval(values: BriefFormValues, issues: BriefValidationIssue[], locale: BriefLocale) {
  const hasNotes = values.human_approval_required_notes.length > 0;
  const copy = getBriefCopy(locale).validation;

  if (values.human_approval_required.length === 0) {
    issues.push({
      field: "human_approval_required",
      message: copy.selectAtLeastOneStage,
    });
    return;
  }

  if (hasNotes && values.human_approval_required_notes.length < 10) {
    issues.push({
      field: "human_approval_required_notes",
      message: copy.addMoreDetails,
    });
  }
}

function validateBriefContact(values: BriefFormValues, issues: BriefValidationIssue[], locale: BriefLocale) {
  const copy = getBriefCopy(locale).validation;
  if (values.contact_email && !isEmail(values.contact_email)) {
    issues.push({ field: "contact_email", message: copy.invalidEmailFormat });
  }

  if (values.contact_phone_or_whatsapp && !hasPhoneLikeShape(values.contact_phone_or_whatsapp)) {
    issues.push({ field: "contact_phone_or_whatsapp", message: copy.invalidPhoneFormat });
  }
}

function validateBriefUrls(values: BriefFormValues, issues: BriefValidationIssue[], locale: BriefLocale) {
  if (values.website_url && !isSoftUrl(values.website_url)) {
    issues.push({ field: "website_url", message: getBriefCopy(locale).validation.invalidUrlFormat });
  }
}

function validateBriefSelects(
  values: BriefFormValues,
  issues: BriefValidationIssue[],
  fieldKeySet: Set<BriefFieldKey>,
  locale: BriefLocale,
) {
  if (fieldKeySet.has("team_size")) {
    validateEnumField("team_size", values.team_size, BRIEF_TEAM_SIZES, issues, locale);
  }

  if (fieldKeySet.has("preferred_start_mode")) {
    validateEnumField("preferred_start_mode", values.preferred_start_mode, BRIEF_START_MODES, issues, locale);
  }

  if (fieldKeySet.has("timeline_priority")) {
    validateEnumField("timeline_priority", values.timeline_priority, BRIEF_TIMELINE_PRIORITIES, issues, locale);
  }

  if (fieldKeySet.has("budget_range")) {
    validateEnumField("budget_range", values.budget_range, BRIEF_BUDGET_RANGES, issues, locale);
  }

  if (fieldKeySet.has("preferred_contact_method")) {
    validateEnumField("preferred_contact_method", values.preferred_contact_method, BRIEF_CONTACT_METHODS, issues, locale);
  }

  if (fieldKeySet.has("business_type")) {
    validateBriefBusinessType(values, issues, locale);
  }

  if (fieldKeySet.has("priority_use_case")) {
    validateBriefPriorityUseCase(values, issues, locale);
  }

  if (fieldKeySet.has("current_channels")) {
    validateBriefCurrentChannels(values, issues, locale);
  }

  if (fieldKeySet.has("human_approval_required")) {
    validateBriefHumanApproval(values, issues, locale);
  }
}

function validateBriefValuesInternal(
  values: BriefValuesInput,
  fieldKeys: BriefFieldKey[],
  locale: BriefLocale,
): BriefValidationResult {
  if (!isRecord(values)) {
    return {
      kind: "validation_error",
      issues: [{ field: "values", message: getBriefCopy(locale).validation.invalidDataFormat }],
    };
  }

  const normalized = normalizeBriefValues(values);
  const issues = validateCommonFields(normalized, fieldKeys, locale);
  const fieldKeySet = new Set(fieldKeys);

  if (fieldKeySet.has("website_url")) {
    validateBriefUrls(normalized, issues, locale);
  }

  if (
    fieldKeySet.has("team_size") ||
    fieldKeySet.has("preferred_start_mode") ||
    fieldKeySet.has("timeline_priority") ||
    fieldKeySet.has("budget_range") ||
    fieldKeySet.has("preferred_contact_method") ||
    fieldKeySet.has("business_type") ||
    fieldKeySet.has("priority_use_case") ||
    fieldKeySet.has("current_channels") ||
    fieldKeySet.has("human_approval_required")
  ) {
    validateBriefSelects(normalized, issues, fieldKeySet, locale);
  }

  if (fieldKeySet.has("contact_email") || fieldKeySet.has("contact_phone_or_whatsapp")) {
    validateBriefContact(normalized, issues, locale);
  }

  if (issues.length > 0) {
    return { kind: "validation_error", issues };
  }

  return { kind: "ok", values: normalized };
}

export type BriefValuesInput = Partial<Record<BriefFieldKey, unknown>> & Record<string, unknown>;

export function createInitialBriefValues(): BriefFormValues {
  return {
    company_name: "",
    website_url: "",
    business_type: "",
    business_type_other: "",
    target_market: "",
    team_size: "",
    main_goal: "",
    main_problem: "",
    desired_result: "",
    priority_use_case: "",
    priority_use_case_other: "",
    why_now: "",
    current_process_description: "",
    current_channels: [],
    current_channels_other: "",
    current_owner_of_process: "",
    main_bottleneck: "",
    current_tools: "",
    human_approval_required: [],
    human_approval_required_notes: "",
    sensitive_data_or_constraints: "",
    what_must_not_happen: "",
    preferred_start_mode: "",
    timeline_priority: "",
    budget_range: "",
    contact_name: "",
    contact_email: "",
    contact_phone_or_whatsapp: "",
    preferred_contact_method: "",
  };
}

export function validateBriefStep(
  values: BriefValuesInput,
  stepIndex: number,
  locale: BriefLocale = "ru",
): BriefValidationResult {
  const step = getBriefSteps(locale)[stepIndex];
  if (!step) {
    return validateBriefValues(values, locale);
  }

  const fieldKeys = step.fields.map((field) => field.key);
  return validateBriefValuesInternal(values, fieldKeys, locale);
}

export function validateBriefValues(values: BriefValuesInput, locale: BriefLocale = "ru"): BriefValidationResult {
  return validateBriefValuesInternal(
    values,
    getBriefSteps(locale).flatMap((step) => step.fields.map((field) => field.key)),
    locale,
  );
}

function summarizeControlNeeds(values: BriefFormValues, locale: BriefLocale): string {
  const fields = getBriefFields(locale);
  const selected = values.human_approval_required
    .map((value) => fields.human_approval_required.options?.find((option) => option.value === value)?.label ?? value)
    .join(", ");
  const notes = values.human_approval_required_notes;

  if (selected && notes) {
    return `${selected}. ${notes}`;
  }

  return selected || notes || getBriefCopy(locale).handoff.notSpecified;
}

function getRecommendedNextStep(values: BriefFormValues): BriefHandoff["recommended_next_step"] {
  switch (values.preferred_start_mode) {
    case "audit_review":
      return "audit";
    case "pilot_one_process":
    case "ai_agent_incoming_requests":
    case "ai_agent_customer_requests":
      return "pilot_discussion";
    case "document_automation":
      return "discovery_call";
    case "discovery_call_only":
      return "discovery_call";
    case "not_sure":
      return "request_more_info";
    default:
      return "out_of_scope_review";
  }
}

function buildBusinessTypeLabel(values: BriefFormValues, locale: BriefLocale): string {
  const fields = getBriefFields(locale);
  const label = fields.business_type.options?.find((option) => option.value === values.business_type)?.label;
  if (!label) {
    return getBriefCopy(locale).handoff.notSpecified;
  }

  if (values.business_type === "other" && values.business_type_other) {
    return `${label}: ${values.business_type_other}`;
  }

  return label;
}

function buildPriorityUseCaseLabel(values: BriefFormValues, locale: BriefLocale): string {
  const fields = getBriefFields(locale);
  const label = fields.priority_use_case.options?.find((option) => option.value === values.priority_use_case)?.label;
  if (!label) {
    return getBriefCopy(locale).handoff.notSpecified;
  }

  if (values.priority_use_case === "other" && values.priority_use_case_other) {
    return `${label}: ${values.priority_use_case_other}`;
  }

  return label;
}

function buildCurrentChannelsLabel(values: BriefFormValues, locale: BriefLocale): string {
  const fields = getBriefFields(locale);
  const labels = values.current_channels.map((value) => {
    const option = fields.current_channels.options?.find((entry) => entry.value === value);
    return option?.label ?? value;
  });

  if (values.current_channels.includes("other") && values.current_channels_other) {
    const otherIndex = values.current_channels.indexOf("other");
    if (otherIndex >= 0) {
      labels[otherIndex] = `${locale === "fr" ? "Autre" : "Другое"}: ${values.current_channels_other}`;
    }
  }

  return labels.join(", ") || getBriefCopy(locale).handoff.notSpecified;
}

function buildHumanApprovalLabel(values: BriefFormValues, locale: BriefLocale): string {
  const selections = summarizeControlNeeds(values, locale);
  return selections;
}

export function createBriefHandoff(values: BriefFormValues, locale: BriefLocale = "ru"): BriefHandoff {
  const fields = getBriefFields(locale);
  const copy = getBriefCopy(locale).handoff;
  const recommendedNextStep = getRecommendedNextStep(values);
  const timelineLabel =
    fields.timeline_priority.options?.find((option) => option.value === values.timeline_priority)?.label ??
    copy.notSpecified;
  const budgetLabel =
    fields.budget_range.options?.find((option) => option.value === values.budget_range)?.label ??
    copy.notSpecified;
  const contactMethodLabel =
    fields.preferred_contact_method.options?.find((option) => option.value === values.preferred_contact_method)?.label;

  const summaryParts = [
    `${copy.labels.company}: ${values.company_name || copy.notSpecified}`,
    `${copy.labels.businessType}: ${buildBusinessTypeLabel(values, locale)}`,
    `${copy.labels.goal}: ${values.main_goal || copy.notSpecified}`,
    `${copy.labels.problem}: ${values.main_problem || copy.notSpecified}`,
    `${copy.labels.result}: ${values.desired_result || copy.notSpecified}`,
    `${copy.labels.useCase}: ${buildPriorityUseCaseLabel(values, locale)}`,
    `${copy.labels.currentProcess}: ${values.current_process_description || copy.notSpecified}`,
    `${copy.labels.channels}: ${buildCurrentChannelsLabel(values, locale)}`,
    `${copy.labels.bottleneck}: ${values.main_bottleneck || copy.notSpecified}`,
    `${copy.labels.humanControl}: ${buildHumanApprovalLabel(values, locale)}`,
    `${copy.labels.forbidden}: ${values.what_must_not_happen || copy.notSpecified}`,
    `${copy.labels.nextStep}: ${
      fields.preferred_start_mode.options?.find((option) => option.value === values.preferred_start_mode)?.label ??
      copy.notSpecified
    }`,
  ];

  return {
    company_name: values.company_name,
    business_type: buildBusinessTypeLabel(values, locale),
    main_goal: values.main_goal,
    main_problem: values.main_problem,
    desired_result: values.desired_result,
    priority_use_case: buildPriorityUseCaseLabel(values, locale),
    current_process_description: values.current_process_description,
    current_channels: buildCurrentChannelsLabel(values, locale),
    main_bottleneck: values.main_bottleneck,
    human_approval_required: buildHumanApprovalLabel(values, locale),
    what_must_not_happen: values.what_must_not_happen,
    preferred_start_mode:
      fields.preferred_start_mode.options?.find((option) => option.value === values.preferred_start_mode)?.label ??
      copy.notSpecified,
    timeline_priority: timelineLabel,
    budget_range: budgetLabel,
    contact: {
      name: values.contact_name,
      email: values.contact_email,
      ...(values.contact_phone_or_whatsapp ? { phone: values.contact_phone_or_whatsapp } : {}),
      ...(contactMethodLabel ? { preferred_contact_method: contactMethodLabel } : {}),
    },
    recommended_next_step: recommendedNextStep,
    summary: summaryParts.join(" | "),
  };
}

export function buildBriefSubmissionPayload(
  values: BriefFormValues,
  metadata: Partial<BriefSubmissionMetadata> & { created_at?: string } = {},
  locale: BriefLocale = "ru",
): BriefSubmissionPayload {
  const createdAt = metadata.created_at ?? new Date().toISOString();
  const normalizedMetadata: BriefSubmissionMetadata = {
    ai_assist_used: metadata.ai_assist_used ?? false,
    assistant_interaction_count:
      typeof metadata.assistant_interaction_count === "number" && Number.isFinite(metadata.assistant_interaction_count)
        ? Math.max(0, Math.trunc(metadata.assistant_interaction_count))
        : 0,
  };

  return {
    schema_version: BRIEF_SCHEMA_VERSION,
    source: BRIEF_SOURCE,
    route: BRIEF_ROUTE,
    locale,
    created_at: createdAt,
    brief: values,
    metadata: normalizedMetadata,
    crm_handoff: createBriefHandoff(values, locale),
  };
}

export function getBriefValidationIssues(values: BriefValuesInput, locale: BriefLocale = "ru"): BriefValidationIssue[] {
  const result = validateBriefValues(values, locale);
  return result.kind === "validation_error" ? result.issues : [];
}

export function getBriefFieldDefinition(
  key: BriefFieldKey,
  locale: BriefLocale = "ru",
): BriefFieldDefinition {
  return getBriefFields(locale)[key];
}
