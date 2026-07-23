import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

type PageLocale = "fr" | "ru" | "en";
type CaseIconType = "inbox" | "support" | "report" | "customer";

const WHATSAPP = "https://wa.me/33780720994";
const BASE_URL = "https://azursystech.fr";
const SUPPORTED_LOCALES = ["fr", "ru", "en"] as const;

export const CONTENT = {
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
        icon: "inbox" as CaseIconType,
      },
      {
        id: "support",
        title: "Assistant IA pour le support initial",
        copy: "Les questions répétitives sont traitées selon des règles claires, tandis que les demandes non standard sont transmises directement au spécialiste.",
        control: "Contrôle humain : réclamations, situations litigieuses et responsabilité.",
        icon: "support" as CaseIconType,
      },
      {
        id: "reports",
        title: "Rapports et synthèses automatiques",
        copy: "Les données régulières issues de tableaux, formulaires ou CRM sont rassemblées dans une synthèse courte pour le dirigeant ou le responsable.",
        control: "Contrôle humain : vérification des chiffres, interprétation et décisions de gestion.",
        icon: "report" as CaseIconType,
      },
      {
        id: "customer-evaluation",
        title: "Qualification des clients potentiels",
        copy: "L’agent IA pose des questions de clarification, aide à évaluer la maturité du client et transmet au commercial un résumé court.",
        control: "Contrôle humain : offre commerciale, conditions et contact final.",
        icon: "customer" as CaseIconType,
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
  },
  en: {
    meta: {
      title: "AI workflow automation for small businesses | AzurSysTech",
      description: "AzurSysTech designs practical AI workflows for incoming requests, qualification and repeatable business processes.",
    },
    jsonLd: {
      webPageName: "AI workflow automation for small businesses | AzurSysTech",
      webPageDescription: "Practical AI workflows for incoming requests, qualification and repeatable business processes with human control.",
      serviceName: "AI workflow automation for small businesses",
      serviceType: "AI-assisted intake, qualification and repeatable workflow automation",
      serviceDescription: "A practical first layer for handling incoming requests and repeatable work, with human review at important steps.",
      areaServed: "Remote projects",
      inLanguage: "en",
    },
    backLink: "AzurSysTech",
    heroEyebrow: "AI automation",
    heroTitle: "AI workflows for the parts of your business that repeat",
    heroIntro: "AzurSysTech helps small businesses turn incoming requests, routine follow-up and repeatable internal steps into clear AI-assisted workflows without rebuilding everything at once.",
    trustBullets: ["Start with one clear workflow", "Designed for small businesses", "People retain control of important decisions"],
    heroPrimaryCta: "Discuss your workflow on WhatsApp",
    heroAnchorTitle: "What to automate first",
    heroAnchorIntro: "Start with one repeatable workflow, not a complete business overhaul.",
    heroAnchors: [
      { href: "#incoming-requests", label: "Incoming requests" },
      { href: "#support", label: "Initial client support" },
      { href: "#reports", label: "Reports and summaries" },
      { href: "#customer-evaluation", label: "Lead qualification" },
    ],
    heroAnchorNote: "Sensitive and commercial decisions remain human.",
    casesLabel: "What we automate",
    casesTitle: "Practical AI workflows for small businesses",
    cases: [
      { id: "incoming-requests", title: "AI-assisted incoming requests", copy: "Collect requests from a website, WhatsApp or email, clarify useful details and prepare a structured handoff for the team.", control: "Human control: priority, pricing, timelines and complex cases.", icon: "inbox" as CaseIconType },
      { id: "support", title: "Initial client support", copy: "Common questions follow clear guidance, while non-standard requests are routed to the right person.", control: "Human control: complaints, disputes and accountability.", icon: "support" as CaseIconType },
      { id: "reports", title: "Reports and concise summaries", copy: "Regular information from forms, spreadsheets or a CRM is collected into a useful summary for the owner or team lead.", control: "Human control: checking figures, interpretation and decisions.", icon: "report" as CaseIconType },
      { id: "customer-evaluation", title: "Lead qualification", copy: "An AI workflow asks clarifying questions and prepares a short context summary for a human follow-up.", control: "Human control: the commercial offer, terms and final contact.", icon: "customer" as CaseIconType },
    ],
    guardrailsLabel: "A practical approach",
    guardrailsTitle: "AI handles routine work while your team stays in control",
    guardrailItems: ["It supports repeatable work without replacing people.", "It helps structure a request while important decisions remain human.", "It prepares summaries and next steps without making commercial promises.", "It starts with one understandable workflow rather than a wholesale transformation."],
    methodEyebrow: "From idea to launch",
    methodTitle: "One workflow at a time",
    methodNodes: ["Scope", "Pilot", "Logic", "Test", "Launch"],
    methodCard: "We start with one workflow, validate the logic against real cases, and expand only after the result is clear.",
    methodCta: "Discuss your workflow on WhatsApp",
    stepsTitle: "How implementation works",
    steps: [
      { num: "01", title: "Map the workflow", desc: "Identify which process takes time today and where useful context gets lost." },
      { num: "02", title: "Choose a focused pilot", desc: "Select a small, understandable first scenario instead of a broad transformation." },
      { num: "03", title: "Design the logic", desc: "Define what the AI workflow does, what it gathers and where a person takes over." },
      { num: "04", title: "Build and test", desc: "Assemble the workflow, test it with realistic cases and refine it." },
      { num: "05", title: "Launch with clear control", desc: "Use the workflow in real conditions with explicit boundaries and human review." },
    ],
    faqLabel: "FAQ",
    faqTitle: "Common questions",
    faqs: [
      { q: "What is an AI workflow for a business?", a: "It is a software-assisted process for repeatable work such as receiving requests, clarifying details and preparing a concise handoff for the team." },
      { q: "Can we start with one process?", a: "Yes. A clear, repeatable first workflow is usually the most useful place to start." },
      { q: "Can an AI assistant respond to clients on its own?", a: "Only within defined boundaries. Prices, timelines, unusual cases and sensitive decisions should remain with a person." },
      { q: "Do we need to replace our whole stack?", a: "No. In many cases the sensible first step is to improve one existing workflow." },
    ],
    finalTitle: "Choose the first workflow worth automating",
    finalIntro: "Start with one process, without committing to a full automation programme or a major rebuild.",
    finalDetail: "If incoming requests, repeated conversations or manual follow-up take too much time, that is a good place to begin.",
    finalPrimaryCta: "Discuss your workflow on WhatsApp",
    finalSecondaryCta: "Write on WhatsApp",
    finalNote: "For this English launch, WhatsApp is the project contact channel.",
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
        icon: "inbox" as CaseIconType,
      },
      {
        id: "support",
        title: "ИИ-помощник для первичной поддержки",
        copy: "Повторяющиеся вопросы закрываются по правилам, а нестандартные обращения сразу уходят специалисту.",
        control: "Контроль человека: жалобы, спорные ситуации и ответственность.",
        icon: "support" as CaseIconType,
      },
      {
        id: "reports",
        title: "Автоматические отчёты и сводки",
        copy: "Регулярные данные из таблиц, форм или CRM собираются в короткую сводку для владельца или руководителя.",
        control: "Контроль человека: проверка цифр, выводы и управленческие решения.",
        icon: "report" as CaseIconType,
      },
      {
        id: "customer-evaluation",
        title: "Оценка потенциальных клиентов",
        copy: "ИИ-агент задаёт уточняющие вопросы, помогает понять готовность клиента и передаёт менеджеру короткое резюме.",
        control: "Контроль человека: коммерческое предложение, условия и финальный контакт.",
        icon: "customer" as CaseIconType,
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
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l: PageLocale = locale === "ru" || locale === "en" ? locale : "fr";
  return {
    ...CONTENT[l].meta,
    alternates: {
      canonical: `${BASE_URL}/${l}/ai-automation`,
      languages: {
        fr: `${BASE_URL}/fr/ai-automation`,
        ru: `${BASE_URL}/ru/ai-automation`,
        en: `${BASE_URL}/en/ai-automation`,
        "x-default": `${BASE_URL}/fr/ai-automation`,
      },
    },
  };
}

export function buildJsonLd(locale: PageLocale, copy: (typeof CONTENT)[PageLocale]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${BASE_URL}/${locale}/ai-automation`,
        url: `${BASE_URL}/${locale}/ai-automation`,
        name: copy.jsonLd.webPageName,
        description: copy.jsonLd.webPageDescription,
        inLanguage: copy.jsonLd.inLanguage,
        isPartOf: { "@id": BASE_URL },
      },
      {
        "@type": "FAQPage",
        mainEntity: copy.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
      {
        "@type": "Service",
        "@id": `${BASE_URL}/${locale}/ai-automation#service`,
        name: copy.jsonLd.serviceName,
        serviceType: copy.jsonLd.serviceType,
        description: copy.jsonLd.serviceDescription,
        provider: {
          "@type": "Organization",
          name: "AzurSysTech",
          url: BASE_URL,
        },
        areaServed: {
          "@type": "AdministrativeArea",
          name: copy.jsonLd.areaServed,
        },
        availableChannel: locale === "en"
          ? [{ "@type": "ServiceChannel", name: "WhatsApp", serviceUrl: WHATSAPP }]
          : [
              { "@type": "ServiceChannel", serviceUrl: `${BASE_URL}/${locale}#contact` },
              { "@type": "ServiceChannel", name: "WhatsApp", serviceUrl: WHATSAPP },
            ],
        url: `${BASE_URL}/${locale}/ai-automation`,
      },
    ],
  };
}

function Label({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p
      className={`mb-4 text-sm font-bold uppercase tracking-[0.18em] ${
        dark ? "text-accent-teal/80" : "text-accent-teal/90"
      }`}
    >
      {children}
    </p>
  );
}

function HeroAnchors({
  title,
  intro,
  anchors,
  note,
}: {
  title: string;
  intro: string;
  anchors: ReadonlyArray<{ href: string; label: string }>;
  note: string;
}) {
  return (
    <aside className="relative mx-auto w-full max-w-lg lg:ml-auto">
      <div className="absolute -inset-8 rounded-full bg-accent-teal/10 blur-3xl" />
      <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.055] p-5 shadow-premium-soft backdrop-blur-md sm:p-6">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-accent-terra/10 blur-2xl" />
        <div className="relative">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-white/58">
              {title}
            </p>
            <p className="mt-2 max-w-sm text-base leading-7 text-white/74">
              {intro}
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-3">
          {anchors.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3.5 text-base font-semibold text-white/88 transition-colors hover:bg-white/[0.1]"
            >
              <span>{item.label}</span>
              <span className="text-accent-teal transition-transform group-hover:translate-x-0.5">→</span>
            </a>
          ))}
        </div>
        <div className="relative mt-5 rounded-2xl border border-accent-terra/35 bg-accent-terra/12 p-4 text-base leading-7 text-white/85">
          {note}
        </div>
      </div>
    </aside>
  );
}

function CaseIcon({ type }: { type: CaseIconType }) {
  const iconClass = "h-6 w-6";

  if (type === "inbox") {
    return (
      <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
        <path fill="currentColor" d="M4 5h16v14H4V5Zm2 2v6h3l1.5 2h3L15 13h3V7H6Zm0 8v2h12v-2h-2l-1.5 2h-5L8 15H6Z" />
      </svg>
    );
  }

  if (type === "support") {
    return (
      <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
        <path fill="currentColor" d="M12 3a7 7 0 0 0-7 7v4a3 3 0 0 0 3 3h2v-6H7v-1a5 5 0 0 1 10 0v1h-3v6h3v1h-4v2h4a2 2 0 0 0 2-2v-1a3 3 0 0 0 2-2.83V10a7 7 0 0 0-7-7Z" />
      </svg>
    );
  }

  if (type === "report") {
    return (
      <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
        <path fill="currentColor" d="M5 3h14v18H5V3Zm2 2v14h10V5H7Zm2 10h2v2H9v-2Zm0-4h2v3H9v-3Zm4-3h2v9h-2V8Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
      <path fill="currentColor" d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.33 0-6 1.67-6 3.75V20h8.7a6 6 0 0 1-.7-2.83c0-.8.16-1.55.45-2.24A8.8 8.8 0 0 0 12 14Zm6.2 6.4 3.3-3.3-1.4-1.4-1.9 1.9-.8-.8-1.4 1.4 2.2 2.2Z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path fill="currentColor" d="M12 2 5 5v6c0 4.4 2.8 8.4 7 10 4.2-1.6 7-5.6 7-10V5l-7-3Zm-1 13.4-3-3 1.4-1.4 1.6 1.6 3.6-3.6L16 10.4l-5 5Z" />
    </svg>
  );
}

function MethodPanel({
  eyebrow,
  title,
  nodes,
  card,
  cta,
  href,
}: {
  eyebrow: string;
  title: string;
  nodes: ReadonlyArray<string>;
  card: string;
  cta: string;
  href: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-graphite p-6 text-white shadow-premium-soft md:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(31,111,120,0.34),transparent_42%)]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(0deg,rgba(201,111,74,0.16),transparent)]" />
      <div className="relative">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-teal/80">
          {eyebrow}
        </p>
        <h3 className="mt-4 text-3xl font-extrabold leading-tight text-white">
          {title}
        </h3>

        <div className="relative mt-8 pl-2">
          <div className="absolute bottom-4 left-[1.32rem] top-4 w-px bg-white/14" />
          <div className="absolute left-[1.17rem] top-4 h-16 w-1 rounded-full bg-accent-teal/80 blur-[1px] [animation:method-flow_5s_ease-in-out_infinite]" />
          <div className="space-y-5">
            {nodes.map((item) => (
              <div key={item} className="relative flex items-center gap-4">
                <span className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-accent-teal/35 bg-graphite shadow-[0_0_0_6px_rgba(31,111,120,0.08)]">
                  <span className="h-2.5 w-2.5 rounded-full bg-accent-teal" />
                </span>
                <span className="text-base font-bold text-white/82">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.06] p-5">
          <p className="text-sm font-medium leading-6 text-white/72">
            {card}
          </p>
          <a
            href={href}
            target={href === WHATSAPP ? "_blank" : undefined}
            rel={href === WHATSAPP ? "noreferrer" : undefined}
            className="mt-5 inline-flex items-center justify-center rounded-full bg-accent-teal px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-accent-teal/90"
          >
            {cta}
          </a>
        </div>
      </div>
      <style>{`
        @keyframes method-flow {
          0%, 100% { transform: translateY(0); opacity: 0.35; }
          45%, 55% { opacity: 1; }
          80% { transform: translateY(12.5rem); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

export default async function AiAutomationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!SUPPORTED_LOCALES.includes(locale as PageLocale)) notFound();
  const l = locale as PageLocale;
  const copy = CONTENT[l];
  const jsonLd = buildJsonLd(l, copy);
  const projectHref = l === "en" ? WHATSAPP : "/brief";

  return (
    <main className="text-graphite">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative isolate overflow-hidden bg-graphite pb-14 pt-28 text-white md:pb-36 md:pt-32">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(12,18,24,0.97)_0%,rgba(31,42,55,0.88)_60%,rgba(31,42,55,0.75)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(31,111,120,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(201,111,74,0.10),transparent_55%)]" />

        <div className="container relative z-10 mx-auto px-4 md:px-8">
          <Link
            href={`/${l}`}
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-white/55 transition-colors hover:text-white/80 md:mb-10"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path fill="currentColor" d="M19 11H7.8l4.6-4.6L11 5l-7 7 7 7 1.4-1.4L7.8 13H19v-2z" />
            </svg>
            {copy.backLink}
          </Link>

          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.98fr)_minmax(360px,0.72fr)] lg:items-center">
            <div className="max-w-3xl">
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-white/55 sm:tracking-[0.2em]">
                {copy.heroEyebrow}
              </p>

              <h1 className="max-w-3xl text-3xl font-extrabold leading-[1.06] tracking-tight text-white sm:text-4xl md:text-6xl md:leading-[1.02]">
                {copy.heroTitle}
              </h1>

              <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-white/78 sm:mt-6 sm:text-lg sm:leading-8">
                {copy.heroIntro}
              </p>

              <ul className="mt-6 space-y-2 sm:mt-8 sm:space-y-2.5">
                {copy.trustBullets.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm font-medium leading-6 text-white/82 sm:text-base sm:leading-normal"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-teal/20 text-accent-teal">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
                        <path fill="currentColor" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-col gap-3 sm:mt-10 sm:flex-row">
                <a
                  href={projectHref}
                  target={l === "en" ? "_blank" : undefined}
                  rel={l === "en" ? "noreferrer" : undefined}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-teal px-7 py-3.5 text-base font-bold text-white shadow-premium-soft transition-transform active:scale-95 hover:bg-accent-teal/90"
                >
                  {copy.heroPrimaryCta}
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                    <path fill="currentColor" d="M5 11h11.2l-4.6-4.6L13 5l7 7-7 7-1.4-1.4 4.6-4.6H5v-2z" />
                  </svg>
                </a>
              </div>
            </div>

            <HeroAnchors
              title={copy.heroAnchorTitle}
              intro={copy.heroAnchorIntro}
              anchors={copy.heroAnchors}
              note={copy.heroAnchorNote}
            />
          </div>
        </div>
      </section>

      <section className="bg-surface py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-10 max-w-2xl">
            <Label>{copy.casesLabel}</Label>
            <h2 className="text-3xl font-extrabold tracking-tight text-graphite md:text-4xl md:leading-[1.04]">
              {copy.casesTitle}
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {copy.cases.map((item) => (
              <article
                id={item.id}
                key={item.id}
                className="scroll-mt-28 rounded-2xl border border-graphite/8 bg-white p-6 shadow-premium-soft"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-bold text-graphite">{item.title}</h3>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent-teal/10 text-accent-teal">
                    <CaseIcon type={item.icon} />
                  </span>
                </div>
                <p className="mt-5 text-base leading-7 text-graphite/72">{item.copy}</p>
                <div className="mt-6 flex items-start gap-2.5 border-t border-graphite/8 pt-4 text-sm font-semibold leading-6 text-graphite/78">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-teal/10 text-accent-teal">
                    <ShieldIcon />
                  </span>
                  <p>{item.control}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-graphite py-16 text-white md:py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="min-w-0 max-w-lg">
              <Label dark>{copy.guardrailsLabel}</Label>
              <h2 className="text-3xl font-extrabold tracking-tight text-white [overflow-wrap:anywhere] md:text-4xl md:leading-[1.04]">
                {copy.guardrailsTitle}
              </h2>
            </div>

            <div className="min-w-0 border-t border-white/10 pt-8">
              <ul className="space-y-5">
                {copy.guardrailItems.map((item) => (
                  <li key={item} className="flex min-w-0 items-start gap-3.5">
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent-teal/35 bg-accent-teal/12 text-accent-teal">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
                        <path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
                      </svg>
                    </span>
                    <span className="min-w-0 break-words text-base font-medium leading-7 text-white/82 [overflow-wrap:anywhere]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-base py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <MethodPanel
              eyebrow={copy.methodEyebrow}
              title={copy.methodTitle}
              nodes={copy.methodNodes}
              card={copy.methodCard}
              cta={copy.methodCta}
              href={projectHref}
            />

            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-graphite md:text-5xl md:leading-[1.02]">
                {copy.stepsTitle}
              </h2>

              <div className="mt-12 border-y border-graphite/10">
                {copy.steps.map((step, index) => (
                  <details
                    key={step.num}
                    className="group border-b border-graphite/10 last:border-b-0 [&_summary::-webkit-details-marker]:hidden"
                    open={index === 0}
                  >
                    <summary className="grid cursor-pointer gap-4 py-6 outline-none transition-colors hover:text-accent-teal focus-visible:ring-2 focus-visible:ring-accent-teal focus-visible:ring-offset-4 sm:grid-cols-[minmax(0,1fr)_3rem]">
                      <h3 className="text-lg font-bold text-graphite transition-colors group-hover:text-accent-teal">
                        {step.title}
                      </h3>
                      <span className="text-right text-sm font-bold tracking-[0.18em] text-graphite/70">
                        {step.num}
                      </span>
                    </summary>
                    <div className="max-w-xl pb-6 text-base leading-7 text-graphite/68">
                      {step.desc}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-graphite py-16 text-white md:py-20">
        <div className="container mx-auto max-w-3xl px-4 md:px-8">
          <div className="mb-12 text-center">
            <Label dark>{copy.faqLabel}</Label>
            <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl md:leading-[1.05]">
              {copy.faqTitle}
            </h2>
          </div>

          <div className="space-y-4">
            {copy.faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl border border-white/10 bg-white/[0.055] shadow-premium-soft [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between rounded-2xl p-6 font-bold text-white outline-none transition duration-200 hover:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-accent-teal focus-visible:ring-offset-2 focus-visible:ring-offset-graphite">
                  {faq.q}
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 shrink-0 text-white/50 transition-transform group-open:-rotate-180"
                  >
                    <path fill="currentColor" d="M12 15.4 6.3 9.7l1.4-1.4L12 12.6l4.3-4.3 1.4 1.4z" />
                  </svg>
                </summary>
                <div className="mt-2 border-t border-white/10 p-6 pt-4 text-base leading-7 text-white/72">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-base py-16 text-graphite md:py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-graphite md:text-5xl md:leading-[1.02]">
              {copy.finalTitle}
            </h2>
            <p className="mt-6 text-lg leading-8 text-graphite/72">
              {copy.finalIntro}
            </p>
            <p className="mt-4 text-base font-medium text-graphite/58">
              {copy.finalDetail}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href={projectHref}
                target={l === "en" ? "_blank" : undefined}
                rel={l === "en" ? "noreferrer" : undefined}
                className="inline-flex items-center gap-2 rounded-full bg-accent-teal px-7 py-3.5 text-base font-bold text-white shadow-premium-soft transition-transform active:scale-95 hover:bg-accent-teal/90"
              >
                {copy.finalPrimaryCta}
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path fill="currentColor" d="M5 11h11.2l-4.6-4.6L13 5l7 7-7 7-1.4-1.4 4.6-4.6H5v-2z" />
                </svg>
              </a>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-graphite/20 bg-surface px-7 py-3.5 text-base font-bold text-graphite transition-colors hover:bg-white"
              >
                {copy.finalSecondaryCta}
              </a>
            </div>
            <p className="mt-4 text-sm leading-6 text-graphite/58">
              {copy.finalNote}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
