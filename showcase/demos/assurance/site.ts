import type { DemoContent, DemoSite, HeroContent, ServicesContent } from '@/lib/types'

type Product = {
  slug: string
  label: string
  title: string
  description: string
  coverageTitle: string
  coverage: string[]
}

const basePath = '/demo/assurance'

const products: Product[] = [
  {
    slug: 'auto',
    label: 'Auto',
    title: 'Assurance Auto',
    description:
      'Une couverture claire pour votre véhicule, vos trajets quotidiens et les imprévus de la route.',
    coverageTitle: 'Ce que couvre cette assurance',
    coverage: ['Responsabilité civile obligatoire', 'Vol, incendie et bris de glace', 'Assistance et protection du conducteur'],
  },
  {
    slug: 'habitation',
    label: 'Habitation',
    title: 'Habitation (MRH)',
    description:
      'Une protection multirisque pour votre logement, vos biens et votre responsabilité de locataire ou propriétaire.',
    coverageTitle: 'Ce que couvre cette assurance',
    coverage: ['Dégâts des eaux, incendie et événements climatiques', 'Vol et vandalisme', 'Responsabilité civile vie privée'],
  },
  {
    slug: 'sante',
    label: 'Santé',
    title: 'Santé / Mutuelle',
    description:
      'Un contrat santé ajusté à vos besoins réels, sans garantie inutile ni angle mort sur les postes importants.',
    coverageTitle: 'Ce que couvre cette assurance',
    coverage: ['Hospitalisation et soins courants', 'Optique, dentaire et audiologie', 'Médecines douces selon formule'],
  },
  {
    slug: 'responsabilite-civile',
    label: 'RC',
    title: 'Responsabilité Civile',
    description:
      'Une protection pour les dommages causés à des tiers dans votre vie privée ou dans votre activité professionnelle.',
    coverageTitle: 'Ce que couvre cette assurance',
    coverage: ['Responsabilité civile privée', 'Responsabilité civile professionnelle', 'Défense et recours selon contrat'],
  },
  {
    slug: 'emprunteur',
    label: 'Emprunteur',
    title: 'Assurance Emprunteur',
    description:
      'Une solution lisible pour sécuriser votre prêt immobilier et comparer les garanties au bon niveau.',
    coverageTitle: 'Ce que couvre cette assurance',
    coverage: ['Décès et perte totale et irréversible d’autonomie', 'Invalidité et incapacité selon profil', 'Délégation possible selon dossier'],
  },
  {
    slug: 'prevoyance',
    label: 'Prévoyance',
    title: 'Prévoyance & Assurance Vie',
    description:
      'Des garanties pour protéger vos proches, vos revenus et votre projet patrimonial dans la durée.',
    coverageTitle: 'Ce que couvre cette assurance',
    coverage: ['Maintien de revenus', 'Protection de la famille', 'Solutions d’épargne et de transmission'],
  },
  {
    slug: 'scolaire',
    label: 'Scolaire',
    title: 'Assurance Scolaire',
    description:
      'Une couverture simple pour les enfants, les activités scolaires et les sorties extrascolaires.',
    coverageTitle: 'Ce que couvre cette assurance',
    coverage: ['Responsabilité civile enfant', 'Individuelle accident', 'Activités scolaires et extrascolaires'],
  },
  {
    slug: 'entreprise',
    label: 'Entreprise',
    title: 'Assurance Entreprise',
    description:
      'Un socle de protection pour votre activité, vos locaux, votre matériel et votre responsabilité professionnelle.',
    coverageTitle: 'Protégez votre activité professionnelle',
    coverage: ['Multirisque professionnelle', 'Responsabilité civile exploitation', 'Protection des biens et pertes d’exploitation'],
  },
]

function productHero(product: Product): HeroContent {
  return {
    eyebrow: 'Assurance sur mesure',
    headline: product.title,
    subline: product.description,
    primaryCta: { label: 'Demander un devis', href: `${basePath}/devis` },
    secondaryCta: { label: 'Parler à Paul Clément', href: 'tel:+33123456789' },
    image: {
      src: '/demo/assurance/paris-hero.jpg',
      alt: 'Vue de Paris utilisée comme visuel de couverture assurance',
      width: 1200,
      height: 900,
    },
    trustBullets: ['Conseil personnalisé', 'Devis gratuit', 'Réponse sous 24h ouvrées'],
  }
}

function productCoverage(product: Product): ServicesContent {
  return {
    title: product.coverageTitle,
    intro: 'Chaque devis est adapté à votre situation, aux garanties nécessaires et au niveau de franchise acceptable.',
    cta: { label: 'Comparer les garanties', href: `${basePath}/devis` },
    items: product.coverage.map((item) => ({
      icon: 'search',
      title: item,
      description:
        'Paul Clément vérifie les exclusions, les plafonds et les conditions avant de vous proposer une solution.',
    })),
  }
}

const productContent = Object.fromEntries(
  products.flatMap((product) => [
    [`${product.slug}Hero`, productHero(product)],
    [`${product.slug}Coverage`, productCoverage(product)],
  ]),
)

export const content = {
  hero: {
    eyebrow: "Agent d'assurance indépendant",
    headline: 'Votre assurance, votre tranquillité',
    subline:
      'Paul Clément vous accompagne dans le choix de vos assurances avec un conseil personnalisé, impartial et compréhensible.',
    primaryCta: { label: 'Demander un devis gratuit', href: `${basePath}/devis` },
    secondaryCta: { label: 'Voir les assurances', href: `${basePath}#services` },
    image: {
      src: '/demo/assurance/paris-hero.jpg',
      alt: 'Paris au lever du jour pour illustrer un cabinet assurance indépendant',
      width: 1200,
      height: 900,
    },
    trustBullets: ['ORIAS n° 00 000 000 - mention démo', '+500 clients accompagnés', 'Note moyenne 4,9 / 5'],
  },
  services: {
    title: 'Toutes vos assurances au même endroit',
    intro:
      'Un point de contact unique pour comparer, comprendre et ajuster vos garanties personnelles ou professionnelles.',
    cta: { label: 'Demander une analyse gratuite', href: `${basePath}/devis` },
    items: products.map((product) => ({
      icon: 'search',
      title: product.title,
      description: product.description,
    })),
  },
  request: {
    title: 'Demandez votre devis',
    body:
      'Décrivez votre situation en quelques lignes. Le formulaire de cette démonstration ne transmet aucune donnée externe.',
    cta: { label: 'Envoyer la demande', href: `${basePath}/devis#request` },
    fields: ['Prénom et nom', 'Email', 'Téléphone', "Type d'assurance", 'Votre situation'],
    note: 'Réponse personnalisée sous 24h ouvrées dans le parcours réel. Aucune donnée envoyée dans cette démo.',
  },
  process: {
    title: 'Comment ça marche ?',
    steps: [
      'Vous décrivez votre besoin ou votre contrat actuel.',
      'Paul Clément analyse les garanties, les franchises et les exclusions.',
      'Vous recevez une proposition claire avec les points de vigilance.',
      'Vous choisissez tranquillement, sans engagement.',
    ],
    humanControlNote: 'Chaque proposition reste validée par un conseiller humain avant toute souscription.',
  },
  area: {
    title: 'Conseil en assurance en France',
    body:
      'Le cabinet accompagne des particuliers, familles, indépendants et petites entreprises avec un échange à distance ou sur rendez-vous.',
    areas: ['Auto', 'Habitation', 'Santé', 'Responsabilité civile', 'Emprunteur', 'Prévoyance', 'Scolaire', 'Entreprise'],
    badge: 'Devis gratuit et sans engagement',
  },
  trust: {
    title: 'Un agent à votre écoute, pas un simple vendeur',
    points: [
      'Indépendant et impartial dans la comparaison des garanties.',
      'Conseil personnalisé selon votre profil, votre budget et vos risques.',
      'Réactif en cas de sinistre ou de question sur un contrat.',
      'Transparence sur les garanties, exclusions, plafonds et franchises.',
    ],
  },
  automation: {
    title: 'Un suivi clair du premier contact au contrat',
    body:
      'Le parcours digital accélère la demande, mais les décisions importantes restent expliquées et contrôlées par le conseiller.',
    cta: { label: 'Commencer une demande', href: `${basePath}/devis` },
    flow: ['Demande reçue', 'Analyse des besoins', 'Comparaison des garanties', 'Retour personnalisé'],
    summary: [
      { label: 'Clients accompagnés', value: '+500' },
      { label: 'Note moyenne', value: '4,9 / 5' },
      { label: 'Réponse', value: '24h ouvrées' },
    ],
  },
  faq: {
    title: 'Questions fréquentes',
    items: [
      {
        question: 'Quelle est la différence entre un agent et un courtier ?',
        answer:
          'Un agent travaille avec des partenaires identifiés et vous aide à comprendre les garanties disponibles. Le plus important est la transparence sur les solutions proposées.',
      },
      {
        question: 'Le devis est-il gratuit ?',
        answer:
          'Oui. La demande de devis est gratuite et sans engagement. Elle sert à cadrer votre besoin avant toute proposition.',
      },
      {
        question: 'Puis-je changer d’assurance en cours d’année ?',
        answer:
          'Dans de nombreux cas, la résiliation est possible selon la loi applicable et la date de souscription. Le conseiller vérifie votre situation avant de vous orienter.',
      },
      {
        question: 'Quels documents faut-il fournir ?',
        answer:
          'Cela dépend du contrat : relevé d’information, bail, tableau d’amortissement, attestation actuelle ou justificatifs spécifiques peuvent être demandés.',
      },
      {
        question: 'Que se passe-t-il en cas de sinistre ?',
        answer:
          'Vous êtes accompagné pour déclarer le sinistre, réunir les justificatifs et suivre les échanges avec l’assureur.',
      },
      {
        question: 'Cette démonstration envoie-t-elle mes données ?',
        answer:
          'Non. Les formulaires de ce template sont des exemples visuels et ne transmettent aucune donnée à un service externe.',
      },
    ],
  },
  final: {
    title: 'Prêt à protéger ce qui compte ?',
    body:
      'Un échange suffit pour clarifier vos garanties actuelles et repérer les protections manquantes.',
    actions: [
      { label: 'Demander un devis', href: `${basePath}/devis` },
      { label: 'Appeler maintenant', href: 'tel:+33123456789' },
    ],
  },
  aboutHero: {
    eyebrow: 'À propos',
    headline: 'Paul Clément',
    subline:
      'Un conseiller indépendant qui privilégie la clarté, la disponibilité et l’accompagnement dans la durée.',
    primaryCta: { label: 'Parler de votre situation', href: `${basePath}/contact` },
    secondaryCta: { label: 'Voir les avis clients', href: `${basePath}/avis` },
    image: {
      src: '/demo/assurance/paul-clement.jpg',
      alt: 'Portrait de Paul Clément, conseiller en assurance',
      width: 1200,
      height: 900,
    },
    trustBullets: ['Transparence totale', 'Disponibilité', 'Excellence de conseil'],
  },
  reviews: {
    title: 'Ce que disent mes clients',
    intro:
      'Les avis de cette démonstration illustrent les preuves sociales attendues pour un site vitrine de conseiller assurance.',
    cta: { label: 'Demander votre devis', href: `${basePath}/devis` },
    items: [
      {
        icon: 'search',
        title: 'Marie-Laure D.',
        description: 'Un accompagnement clair pour revoir mon assurance habitation et supprimer des garanties inutiles.',
      },
      {
        icon: 'search',
        title: 'Thomas C.',
        description: 'Réponse rapide, devis compréhensible et vraie pédagogie sur les franchises auto.',
      },
      {
        icon: 'search',
        title: 'Sophie R.',
        description: 'J’ai enfin compris les différences entre mutuelles sans avoir l’impression d’être poussée à signer.',
      },
    ],
  },
  contactHero: {
    eyebrow: 'Contact',
    headline: 'Contactez-moi',
    subline:
      'Une question, un contrat à relire ou un devis à préparer ? Laissez vos coordonnées ou appelez directement le cabinet.',
    primaryCta: { label: 'Demander un devis', href: `${basePath}/devis` },
    secondaryCta: { label: 'Appeler', href: 'tel:+33123456789' },
    image: {
      src: '/demo/assurance/homepage-mockup.png',
      alt: 'Visuel de marque Paul Clément Assurance',
      width: 1200,
      height: 900,
    },
    trustBullets: ['Paris et rendez-vous à distance', 'contact@paul-clement-assurance.fr', '01 23 45 67 89'],
  },
  legalHero: {
    eyebrow: 'Informations légales',
    headline: 'Mentions légales',
    subline:
      'Cette page reprend la structure attendue pour un site d’agent assurance, avec des données fictives adaptées à la démonstration.',
    primaryCta: { label: 'Retour à l’accueil', href: basePath },
    secondaryCta: { label: 'Contact', href: `${basePath}/contact` },
    image: {
      src: '/demo/assurance/homepage-mockup.png',
      alt: 'Visuel de marque pour les mentions légales Paul Clément Assurance',
      width: 1200,
      height: 900,
    },
    trustBullets: ['Éditeur du site', 'Responsabilité', 'Données personnelles'],
  },
  legal: {
    title: 'Cadre de démonstration',
    intro:
      'Les informations ci-dessous sont volontairement fictives et servent uniquement à montrer la structure d’une page légale.',
    cta: { label: 'Contacter le cabinet', href: `${basePath}/contact` },
    items: [
      {
        icon: 'search',
        title: 'Éditeur',
        description: 'Paul Clément Assurance, cabinet fictif présenté comme exemple de site vitrine.',
      },
      {
        icon: 'search',
        title: 'Certification',
        description: 'Le numéro ORIAS affiché dans cette démo est un placeholder et ne doit pas être publié en production.',
      },
      {
        icon: 'search',
        title: 'Données personnelles',
        description: 'Les formulaires de la démonstration ne transmettent aucune donnée à un service externe.',
      },
    ],
  },
  ...productContent,
} satisfies DemoContent & Record<string, DemoContent[keyof DemoContent]>

export const site: DemoSite = {
  slug: 'assurance',
  title: 'Paul Clément Assurance',
  subtitle: "Agent d'assurance indépendant",
  category: "Site vitrine pour agent d'assurance",
  description:
    'Demo template multi-page pour agent assurance : présentation, produits, devis, avis, FAQ et contact.',
  previewImage: {
    src: '/demo/assurance/paris-hero.jpg',
    alt: 'Page d’accueil Paul Clément Assurance',
    width: 1200,
    height: 900,
  },
  badge: 'Lead generation',
  niche: 'Assurance',
  phone: '01 23 45 67 89',
  phoneHref: 'tel:+33123456789',
  headerCta: { label: 'Devis gratuit', href: `${basePath}/devis` },
  nav: [
    { label: 'Accueil', href: basePath },
    { label: 'Assurances', href: `${basePath}#services` },
    { label: 'Devis', href: `${basePath}/devis` },
    { label: 'Avis', href: `${basePath}/avis` },
    { label: 'FAQ', href: `${basePath}/faq` },
    { label: 'Contact', href: `${basePath}/contact` },
  ],
  pages: [
    {
      slug: '',
      label: 'Accueil',
      title: 'Paul Clément - Agent d’assurance indépendant',
      description: 'Votre assurance sur mesure avec un agent indépendant de confiance.',
      sections: [
        { type: 'hero', contentKey: 'hero' },
        { type: 'services', contentKey: 'services' },
        { type: 'trust', contentKey: 'trust' },
        { type: 'process', contentKey: 'process' },
        { type: 'serviceArea', contentKey: 'area' },
        { type: 'automation', contentKey: 'automation' },
        { type: 'faq', contentKey: 'faq' },
        { type: 'finalCta', contentKey: 'final' },
      ],
    },
    {
      slug: 'devis',
      label: 'Devis',
      title: 'Demander un devis',
      description: 'Demandez votre devis assurance gratuit. Réponse personnalisée sous 24h.',
      sections: [
        { type: 'hero', contentKey: 'contactHero' },
        { type: 'urgentRequest', contentKey: 'request' },
        { type: 'process', contentKey: 'process' },
        { type: 'finalCta', contentKey: 'final' },
      ],
    },
    {
      slug: 'a-propos',
      label: 'À propos',
      title: 'Qui suis-je - Paul Clément',
      description: 'Découvrez Paul Clément, conseiller assurance indépendant.',
      sections: [
        { type: 'hero', contentKey: 'aboutHero' },
        { type: 'trust', contentKey: 'trust' },
        { type: 'finalCta', contentKey: 'final' },
      ],
    },
    {
      slug: 'avis',
      label: 'Avis',
      title: 'Avis clients',
      description: 'Témoignages clients pour le cabinet Paul Clément Assurance.',
      sections: [
        { type: 'services', contentKey: 'reviews' },
        { type: 'finalCta', contentKey: 'final' },
      ],
    },
    {
      slug: 'faq',
      label: 'FAQ',
      title: 'Questions fréquentes',
      description: 'Réponses aux questions fréquentes sur les assurances et les devis.',
      sections: [
        { type: 'faq', contentKey: 'faq' },
        { type: 'finalCta', contentKey: 'final' },
      ],
    },
    {
      slug: 'contact',
      label: 'Contact',
      title: 'Contact',
      description: 'Contactez Paul Clément Assurance.',
      sections: [
        { type: 'hero', contentKey: 'contactHero' },
        { type: 'urgentRequest', contentKey: 'request' },
        { type: 'finalCta', contentKey: 'final' },
      ],
    },
    {
      slug: 'mentions-legales',
      label: 'Mentions légales',
      title: 'Mentions légales',
      description: 'Informations légales de démonstration pour Paul Clément Assurance.',
      sections: [
        { type: 'hero', contentKey: 'legalHero' },
        { type: 'services', contentKey: 'legal' },
        { type: 'finalCta', contentKey: 'final' },
      ],
    },
    ...products.map((product): DemoSite['pages'][number] => ({
      slug: product.slug,
      label: product.label,
      title: product.title,
      description: product.description,
      sections: [
        { type: 'hero', contentKey: `${product.slug}Hero` },
        { type: 'services', contentKey: `${product.slug}Coverage` },
        { type: 'urgentRequest', contentKey: 'request' },
        { type: 'finalCta', contentKey: 'final' },
      ],
    })),
  ],
  footer: {
    description:
      'Template de démonstration pour un agent assurance indépendant : acquisition de leads, preuve sociale et parcours devis.',
    columns: [
      {
        title: 'Assurances',
        links: products.slice(0, 4).map((product) => ({ label: product.title, href: `${basePath}/${product.slug}` })),
      },
      {
        title: 'Cabinet',
        links: [
          { label: 'À propos', href: `${basePath}/a-propos` },
          { label: 'Avis clients', href: `${basePath}/avis` },
          { label: 'FAQ', href: `${basePath}/faq` },
          { label: 'Contact', href: `${basePath}/contact` },
        ],
      },
    ],
    certification: {
      title: 'Démonstration',
      items: ['ORIAS fictif', 'Aucune donnée transmise', 'Contenu adapté depuis le site source'],
    },
    copyright: '© Paul Clément Assurance - démonstration',
    legalLinks: [
      { label: 'Mentions légales', href: `${basePath}/mentions-legales` },
      { label: 'Devis', href: `${basePath}/devis` },
    ],
  },
  theme: {
    primary: '#12314D',
    primaryFg: '#F8FAFC',
    accent: '#D89B42',
    bg: '#F6F4EF',
    surface: '#FFFFFF',
    border: '#D8D0C2',
    font: { heading: 'Georgia, serif', body: 'Arial, sans-serif' },
    radius: 'md',
    sectionSpacing: 'normal',
    buttonStyle: 'solid',
    cardStyle: 'bordered',
    imageStyle: 'natural',
  },
}
