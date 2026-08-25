export type PageLocale = "fr" | "ru" | "en";
export type CaseIconType = "inbox" | "support" | "report" | "customer";

export interface CaseItem {
  id: string;
  title: string;
  copy: string;
  control: string;
  icon: CaseIconType;
}

export interface StepItem {
  num: string;
  title: string;
  desc: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface AiAutomationContent {
  meta: {
    title: string;
    description: string;
  };
  jsonLd: {
    webPageName: string;
    webPageDescription: string;
    serviceName: string;
    serviceType: string;
    serviceDescription: string;
    areaServed: string;
    inLanguage: string;
  };
  backLink: string;
  heroEyebrow: string;
  heroTitle: string;
  heroIntro: string;
  trustBullets: string[];
  heroPrimaryCta: string;
  heroAnchorTitle: string;
  heroAnchorIntro: string;
  heroAnchors: Array<{ href: string; label: string }>;
  heroAnchorNote: string;
  casesLabel: string;
  casesTitle: string;
  cases: CaseItem[];
  guardrailsLabel: string;
  guardrailsTitle: string;
  guardrailItems: string[];
  methodEyebrow: string;
  methodTitle: string;
  methodNodes: string[];
  methodCard: string;
  methodCta: string;
  stepsTitle: string;
  steps: StepItem[];
  faqLabel: string;
  faqTitle: string;
  faqs: FaqItem[];
  finalTitle: string;
  finalIntro: string;
  finalDetail: string;
  finalPrimaryCta: string;
  finalSecondaryCta: string;
  finalNote: string;
  guideCta: string;
}

export const CONTENT: Record<PageLocale, AiAutomationContent> = {
  fr: {
    meta: {
      title: "Automatisation des processus métier avec des agents IA | AzurSysTech",
      description:
        "AzurSysTech aide les petites entreprises à mettre en place des agents IA pour traiter les demandes entrantes, qualifier les besoins et automatiser des processus répétitifs sans réorganiser tout l’activité.",
    },
    jsonLd: {
      webPageName: "Automatisation des processus métier avec des agents IA | AzurSysTech",
      webPageDescription:
        "AzurSysTech aide les petites entreprises à mettre en place des agents IA pour traiter les demandes entrantes, qualifier les besoins et automatiser des processus répétitifs sans réorganiser tout l’activité.",
      serviceName: "Automatisation des processus métier avec des agents IA",
      serviceType: "Agents IA pour intake, qualification et automatisation de processus répétitifs",
      serviceDescription:
        "Automatisation pragmatique de la première couche de traitement des demandes pour petites entreprises, avec validation humaine.",
      areaServed: "Nice et zone jusqu'à 30 km",
      inLanguage: "fr",
    },
    backLink: "AzurSysTech",
    heroEyebrow: "Automatisation et IA",
    heroTitle: "Automatisation des processus métier avec des agents IA",
    heroIntro:
      "AzurSysTech aide les petites entreprises à déployer des agents IA pour les demandes entrantes, la qualification initiale et l’automatisation de processus répétitifs, sans restructurer toute l’entreprise.",
    trustBullets: [
      "On peut commencer par un seul processus",
      "Adapté aux petites entreprises",
      "L’humain garde le contrôle des décisions importantes",
    ],
    heroPrimaryCta: "Discuter du besoin",
    heroAnchorTitle: "Ce qu’on peut automatiser en premier",
    heroAnchorIntro: "Commencez par un processus répétitif clair, pas par une refonte complète.",
    heroAnchors: [
      { href: "#incoming-requests", label: "Demandes entrantes" },
      { href: "#support", label: "Support initial" },
      { href: "#reports", label: "Rapports et synthèses" },
      { href: "#customer-evaluation", label: "Qualification des clients" },
    ],
    heroAnchorNote: "Les décisions sensibles restent toujours du côté humain.",
    casesLabel: "Ce que nous automatisons",
    casesTitle: "Cas d’usage concrets pour les petites entreprises",
    cases: [
      {
        id: "incoming-requests",
        title: "Agent IA pour les demandes entrantes",
        copy: "Réception des demandes depuis le site, WhatsApp, l’email ou le chat, clarification des détails et transmission à l’équipe dans un format déjà structuré.",
        control: "Contrôle humain : priorité, prix, délais et cas complexes.",
        icon: "inbox",
      },
      {
        id: "support",
        title: "Assistant IA pour le support initial",
        copy: "Les questions répétitives sont traitées selon des règles claires, tandis que les demandes non standard sont transmises directement au spécialiste.",
        control: "Contrôle humain : réclamations, situations litigieuses et responsabilité.",
        icon: "support",
      },
      {
        id: "reports",
        title: "Rapports et synthèses automatiques",
        copy: "Les données régulières issues de tableaux, formulaires ou CRM sont rassemblées dans une synthèse courte pour le dirigeant ou le responsable.",
        control: "Contrôle humain : vérification des chiffres, interprétation et décisions de gestion.",
        icon: "report",
      },
      {
        id: "customer-evaluation",
        title: "Qualification des clients potentiels",
        copy: "L’agent IA pose des questions de clarification, aide à évaluer la maturité du client et transmet au commercial un résumé court.",
        control: "Contrôle humain : offre commerciale, conditions et contact final.",
        icon: "customer",
      },
    ],
    guardrailsLabel: "Approche réaliste",
    guardrailsTitle: "L’IA prend en charge la routine, l’équipe garde le contrôle",
    guardrailItems: [
      "Elle prend en charge les actions répétitives, sans remplacer les collaborateurs.",
      "Elle aide à collecter et qualifier une demande, mais les décisions importantes restent humaines.",
      "Elle prépare des synthèses, brouillons et étapes suivantes, sans faire de promesses commerciales.",
      "Elle démarre sur un processus clair, pas sur une transformation complète de l’entreprise.",
    ],
    methodEyebrow: "De l’idée au lancement",
    methodTitle: "Un processus à la fois",
    methodNodes: ["Cadrage", "Pilote", "Logique", "Test", "Lancement"],
    methodCard:
      "Nous commençons par un seul processus, nous validons la logique sur des cas réels, puis nous élargissons l’automatisation uniquement après un résultat clair.",
    methodCta: "Discuter du besoin",
    stepsTitle: "Comment se passe la mise en place",
    steps: [
      {
        num: "01",
        title: "Cadrage du besoin et du processus",
        desc: "On commence par comprendre quel processus consomme du temps aujourd’hui et à quel endroit se créent les pertes.",
      },
      {
        num: "02",
        title: "Choix d’un premier scénario pilote",
        desc: "Au lieu d’une grande transformation, on choisit un premier scénario étroit et compréhensible.",
      },
      {
        num: "03",
        title: "Conception de la logique",
        desc: "On définit ce que fait l’agent IA, quelles données il collecte, où l’humain intervient et comment la transmission se fait ensuite.",
      },
      {
        num: "04",
        title: "Assemblage et test",
        desc: "La logique est mise en place, testée sur des scénarios réels puis ajustée.",
      },
      {
        num: "05",
        title: "Lancement avec contrôle",
        desc: "L’automatisation passe en conditions réelles avec des limites explicites et un contrôle humain clair.",
      },
    ],
    faqLabel: "FAQ",
    faqTitle: "Questions fréquentes",
    faqs: [
      {
        q: "Qu’est-ce qu’un agent IA pour une entreprise ?",
        a: "C’est une couche logicielle qui prend en charge des actions répétitives : réception d’une demande, clarification, collecte de données et préparation d’une synthèse courte pour l’équipe.",
      },
      {
        q: "Quelle différence avec un chatbot classique ?",
        a: "Un chatbot classique suit souvent un scénario rigide. Un agent IA gère plus finement le contexte, affine la demande et prépare le prochain pas pour un collaborateur.",
      },
      {
        q: "Peut-on commencer par un seul processus ?",
        a: "Oui. C’est généralement le chemin le plus raisonnable. Il vaut mieux démarrer sur un scénario répétitif clair que vouloir tout automatiser d’un coup.",
      },
      {
        q: "Qu’est-ce qu’on automatise en premier en général ?",
        a: "Le plus souvent : les demandes entrantes, le support initial, les rapports et synthèses, ou la qualification de prospects.",
      },
      {
        q: "Est-ce adapté à une petite entreprise ?",
        a: "Oui, surtout s’il existe déjà un flux répétitif de demandes, d’échanges ou d’actions routinières qui consomment du temps.",
      },
      {
        q: "Peut-on unifier site, chat et messageries ?",
        a: "Oui. C’est un point de départ typique : ramener des demandes issues de plusieurs canaux vers un format commun, puis les transmettre à l’équipe avec une synthèse courte.",
      },
      {
        q: "L’agent IA peut-il répondre seul aux clients ?",
        a: "Oui, mais uniquement dans des limites définies à l’avance. Pour les scénarios sensibles, les prix, les délais et les cas non standard, un humain reste nécessaire.",
      },
      {
        q: "Quel niveau de contrôle humain reste en place ?",
        a: "Le contrôle reste là où il compte vraiment : cas complexes, décisions commerciales, validation des actions importantes et responsabilité finale sur le processus.",
      },
      {
        q: "Faut-il changer tout l’existant ?",
        a: "Non. Dans beaucoup de cas, il est plus raisonnable d’insérer l’automatisation dans un seul processus existant que de vouloir tout remplacer immédiatement.",
      },
    ],
    finalTitle: "Voyons quel processus mérite d’être automatisé en premier",
    finalIntro:
      "On peut commencer par un seul processus, sans engagement vers une automatisation totale et sans refonte lourde de l’entreprise.",
    finalDetail:
      "Si vous avez déjà un flux de demandes, des échanges répétitifs ou un processus manuel qui consomme trop de temps, on peut démarrer précisément par là.",
    finalPrimaryCta: "Discuter du besoin",
    finalSecondaryCta: "Écrire sur WhatsApp",
    finalNote: "L’étape suivante après le bouton « Discuter du besoin » est un brief court sur un seul processus.",
    guideCta: "Lire le guide pour choisir un premier processus",
  },
  ru: {
    meta: {
      title: "Автоматизация бизнес-процессов с помощью ИИ-агентов | AzurSysTech",
      description:
        "AzurSysTech помогает малому бизнесу внедрять ИИ-агентов для обработки входящих заявок и обращений, их первичного приема, оценки и повторяющихся процессов — без полной перестройки бизнеса.",
    },
    jsonLd: {
      webPageName: "Автоматизация бизнес-процессов с помощью ИИ-агентов | AzurSysTech",
      webPageDescription:
        "AzurSysTech помогает малому бизнесу внедрять ИИ-агентов для обработки входящих заявок и обращений, их первичного приема, оценки и повторяющихся процессов — без полной перестройки бизнеса.",
      serviceName: "Автоматизация бизнес-процессов с помощью ИИ-агентов",
      serviceType: "ИИ-автоматизация первичного приема, оценки обращений и повторяющихся процессов",
      serviceDescription:
        "Практичная автоматизация первого слоя обработки обращений для малого бизнеса с контролем человека.",
      areaServed: "Nice и зона до 30 км",
      inLanguage: "ru",
    },
    backLink: "AzurSysTech",
    heroEyebrow: "Автоматизация и ИИ",
    heroTitle: "Автоматизация бизнес-процессов с помощью ИИ-агентов",
    heroIntro:
      "AzurSysTech помогает малому бизнесу внедрять ИИ-агентов для обработки входящих заявок и обращений, их первичного приема и оценки, а также для автоматизации повторяющихся процессов — без полной перестройки бизнеса.",
    trustBullets: [
      "Можно начать с одного процесса",
      "Подходит для малого бизнеса",
      "Человек остаётся в контуре принятия решений",
    ],
    heroPrimaryCta: "Обсудить задачу",
    heroAnchorTitle: "Что можно автоматизировать первым",
    heroAnchorIntro: "Начните с одного повторяющегося процесса, а не с полной перестройки.",
    heroAnchors: [
      { href: "#incoming-requests", label: "Входящие обращения" },
      { href: "#support", label: "Первичная поддержка" },
      { href: "#reports", label: "Отчёты и сводки" },
      { href: "#customer-evaluation", label: "Оценка клиентов" },
    ],
    heroAnchorNote: "Важные решения по-прежнему остаются за человеком.",
    casesLabel: "Что автоматизируем",
    casesTitle: "Практические сценарии для малого бизнеса",
    cases: [
      {
        id: "incoming-requests",
        title: "ИИ-агент для входящих обращений",
        copy: "Прием заявок с сайта, WhatsApp, почты и чата, уточнение деталей и передача команде уже в понятном виде.",
        control: "Контроль человека: приоритет, цена, сроки и сложные случаи.",
        icon: "inbox",
      },
      {
        id: "support",
        title: "ИИ-помощник для первичной поддержки",
        copy: "Повторяющиеся вопросы закрываются по правилам, а нестандартные обращения сразу уходят специалисту.",
        control: "Контроль человека: жалобы, спорные ситуации и ответственность.",
        icon: "support",
      },
      {
        id: "reports",
        title: "Автоматические отчёты и сводки",
        copy: "Регулярные данные из таблиц, форм или CRM собираются в короткую сводку для владельца или руководителя.",
        control: "Контроль человека: проверка цифр, выводы и управленческие решения.",
        icon: "report",
      },
      {
        id: "customer-evaluation",
        title: "Оценка потенциальных клиентов",
        copy: "ИИ-агент задаёт уточняющие вопросы, помогает понять готовность клиента и передаёт менеджеру короткое резюме.",
        control: "Контроль человека: коммерческое предложение, условия и финальный контакт.",
        icon: "customer",
      },
    ],
    guardrailsLabel: "Реалистичный подход",
    guardrailsTitle: "ИИ берёт на себя рутину, а контроль остаётся у команды",
    guardrailItems: [
      "Берёт на себя повторяющиеся действия, но не заменяет сотрудников.",
      "Помогает собрать и оценить обращение, но важные решения остаются за человеком.",
      "Готовит сводки, черновики и следующие шаги, но не делает коммерческих обещаний.",
      "Запускается с одного понятного процесса, а не с полной перестройки бизнеса.",
    ],
    methodEyebrow: "От идеи к запуску",
    methodTitle: "Один процесс за один пилот",
    methodNodes: ["Разбор", "Пилот", "Логика", "Тест", "Запуск"],
    methodCard:
      "Начинаем с одного процесса, проверяем логику на реальных сценариях и расширяем автоматизацию только после понятного результата.",
    methodCta: "Обсудить задачу",
    stepsTitle: "Как проходит внедрение",
    steps: [
      {
        num: "01",
        title: "Разбор задачи и процесса",
        desc: "Сначала нужно понять, какой именно процесс сейчас забирает время и где появляются потери.",
      },
      {
        num: "02",
        title: "Выбор одного процесса для пилота",
        desc: "Вместо большой перестройки выбирается узкий и понятный первый сценарий.",
      },
      {
        num: "03",
        title: "Проектирование логики",
        desc: "Определяется, что именно делает ИИ-агент, какие данные он собирает, где нужен человек и как выглядит передача задачи дальше.",
      },
      {
        num: "04",
        title: "Сборка и тестирование",
        desc: "Логика собирается, проверяется на реальных сценариях и корректируется.",
      },
      {
        num: "05",
        title: "Запуск с контролем",
        desc: "Автоматизация запускается в рабочем режиме, но с понятными границами и контролем со стороны человека.",
      },
    ],
    faqLabel: "FAQ",
    faqTitle: "Частые вопросы",
    faqs: [
      {
        q: "Что такое ИИ-агент для бизнеса?",
        a: "Это программный слой, который берет на себя повторяющиеся действия: прием обращений, уточнение деталей, сбор данных и подготовку короткой сводки для команды.",
      },
      {
        q: "Чем ИИ-агент отличается от обычного чат-бота?",
        a: "Обычный чат-бот чаще работает по жесткому сценарию. ИИ-агент гибче обрабатывает обращение, уточняет контекст и помогает подготовить следующий шаг для сотрудника.",
      },
      {
        q: "Можно ли начать с одного процесса?",
        a: "Да. Это как раз наиболее разумный путь. Обычно лучше начать с одного повторяющегося сценария, чем пытаться автоматизировать всё сразу.",
      },
      {
        q: "Что обычно автоматизируют в первую очередь?",
        a: "Чаще всего начинают с входящих обращений, первичной поддержки клиентов, отчетов и рабочих сводок или оценки потенциальных клиентов.",
      },
      {
        q: "Подходит ли это малому бизнесу?",
        a: "Да, особенно если у бизнеса уже есть повторяющийся поток заявок, обращений или рутинных действий, которые занимают время команды.",
      },
      {
        q: "Можно ли объединить сайт, чат и мессенджеры?",
        a: "Да. Это типичный старт: привести обращения из разных каналов к единому формату и передавать их команде уже с краткой сводкой.",
      },
      {
        q: "Может ли ИИ-агент отвечать клиентам сам?",
        a: "Да, но только в тех рамках, которые заранее определены. Для чувствительных сценариев, коммерческих обещаний, цены, сроков и нестандартных ситуаций обычно нужен человек.",
      },
      {
        q: "Сколько контроля остаётся у человека?",
        a: "Контроль остаётся там, где он действительно нужен: в сложных случаях, в коммерческих решениях, в подтверждении важных действий и в финальной ответственности за процесс.",
      },
      {
        q: "Нужно ли менять весь текущий стек?",
        a: "Нет. Во многих случаях разумнее сначала встроить автоматизацию в один существующий процесс, а не менять всё сразу.",
      },
    ],
    finalTitle: "Обсудим, какой процесс имеет смысл автоматизировать первым",
    finalIntro:
      "Можно начать с одного процесса — без обязательства на полную автоматизацию и без большой перестройки бизнеса.",
    finalDetail:
      "Если у вас уже есть понятный поток заявок, повторяющиеся обращения или ручной процесс, который забирает много времени, можно начать именно с него.",
    finalPrimaryCta: "Обсудить задачу",
    finalSecondaryCta: "Написать в WhatsApp",
    finalNote: "Следующий шаг после кнопки «Обсудить задачу» — короткий бриф на один процесс.",
    guideCta: "Прочитать руководство о выборе первого процесса",
  },
  en: {
    meta: {
      title: "Business Process Automation with AI Agents | AzurSysTech",
      description:
        "AzurSysTech helps small businesses implement AI agents for incoming requests, initial qualification, and repetitive processes — without overhauling your entire business.",
    },
    jsonLd: {
      webPageName: "Business Process Automation with AI Agents | AzurSysTech",
      webPageDescription:
        "AzurSysTech helps small businesses implement AI agents for incoming requests, initial qualification, and repetitive processes — without overhauling your entire business.",
      serviceName: "Business Process Automation with AI Agents",
      serviceType: "AI automation for request intake, lead qualification, and routine business workflows",
      serviceDescription:
        "Pragmatic first-layer request processing automation for small businesses with human-in-the-loop control.",
      areaServed: "Nice and region up to 30 km",
      inLanguage: "en",
    },
    backLink: "AzurSysTech",
    heroEyebrow: "Automation & AI",
    heroTitle: "Business Process Automation with AI Agents",
    heroIntro:
      "AzurSysTech helps small businesses deploy AI agents to handle incoming requests, initial qualification, and routine tasks without disrupting daily operations.",
    trustBullets: [
      "Start with a single process",
      "Tailored for small businesses",
      "Human remains in control of key decisions",
    ],
    heroPrimaryCta: "Discuss your project",
    heroAnchorTitle: "What to automate first",
    heroAnchorIntro: "Begin with a single clear, repetitive workflow rather than a massive overhaul.",
    heroAnchors: [
      { href: "#incoming-requests", label: "Incoming requests" },
      { href: "#support", label: "Initial support" },
      { href: "#reports", label: "Reports & summaries" },
      { href: "#customer-evaluation", label: "Lead qualification" },
    ],
    heroAnchorNote: "Sensitive and commercial decisions always remain with your team.",
    casesLabel: "What we automate",
    casesTitle: "Practical Scenarios for Small Businesses",
    cases: [
      {
        id: "incoming-requests",
        title: "AI Agent for Incoming Requests",
        copy: "Receive inquiries from your website, WhatsApp, email, or chat, clarify key details, and deliver structured briefs directly to your team.",
        control: "Human control: priority, pricing, deadlines, and edge cases.",
        icon: "inbox",
      },
      {
        id: "support",
        title: "AI Assistant for Initial Support",
        copy: "Standard, recurring questions are handled according to predefined rules, while custom inquiries are routed immediately to a specialist.",
        control: "Human control: complaints, disputed situations, and final responsibility.",
        icon: "support",
      },
      {
        id: "reports",
        title: "Automated Reports & Summaries",
        copy: "Routine data from spreadsheets, forms, or CRMs is synthesized into concise executive summaries for business owners and managers.",
        control: "Human control: data verification, business analysis, and management decisions.",
        icon: "report",
      },
      {
        id: "customer-evaluation",
        title: "Lead Qualification & Triage",
        copy: "The AI agent asks clarifying questions to assess customer readiness and passes a concise summary to your sales team.",
        control: "Human control: formal quotes, commercial terms, and final engagement.",
        icon: "customer",
      },
    ],
    guardrailsLabel: "Pragmatic Approach",
    guardrailsTitle: "AI Handles the Routine, Your Team Keeps Control",
    guardrailItems: [
      "Handles repetitive manual steps without replacing your team.",
      "Collects and qualifies incoming inquiries, leaving critical decisions to humans.",
      "Drafts summaries, action items, and next steps without making unauthorized commercial commitments.",
      "Starts with one well-defined process rather than a risky complete overhaul.",
    ],
    methodEyebrow: "From Idea to Launch",
    methodTitle: "One Process at a Time",
    methodNodes: ["Scoping", "Pilot", "Logic", "Test", "Launch"],
    methodCard:
      "We start with a single process, validate the workflow on real cases, and expand automation only after measurable results.",
    methodCta: "Discuss your project",
    stepsTitle: "How Implementation Works",
    steps: [
      {
        num: "01",
        title: "Scoping the process & bottleneck",
        desc: "We identify exactly which workflow consumes the most manual time and where handoff friction occurs.",
      },
      {
        num: "02",
        title: "Selecting a single pilot scenario",
        desc: "Instead of a complex company-wide project, we pick one narrow, high-impact workflow.",
      },
      {
        num: "03",
        title: "Designing the workflow logic",
        desc: "We define what the AI agent handles, which data is gathered, where human approval is required, and how handoffs work.",
      },
      {
        num: "04",
        title: "Building & testing",
        desc: "The workflow is assembled, tested against real-world test scenarios, and refined.",
      },
      {
        num: "05",
        title: "Controlled live rollout",
        desc: "The automation goes live in production with strict guardrails and human review oversight.",
      },
    ],
    faqLabel: "FAQ",
    faqTitle: "Frequently Asked Questions",
    faqs: [
      {
        q: "What is an AI agent for a small business?",
        a: "It is a software layer that handles routine tasks: receiving inquiries, clarifying details, gathering data, and preparing concise briefs for your team.",
      },
      {
        q: "How does this differ from a traditional chatbot?",
        a: "A traditional chatbot relies on rigid rule trees. An AI agent understands conversational context, extracts structured data, and prepares actionable next steps for your staff.",
      },
      {
        q: "Can we start with just one process?",
        a: "Yes. In fact, that is our recommended approach. It is far safer and more effective to automate one high-friction workflow before expanding.",
      },
      {
        q: "What is typically automated first?",
        a: "Most businesses start with incoming website/messenger inquiries, initial support FAQ routing, weekly reporting summaries, or lead qualification.",
      },
      {
        q: "Is this suitable for small local businesses?",
        a: "Yes, especially if you already receive a regular stream of inquiries, customer questions, or routine manual tasks that take up valuable time.",
      },
      {
        q: "Can we unify website forms, chat, and messaging apps?",
        a: "Yes. Bringing inquiries from multiple channels into a unified format with structured summaries is a common starting point.",
      },
      {
        q: "Does the AI agent communicate directly with clients?",
        a: "Yes, but strictly within predefined boundaries. For sensitive topics, pricing commitments, deadlines, and non-standard cases, a human remains in the loop.",
      },
      {
        q: "How much human control is maintained?",
        a: "Control is retained where it matters most: complex cases, pricing and contract decisions, confirmation of critical actions, and overall accountability.",
      },
      {
        q: "Do we need to replace our existing software stack?",
        a: "No. In most cases, it is much better to integrate automation into your existing tools (CRM, email, messengers, spreadsheets) rather than replacing them.",
      },
    ],
    finalTitle: "Let's identify which process to automate first",
    finalIntro:
      "You can begin with a single workflow — without committing to full automation or restructuring your business.",
    finalDetail:
      "If you have a steady stream of customer inquiries, repetitive questions, or a manual task taking up too much time, we can start right there.",
    finalPrimaryCta: "Discuss your project",
    finalSecondaryCta: "Message on WhatsApp",
    finalNote: "The next step after clicking «Discuss your project» is a short brief for a single process.",
    guideCta: "Read the guide to choosing a first process",
  },
};
