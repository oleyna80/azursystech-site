import type { Agent, Lang, Listing, UI } from './types'

/* ─── Listings ─────────────────────────────────────────── */

export const listings: Listing[] = [
  {
    id: 'l-001',
    slug: 'appartement-cimiez-nice',
    status: 'vente',
    city: 'Nice',
    address: {
      fr: 'Boulevard de Cimiez, Nice',
      en: 'Boulevard de Cimiez, Nice',
    },
    title: {
      fr: 'Appartement Belle Époque, Cimiez',
      en: 'Belle Époque Apartment, Cimiez',
    },
    description: {
      fr: "Appartement de caractère au cœur du quartier résidentiel de Cimiez. Hauts plafonds moulurés, parquet chevrons, triple exposition. Vue dégagée sur les collines de Nice depuis le salon. Calme absolu, à cinq minutes à pied des jardins du musée Matisse.",
      en: "Character apartment in the heart of Nice's residential Cimiez district. High moulded ceilings, herringbone parquet, triple aspect. Unobstructed views over the Nice hillside from the living room. Complete calm, five minutes' walk from the Matisse Museum gardens.",
    },
    price: '620 000 €',
    priceLabel: {
      fr: '620 000 €',
      en: '€620,000',
    },
    area: 112,
    rooms: 4,
    bedrooms: 3,
    floor: 3,
    images: [
      '/demo/immobilier/bien-cimiez-nice-01.jpg',
      '/demo/immobilier/bien-cimiez-nice-02.jpg',
      '/demo/immobilier/bien-cimiez-nice-03.jpg',
    ],
    features: {
      fr: ['Parquet chevrons', 'Moulures Belle Époque', 'Cave', 'Gardien'],
      en: ['Herringbone parquet', 'Belle Époque mouldings', 'Cellar', 'Concierge'],
    },
    agentId: 'a-001',
    featured: true,
  },
  {
    id: 'l-002',
    slug: 'maison-bord-de-mer-antibes',
    status: 'vente',
    city: 'Antibes',
    address: {
      fr: 'Chemin du Littoral, Antibes',
      en: 'Chemin du Littoral, Antibes',
    },
    title: {
      fr: "Bastide face à la mer, Cap d'Antibes",
      en: "Seafront Bastide, Cap d'Antibes",
    },
    description: {
      fr: "Bastide provençale au bout d'un chemin privé, dominant directement la Méditerranée. Terrasses orientées plein sud, jardin planté d'oliviers centenaires et de lavande. Matériaux locaux — pierre calcaire et tomettes — entièrement restaurée par des artisans régionaux.",
      en: "Provençal bastide at the end of a private lane, with direct views over the Mediterranean. South-facing terraces, garden planted with century-old olive trees and lavender. Local materials — limestone and terracotta tiles — fully restored by regional craftsmen.",
    },
    price: '2 450 000 €',
    priceLabel: {
      fr: '2 450 000 €',
      en: '€2,450,000',
    },
    area: 210,
    rooms: 6,
    bedrooms: 4,
    floor: null,
    images: [
      '/demo/immobilier/bien-antibes-01.jpg',
      '/demo/immobilier/bien-antibes-02.jpg',
      '/demo/immobilier/bien-antibes-03.jpg',
    ],
    features: {
      fr: ['Vue mer directe', 'Jardin oliviers', 'Piscine', 'Chemin privé'],
      en: ['Direct sea view', 'Olive garden', 'Pool', 'Private lane'],
    },
    agentId: 'a-001',
    featured: true,
  },
  {
    id: 'l-003',
    slug: 'penthouse-croisette-cannes',
    status: 'vente',
    city: 'Cannes',
    address: {
      fr: 'Boulevard de la Croisette, Cannes',
      en: 'Boulevard de la Croisette, Cannes',
    },
    title: {
      fr: 'Penthouse La Croisette, Cannes',
      en: 'La Croisette Penthouse, Cannes',
    },
    description: {
      fr: "Penthouse en dernier étage sur la Croisette. Terrasse panoramique de 80 m² face au Golfe de la Napoule. Matériaux de première qualité, domotique intégrée, accès direct à la plage privée de l'immeuble. Un appartement sans compromis pour un acheteur exigeant.",
      en: "Top-floor penthouse on La Croisette. Panoramic 80 m² terrace facing the Golfe de la Napoule. First-quality materials, integrated home automation, direct access to the building's private beach. A no-compromise apartment for a discerning buyer.",
    },
    price: '4 200 000 €',
    priceLabel: {
      fr: '4 200 000 €',
      en: '€4,200,000',
    },
    area: 185,
    rooms: 5,
    bedrooms: 3,
    floor: 8,
    images: [
      '/demo/immobilier/bien-cannes-01.jpg',
      '/demo/immobilier/bien-cannes-02.jpg',
      '/demo/immobilier/bien-cannes-03.jpg',
    ],
    features: {
      fr: ['Terrasse 80 m²', 'Vue panoramique', 'Plage privée', 'Domotique'],
      en: ['80 m² terrace', 'Panoramic view', 'Private beach', 'Home automation'],
    },
    agentId: 'a-002',
    featured: true,
  },
  {
    id: 'l-004',
    slug: 'mas-luberon-valbonne',
    status: 'location',
    city: 'Valbonne',
    address: {
      fr: 'Route de Sophia, Valbonne',
      en: 'Route de Sophia, Valbonne',
    },
    title: {
      fr: 'Mas provençal, Valbonne village',
      en: 'Provençal Mas, Valbonne village',
    },
    description: {
      fr: "Mas du XVIIIe siècle transformé en résidence contemporaine à quelques minutes du village de Valbonne. Cuisine ouverte sur terrasse, voûtes en pierre conservées, jardin clos de 3 000 m² avec piscine à débordement. Très calme. Disponible à la location annuelle.",
      en: "18th-century farmhouse transformed into a contemporary residence minutes from Valbonne village. Open kitchen onto terrace, preserved stone vaults, enclosed garden of 3,000 m² with infinity pool. Very quiet. Available for annual rental.",
    },
    price: '4 800 € / mois',
    priceLabel: {
      fr: '4 800 € / mois',
      en: '€4,800 / month',
    },
    area: 175,
    rooms: 5,
    bedrooms: 4,
    floor: null,
    images: [
      '/demo/immobilier/bien-valbonne-01.jpg',
      '/demo/immobilier/bien-valbonne-02.jpg',
      '/demo/immobilier/bien-valbonne-03.jpg',
    ],
    features: {
      fr: ['Voûtes en pierre', 'Piscine à débordement', 'Jardin 3 000 m²', 'Location annuelle'],
      en: ['Stone vaults', 'Infinity pool', '3,000 m² garden', 'Annual lease'],
    },
    agentId: 'a-002',
    featured: false,
  },
  {
    id: 'l-005',
    slug: 'villa-mougins-village',
    status: 'location',
    city: 'Mougins',
    address: {
      fr: 'Chemin des Amandiers, Mougins',
      en: 'Chemin des Amandiers, Mougins',
    },
    title: {
      fr: 'Villa contemporaine, Mougins village',
      en: 'Contemporary Villa, Mougins village',
    },
    description: {
      fr: "Villa contemporaine à flanc de colline, dans un quartier calme et verdoyant de Mougins. Architecture épurée, lignes horizontales, grandes baies vitrées sur la vallée. Piscine chauffée, garage double, jardin paysager signé. Location saisonnière ou annuelle.",
      en: "Contemporary hillside villa in a quiet, leafy area of Mougins. Clean architecture, horizontal lines, large bay windows over the valley. Heated pool, double garage, signed landscaped garden. Seasonal or annual rental.",
    },
    price: '3 200 € / mois',
    priceLabel: {
      fr: '3 200 € / mois',
      en: '€3,200 / month',
    },
    area: 145,
    rooms: 4,
    bedrooms: 3,
    floor: null,
    images: [
      '/demo/immobilier/bien-mougins-01.jpg',
      '/demo/immobilier/bien-mougins-02.jpg',
      '/demo/immobilier/bien-mougins-03.jpg',
    ],
    features: {
      fr: ['Piscine chauffée', 'Garage double', 'Vue vallée', 'Jardin paysager'],
      en: ['Heated pool', 'Double garage', 'Valley view', 'Landscaped garden'],
    },
    agentId: 'a-001',
    featured: false,
  },
  {
    id: 'l-006',
    slug: 'appartement-port-villefranche',
    status: 'location',
    city: 'Villefranche-sur-Mer',
    address: {
      fr: 'Quai Courbet, Villefranche-sur-Mer',
      en: 'Quai Courbet, Villefranche-sur-Mer',
    },
    title: {
      fr: 'Appartement vue rade, Villefranche',
      en: 'Rade-view Apartment, Villefranche',
    },
    description: {
      fr: "Appartement en étage élevé donnant directement sur la rade de Villefranche — l'une des plus profondes et des plus belles de Méditerranée. Lumineux, bien orienté, cuisine équipée récente. Idéal comme pied-à-terre côtier ou résidence principale. Location longue durée.",
      en: "High-floor apartment with direct views over the Rade de Villefranche — one of the deepest and most beautiful in the Mediterranean. Bright, well-oriented, recently fitted kitchen. Ideal as a coastal pied-à-terre or main residence. Long-term rental.",
    },
    price: '2 100 € / mois',
    priceLabel: {
      fr: '2 100 € / mois',
      en: '€2,100 / month',
    },
    area: 68,
    rooms: 3,
    bedrooms: 2,
    floor: 5,
    images: [
      '/demo/immobilier/bien-villefranche-01.jpg',
      '/demo/immobilier/bien-villefranche-02.jpg',
      '/demo/immobilier/bien-villefranche-03.jpg',
    ],
    features: {
      fr: ['Vue rade', 'Exposition plein sud', 'Cuisine équipée', 'Longue durée'],
      en: ['Rade view', 'Full south aspect', 'Fitted kitchen', 'Long-term'],
    },
    agentId: 'a-002',
    featured: false,
  },
]

/* ─── Agents ────────────────────────────────────────────── */

export const agents: Agent[] = [
  {
    id: 'a-001',
    name: 'Isabelle Martel',
    role: {
      fr: "Directrice, Côte d'Azur Est",
      en: "Director, Eastern Côte d'Azur",
    },
    bio: {
      fr: "Isabelle accompagne des acheteurs exigeants depuis vingt ans sur la Riviera. Son approche est patiente et précise : elle prend le temps de comprendre ce qu'une maison doit procurer avant de proposer quoi que ce soit.",
      en: "Isabelle has guided discerning buyers on the Riviera for twenty years. Her approach is patient and precise: she takes time to understand what a home should feel like before suggesting anything.",
    },
    phone: '+33 4 93 00 00 01',
    email: 'i.martel@atelier-rivage.fr',
    image: '/demo/immobilier/agent-isabelle.jpg',
  },
  {
    id: 'a-002',
    name: 'Nicolas Faure',
    role: {
      fr: 'Conseiller, Cannes et arrière-pays',
      en: 'Adviser, Cannes & hinterland',
    },
    bio: {
      fr: "Nicolas est spécialisé dans les propriétés de caractère de l'arrière-pays niçois et cannois. Il connaît chaque chemin, chaque bâtisse, et s'attache à trouver des correspondances justes entre un lieu et une personne.",
      en: "Nicolas specialises in character properties in the Nice and Cannes hinterland. He knows every lane and building, and focuses on finding genuine correspondences between a place and a person.",
    },
    phone: '+33 4 93 00 00 02',
    email: 'n.faure@atelier-rivage.fr',
    image: '/demo/immobilier/agent-nicolas.jpg',
  },
]

/* ─── i18n UI strings ───────────────────────────────────── */

export const ui: Record<Lang, UI> = {
  fr: {
    nav: {
      home: 'Accueil',
      catalogue: 'Biens',
      buy: 'Acheter',
      rent: 'Louer',
      agency: "L'agence",
      contact: 'Contact',
    },
    hero: {
      tagline: "Un atelier de recherche immobilière sur la Côte d'Azur.",
      cta_buy: 'Biens à vendre',
      cta_rent: 'Biens à louer',
    },
    catalogue: {
      title: 'Nos biens',
      filter_all: 'Tous',
      filter_sale: 'Vente',
      filter_rent: 'Location',
      empty_title: 'Aucun bien ne correspond',
      empty_body: "Ajustez le filtre ou consultez l'ensemble de nos biens.",
      reset: 'Voir tous les biens',
      rooms_label: 'pièces',
      area_label: 'm²',
      per_month: '/ mois',
    },
    detail: {
      rooms: 'pièces',
      bedrooms: 'chambres',
      area: 'm²',
      floor: 'étage',
      ground_floor: 'rez-de-chaussée',
      features: 'Points forts',
      description: 'Description',
      contact_agent: 'Contacter le conseiller',
      related: "D'autres biens",
      gallery_open: 'Ouvrir la galerie',
      gallery_close: 'Fermer la galerie',
      gallery_prev: 'Photo précédente',
      gallery_next: 'Photo suivante',
      image_of: 'sur',
    },
    agency: {
      title: 'Atelier Rivage',
      subtitle: "Un regard attentif sur la Côte d'Azur depuis 2008.",
      approach_title: 'Notre approche',
    },
    contact: {
      title: 'Nous contacter',
      subtitle: 'Une question, une visite, une recherche spécifique — écrivez-nous.',
      name_label: 'Nom complet',
      name_placeholder: 'Prénom Nom',
      email_label: 'Adresse e-mail',
      email_placeholder: 'vous@exemple.fr',
      phone_label: 'Téléphone (facultatif)',
      phone_placeholder: '+33 6 …',
      message_label: 'Message',
      message_placeholder: 'Décrivez votre recherche ou votre question…',
      submit: 'Envoyer',
      success_title: 'Message reçu',
      success_body: "Nous vous répondrons dans les meilleurs délais. Ceci est une démo — aucune donnée n'est transmise.",
      error_required: 'Ce champ est obligatoire.',
      error_email: 'Saisissez une adresse e-mail valide.',
    },
    footer: {
      tagline: 'Recherche immobilière attentive sur la Riviera.',
      nav_title: 'Navigation',
      contact_title: 'Contact',
      copyright: '© 2026 Atelier Rivage. Démo — aucune donnée réelle.',
    },
    status: {
      vente: 'Vente',
      location: 'Location',
    },
    meta: {
      home_title: "Atelier Rivage — Immobilier Côte d'Azur",
      home_description: "Atelier Rivage est une agence immobilière de confiance sur la Côte d'Azur. Appartements, villas et bastides à Nice, Antibes, Cannes, Valbonne, Mougins et Villefranche.",
      catalogue_title: 'Nos biens — Atelier Rivage',
      catalogue_description: "Découvrez notre sélection de biens immobiliers à vendre et à louer sur la Côte d'Azur.",
      buy_title: 'Acheter — Atelier Rivage',
      buy_description: "Biens immobiliers à vendre sur la Côte d'Azur : appartements, villas et bastides.",
      rent_title: 'Louer — Atelier Rivage',
      rent_description: "Biens immobiliers à louer sur la Côte d'Azur : appartements, villas et maisons de caractère.",
      agency_title: "L'agence — Atelier Rivage",
      agency_description: 'Atelier Rivage accompagne des acheteurs et locataires exigeants sur la Riviera depuis 2008.',
      contact_title: 'Contact — Atelier Rivage',
      contact_description: "Contactez l'équipe d'Atelier Rivage pour toute question ou demande de visite.",
    },
  },
  en: {
    nav: {
      home: 'Home',
      catalogue: 'Properties',
      buy: 'Buy',
      rent: 'Rent',
      agency: 'Agency',
      contact: 'Contact',
    },
    hero: {
      tagline: 'A considered approach to real estate on the French Riviera.',
      cta_buy: 'Properties for sale',
      cta_rent: 'Properties to rent',
    },
    catalogue: {
      title: 'Our properties',
      filter_all: 'All',
      filter_sale: 'For sale',
      filter_rent: 'For rent',
      empty_title: 'No properties match',
      empty_body: 'Adjust the filter or browse all our properties.',
      reset: 'See all properties',
      rooms_label: 'rooms',
      area_label: 'm²',
      per_month: '/ month',
    },
    detail: {
      rooms: 'rooms',
      bedrooms: 'bedrooms',
      area: 'm²',
      floor: 'floor',
      ground_floor: 'ground floor',
      features: 'Features',
      description: 'Description',
      contact_agent: 'Contact adviser',
      related: 'More properties',
      gallery_open: 'Open gallery',
      gallery_close: 'Close gallery',
      gallery_prev: 'Previous photo',
      gallery_next: 'Next photo',
      image_of: 'of',
    },
    agency: {
      title: 'Atelier Rivage',
      subtitle: "A careful eye on the Côte d'Azur since 2008.",
      approach_title: 'Our approach',
    },
    contact: {
      title: 'Get in touch',
      subtitle: 'A question, a viewing, a specific search — write to us.',
      name_label: 'Full name',
      name_placeholder: 'First Last',
      email_label: 'Email address',
      email_placeholder: 'you@example.com',
      phone_label: 'Phone (optional)',
      phone_placeholder: '+44 7…',
      message_label: 'Message',
      message_placeholder: 'Describe your search or question…',
      submit: 'Send',
      success_title: 'Message received',
      success_body: "We'll respond as soon as possible. This is a demo — no data is transmitted.",
      error_required: 'This field is required.',
      error_email: 'Enter a valid email address.',
    },
    footer: {
      tagline: 'Considered real-estate search on the Riviera.',
      nav_title: 'Navigation',
      contact_title: 'Contact',
      copyright: '© 2026 Atelier Rivage. Demo — no real data.',
    },
    status: {
      vente: 'For sale',
      location: 'To rent',
    },
    meta: {
      home_title: "Atelier Rivage — Côte d'Azur Real Estate",
      home_description: "Atelier Rivage is a trusted real-estate agency on the Côte d'Azur. Apartments, villas and bastides in Nice, Antibes, Cannes, Valbonne, Mougins and Villefranche.",
      catalogue_title: 'Properties — Atelier Rivage',
      catalogue_description: "Browse our curated selection of properties for sale and rent on the Côte d'Azur.",
      buy_title: 'Buy — Atelier Rivage',
      buy_description: "Properties for sale on the Côte d'Azur: apartments, villas and bastides.",
      rent_title: 'Rent — Atelier Rivage',
      rent_description: "Properties to rent on the Côte d'Azur: apartments, villas and character houses.",
      agency_title: 'Agency — Atelier Rivage',
      agency_description: 'Atelier Rivage has guided discerning buyers and tenants on the Riviera since 2008.',
      contact_title: 'Contact — Atelier Rivage',
      contact_description: 'Contact the Atelier Rivage team with any question or viewing request.',
    },
  },
}

/* ─── Helpers ───────────────────────────────────────────── */

export function getListing(slug: string): Listing | undefined {
  return listings.find((l) => l.slug === slug)
}

export function getAgent(id: string): Agent | undefined {
  return agents.find((a) => a.id === id)
}

export function getRelated(current: Listing, count = 2): Listing[] {
  return listings
    .filter((l) => l.id !== current.id && l.status === current.status)
    .slice(0, count)
}
