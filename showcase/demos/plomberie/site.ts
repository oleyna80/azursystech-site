import type { DemoContent, DemoSite } from '@/lib/types'

const quoteFields = [
  {
    label: 'Nom complet',
    type: 'text' as const,
    required: true,
  },
  {
    label: 'Téléphone',
    type: 'tel' as const,
    required: true,
  },
  {
    label: 'Email',
    type: 'email' as const,
    required: true,
  },
  {
    label: 'Type de service',
    type: 'select' as const,
    placeholder: 'Sélectionnez un service',
    options: ['Dépannage urgent', 'Réparation', 'Installation', 'Rénovation', 'Chauffage', 'Maintenance'],
    required: true,
  },
  {
    label: 'Décrivez votre besoin',
    type: 'textarea' as const,
    placeholder: 'Expliquez le problème, votre adresse ou le créneau souhaité.',
    required: true,
  },
]

export const content: DemoContent = {
  hero: {
    eyebrow: 'Plomberie Pro · service local',
    headline: 'Votre Plombier de Confiance',
    subline:
      'Plombiers professionnels certifiés à votre service. Intervention rapide, devis gratuit, travail garanti. Disponibles 24h/24 et 7j/7 pour vos urgences.',
    primaryCta: { label: 'Demander un Devis Gratuit', href: '#contact' },
    secondaryCta: { label: 'Appeler Maintenant', href: 'tel:+33123456789' },
    image: {
      src: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=1800&q=86',
      alt: 'Robinet moderne dans une salle de bain lumineuse',
      width: 1800,
      height: 1200,
    },
    trustBullets: ['Devis gratuit', 'Intervention rapide', 'Garantie travaux'],
  },
  services: {
    title: 'Nos Services',
    intro: 'Des solutions complètes pour tous vos besoins en plomberie et chauffage.',
    cta: { label: 'Demander un devis', href: '#contact' },
    items: [],
  },
  request: {
    title: 'Urgence plomberie 24/7',
    body: 'Une ligne dédiée pour les urgences critiques avec une réponse rapide.',
    cta: { label: 'Appeler maintenant', href: 'tel:+33123456789' },
    fields: [],
    note: 'Intervention rapide selon disponibilité locale.',
  },
  process: {
    title: 'Intervention simple et suivie',
    steps: [],
    humanControlNote: 'Un artisan confirme toujours le diagnostic et le devis avant travaux.',
  },
  area: {
    title: "Zone d'Intervention",
    body: "Nous couvrons toute l'Île-de-France avec des équipes locales.",
    areas: ['Paris intramuros', 'Hauts-de-Seine', 'Seine-Saint-Denis', 'Val-de-Marne'],
    badge: 'Île-de-France',
  },
  trust: {
    title: 'Pourquoi Choisir Plomberie Pro ?',
    points: [],
  },
  automation: {
    title: 'Contact direct',
    body: 'Le site présente uniquement les services et les moyens de contact de Plomberie Pro.',
    cta: { label: 'Contacter', href: '#contact' },
    flow: [],
    summary: [],
  },
  faq: {
    title: 'Questions fréquentes',
    items: [],
  },
  final: {
    title: 'Contactez Plomberie Pro',
    body: 'Demandez un devis gratuit ou appelez pour une urgence.',
    actions: [{ label: 'Devis Gratuit', href: '#contact' }],
  },
  plumbingLanding: {
    hero: {
      badge: 'Intervention rapide 24/7',
      title: 'Votre Plombier',
      highlightedLine: 'de Confiance',
      subtitle:
        'Plombiers professionnels certifiés à votre service. Intervention rapide, devis gratuit, travail garanti. Disponibles 24h/24 et 7j/7 pour vos urgences.',
      primaryCta: { label: 'Demander un Devis Gratuit', href: '#contact' },
      secondaryCta: { label: 'Appeler Maintenant', href: 'tel:+33123456789' },
      trustBullets: ['Devis gratuit', 'Intervention rapide', 'Garantie travaux'],
      image: {
        src: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=1800&q=86',
        alt: 'Robinet moderne dans une salle de bain lumineuse',
        width: 1800,
        height: 1200,
      },
      form: {
        title: 'Demandez votre',
        highlightedWord: 'devis gratuit',
        fields: quoteFields,
        submitLabel: 'Envoyer la Demande',
      },
    },
    stats: [
      { value: '15+', label: "Années d'expérience", icon: 'award' },
      { value: '5000+', label: 'Clients satisfaits', icon: 'users' },
      { value: '24/7', label: 'Disponibilité', icon: 'clock' },
      { value: '2h', label: "Délai d'intervention", icon: 'bolt' },
    ],
    services: {
      title: 'Nos',
      highlightedWord: 'Services',
      subtitle: 'Des solutions complètes pour tous vos besoins en plomberie et chauffage.',
      items: [
        {
          icon: 'pipe',
          title: 'Dépannage Urgent',
          description: "Intervention rapide 24/7 pour fuites d'eau, canalisations bouchées, panne de chauffe-eau.",
          cta: { label: 'En savoir plus', href: '#contact' },
        },
        {
          icon: 'wrench',
          title: 'Réparation',
          description: 'Réparation de fuites, canalisations, robinets, WC, éviers et équipements sanitaires.',
          cta: { label: 'En savoir plus', href: '#contact' },
        },
        {
          icon: 'gear',
          title: 'Installation',
          description: 'Installation de sanitaires, robinetterie, chauffe-eau, radiateurs et tous équipements.',
          cta: { label: 'En savoir plus', href: '#contact' },
        },
        {
          icon: 'home',
          title: 'Rénovation',
          description: 'Rénovation complète de votre plomberie, salle de bain et cuisine sur mesure.',
          cta: { label: 'En savoir plus', href: '#contact' },
        },
        {
          icon: 'flame',
          title: 'Chauffage',
          description: 'Installation, réparation et entretien de chaudières, chauffe-eau et systèmes de chauffage.',
          cta: { label: 'En savoir plus', href: '#contact' },
        },
        {
          icon: 'shield',
          title: 'Maintenance',
          description: 'Contrats de maintenance préventive pour votre tranquillité et la longévité de vos installations.',
          cta: { label: 'En savoir plus', href: '#contact' },
        },
      ],
    },
    why: {
      title: 'Pourquoi Choisir',
      highlightedWord: 'Plomberie Pro',
      points: [
        "Plombiers certifiés et assurés avec 15+ ans d'expérience",
        'Intervention rapide sous 2h en urgence, disponible 24/7',
        'Devis gratuit et transparent, sans surprise',
        'Garantie sur tous nos travaux et pièces',
        'Tarifs compétitifs et paiement facilité',
        'Respect des normes et réglementations en vigueur',
      ],
      image: {
        src: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=84',
        alt: 'Salle de bain rénovée avec vasque et douche',
        width: 1200,
        height: 1400,
      },
      badgeTitle: 'Travaux garantis',
      badgeText: 'Assurance décennale et finitions propres',
    },
    emergency: {
      label: 'Urgence plomberie 24/7',
      title: "Besoin d'une intervention immédiate ?",
      body:
        "Une ligne dédiée pour les urgences critiques: fuite importante, dégât des eaux, panne de chauffe-eau. Notre dispatch local vous répond en moins de 30 secondes.",
      phone: '01 23 45 67 89',
      phoneHref: 'tel:+33123456789',
      primaryCta: { label: 'Demander un devis', href: '#contact' },
      secondaryCta: { label: 'Appeler maintenant', href: 'tel:+33123456789' },
    },
    area: {
      title: "Zone d'Intervention",
      body:
        "Nous couvrons toute l'Île-de-France avec des équipes locales pour garantir des interventions rapides et efficaces.",
      zones: ['Paris intramuros', 'Hauts-de-Seine', 'Seine-Saint-Denis', 'Val-de-Marne', 'Yvelines Est', 'Essonne Nord'],
      mapLabel: "Carte stylisée de la zone d'intervention autour de Paris",
    },
    reviews: {
      title: 'Ce Que Disent Nos',
      highlightedWord: 'Clients',
      subtitle: 'Plus de 5000 clients satisfaits',
      cta: { label: 'Voir tous les avis Google', href: '#contact' },
      items: [
        {
          name: 'Marie Dupont',
          location: 'Paris 15ème',
          text:
            "Intervention très rapide et professionnelle. Le plombier a résolu mon problème de fuite en moins d'une heure. Je recommande !",
          date: 'Il y a 2 semaines',
        },
        {
          name: 'Jean Martin',
          location: 'Boulogne-Billancourt',
          text:
            "Service impeccable, tarifs transparents et travail soigné. J'ai fait appel à eux pour rénover ma salle de bain, résultat parfait.",
          date: 'Il y a 1 mois',
        },
        {
          name: 'Sophie Bernard',
          location: 'Nanterre',
          text:
            "Disponibles même le week-end pour une urgence. Équipe sérieuse et compétente. Je suis très satisfaite.",
          date: 'Il y a 3 semaines',
        },
      ],
    },
    contact: {
      title: 'Contactez-Nous',
      body: 'Demandez votre devis gratuit ou contactez-nous pour une intervention urgente.',
      info: [
        { icon: 'phone', label: 'Téléphone', value: '01 23 45 67 89', href: 'tel:+33123456789' },
        { icon: 'mail', label: 'Email', value: 'contact@plomberie-pro.fr', href: 'mailto:contact@plomberie-pro.fr' },
        { icon: 'pin', label: "Zone d'intervention", value: 'Paris et Île-de-France' },
        { icon: 'clock', label: 'Horaires', value: '24/7 - Urgences' },
      ],
      form: {
        title: 'Décrivez votre projet',
        fields: quoteFields,
        submitLabel: 'Envoyer la Demande',
      },
    },
  },
}

export const site: DemoSite = {
  slug: 'plomberie',
  title: 'Plomberie Pro',
  subtitle: 'Votre plombier de confiance',
  category: 'Site vitrine pour service local',
  description:
    'Démonstration de site moderne pour un plombier local: devis gratuit, urgence 24/7, services, zone, avis et contact.',
  previewImage: {
    src: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=1200&q=86',
    alt: 'Plomberie Pro demo preview',
    width: 1200,
    height: 800,
  },
  badge: 'service local',
  niche: 'Plomberie',
  phone: '01 23 45 67 89',
  phoneHref: 'tel:+33123456789',
  headerCta: { label: 'Devis Gratuit', href: '#contact' },
  nav: [
    { label: 'Accueil', href: '#top' },
    { label: 'Services', href: '#services' },
    { label: 'À propos', href: '#about' },
    { label: "Zone d'intervention", href: '#zone' },
    { label: 'Avis', href: '#avis' },
    { label: 'Contact', href: '#contact' },
  ],
  pages: [
    {
      slug: '',
      label: 'Accueil',
      title: 'Plomberie Pro — Votre plombier de confiance',
      description:
        'Plombiers certifiés en Île-de-France: dépannage urgent, réparation, installation, rénovation, chauffage et maintenance.',
      sections: [{ type: 'plumbingLanding', contentKey: 'plumbingLanding' }],
    },
  ],
  footer: {
    description: 'Intervention rapide et travail de qualité pour tous vos besoins en plomberie et chauffage.',
    columns: [
      {
        title: 'Services',
        links: [
          { label: 'Dépannage Urgent', href: '#services' },
          { label: 'Réparation', href: '#services' },
          { label: 'Installation', href: '#services' },
          { label: 'Rénovation', href: '#services' },
          { label: 'Chauffage', href: '#services' },
          { label: 'Maintenance', href: '#services' },
        ],
      },
      {
        title: 'Liens Rapides',
        links: [
          { label: 'À propos', href: '#about' },
          { label: "Zone d'intervention", href: '#zone' },
          { label: 'Avis clients', href: '#avis' },
          { label: 'Contact', href: '#contact' },
        ],
      },
      {
        title: 'Contact',
        links: [
          { label: '01 23 45 67 89', href: 'tel:+33123456789' },
          { label: 'contact@plomberie-pro.fr', href: 'mailto:contact@plomberie-pro.fr' },
          { label: 'Paris et Île-de-France', href: '#zone' },
          { label: '24/7 - Urgences', href: '#request' },
        ],
      },
    ],
    certification: {
      title: 'Certification',
      items: ['Artisan plombier certifié', 'Assurance décennale', 'Garantie travaux'],
    },
    copyright: '© 2024 Plomberie Pro - Tous droits réservés',
    legalLinks: [
      { label: 'Mentions légales', href: '#contact' },
      { label: 'Politique de confidentialité', href: '#contact' },
    ],
  },
  theme: {
    primary: '#005BEA',
    primaryFg: '#FFFFFF',
    accent: '#17BEBB',
    bg: '#F6F9FE',
    surface: '#FFFFFF',
    border: '#D9E3F2',
    font: {
      heading: 'Arial',
      body: 'Arial',
    },
    radius: 'md',
    sectionSpacing: 'spacious',
    buttonStyle: 'solid',
    cardStyle: 'bordered',
    imageStyle: 'natural',
  },
}
