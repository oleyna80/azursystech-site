const SHOWCASE_BASE_URL =
  process.env.NEXT_PUBLIC_SHOWCASE_BASE_URL ??
  (process.env.NODE_ENV === "development" ? "http://localhost:3002" : "");

const showcaseDemoUrl = (slug: string) => `${SHOWCASE_BASE_URL}/demo/${slug}`;

// Portfolio content is French-only by design (Owner decision, WB-2026-07-05-portfolio).
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

export const PORTFOLIO_PROJECTS: readonly PortfolioProject[] = [
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
];

export const getProject = (slug: string): PortfolioProject | undefined =>
  PORTFOLIO_PROJECTS.find((p) => p.slug === slug);

export const getAllSlugs = (): string[] => PORTFOLIO_PROJECTS.map((p) => p.slug);

export const ytThumbUrl = (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

export const ytEmbedUrl = (id: string) => `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
