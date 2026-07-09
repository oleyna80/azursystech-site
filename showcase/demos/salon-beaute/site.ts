import type { DemoContent, DemoSite, QuoteFormField, SalonBeautyContent } from '@/lib/types'

const img = (src: string, alt: string, width = 1400, height = 960) => ({ src, alt, width, height })
const local = (name: string) => `/demo/salon-beaute/${name}`
const contactFormHref = '/demo/salon-beaute/contact#formulaire'

const appointmentFields: QuoteFormField[] = [
  { label: 'Nom', type: 'text', placeholder: 'Votre nom', required: true },
  { label: 'Téléphone', type: 'tel', placeholder: 'Votre téléphone', required: true },
  { label: 'Email', type: 'email', placeholder: 'Votre email', required: true },
  {
    label: 'Sujet',
    type: 'select',
    placeholder: 'Sélectionnez un sujet',
    options: ['Prendre rendez-vous', 'Conseil personnalisé', 'Question sur un soin', 'Carte cadeau'],
    required: true,
  },
  { label: 'Message', type: 'textarea', placeholder: 'Votre message...', required: true },
]

const services: SalonBeautyContent['servicesPage']['services'] = [
  {
    icon: 'scissors',
    title: 'Coiffure',
    description: 'Coupe, brushing, coiffure événementielle et conseils personnalisés.',
    price: 'à partir de 25 €',
    image: img(
      local('card_coiffure.jpg'),
      'Coiffure soignée aux tons chauds dans un salon lumineux',
    ),
  },
  {
    icon: 'brush',
    title: 'Coloration',
    description: 'Techniques de coloration, balayage, mèches et soins protecteurs.',
    price: 'à partir de 45 €',
    image: img(
      local('card_coloration.jpg'),
      'Brushing et coloration dans un salon lumineux',
    ),
  },
  {
    icon: 'lotus',
    title: 'Soins du visage',
    description: 'Nettoyage, hydratation, anti-âge et soins spécifiques.',
    price: 'à partir de 50 €',
    image: img(
      local('card_visage.jpg'),
      'Mise en beauté du visage en institut',
    ),
  },
  {
    icon: 'polish',
    title: 'Manucure & Pédicure',
    description: 'Soin des mains et des pieds, pose de vernis et mise en beauté.',
    price: 'à partir de 20 €',
    image: img(
      local('card_manucure.jpg'),
      'Manucure naturelle aux tons roses',
    ),
  },
  {
    icon: 'leaf',
    title: 'Épilation',
    description: 'Épilation à la cire du visage et du corps pour une peau douce et nette.',
    price: 'à partir de 15 €',
    image: img(
      local('card_epilation.jpg'),
      'Épilation à la cire en cabine — soin doux et professionnel',
      1200,
      1200,
    ),
  },
]

const values: SalonBeautyContent['values'] = [
  { icon: 'expert', label: 'Professionnels expérimentés' },
  { icon: 'leaf', label: 'Produits de qualité' },
  { icon: 'lotus', label: 'Ambiance relaxante' },
  { icon: 'calendar', label: 'Prise de rendez-vous facile' },
]

export const content: DemoContent = {
  hero: {
    eyebrow: 'Votre beauté, notre priorité',
    headline: 'Sublimez votre beauté avec expertise',
    subline: 'Des soins personnalisés dans un cadre élégant, pour révéler le meilleur de vous-même.',
    primaryCta: { label: 'Prendre rendez-vous', href: contactFormHref },
    secondaryCta: { label: 'Découvrir nos soins', href: '/demo/salon-beaute/services' },
    image: img('', ''),
    trustBullets: [],
  },
  services: { title: '', intro: '', cta: { label: '', href: '' }, items: [] },
  request: { title: '', body: '', cta: { label: '', href: '' }, fields: [], note: '' },
  process: { title: '', steps: [], humanControlNote: '' },
  area: { title: '', body: '', areas: [], badge: '' },
  trust: { title: '', points: [] },
  automation: { title: '', body: '', cta: { label: '', href: '' }, flow: [], summary: [] },
  faq: { title: '', items: [] },
  final: { title: '', body: '', actions: [] },
  salonBeauty: {
    hero: {
      eyebrow: 'Votre beauté, notre priorité',
      title: 'Sublimez votre beauté avec expertise',
      subtitle: 'Des soins personnalisés dans un cadre élégant, pour révéler le meilleur de vous-même.',
      primaryCta: { label: 'Prendre rendez-vous', href: contactFormHref },
      secondaryCta: { label: 'Découvrir nos soins', href: '/demo/salon-beaute/services' },
      image: img(
        local('hero_bg.jpg'),
        'Portrait beauté lumineux pendant une mise en beauté',
        1800,
        1200,
      ),
    },
    values,
    booking: {
      title: 'Réservez votre moment beauté',
      body: 'Choisissez votre service, indiquez vos disponibilités et nous vous confirmons votre rendez-vous.',
      cta: { label: 'Réserver maintenant', href: contactFormHref },
      image: img(
        local('booking_bg.jpg'),
        'Espace coiffure clair avec miroirs et fauteuils de salon',
        1800,
        1000,
      ),
    },
    popularServices: [services[0], services[1], services[3], services[2]],
    servicesPage: {
      eyebrow: 'Prenez soin de vous',
      title: 'Nos services',
      subtitle: 'Découvrez notre gamme complète de soins pour sublimer votre beauté.',
      image: img(
        local('services_header.jpg'),
        'Brosses et accessoires de coiffure sur fond clair',
        1600,
        900,
      ),
      services,
      adviceTitle: "Besoin d'un conseil personnalisé ?",
      adviceBody: 'Nous sommes là pour vous guider dans le choix du soin le plus adapté à vos besoins.',
      adviceCta: { label: 'Nous contacter', href: contactFormHref },
      adviceImage: img(
        local('services_cta_products.jpg'),
        'Flacons de soin, serviettes et accessoires dans une ambiance poudrée',
      ),
    },
    about: {
      title: 'À propos de nous',
      intro:
        'Salon de Beauté est un espace dédié à votre beauté et à votre bien-être. Notre équipe de professionnelles passionnées vous accueille dans un cadre chaleureux, élégant et raffiné.',
      image: img(
        local('about_salon.jpg'),
        'Même salon lumineux avec miroirs, postes de coiffure et plantes',
        1600,
        1050,
      ),
      values: [
        { icon: 'expert', label: 'Professionnalisme' },
        { icon: 'calendar', label: 'Produits premium' },
        { icon: 'chat', label: 'Écoute & conseil' },
        { icon: 'lotus', label: 'Ambiance chaleureuse' },
      ],
      philosophyTitle: 'Notre philosophie',
      philosophyText: [
        'Nous croyons que chaque personne est unique. Notre mission est de révéler votre beauté naturelle avec des soins adaptés à vos besoins.',
        "Nous mettons un point d'honneur à utiliser des produits de qualité et à vous offrir une expérience personnalisée dans une ambiance apaisante.",
      ],
      philosophyImage: img(
        local('about_products.jpg'),
        'Produits de soin premium sur fond beige et poudré',
      ),
      stats: [
        { value: '7+', label: "années d'expérience" },
        { value: '5000+', label: 'clientes satisfaites' },
        { value: '15+', label: 'experts beauté' },
        { value: '20+', label: 'soins proposés' },
      ],
      galleryTitle: 'Notre univers',
      gallery: [
        {
          title: 'Salon lumineux',
          image: img(
            local('gallery_1.jpg'),
            'Vue du salon avec fauteuils, postes de coiffure et miroirs',
          ),
        },
        {
          title: 'Produits premium',
          image: img(
            local('gallery_2.jpg'),
            'Détail des produits utilisés dans le salon',
          ),
        },
        {
          title: 'Cabine de soin',
          image: img(
            local('gallery_3.jpg'),
            'Détail du même salon depuis un angle plus intime',
          ),
        },
        {
          title: 'Espace détente',
          image: img(
            local('gallery_4.jpg'),
            'Coin accueil du même salon dans les tons beige et rose poudré',
          ),
        },
      ],
    },
    area: {
      title: '',
      body: '',
      zones: [],
    },
    reviews: {
      title: 'Avis clients',
      items: [
        {
          name: 'Claire M.',
          text: 'Accueil délicat, conseil très juste et résultat naturel. Le salon est calme et lumineux.',
          detail: 'Soin du visage',
        },
        {
          name: 'Elodie R.',
          text: 'Coloration impeccable, sans effet forcé. Je reviendrai pour le suivi et la manucure.',
          detail: 'Coloration',
        },
        {
          name: 'Sarah L.',
          text: 'Prise de rendez-vous simple, équipe ponctuelle et très professionnelle.',
          detail: 'Coiffure',
        },
      ],
    },
    contact: {
      title: 'Contactez-nous',
      subtitle:
        'Nous sommes là pour répondre à toutes vos questions et vous accompagner dans votre prise de rendez-vous.',
      image: img(
        local('contact_hero.jpg'),
        'Vase, flacons de soin et serviettes dans une ambiance de salon',
        1800,
        1000,
      ),
      info: [
        { icon: 'pin', label: 'Adresse', value: '10 Rue de la Beauté, 75001 Paris' },
        { icon: 'phone', label: 'Téléphone', value: '+33 1 23 45 67 89', href: 'tel:+33123456789' },
        { icon: 'mail', label: 'Email', value: 'contact@salondebeaute.fr', href: 'mailto:contact@salondebeaute.fr' },
        { icon: 'clock', label: 'Horaires', value: 'Lundi - Samedi : 9h00 - 20h00\nDimanche : fermé' },
        { icon: 'social', label: 'Suivez-nous', value: 'Instagram · Facebook · WhatsApp' },
      ],
      form: {
        title: 'Envoyez-nous un message',
        fields: appointmentFields,
        submitLabel: 'Envoyer le message',
      },
      note: 'Votre rendez-vous sera confirmé après vérification de nos disponibilités.',
    },
    satisfaction: {
      title: 'Votre satisfaction est notre engagement',
      body:
        'Nous mettons notre savoir-faire au service de votre bien-être, avec une attention sincère et personnalisée.',
      cta: { label: 'En savoir plus', href: '/demo/salon-beaute/about' },
      image: img(
        local('promo_ambiance.jpg'),
        'Espace d’accueil du salon dans les mêmes tons doux',
        1800,
        1000,
      ),
    },
  },
}

export const site: DemoSite = {
  slug: 'salon-beaute',
  title: 'Salon de Beauté',
  subtitle: 'Votre beauté, notre passion',
  category: 'Site avec prise de rendez-vous',
  description:
    'Démonstration de site premium pour salon de beauté : services, tarifs, présentation, avis, contact et demande de rendez-vous.',
  previewImage: {
    src: local('hero_bg.jpg'),
    alt: 'Aperçu de la démo Salon de Beauté',
    width: 1200,
    height: 800,
  },
  badge: 'online booking',
  niche: 'Beauty / wellness',
  phone: '+33 1 23 45 67 89',
  phoneHref: 'tel:+33123456789',
  headerCta: { label: 'Prendre rendez-vous', href: contactFormHref },
  nav: [
    { label: 'Accueil', href: '/demo/salon-beaute' },
    { label: 'Services', href: '/demo/salon-beaute/services' },
    { label: 'À propos', href: '/demo/salon-beaute/about' },
    { label: 'Contact', href: '/demo/salon-beaute/contact' },
  ],
  pages: [
    {
      slug: '',
      label: 'Accueil',
      title: 'Salon de Beauté - Sublimez votre beauté avec expertise',
      description:
        'Salon de beauté à Paris : coiffure, coloration, soins du visage, manucure, épilation et demande de rendez-vous.',
      sections: [{ type: 'salonBeauty', contentKey: 'salonBeauty' }],
    },
    {
      slug: 'services',
      label: 'Services',
      title: 'Nos services beauté',
      description:
        'Prestations de salon de beauté à Paris : coiffure, coloration, soins du visage, manucure, pédicure et épilation.',
      sections: [{ type: 'salonBeauty', contentKey: 'salonBeauty' }],
    },
    {
      slug: 'about',
      label: 'À propos',
      title: 'À propos de Salon de Beauté',
      description:
        'Découvrez Salon de Beauté, son équipe, sa philosophie, son univers et les avis de ses clientes.',
      sections: [{ type: 'salonBeauty', contentKey: 'salonBeauty' }],
    },
    {
      slug: 'contact',
      label: 'Contact',
      title: 'Contactez Salon de Beauté',
      description:
        'Coordonnées, horaires, carte stylisée et formulaire de demande de rendez-vous pour Salon de Beauté à Paris.',
      sections: [{ type: 'salonBeauty', contentKey: 'salonBeauty' }],
    },
  ],
  footer: {
    description: 'Votre beauté, notre passion.',
    columns: [
      {
        title: 'Services',
        links: [
          { label: 'Coiffure', href: '/demo/salon-beaute/services' },
          { label: 'Coloration', href: '/demo/salon-beaute/services' },
          { label: 'Soins du visage', href: '/demo/salon-beaute/services' },
          { label: 'Manucure', href: '/demo/salon-beaute/services' },
          { label: 'Épilation', href: '/demo/salon-beaute/services' },
        ],
      },
      {
        title: 'Liens rapides',
        links: [
          { label: 'À propos', href: '/demo/salon-beaute/about' },
          { label: 'Contact', href: '/demo/salon-beaute/contact' },
        ],
      },
      {
        title: 'Contact',
        links: [
          { label: '+33 1 23 45 67 89', href: 'tel:+33123456789' },
          { label: '10 Rue de la Beauté, 75001 Paris', href: '/demo/salon-beaute/contact' },
          { label: 'Lun - Sam : 9h00 - 20h00', href: '/demo/salon-beaute/contact' },
        ],
      },
    ],
    copyright: '© 2026 Salon de Beauté. Tous droits réservés.',
    legalLinks: [
      { label: 'Mentions légales', href: '/demo/salon-beaute/contact' },
      { label: 'Politique de confidentialité', href: '/demo/salon-beaute/contact' },
    ],
  },
  theme: {
    primary: '#8B2535',
    primaryFg: '#FFFFFF',
    accent: '#E8E8E8',
    bg: '#F8F0EA',
    surface: '#FFFFFF',
    border: '#E8E8E8',
    font: {
      heading: 'Playfair Display',
      body: 'Inter',
    },
    radius: 'md',
    sectionSpacing: 'spacious',
    buttonStyle: 'solid',
    cardStyle: 'elevated',
    imageStyle: 'rounded',
  },
}
