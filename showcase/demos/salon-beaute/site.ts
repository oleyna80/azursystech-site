import type { DemoContent, DemoSite, QuoteFormField, SalonBeautyContent } from '@/lib/types'

const img = (src: string, alt: string, width = 1400, height = 960) => ({ src, alt, width, height })
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
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=84',
      'Coiffure soignée aux tons chauds dans un salon lumineux',
    ),
  },
  {
    icon: 'brush',
    title: 'Coloration',
    description: 'Techniques de coloration, balayage, mèches et soins protecteurs.',
    price: 'à partir de 45 €',
    image: img(
      'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=84',
      'Brushing et coloration dans un salon lumineux',
    ),
  },
  {
    icon: 'lotus',
    title: 'Soins du visage',
    description: 'Nettoyage, hydratation, anti-âge et soins spécifiques.',
    price: 'à partir de 50 €',
    image: img(
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1200&q=84',
      'Mise en beauté du visage en institut',
    ),
  },
  {
    icon: 'polish',
    title: 'Manucure & Pédicure',
    description: 'Soin des mains et des pieds, pose de vernis et mise en beauté.',
    price: 'à partir de 20 €',
    image: img(
      'https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=1200&q=84',
      'Manucure naturelle aux tons roses',
    ),
  },
  {
    icon: 'leaf',
    title: 'Épilation',
    description: 'Épilation à la cire du visage et du corps pour une peau douce et nette.',
    price: 'à partir de 15 €',
    image: img(
      '/demo/salon-beaute/epilation.png',
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
    subline: 'Des soins personnalisés dans un cadre élégant pour révéler le meilleur de vous-même.',
    primaryCta: { label: 'Prendre rendez-vous', href: contactFormHref },
    secondaryCta: { label: 'Découvrir nos services', href: '/demo/salon-beaute/services' },
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
      subtitle: 'Des soins personnalisés dans un cadre élégant pour révéler le meilleur de vous-même.',
      primaryCta: { label: 'Prendre rendez-vous', href: contactFormHref },
      secondaryCta: { label: 'Découvrir nos services', href: '/demo/salon-beaute/services' },
      image: img(
        'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1400&q=84',
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
        'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1900&q=86',
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
        'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1800&q=86',
        'Brosses et accessoires de coiffure sur fond clair',
        1600,
        900,
      ),
      services,
      adviceTitle: "Besoin d'un conseil personnalisé ?",
      adviceBody: 'Nous sommes là pour vous guider dans le choix du soin le plus adapté à vos besoins.',
      adviceCta: { label: 'Nous contacter', href: contactFormHref },
      adviceImage: img(
        'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1500&q=86',
        'Flacons de soin, serviettes et accessoires dans une ambiance poudrée',
      ),
    },
    about: {
      title: 'À propos de nous',
      intro:
        'Salon Beauté est un espace dédié à votre beauté et à votre bien-être. Notre équipe de professionnelles passionnées vous accueille dans un cadre chaleureux, élégant et raffiné.',
      image: img(
        'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1800&q=86',
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
        'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1500&q=86',
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
            'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=82',
            'Vue du salon avec fauteuils, postes de coiffure et miroirs',
          ),
        },
        {
          title: 'Produits premium',
          image: img(
            'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=82',
            'Détail des produits utilisés dans le salon',
          ),
        },
        {
          title: 'Cabine de soin',
          image: img(
            'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=82',
            'Détail du même salon depuis un angle plus intime',
          ),
        },
        {
          title: 'Espace détente',
          image: img(
            'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=82',
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
        'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1800&q=86',
        'Vase, flacons de soin et serviettes dans une ambiance de salon',
        1800,
        1000,
      ),
      info: [
        { icon: 'pin', label: 'Adresse', value: '10 Rue de la Beauté, 75001 Paris' },
        { icon: 'phone', label: 'Téléphone', value: '+33 1 23 45 67 89', href: 'tel:+33123456789' },
        { icon: 'mail', label: 'Email', value: 'contact@salonbeaute.fr', href: 'mailto:contact@salonbeaute.fr' },
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
      title: 'Votre satisfaction est notre priorité',
      body:
        'Nous mettons notre savoir-faire au service de votre bien-être avec une approche attentive et personnalisée.',
      cta: { label: 'En savoir plus', href: '/demo/salon-beaute/about' },
      image: img(
        'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1800&q=86',
        'Espace d’accueil du salon dans les mêmes tons doux',
        1800,
        1000,
      ),
    },
  },
}

export const site: DemoSite = {
  slug: 'salon-beaute',
  title: 'Salon Beauté',
  subtitle: 'Votre beauté, notre passion',
  category: 'Site avec prise de rendez-vous',
  description:
    'Démonstration de site premium pour salon de beauté : services, tarifs, présentation, avis, contact et demande de rendez-vous.',
  previewImage: {
    src: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1200&q=86',
    alt: 'Aperçu du demo Salon Beauté',
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
    { label: 'Avis', href: '/demo/salon-beaute/about#avis' },
    { label: 'Contact', href: '/demo/salon-beaute/contact' },
  ],
  pages: [
    {
      slug: '',
      label: 'Accueil',
      title: 'Salon Beauté - Sublimez votre beauté avec expertise',
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
      title: 'À propos de Salon Beauté',
      description:
        'Découvrez Salon Beauté, son équipe, sa philosophie, son univers et les avis de ses clientes.',
      sections: [{ type: 'salonBeauty', contentKey: 'salonBeauty' }],
    },
    {
      slug: 'contact',
      label: 'Contact',
      title: 'Contactez Salon Beauté',
      description:
        'Coordonnées, horaires, carte stylisée et formulaire de demande de rendez-vous pour Salon Beauté à Paris.',
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
          { label: 'Avis clients', href: '/demo/salon-beaute/about#avis' },
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
    copyright: '© 2024 Salon Beauté. Tous droits réservés.',
    legalLinks: [
      { label: 'Mentions légales', href: '/demo/salon-beaute/contact' },
      { label: 'Politique de confidentialité', href: '/demo/salon-beaute/contact' },
    ],
  },
  theme: {
    primary: '#9A4F56',
    primaryFg: '#FFFFFF',
    accent: '#E8DDD6',
    bg: '#FAF7F4',
    surface: '#FFFFFF',
    border: '#E8DDD6',
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
