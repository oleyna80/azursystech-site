const SHOWCASE_BASE_URL =
  process.env.NEXT_PUBLIC_SHOWCASE_BASE_URL ??
  (process.env.NODE_ENV === "development" ? "http://localhost:3002" : "");

const showcaseDemoUrl = (slug: string) => `${SHOWCASE_BASE_URL}/demo/${slug}`;

export type PortfolioLocale = "fr" | "ru" | "en";

export type PortfolioProject = {
  slug: string;
  title: string;
  shortDescription: string;
  /** YouTube video ID; placeholder until the video is published on the channel. */
  youtubeId: string;
  review: {
    intro: string;
    capabilities: string[];
    automationPoints: string[];
  };
  tags: string[];
  demoUrl?: string;
};

export const PORTFOLIO_PROJECTS_BY_LOCALE: Record<PortfolioLocale, readonly PortfolioProject[]> = {
  fr: [
    {
      slug: "plomberie",
      title: "Plomberie Pro",
      shortDescription:
        "Landing de service local pour un plombier : services, devis et demande urgente 24/7 sans perdre un seul appel.",
      youtubeId: "ne8_5TQDxFI",
      review: {
        intro:
          "Ce projet montre comment une entreprise de services locaux peut transformer son site vitrine en un vrai point d'entrée : chaque visite peut devenir une demande qualifiée, urgente ou planifiée.",
        capabilities: [
          "Landing page claire avec présentation des services",
          "Formulaire de devis structuré",
          "Parcours dédié aux demandes urgentes 24/7",
          "Contact direct par téléphone et WhatsApp",
        ],
        automationPoints: [
          "Qualification immédiate de l'urgence dès le formulaire",
          "Notification instantanée au propriétaire pour chaque demande",
          "Suivi des demandes sans ressaisie manuelle",
        ],
      },
      tags: ["Services", "Landing", "Urgences"],
      demoUrl: showcaseDemoUrl("plomberie"),
    },
    {
      slug: "salon-beaute",
      title: "Beauté & Spa",
      shortDescription:
        "Site élégant pour un institut de beauté : soins, massages et réservation en ligne qui remplit l'agenda sans appels.",
      youtubeId: "rseBsq_cisg",
      review: {
        intro:
          "Un institut de beauté vit de son agenda. Ce site montre comment la réservation en ligne réduit les appels, les oublis et les créneaux vides.",
        capabilities: [
          "Vitrine des soins : visage, massages, épilation",
          "Réservation en ligne par prestation",
          "Galerie et ambiance de l'institut",
          "Fiches prestations avec durée et prix",
        ],
        automationPoints: [
          "Prise de rendez-vous sans intervention manuelle",
          "Confirmation et rappel automatiques au client",
          "Agenda centralisé pour toute l'équipe",
        ],
      },
      tags: ["Bien-être", "Réservation"],
      demoUrl: showcaseDemoUrl("salon-beaute"),
    },
    {
      slug: "bistrot",
      title: "Le Bistrot",
      shortDescription:
        "Site multi-pages pour un restaurant : menu interactif, galerie de plats et réservation de table en ligne.",
      youtubeId: "NK6WkgRGY1A",
      review: {
        intro:
          "Pour un restaurant, le site remplace le téléphone qui sonne pendant le service : le menu est à jour et les réservations arrivent structurées.",
        capabilities: [
          "Menu interactif par catégories",
          "Galerie de plats et de la salle",
          "Réservation de table en ligne",
          "Pages horaires, accès et contact",
        ],
        automationPoints: [
          "Réservations collectées avec date, heure et couverts",
          "Menu modifiable sans refaire le site",
          "Notification au restaurateur à chaque réservation",
        ],
      },
      tags: ["Restauration", "Réservation"],
      demoUrl: showcaseDemoUrl("maison-olive"),
    },
    {
      slug: "bijoux-artisanaux",
      title: "Bijoux Artisanaux",
      shortDescription:
        "Catalogue e-commerce léger pour une créatrice de bijoux : collections, pièces uniques et demandes sur mesure.",
      youtubeId: "yer8p88ehdA",
      review: {
        intro:
          "Un artisan n'a pas besoin d'une grosse boutique en ligne pour vendre : un catalogue soigné et un canal de demande sur mesure suffisent pour démarrer.",
        capabilities: [
          "Catalogue par collections : bagues, bracelets, colliers",
          "Fiches produit avec photos et matières",
          "Formulaire de demande sur mesure",
          "Présentation de l'atelier et du savoir-faire",
        ],
        automationPoints: [
          "Sélection produit transmise directement dans la demande",
          "Demandes sur mesure structurées dès le premier message",
          "Catalogue extensible sans développement",
        ],
      },
      tags: ["Artisanat", "Catalogue"],
      demoUrl: showcaseDemoUrl("bijoux-artisanaux"),
    },
    {
      slug: "assurance",
      title: "Agent d'Assurance",
      shortDescription:
        "Site de génération de leads pour un agent d'assurance : offres, qualification du besoin et prise de rendez-vous.",
      youtubeId: "GBU6BaPl_vs",
      review: {
        intro:
          "En assurance, la qualité du premier contact décide de tout. Ce site qualifie le besoin avant même le premier rendez-vous.",
        capabilities: [
          "Présentation des offres par profil client",
          "Parcours de demande de devis guidé",
          "Mise en avant de la confiance et des avis",
          "Prise de rendez-vous de consultation",
        ],
        automationPoints: [
          "Qualification du lead dès le formulaire de devis",
          "Routage de la demande vers le bon produit",
          "Historique des demandes prêt pour un CRM léger",
        ],
      },
      tags: ["Assurance", "Leads"],
      demoUrl: showcaseDemoUrl("assurance"),
    },
    {
      slug: "immobilier",
      title: "Agence Immobilière",
      shortDescription:
        "Site immobilier pour une agence : biens à la vente, filtres de recherche et demandes d'estimation en ligne.",
      youtubeId: "6XO6MvRdkj0",
      review: {
        intro:
          "Pour une agence immobilière, chaque mandat compte. Ce site présente les biens en valeur et permet aux vendeurs d'estimer leur bien en ligne.",
        capabilities: [
          "Catalogue de biens à la vente et à la location",
          "Fiches détaillées avec galerie photos et caractéristiques",
          "Formulaire d'estimation immobilière en ligne",
          "Prise de contact directe pour visite",
        ],
        automationPoints: [
          "Demandes d'estimation qualifiées dès le formulaire",
          "Prise de contact rapide transmise à l'agent",
          "Galerie et caractéristiques des biens mises en valeur",
        ],
      },
      tags: ["Immobilier", "Catalogue"],
      demoUrl: showcaseDemoUrl("immobilier"),
    },
  ],
  ru: [
    {
      slug: "plomberie",
      title: "Сантехника Про",
      shortDescription:
        "Лендинг локальных услуг для сантехника: услуги, расчет сметы и срочные заявки 24/7 без потери клиентов.",
      youtubeId: "ne8_5TQDxFI",
      review: {
        intro:
          "Этот проект показывает, как сервисный бизнес может превратить сайт в полноценный канал продаж: каждый визит становится квалифицированной заявкой, срочной или плановой.",
        capabilities: [
          "Понятный лендинг с описанием услуг",
          "Структурированная форма расчета сметы",
          "Отдельный сценарий для срочных аварийных заявок 24/7",
          "Прямая связь по телефону и WhatsApp",
        ],
        automationPoints: [
          "Мгновенная квалификация срочности прямо в форме",
          "Моментальное уведомление владельцу по каждой заявке",
          "Учет обращений без ручного переноса данных",
        ],
      },
      tags: ["Услуги", "Лендинг", "Срочные вызовы"],
      demoUrl: showcaseDemoUrl("plomberie"),
    },
    {
      slug: "salon-beaute",
      title: "Салон красоты & Spa",
      shortDescription:
        "Элегантный сайт для салона красоты: уход, массажи и онлайн-запись, заполняющая расписание без лишних звонков.",
      youtubeId: "rseBsq_cisg",
      review: {
        intro:
          "Салон красоты живет расписанием мастеров. Этот сайт показывает, как онлайн-запись снижает нагрузку на звонки, уменьшает пропуски и пустые слоты.",
        capabilities: [
          "Витрина услуг: уход за лицом, массажи, эпиляция",
          "Онлайн-запись по конкретным процедурам",
          "Фотогалерея и атмосфера салона",
          "Карточки услуг с длительностью и ценами",
        ],
        automationPoints: [
          "Запись клиентов без ручного участия администратора",
          "Автоматические подтверждения и напоминания клиенту",
          "Централизованный календарь для всей команды",
        ],
      },
      tags: ["Красота", "Онлайн-запись"],
      demoUrl: showcaseDemoUrl("salon-beaute"),
    },
    {
      slug: "bistrot",
      title: "Ресторан Le Bistrot",
      shortDescription:
        "Многостраничный сайт для ресторана: интерактивное меню, галерея блюд и онлайн-бронирование столов.",
      youtubeId: "NK6WkgRGY1A",
      review: {
        intro:
          "Для ресторана сайт заменяет телефонные звонки во время посадки: меню всегда актуально, а брони поступают в структурированном виде.",
        capabilities: [
          "Интерактивное меню по категориям",
          "Галерея блюд и интерьера",
          "Онлайн-бронирование столиков",
          "Часы работы, карта проезда и контакты",
        ],
        automationPoints: [
          "Сбор броней с точной датой, временем и количеством гостей",
          "Обновление меню без переверстки сайта",
          "Мгновенные уведомления администратору о каждой брони",
        ],
      },
      tags: ["Рестораны", "Бронирование"],
      demoUrl: showcaseDemoUrl("maison-olive"),
    },
    {
      slug: "bijoux-artisanaux",
      title: "Авторские украшения",
      shortDescription:
        "Легкий каталог-витрина для мастера украшений: коллекции, штучные изделия и индивидуальные заказы.",
      youtubeId: "yer8p88ehdA",
      review: {
        intro:
          "Мастеру не нужен громоздкий интернет-магазин: эстетичного каталога и понятной формы индивидуального заказа достаточно для успешных продаж.",
        capabilities: [
          "Каталог по коллекциям: кольца, браслеты, колье",
          "Карточки изделий с фотографиями и материалами",
          "Форма заказа индивидуального украшения",
          "Рассказ о мастерской и технике работы",
        ],
        automationPoints: [
          "Выбранное изделие сразу передается в заявку",
          "Индивидуальные пожелания структурируются с первого сообщения",
          "Каталог легко пополнять без разработчиков",
        ],
      },
      tags: ["Мастерская", "Каталог"],
      demoUrl: showcaseDemoUrl("bijoux-artisanaux"),
    },
    {
      slug: "assurance",
      title: "Страховое агентство",
      shortDescription:
        "Лидогенерирующий сайт для страхового агента: тарифы, предварительная оценка рисков и запись на консультацию.",
      youtubeId: "GBU6BaPl_vs",
      review: {
        intro:
          "В страховании качество первичной заявки решает всё. Этот сайт квалифицирует профиль клиента еще до первой консультации.",
        capabilities: [
          "Презентация программ по профилям клиентов",
          "Пошаговый опросник для расчета полиса",
          "Блок доверия, лицензий и отзывов",
          "Запись на онлайн или очную консультацию",
        ],
        automationPoints: [
          "Скоринг и квалификация лида прямо в опроснике",
          "Маршрутизация заявки на подходящий страховой продукт",
          "Готовая структура обращений для CRM",
        ],
      },
      tags: ["Страхование", "Лидогенерация"],
      demoUrl: showcaseDemoUrl("assurance"),
    },
    {
      slug: "immobilier",
      title: "Агентство недвижимости",
      shortDescription:
        "Сайт для агентства недвижимости: каталог объектов, фильтры поиска и онлайн-заявка на оценку жилья.",
      youtubeId: "6XO6MvRdkj0",
      review: {
        intro:
          "Для агентства недвижимости каждый эксклюзивный объект имеет значение. Сайт выгодно презентует объекты и привлекает продавцов на оценку.",
        capabilities: [
          "Каталог объектов на продажу и в аренду",
          "Подробные карточки с фотогалереей и характеристиками",
          "Форма онлайн-заявки на оценку недвижимости",
          "Быстрая запись на просмотр объекта",
        ],
        automationPoints: [
          "Квалификация продавцов и объектов при запросе оценки",
          "Мгновенная передача контактов дежурному риелтору",
          "Структурированные параметры объектов",
        ],
      },
      tags: ["Недвижимость", "Каталог"],
      demoUrl: showcaseDemoUrl("immobilier"),
    },
  ],
  en: [
    {
      slug: "plomberie",
      title: "Plumbing Pro",
      shortDescription:
        "Local service landing page for a plumber: services, quote calculator, and 24/7 emergency intake without missed calls.",
      youtubeId: "ne8_5TQDxFI",
      review: {
        intro:
          "This project demonstrates how a local service business can transform its website into an active sales pipeline: every visit turns into a qualified emergency or scheduled inquiry.",
        capabilities: [
          "Clear landing page with comprehensive service overview",
          "Structured quote request form",
          "Dedicated 24/7 emergency dispatch workflow",
          "Direct phone and WhatsApp contact channels",
        ],
        automationPoints: [
          "Instant urgency scoring directly inside the intake form",
          "Immediate owner notifications for every new lead",
          "Inquiry tracking without manual data entry",
        ],
      },
      tags: ["Services", "Landing", "Emergency"],
      demoUrl: showcaseDemoUrl("plomberie"),
    },
    {
      slug: "salon-beaute",
      title: "Beauty & Spa",
      shortDescription:
        "Elegant website for a beauty clinic & spa: treatments, massages, and online booking filling calendars without phone calls.",
      youtubeId: "rseBsq_cisg",
      review: {
        intro:
          "A beauty salon runs on its calendar. This site showcases how online booking reduces phone disruptions, no-shows, and empty slots.",
        capabilities: [
          "Treatment showcase: skincare, massages, hair care",
          "Online self-service booking per treatment",
          "Interior gallery and salon ambience",
          "Detailed service cards with duration and transparent pricing",
        ],
        automationPoints: [
          "Automated appointment scheduling without staff intervention",
          "Automated confirmation and SMS/email reminders to clients",
          "Centralized team calendar sync",
        ],
      },
      tags: ["Wellness", "Online Booking"],
      demoUrl: showcaseDemoUrl("salon-beaute"),
    },
    {
      slug: "bistrot",
      title: "Le Bistrot Restaurant",
      shortDescription:
        "Multi-page website for a restaurant: interactive menu, dish gallery, and online table reservations.",
      youtubeId: "NK6WkgRGY1A",
      review: {
        intro:
          "For a restaurant, the website prevents phone distractions during peak service: menus stay up-to-date and reservations arrive pre-structured.",
        capabilities: [
          "Interactive menu by categories",
          "High-res dish and dining room photo gallery",
          "Online table booking widget",
          "Opening hours, directions, and contact pages",
        ],
        automationPoints: [
          "Table bookings collected with date, time, and guest count",
          "Easy menu updates without code changes",
          "Instant table booking alerts to the host",
        ],
      },
      tags: ["Dining", "Reservations"],
      demoUrl: showcaseDemoUrl("maison-olive"),
    },
    {
      slug: "bijoux-artisanaux",
      title: "Artisan Jewelry",
      shortDescription:
        "Lightweight e-commerce catalog for a jewelry designer: collections, unique pieces, and custom orders.",
      youtubeId: "yer8p88ehdA",
      review: {
        intro:
          "An artisan doesn't need an oversized e-commerce store: an elegant showcase catalog and custom order intake flow are enough to convert clients.",
        capabilities: [
          "Collection-based catalog: rings, bracelets, necklaces",
          "Product detail cards with high-res photos and material specs",
          "Custom bespoke design order form",
          "Workshop story and craftsmanship highlights",
        ],
        automationPoints: [
          "Selected product reference attached directly to inquiry",
          "Bespoke custom inquiries pre-structured from message one",
          "Easy catalog expansion without coding",
        ],
      },
      tags: ["Craftsmanship", "Catalog"],
      demoUrl: showcaseDemoUrl("bijoux-artisanaux"),
    },
    {
      slug: "assurance",
      title: "Insurance Agency",
      shortDescription:
        "Lead-generation website for an insurance agency: packages, risk qualification, and consultation booking.",
      youtubeId: "GBU6BaPl_vs",
      review: {
        intro:
          "In insurance, lead quality defines conversion. This website qualifies client needs before the initial consultation.",
        capabilities: [
          "Insurance plans structured by client profile",
          "Guided quote calculation funnel",
          "Trust signals, compliance, and client reviews",
          "One-click consultation booking",
        ],
        automationPoints: [
          "Lead qualification and scoring inside the quote funnel",
          "Inquiry routing to the appropriate insurance product",
          "Clean inquiry payload ready for CRM sync",
        ],
      },
      tags: ["Insurance", "Lead Gen"],
      demoUrl: showcaseDemoUrl("assurance"),
    },
    {
      slug: "immobilier",
      title: "Real Estate Agency",
      shortDescription:
        "Real estate agency website: property listings, search filters, and online valuation requests.",
      youtubeId: "6XO6MvRdkj0",
      review: {
        intro:
          "For a real estate agency, every mandate counts. This site showcases properties with impact and captures seller valuation leads.",
        capabilities: [
          "Sales and rental property catalog",
          "Comprehensive property cards with galleries and floor plans",
          "Online property valuation intake form",
          "Direct private viewing booking",
        ],
        automationPoints: [
          "Seller and property qualification directly via valuation form",
          "Instant viewing leads routed to the assigned realtor",
          "Structured property parameters and media presentation",
        ],
      },
      tags: ["Real Estate", "Catalog"],
      demoUrl: showcaseDemoUrl("immobilier"),
    },
  ],
};

export function resolvePortfolioLocale(value?: string | null): PortfolioLocale {
  if (value === "ru" || value === "en") return value;
  return "fr";
}

export function getPortfolioProjects(locale?: string | null): readonly PortfolioProject[] {
  const l = resolvePortfolioLocale(locale);
  return PORTFOLIO_PROJECTS_BY_LOCALE[l];
}

export const PORTFOLIO_PROJECTS: readonly PortfolioProject[] = PORTFOLIO_PROJECTS_BY_LOCALE.fr;

export function getProject(slug: string, locale?: string | null): PortfolioProject | undefined {
  const projects = getPortfolioProjects(locale);
  return projects.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return PORTFOLIO_PROJECTS_BY_LOCALE.fr.map((p) => p.slug);
}

export const ytThumbUrl = (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

export const ytEmbedUrl = (id: string) => `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
