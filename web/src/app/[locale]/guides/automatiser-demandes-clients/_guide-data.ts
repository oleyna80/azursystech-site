export type PageLocale = "fr" | "ru" | "en";

export interface GuideItem {
  title: string;
  description: string;
}

export interface GuideFaq {
  q: string;
  a: string;
}

export interface PortfolioLink {
  slug: string;
  title: string;
  description: string;
}

export interface GuideContent {
  meta: {
    title: string;
    description: string;
  };
  breadcrumbLabel: string;
  eyebrow: string;
  h1: string;
  intro: string;
  briefLabel: string;
  briefText: string;
  fragmentationTitle: string;
  fragmentationParagraphs: string[];
  mapTitle: string;
  mapIntro: string;
  mapSteps: GuideItem[];
  workflowTitle: string;
  workflowIntro: string;
  workflowSteps: GuideItem[];
  noAiTitle: string;
  noAiIntro: string;
  noAiPoints: string[];
  aiTitle: string;
  aiIntro: string;
  aiUses: GuideItem[];
  exampleTitle: string;
  exampleIntro: string;
  exampleSteps: GuideItem[];
  humanTitle: string;
  humanIntro: string;
  humanBoundaries: GuideItem[];
  privacyTitle: string;
  privacyIntro: string;
  privacyPoints: string[];
  readinessTitle: string;
  readinessIntro: string;
  readinessItems: string[];
  recommendationTitle: string;
  recommendationText: string;
  portfolioTitle: string;
  portfolioIntro: string;
  portfolioLinks: PortfolioLink[];
  niceCta: string;
  aiCta: string;
  portfolioCta: string;
  briefCta: string;
  finalTitle: string;
  finalText: string;
  faqTitle: string;
  faqs: GuideFaq[];
}

const PORTFOLIO: Record<PageLocale, PortfolioLink[]> = {
  fr: [
    { slug: "plomberie", title: "Plomberie", description: "Un exemple de parcours pour une activité de plomberie et d'intervention locale." },
    { slug: "salon-beaute", title: "Salon de beauté", description: "Un exemple de présentation de services et de prise de contact." },
    { slug: "bistrot", title: "Bistrot", description: "Un exemple de site pour présenter un lieu, une offre et les informations utiles." },
    { slug: "bijoux-artisanaux", title: "Bijoux artisanaux", description: "Un exemple de catalogue pour une activité artisanale." },
    { slug: "assurance", title: "Assurance", description: "Un exemple de parcours pour expliquer une offre et préparer une demande." },
    { slug: "immobilier", title: "Immobilier", description: "Un exemple de contenu organisé autour de biens et de demandes de visite." },
  ],
  ru: [
    { slug: "plomberie", title: "Сантехника", description: "Пример пути для сантехнической и локальной выездной услуги." },
    { slug: "salon-beaute", title: "Салон красоты", description: "Пример представления услуг и первого обращения." },
    { slug: "bistrot", title: "Бистро", description: "Пример сайта для места, предложения и полезной информации." },
    { slug: "bijoux-artisanaux", title: "Авторские украшения", description: "Пример каталога для ремесленной деятельности." },
    { slug: "assurance", title: "Страхование", description: "Пример пути для объяснения предложения и подготовки запроса." },
    { slug: "immobilier", title: "Недвижимость", description: "Пример организованного контента о объектах и запросах на просмотр." },
  ],
  en: [
    { slug: "plomberie", title: "Plumbing", description: "An example flow for a plumbing and local service activity." },
    { slug: "salon-beaute", title: "Beauty salon", description: "An example of service presentation and first contact." },
    { slug: "bistrot", title: "Bistro", description: "An example site for presenting a place, an offer and useful information." },
    { slug: "bijoux-artisanaux", title: "Handmade jewellery", description: "An example catalogue for a craft activity." },
    { slug: "assurance", title: "Insurance", description: "An example flow for explaining an offer and preparing a request." },
    { slug: "immobilier", title: "Property", description: "An example of organised content around properties and viewing requests." },
  ],
};

export const CONTENT: Record<PageLocale, GuideContent> = {
  fr: {
    meta: {
      title: "Automatiser les demandes clients d'une TPE : guide pratique | AzurSysTech",
      description: "Un guide pratique pour repérer un premier processus de demandes clients et choisir entre automatisation déterministe, aide IA et décision humaine.",
    },
    breadcrumbLabel: "Guide : automatiser les demandes clients",
    eyebrow: "Guide pratique pour petites entreprises",
    h1: "Comment automatiser les demandes clients d'une petite entreprise ?",
    intro: "Une méthode simple pour transformer un flux de demandes dispersées en processus lisible, avec une place claire pour l'automatisation, l'IA et la validation humaine.",
    briefLabel: "En bref",
    briefText: "Commencez par une seule demande répétitive. Décrivez comment elle arrive, structurez les informations utiles, définissez une qualification simple, notifiez la bonne personne et gardez la décision finale chez l'humain. L'IA peut aider à comprendre du texte libre, mais elle n'est pas nécessaire pour chaque étape.",
    fragmentationTitle: "Pourquoi les demandes se dispersent",
    fragmentationParagraphs: [
      "Une petite entreprise peut recevoir des demandes par formulaire, e-mail, téléphone, messagerie ou conversation en face à face. Quand chaque canal est traité différemment, le contexte reste dans plusieurs endroits.",
      "Le premier problème à résoudre n'est donc pas de choisir un outil. Il est de rendre visible le chemin d'une demande : son arrivée, les informations manquantes, la personne qui doit la relire et l'endroit où elle est enregistrée.",
    ],
    mapTitle: "Cartographier le flux actuel",
    mapIntro: "Avant d'automatiser, décrivez un cas récent sans chercher à tout couvrir.",
    mapSteps: [
      { title: "Recevoir", description: "Par quel canal la demande arrive-t-elle et qui la voit en premier ?" },
      { title: "Comprendre", description: "Quelles informations permettent de distinguer une question, un devis, un rendez-vous ou un suivi ?" },
      { title: "Décider", description: "Quelle personne doit qualifier la demande et quelles ambiguïtés nécessitent une réponse ?" },
      { title: "Suivre", description: "Où la demande est-elle enregistrée pour éviter de perdre le contexte ?" },
    ],
    workflowTitle: "Le workflow minimal",
    workflowIntro: "Un premier processus peut rester court et compréhensible.",
    workflowSteps: [
      { title: "1. Recevoir", description: "Faire arriver la demande depuis le canal choisi." },
      { title: "2. Structurer", description: "Rassembler les champs utiles dans un format lisible." },
      { title: "3. Qualifier", description: "Appliquer quelques règles : type de demande, service concerné, urgence déclarée ou information manquante." },
      { title: "4. Notifier", description: "Prévenir la personne responsable avec le contexte nécessaire." },
      { title: "5. Enregistrer", description: "Conserver la demande dans l'outil déjà retenu pour le suivi." },
      { title: "6. Passer la main", description: "Laisser un humain répondre, demander une précision ou prendre la décision." },
    ],
    noAiTitle: "Ce qui n'a pas besoin d'IA",
    noAiIntro: "Une automatisation déterministe suffit lorsque l'entrée, la règle et l'action sont prévisibles.",
    noAiPoints: [
      "Afficher un formulaire avec des champs définis.",
      "Envoyer une notification quand un formulaire est reçu.",
      "Copier des champs vers un tableau ou un outil déjà utilisé.",
      "Attribuer une demande selon une catégorie choisie.",
      "Rappeler qu'une réponse humaine est nécessaire.",
    ],
    aiTitle: "Où l'IA peut être utile",
    aiIntro: "L'IA devient une aide lorsque la demande contient du texte libre ou un contexte qu'une règle simple ne lit pas bien.",
    aiUses: [
      { title: "Classer", description: "Proposer une catégorie pour un message rédigé librement." },
      { title: "Extraire", description: "Repérer dans le texte un service, une adresse ou une préférence à vérifier." },
      { title: "Résumer", description: "Préparer une synthèse courte pour la personne qui reprend la demande." },
      { title: "Clarifier", description: "Suggérer une question lorsque l'information indispensable manque." },
    ],
    exampleTitle: "Exemple générique : un artisan local",
    exampleIntro: "Imaginez un artisan qui reçoit des demandes d'intervention par plusieurs canaux.",
    exampleSteps: [
      { title: "Point de départ", description: "La demande mentionne un besoin, mais les informations utiles ne sont pas toujours présentées de la même manière." },
      { title: "Première structure", description: "Un formulaire ou un message entrant rassemble le type d'intervention, la zone et le moyen de recontact." },
      { title: "Aide éventuelle", description: "Une IA peut classer le texte libre et signaler l'information à confirmer, sans décider du prix ni de l'intervention." },
      { title: "Reprise humaine", description: "L'artisan vérifie le contexte, demande une précision et décide de la suite." },
    ],
    humanTitle: "La frontière de la décision humaine",
    humanIntro: "L'automatisation prépare une demande ; elle ne porte pas seule la responsabilité commerciale ou relationnelle.",
    humanBoundaries: [
      { title: "Prix", description: "Un prix ou une proposition commerciale doit rester validé par une personne." },
      { title: "Délais", description: "Une date ou un délai ne doit pas être promis automatiquement sans vérification." },
      { title: "Réclamations", description: "Une plainte, un conflit ou une insatisfaction doit être relu et traité humainement." },
      { title: "Ambiguïté", description: "Une demande incomplète ou contradictoire doit déclencher une clarification." },
      { title: "Décisions sensibles", description: "Les situations personnelles, juridiques, financières ou autrement sensibles demandent un contrôle humain adapté." },
    ],
    privacyTitle: "Vie privée et données personnelles",
    privacyIntro: "Le premier workflow doit limiter les données au besoin réel et expliciter leur usage.",
    privacyPoints: [
      "Minimiser les champs demandés au premier contact.",
      "Définir le but de chaque information collectée.",
      "Limiter l'accès aux personnes qui en ont besoin et protéger les outils utilisés.",
      "Ne pas demander de données sensibles si elles ne sont pas nécessaires au processus.",
    ],
    readinessTitle: "Êtes-vous prêt à commencer ?",
    readinessIntro: "Un premier processus est assez cadré lorsque vous pouvez répondre à ces questions.",
    readinessItems: [
      "Quelle demande répétitive voulez-vous traiter en premier ?",
      "Par quel canal arrive-t-elle aujourd'hui ?",
      "Quelles informations sont indispensables pour la relire ?",
      "Quelle règle simple permet de la qualifier ?",
      "Qui reçoit la notification et prend la décision ?",
      "Où le suivi doit-il être conservé ?",
      "Quelles informations ne doivent pas être collectées ?",
    ],
    recommendationTitle: "Commencer petit est une décision de méthode",
    recommendationText: "Choisissez un processus étroit, répétitif et compréhensible. Faites fonctionner le chemin recevoir → structurer → qualifier → notifier → enregistrer → passer la main, puis observez avec l'équipe ce qui doit être ajusté avant d'élargir.",
    portfolioTitle: "Voir des exemples de parcours",
    portfolioIntro: "Ces exemples publics montrent des contextes de sites et de demandes que l'on peut examiner avant de formuler un besoin.",
    portfolioLinks: PORTFOLIO.fr,
    niceCta: "Voir la création de site à Nice",
    aiCta: "Découvrir l'automatisation IA",
    portfolioCta: "Voir le portfolio",
    briefCta: "Décrire un premier processus",
    finalTitle: "Un processus répétitif à clarifier ?",
    finalText: "Le brief permet de décrire un seul flux de demandes et son contexte avant d'envisager une solution.",
    faqTitle: "Questions fréquentes",
    faqs: [
      { q: "Faut-il utiliser l'IA pour automatiser une demande client ?", a: "Non. Un formulaire, une règle de qualification, une notification et un enregistrement peuvent suffire. L'IA est utile lorsque du texte libre doit être classé, extrait, résumé ou clarifié." },
      { q: "Par quel processus commencer ?", a: "Commencez par une demande étroite, répétitive et facile à décrire : un canal, quelques informations nécessaires, une personne responsable et une action de suivi." },
      { q: "L'automatisation peut-elle fixer un prix ou un délai ?", a: "Elle peut préparer le contexte, mais le prix et le délai restent à vérifier et à valider par une personne." },
      { q: "Que faire si une demande est ambiguë ?", a: "La mettre en attente de clarification et passer la main à une personne. Une suggestion de question peut être préparée, mais la réponse ne doit pas être devinée." },
      { q: "Quelles données faut-il demander ?", a: "Seulement les informations nécessaires au but défini du processus. Les données sensibles ou sans utilité pour la demande ne doivent pas être collectées." },
    ],
  },
  ru: {
    meta: {
      title: "Как автоматизировать обращения клиентов малого бизнеса: практическое руководство | AzurSysTech",
      description: "Практическое руководство о первом процессе обработки обращений и границе между детерминированной автоматизацией, помощью ИИ и решением человека.",
    },
    breadcrumbLabel: "Руководство: автоматизация обращений клиентов",
    eyebrow: "Практическое руководство для малого бизнеса",
    h1: "Как автоматизировать обращения клиентов небольшой компании?",
    intro: "Простой способ превратить разрозненные обращения в понятный процесс и определить место автоматизации, ИИ и проверки человеком.",
    briefLabel: "Коротко",
    briefText: "Начните с одного повторяющегося обращения. Опишите его канал, соберите нужные данные, задайте простое правило квалификации, уведомите ответственного и оставьте окончательное решение человеку. ИИ может помочь понять свободный текст, но не нужен на каждом этапе.",
    fragmentationTitle: "Почему обращения теряются между каналами",
    fragmentationParagraphs: [
      "Небольшая компания может получать обращения через форму, электронную почту, телефон, мессенджер или личный разговор. Если каждый канал обрабатывается по-своему, контекст оказывается в разных местах.",
      "Поэтому первый вопрос — не выбор инструмента. Сначала сделайте путь обращения видимым: откуда оно пришло, чего не хватает, кто его проверит и где будет запись для дальнейшего контроля.",
    ],
    mapTitle: "Опишите текущий поток",
    mapIntro: "Перед автоматизацией разберите один недавний случай, не пытаясь охватить всё сразу.",
    mapSteps: [
      { title: "Получить", description: "Через какой канал приходит обращение и кто видит его первым?" },
      { title: "Понять", description: "Какие данные отличают вопрос, запрос цены, запись или продолжение уже начатого общения?" },
      { title: "Решить", description: "Кто квалифицирует обращение и какие неясности требуют уточнения?" },
      { title: "Сохранить", description: "Где хранится запись, чтобы контекст не потерялся?" },
    ],
    workflowTitle: "Минимальный workflow",
    workflowIntro: "Первый процесс может быть коротким и понятным.",
    workflowSteps: [
      { title: "1. Получить", description: "Принять обращение из выбранного канала." },
      { title: "2. Структурировать", description: "Собрать нужные поля в понятный формат." },
      { title: "3. Квалифицировать", description: "Применить простые правила: тип обращения, услуга, заявленная срочность или недостающая информация." },
      { title: "4. Уведомить", description: "Передать контекст ответственному человеку." },
      { title: "5. Записать", description: "Сохранить обращение в выбранном инструменте." },
      { title: "6. Передать человеку", description: "Оставить человеку ответ, уточнение и окончательное решение." },
    ],
    noAiTitle: "Где ИИ не нужен",
    noAiIntro: "Детерминированной автоматизации достаточно, если входные данные, правило и действие заранее понятны.",
    noAiPoints: [
      "Показать форму с определёнными полями.",
      "Отправить уведомление после получения формы.",
      "Скопировать поля в таблицу или уже используемый инструмент.",
      "Назначить обращение по выбранной категории.",
      "Напомнить, что нужен ответ человека.",
    ],
    aiTitle: "Где полезен ИИ",
    aiIntro: "ИИ помогает, когда обращение содержит свободный текст или контекст, который трудно обработать простой логикой.",
    aiUses: [
      { title: "Классифицировать", description: "Предложить категорию для сообщения, написанного свободно." },
      { title: "Извлечь", description: "Найти в тексте услугу, адрес или предпочтение для проверки." },
      { title: "Суммировать", description: "Подготовить короткое резюме для человека, который продолжит обработку." },
      { title: "Уточнить", description: "Предложить вопрос, если не хватает обязательной информации." },
    ],
    exampleTitle: "Общий пример: местный мастер",
    exampleIntro: "Представьте мастера, который получает заявки на выезд из нескольких каналов.",
    exampleSteps: [
      { title: "Исходная ситуация", description: "В обращении есть потребность, но полезные детали каждый раз представлены по-разному." },
      { title: "Первая структура", description: "Форма или входящее сообщение собирает тип работы, район и способ связи." },
      { title: "Возможная помощь", description: "ИИ может классифицировать свободный текст и отметить данные для проверки, но не решать вопрос цены или работы." },
      { title: "Решение человека", description: "Мастер проверяет контекст, задаёт уточнение и решает, что делать дальше." },
    ],
    humanTitle: "Граница решения человека",
    humanIntro: "Автоматизация подготавливает обращение, но не несёт сама коммерческую или личную ответственность.",
    humanBoundaries: [
      { title: "Цена", description: "Стоимость или коммерческое предложение подтверждает человек." },
      { title: "Сроки", description: "Дата или срок не должны обещаться автоматически без проверки." },
      { title: "Жалобы", description: "Жалоба, конфликт или недовольство требуют человеческого рассмотрения." },
      { title: "Неясность", description: "Неполное или противоречивое обращение нужно уточнить." },
      { title: "Чувствительные решения", description: "Личные, юридические, финансовые и другие чувствительные ситуации требуют подходящего контроля человека." },
    ],
    privacyTitle: "Приватность и персональные данные",
    privacyIntro: "Первый workflow должен ограничивать данные реальной необходимостью и понятной целью.",
    privacyPoints: [
      "Минимизировать поля первого обращения.",
      "Определить цель каждой собираемой информации.",
      "Ограничить доступ нужными сотрудниками и защищать используемые инструменты.",
      "Не запрашивать чувствительные данные, если процессу они не нужны.",
    ],
    readinessTitle: "Готовы ли вы начать?",
    readinessIntro: "Процесс достаточно определён, если на эти вопросы есть ответы.",
    readinessItems: [
      "Какое повторяющееся обращение вы хотите обработать первым?",
      "Через какой канал оно приходит сейчас?",
      "Какие данные нужны для его проверки?",
      "Какое простое правило его квалифицирует?",
      "Кто получит уведомление и примет решение?",
      "Где будет храниться запись?",
      "Какие данные не нужно собирать?",
    ],
    recommendationTitle: "Начать с малого — это метод",
    recommendationText: "Выберите узкий, повторяющийся и понятный процесс. Проведите цепочку получить → структурировать → квалифицировать → уведомить → записать → передать человеку, а затем вместе с командой определите, что изменить перед расширением.",
    portfolioTitle: "Посмотреть примеры процессов",
    portfolioIntro: "Эти публичные примеры показывают разные типы сайтов и обращений, которые можно изучить перед формулировкой задачи.",
    portfolioLinks: PORTFOLIO.ru,
    niceCta: "Создание сайта в Ницце",
    aiCta: "Посмотреть автоматизацию с ИИ",
    portfolioCta: "Открыть портфолио",
    briefCta: "Описать первый процесс",
    finalTitle: "Есть повторяющийся процесс, который нужно прояснить?",
    finalText: "В брифе можно описать один поток обращений и его контекст до выбора решения.",
    faqTitle: "Частые вопросы",
    faqs: [
      { q: "Нужен ли ИИ для автоматизации обращения клиента?", a: "Нет. Формы, простого правила, уведомления и записи может быть достаточно. ИИ полезен, когда свободный текст нужно классифицировать, извлечь из него данные, суммировать или уточнить." },
      { q: "С какого процесса начать?", a: "С узкого и повторяющегося обращения: один канал, несколько нужных данных, ответственный человек и понятное действие после проверки." },
      { q: "Может ли автоматизация назначить цену или срок?", a: "Она может подготовить контекст, но цену и срок человек должен проверить и подтвердить." },
      { q: "Что делать с неясным обращением?", a: "Оставить его до уточнения и передать человеку. Можно подготовить вопрос, но нельзя угадывать ответ." },
      { q: "Какие данные нужно запрашивать?", a: "Только данные, необходимые для определённой цели процесса. Чувствительные или бесполезные для обращения данные собирать не следует." },
    ],
  },
  en: {
    meta: {
      title: "How to automate customer requests for a small business: practical guide | AzurSysTech",
      description: "A practical guide to choosing a first customer-request process and separating deterministic automation, AI assistance and human decisions.",
    },
    breadcrumbLabel: "Guide: automate customer requests",
    eyebrow: "Practical guide for small businesses",
    h1: "How can a small business automate customer requests?",
    intro: "A simple way to turn scattered requests into a readable process, with a clear place for automation, AI assistance and human review.",
    briefLabel: "In brief",
    briefText: "Start with one repetitive request. Describe how it arrives, structure the useful information, define a simple qualification rule, notify the right person and keep the final decision with a human. AI can help understand free text, but it is not needed at every step.",
    fragmentationTitle: "Why requests become scattered",
    fragmentationParagraphs: [
      "A small business may receive requests through a form, email, phone, messenger or an in-person conversation. When each channel is handled differently, the context stays in several places.",
      "The first problem is therefore not choosing a tool. Make the request path visible: where it arrives, what is missing, who reviews it and where it is recorded for follow-up.",
    ],
    mapTitle: "Map the current flow",
    mapIntro: "Before automating, describe one recent case without trying to cover everything.",
    mapSteps: [
      { title: "Receive", description: "Which channel receives the request and who sees it first?" },
      { title: "Understand", description: "Which information separates a question, quote request, appointment or follow-up?" },
      { title: "Decide", description: "Who qualifies it and which ambiguities need a clarification?" },
      { title: "Track", description: "Where is the request recorded so its context is not lost?" },
    ],
    workflowTitle: "The minimal workflow",
    workflowIntro: "A first process can stay short and understandable.",
    workflowSteps: [
      { title: "1. Receive", description: "Bring the request in from the selected channel." },
      { title: "2. Structure", description: "Collect useful fields in a readable format." },
      { title: "3. Qualify", description: "Apply simple rules: request type, service, stated urgency or missing information." },
      { title: "4. Notify", description: "Send the needed context to the responsible person." },
      { title: "5. Record", description: "Keep the request in the selected tracking tool." },
      { title: "6. Human handoff", description: "Let a person answer, ask for clarification or make the decision." },
    ],
    noAiTitle: "What does not need AI",
    noAiIntro: "Deterministic automation is enough when the input, rule and action are predictable.",
    noAiPoints: [
      "Show a form with defined fields.",
      "Send a notification when a form is received.",
      "Copy fields into a table or an existing tool.",
      "Assign a request based on a selected category.",
      "Remind the team that a human response is needed.",
    ],
    aiTitle: "Where AI can help",
    aiIntro: "AI helps when a request contains free text or context that a simple rule cannot read reliably.",
    aiUses: [
      { title: "Classify", description: "Suggest a category for a freely written message." },
      { title: "Extract", description: "Find a service, address or preference in text for review." },
      { title: "Summarise", description: "Prepare a short summary for the person taking over the request." },
      { title: "Clarify", description: "Suggest a question when essential information is missing." },
    ],
    exampleTitle: "Generic example: a local artisan",
    exampleIntro: "Imagine an artisan receiving service requests through several channels.",
    exampleSteps: [
      { title: "Starting point", description: "The request states a need, but useful details arrive in different forms." },
      { title: "First structure", description: "A form or incoming message gathers the service type, area and contact method." },
      { title: "Possible assistance", description: "AI can classify free text and flag information to check, without deciding the price or the work." },
      { title: "Human review", description: "The artisan checks the context, asks for clarification and decides what happens next." },
    ],
    humanTitle: "The human decision boundary",
    humanIntro: "Automation prepares a request; it does not carry commercial or relationship responsibility by itself.",
    humanBoundaries: [
      { title: "Pricing", description: "A price or commercial proposal must be reviewed by a person." },
      { title: "Timelines", description: "A date or deadline should not be promised automatically without verification." },
      { title: "Complaints", description: "A complaint, conflict or dissatisfaction needs human review." },
      { title: "Ambiguity", description: "An incomplete or contradictory request needs clarification." },
      { title: "Sensitive decisions", description: "Personal, legal, financial or otherwise sensitive situations need appropriate human control." },
    ],
    privacyTitle: "Privacy and personal data",
    privacyIntro: "The first workflow should limit data to the real need and state its purpose clearly.",
    privacyPoints: [
      "Minimise the fields requested at first contact.",
      "Define the purpose of each piece of information collected.",
      "Limit access to people who need it and protect the tools in use.",
      "Do not request sensitive data when the process does not need it.",
    ],
    readinessTitle: "Are you ready to start?",
    readinessIntro: "A first process is sufficiently framed when you can answer these questions.",
    readinessItems: [
      "Which repetitive request will you handle first?",
      "Which channel receives it today?",
      "Which information is needed to review it?",
      "Which simple rule qualifies it?",
      "Who receives the notification and makes the decision?",
      "Where should the record be kept?",
      "Which information should not be collected?",
    ],
    recommendationTitle: "Starting narrow is a method",
    recommendationText: "Choose one narrow, repetitive and understandable process. Run receive → structure → qualify → notify → record → human handoff, then review with the team what needs adjustment before expanding.",
    portfolioTitle: "Explore example flows",
    portfolioIntro: "These public examples show different website and request contexts to examine before framing a need.",
    portfolioLinks: PORTFOLIO.en,
    niceCta: "See website creation in Nice",
    aiCta: "Explore AI automation",
    portfolioCta: "View the portfolio",
    briefCta: "Describe a first process",
    finalTitle: "A repetitive process to clarify?",
    finalText: "The brief helps describe one request flow and its context before considering a solution.",
    faqTitle: "Frequently asked questions",
    faqs: [
      { q: "Do I need AI to automate a customer request?", a: "No. A form, a simple qualification rule, a notification and a record may be enough. AI helps when free text needs to be classified, extracted, summarised or clarified." },
      { q: "Which process should I start with?", a: "Start with one narrow, repetitive request: one channel, a few needed details, one responsible person and a clear follow-up action." },
      { q: "Can automation set a price or timeline?", a: "It can prepare the context, but a person must verify and approve the price and timeline." },
      { q: "What should happen when a request is ambiguous?", a: "Hold it for clarification and hand it to a person. A question can be suggested, but the answer should not be guessed." },
      { q: "Which data should be requested?", a: "Only the information needed for the defined purpose of the process. Sensitive or irrelevant data should not be collected." },
    ],
  },
};
