export type PageLocale = "fr" | "ru" | "en";

export type CreationSiteContent = {
  meta: { title: string; description: string };
  breadcrumbLabel: string;
  eyebrow: string;
  h1: string;
  intro: string;
  primaryCta: string;
  typesTitle: string;
  typesIntro: string;
  types: Array<{ title: string; description: string }>;
  functionsTitle: string;
  functions: Array<{ title: string; description: string }>;
  intakeTitle: string;
  intakeIntro: string;
  intakePoints: string[];
  audienceTitle: string;
  audienceIntro: string;
  audiences: Array<{ title: string; description: string }>;
  portfolioTitle: string;
  portfolioIntro: string;
  portfolioLinks: Array<{ slug: string; title: string; description: string }>;
  processTitle: string;
  process: Array<{ number: string; title: string; description: string }>;
  pricingTitle: string;
  pricingIntro: string;
  pricingNote: string;
  pricing: Array<{ title: string; price: string }>;
  automationTitle: string;
  automationIntro: string;
  automationPoints: string[];
  automationCta: string;
  areaTitle: string;
  areaText: string;
  faqTitle: string;
  faqs: Array<{ q: string; a: string }>;
  finalTitle: string;
  finalIntro: string;
  finalCta: string;
};

const SHARED_PORTFOLIO = {
  fr: [
    { slug: "plomberie", title: "Plomberie Pro", description: "Landing locale, présentation des services, formulaire de devis et demande urgente." },
    { slug: "salon-beaute", title: "Beauté & Spa", description: "Services d'un institut et réservation en ligne." },
    { slug: "bistrot", title: "Le Bistrot", description: "Menu interactif, galerie de plats et réservation de table." },
    { slug: "bijoux-artisanaux", title: "Bijoux Artisanaux", description: "Catalogue de collections et demandes sur mesure." },
    { slug: "assurance", title: "Agent d'Assurance", description: "Présentation des offres, qualification et demande de consultation." },
    { slug: "immobilier", title: "Agence Immobilière", description: "Sélection de biens, estimation et demande de visite." },
  ],
  ru: [
    { slug: "plomberie", title: "Plomberie Pro", description: "Локальный лендинг, услуги, форма расчёта и срочная заявка." },
    { slug: "salon-beaute", title: "Beauté & Spa", description: "Услуги салона и онлайн-запись." },
    { slug: "bistrot", title: "Le Bistrot", description: "Интерактивное меню, галерея блюд и заказ столика." },
    { slug: "bijoux-artisanaux", title: "Bijoux Artisanaux", description: "Каталог коллекций и запросы на изделия по заказу." },
    { slug: "assurance", title: "Agent d'Assurance", description: "Презентация предложений, уточнение запроса и консультация." },
    { slug: "immobilier", title: "Agence Immobilière", description: "Каталог объектов, оценка и запрос на просмотр." },
  ],
  en: [
    { slug: "plomberie", title: "Plomberie Pro", description: "Local service landing page, services, quote form and urgent request." },
    { slug: "salon-beaute", title: "Beauté & Spa", description: "Beauty and spa services with online booking." },
    { slug: "bistrot", title: "Le Bistrot", description: "Interactive menu, dish gallery and table booking." },
    { slug: "bijoux-artisanaux", title: "Bijoux Artisanaux", description: "Collection catalogue and custom requests." },
    { slug: "assurance", title: "Agent d'Assurance", description: "Offer presentation, request qualification and consultation." },
    { slug: "immobilier", title: "Agence Immobilière", description: "Property catalogue, valuation and viewing request." },
  ],
} as const;

export const CONTENT: Record<PageLocale, CreationSiteContent> = {
  fr: {
    meta: {
      title: "Création de site internet à Nice pour TPE & artisans | AzurSysTech",
      description: "Création de sites web, formulaires et parcours de demande pour petites entreprises à Nice et à distance.",
    },
    breadcrumbLabel: "Création de site internet à Nice",
    eyebrow: "Sites web pour petites entreprises",
    h1: "Création de site internet à Nice pour petites entreprises",
    intro: "Nous créons des sites web clairs pour présenter votre activité, recevoir des demandes et préparer le bon suivi sans ajouter de complexité inutile.",
    primaryCta: "Décrire mon projet",
    typesTitle: "Un site adapté à votre activité",
    typesIntro: "Le format dépend du premier besoin à rendre visible et exploitable.",
    types: [
      { title: "Landing page locale", description: "Une page concentrée sur une activité, une zone de service et un contact clair." },
      { title: "Site vitrine multi-pages", description: "Plusieurs pages pour présenter les services, les informations utiles et les appels à l'action." },
      { title: "Catalogue ou réservation", description: "Des contenus organisés pour des produits, des menus, des visites ou des prises de rendez-vous." },
    ],
    functionsTitle: "Les fonctions qui comptent",
    functions: [
      { title: "Présenter", description: "Services, savoir-faire, zones couvertes et informations pratiques dans une structure lisible." },
      { title: "Recevoir", description: "Formulaire de contact, demande de devis, réservation ou demande de consultation selon l'activité." },
      { title: "Orienter", description: "Un parcours qui dirige vers le bon formulaire, le brief ou un échange direct." },
    ],
    intakeTitle: "Formulaires, notifications et intake",
    intakeIntro: "Le site peut transformer un premier message en demande structurée, puis prévenir la personne qui doit la traiter.",
    intakePoints: [
      "Formulaire de contact simple pour les demandes rapides.",
      "Brief optionnel lorsque le projet demande davantage de contexte.",
      "Notification au propriétaire quand une demande est prête à être revue.",
      "Transmission vers une table, une CRM légère ou un outil déjà utilisé.",
    ],
    audienceTitle: "Pour quelles petites entreprises ?",
    audienceIntro: "Les exemples existants couvrent plusieurs besoins de TPE, artisans et activités de proximité.",
    audiences: [
      { title: "Artisans et services locaux", description: "Être trouvé dans une zone donnée et recevoir une demande de devis ou d'intervention." },
      { title: "Bien-être et restauration", description: "Présenter une offre, un menu ou des prestations et faciliter une réservation." },
      { title: "Professionnels avec qualification", description: "Présenter une offre, recueillir le contexte et orienter vers une consultation." },
      { title: "Immobilier et catalogue", description: "Organiser des biens ou produits et préparer une demande de visite ou de personnalisation." },
    ],
    portfolioTitle: "Des exemples déjà structurés",
    portfolioIntro: "Le portfolio montre des types de sites et de parcours métier réutilisables comme points de discussion.",
    portfolioLinks: [...SHARED_PORTFOLIO.fr],
    processTitle: "De l'idée au premier flux",
    process: [
      { number: "01", title: "Vous décrivez le projet", description: "Brief court, formulaire de contact ou premier échange avec l'assistant." },
      { number: "02", title: "Nous cadrons le premier flux", description: "Ce qui arrive, où cela se perd et quel canal prioriser." },
      { number: "03", title: "Nous mettons le système en place", description: "Site, formulaire, notification ou intégration selon le besoin défini." },
      { number: "04", title: "Vous gardez le contrôle", description: "Prix, délais et décisions commerciales restent validés humainement." },
    ],
    pricingTitle: "Des repères de prix publics",
    pricingIntro: "Ces montants sont des points de départ publiés. Le montant exact dépend du besoin, du flux et des intégrations.",
    pricingNote: "Aucun engagement de délai ni de prix exact avant clarification du besoin.",
    pricing: [
      { title: "Landing page + formulaire + notifications", price: "à partir de 400 €" },
      { title: "Site vitrine multi-pages", price: "à partir de 600 €" },
      { title: "Site + intake automatisé", price: "à partir de 600 €" },
      { title: "Agent IA pour demandes entrantes", price: "à partir de 800 €" },
    ],
    automationTitle: "Une extension possible vers l'automatisation",
    automationIntro: "Lorsque le flux est clair, le site peut devenir le point de départ d'une aide IA ou d'une transmission structurée.",
    automationPoints: [
      "L'agent aide à clarifier la demande sans demander de données sensibles dans le chat.",
      "Les informations utiles sont préparées pour une revue humaine.",
      "Les prix, délais et décisions commerciales restent humains.",
    ],
    automationCta: "Voir l'automatisation IA",
    areaTitle: "Nice, les alentours et le travail à distance",
    areaText: "Nous intervenons à Nice et jusqu'à 30 km autour, avec accompagnement à distance. Les exemples de zone incluent Cagnes-sur-Mer, Antibes, Vence et les Alpes-Maritimes.",
    faqTitle: "Questions fréquentes",
    faqs: [
      { q: "Quel type de site pouvez-vous créer ?", a: "Une landing page, un site vitrine multi-pages, un catalogue ou un parcours avec réservation et demande structurée selon l'activité." },
      { q: "Le site peut-il recevoir des demandes ?", a: "Oui. Un formulaire de contact, une demande de devis, une réservation ou un brief peuvent être reliés au parcours choisi." },
      { q: "Faut-il déjà avoir un site ?", a: "Non. Le projet peut commencer par une landing page, un formulaire ou un brief simple." },
      { q: "Combien coûte une création de site ?", a: "Les repères publics commencent à 400 € pour une landing page avec formulaire et notifications, et le montant exact dépend du besoin." },
      { q: "Pouvez-vous ajouter de l'automatisation ou de l'IA ?", a: "Oui, si le flux est défini. L'IA peut aider à clarifier et transmettre une demande, tandis que les décisions commerciales restent humaines." },
    ],
    finalTitle: "Parlons du premier parcours utile",
    finalIntro: "Décrivez votre activité, votre zone et la demande que le site doit recevoir. Nous pourrons cadrer le premier flux.",
    finalCta: "Remplir le brief",
  },
  ru: {
    meta: {
      title: "Создание сайта в Ницце для малого бизнеса и мастеров | AzurSysTech",
      description: "Сайты, формы и сценарии заявок для малого бизнеса в Ницце и удалённо.",
    },
    breadcrumbLabel: "Создание сайта в Ницце",
    eyebrow: "Сайты для малого бизнеса",
    h1: "Создание сайта в Ницце для малого бизнеса",
    intro: "Мы создаём понятные сайты, которые показывают услугу, принимают обращения и помогают подготовить следующий шаг без лишней сложности.",
    primaryCta: "Описать проект",
    typesTitle: "Формат сайта под задачу",
    typesIntro: "Формат зависит от того, что нужно показать и принять в первую очередь.",
    types: [
      { title: "Локальный лендинг", description: "Одна страница с услугой, зоной работы и понятным контактом." },
      { title: "Многостраничный сайт-визитка", description: "Несколько страниц для услуг, полезной информации и следующих действий." },
      { title: "Каталог или запись", description: "Структура для товаров, меню, объектов, просмотра или записи." },
    ],
    functionsTitle: "Функции, которые важны",
    functions: [
      { title: "Показать", description: "Услуги, специализация, зона работы и практическая информация в понятной структуре." },
      { title: "Принять", description: "Контактная форма, запрос расчёта, запись или консультация под ваш процесс." },
      { title: "Направить", description: "Путь к нужной форме, брифу или прямому разговору." },
    ],
    intakeTitle: "Формы, уведомления и intake",
    intakeIntro: "Сайт может превратить первое сообщение в структурированную заявку и уведомить того, кто её обрабатывает.",
    intakePoints: [
      "Контактная форма для быстрых обращений.",
      "Опциональный бриф, если нужно больше контекста.",
      "Уведомление владельцу, когда заявка готова к проверке.",
      "Передача в таблицу, лёгкую CRM или уже используемый инструмент.",
    ],
    audienceTitle: "Для какого малого бизнеса?",
    audienceIntro: "Существующие примеры охватывают разные задачи малого бизнеса, мастеров и локальных услуг.",
    audiences: [
      { title: "Мастера и локальные услуги", description: "Показать услугу в нужной зоне и принять запрос на расчёт или выезд." },
      { title: "Красота и рестораны", description: "Представить услуги или меню и упростить запись или заказ столика." },
      { title: "Профессиональные услуги", description: "Показать предложение, собрать контекст и направить к консультации." },
      { title: "Недвижимость и каталоги", description: "Организовать объекты или товары и подготовить запрос на просмотр или персонализацию." },
    ],
    portfolioTitle: "Существующие примеры",
    portfolioIntro: "Портфолио показывает типы сайтов и сценарии, которые можно использовать как основу для обсуждения.",
    portfolioLinks: [...SHARED_PORTFOLIO.ru],
    processTitle: "От идеи к первому потоку",
    process: [
      { number: "01", title: "Вы описываете проект", description: "Короткий бриф, контактная форма или первый диалог с помощником." },
      { number: "02", title: "Мы фиксируем первый поток", description: "Что приходит, где теряется и какой канал важнее." },
      { number: "03", title: "Настраиваем систему", description: "Сайт, форма, уведомление или интеграция по согласованной задаче." },
      { number: "04", title: "Контроль остаётся у вас", description: "Цены, сроки и коммерческие решения подтверждаются человеком." },
    ],
    pricingTitle: "Публичные ориентиры по цене",
    pricingIntro: "Это опубликованные стартовые ориентиры. Итог зависит от задачи, процесса и интеграций.",
    pricingNote: "Без обещаний по срокам и точной цене до уточнения задачи.",
    pricing: [
      { title: "Лендинг + форма + уведомления", price: "от 400 €" },
      { title: "Многостраничный сайт-визитка", price: "от 600 €" },
      { title: "Сайт + автоматизация заявок", price: "от 600 €" },
      { title: "AI-агент для входящих обращений", price: "от 800 €" },
    ],
    automationTitle: "Возможное расширение в автоматизацию",
    automationIntro: "Когда поток понятен, сайт может стать началом AI-помощи или структурированной передачи заявки.",
    automationPoints: [
      "Агент помогает уточнить запрос и не просит чувствительные данные в чате.",
      "Полезная информация готовится для ручной проверки.",
      "Цены, сроки и коммерческие решения остаются за человеком.",
    ],
    automationCta: "Посмотреть AI-автоматизацию",
    areaTitle: "Ницца, окрестности и удалённая работа",
    areaText: "Мы работаем в Ницце и до 30 км вокруг, а также сопровождаем проекты удалённо. В зоне примеров — Cagnes-sur-Mer, Antibes, Vence и Alpes-Maritimes.",
    faqTitle: "Частые вопросы",
    faqs: [
      { q: "Какой сайт вы можете создать?", a: "Landing page, многостраничный сайт, каталог или сценарий с записью и структурированной заявкой под вашу задачу." },
      { q: "Сайт может принимать обращения?", a: "Да. Контактная форма, запрос расчёта, запись или бриф могут быть частью выбранного сценария." },
      { q: "Нужно ли уже иметь сайт?", a: "Нет. Можно начать с landing page, формы или короткого брифа." },
      { q: "Сколько стоит создание сайта?", a: "Публичные ориентиры начинаются от 400 € за landing page с формой и уведомлениями, а итог зависит от задачи." },
      { q: "Можно добавить автоматизацию или AI?", a: "Да, если поток определён. AI помогает уточнить и передать заявку, а коммерческие решения остаются за человеком." },
    ],
    finalTitle: "Обсудим первый полезный поток",
    finalIntro: "Опишите деятельность, зону работы и обращение, которое должен принимать сайт. Мы зафиксируем первый сценарий.",
    finalCta: "Заполнить бриф",
  },
  en: {
    meta: {
      title: "Website creation in Nice for small businesses and artisans | AzurSysTech",
      description: "Websites, forms and request flows for small businesses in Nice and remotely.",
    },
    breadcrumbLabel: "Website creation in Nice",
    eyebrow: "Websites for small businesses",
    h1: "Website creation in Nice for small businesses",
    intro: "We create clear websites that present your activity, receive requests and prepare the next step without unnecessary complexity.",
    primaryCta: "Describe my project",
    typesTitle: "A website format for your activity",
    typesIntro: "The format follows the first need you want to make visible and actionable.",
    types: [
      { title: "Local landing page", description: "One focused page for an activity, service area and clear contact path." },
      { title: "Multi-page showcase site", description: "Several pages for services, useful information and clear calls to action." },
      { title: "Catalogue or booking flow", description: "Organised content for products, menus, properties, viewings or appointments." },
    ],
    functionsTitle: "The functions that matter",
    functions: [
      { title: "Present", description: "Services, expertise, service area and practical information in a readable structure." },
      { title: "Receive", description: "Contact form, quote request, booking or consultation request for the activity." },
      { title: "Guide", description: "A path that directs people to the right form, brief or direct conversation." },
    ],
    intakeTitle: "Forms, notifications and intake",
    intakeIntro: "The website can turn a first message into a structured request and notify the person who needs to review it.",
    intakePoints: [
      "Simple contact form for quick requests.",
      "Optional brief when a project needs more context.",
      "Owner notification when a request is ready for review.",
      "Handoff to a table, lightweight CRM or an existing tool.",
    ],
    audienceTitle: "Which small businesses?",
    audienceIntro: "Existing examples cover different needs for small businesses, artisans and local services.",
    audiences: [
      { title: "Artisans and local services", description: "Be clear about the service area and receive a quote or intervention request." },
      { title: "Wellness and restaurants", description: "Present services or a menu and make booking or table requests easier." },
      { title: "Professional services", description: "Present an offer, collect context and guide the request to a consultation." },
      { title: "Property and catalogues", description: "Organise properties or products and prepare a viewing or custom request." },
    ],
    portfolioTitle: "Existing examples to explore",
    portfolioIntro: "The portfolio shows website types and business flows that can become a starting point for discussion.",
    portfolioLinks: [...SHARED_PORTFOLIO.en],
    processTitle: "From idea to the first flow",
    process: [
      { number: "01", title: "You describe the project", description: "A short brief, contact form or first exchange with the assistant." },
      { number: "02", title: "We frame the first flow", description: "What arrives, where it gets lost and which channel to prioritise." },
      { number: "03", title: "We put the system in place", description: "Website, form, notification or integration for the defined need." },
      { number: "04", title: "You keep control", description: "Prices, timelines and commercial decisions remain human-approved." },
    ],
    pricingTitle: "Public starting-price references",
    pricingIntro: "These are published starting points. The exact amount depends on the need, flow and integrations.",
    pricingNote: "No timeline or exact-price commitment before the need is clarified.",
    pricing: [
      { title: "Landing page + form + notifications", price: "from 400 €" },
      { title: "Multi-page showcase site", price: "from 600 €" },
      { title: "Website + automated intake", price: "from 600 €" },
      { title: "AI agent for incoming requests", price: "from 800 €" },
    ],
    automationTitle: "A possible extension into automation",
    automationIntro: "Once the flow is clear, the website can become the starting point for AI assistance or a structured handoff.",
    automationPoints: [
      "The agent helps clarify the request without asking for sensitive data in chat.",
      "Useful information is prepared for human review.",
      "Prices, timelines and commercial decisions remain human-controlled.",
    ],
    automationCta: "Explore AI automation",
    areaTitle: "Nice, nearby areas and remote support",
    areaText: "We work in Nice and up to 30 km around it, with remote support as well. Example areas include Cagnes-sur-Mer, Antibes, Vence and Alpes-Maritimes.",
    faqTitle: "Frequently asked questions",
    faqs: [
      { q: "What type of website can you create?", a: "A landing page, multi-page showcase site, catalogue or booking and structured-request flow based on the activity." },
      { q: "Can the website receive requests?", a: "Yes. A contact form, quote request, booking or brief can be part of the selected flow." },
      { q: "Do I need to have a website already?", a: "No. The project can start with a landing page, form or short brief." },
      { q: "How much does website creation cost?", a: "Public starting points begin at 400 € for a landing page with form and notifications; the exact amount depends on the need." },
      { q: "Can automation or AI be added?", a: "Yes, when the flow is defined. AI can help clarify and hand off a request while commercial decisions remain human-controlled." },
    ],
    finalTitle: "Let us frame the first useful flow",
    finalIntro: "Describe your activity, service area and the request your website should receive. We can frame the first flow.",
    finalCta: "Fill the brief",
  },
};
